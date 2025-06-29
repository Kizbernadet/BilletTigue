/**
 * Modèle Colis - Gestion des colis dans les envois
 * Table : colis
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Colis = sequelize.define('Colis', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    dimensions: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    envoi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'envois',
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
    tableName: 'colis',
    timestamps: false
});

module.exports = Colis; 