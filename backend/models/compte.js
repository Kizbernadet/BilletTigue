/**
 * Modèle Compte - Gestion des comptes utilisateurs
 * Table : comptes
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Compte = sequelize.define('Compte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    phone_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    login_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    failed_logins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    last_failed_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    account_locked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    password_changed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
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
    tableName: 'comptes',
    timestamps: false
});

module.exports = Compte; 