/**
 * Fichier d'index des modèles - Définition des associations entre modèles
 *
 * Ce fichier centralise l'importation de tous les modèles Sequelize et définit
 * les relations (associations) entre eux, conformément au schéma de la base de données.
 *
 * Associations principales :
 * - Role 1,N Compte
 * - Compte 1,1 Utilisateur/Transporteur/Administrateur
 * - Transporteur 1,N PointDepot
 * - Transporteur 1,N Trajet
 * - Utilisateur 1,N Envoi
 * - Transporteur 1,N Envoi
 * - Compte 1,N Envoi
 * - Envoi 1,1 Paiement
 * - Compte 1,N Reservation
 * - Compte 1,N RevokedToken (pour la déconnexion)
 *
 * À importer dans server.js pour initialiser toutes les associations.
 */

const Role = require('./role');
const Compte = require('./compte');
const Administrateur = require('./administrateur');
const Transporteur = require('./transporteur');
const Utilisateur = require('./utilisateur');
const PointDepot = require('./PointDepot');
const Trajet = require('./trajet');
const Envoi = require('./envoi');
const Paiement = require('./paiement');
const Reservation = require('./reservation');
const Colis = require('./colis');
const RevokedToken = require('./revokedToken');

// Role 1,N Compte
Role.hasMany(Compte, { foreignKey: 'role_id', as: 'comptes' });
Compte.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// Compte 1,1 Utilisateur/Transporteur/Administrateur
Compte.hasOne(Utilisateur, { foreignKey: 'compte_id', as: 'utilisateur' });
Utilisateur.belongsTo(Compte, { foreignKey: 'compte_id', as: 'compte' });
Compte.hasOne(Transporteur, { foreignKey: 'compte_id', as: 'transporteur' });
Transporteur.belongsTo(Compte, { foreignKey: 'compte_id', as: 'compte' });
Compte.hasOne(Administrateur, { foreignKey: 'compte_id', as: 'administrateur' });
Administrateur.belongsTo(Compte, { foreignKey: 'compte_id', as: 'compte' });

// Compte 1,N RevokedToken (pour la déconnexion)
Compte.hasMany(RevokedToken, { foreignKey: 'user_id', as: 'revokedTokens' });
RevokedToken.belongsTo(Compte, { foreignKey: 'user_id', as: 'compte' });

// Transporteur 1,N PointDepot
Transporteur.hasMany(PointDepot, { foreignKey: 'transporteur_id', as: 'pointsDepot' });
PointDepot.belongsTo(Transporteur, { foreignKey: 'transporteur_id', as: 'transporteur' });

// Compte 1,N Trajet (un compte peut créer plusieurs trajets)
Compte.hasMany(Trajet, { foreignKey: 'idCompte', as: 'trajets' });
Trajet.belongsTo(Compte, { foreignKey: 'idCompte', as: 'compte' });

// Utilisateur 1,N Envoi
Utilisateur.hasMany(Envoi, { foreignKey: 'expediteur_id', as: 'envois' });
Envoi.belongsTo(Utilisateur, { foreignKey: 'expediteur_id', as: 'expediteur' });

// Transporteur 1,N Envoi
Transporteur.hasMany(Envoi, { foreignKey: 'transporteur_id', as: 'envoisTransporteur' });
Envoi.belongsTo(Transporteur, { foreignKey: 'transporteur_id', as: 'transporteur' });

// Compte 1,N Envoi
Compte.hasMany(Envoi, { foreignKey: 'compte_id', as: 'envoisCompte' });
Envoi.belongsTo(Compte, { foreignKey: 'compte_id', as: 'compte' });

// Envoi 1,1 Paiement
Envoi.hasOne(Paiement, { foreignKey: 'envoi_id', as: 'paiement' });
Paiement.belongsTo(Envoi, { foreignKey: 'envoi_id', as: 'envoi' });

// Compte 1,N Reservation
Compte.hasMany(Reservation, { foreignKey: 'compte_id', as: 'reservations' });
Reservation.belongsTo(Compte, { foreignKey: 'compte_id', as: 'compte' });

// Trajet 1,N Reservation
Trajet.hasMany(Reservation, { foreignKey: 'trajet_id', as: 'reservations' });
Reservation.belongsTo(Trajet, { foreignKey: 'trajet_id', as: 'trajet' });

// Envoi 1,N Colis
Envoi.hasMany(Colis, { foreignKey: 'envoi_id', as: 'colis' });
Colis.belongsTo(Envoi, { foreignKey: 'envoi_id', as: 'envoi' });

module.exports = {
  Role,
  Compte,
  Administrateur,
  Transporteur,
  Utilisateur,
  PointDepot,
  Trajet,
  Envoi,
  Paiement,
  Reservation,
  Colis,
  RevokedToken
}; 