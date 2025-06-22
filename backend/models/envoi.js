/**
 * Modèle Envoi - Gestion des envois de colis
 * Table : envois
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Envoi = sequelize.define('Envoi', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    expediteur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateurs',
            key: 'id'
        }
    },
    recipient_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipient_phone: {
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
    tableName: 'envois',
    timestamps: false
});

module.exports = Envoi; 