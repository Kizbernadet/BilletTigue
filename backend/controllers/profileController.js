/**
 * Nom du fichier : profileController.js
 * Description : Contrôleur pour la gestion du profil utilisateur
 * Rôle : contrôleur (reçoit les requêtes HTTP, appelle le service, gère les réponses)
 */

const profileService = require('../services/profileService');

// ========== Fonction : getProfile ========== 
// Description : Récupère le profil de l'utilisateur connecté
// Paramètres :
// - req (Request) : Objet requête Express avec l'utilisateur authentifié
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec les données du profil
async function getProfile(req, res) {
  try {
    // L'utilisateur est déjà disponible grâce au middleware d'authentification
    const userId = req.user.id;
    
    // Appel du service pour récupérer le profil
    const profile = await profileService.getProfile(userId);
    
    // Retourner le profil (200 OK)
    return res.status(200).json(profile);
  } catch (error) {
    // Gestion des erreurs (500 Internal Server Error)
    console.error('Erreur lors de la récupération du profil:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la récupération du profil utilisateur.' 
    });
  }
}

// ========== Fonction : updateProfile ========== 
// Description : Met à jour le profil de l'utilisateur connecté
// Paramètres :
// - req (Request) : Objet requête Express avec l'utilisateur authentifié et les données à mettre à jour
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP de confirmation de mise à jour
async function updateProfile(req, res) {
  try {
    // L'utilisateur est déjà disponible grâce au middleware d'authentification
    const userId = req.user.id;
    const updateData = req.body;
    
    // Appel du service pour mettre à jour le profil
    const result = await profileService.updateProfile(userId, updateData);
    
    // Retourner la confirmation de mise à jour (200 OK)
    return res.status(200).json({
      message: 'Profil mis à jour avec succès.',
      user: result
    });
  } catch (error) {
    // Gestion des erreurs selon le type
    if (error.message.includes('mot de passe')) {
      // Erreur de mot de passe (400 Bad Request)
      return res.status(400).json({ message: error.message });
    } else if (error.message.includes('utilisateur')) {
      // Utilisateur non trouvé (404 Not Found)
      return res.status(404).json({ message: error.message });
    } else {
      // Erreur serveur (500 Internal Server Error)
      console.error('Erreur lors de la mise à jour du profil:', error);
      return res.status(500).json({ 
        message: 'Erreur lors de la mise à jour du profil utilisateur.' 
      });
    }
  }
}

module.exports = {
  getProfile,
  updateProfile
}; 