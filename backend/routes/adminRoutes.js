/**
 * Nom du fichier : adminRoutes.js
 * Description : Routes pour les fonctionnalités administrateur
 * Rôle : Gestion des utilisateurs, transporteurs et statistiques par l'admin
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// ========== Middleware de protection admin ==========
// Toutes les routes admin nécessitent une authentification et le rôle admin
router.use(protect);
router.use(admin);

// ========== Routes de gestion des transporteurs ==========
router.post('/create-transporter', adminController.createTransporter);
router.get('/transporters', adminController.getAllTransporters);
router.get('/transporters/:id', adminController.getTransporterById); // ✅ NOUVELLE ROUTE
router.put('/transporters/:id', adminController.updateTransporter);
router.delete('/transporters/:id', adminController.deleteTransporter);
router.put('/transporters/:id/status', adminController.updateTransporterStatus);

// ========== Routes de gestion des utilisateurs ==========
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById); // ✅ NOUVELLE ROUTE
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// ========== Routes de statistiques ==========
router.get('/stats', adminController.getAdminStats);
router.get('/stats/users', adminController.getUserStats);
router.get('/stats/transporters', adminController.getTransporterStats);

// ========== Routes de gestion des comptes ==========
router.get('/accounts', adminController.getAllAccounts);
router.put('/accounts/:id/role', adminController.updateAccountRole);

module.exports = router; 