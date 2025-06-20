/**
 * Modèle Utilisateur - Gestion des utilisateurs finaux
 * Table : utilisateur
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
    idUtilisateur: {
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
    tableName: 'utilisateur',
    timestamps: false
});

module.exports = Utilisateur; 