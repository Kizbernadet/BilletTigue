/**
 * Routes pour les statistiques administrateur
 * Endpoints pour récupérer les statistiques dynamiques des dashboards admin
 */

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');
const { requireAdmin, requireTransporter } = require('../middlewares/roleMiddleware');

// ========== Route : GET /api/stats/general ==========
// Description : Récupérer les statistiques générales du dashboard admin principal
// Méthode : GET
// Endpoint : /api/stats/general
// Middleware : protect (authentification) + requireAdmin (role admin)
// Appelle la fonction getGeneralStats du contrôleur
router.get('/general', protect, requireAdmin, statsController.getGeneralStats);

// ========== Route : GET /api/stats/transporters ==========
// Description : Récupérer les statistiques détaillées des transporteurs
// Méthode : GET  
// Endpoint : /api/stats/transporters
// Middleware : protect (authentification) + requireAdmin (role admin)
// Appelle la fonction getTransporterStats du contrôleur
router.get('/transporters', protect, requireAdmin, statsController.getTransporterStats);

// ========== Route : GET /api/stats/trajets ==========
// Description : Récupérer les statistiques détaillées des trajets
// Méthode : GET
// Endpoint : /api/stats/trajets
// Middleware : protect (authentification) + requireAdmin (role admin) 
// Appelle la fonction getTrajetStats du contrôleur
router.get('/trajets', protect, requireAdmin, statsController.getTrajetStats);

// ========== Route : GET /api/stats/all ==========
// Description : Récupérer toutes les statistiques en une seule requête (optimisé)
// Méthode : GET
// Endpoint : /api/stats/all
// Middleware : protect (authentification) + requireAdmin (role admin)
// Appelle la fonction getAllStats du contrôleur
router.get('/all', protect, requireAdmin, statsController.getAllStats);

// ========== Route : GET /api/stats/transporter/own ==========
// Description : Récupérer les statistiques du transporteur connecté
// Méthode : GET
// Endpoint : /api/stats/transporter/own
// Middleware : protect (authentification) + requireTransporter (role transporteur)
// Appelle la fonction getTransporterOwnStats du contrôleur
router.get('/transporter/own', protect, requireTransporter, statsController.getTransporterOwnStats);

module.exports = router; 