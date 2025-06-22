/**
 * Modèle PointDepot - Gestion des points de dépôt
 * Table : point_depot
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PointDepot = sequelize.define('PointDepot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transporteur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transporteurs',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'point_depot',
    timestamps: false
});

module.exports = PointDepot;