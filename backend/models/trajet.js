/**
 * Modèle Trajet - Gestion des trajets de transport
 * Table : trajet
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trajet = sequelize.define('Trajet', {
    idTrajet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    villeDepart: {
        type: DataTypes.STRING,
        allowNull: false
    },
    villeArrivee: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateHeure: {
        type: DataTypes.DATE,
        allowNull: false
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    idTransporteur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transporteur',
            key: 'idTransporteur'
        }
    }
}, {
    tableName: 'trajet',
    timestamps: false
});

module.exports = Trajet;