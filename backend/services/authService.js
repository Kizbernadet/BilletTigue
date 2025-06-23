/**
 * Nom du fichier : authService.js
 * Description : Service métier pour l'authentification (inscription, connexion, déconnexion)
 * Rôle : service (logique métier)
 */

/**
 * Logique du script :
 * 1. Inscription d'un nouvel utilisateur (register)
 * 2. Connexion d'un utilisateur existant (login)
 * 3. Déconnexion d'un utilisateur (logout)
 * 4. Vérification des tokens révoqués (isTokenRevoked)
 * 5. Hashage du mot de passe et génération de JWT
 */

const bcrypt = require('bcrypt'); // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const { Compte, Utilisateur, Role, RevokedToken } = require('../models/index'); // Modèles avec associations

// ========== Fonction : register ========== 
// Description : Inscrit un nouvel utilisateur dans la base
// Paramètres :
// - data (object) : { email, password, role, profile }
// Retour : (Promise<object>) Un objet contenant le token JWT et les infos utilisateur
async function register(data) {
  // Vérifier si l'email existe déjà
  const compteExistant = await Compte.findOne({ where: { email: data.email } });
  if (compteExistant) {
    throw new Error('Cet email est déjà utilisé.');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Déterminer le rôle (par défaut: user)
  const roleName = data.role || 'user';
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new Error(`Le rôle '${roleName}' n'existe pas.`);
  }

  // Créer le compte
  const compte = await Compte.create({
    email: data.email,
    password_hash: hashedPassword,
    status: 'active',
    role_id: role.id,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Créer l'utilisateur lié au compte
  const utilisateur = await Utilisateur.create({
    last_name: data.profile?.lastName || data.profile?.nom || '',
    first_name: data.profile?.firstName || data.profile?.prenom || '',
    phone_number: data.profile?.phoneNumber || data.profile?.telephone || '',
    compte_id: compte.id,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Générer un token JWT
  const token = jwt.sign(
    { 
      id: compte.id, 
      userId: utilisateur.id, 
      email: compte.email,
      role: role.name
    },
    process.env.JWT_SECRET || 'billettigue_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  // Retourner le token et les infos utilisateur
  return {
    token,
    user: {
      id: utilisateur.id,
      firstName: utilisateur.first_name,
      lastName: utilisateur.last_name,
      email: compte.email,
      phoneNumber: utilisateur.phone_number,
      role: role.name
    }
  };
}

// ========== Fonction : login ========== 
// Description : Authentifie un utilisateur existant
// Paramètres :
// - credentials (object) : { email, password }
// Retour : (Promise<object>) Un objet contenant le token JWT et les infos utilisateur
async function login(credentials) {
  // Chercher le compte par email avec le rôle
  const compte = await Compte.findOne({ 
    where: { email: credentials.email },
    include: [{ model: Role, as: 'role' }]
  });
  
  if (!compte) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Vérifier le mot de passe
  const isMatch = await bcrypt.compare(credentials.password, compte.password_hash);
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Récupérer l'utilisateur lié
  const utilisateur = await Utilisateur.findOne({ where: { compte_id: compte.id } });

  // Générer un token JWT
  const token = jwt.sign(
    { 
      id: compte.id, 
      userId: utilisateur?.id, 
      email: compte.email,
      role: compte.role.name
    },
    process.env.JWT_SECRET || 'billettigue_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  // Retourner le token et les infos utilisateur
  return {
    token,
    user: {
      id: utilisateur?.id,
      firstName: utilisateur?.first_name,
      lastName: utilisateur?.last_name,
      email: compte.email,
      phoneNumber: utilisateur?.phone_number,
      role: compte.role.name
    }
  };
}

// ========== Fonction : logout ========== 
// Description : Déconnecte un utilisateur en révoquant son token
// Paramètres :
// - token (string) : Le token JWT à révoquer
// - userId (number) : L'ID de l'utilisateur
// Retour : (Promise<object>) Confirmation de la déconnexion
async function logout(token, userId) {
  try {
    // Décoder le token pour obtenir l'expiration
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error('Token invalide.');
    }

    // Calculer la date d'expiration
    const expiresAt = new Date(decoded.exp * 1000);

    // Vérifier si le token n'est pas déjà révoqué
    const existingRevoked = await RevokedToken.findOne({ where: { token } });
    if (existingRevoked) {
      return { message: 'Token déjà révoqué.' };
    }

    // Ajouter le token à la liste des tokens révoqués
    await RevokedToken.create({
      token,
      user_id: userId,
      revoked_at: new Date(),
      expires_at: expiresAt,
      reason: 'logout'
    });

    return { message: 'Déconnexion réussie.' };
  } catch (error) {
    throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
  }
}

// ========== Fonction : isTokenRevoked ========== 
// Description : Vérifie si un token est révoqué
// Paramètres :
// - token (string) : Le token JWT à vérifier
// Retour : (Promise<boolean>) True si le token est révoqué, false sinon
async function isTokenRevoked(token) {
  try {
    const revokedToken = await RevokedToken.findOne({ where: { token } });
    return !!revokedToken;
  } catch (error) {
    console.error('Erreur lors de la vérification du token révoqué:', error);
    return false;
  }
}

// ========== Fonction : cleanupExpiredTokens ========== 
// Description : Nettoie les tokens expirés de la base de données
// Paramètres : Aucun
// Retour : (Promise<number>) Nombre de tokens supprimés
async function cleanupExpiredTokens() {
  try {
    const result = await RevokedToken.destroy({
      where: {
        expires_at: {
          [require('sequelize').Op.lt]: new Date()
        }
      }
    });
    return result;
  } catch (error) {
    console.error('Erreur lors du nettoyage des tokens expirés:', error);
    return 0;
  }
}

module.exports = {
  register,
  login,
  logout,
  isTokenRevoked,
  cleanupExpiredTokens
}; 