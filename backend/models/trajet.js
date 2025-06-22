/**
 * Modèle Trajet - Gestion des trajets de transport
 * Table : trajets
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trajet = sequelize.define('Trajet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departure_city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    arrival_city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'trajets',
    timestamps: false
});

module.exports = Trajet;