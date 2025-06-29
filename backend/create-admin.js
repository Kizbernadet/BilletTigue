/**
 * Script simple pour créer un compte administrateur
 * Utilise directement les modèles Sequelize
 */

require('dotenv').config();

const bcrypt = require('bcrypt');
const { sequelize } = require('./config/database');
const { Role, Compte, Administrateur } = require('./models');

async function createAdmin() {
    console.log('👨‍💼 CRÉATION DU COMPTE ADMINISTRATEUR');
    console.log('====================================');

    try {
        // Configuration par défaut (peut être surchargée par les variables d'environnement)
        const adminData = {
            email: process.env.ADMIN_EMAIL || 'admin@billettigue.com',
            password: process.env.ADMIN_PWD || 'Admin123!',
            lastName: process.env.ADMIN_LAST_NAME || 'Admin',
            firstName: process.env.ADMIN_FIRST_NAME || 'Super'
        };

        console.log('📋 Configuration:');
        console.log(`📧 Email: ${adminData.email}`);
        console.log(`👤 Nom: ${adminData.firstName} ${adminData.lastName}`);
        console.log(`🔐 Mot de passe: ${'*'.repeat(adminData.password.length)}`);

        // Vérifier si le rôle admin existe
        console.log('\n🔍 Vérification du rôle admin...');
        const adminRole = await Role.findOne({
            where: { name: 'admin' }
        });

        if (!adminRole) {
            throw new Error('Le rôle "admin" n\'existe pas. Veuillez d\'abord créer les rôles avec le script create-roles.js');
        }

        console.log(`✅ Rôle admin trouvé (ID: ${adminRole.id})`);

        // Vérifier si un admin existe déjà
        console.log('\n🔍 Vérification de l\'existence d\'un admin...');
        const existingAdmin = await Compte.findOne({
            where: { email: adminData.email },
            include: [{
                model: Administrateur,
                as: 'administrateur'
            }]
        });

        if (existingAdmin) {
            console.log('⚠️  Un compte avec cet email existe déjà:', existingAdmin.email);
            if (existingAdmin.administrateur) {
                console.log('✅ C\'est déjà un compte administrateur');
            } else {
                console.log('❌ Ce compte existe mais n\'est pas administrateur');
            }
            return;
        }

        // Hasher le mot de passe
        console.log('\n🔐 Hashage du mot de passe...');
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
        console.log('✅ Mot de passe hashé');

        // Démarrer une transaction
        const transaction = await sequelize.transaction();

        try {
            // Créer le compte
            console.log('\n👤 Création du compte...');
            const compte = await Compte.create({
                email: adminData.email,
                password_hash: hashedPassword,
                status: 'active',
                role_id: adminRole.id
            }, { transaction });

            console.log(`✅ Compte créé (ID: ${compte.id})`);

            // Créer le profil administrateur
            console.log('\n👨‍💼 Création du profil administrateur...');
            const admin = await Administrateur.create({
                last_name: adminData.lastName,
                first_name: adminData.firstName,
                compte_id: compte.id
            }, { transaction });

            console.log(`✅ Administrateur créé (ID: ${admin.id})`);

            // Valider la transaction
            await transaction.commit();

            // Vérification finale
            console.log('\n🔍 Vérification finale...');
            const createdAdmin = await Compte.findByPk(compte.id, {
                include: [
                    {
                        model: Role,
                        as: 'role'
                    },
                    {
                        model: Administrateur,
                        as: 'administrateur'
                    }
                ]
            });

            console.log('✅ Vérification réussie:');
            console.log(`   📧 Email: ${createdAdmin.email}`);
            console.log(`   🎭 Rôle: ${createdAdmin.role.name}`);
            console.log(`   👤 Nom: ${createdAdmin.administrateur.first_name} ${createdAdmin.administrateur.last_name}`);
            console.log(`   📊 Statut: ${createdAdmin.status}`);

            console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
            console.log('Vous pouvez maintenant vous connecter avec ces identifiants.');

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error('\n❌ ERREUR lors de la création:', error.message);
        throw error;
    }
}

// Fonction principale
async function main() {
    try {
        await createAdmin();
        
    } catch (error) {
        console.error('\n❌ ÉCHEC DE LA CRÉATION DU COMPTE ADMIN');
        console.error('Erreur:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Exécution si appelé directement
if (require.main === module) {
    main();
}

module.exports = { createAdmin }; 