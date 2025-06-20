/**
 * Modèle Administrateur - Gestion des administrateurs
 * Table : administrateur
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Administrateur = sequelize.define('Administrateur', {
    idAdmin: {
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
    idCompte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compte',
            key: 'idCompte'
        }
    }
}, {
    tableName: 'administrateur',
    timestamps: false
});

module.exports = Administrateur; 