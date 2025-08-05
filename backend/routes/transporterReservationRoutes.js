/**
 * Nom du fichier : transporterReservationRoutes.js
 * Description : Définition des routes pour la gestion des réservations côté transporteur
 * Rôle : Route (définit les endpoints HTTP pour les transporteurs)
 */

const express = require('express');
const router = express.Router();
const transporterReservationController = require('../controllers/transporterReservationController');
const { protect } = require('../middlewares/authMiddleware');
const { requireTransporter } = require('../middlewares/roleMiddleware');

// ========== ROUTES TRANSPORTEUR (PROTECTION AUTHENTIFICATION + RÔLE) ==========

/**
 * Route : GET /api/transporter/reservations
 * Description : Récupérer toutes les réservations pour les trajets du transporteur connecté
 * Middleware : protect + requireTransporter
 * Query params : { status?, trajet_id?, date_depart?, client?, page?, limit? }
 * Retour : Liste des réservations avec pagination
 */
router.get('/', 
    protect, 
    requireTransporter, 
    transporterReservationController.getTransporterReservations
);

/**
 * Route : GET /api/transporter/reservations/:id
 * Description : Récupérer les détails d'une réservation spécifique
 * Middleware : protect + requireTransporter
 * Params : { id } - ID de la réservation
 * Retour : Détails complets de la réservation
 */
router.get('/:id', 
    protect, 
    requireTransporter, 
    transporterReservationController.getTransporterReservationDetails
);

/**
 * Route : PUT /api/transporter/reservations/:id/status
 * Description : Mettre à jour le statut d'une réservation
 * Middleware : protect + requireTransporter
 * Params : { id } - ID de la réservation
 * Body : { status, reason? }
 * Retour : Réservation mise à jour
 */
router.put('/:id/status', 
    protect, 
    requireTransporter, 
    transporterReservationController.updateReservationStatus
);

/**
 * Route : GET /api/transporter/reservations/stats/overview
 * Description : Récupérer les statistiques des réservations pour le transporteur
 * Middleware : protect + requireTransporter
 * Query params : { period? }
 * Retour : Statistiques détaillées
 */
router.get('/stats/overview', 
    protect, 
    requireTransporter, 
    transporterReservationController.getTransporterReservationStats
);

/**
 * Route : GET /api/transporter/reservations/trips/list
 * Description : Récupérer tous les trajets du transporteur pour les filtres
 * Middleware : protect + requireTransporter
 * Retour : Liste des trajets
 */
router.get('/trips/list', 
    protect, 
    requireTransporter, 
    transporterReservationController.getTransporterTrips
);

module.exports = router; 