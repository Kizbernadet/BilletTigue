const Trajet = require('../models/trajet');
const { Op } = require('sequelize');

// Créer un nouveau trajet
const createTrajet = async (req, res) => {
    try {
        const {
            villeDepart,
            villeArrivee,
            dateDepart,
            heureDepart,
            prix,
            nombrePlaces,
            description,
            typeVehicule,
            accepteColis,
            poidsMaxColis,
            prixColis,
            pointDepart,
            pointArrivee,
            conditions
        } = req.body;

        // Validation des champs obligatoires
        if (!villeDepart || !villeArrivee || !dateDepart || !heureDepart || !prix || !nombrePlaces) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        // Vérifier que la date de départ est dans le futur
        const dateDepartObj = new Date(dateDepart);
        if (dateDepartObj <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'La date de départ doit être dans le futur'
            });
        }

        // Créer le trajet
        const trajet = await Trajet.create({
            idCompte: req.user.idCompte, // Récupéré du middleware d'authentification
            villeDepart,
            villeArrivee,
            dateDepart: dateDepartObj,
            heureDepart,
            prix: parseFloat(prix),
            nombrePlaces: parseInt(nombrePlaces),
            placesDisponibles: parseInt(nombrePlaces),
            description,
            typeVehicule: typeVehicule || 'bus',
            accepteColis: accepteColis || false,
            poidsMaxColis: accepteColis ? parseFloat(poidsMaxColis) : null,
            prixColis: accepteColis ? parseFloat(prixColis) : null,
            pointDepart,
            pointArrivee,
            conditions
        });

        res.status(201).json({
            success: true,
            message: 'Trajet créé avec succès',
            data: trajet
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
            villeDepart,
            villeArrivee,
            dateDepart,
            statut,
            typeVehicule,
            accepteColis,
            page = 1,
            limit = 10
        } = req.query;

        // Construire les conditions de filtrage
        const whereClause = {
            statut: { [Op.ne]: 'annulé' } // Exclure les trajets annulés par défaut
        };

        if (villeDepart) {
            whereClause.villeDepart = { [Op.iLike]: `%${villeDepart}%` };
        }

        if (villeArrivee) {
            whereClause.villeArrivee = { [Op.iLike]: `%${villeArrivee}%` };
        }

        if (dateDepart) {
            const dateDepartObj = new Date(dateDepart);
            whereClause.dateDepart = {
                [Op.gte]: dateDepartObj
            };
        }

        if (statut) {
            whereClause.statut = statut;
        }

        if (typeVehicule) {
            whereClause.typeVehicule = typeVehicule;
        }

        if (accepteColis !== undefined) {
            whereClause.accepteColis = accepteColis === 'true';
        }

        // Pagination
        const offset = (page - 1) * limit;

        const trajets = await Trajet.findAndCountAll({
            where: whereClause,
            order: [['dateDepart', 'ASC']],
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
        const idCompte = req.user.idCompte;

        const trajets = await Trajet.findAll({
            where: { idCompte },
            order: [['dateDepart', 'DESC']]
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

        // Vérifier que le trajet existe
        const trajet = await Trajet.findByPk(id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé'
            });
        }

        // Vérifier que le transporteur est propriétaire du trajet
        if (trajet.idCompte !== req.user.idCompte) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à modifier ce trajet'
            });
        }

        // Empêcher la modification si le trajet est en cours ou terminé
        if (trajet.statut === 'en_cours' || trajet.statut === 'terminé') {
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

        // Vérifier que le trajet existe
        const trajet = await Trajet.findByPk(id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé'
            });
        }

        // Vérifier que le transporteur est propriétaire du trajet
        if (trajet.idCompte !== req.user.idCompte) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à supprimer ce trajet'
            });
        }

        // Annulation logique au lieu de suppression physique
        await trajet.update({ statut: 'annulé' });

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

module.exports = {
    createTrajet,
    getAllTrajets,
    getTrajetById,
    getTrajetsByTransporteur,
    updateTrajet,
    deleteTrajet
}; 