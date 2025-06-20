/**
 * Modèle PointDepot - Gestion des points de dépôt
 * Table : pointDepot
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PointDepot = sequelize.define('PointDepot', {
    idPointDepot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    adresse: {
        type: DataTypes.STRING,
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
    tableName: 'pointDepot',
    timestamps: false
});

module.exports = PointDepot;