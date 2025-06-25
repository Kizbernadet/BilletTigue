const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// Routes publiques (accessibles à tous)
router.get('/trajets', trajetController.getAllTrajets); // Liste des trajets disponibles
router.get('/trajets/:id', trajetController.getTrajetById); // Détails d'un trajet

// Routes protégées (transporteurs uniquement)
router.post('/trajets', 
    protect, 
    roleMiddleware(['transporter']), 
    trajetController.createTrajet
);

router.get('/transporteur/trajets', 
    protect, 
    roleMiddleware(['transporter']), 
    trajetController.getTrajetsByTransporteur
);

router.put('/trajets/:id', 
    protect, 
    roleMiddleware(['transporter']), 
    trajetController.updateTrajet
);

router.delete('/trajets/:id', 
    protect, 
    roleMiddleware(['transporter']), 
    trajetController.deleteTrajet
);

module.exports = router; 