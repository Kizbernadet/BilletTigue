/**
 * Nom du fichier : reservationService.js
 * Description : Service métier pour la gestion des réservations de trajets
 * Rôle : Service (logique métier pure, sans gestion HTTP)
 */

const { Reservation, Trajet, Transporteur, Compte, Paiement } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// ========== FONCTIONS HELPER - VALIDATION ET VÉRIFICATIONS ==========

/**
 * Fonction : validateReservationData
 * Description : Valide les données d'entrée pour une réservation
 * Paramètres :
 * - data (object) : { trajet_id, seats_reserved, passenger_first_name, passenger_last_name, phone_number }
 * Retour : (object) Données validées ou lève une erreur
 */
function validateReservationData(data) {
    const {
        trajet_id,
        seats_reserved = 1,
        passenger_first_name,
        passenger_last_name,
        phone_number
    } = data;

    // Validation des champs obligatoires
    if (!trajet_id || !passenger_first_name || !passenger_last_name || !phone_number) {
        throw new Error('Les champs trajet_id, passenger_first_name, passenger_last_name et phone_number sont obligatoires');
    }

    // Validation du nombre de places
    const seatsRequested = parseInt(seats_reserved);
    if (isNaN(seatsRequested) || seatsRequested <= 0 || seatsRequested > 10) {
        throw new Error('Le nombre de places doit être entre 1 et 10');
    }

    // Validation du format du nom et prénom
    if (passenger_first_name.trim().length < 2 || passenger_last_name.trim().length < 2) {
        throw new Error('Le nom et prénom doivent contenir au moins 2 caractères');
    }

    // Validation du numéro de téléphone (format basique)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    if (!phoneRegex.test(phone_number.trim())) {
        throw new Error('Format de numéro de téléphone invalide');
    }

    return {
        trajet_id: parseInt(trajet_id),
        seats_reserved: seatsRequested,
        passenger_first_name: passenger_first_name.trim(),
        passenger_last_name: passenger_last_name.trim(),
        phone_number: phone_number.trim()
    };
}

/**
 * Fonction : checkTrajetAvailability
 * Description : Vérifie qu'un trajet existe, est actif et a des places disponibles
 * Paramètres :
 * - trajetId (number) : ID du trajet
 * - seatsRequested (number) : Nombre de places demandées
 * - transaction (object) : Transaction Sequelize
 * Retour : (Promise<object>) Objet trajet ou lève une erreur
 */
async function checkTrajetAvailability(trajetId, seatsRequested, transaction) {
    // Récupérer le trajet avec verrouillage pour éviter les conflits
    const trajet = await Trajet.findByPk(trajetId, {
        include: [{
            model: Transporteur,
            as: 'transporteur',
            attributes: ['id', 'company_name', 'company_type']
        }],
        lock: true, // Verrouillage pour éviter les réservations simultanées
        transaction
    });

    if (!trajet) {
        throw new Error('Trajet introuvable');
    }

    // Vérifier que le trajet est actif
    if (trajet.status !== 'active') {
        throw new Error('Ce trajet n\'est plus disponible à la réservation');
    }

    // Vérifier que le trajet n'est pas dans le passé
    if (new Date(trajet.departure_time) <= new Date()) {
        throw new Error('Impossible de réserver un trajet déjà parti');
    }

    // Vérifier la disponibilité des places
    if (trajet.available_seats < seatsRequested) {
        throw new Error(`Plus assez de places disponibles. Places restantes: ${trajet.available_seats}`);
    }

    return trajet;
}

/**
 * Fonction : checkUserExistingReservation
 * Description : Vérifie qu'un utilisateur n'a pas déjà réservé ce trajet
 * Paramètres :
 * - userId (number) : ID de l'utilisateur
 * - trajetId (number) : ID du trajet
 * - transaction (object) : Transaction Sequelize
 * Retour : (Promise<void>) Lève une erreur si réservation existante
 */
async function checkUserExistingReservation(userId, trajetId, transaction) {
    const existingReservation = await Reservation.findOne({
        where: {
            compte_id: userId,
            trajet_id: trajetId,
            status: { [Op.in]: ['pending', 'confirmed'] }
        },
        transaction
    });

    if (existingReservation) {
        throw new Error('Vous avez déjà une réservation active pour ce trajet');
    }
}

/**
 * Fonction : calculateReservationAmount
 * Description : Calcule le montant total d'une réservation
 * Paramètres :
 * - trajetPrice (number) : Prix unitaire du trajet
 * - seatsRequested (number) : Nombre de places
 * Retour : (number) Montant total
 */
function calculateReservationAmount(trajetPrice, seatsRequested) {
    const price = parseFloat(trajetPrice);
    const seats = parseInt(seatsRequested);
    
    if (isNaN(price) || price <= 0) {
        throw new Error('Prix du trajet invalide');
    }
    
    if (isNaN(seats) || seats <= 0) {
        throw new Error('Nombre de places invalide');
    }
    
    return price * seats;
}

/**
 * Fonction : checkCancellationPolicy
 * Description : Vérifie si une réservation peut être annulée selon la politique
 * Paramètres :
 * - departureTime (Date) : Heure de départ du trajet
 * - cancellationHours (number) : Nombre d'heures minimum avant le départ (défaut: 2)
 * Retour : (boolean) true si annulation possible, sinon lève une erreur
 */
function checkCancellationPolicy(departureTime, cancellationHours = 2) {
    const now = new Date();
    const departure = new Date(departureTime);
    const timeDifference = departure.getTime() - now.getTime();
    const hoursUntilDeparture = timeDifference / (1000 * 3600);

    if (hoursUntilDeparture < cancellationHours) {
        throw new Error(`Impossible d'annuler moins de ${cancellationHours} heures avant le départ`);
    }

    return true;
}

// ========== FONCTIONS MÉTIER PRINCIPALES ==========

/**
 * Fonction : createReservation
 * Description : Créer une nouvelle réservation avec paiement associé
 * Paramètres :
 * - data (object) : Données de la réservation
 * - userId (number) : ID de l'utilisateur connecté
 * Retour : (Promise<object>) Réservation créée avec informations de paiement
 */
async function createReservation(data, userId) {
    const transaction = await sequelize.transaction();
    
    try {
        // 1. Validation des données
        const validatedData = validateReservationData(data);

        // 2. Vérification de la disponibilité du trajet
        const trajet = await checkTrajetAvailability(
            validatedData.trajet_id, 
            validatedData.seats_reserved, 
            transaction
        );

        // 3. Vérification des réservations existantes de l'utilisateur
        await checkUserExistingReservation(userId, validatedData.trajet_id, transaction);

        // 4. Calcul du montant total
        const totalAmount = calculateReservationAmount(trajet.price, validatedData.seats_reserved);

        // 5. Création de la réservation
        const reservation = await Reservation.create({
            trajet_id: validatedData.trajet_id,
            compte_id: userId,
            seats_reserved: validatedData.seats_reserved,
            passenger_first_name: validatedData.passenger_first_name,
            passenger_last_name: validatedData.passenger_last_name,
            phone_number: validatedData.phone_number,
            status: 'pending', // En attente de paiement
            reservation_date: new Date()
        }, { transaction });

        // 6. Création du paiement associé
        const paiement = await Paiement.create({
            reservation_id: reservation.id,
            amount: totalAmount,
            status: 'pending', // En attente
            payment_date: new Date()
        }, { transaction });

        // 7. Réservation temporaire des places (décrémenter available_seats)
        await trajet.update({
            available_seats: trajet.available_seats - validatedData.seats_reserved
        }, { transaction });

        // 8. Valider la transaction
        await transaction.commit();

        // 9. Récupérer la réservation complète avec les relations
        const reservationComplete = await Reservation.findByPk(reservation.id, {
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    include: [{
                        model: Transporteur,
                        as: 'transporteur',
                        attributes: ['company_name', 'company_type', 'phone_number']
                    }]
                },
                {
                    model: Paiement,
                    as: 'paiement',
                    attributes: ['id', 'amount', 'status']
                }
            ]
        });

        return {
            reservation: reservationComplete,
            next_step: 'payment',
            payment_info: {
                amount: totalAmount,
                currency: 'FCFA',
                payment_id: paiement.id
            }
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

/**
 * Fonction : getUserReservations
 * Description : Récupérer les réservations d'un utilisateur avec filtres et pagination
 * Paramètres :
 * - userId (number) : ID de l'utilisateur
 * - filters (object) : { status?, page?, limit? }
 * Retour : (Promise<object>) Liste paginée des réservations
 */
async function getUserReservations(userId, filters = {}) {
    const {
        status,
        page = 1,
        limit = 10
    } = filters;

    // Construire les conditions de filtrage
    const whereClause = {
        compte_id: userId
    };

    if (status) {
        whereClause.status = status;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const reservations = await Reservation.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: Trajet,
                as: 'trajet',
                include: [{
                    model: Transporteur,
                    as: 'transporteur',
                    attributes: ['company_name', 'company_type', 'phone_number']
                }]
            },
            {
                model: Paiement,
                as: 'paiement',
                attributes: ['id', 'amount', 'status', 'payment_date']
            }
        ],
        order: [['reservation_date', 'DESC']],
        limit: parseInt(limit),
        offset: offset
    });

    return {
        reservations: reservations.rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(reservations.count / limit),
            totalItems: reservations.count,
            itemsPerPage: parseInt(limit)
        }
    };
}

/**
 * Fonction : getReservationById
 * Description : Récupérer une réservation spécifique par son ID
 * Paramètres :
 * - reservationId (number) : ID de la réservation
 * - userId (number) : ID de l'utilisateur (pour vérification de propriété)
 * Retour : (Promise<object>) Détails de la réservation
 */
async function getReservationById(reservationId, userId) {
    const reservation = await Reservation.findOne({
        where: {
            id: reservationId,
            compte_id: userId // Sécurité : seul le propriétaire peut voir sa réservation
        },
        include: [
            {
                model: Trajet,
                as: 'trajet',
                include: [{
                    model: Transporteur,
                    as: 'transporteur',
                    attributes: ['company_name', 'company_type', 'phone_number']
                }]
            },
            {
                model: Paiement,
                as: 'paiement'
            },
            {
                model: Compte,
                as: 'compte',
                attributes: ['email']
            }
        ]
    });

    if (!reservation) {
        throw new Error('Réservation introuvable');
    }

    return reservation;
}

/**
 * Fonction : cancelReservation
 * Description : Annuler une réservation et libérer les places
 * Paramètres :
 * - reservationId (number) : ID de la réservation
 * - userId (number) : ID de l'utilisateur
 * Retour : (Promise<object>) Informations sur l'annulation et le remboursement
 */
async function cancelReservation(reservationId, userId) {
    const transaction = await sequelize.transaction();
    
    try {
        // 1. Récupérer la réservation avec le trajet
        const reservation = await Reservation.findOne({
            where: {
                id: reservationId,
                compte_id: userId
            },
            include: [{
                model: Trajet,
                as: 'trajet'
            }],
            lock: true,
            transaction
        });

        if (!reservation) {
            throw new Error('Réservation introuvable');
        }

        // 2. Vérifier que la réservation peut être annulée
        if (reservation.status === 'cancelled') {
            throw new Error('Cette réservation est déjà annulée');
        }

        // 3. Vérifier la politique d'annulation
        checkCancellationPolicy(reservation.trajet.departure_time);

        // 4. Annuler la réservation
        await reservation.update({
            status: 'cancelled'
        }, { transaction });

        // 5. Libérer les places dans le trajet
        await reservation.trajet.update({
            available_seats: reservation.trajet.available_seats + reservation.seats_reserved
        }, { transaction });

        // 6. Annuler le paiement s'il existe
        const paiement = await Paiement.findOne({
            where: { reservation_id: reservation.id },
            transaction
        });

        let refundInfo = null;
        if (paiement && paiement.status !== 'cancelled') {
            await paiement.update({
                status: 'cancelled'
            }, { transaction });

            refundInfo = {
                amount: paiement.amount,
                status: 'processing',
                message: 'Remboursement en cours de traitement'
            };
        }

        await transaction.commit();

        return {
            reservation_id: reservation.id,
            status: 'cancelled',
            refund_info: refundInfo
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

/**
 * Fonction : confirmPayment
 * Description : Confirmer le paiement et finaliser la réservation
 * Paramètres :
 * - reservationId (number) : ID de la réservation
 * - userId (number) : ID de l'utilisateur
 * - paymentData (object) : { payment_method?, transaction_id? }
 * Retour : (Promise<object>) Réservation confirmée
 */
async function confirmPayment(reservationId, userId, paymentData = {}) {
    const transaction = await sequelize.transaction();
    
    try {
        // 1. Récupérer la réservation avec le paiement
        const reservation = await Reservation.findOne({
            where: {
                id: reservationId,
                compte_id: userId
            },
            include: [{
                model: Paiement,
                as: 'paiement'
            }],
            lock: true,
            transaction
        });

        if (!reservation) {
            throw new Error('Réservation introuvable');
        }

        if (reservation.status !== 'pending') {
            throw new Error('Cette réservation ne peut plus être confirmée');
        }

        if (!reservation.paiement) {
            throw new Error('Aucun paiement associé à cette réservation');
        }

        // 2. Confirmer le paiement
        await reservation.paiement.update({
            status: 'completed',
            payment_date: new Date()
        }, { transaction });

        // 3. Confirmer la réservation
        await reservation.update({
            status: 'confirmed'
        }, { transaction });

        await transaction.commit();

        // 4. Récupérer la réservation mise à jour
        const confirmedReservation = await Reservation.findByPk(reservation.id, {
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    include: [{
                        model: Transporteur,
                        as: 'transporteur',
                        attributes: ['company_name', 'phone_number']
                    }]
                },
                {
                    model: Paiement,
                    as: 'paiement'
                }
            ]
        });

        return confirmedReservation;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

/**
 * Fonction : getReservationStats
 * Description : Calculer les statistiques des réservations
 * Paramètres :
 * - filters (object) : { period?, transporteur_id?, role?, userId? }
 * Retour : (Promise<object>) Statistiques détaillées
 */
async function getReservationStats(filters = {}) {
    const { period = '30d', transporteur_id, role, userId } = filters;

    // Calculer la date de début selon la période
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
        case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
        case '30d':
            startDate.setDate(endDate.getDate() - 30);
            break;
        case '90d':
            startDate.setDate(endDate.getDate() - 90);
            break;
        case '1y':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        default:
            startDate.setDate(endDate.getDate() - 30);
    }

    // Construire les conditions
    const whereClause = {
        reservation_date: {
            [Op.between]: [startDate, endDate]
        }
    };

    // Filtrage par transporteur
    let trajetWhere = {};
    if (transporteur_id) {
        trajetWhere.transporteur_id = transporteur_id;
    } else if (role === 'transporteur' && userId) {
        // Récupérer l'ID du transporteur connecté
        const transporteur = await Transporteur.findOne({
            where: { compte_id: userId }
        });
        if (transporteur) {
            trajetWhere.transporteur_id = transporteur.id;
        }
    }

    // Statistiques globales
    const [totalReservations, confirmedReservations, cancelledReservations, pendingReservations] = await Promise.all([
        Reservation.count({
            where: whereClause,
            include: Object.keys(trajetWhere).length > 0 ? [{
                model: Trajet,
                as: 'trajet',
                where: trajetWhere
            }] : []
        }),
        Reservation.count({
            where: { ...whereClause, status: 'confirmed' },
            include: Object.keys(trajetWhere).length > 0 ? [{
                model: Trajet,
                as: 'trajet',
                where: trajetWhere
            }] : []
        }),
        Reservation.count({
            where: { ...whereClause, status: 'cancelled' },
            include: Object.keys(trajetWhere).length > 0 ? [{
                model: Trajet,
                as: 'trajet',
                where: trajetWhere
            }] : []
        }),
        Reservation.count({
            where: { ...whereClause, status: 'pending' },
            include: Object.keys(trajetWhere).length > 0 ? [{
                model: Trajet,
                as: 'trajet',
                where: trajetWhere
            }] : []
        })
    ]);

    // Revenus totaux (paiements confirmés)
    const totalRevenue = await Paiement.sum('amount', {
        where: {
            status: 'completed',
            payment_date: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [{
            model: Reservation,
            as: 'reservation',
            include: Object.keys(trajetWhere).length > 0 ? [{
                model: Trajet,
                as: 'trajet',
                where: trajetWhere
            }] : []
        }]
    }) || 0;

    return {
        period: {
            start: startDate,
            end: endDate,
            label: period
        },
        reservations: {
            total: totalReservations,
            confirmed: confirmedReservations,
            cancelled: cancelledReservations,
            pending: pendingReservations,
            confirmation_rate: totalReservations > 0 
                ? Math.round((confirmedReservations / totalReservations) * 100) 
                : 0
        },
        revenue: {
            total: totalRevenue,
            currency: 'FCFA',
            average_per_reservation: confirmedReservations > 0 
                ? Math.round(totalRevenue / confirmedReservations) 
                : 0
        }
    };
}

module.exports = {
    // Fonctions principales
    createReservation,
    getUserReservations,
    getReservationById,
    cancelReservation,
    confirmPayment,
    getReservationStats,
    
    // Fonctions helper (exportées pour les tests unitaires)
    validateReservationData,
    checkTrajetAvailability,
    checkUserExistingReservation,
    calculateReservationAmount,
    checkCancellationPolicy
};