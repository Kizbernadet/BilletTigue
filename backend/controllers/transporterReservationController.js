/**
 * Nom du fichier : transporterReservationController.js
 * Description : Contrôleur pour la gestion des réservations côté transporteur
 * Rôle : Gère les requêtes HTTP pour les transporteurs
 */

const transporterReservationService = require('../services/transporterReservationService');
const { Transporteur } = require('../models');

// ========== RÉCUPÉRER LES RÉSERVATIONS DU TRANSPORTEUR ==========

/**
 * Fonction : getTransporterReservations
 * Description : Récupérer toutes les réservations pour les trajets du transporteur connecté
 * Paramètres :
 * - req.user : Utilisateur authentifié (transporteur)
 * - req.query : Filtres { status, trajet_id, date_depart, client, page, limit }
 * Retour : Liste des réservations avec pagination
 */
const getTransporterReservations = async (req, res) => {
    try {
        // Récupérer l'ID du transporteur connecté
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(404).json({
                success: false,
                message: 'Profil transporteur introuvable'
            });
        }

        // Déléguer la logique métier au service
        const result = await transporterReservationService.getTransporterReservations(
            transporteur.id, 
            req.query
        );

        console.log("controller");
        console.log("result", result);

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

// ========== RÉCUPÉRER LES DÉTAILS D'UNE RÉSERVATION ==========

/**
 * Fonction : getTransporterReservationDetails
 * Description : Récupérer les détails complets d'une réservation
 * Paramètres :
 * - req.params.id : ID de la réservation
 * - req.user : Utilisateur authentifié (transporteur)
 * Retour : Détails complets de la réservation
 */
const getTransporterReservationDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer l'ID du transporteur connecté
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(404).json({
                success: false,
                message: 'Profil transporteur introuvable'
            });
        }

        // Déléguer la logique métier au service
        const reservation = await transporterReservationService.getTransporterReservationDetails(
            id, 
            transporteur.id
        );

        res.status(200).json({
            success: true,
            message: 'Détails de la réservation récupérés avec succès',
            data: reservation
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
        
        const statusCode = error.message.includes('introuvable') ? 404 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== METTRE À JOUR LE STATUT D'UNE RÉSERVATION ==========

/**
 * Fonction : updateReservationStatus
 * Description : Mettre à jour le statut d'une réservation
 * Paramètres :
 * - req.params.id : ID de la réservation
 * - req.body : { status, reason? }
 * - req.user : Utilisateur authentifié (transporteur)
 * Retour : Réservation mise à jour
 */
const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        // Validation du statut
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide. Statuts autorisés: ' + validStatuses.join(', ')
            });
        }

        // Récupérer l'ID du transporteur connecté
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(404).json({
                success: false,
                message: 'Profil transporteur introuvable'
            });
        }

        // Déléguer la logique métier au service
        const updatedReservation = await transporterReservationService.updateReservationStatus(
            id,
            transporteur.id,
            status,
            reason
        );

        res.status(200).json({
            success: true,
            message: 'Statut de la réservation mis à jour avec succès',
            data: updatedReservation
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        
        const statusCode = error.message.includes('introuvable') ? 404 : 
                          error.message.includes('Transition') ? 400 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ========== STATISTIQUES DES RÉSERVATIONS ==========

/**
 * Fonction : getTransporterReservationStats
 * Description : Récupérer les statistiques des réservations pour le transporteur
 * Paramètres :
 * - req.user : Utilisateur authentifié (transporteur)
 * - req.query : { period }
 * Retour : Statistiques détaillées
 */
const getTransporterReservationStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        // Récupérer l'ID du transporteur connecté
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(404).json({
                success: false,
                message: 'Profil transporteur introuvable'
            });
        }

        // Déléguer la logique métier au service
        const stats = await transporterReservationService.getTransporterReservationStats(
            transporteur.id,
            period
        );

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

// ========== RÉCUPÉRER LES TRAJETS DU TRANSPORTEUR ==========

/**
 * Fonction : getTransporterTrips
 * Description : Récupérer tous les trajets du transporteur pour les filtres
 * Paramètres :
 * - req.user : Utilisateur authentifié (transporteur)
 * Retour : Liste des trajets
 */
const getTransporterTrips = async (req, res) => {
    try {
        // Récupérer l'ID du transporteur connecté
        const transporteur = await Transporteur.findOne({
            where: { compte_id: req.user.id }
        });

        if (!transporteur) {
            return res.status(404).json({
                success: false,
                message: 'Profil transporteur introuvable'
            });
        }

        const { Trajet } = require('../models');

        const trajets = await Trajet.findAll({
            where: { transporteur_id: transporteur.id },
            attributes: ['id', 'departure_city', 'arrival_city', 'departure_time'],
            order: [['departure_time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Trajets récupérés avec succès',
            data: trajets
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

module.exports = {
    getTransporterReservations,
    getTransporterReservationDetails,
    updateReservationStatus,
    getTransporterReservationStats,
    getTransporterTrips
}; 