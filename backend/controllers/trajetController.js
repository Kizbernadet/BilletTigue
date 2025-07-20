const Trajet = require('../models/trajet');
const Transporteur = require('../models/transporteur');
const { Op } = require('sequelize');

// Créer un nouveau trajet (selon le modèle Trajet réel)
const createTrajet = async (req, res) => {
    try {
        const {
            departure_city,
            arrival_city,
            departure_time,
            departure_dates, // Nouveau: tableau de dates
            price,
            seats_count,
            available_seats,
            status,
            accepts_packages,
            max_package_weight,
            departure_point,
            arrival_point
        } = req.body;

        // Validation des champs obligatoires selon le modèle Trajet
        if (!departure_city || !arrival_city || !price || !seats_count) {
            return res.status(400).json({
                success: false,
                message: 'Les champs departure_city, arrival_city, price et seats_count sont obligatoires'
            });
        }

        // Vérifier qu'on a au moins une date (departure_time ou departure_dates)
        if (!departure_time && (!departure_dates || departure_dates.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Au moins une date de départ est requise (departure_time ou departure_dates)'
            });
        }

        // Récupérer l'ID du transporteur à partir du compte authentifié
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(403).json({
                success: false,
                message: 'Seuls les transporteurs peuvent créer des trajets'
            });
        }

        // Préparer les dates de départ
        let datesToProcess = [];
        
        if (departure_dates && departure_dates.length > 0) {
            // Utiliser le tableau de dates et les combiner avec l'heure
            datesToProcess = departure_dates.map(dateStr => {
                // Extraire l'heure de departure_time (format HH:MM)
                const timeParts = departure_time.split(':');
                const hours = parseInt(timeParts[0]);
                const minutes = parseInt(timeParts[1]);
                
                // Créer une nouvelle date avec la date et l'heure
                const dateTime = new Date(dateStr);
                dateTime.setHours(hours, minutes, 0, 0);
                
                return dateTime;
            });
        } else if (departure_time) {
            // Utiliser la date unique
            datesToProcess = [new Date(departure_time)];
        }

        // Vérifier que toutes les dates sont dans le futur
        const now = new Date();
        for (const date of datesToProcess) {
            if (date <= now) {
                return res.status(400).json({
                    success: false,
                    message: `La date de départ ${date.toISOString()} doit être dans le futur`
                });
            }
        }

        // Validation des valeurs numériques
        const parsedPrice = parseFloat(price);
        const parsedSeatsCount = parseInt(seats_count);
        const parsedAvailableSeats = available_seats ? parseInt(available_seats) : parsedSeatsCount;

        if (parsedPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Le prix doit être supérieur à 0'
            });
        }

        if (parsedSeatsCount <= 0 || parsedSeatsCount > 50) {
            return res.status(400).json({
                success: false,
                message: 'Le nombre de places doit être entre 1 et 50'
            });
        }

        if (parsedAvailableSeats < 0 || parsedAvailableSeats > parsedSeatsCount) {
            return res.status(400).json({
                success: false,
                message: 'Les places disponibles doivent être entre 0 et le nombre total de places'
            });
        }

        // Validation du poids des colis si acceptés
        let parsedMaxPackageWeight = null;
        if (accepts_packages && max_package_weight) {
            parsedMaxPackageWeight = parseFloat(max_package_weight);
            if (parsedMaxPackageWeight < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le poids maximum des colis ne peut pas être négatif'
                });
            }
        }

        // Créer les trajets pour chaque date
        const trajetsCrees = [];
        
        for (const departureDateTime of datesToProcess) {
            const trajet = await Trajet.create({
                departure_city,
                arrival_city,
                departure_time: departureDateTime,
                price: parsedPrice,
                seats_count: parsedSeatsCount,
                available_seats: parsedAvailableSeats,
                status: status || 'active',
                accepts_packages: accepts_packages || false,
                max_package_weight: parsedMaxPackageWeight,
                departure_point: departure_point || null,
                arrival_point: arrival_point || null,
                transporteur_id: transporteur.id
            });
            
            trajetsCrees.push(trajet);
        }

        const message = trajetsCrees.length === 1 
            ? 'Trajet créé avec succès' 
            : `${trajetsCrees.length} trajets créés avec succès`;

        res.status(201).json({
            success: true,
            message: message,
            data: trajetsCrees,
            count: trajetsCrees.length
        });

    } catch (error) {
        console.error('Erreur lors de la création du trajet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

// Récupérer tous les trajets (avec filtres optionnels)
const getAllTrajets = async (req, res) => {
    try {
        const {
            departure_city,
            arrival_city, 
            departure_date,
            villeDepart,      // Support ancien format pour compatibilité
            villeArrivee,     // Support ancien format pour compatibilité
            dateDepart,       // Support ancien format pour compatibilité
            status,
            statut,           // Support ancien format pour compatibilité
            accepts_packages,
            accepteColis,     // Support ancien format pour compatibilité
            page = 1,
            limit = 10
        } = req.query;

        // Construire les conditions de filtrage avec les vrais noms de champs
        const whereClause = {
            status: { [Op.ne]: 'cancelled' }, // Exclure les trajets annulés par défaut
            // Exclure automatiquement les trajets expirés (date passée)
            departure_time: {
                [Op.gt]: new Date() // Seulement les trajets avec une date de départ dans le futur
            }
        };

        // Support des anciens et nouveaux noms de paramètres
        const departureCity = departure_city || villeDepart;
        const arrivalCity = arrival_city || villeArrivee;
        const departureDate = departure_date || dateDepart;
        const trajetStatus = status || statut;
        const acceptsPackages = accepts_packages || accepteColis;

        if (departureCity) {
            whereClause.departure_city = { [Op.iLike]: `%${departureCity}%` };
        }

        if (arrivalCity) {
            whereClause.arrival_city = { [Op.iLike]: `%${arrivalCity}%` };
        }

        if (departureDate) {
            const dateDepartObj = new Date(departureDate);
            whereClause.departure_time = {
                [Op.gte]: dateDepartObj
            };
        }

        if (trajetStatus) {
            whereClause.status = trajetStatus;
        }

        if (acceptsPackages !== undefined) {
            whereClause.accepts_packages = acceptsPackages === 'true';
        }

        // Pagination
        const offset = (page - 1) * limit;

        const trajets = await Trajet.findAndCountAll({
            where: whereClause,
            include: [{
                model: Transporteur,
                as: 'transporteur',
                attributes: ['id', 'company_name', 'company_type', 'phone_number']
            }],
            order: [['departure_time', 'ASC']],
            limit: parseInt(limit),
            offset: offset
        });

        res.status(200).json({
            success: true,
            message: 'Trajets récupérés avec succès',
            data: trajets.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(trajets.count / limit),
                totalItems: trajets.count,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des trajets:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

// Récupérer un trajet par ID
const getTrajetById = async (req, res) => {
    try {
        const { id } = req.params;

        const trajet = await Trajet.findByPk(id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Trajet récupéré avec succès',
            data: trajet
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du trajet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

// Récupérer les trajets d'un transporteur
const getTrajetsByTransporteur = async (req, res) => {
    try {
        // Récupérer l'ID du transporteur à partir du compte authentifié
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(403).json({
                success: false,
                message: 'Seuls les transporteurs peuvent accéder à cette ressource'
            });
        }

        const trajets = await Trajet.findAll({
            where: { transporteur_id: transporteur.id },
            order: [['departure_time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Trajets du transporteur récupérés avec succès',
            data: trajets
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des trajets du transporteur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

// Mettre à jour un trajet
const updateTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Récupérer l'ID du transporteur à partir du compte authentifié
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(403).json({
                success: false,
                message: 'Seuls les transporteurs peuvent modifier des trajets'
            });
        }

        // Vérifier que le trajet existe
        const trajet = await Trajet.findByPk(id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé'
            });
        }

        // Vérifier que le transporteur est propriétaire du trajet
        if (trajet.transporteur_id !== transporteur.id) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à modifier ce trajet'
            });
        }

        // Empêcher la modification si le trajet est en cours ou terminé
        if (trajet.status === 'started' || trajet.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Impossible de modifier un trajet en cours ou terminé'
            });
        }

        // Mettre à jour le trajet
        await trajet.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Trajet mis à jour avec succès',
            data: trajet
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du trajet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

// Supprimer un trajet (annulation logique)
const deleteTrajet = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer l'ID du transporteur à partir du compte authentifié
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(403).json({
                success: false,
                message: 'Seuls les transporteurs peuvent supprimer des trajets'
            });
        }

        // Vérifier que le trajet existe
        const trajet = await Trajet.findByPk(id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé'
            });
        }

        // Vérifier que le transporteur est propriétaire du trajet
        if (trajet.transporteur_id !== transporteur.id) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à supprimer ce trajet'
            });
        }

        // Annulation logique au lieu de suppression physique
        await trajet.update({ status: 'cancelled' });

        res.status(200).json({
            success: true,
            message: 'Trajet annulé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression du trajet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

/**
 * Autocomplete des villes basé sur les trajets existants
 * GET /api/cities/suggestions?q=dak
 */
async function getCitySuggestions(req, res) {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez saisir au moins 2 caractères'
            });
        }

        console.log(`🔍 Recherche suggestions villes pour: "${q}"`);

        // Recherche dans les villes de départ et d'arrivée
        const [departureCities, arrivalCities] = await Promise.all([
            Trajet.findAll({
                attributes: ['departure_city'],
                where: {
                    departure_city: {
                        [Op.iLike]: `%${q}%`
                    },
                    status: {
                        [Op.in]: ['active', 'scheduled', 'pending']
                    }
                },
                group: ['departure_city'],
                limit: 5,
                raw: true
            }),
            Trajet.findAll({
                attributes: ['arrival_city'],
                where: {
                    arrival_city: {
                        [Op.iLike]: `%${q}%`
                    },
                    status: {
                        [Op.in]: ['active', 'scheduled', 'pending']
                    }
                },
                group: ['arrival_city'],
                limit: 5,
                raw: true
            })
        ]);

        // Fusionner et dédupliquer les résultats
        const allCities = [
            ...departureCities.map(city => city.departure_city),
            ...arrivalCities.map(city => city.arrival_city)
        ];

        const uniqueCities = [...new Set(allCities)]
            .filter(city => city.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 10)
            .sort();

        console.log(`✅ ${uniqueCities.length} suggestions trouvées`);

        return res.status(200).json({
            success: true,
            data: {
                query: q,
                suggestions: uniqueCities
            },
            message: `${uniqueCities.length} suggestions trouvées`
        });

    } catch (error) {
        console.error('❌ Erreur autocomplete villes:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche de suggestions',
            error: error.message
        });
    }
}

/**
 * Recherche de trajets avec critères et pagination
 * POST /api/trajets/search
 */
async function searchTrajets(req, res) {
    try {
        const { departure_city, arrival_city, travel_date, passengers_count, page = 1 } = req.body;

        // Validation des paramètres obligatoires
        if (!departure_city || !arrival_city || !travel_date || !passengers_count) {
            return res.status(400).json({
                success: false,
                message: 'Ville de départ, ville d\'arrivée, date et nombre de passagers sont obligatoires'
            });
        }

        if (passengers_count < 1 || passengers_count > 50) {
            return res.status(400).json({
                success: false,
                message: 'Le nombre de passagers doit être entre 1 et 50'
            });
        }

        console.log(`🔍 Recherche trajets: ${departure_city} → ${arrival_city}, ${travel_date}, ${passengers_count} passagers`);

        const requestedDate = new Date(travel_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({
                success: false,
                message: 'La date de voyage ne peut pas être dans le passé'
            });
        }

        let trajets = [];
        let searchExtended = false;
        let dateRange = { from: travel_date, to: travel_date };

        // 1. Recherche exacte sur la date demandée
        trajets = await searchTrajetsWithCriteria(
            departure_city, 
            arrival_city, 
            requestedDate, 
            requestedDate, 
            passengers_count, 
            page
        );

        // 2. Si aucun résultat, étendre à ±1 jour
        if (trajets.count === 0) {
            console.log('📅 Aucun résultat pour la date exacte, extension ±1 jour...');
            const dayBefore = new Date(requestedDate);
            dayBefore.setDate(dayBefore.getDate() - 1);
            const dayAfter = new Date(requestedDate);
            dayAfter.setDate(dayAfter.getDate() + 1);

            trajets = await searchTrajetsWithCriteria(
                departure_city, 
                arrival_city, 
                dayBefore, 
                dayAfter, 
                passengers_count, 
                page
            );

            if (trajets.count > 0) {
                searchExtended = true;
                dateRange = { 
                    from: dayBefore.toISOString().split('T')[0], 
                    to: dayAfter.toISOString().split('T')[0] 
                };
            }
        }

        // 3. Si toujours aucun résultat, étendre à ±3 jours
        if (trajets.count === 0) {
            console.log('📅 Aucun résultat ±1 jour, extension ±3 jours...');
            const threeDaysBefore = new Date(requestedDate);
            threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
            const threeDaysAfter = new Date(requestedDate);
            threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

            trajets = await searchTrajetsWithCriteria(
                departure_city, 
                arrival_city, 
                threeDaysBefore, 
                threeDaysAfter, 
                passengers_count, 
                page
            );

            if (trajets.count > 0) {
                searchExtended = true;
                dateRange = { 
                    from: threeDaysBefore.toISOString().split('T')[0], 
                    to: threeDaysAfter.toISOString().split('T')[0] 
                };
            }
        }

        // Formater les résultats pour l'affichage
        const formattedTrajets = trajets.rows.map(trajet => ({
            id: trajet.id,
            departure_city: trajet.departure_city,
            arrival_city: trajet.arrival_city,
            departure_date: trajet.departure_time.toISOString().split('T')[0],
            departure_time: trajet.departure_time.toTimeString().split(' ')[0].substring(0, 5),
            price: trajet.price,
            available_seats: trajet.available_seats,
            total_seats: trajet.seats_count,
            accepts_packages: trajet.accepts_packages,
            max_package_weight: trajet.max_package_weight,
            transporteur: {
                id: trajet.transporteur.id,
                company_name: trajet.transporteur.company_name,
                company_type: trajet.transporteur.company_type,
                phone_number: trajet.transporteur.phone_number
            },
            compatibility: {
                exact_date: !searchExtended && trajet.departure_time.toISOString().split('T')[0] === travel_date,
                enough_seats: trajet.available_seats >= passengers_count
            }
        }));

        const perPage = 10;
        const totalPages = Math.ceil(trajets.count / perPage);

        console.log(`✅ ${trajets.count} trajets trouvés (page ${page}/${totalPages})`);

        return res.status(200).json({
            success: true,
            data: {
                search_info: {
                    departure_city,
                    arrival_city,
                    requested_date: travel_date,
                    passengers_count,
                    search_extended: searchExtended,
                    date_range: dateRange
                },
                pagination: {
                    page: parseInt(page),
                    per_page: perPage,
                    total: trajets.count,
                    total_pages: totalPages
                },
                trajets: formattedTrajets
            },
            message: trajets.count === 0 
                ? 'Aucun trajet trouvé pour ces critères'
                : `${trajets.count} trajet${trajets.count > 1 ? 's' : ''} trouvé${trajets.count > 1 ? 's' : ''}`
        });

    } catch (error) {
        console.error('❌ Erreur recherche trajets:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche de trajets',
            error: error.message
        });
    }
}

/**
 * Fonction helper pour rechercher des trajets avec critères
 */
async function searchTrajetsWithCriteria(departure_city, arrival_city, startDate, endDate, passengers_count, page = 1) {
    const perPage = 10;
    const offset = (page - 1) * perPage;

    // Ajuster les dates pour couvrir toute la journée
    const searchStartDate = new Date(startDate);
    searchStartDate.setHours(0, 0, 0, 0);
    
    const searchEndDate = new Date(endDate);
    searchEndDate.setHours(23, 59, 59, 999);

    return await Trajet.findAndCountAll({
        where: {
            departure_city: {
                [Op.iLike]: departure_city.trim()
            },
            arrival_city: {
                [Op.iLike]: arrival_city.trim()
            },
            departure_time: {
                [Op.between]: [searchStartDate, searchEndDate]
            },
            available_seats: {
                [Op.gte]: passengers_count
            },
            status: {
                [Op.in]: ['active', 'scheduled', 'pending']
            }
        },
        include: [{
            model: Transporteur,
            as: 'transporteur',
            attributes: ['id', 'company_name', 'company_type', 'phone_number']
        }],
        order: [['departure_time', 'ASC']],
        limit: perPage,
        offset: offset
    });
}

/**
 * Obtenir les détails d'un trajet spécifique
 * GET /api/trajets/:id
 */
async function getTrajetDetails(req, res) {
    try {
        const { id } = req.params;

        console.log(`🔍 Récupération détails trajet ID: ${id}`);

        const trajet = await Trajet.findByPk(id, {
            include: [{
                model: Transporteur,
                as: 'transporteur',
                attributes: ['id', 'company_name', 'company_type', 'phone_number']
            }]
        });

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé'
            });
        }

        // Formater la réponse
        const formattedTrajet = {
            id: trajet.id,
            departure_city: trajet.departure_city,
            arrival_city: trajet.arrival_city,
            departure_point: trajet.departure_point,
            arrival_point: trajet.arrival_point,
            departure_date: trajet.departure_time.toISOString().split('T')[0],
            departure_time: trajet.departure_time.toTimeString().split(' ')[0].substring(0, 5),
            price: trajet.price,
            available_seats: trajet.available_seats,
            total_seats: trajet.seats_count,
            accepts_packages: trajet.accepts_packages,
            max_package_weight: trajet.max_package_weight,
            status: trajet.status,
            transporteur: {
                id: trajet.transporteur.id,
                company_name: trajet.transporteur.company_name,
                company_type: trajet.transporteur.company_type,
                phone_number: trajet.transporteur.phone_number
            },
            created_at: trajet.created_at,
            updated_at: trajet.updated_at
        };

        console.log(`✅ Détails trajet récupérés pour ${trajet.departure_city} → ${trajet.arrival_city}`);

        return res.status(200).json({
            success: true,
            data: formattedTrajet,
            message: 'Détails du trajet récupérés avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur récupération détails trajet:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des détails du trajet',
            error: error.message
        });
    }
}

module.exports = {
    createTrajet,
    getAllTrajets,
    getTrajetById,
    getTrajetsByTransporteur,
    updateTrajet,
    deleteTrajet,
    getCitySuggestions,
    searchTrajets,
    getTrajetDetails
}; 