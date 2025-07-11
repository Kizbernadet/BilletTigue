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

// GET /api/profile - Récupérer le profil complet de l'utilisateur connecté
router.get('/', profileController.getCurrentUserProfile);

// PUT /api/profile - Mettre à jour le profil de l'utilisateur connecté
router.put('/', profileController.updateUserProfile);

// POST /api/profile/change-password - Changer le mot de passe
router.post('/change-password', profileController.changePassword);

module.exports = router; 