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
const Compte = require('../models/compte'); // Modèle Compte Sequelize
const Utilisateur = require('../models/utilisateur'); // Modèle Utilisateur Sequelize

// ========== Fonction : register ========== 
// Description : Inscrit un nouvel utilisateur dans la base
// Paramètres :
// - data (object) : { email, motDePasse, nom, prenom, telephone }
// Retour : (Promise<object>) Un objet contenant le token JWT et les infos utilisateur
async function register(data) {
  // Vérifier si l'email existe déjà
  const compteExistant = await Compte.findOne({ where: { email: data.email } });
  if (compteExistant) {
    throw new Error('Cet email est déjà utilisé.');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(data.motDePasse, 10);

  // Créer le compte (rôle par défaut : utilisateur, idRole = 1 à adapter selon ta table role)
  const compte = await Compte.create({
    email: data.email,
    motDePasse: hashedPassword,
    statut: 'actif',
    idRole: 1 // À adapter selon la logique de ton projet
  });

  // Créer l'utilisateur lié au compte
  const utilisateur = await Utilisateur.create({
    nom: data.nom,
    prenom: data.prenom,
    telephone: data.telephone,
    idCompte: compte.idCompte
  });

  // Générer un token JWT
  const token = jwt.sign(
    { idCompte: compte.idCompte, idUtilisateur: utilisateur.idUtilisateur, email: compte.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  // Retourner le token et les infos utilisateur
  return {
    token,
    utilisateur: {
      id: utilisateur.idUtilisateur,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: compte.email,
      telephone: utilisateur.telephone
    }
  };
}

// ========== Fonction : login ========== 
// Description : Authentifie un utilisateur existant
// Paramètres :
// - credentials (object) : { email, motDePasse }
// Retour : (Promise<object>) Un objet contenant le token JWT et les infos utilisateur
async function login(credentials) {
  // Chercher le compte par email
  const compte = await Compte.findOne({ where: { email: credentials.email } });
  if (!compte) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Vérifier le mot de passe
  const isMatch = await bcrypt.compare(credentials.motDePasse, compte.motDePasse);
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Récupérer l'utilisateur lié
  const utilisateur = await Utilisateur.findOne({ where: { idCompte: compte.idCompte } });

  // Générer un token JWT
  const token = jwt.sign(
    { idCompte: compte.idCompte, idUtilisateur: utilisateur.idUtilisateur, email: compte.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  // Retourner le token et les infos utilisateur
  return {
    token,
    utilisateur: {
      id: utilisateur.idUtilisateur,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: compte.email,
      telephone: utilisateur.telephone
    }
  };
}

module.exports = {
  register,
  login
}; 