/**
 * Nom du fichier : reservationRoutes.js
 * Description : Définition des routes pour la gestion des réservations de trajets
 * Rôle : Route (définit les endpoints HTTP pour les réservations)
 */

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect } = require('../middlewares/authMiddleware');
const { requireUser, requireTransporter, requireAdmin } = require('../middlewares/roleMiddleware');

// ========== ROUTES UTILISATEUR (PROTECTION AUTHENTIFICATION) ==========

/**
 * Route : POST /api/reservations
 * Description : Créer une nouvelle réservation
 * Middleware : protect (authentification requise)
 * Body : { trajet_id, seats_reserved, passenger_first_name, passenger_last_name, phone_number }
 * Retour : Réservation créée avec paiement associé
 */
router.post('/', 
    protect, 
    reservationController.createReservation
);

/**
 * Route : POST /api/reservations/guest
 * Description : Créer une réservation sans compte
 * Middleware : Aucun (accès libre)
 * Body : { trajet_id, seats_reserved, passenger_first_name, passenger_last_name, phone_number, refundable_option, refund_supplement_amount, total_amount }
 * Retour : Réservation créée avec référence et QR code
 */
router.post('/guest', 
    reservationController.createGuestReservation
);

/**
 * Route : GET /api/reservations
 * Description : Récupérer toutes mes réservations
 * Middleware : protect (authentification requise)
 * Query params : { status?, page?, limit? }
 * Retour : Liste des réservations de l'utilisateur connecté
 */
router.get('/', 
    protect, 
    reservationController.getMyReservations
);

/**
 * Route : GET /api/reservations/:id
 * Description : Récupérer les détails d'une réservation spécifique
 * Middleware : protect (authentification requise)
 * Params : { id } - ID de la réservation
 * Retour : Détails complets de la réservation
 */
router.get('/:id', 
    protect, 
    reservationController.getReservationById
);

/**
 * Route : PUT /api/reservations/:id/cancel
 * Description : Annuler une réservation
 * Middleware : protect (authentification requise)
 * Params : { id } - ID de la réservation
 * Retour : Confirmation d'annulation avec infos de remboursement
 */
router.put('/:id/cancel', 
    protect, 
    reservationController.cancelReservation
);

/**
 * Route : PUT /api/reservations/:id/confirm-payment
 * Description : Confirmer le paiement et finaliser la réservation
 * Middleware : protect (authentification requise)
 * Params : { id } - ID de la réservation
 * Body : { payment_method?, transaction_id? }
 * Retour : Réservation confirmée
 */
router.put('/:id/confirm-payment', 
    protect, 
    reservationController.confirmPayment
);

// ========== ROUTES STATISTIQUES (ADMIN ET TRANSPORTEUR) ==========

/**
 * Route : GET /api/reservations/stats/overview
 * Description : Récupérer les statistiques des réservations
 * Middleware : protect (authentification requise)
 * Accès : Admin (toutes les stats) ou Transporteur (ses propres stats)
 * Query params : { period?, transporteur_id? }
 * Retour : Statistiques détaillées des réservations
 */
router.get('/stats/overview', 
    protect, 
    reservationController.getReservationStats
);

// ========== ROUTES ADMIN UNIQUEMENT ==========

/**
 * Route : GET /api/reservations/admin/all
 * Description : Récupérer toutes les réservations (vue admin)
 * Middleware : protect + requireAdmin
 * Query params : { status?, transporteur_id?, page?, limit? }
 * Retour : Liste complète des réservations avec filtres
 */
router.get('/admin/all', 
    protect, 
    requireAdmin, 
    async (req, res) => {
        try {
            const {
                status,
                transporteur_id,
                compte_id,
                page = 1,
                limit = 20
            } = req.query;

            // Construire les conditions de filtrage
            const whereClause = {};
            if (status) whereClause.status = status;
            if (compte_id) whereClause.compte_id = compte_id;

            // Conditions pour le trajet
            let trajetWhere = {};
            if (transporteur_id) trajetWhere.transporteur_id = transporteur_id;

            // Pagination
            const offset = (page - 1) * limit;

            const { Reservation, Trajet, Transporteur, Compte, Paiement } = require('../models');

            const reservations = await Reservation.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Trajet,
                        as: 'trajet',
                        where: Object.keys(trajetWhere).length > 0 ? trajetWhere : undefined,
                        include: [{
                            model: Transporteur,
                            as: 'transporteur',
                            attributes: ['id', 'company_name', 'company_type', 'phone_number']
                        }]
                    },
                    {
                        model: Compte,
                        as: 'compte',
                        attributes: ['id', 'email']
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

            res.status(200).json({
                success: true,
                message: 'Réservations récupérées avec succès',
                data: reservations.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reservations.count / limit),
                    totalItems: reservations.count,
                    itemsPerPage: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Erreur lors de la récupération des réservations admin:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    }
);

/**
 * Route : PUT /api/reservations/admin/:id/status
 * Description : Modifier le statut d'une réservation (admin uniquement)
 * Middleware : protect + requireAdmin
 * Params : { id } - ID de la réservation
 * Body : { status, reason? }
 * Retour : Réservation mise à jour
 */
router.put('/admin/:id/status', 
    protect, 
    requireAdmin, 
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status, reason } = req.body;

            // Validation du statut
            const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
            if (!status || !validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Statut invalide. Statuts autorisés: ' + validStatuses.join(', ')
                });
            }

            const { Reservation, Trajet, Transporteur, Paiement } = require('../models');

            const reservation = await Reservation.findByPk(id, {
                include: [
                    {
                        model: Trajet,
                        as: 'trajet'
                    },
                    {
                        model: Paiement,
                        as: 'paiement'
                    }
                ]
            });

            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    message: 'Réservation introuvable'
                });
            }

            // Mettre à jour le statut
            await reservation.update({ status });

            // Log de l'action admin (optionnel - pour audit)
            console.log(`Admin ${req.user.id} a modifié le statut de la réservation ${id} vers ${status}. Raison: ${reason || 'Non spécifiée'}`);

            const updatedReservation = await Reservation.findByPk(id, {
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

            res.status(200).json({
                success: true,
                message: 'Statut de la réservation mis à jour avec succès',
                data: updatedReservation
            });

        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    }
);

// ========== ROUTES TRANSPORTEUR ==========

/**
 * Route : GET /api/reservations/transporteur/my-trajets
 * Description : Récupérer les réservations pour les trajets du transporteur connecté
 * Middleware : protect + requireTransporter
 * Query params : { status?, page?, limit? }
 * Retour : Liste des réservations pour les trajets du transporteur
 */
router.get('/transporteur/my-trajets', 
    protect, 
    requireTransporter, 
    async (req, res) => {
        try {
            const {
                status,
                page = 1,
                limit = 20
            } = req.query;

            // Récupérer l'ID du transporteur connecté
            const { Transporteur } = require('../models');
            const transporteur = await Transporteur.findOne({
                where: { compte_id: req.user.id }
            });

            if (!transporteur) {
                return res.status(404).json({
                    success: false,
                    message: 'Profil transporteur introuvable'
                });
            }

            // Construire les conditions
            const whereClause = {};
            if (status) whereClause.status = status;

            // Pagination
            const offset = (page - 1) * limit;

            const { Reservation, Trajet, Compte, Paiement } = require('../models');

            const reservations = await Reservation.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Trajet,
                        as: 'trajet',
                        where: { transporteur_id: transporteur.id },
                        attributes: ['id', 'departure_city', 'arrival_city', 'departure_time', 'price']
                    },
                    {
                        model: Compte,
                        as: 'compte',
                        attributes: ['id', 'email']
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

            res.status(200).json({
                success: true,
                message: 'Réservations récupérées avec succès',
                data: reservations.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reservations.count / limit),
                    totalItems: reservations.count,
                    itemsPerPage: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Erreur lors de la récupération des réservations transporteur:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    }
);

module.exports = router; 