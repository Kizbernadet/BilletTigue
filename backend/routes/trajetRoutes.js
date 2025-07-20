const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const { protect } = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');

// Créer un nouveau trajet (transporteur uniquement)
router.post('/', protect, trajetController.createTrajet);

// Récupérer tous les trajets (avec filtres optionnels)
router.get('/', trajetController.getAllTrajets);

// Récupérer un trajet par ID
router.get('/:id', trajetController.getTrajetById);

// Récupérer les détails d'un trajet (alias pour getTrajetById)
router.get('/:id/details', trajetController.getTrajetDetails);

// Récupérer les trajets d'un transporteur spécifique
router.get('/transporteur/mes-trajets', protect, trajetController.getTrajetsByTransporteur);

// Rechercher des trajets avec critères
router.get('/search/trajets', trajetController.searchTrajets);

// Obtenir des suggestions de villes
router.get('/suggestions/villes', trajetController.getCitySuggestions);

// Modifier un trajet
router.put('/:id', protect, trajetController.updateTrajet);

// Supprimer un trajet
router.delete('/:id', protect, trajetController.deleteTrajet);

// ========== ROUTES ADMIN POUR GESTION DES TRAJETS EXPIRÉS ==========

// Mettre à jour automatiquement les trajets expirés (admin uniquement)
router.post('/admin/update-expired', protect, requireAdmin, async (req, res) => {
    try {
        const TrajetStatusService = require('../services/trajetStatusService');
        const result = await TrajetStatusService.updateExpiredTrajets();
        
        res.status(200).json({
            success: true,
            message: result.message,
            updatedCount: result.updatedCount,
            trajets: result.trajets || []
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des trajets expirés:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des trajets expirés',
            error: error.message
        });
    }
});

// Obtenir les statistiques des trajets (admin uniquement)
router.get('/admin/stats', protect, requireAdmin, async (req, res) => {
    try {
        const TrajetStatusService = require('../services/trajetStatusService');
        const stats = await TrajetStatusService.getTrajetStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
});

module.exports = router; 