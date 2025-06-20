/**
 * Modèle Paiement - Gestion des paiements
 * Table : paiement
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Paiement = sequelize.define('Paiement', {
    idPaiement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    montant: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateHeure: {
        type: DataTypes.DATE,
        allowNull: false
    },
    idCompte: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idTransporteur: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'paiement',
    timestamps: false
});

module.exports = Paiement; 