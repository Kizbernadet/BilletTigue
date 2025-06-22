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
    poids: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    dimensions: {
        type: DataTypes.STRING,
        allowNull: true
    },
    valeur: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en_attente'
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