/**
 * Nom du fichier : authRoutes.js
 * Description : Définition des routes pour l'authentification (inscription, connexion, déconnexion)
 * Rôle : route (définit les endpoints HTTP pour l'authentification)
 */

/**
 * Logique du script :
 * 1. Définir la route POST /api/auth/register pour l'inscription
 * 2. Définir la route POST /api/auth/login pour la connexion
 * 3. Définir la route POST /api/auth/logout pour la déconnexion
 * 4. Lier chaque route à la fonction du contrôleur approprié
 */

const express = require('express'); // Framework Express pour la gestion des routes
const router = express.Router(); // Création d'un routeur Express
const authController = require('../controllers/authController'); // Contrôleur d'authentification
const { protect } = require('../middlewares/authMiddleware'); // Middleware d'authentification

// ========== Route : POST /api/auth/register ========== 
// Description : Inscription d'un nouvel utilisateur
// Appelle la fonction register du contrôleur
router.post('/register', authController.register);

// ========== Route : POST /api/auth/login ========== 
// Description : Connexion d'un utilisateur existant
// Appelle la fonction login du contrôleur
router.post('/login', authController.login);

// ========== Route : POST /api/auth/logout ========== 
// Description : Déconnexion d'un utilisateur authentifié
// Appelle la fonction logout du contrôleur
// Protégée par le middleware d'authentification
router.post('/logout', protect, authController.logout);

module.exports = router; 