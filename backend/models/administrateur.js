/**
 * Modèle Administrateur - Gestion des administrateurs
 * Table : administrateurs
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Administrateur = sequelize.define('Administrateur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'administrateurs',
    timestamps: false
});

module.exports = Administrateur; 