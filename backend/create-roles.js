/**
 * Script de création des rôles
 * Crée les rôles de base avec les timestamps corrects
 */

const { sequelize } = require('./config/database');
const { Role } = require('./models');

async function createRoles() {
    console.log('🔑 CRÉATION DES RÔLES');
    console.log('====================');

    try {
        // Vérifier d'abord combien de rôles existent
        const existingRoles = await Role.count();
        console.log(`📋 Rôles existants: ${existingRoles}`);

        // Définir les rôles à créer
        const rolesToCreate = [
            {
                name: 'admin',
                description: 'Administrateur système'
            },
            {
                name: 'user',
                description: 'Utilisateur standard'
            },
            {
                name: 'freight-carrier',
                description: 'Transporteur de frets'
            },
            {
                name: 'passenger-carrier',
                description: 'Transporteur de passagers'
            }
        ];

        console.log('\n🚀 Création des rôles...');

        // Utiliser bulkCreate avec ignoreDuplicates pour éviter les conflits
        const createdRoles = await Role.bulkCreate(rolesToCreate, {
            ignoreDuplicates: true, // Ignore les doublons
            returning: true
        });

        console.log(`✅ ${createdRoles.length} rôles créés/vérifiés`);

        // Afficher tous les rôles
        console.log('\n📋 Rôles dans la base:');
        const allRoles = await Role.findAll({
            order: [['id', 'ASC']]
        });

        allRoles.forEach(role => {
            console.log(`  ${role.id}. ${role.name} - ${role.description}`);
        });

        console.log(`\n✅ Total: ${allRoles.length} rôles disponibles`);

    } catch (error) {
        console.error('❌ ERREUR lors de la création des rôles:', error);
        throw error;
    }
}

// Fonction principale
async function main() {
    try {
        await createRoles();
        console.log('\n✅ SCRIPT TERMINÉ AVEC SUCCÈS !');
        console.log('Les rôles sont maintenant disponibles pour créer des comptes.');
        
    } catch (error) {
        console.error('❌ ÉCHEC DU SCRIPT:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Exécution si appelé directement
if (require.main === module) {
    main();
}

module.exports = { createRoles }; 