/**
 * Nom du fichier : authRoutes.js
 * Description : Définition des routes pour l'authentification (inscription, connexion, déconnexion)
 * Rôle : route (définit les endpoints HTTP pour l'authentification)
 */

/**
 * Logique du script refactorisée :
 * 1. Définir les routes POST /api/auth/register-user, register-transporter, register-admin pour l'inscription spécifique
 * 2. Définir la route POST /api/auth/login-user pour la connexion utilisateur
 * 3. Définir la route POST /api/auth/login-transporter pour la connexion transporteur
 * 4. Définir la route POST /api/auth/logout pour la déconnexion
 * 5. Lier chaque route à la fonction du contrôleur approprié
 */

const express = require('express'); // Framework Express pour la gestion des routes
const router = express.Router(); // Création d'un routeur Express
const authController = require('../controllers/authController'); // Contrôleur d'authentification
const { protect } = require('../middlewares/authMiddleware'); // Middleware d'authentification

// ========== ROUTES D'INSCRIPTION SPÉCIFIQUES ========== 

// ========== Route : POST /api/auth/register-user ========== 
// Description : Inscription d'un nouvel utilisateur
// Appelle la fonction registerUser du contrôleur
router.post('/register-user', authController.registerUser);

// ========== Route : POST /api/auth/register-transporter ========== 
// Description : Inscription d'un nouveau transporteur (freight-carrier ou passenger-carrier)
// Appelle la fonction registerTransporter du contrôleur
router.post('/register-transporter', authController.registerTransporter);

// ========== Route : POST /api/auth/register-admin ========== 
// Description : Inscription d'un nouvel administrateur
// Appelle la fonction registerAdmin du contrôleur
router.post('/register-admin', authController.registerAdmin);

// ========== ROUTES DE CONNEXION ========== 

// ========== Route : POST /api/auth/login-user ========== 
// Description : Connexion d'un utilisateur (utilisateur ou admin)
// Appelle la fonction loginUser du contrôleur
router.post('/login-user', authController.loginUser);

// ========== Route : POST /api/auth/login-transporter ========== 
// Description : Connexion d'un transporteur (transporteur ou admin)
// Appelle la fonction loginTransporter du contrôleur
router.post('/login-transporter', authController.loginTransporter);

// ========== Route : POST /api/auth/login ========== 
// Description : Connexion générique (conservée pour compatibilité)
// Appelle la fonction login du contrôleur
router.post('/login', authController.login);

// ========== ROUTE DE DÉCONNEXION ========== 

// ========== Route : POST /api/auth/logout ========== 
// Description : Déconnexion d'un utilisateur authentifié
// Appelle la fonction logout du contrôleur
// Protégée par le middleware d'authentification
router.post('/logout', protect, authController.logout);

// ========== Route : GET /api/auth/verify-token ==========
// Description : Vérification de la validité d'un token d'authentification
// Middleware : protect (authentification requise)
// Appelle la fonction verifyToken du contrôleur
router.get('/verify-token', protect, authController.verifyToken);

module.exports = router; 