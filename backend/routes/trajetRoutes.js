const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const { protect } = require('../middlewares/authMiddleware');

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

module.exports = router; 