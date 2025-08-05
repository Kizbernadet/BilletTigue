/**
 * Nom du fichier : transporterReservationService.js
 * Description : Service métier pour la gestion des réservations côté transporteur
 * Rôle : Service (logique métier pure pour les transporteurs)
 */

const { Reservation, Trajet, Transporteur, Compte, Paiement, Utilisateur } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// ========== RÉCUPÉRER LES RÉSERVATIONS D'UN TRANSPORTEUR ==========

/**
 * Fonction : getTransporterReservations
 * Description : Récupérer toutes les réservations pour les trajets d'un transporteur
 * Paramètres :
 * - transporteurId (number) : ID du transporteur
 * - filters (object) : Filtres optionnels { status, trajet_id, date_depart, client, page, limit }
 * Retour : (Promise<object>) Liste des réservations avec pagination
 */
async function getTransporterReservations(transporteurId, filters = {}) {
    console.log("[getTransporterReservations] service appelé");
    console.log("[getTransporterReservations] transporteurId:", transporteurId);
    console.log("[getTransporterReservations] filters:", filters);
    try {
        const {
            status,
            trajet_id,
            date_depart,
            client,
            page = 1,
            limit = 20
        } = filters;

        // Construire les conditions de filtrage
        const whereClause = {};
        if (status) whereClause.status = status;

        // Conditions pour le trajet
        let trajetWhere = { transporteur_id: transporteurId };
        if (trajet_id) trajetWhere.id = trajet_id;
        if (date_depart) {
            trajetWhere.departure_time = {
                [Op.gte]: new Date(date_depart + ' 00:00:00'),
                [Op.lt]: new Date(new Date(date_depart).setDate(new Date(date_depart).getDate() + 1))
            };
        }

        // Conditions pour le client
        let compteWhere = {};
        if (client) {
            compteWhere[Op.or] = [
                { email: { [Op.iLike]: `%${client}%` } },
                { '$utilisateur.first_name$': { [Op.iLike]: `%${client}%` } },
                { '$utilisateur.last_name$': { [Op.iLike]: `%${client}%` } }
            ];
        }

        // Pagination
        const offset = (page - 1) * limit;

        let reservations;
        try {
            reservations = await Reservation.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    where: trajetWhere,
                    attributes: [
                        'id', 
                        'departure_city', 
                        'arrival_city', 
                        'departure_time', 
                        'arrival_time',
                        'price',
                        'available_seats',
                        // 'total_seats' supprimé car absent du schéma
                    ]
                },
                {
                    model: Compte,
                    as: 'compte',
                    where: Object.keys(compteWhere).length > 0 ? compteWhere : undefined,
                    attributes: ['id', 'email'],
                    include: [
                        {
                            model: Utilisateur,
                            as: 'utilisateur',
                            attributes: ['first_name', 'last_name', 'phone_number']
                        }
                    ]
                },
                {
                    model: Paiement,
                    as: 'paiement',
                    attributes: ['id', 'amount', 'status', 'payment_date'] // 'payment_method' supprimé car absent du schéma
                }
            ],
            order: [['reservation_date', 'DESC']],
            limit: parseInt(limit),
            offset: offset
            });
        } catch (dbError) {
            console.error('[getTransporterReservations] Erreur Sequelize:', dbError);
            throw dbError;
        }

        // Formater les données pour l'affichage
        console.log('[getTransporterReservations] Résultats bruts:', JSON.stringify(reservations, null, 2));
        const formattedReservations = reservations.rows.map(reservation => {
            try {
                return {
                    id: reservation.id,
                    numero_reservation: reservation.booking_number || reservation.numero_reservation,
                    created_at: reservation.reservation_date,
                    date_depart: reservation.trajet?.departure_time,
                    trajet_depart: reservation.trajet?.departure_city,
                    trajet_arrivee: reservation.trajet?.arrival_city,
                    client_nom: reservation.compte?.utilisateur?.last_name || 'N/A',
                    client_prenom: reservation.compte?.utilisateur?.first_name || 'N/A',
                    client_email: reservation.compte?.email,
                    client_telephone: reservation.compte?.utilisateur?.phone_number || 'N/A',
                    nombre_places: reservation.seats_reserved,
                    montant_total: reservation.total_amount,
                    status: reservation.status,
                    paiement_status: reservation.paiement?.status || 'pending',
                    paiement_methode: reservation.paiement?.payment_method || 'N/A'
                };
            } catch (formatError) {
                console.error('[getTransporterReservations] Erreur formatage réservation:', formatError, reservation);
                return { id: reservation.id, error: formatError.message };
            }
        });

        console.log('[getTransporterReservations] formattedReservations:', JSON.stringify(formattedReservations, null, 2));

        return {
            reservations: formattedReservations,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(reservations.count / limit),
                totalItems: reservations.count,
                itemsPerPage: parseInt(limit)
            }
        };

    } catch (error) {
        console.error('[getTransporterReservations] Erreur générale:', error);
        throw error;
    }
}

// ========== RÉCUPÉRER LES DÉTAILS D'UNE RÉSERVATION ==========

/**
 * Fonction : getTransporterReservationDetails
 * Description : Récupérer les détails complets d'une réservation pour un transporteur
 * Paramètres :
 * - reservationId (number) : ID de la réservation
 * - transporteurId (number) : ID du transporteur
 * Retour : (Promise<object>) Détails complets de la réservation
 */
async function getTransporterReservationDetails(reservationId, transporteurId) {
    try {
        const reservation = await Reservation.findByPk(reservationId, {
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    where: { transporteur_id: transporteurId },
                    attributes: [
                        'id', 
                        'departure_city', 
                        'arrival_city', 
                        'departure_time', 
                        'arrival_time',
                        'price',
                        'available_seats',
                        'vehicle_type',
                        'vehicle_number'
                    ]
                },
                {
                    model: Compte,
                    as: 'compte',
                    attributes: ['id', 'email'],
                    include: [
                        {
                            model: Utilisateur,
                            as: 'utilisateur',
                            attributes: ['first_name', 'last_name', 'phone_number', 'address']
                        }
                    ]
                },
                {
                    model: Paiement,
                    as: 'paiement',
                    attributes: ['id', 'amount', 'status', 'payment_date', 'payment_method', 'transaction_id']
                }
            ]
        });

        if (!reservation) {
            throw new Error('Réservation introuvable ou non autorisée');
        }

        return {
            id: reservation.id,
            numero_reservation: reservation.numero_reservation,
            reservation_date: reservation.reservation_date,
            status: reservation.status,
            seats_reserved: reservation.seats_reserved,
            total_amount: reservation.total_amount,
            refundable_option: reservation.refundable_option,
            refund_supplement_amount: reservation.refund_supplement_amount,
            
            // Informations du trajet
            trajet: {
                id: reservation.trajet.id,
                departure_city: reservation.trajet.departure_city,
                arrival_city: reservation.trajet.arrival_city,
                departure_time: reservation.trajet.departure_time,
                arrival_time: reservation.trajet.arrival_time,
                price: reservation.trajet.price,
                vehicle_type: reservation.trajet.vehicle_type,
                vehicle_number: reservation.trajet.vehicle_number
            },
            
            // Informations du client
            client: {
                id: reservation.compte.id,
                email: reservation.compte.email,
                first_name: reservation.compte.utilisateur?.first_name,
                last_name: reservation.compte.utilisateur?.last_name,
                phone_number: reservation.compte.utilisateur?.phone_number,
                address: reservation.compte.utilisateur?.address
            },
            
            // Informations du paiement
            paiement: reservation.paiement ? {
                id: reservation.paiement.id,
                amount: reservation.paiement.amount,
                status: reservation.paiement.status,
                payment_date: reservation.paiement.payment_date,
                payment_method: reservation.paiement.payment_method,
                transaction_id: reservation.paiement.transaction_id
            } : null
        };

    } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
        throw error;
    }
}

// ========== METTRE À JOUR LE STATUT D'UNE RÉSERVATION ==========

/**
 * Fonction : updateReservationStatus
 * Description : Mettre à jour le statut d'une réservation (transporteur)
 * Paramètres :
 * - reservationId (number) : ID de la réservation
 * - transporteurId (number) : ID du transporteur
 * - newStatus (string) : Nouveau statut
 * - reason (string) : Raison du changement (optionnel)
 * Retour : (Promise<object>) Réservation mise à jour
 */
async function updateReservationStatus(reservationId, transporteurId, newStatus, reason = '') {
    const transaction = await sequelize.transaction();
    
    try {
        // Vérifier que la réservation appartient au transporteur
        const reservation = await Reservation.findByPk(reservationId, {
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    where: { transporteur_id: transporteurId }
                }
            ],
            transaction
        });

        if (!reservation) {
            throw new Error('Réservation introuvable ou non autorisée');
        }

        // Validation du statut
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Statut invalide');
        }

        // Vérifier les transitions autorisées
        const currentStatus = reservation.status;
        const allowedTransitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
        };

        if (!allowedTransitions[currentStatus].includes(newStatus)) {
            throw new Error(`Transition de statut non autorisée: ${currentStatus} → ${newStatus}`);
        }

        // Mettre à jour le statut
        await reservation.update({ 
            status: newStatus 
        }, { transaction });

        // Si le statut passe à 'cancelled', libérer les places
        if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
            const trajet = await Trajet.findByPk(reservation.trajet_id, { transaction });
            await trajet.update({
                available_seats: trajet.available_seats + reservation.seats_reserved
            }, { transaction });
        }

        // Log de l'action
        console.log(`Transporteur ${transporteurId} a modifié le statut de la réservation ${reservationId} de ${currentStatus} vers ${newStatus}. Raison: ${reason}`);

        await transaction.commit();

        // Retourner la réservation mise à jour
        return await getTransporterReservationDetails(reservationId, transporteurId);

    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}

// ========== STATISTIQUES DES RÉSERVATIONS TRANSPORTEUR ==========

/**
 * Fonction : getTransporterReservationStats
 * Description : Récupérer les statistiques des réservations pour un transporteur
 * Paramètres :
 * - transporteurId (number) : ID du transporteur
 * - period (string) : Période (week, month, year)
 * Retour : (Promise<object>) Statistiques détaillées
 */
async function getTransporterReservationStats(transporteurId, period = 'month') {
    try {
        // Calculer la date de début selon la période
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Statistiques par statut
        const statusStats = await Reservation.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue']
            ],
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    where: { transporteur_id: transporteurId },
                    attributes: []
                }
            ],
            where: {
                reservation_date: {
                    [Op.gte]: startDate
                }
            },
            group: ['status'],
            raw: true
        });

        // Statistiques globales
        const globalStats = await Reservation.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_reservations'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
                [sequelize.fn('AVG', sequelize.col('total_amount')), 'average_amount']
            ],
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    where: { transporteur_id: transporteurId },
                    attributes: []
                }
            ],
            where: {
                reservation_date: {
                    [Op.gte]: startDate
                }
            },
            raw: true
        });

        // Réservations récentes (7 derniers jours)
        const recentReservations = await Reservation.count({
            include: [
                {
                    model: Trajet,
                    as: 'trajet',
                    where: { transporteur_id: transporteurId },
                    attributes: []
                }
            ],
            where: {
                reservation_date: {
                    [Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        return {
            period: period,
            start_date: startDate,
            end_date: now,
            
            // Statistiques globales
            total_reservations: parseInt(globalStats.total_reservations) || 0,
            total_revenue: parseFloat(globalStats.total_revenue) || 0,
            average_amount: parseFloat(globalStats.average_amount) || 0,
            recent_reservations: recentReservations,
            
            // Statistiques par statut
            by_status: statusStats.reduce((acc, stat) => {
                acc[stat.status] = {
                    count: parseInt(stat.count),
                    revenue: parseFloat(stat.total_revenue) || 0
                };
                return acc;
            }, {})
        };

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw new Error('Erreur lors de la récupération des statistiques');
    }
}

module.exports = {
    getTransporterReservations,
    getTransporterReservationDetails,
    updateReservationStatus,
    getTransporterReservationStats
}; 