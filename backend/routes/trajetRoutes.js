const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const { requireTransporter } = require('../middlewares/roleMiddleware');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

// Routes publiques (accessibles à tous)
router.get('/trajets', trajetController.getAllTrajets); // Liste des trajets disponibles
router.get('/trajets/:id', trajetController.getTrajetDetails); // Détails d'un trajet spécifique

// ===== NOUVELLES ROUTES DE RECHERCHE =====

// Autocomplete des villes (public)
router.get('/cities/suggestions', trajetController.getCitySuggestions);

// Recherche de trajets (public avec auth optionnelle)
router.post('/trajets/search', optionalAuth, trajetController.searchTrajets);

// Routes protégées (transporteurs uniquement)
router.post('/trajets', 
    protect, 
    requireTransporter, 
    trajetController.createTrajet
);

router.get('/transporteur/trajets', 
    protect, 
    requireTransporter, 
    trajetController.getTrajetsByTransporteur
);

router.put('/trajets/:id', 
    protect, 
    requireTransporter, 
    trajetController.updateTrajet
);

router.delete('/trajets/:id', 
    protect, 
    requireTransporter, 
    trajetController.deleteTrajet
);

module.exports = router; 