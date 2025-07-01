/**
 * Nom du fichier : reservationController.js
 * Description : Contrôleur pour la gestion des réservations de trajets
 * Rôle : Gère les requêtes HTTP pour créer, consulter, modifier et annuler des réservations
 */

const reservationService = require('../services/reservationService');

// ========== CRÉER UNE RÉSERVATION ==========

/**
 * Fonction : createReservation
 * Description : Créer une nouvelle réservation pour un trajet
 * Paramètres :
 * - req.body : { trajet_id, seats_reserved, passenger_first_name, passenger_last_name, phone_number }
 * - req.user : Utilisateur authentifié
 * Retour : Réservation créée avec paiement associé
 */
const createReservation = async (req, res) => {
    try {
        // Déléguer la logique métier au service
        const result = await reservationService.createReservation(req.body, req.user.id);
        
        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: result
        });

    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        
        // Gestion des erreurs métier
        const statusCode = error.message.includes('introuvable') ? 404 : 400;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== CRÉER UNE RÉSERVATION INVITÉ ==========

/**
 * Fonction : createGuestReservation
 * Description : Créer une réservation sans compte utilisateur
 * Paramètres :
 * - req.body : { trajet_id, seats_reserved, passenger_first_name, passenger_last_name, phone_number, refundable_option, refund_supplement_amount, total_amount }
 * Retour : Réservation créée avec référence et QR code
 */
const createGuestReservation = async (req, res) => {
    try {
        // Déléguer la logique métier au service
        const result = await reservationService.createGuestReservation(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Réservation invité créée avec succès',
            data: result
        });

    } catch (error) {
        console.error('Erreur lors de la création de la réservation invité:', error);
        
        // Gestion des erreurs métier
        const statusCode = error.message.includes('introuvable') ? 404 : 400;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== RÉCUPÉRER MES RÉSERVATIONS ==========

/**
 * Fonction : getMyReservations
 * Description : Récupérer toutes les réservations de l'utilisateur connecté
 * Paramètres :
 * - req.user : Utilisateur authentifié
 * - req.query : { status, page, limit }
 * Retour : Liste des réservations avec pagination
 */
const getMyReservations = async (req, res) => {
    try {
        // Déléguer la logique métier au service
        const result = await reservationService.getUserReservations(req.user.id, req.query);

        res.status(200).json({
            success: true,
            message: 'Réservations récupérées avec succès',
            data: result.reservations,
            pagination: result.pagination
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

// ========== RÉCUPÉRER UNE RÉSERVATION SPÉCIFIQUE ==========

/**
 * Fonction : getReservationById
 * Description : Récupérer les détails d'une réservation spécifique
 * Paramètres :
 * - req.params.id : ID de la réservation
 * - req.user : Utilisateur authentifié
 * Retour : Détails complets de la réservation
 */
const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Déléguer la logique métier au service
        const reservation = await reservationService.getReservationById(id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Réservation récupérée avec succès',
            data: reservation
        });

    } catch (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
        
        const statusCode = error.message.includes('introuvable') ? 404 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== ANNULER UNE RÉSERVATION ==========

/**
 * Fonction : cancelReservation
 * Description : Annuler une réservation et libérer les places
 * Paramètres :
 * - req.params.id : ID de la réservation
 * - req.user : Utilisateur authentifié
 * Retour : Confirmation d'annulation
 */
const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Déléguer la logique métier au service
        const result = await reservationService.cancelReservation(id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Réservation annulée avec succès',
            data: result
        });

    } catch (error) {
        console.error('Erreur lors de l\'annulation de la réservation:', error);
        
        const statusCode = error.message.includes('introuvable') ? 404 : 400;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== CONFIRMER LE PAIEMENT D'UNE RÉSERVATION ==========

/**
 * Fonction : confirmPayment
 * Description : Confirmer le paiement et finaliser la réservation
 * Paramètres :
 * - req.params.id : ID de la réservation
 * - req.body : { payment_method, transaction_id }
 * Retour : Réservation confirmée
 */
const confirmPayment = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Déléguer la logique métier au service
        const confirmedReservation = await reservationService.confirmPayment(id, req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Paiement confirmé et réservation validée',
            data: confirmedReservation
        });

    } catch (error) {
        console.error('Erreur lors de la confirmation du paiement:', error);
        
        const statusCode = error.message.includes('introuvable') ? 404 : 400;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== STATISTIQUES RÉSERVATIONS (POUR ADMIN/TRANSPORTEUR) ==========

/**
 * Fonction : getReservationStats
 * Description : Récupérer les statistiques des réservations
 * Paramètres :
 * - req.user : Utilisateur authentifié (admin ou transporteur)
 * - req.query : { period, transporteur_id }
 * Retour : Statistiques des réservations
 */
const getReservationStats = async (req, res) => {
    try {
        // Vérifier les permissions (admin ou transporteur)
        if (!['admin', 'transporteur'].includes(req.user.role_name)) {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé'
            });
        }

        // Préparer les filtres pour le service
        const filters = {
            ...req.query,
            role: req.user.role_name,
            userId: req.user.id
        };

        // Déléguer la logique métier au service
        const stats = await reservationService.getReservationStats(filters);

        res.status(200).json({
            success: true,
            message: 'Statistiques récupérées avec succès',
            data: stats
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
};

module.exports = {
    createReservation,
    createGuestReservation,
    getMyReservations,
    getReservationById,
    cancelReservation,
    confirmPayment,
    getReservationStats
};