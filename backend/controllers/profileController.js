/**
 * Nom du fichier : profileController.js
 * Description : Contrôleur pour la gestion des profils utilisateurs
 * Rôle : contrôleur (reçoit les requêtes HTTP, appelle le service, gère les réponses)
 */

const profileService = require('../services/profileService');

/**
 * Récupère le profil complet de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Promise<Response>} Profil utilisateur complet
 */
async function getCurrentUserProfile(req, res) {
    try {
        // L'utilisateur est déjà authentifié par le middleware auth
        const userId = req.user.id;
        const userRole = req.user.role;

        // Récupérer le profil complet selon le rôle
        const profile = await profileService.getUserProfile(userId, userRole);

        if (!profile) {
            return res.status(404).json({ 
                message: 'Profil utilisateur non trouvé' 
            });
        }

        return res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return res.status(500).json({ 
            message: 'Erreur interne du serveur lors de la récupération du profil' 
        });
    }
}

/**
 * Met à jour le profil de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Promise<Response>} Profil mis à jour
 */
async function updateUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const updateData = req.body;

        // Mettre à jour le profil
        const updatedProfile = await profileService.updateUserProfile(userId, userRole, updateData);

        return res.status(200).json({
            success: true,
            data: updatedProfile,
            message: 'Profil mis à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return res.status(400).json({ 
            message: error.message || 'Erreur lors de la mise à jour du profil' 
        });
    }
}

/**
 * Change le mot de passe de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Promise<Response>} Confirmation du changement
 */
async function changePassword(req, res) {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Ancien mot de passe et nouveau mot de passe requis' 
            });
        }

        await profileService.changePassword(userId, currentPassword, newPassword);

        return res.status(200).json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });

    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        return res.status(400).json({ 
            message: error.message || 'Erreur lors du changement de mot de passe' 
        });
    }
}

module.exports = {
    getCurrentUserProfile,
    updateUserProfile,
    changePassword
}; 