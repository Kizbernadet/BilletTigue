/**
 * Nom du fichier : profileService.js
 * Description : Service métier pour la gestion du profil utilisateur
 * Rôle : service (logique métier)
 */

const bcrypt = require('bcrypt');
const { Compte, Utilisateur, Role } = require('../models/index');

// ========== Fonction : getProfile ========== 
// Description : Récupère le profil complet d'un utilisateur
// Paramètres :
// - userId (number) : ID de l'utilisateur
// Retour : (Promise<object>) Objet contenant les informations du profil
async function getProfile(userId) {
  try {
    // Récupérer le compte avec le rôle et l'utilisateur associé
    const compte = await Compte.findOne({
      where: { id: userId },
      include: [
        { model: Role, as: 'role' },
        { model: Utilisateur, as: 'utilisateur' }
      ]
    });

    if (!compte) {
      throw new Error('Utilisateur non trouvé.');
    }

    // Construire l'objet de réponse
    const profile = {
      id: compte.id,
      email: compte.email,
      firstName: compte.utilisateur?.first_name || '',
      lastName: compte.utilisateur?.last_name || '',
      phoneNumber: compte.utilisateur?.phone_number || '',
      address: compte.utilisateur?.address || '',
      role: compte.role?.name || 'user',
      status: compte.status,
      createdAt: compte.created_at,
      updatedAt: compte.updated_at
    };

    return profile;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
  }
}

// ========== Fonction : updateProfile ========== 
// Description : Met à jour le profil d'un utilisateur
// Paramètres :
// - userId (number) : ID de l'utilisateur
// - updateData (object) : Données à mettre à jour
// Retour : (Promise<object>) Objet contenant le profil mis à jour
async function updateProfile(userId, updateData) {
  try {
    // Récupérer le compte et l'utilisateur
    const compte = await Compte.findOne({
      where: { id: userId },
      include: [
        { model: Role, as: 'role' },
        { model: Utilisateur, as: 'utilisateur' }
      ]
    });

    if (!compte) {
      throw new Error('Utilisateur non trouvé.');
    }

    // Vérifier si un changement de mot de passe est demandé
    if (updateData.currentPassword && updateData.newPassword) {
      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(
        updateData.currentPassword, 
        compte.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new Error('Le mot de passe actuel est incorrect.');
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(updateData.newPassword, 10);
      
      // Mettre à jour le mot de passe
      await compte.update({
        password_hash: hashedNewPassword,
        updated_at: new Date()
      });
    }

    // Mettre à jour les informations de l'utilisateur
    if (compte.utilisateur) {
      const userUpdateData = {};
      
      if (updateData.firstName !== undefined) {
        userUpdateData.first_name = updateData.firstName;
      }
      if (updateData.lastName !== undefined) {
        userUpdateData.last_name = updateData.lastName;
      }
      if (updateData.phoneNumber !== undefined) {
        userUpdateData.phone_number = updateData.phoneNumber;
      }
      if (updateData.address !== undefined) {
        userUpdateData.address = updateData.address;
      }

      if (Object.keys(userUpdateData).length > 0) {
        userUpdateData.updated_at = new Date();
        await compte.utilisateur.update(userUpdateData);
      }
    } else {
      // Créer l'utilisateur s'il n'existe pas
      const userData = {
        first_name: updateData.firstName || '',
        last_name: updateData.lastName || '',
        phone_number: updateData.phoneNumber || '',
        address: updateData.address || '',
        compte_id: compte.id,
        created_at: new Date(),
        updated_at: new Date()
      };

      await Utilisateur.create(userData);
    }

    // Récupérer le profil mis à jour
    const updatedProfile = await getProfile(userId);
    
    return updatedProfile;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
  }
}

module.exports = {
  getProfile,
  updateProfile
}; 