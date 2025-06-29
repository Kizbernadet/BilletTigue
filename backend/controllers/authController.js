/**
 * Nom du fichier : authController.js
 * Description : Contrôleur pour l'authentification (inscription, connexion, déconnexion)
 * Rôle : contrôleur (reçoit les requêtes HTTP, appelle le service, gère les réponses)
 */

/**
 * Logique du script refactorisée :
 * 1. Gérer les requêtes d'inscription spécifiques (registerUser, registerTransporter, registerAdmin)
 * 2. Gérer les requêtes de connexion (login, loginUser, loginTransporter)
 * 3. Gérer la requête de déconnexion (logout)
 * 4. Gérer les erreurs et retourner les réponses appropriées
 */

const authService = require('../services/authService'); // Service métier d'authentification

// ========== CONTRÔLEURS D'INSCRIPTION SPÉCIFIQUES ========== 

// ========== Fonction : registerUser ========== 
// Description : Contrôleur pour l'inscription d'un nouvel utilisateur
// Paramètres :
// - req (Request) : Objet requête Express contenant { email, password, firstName, lastName, phoneNumber }
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos utilisateur ou erreur
async function registerUser(req, res) {
  try {
    // Validation des champs requis
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis: email, password, firstName, lastName, phoneNumber' 
      });
    }

    // Appel du service d'inscription utilisateur
    const result = await authService.registerUser(req.body);
    
    // Retourner le token et les infos utilisateur (201 Created)
    return res.status(201).json(result);
  } catch (error) {
    // Gestion des erreurs (400 Bad Request)
    return res.status(400).json({ message: error.message });
  }
}

// ========== Fonction : registerTransporter ========== 
// Description : Contrôleur pour l'inscription d'un nouveau transporteur
// Paramètres :
// - req (Request) : Objet requête Express contenant { email, password, phoneNumber, companyName, companyType }
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos transporteur ou erreur
async function registerTransporter(req, res) {
  try {
    // Validation des champs requis
    const { email, password, phoneNumber, companyName, companyType } = req.body;
    
    if (!email || !password || !phoneNumber || !companyName || !companyType) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis: email, password, phoneNumber, companyName, companyType' 
      });
    }

    // Valider le type de transport
    if (!['freight-carrier', 'passenger-carrier', 'mixte'].includes(companyType)) {
      return res.status(400).json({ 
        message: 'Le companyType doit être "freight-carrier", "passenger-carrier" ou "mixte"' 
      });
    }

    // Appel du service d'inscription transporteur
    const result = await authService.registerTransporter(req.body);
    
    // Retourner le token et les infos transporteur (201 Created)
    return res.status(201).json(result);
  } catch (error) {
    // Gestion des erreurs (400 Bad Request)
    return res.status(400).json({ message: error.message });
  }
}

// ========== Fonction : registerAdmin ========== 
// Description : Contrôleur pour l'inscription d'un nouvel administrateur
// Paramètres :
// - req (Request) : Objet requête Express contenant { email, password, firstName, lastName }
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos administrateur ou erreur
async function registerAdmin(req, res) {
  try {
    // Validation des champs requis
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis: email, password, firstName, lastName' 
      });
    }

    // Appel du service d'inscription administrateur
    const result = await authService.registerAdmin(req.body);
    
    // Retourner le token et les infos administrateur (201 Created)
    return res.status(201).json(result);
  } catch (error) {
    // Gestion des erreurs (400 Bad Request)
    return res.status(400).json({ message: error.message });
  }
}

// ========== CONTRÔLEURS DE CONNEXION (CONSERVÉS) ========== 

// ========== Fonction : loginUser ========== 
// Description : Contrôleur pour la connexion d'un utilisateur (utilisateur ou admin)
// Paramètres :
// - req (Request) : Objet requête Express contenant les credentials
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos utilisateur ou erreur
async function loginUser(req, res) {
  try {
    // Appel du service de connexion utilisateur avec validation de rôle
    const result = await authService.loginUser(req.body);
    // Retourner le token et les infos utilisateur (200 OK)
    return res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs (401 Unauthorized)
    return res.status(401).json({ message: error.message });
  }
}

// ========== Fonction : loginTransporter ========== 
// Description : Contrôleur pour la connexion d'un transporteur (transporteur ou admin)
// Paramètres :
// - req (Request) : Objet requête Express contenant les credentials
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP avec token et infos utilisateur ou erreur
async function loginTransporter(req, res) {
  try {
    // Appel du service de connexion transporteur avec validation de rôle
    const result = await authService.loginTransporter(req.body);
    // Retourner le token et les infos utilisateur (200 OK)
    return res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs (401 Unauthorized)
    return res.status(401).json({ message: error.message });
  }
}

// ========== Fonction : login ========== 
// Description : Contrôleur pour la connexion d'un utilisateur existant (générique)
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

// ========== CONTRÔLEUR DE DÉCONNEXION ========== 

// ========== Fonction : logout ========== 
// Description : Contrôleur pour la déconnexion d'un utilisateur
// Paramètres :
// - req (Request) : Objet requête Express contenant le token dans les headers
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP de confirmation de déconnexion
async function logout(req, res) {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token d\'authentification manquant.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier si l'utilisateur est authentifié (req.user est défini par le middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    // Appel du service de déconnexion
    const result = await authService.logout(token, req.user.id);
    
    // Retourner la confirmation de déconnexion (200 OK)
    return res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs (500 Internal Server Error)
    return res.status(500).json({ message: error.message });
  }
}

// ========== Fonction : verifyToken ========== 
// Description : Contrôleur pour vérifier la validité d'un token d'authentification
// Paramètres :
// - req (Request) : Objet requête Express avec le token dans les headers
// - res (Response) : Objet réponse Express pour envoyer la réponse
// Retour : (Promise<Response>) Réponse HTTP confirmant la validité du token
async function verifyToken(req, res) {
  try {
    // Le middleware 'protect' a déjà vérifié le token et ajouté req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }

    // Vérifier si le token n'est pas révoqué
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token d\'authentification manquant.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier si le token est révoqué
    const isRevoked = await authService.isTokenRevoked(token);
    if (isRevoked) {
      return res.status(401).json({ message: 'Token révoqué.' });
    }

    // Token valide
    return res.status(200).json({ 
      valid: true,
      message: 'Token valide',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    // Gestion des erreurs (401 Unauthorized)
    return res.status(401).json({ message: 'Erreur lors de la vérification du token: ' + error.message });
  }
}

module.exports = {
  // Nouvelles fonctions d'inscription spécifiques
  registerUser,
  registerTransporter,
  registerAdmin,
  
  // Fonctions de connexion conservées
  login,
  loginUser,
  loginTransporter,
  
  // Fonction de déconnexion
  logout,
  
  // Fonction de vérification de token
  verifyToken
}; 