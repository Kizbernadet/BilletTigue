/**
 * Nom du fichier : authService.js
 * Description : Service métier pour l'authentification (inscription, connexion, déconnexion)
 * Rôle : service (logique métier)
 */

/**
 * Logique du script refactorisée :
 * 1. Fonction commune pour créer le compte de base (createBaseAccount)
 * 2. Fonctions spécifiques pour créer les profils (createUserProfile, createTransporterProfile, createAdminProfile)
 * 3. Fonctions d'inscription complètes par acteur (registerUser, registerTransporter, registerAdmin)
 * 4. Fonctions de connexion existantes conservées (login, loginUser, loginTransporter)
 * 5. Fonction de déconnexion et gestion des tokens révoqués
 */

const bcrypt = require('bcrypt'); // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const { Compte, Utilisateur, Role, RevokedToken, Transporteur, Administrateur } = require('../models/index'); // Modèles avec associations

// ========== FONCTIONS HELPER - COMMUNES ========== 

// ========== Fonction : createBaseAccount ========== 
// Description : Crée un compte de base dans la table comptes
// Paramètres :
// - email (string) : Email du compte
// - password (string) : Mot de passe en clair
// - roleName (string) : Nom du rôle ('utilisateur', 'transporter', 'admin')
// Retour : (Promise<object>) Objet compte créé avec le rôle
async function createBaseAccount(email, password, roleName) {
  // Vérifier si l'email existe déjà
  const compteExistant = await Compte.findOne({ where: { email } });
  if (compteExistant) {
    throw new Error('Cet email est déjà utilisé.');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Récupérer le rôle
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new Error(`Le rôle '${roleName}' n'existe pas.`);
  }

  // Créer le compte
  const compte = await Compte.create({
    email,
    password_hash: hashedPassword,
    status: 'active',
    role_id: role.id,
    created_at: new Date(),
    updated_at: new Date()
  });

  return { compte, role };
}

// ========== Fonction : generateJWT ========== 
// Description : Génère un token JWT pour un utilisateur
// Paramètres :
// - compteData (object) : Données du compte { id, email, role }
// - profileData (object) : Données du profil { id, ... }
// Retour : (string) Token JWT
function generateJWT(compteData, profileData = {}) {
  const payload = { 
    id: compteData.id, 
    email: compteData.email,
    role: compteData.role
  };

  // Ajouter l'ID spécifique selon le type de profil
  if (profileData.id) {
    if (compteData.role === 'user' || compteData.role === 'admin') {
      payload.userId = profileData.id;
    } else if (compteData.role === 'transporteur') {
      payload.transporteurId = profileData.id;
    }
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'billettigue_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
}

// ========== FONCTIONS DE CRÉATION DE PROFILS ========== 

// ========== Fonction : createUserProfile ========== 
// Description : Crée un profil utilisateur dans la table utilisateurs
// Paramètres :
// - compteId (number) : ID du compte lié
// - profileData (object) : { firstName, lastName, phoneNumber }
// Retour : (Promise<object>) Objet utilisateur créé
async function createUserProfile(compteId, profileData) {
  const utilisateur = await Utilisateur.create({
    last_name: profileData.lastName || '',
    first_name: profileData.firstName || '',
    phone_number: profileData.phoneNumber || '',
    compte_id: compteId,
    created_at: new Date(),
    updated_at: new Date()
  });

  return utilisateur;
}

// ========== Fonction : createTransporterProfile ========== 
// Description : Crée un profil transporteur dans la table transporteurs
// Paramètres :
// - compteId (number) : ID du compte lié
// - profileData (object) : { phoneNumber, companyName, companyType }
// Retour : (Promise<object>) Objet transporteur créé
async function createTransporterProfile(compteId, profileData) {
  const transporteur = await Transporteur.create({
    phone_number: profileData.phoneNumber || '',
    company_name: profileData.companyName || '',
    company_type: profileData.companyType || 'mixte',
    compte_id: compteId,
    created_at: new Date(),
    updated_at: new Date()
  });

  return transporteur;
}

// ========== Fonction : createAdminProfile ========== 
// Description : Crée un profil administrateur dans la table administrateurs
// Paramètres :
// - compteId (number) : ID du compte lié
// - profileData (object) : { firstName, lastName }
// Retour : (Promise<object>) Objet administrateur créé
async function createAdminProfile(compteId, profileData) {
  const administrateur = await Administrateur.create({
    last_name: profileData.lastName || '',
    first_name: profileData.firstName || '',
    compte_id: compteId,
    created_at: new Date(),
    updated_at: new Date()
  });

  return administrateur;
}

// ========== FONCTIONS D'INSCRIPTION SPÉCIFIQUES ========== 

// ========== Fonction : registerUser ========== 
// Description : Inscription complète d'un utilisateur
// Paramètres :
// - data (object) : { email, password, firstName, lastName, phoneNumber }
// Retour : (Promise<object>) Token et infos utilisateur
async function registerUser(data) {
  try {
    // 1. Créer le compte de base
    const { compte, role } = await createBaseAccount(data.email, data.password, 'user');

    // 2. Créer le profil utilisateur
    const utilisateur = await createUserProfile(compte.id, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber
    });

    // 3. Générer le token JWT
    const token = generateJWT(
      { id: compte.id, email: compte.email, role: role.name },
      { id: utilisateur.id }
    );

    // 4. Retourner la réponse
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
  } catch (error) {
    throw new Error(`Erreur inscription utilisateur: ${error.message}`);
  }
}

// ========== Fonction : registerTransporter ========== 
// Description : Inscription complète d'un transporteur
// Paramètres :
// - data (object) : { email, password, phoneNumber, companyName, companyType, transporterRole }
// Retour : (Promise<object>) Token et infos transporteur
async function registerTransporter(data) {
  try {
    // 1. Créer le compte de base avec le rôle 'transporteur'
    const { compte, role } = await createBaseAccount(data.email, data.password, 'transporteur');

    // 2. Créer le profil transporteur
    const transporteur = await createTransporterProfile(compte.id, {
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      companyType: data.companyType
    });

    // 3. Générer le token JWT
    const token = generateJWT(
      { id: compte.id, email: compte.email, role: role.name },
      { id: transporteur.id }
    );

    // 4. Retourner la réponse
    return {
      token,
      user: {
        id: transporteur.id,
        email: compte.email,
        phoneNumber: transporteur.phone_number,
        companyName: transporteur.company_name,
        companyType: transporteur.company_type,
        role: role.name
      }
    };
  } catch (error) {
    throw new Error(`Erreur inscription transporteur: ${error.message}`);
  }
}

// ========== Fonction : registerAdmin ========== 
// Description : Inscription complète d'un administrateur
// Paramètres :
// - data (object) : { email, password, firstName, lastName }
// Retour : (Promise<object>) Token et infos administrateur
async function registerAdmin(data) {
  try {
    // 1. Créer le compte de base
    const { compte, role } = await createBaseAccount(data.email, data.password, 'admin');

    // 2. Créer le profil administrateur
    const administrateur = await createAdminProfile(compte.id, {
      firstName: data.firstName,
      lastName: data.lastName
    });

    // 3. Générer le token JWT
    const token = generateJWT(
      { id: compte.id, email: compte.email, role: role.name },
      { id: administrateur.id }
    );

    // 4. Retourner la réponse
    return {
      token,
      user: {
        id: administrateur.id,
        firstName: administrateur.first_name,
        lastName: administrateur.last_name,
        email: compte.email,
        role: role.name
      }
    };
  } catch (error) {
    throw new Error(`Erreur inscription administrateur: ${error.message}`);
  }
}



// ========== FONCTIONS DE CONNEXION (CONSERVÉES) ========== 

// ========== Fonction : login ========== 
// Description : Authentifie un utilisateur existant (générique, sans validation de rôle)
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

  // Récupérer l'utilisateur lié selon le rôle
  let profile = null;
  let profileData = {};

  if (compte.role.name === 'user' || compte.role.name === 'admin') {
    profile = await Utilisateur.findOne({ where: { compte_id: compte.id } }) ||
              await Administrateur.findOne({ where: { compte_id: compte.id } });
    if (profile) {
      profileData = {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phoneNumber: profile.phone_number
      };
    }
  } else if (compte.role.name === 'transporteur') {
    profile = await Transporteur.findOne({ where: { compte_id: compte.id } });
    if (profile) {
      profileData = {
        id: profile.id,
        phoneNumber: profile.phone_number,
        companyName: profile.company_name,
        companyType: profile.company_type
      };
    }
  }

  // Générer un token JWT
  const token = generateJWT(
    { id: compte.id, email: compte.email, role: compte.role.name },
    profileData
  );

  // Retourner le token et les infos utilisateur
  return {
    token,
    user: {
      ...profileData,
      email: compte.email,
      role: compte.role.name
    }
  };
}

// ========== Fonction : loginUser ========== 
// Description : Authentifie un utilisateur avec validation du rôle (utilisateur ou admin)
// Paramètres :
// - credentials (object) : { email, password }
// Retour : (Promise<object>) Un objet contenant le token JWT et les infos utilisateur
async function loginUser(credentials) {
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

  // Vérifier que le rôle est autorisé (user ou admin)
  if (compte.role.name !== 'user' && compte.role.name !== 'admin') {
    throw new Error('Ce compte n\'est pas un utilisateur. Veuillez utiliser le formulaire transporteur.');
  }

  // Récupérer le profil utilisateur ou administrateur
  let profile = null;
  if (compte.role.name === 'user') {
    profile = await Utilisateur.findOne({ where: { compte_id: compte.id } });
  } else if (compte.role.name === 'admin') {
    profile = await Administrateur.findOne({ where: { compte_id: compte.id } });
  }

  // Générer un token JWT
  const token = generateJWT(
    { id: compte.id, email: compte.email, role: compte.role.name },
    { id: profile?.id }
  );

  // Retourner le token et les infos utilisateur
  return {
    token,
    user: {
      id: profile?.id,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      email: compte.email,
      phoneNumber: profile?.phone_number,
      role: compte.role.name
    }
  };
}

// ========== Fonction : loginTransporter ========== 
// Description : Authentifie un transporteur avec validation du rôle (transporteur ou admin)
// Paramètres :
// - credentials (object) : { email, password, numeroLicence? }
// Retour : (Promise<object>) Un objet contenant le token JWT et les infos utilisateur
async function loginTransporter(credentials) {
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

  // Vérifier que le rôle est autorisé (transporteur ou admin)
  if (compte.role.name !== 'transporteur' && compte.role.name !== 'admin') {
    throw new Error('Ce compte n\'est pas un transporteur. Veuillez utiliser le formulaire utilisateur.');
  }

  // Si c'est un transporteur (pas admin), vérifier le numéro de licence
  if (compte.role.name === 'transporteur' && credentials.numeroLicence) {
    // Ici on pourrait ajouter une validation du numéro de licence
    // Pour l'instant, on accepte tout numéro de licence
    console.log(`Validation du numéro de licence: ${credentials.numeroLicence}`);
  }

  // Récupérer le transporteur lié
  const transporteur = await Transporteur.findOne({ where: { compte_id: compte.id } });

  // Générer un token JWT
  const token = generateJWT(
    { id: compte.id, email: compte.email, role: compte.role.name },
    { id: transporteur?.id }
  );

  // Retourner le token et les infos transporteur
  return {
    token,
    user: {
      id: transporteur?.id,
      email: compte.email,
      phoneNumber: transporteur?.phone_number,
      companyName: transporteur?.company_name,
      companyType: transporteur?.company_type,
      role: compte.role.name
    }
  };
}

// ========== FONCTIONS DE DÉCONNEXION ET GESTION DES TOKENS ========== 

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
  // Nouvelles fonctions d'inscription spécifiques
  registerUser,
  registerTransporter,
  registerAdmin,
  
  // Fonctions de connexion conservées
  login,
  loginUser,
  loginTransporter,
  
  // Fonctions de déconnexion et gestion des tokens
  logout,
  isTokenRevoked,
  cleanupExpiredTokens,
  
  // Fonctions helper (pour tests éventuels)
  createBaseAccount,
  createUserProfile,
  createTransporterProfile,
  createAdminProfile
};