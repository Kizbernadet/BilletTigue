/**
 * Modèle Role - Gestion des rôles utilisateurs
 * Table : role
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
    idRole: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomRole: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'role',
    timestamps: false
});

module.exports = Role; 