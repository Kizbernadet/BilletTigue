/**
 * Nom du fichier : authController.js
 * Description : Contrôleur pour l'authentification (inscription, connexion)
 * Rôle : contrôleur (reçoit les requêtes HTTP, appelle le service, gère les réponses)
 */

/**
 * Logique du script :
 * 1. Gérer la requête d'inscription (register)
 * 2. Gérer la requête de connexion (login)
 * 3. Gérer les erreurs et retourner les réponses appropriées
 */

const authService = require('../services/authService'); // Service métier d'authentification

// ========== Fonction : register ========== 
// Description : Contrôleur pour l'inscription d'un nouvel utilisateur
// Paramètres :
// - req (Request) : Objet requête Express contenant les données d'inscription
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos utilisateur ou erreur
async function register(req, res) {
  try {
    // Appel du service d'inscription avec les données du body
    const result = await authService.register(req.body);
    // Retourner le token et les infos utilisateur (201 Created)
    return res.status(201).json(result);
  } catch (error) {
    // Gestion des erreurs (400 Bad Request)
    return res.status(400).json({ message: error.message });
  }
}

// ========== Fonction : login ========== 
// Description : Contrôleur pour la connexion d'un utilisateur existant
// Paramètres :
// - req (Request) : Objet requête Express contenant les credentials
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos utilisateur ou erreur
async function login(req, res) {
  try {
    // Appel du service de connexion avec les credentials du body
    const result = await authService.login(req.body);
    // Retourner le token et les infos utilisateur (200 OK)
    return res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs (401 Unauthorized)
    return res.status(401).json({ message: error.message });
  }
}

module.exports = {
  register,
  login
}; 