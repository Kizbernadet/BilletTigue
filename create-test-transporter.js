/**
 * Script : Création de transporteurs de test
 * Description : Crée plusieurs transporteurs pour tester les fonctionnalités admin
 */

const { sequelize } = require('./config/database');
const { Compte, Transporteur, Role } = require('./models/index');
const bcrypt = require('bcrypt');

const testTransporters = [
  {
    email: 'transport1@test.com',
    password: 'Test123!',
    phone_number: '+223 12345678',
    company_name: 'Transport Express Mali',
    company_type: 'passenger-carrier'
  },
  {
    email: 'transport2@test.com',
    password: 'Test123!',
    phone_number: '+223 87654321',
    company_name: 'Cargo Mali Pro',
    company_type: 'freight-carrier'
  },
  {
    email: 'transport3@test.com',
    password: 'Test123!',
    phone_number: '+223 11223344',
    company_name: 'Mali Transport Mixte',
    company_type: 'mixte'
  },
  {
    email: 'transport4@test.com',
    password: 'Test123!',
    phone_number: '+223 55667788',
    company_name: 'Bamako Express',
    company_type: 'passenger-carrier'
  },
  {
    email: 'transport5@test.com',
    password: 'Test123!',
    phone_number: '+223 99887766',
    company_name: 'Cargo Express',
    company_type: 'freight-carrier'
  }
];

async function createTestTransporters() {
  try {
    console.log('🚀 Création de transporteurs de test...');
    
    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');
    
    // Récupérer le rôle transporteur
    const transporterRole = await Role.findOne({ where: { name: 'transporteur' } });
    if (!transporterRole) {
      throw new Error('Rôle transporteur non trouvé');
    }
    
    let createdCount = 0;
    
    for (const transporterData of testTransporters) {
      try {
        // Vérifier si le transporteur existe déjà
        const existingAccount = await Compte.findOne({ 
          where: { email: transporterData.email } 
        });
        
        if (existingAccount) {
          console.log(`⚠️  Transporteur ${transporterData.email} existe déjà`);
          continue;
        }
        
        // Créer le compte
        const passwordHash = await bcrypt.hash(transporterData.password, 10);
        const compte = await Compte.create({
          email: transporterData.email,
          password_hash: passwordHash,
          status: 'active',
          role_id: transporterRole.id,
          email_verified: true,
          phone_verified: true
        });
        
        // Créer le transporteur
        await Transporteur.create({
          compte_id: compte.id,
          phone_number: transporterData.phone_number,
          company_name: transporterData.company_name,
          company_type: transporterData.company_type
        });
        
        console.log(`✅ Transporteur créé: ${transporterData.company_name} (${transporterData.email})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Erreur création ${transporterData.email}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Création terminée ! ${createdCount} transporteurs créés.`);
    console.log('\n📝 Informations de connexion des transporteurs:');
    testTransporters.forEach(t => {
      console.log(`   📧 ${t.email} | 🔐 ${t.password}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
createTestTransporters(); 