/**
 * Routes de gestion du profil utilisateur
 * Définit les endpoints pour consulter et modifier le profil.
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

// Toutes les routes de profil nécessitent une authentification
router.use(protect);

// GET /api/user/profile - Récupérer le profil de l'utilisateur connecté
router.get('/user/profile', profileController.getProfile);

// PUT /api/user/profile - Mettre à jour le profil de l'utilisateur connecté
router.put('/user/profile', profileController.updateProfile);

module.exports = router; 