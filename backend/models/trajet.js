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
        type: DataTypes.STRING(100),
        allowNull: false
    },
    arrival_city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    seats_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 50
        }
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active'
    },
    accepts_packages: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    max_package_weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    departure_point: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    arrival_point: {
        type: DataTypes.STRING(200),
        allowNull: true
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