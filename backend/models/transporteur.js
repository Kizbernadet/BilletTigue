/**
 * Modèle Transporteur - Gestion des transporteurs
 * Table : transporteur
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transporteur = sequelize.define('Transporteur', {
    idTransporteur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idCompte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compte',
            key: 'idCompte'
        }
    }
}, {
    tableName: 'transporteur',
    timestamps: false
});

module.exports = Transporteur; 