/**
 * Migration : Ajouter les champs pour l'option remboursable
 * Date : 2024-12-14
 * Description : Ajoute refundable_option, refund_supplement_amount, total_amount à la table reservations
 */

const { sequelize } = require('../config/database');

async function up() {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
        console.log('🔄 Début de la migration : Ajout des champs option remboursable...');
        
        // Ajouter les nouveaux champs
        await queryInterface.addColumn('reservations', 'refundable_option', {
            type: 'BOOLEAN',
            allowNull: false,
            defaultValue: false,
            comment: 'Indique si la réservation a l\'option remboursable activée'
        });
        
        await queryInterface.addColumn('reservations', 'refund_supplement_amount', {
            type: 'DECIMAL(10,2)',
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Montant du supplément pour l\'option remboursable'
        });
        
        await queryInterface.addColumn('reservations', 'total_amount', {
            type: 'DECIMAL(10,2)',
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Montant total de la réservation (base + supplément remboursable)'
        });
        
        // Modifier compte_id pour permettre NULL (réservations invité)
        await queryInterface.changeColumn('reservations', 'compte_id', {
            type: 'INTEGER',
            allowNull: true,
            references: {
                model: 'comptes',
                key: 'id'
            }
        });
        
        // Mettre à jour les réservations existantes avec total_amount basé sur les paiements
        await sequelize.query(`
            UPDATE reservations r 
            SET total_amount = (
                SELECT COALESCE(p.amount, 0) 
                FROM paiements p 
                WHERE p.reservation_id = r.id 
                LIMIT 1
            )
            WHERE total_amount = 0
        `);
        
        console.log('✅ Migration terminée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        throw error;
    }
}

async function down() {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
        console.log('🔄 Début du rollback : Suppression des champs option remboursable...');
        
        // Supprimer les colonnes ajoutées
        await queryInterface.removeColumn('reservations', 'refundable_option');
        await queryInterface.removeColumn('reservations', 'refund_supplement_amount');
        await queryInterface.removeColumn('reservations', 'total_amount');
        
        // Remettre compte_id NOT NULL
        await queryInterface.changeColumn('reservations', 'compte_id', {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'comptes',
                key: 'id'
            }
        });
        
        console.log('✅ Rollback terminé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors du rollback:', error);
        throw error;
    }
}

module.exports = { up, down };

// Exécution directe si le script est appelé
if (require.main === module) {
    console.log('🚀 Exécution de la migration option remboursable...');
    
    up()
        .then(() => {
            console.log('🎉 Migration option remboursable terminée !');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Échec de la migration:', error);
            process.exit(1);
        });
} 