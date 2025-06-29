/**
 * Modèle Transporteur - Gestion des transporteurs
 * Table : transporteurs
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transporteur = sequelize.define('Transporteur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'mixte'
    },
    compte_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'comptes',
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
    tableName: 'transporteurs',
    timestamps: false
});

module.exports = Transporteur; 