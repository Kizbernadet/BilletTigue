/**
 * Modèle RevokedToken - Gestion des tokens JWT révoqués
 * Table : revoked_tokens
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RevokedToken = sequelize.define('RevokedToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'comptes',
            key: 'id'
        }
    },
    revoked_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'logout'
    }
}, {
    tableName: 'revoked_tokens',
    timestamps: false,
    indexes: [
        {
            fields: ['token']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['expires_at']
        }
    ]
});

module.exports = RevokedToken; 