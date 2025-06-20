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
 *
 * À importer dans server.js pour initialiser toutes les associations.
 */

const Role = require('./Role');
const Compte = require('./Compte');
const Administrateur = require('./Administrateur');
const Transporteur = require('./Transporteur');
const Utilisateur = require('./Utilisateur');
const PointDepot = require('./PointDepot');
const Trajet = require('./Trajet');
const Envoi = require('./Envoi');
const Paiement = require('./Paiement');
const Reservation = require('./Reservation');

// Role 1,N Compte
Role.hasMany(Compte, { foreignKey: 'idRole', as: 'comptes' });
Compte.belongsTo(Role, { foreignKey: 'idRole', as: 'role' });

// Compte 1,1 Utilisateur/Transporteur/Administrateur
Compte.hasOne(Utilisateur, { foreignKey: 'idCompte', as: 'utilisateur' });
Utilisateur.belongsTo(Compte, { foreignKey: 'idCompte', as: 'compte' });
Compte.hasOne(Transporteur, { foreignKey: 'idCompte', as: 'transporteur' });
Transporteur.belongsTo(Compte, { foreignKey: 'idCompte', as: 'compte' });
Compte.hasOne(Administrateur, { foreignKey: 'idCompte', as: 'administrateur' });
Administrateur.belongsTo(Compte, { foreignKey: 'idCompte', as: 'compte' });

// Transporteur 1,N PointDepot
Transporteur.hasMany(PointDepot, { foreignKey: 'idTransporteur', as: 'pointsDepot' });
PointDepot.belongsTo(Transporteur, { foreignKey: 'idTransporteur', as: 'transporteur' });

// Transporteur 1,N Trajet
Transporteur.hasMany(Trajet, { foreignKey: 'idTransporteur', as: 'trajets' });
Trajet.belongsTo(Transporteur, { foreignKey: 'idTransporteur', as: 'transporteur' });

// Utilisateur 1,N Envoi
Utilisateur.hasMany(Envoi, { foreignKey: 'idExpediteur', as: 'envois' });
Envoi.belongsTo(Utilisateur, { foreignKey: 'idExpediteur', as: 'expediteur' });

// Transporteur 1,N Envoi
Transporteur.hasMany(Envoi, { foreignKey: 'idTransporteur', as: 'envoisTransporteur' });
Envoi.belongsTo(Transporteur, { foreignKey: 'idTransporteur', as: 'transporteur' });

// Compte 1,N Envoi
Compte.hasMany(Envoi, { foreignKey: 'idCompte', as: 'envoisCompte' });
Envoi.belongsTo(Compte, { foreignKey: 'idCompte', as: 'compte' });

// Envoi 1,1 Paiement
Envoi.hasOne(Paiement, { foreignKey: 'idEnvoi', as: 'paiement' });
Paiement.belongsTo(Envoi, { foreignKey: 'idEnvoi', as: 'envoi' });

// Compte 1,N Reservation
Compte.hasMany(Reservation, { foreignKey: 'idCompte', as: 'reservations' });
Reservation.belongsTo(Compte, { foreignKey: 'idCompte', as: 'compte' });

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
  Reservation
}; 