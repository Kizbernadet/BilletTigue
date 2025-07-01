/**
 * Modèle Reservation - Gestion des réservations
 * Table : reservations
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reservation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    passenger_first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passenger_last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    seats_reserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    refundable_option: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indique si la réservation a l\'option remboursable activée'
    },
    refund_supplement_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Montant du supplément pour l\'option remboursable'
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Montant total de la réservation (base + supplément remboursable)'
    },
    trajet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trajets',
            key: 'id'
        }
    },
    compte_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    tableName: 'reservations',
    timestamps: false
});

module.exports = Reservation; 