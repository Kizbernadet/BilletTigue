/**
 * Modèle Envoi - Gestion des envois de colis
 * Table : envoi
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Envoi = sequelize.define('Envoi', {
    idEnvoi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idExpediteur: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    destinataireNom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destinataireTelephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idTransporteur: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idCompte: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'envoi',
    timestamps: false
});

module.exports = Envoi; 