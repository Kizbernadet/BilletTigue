const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    loginUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');

// Routes publiques
router.post('/login', loginUser);
router.post('/', registerUser);

// Routes protégées
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router; 