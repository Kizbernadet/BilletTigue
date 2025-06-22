/**
 * Nom du fichier : authService.js
 * Description : Service métier pour l'authentification (inscription, connexion)
 * Rôle : service (logique métier)
 */

/**
 * Logique du script :
 * 1. Inscription d'un nouvel utilisateur (register)
 * 2. Connexion d'un utilisateur existant (login)
 * 3. Hashage du mot de passe et génération de JWT
 */

const bcrypt = require('bcrypt'); // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const { Compte, Utilisateur, Role } = require('../models/index'); // Modèles avec associations

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

module.exports = {
  register,
  login
}; 