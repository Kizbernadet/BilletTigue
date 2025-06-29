/**
 * Modèle ZonesDesservies - Gestion des zones desservies par les transporteurs
 * Table : zones_desservies
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ZonesDesservies = sequelize.define('ZonesDesservies', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    city_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    region: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    zone_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'both',
        validate: {
            isIn: [['pickup_only', 'delivery_only', 'both']]
        }
    },
    service_frequency: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: [['daily', 'weekly', 'monthly', 'on_demand']]
        }
    },
    max_weight_capacity: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        validate: {
            min: 0
        }
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
    tableName: 'zones_desservies',
    timestamps: false,
    indexes: [
        {
            fields: ['city_name']
        },
        {
            fields: ['transporteur_id']
        },
        {
            fields: ['city_name', 'transporteur_id'],
            unique: true
        }
    ]
});

module.exports = ZonesDesservies; 