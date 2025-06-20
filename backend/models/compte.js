/**
 * Modèle Compte - Gestion des comptes utilisateurs
 * Table : compte
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Compte = sequelize.define('Compte', {
    idCompte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    motDePasse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idRole: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'role',
            key: 'idRole'
        }
    }
}, {
    tableName: 'compte',
    timestamps: false
});

module.exports = Compte; 