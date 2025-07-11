/**
 * Nom du fichier : profileService.js
 * Description : Service métier pour la gestion des profils utilisateurs
 * Rôle : service (logique métier)
 */

const bcrypt = require('bcrypt');
const { Compte, Utilisateur, Transporteur, Administrateur, Role } = require('../models/index');

/**
 * Récupère le profil complet de l'utilisateur selon son rôle
 * @param {number} userId - ID de l'utilisateur
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<Object>} Profil complet de l'utilisateur
 */
async function getUserProfile(userId, userRole) {
    try {
        let profile = null;
        let compte = null;

        // Récupérer le compte avec le rôle
        compte = await Compte.findOne({
            where: { id: userId },
            include: [{ model: Role, as: 'role' }]
        });

        if (!compte) {
            throw new Error('Compte utilisateur non trouvé');
        }

        // Récupérer le profil selon le rôle
        switch (userRole) {
            case 'user':
                profile = await Utilisateur.findOne({
                    where: { compte_id: userId }
                });
                break;

            case 'transporteur':
                profile = await Transporteur.findOne({
                    where: { compte_id: userId }
                });
                break;

            case 'admin':
                profile = await Administrateur.findOne({
                    where: { compte_id: userId }
                });
                break;

            default:
                throw new Error('Rôle utilisateur non reconnu');
        }

        if (!profile) {
            throw new Error('Profil utilisateur non trouvé');
        }

        // Construire l'objet de réponse selon le rôle
        const userProfile = {
            id: profile.id,
            email: compte.email,
            role: compte.role.name,
            status: compte.status,
            createdAt: compte.created_at,
            updatedAt: compte.updated_at
        };

        // Ajouter les champs spécifiques selon le rôle
        switch (userRole) {
            case 'user':
                userProfile.firstName = profile.first_name;
                userProfile.lastName = profile.last_name;
                userProfile.phoneNumber = profile.phone_number;
                userProfile.address = profile.address || null;
                userProfile.dateOfBirth = profile.date_of_birth || null;
                userProfile.gender = profile.gender || null;
                userProfile.nationality = profile.nationality || null;
                userProfile.idNumber = profile.id_number || null;
                userProfile.profilePicture = profile.profile_picture || null;
                break;

            case 'transporteur':
                userProfile.phoneNumber = profile.phone_number;
                userProfile.companyName = profile.company_name;
                userProfile.companyType = profile.company_type;
                userProfile.licenseNumber = profile.license_number || null;
                userProfile.taxId = profile.tax_id || null;
                userProfile.address = profile.address || null;
                userProfile.contactPerson = profile.contact_person || null;
                userProfile.website = profile.website || null;
                userProfile.description = profile.description || null;
                break;

            case 'admin':
                userProfile.firstName = profile.first_name;
                userProfile.lastName = profile.last_name;
                userProfile.adminLevel = profile.admin_level || 'standard';
                userProfile.permissions = profile.permissions || [];
                break;
        }

        return userProfile;

    } catch (error) {
        throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
    }
}

/**
 * Met à jour le profil de l'utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {string} userRole - Rôle de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Profil mis à jour
 */
async function updateUserProfile(userId, userRole, updateData) {
    try {
        // Vérifier que l'utilisateur existe
        const existingProfile = await getUserProfile(userId, userRole);
        if (!existingProfile) {
            throw new Error('Utilisateur non trouvé');
        }

        let updatedProfile = null;

        // Mettre à jour selon le rôle
        switch (userRole) {
            case 'user':
                const userUpdateData = {};
                if (updateData.firstName) userUpdateData.first_name = updateData.firstName;
                if (updateData.lastName) userUpdateData.last_name = updateData.lastName;
                if (updateData.phoneNumber) userUpdateData.phone_number = updateData.phoneNumber;
                if (updateData.address) userUpdateData.address = updateData.address;
                if (updateData.dateOfBirth) userUpdateData.date_of_birth = updateData.dateOfBirth;
                if (updateData.gender) userUpdateData.gender = updateData.gender;
                if (updateData.nationality) userUpdateData.nationality = updateData.nationality;
                if (updateData.idNumber) userUpdateData.id_number = updateData.idNumber;
                if (updateData.profilePicture) userUpdateData.profile_picture = updateData.profilePicture;

                userUpdateData.updated_at = new Date();

                updatedProfile = await Utilisateur.update(userUpdateData, {
                    where: { compte_id: userId },
                    returning: true
                });
                break;

            case 'transporteur':
                const transporterUpdateData = {};
                if (updateData.phoneNumber) transporterUpdateData.phone_number = updateData.phoneNumber;
                if (updateData.companyName) transporterUpdateData.company_name = updateData.companyName;
                if (updateData.companyType) transporterUpdateData.company_type = updateData.companyType;
                if (updateData.licenseNumber) transporterUpdateData.license_number = updateData.licenseNumber;
                if (updateData.taxId) transporterUpdateData.tax_id = updateData.taxId;
                if (updateData.address) transporterUpdateData.address = updateData.address;
                if (updateData.contactPerson) transporterUpdateData.contact_person = updateData.contactPerson;
                if (updateData.website) transporterUpdateData.website = updateData.website;
                if (updateData.description) transporterUpdateData.description = updateData.description;

                transporterUpdateData.updated_at = new Date();

                updatedProfile = await Transporteur.update(transporterUpdateData, {
                    where: { compte_id: userId },
                    returning: true
                });
                break;

            case 'admin':
                const adminUpdateData = {};
                if (updateData.firstName) adminUpdateData.first_name = updateData.firstName;
                if (updateData.lastName) adminUpdateData.last_name = updateData.lastName;
                if (updateData.adminLevel) adminUpdateData.admin_level = updateData.adminLevel;
                if (updateData.permissions) adminUpdateData.permissions = updateData.permissions;

                adminUpdateData.updated_at = new Date();

                updatedProfile = await Administrateur.update(adminUpdateData, {
                    where: { compte_id: userId },
                    returning: true
                });
                break;

            default:
                throw new Error('Rôle utilisateur non reconnu');
        }

        // Récupérer le profil mis à jour
        return await getUserProfile(userId, userRole);

    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
}

/**
 * Change le mot de passe de l'utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<void>}
 */
async function changePassword(userId, currentPassword, newPassword) {
    try {
        // Récupérer le compte
        const compte = await Compte.findByPk(userId);
        if (!compte) {
            throw new Error('Compte utilisateur non trouvé');
        }

        // Vérifier l'ancien mot de passe
        const isMatch = await bcrypt.compare(currentPassword, compte.password_hash);
        if (!isMatch) {
            throw new Error('Mot de passe actuel incorrect');
        }

        // Hasher le nouveau mot de passe
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        await compte.update({
            password_hash: hashedNewPassword,
            updated_at: new Date()
        });

    } catch (error) {
        throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword
}; 