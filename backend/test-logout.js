/**
 * Script de test pour la fonctionnalité de déconnexion
 * Teste l'endpoint de déconnexion et la vérification des tokens révoqués
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Variables globales pour stocker les données de test
let authToken = null;
let userData = null;

// ========== Fonction : testLogin ==========
async function testLogin() {
    console.log('🔐 Test de connexion...');
    
    try {
        const response = await api.post('/auth/login', {
            email: 'admin@billettigue.com',
            password: 'Admin123!'
        });

        if (response.data.token) {
            authToken = response.data.token;
            userData = response.data.user;
            console.log('✅ Connexion réussie');
            console.log(`   Utilisateur: ${userData.firstName} ${userData.lastName}`);
            console.log(`   Email: ${userData.email}`);
            console.log(`   Rôle: ${userData.role}`);
            return true;
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.response?.data?.message || error.message);
        return false;
    }
}

// ========== Fonction : testLogout ==========
async function testLogout() {
    console.log('\n🚪 Test de déconnexion...');
    
    if (!authToken) {
        console.log('❌ Pas de token disponible pour la déconnexion');
        return false;
    }

    try {
        const response = await api.post('/auth/logout', {}, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log('✅ Déconnexion réussie');
        console.log(`   Message: ${response.data.message}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur de déconnexion:', error.response?.data?.message || error.message);
        return false;
    }
}

// ========== Fonction : testRevokedToken ==========
async function testRevokedToken() {
    console.log('\n🔒 Test d\'accès avec token révoqué...');
    
    if (!authToken) {
        console.log('❌ Pas de token disponible pour le test');
        return false;
    }

    try {
        // Essayer d'accéder à une route protégée avec le token révoqué
        const response = await api.get('/users/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log('❌ Le token révoqué fonctionne encore (problème de sécurité)');
        return false;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Token correctement révoqué - accès refusé');
            console.log(`   Message: ${error.response.data.message}`);
            return true;
        } else {
            console.error('❌ Erreur inattendue:', error.response?.data?.message || error.message);
            return false;
        }
    }
}

// ========== Fonction : testNewLogin ==========
async function testNewLogin() {
    console.log('\n🔄 Test de nouvelle connexion après déconnexion...');
    
    try {
        const response = await api.post('/auth/login', {
            email: 'admin@billettigue.com',
            password: 'Admin123!'
        });

        if (response.data.token) {
            const newToken = response.data.token;
            console.log('✅ Nouvelle connexion réussie');
            console.log(`   Nouveau token: ${newToken.substring(0, 20)}...`);
            
            // Tester l'accès avec le nouveau token
            const profileResponse = await api.get('/users/profile', {
                headers: {
                    'Authorization': `Bearer ${newToken}`
                }
            });

            console.log('✅ Accès avec nouveau token réussi');
            return true;
        }
    } catch (error) {
        console.error('❌ Erreur de nouvelle connexion:', error.response?.data?.message || error.message);
        return false;
    }
}

// ========== Fonction principale ==========
async function runTests() {
    console.log('🧪 DÉMARRAGE DES TESTS DE DÉCONNEXION');
    console.log('=====================================\n');

    let allTestsPassed = true;

    // Test 1: Connexion
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
        console.log('❌ Test de connexion échoué - arrêt des tests');
        return;
    }

    // Test 2: Déconnexion
    const logoutSuccess = await testLogout();
    if (!logoutSuccess) {
        allTestsPassed = false;
    }

    // Test 3: Vérification du token révoqué
    const revokedTestSuccess = await testRevokedToken();
    if (!revokedTestSuccess) {
        allTestsPassed = false;
    }

    // Test 4: Nouvelle connexion
    const newLoginSuccess = await testNewLogin();
    if (!newLoginSuccess) {
        allTestsPassed = false;
    }

    // Résumé des tests
    console.log('\n📊 RÉSUMÉ DES TESTS');
    console.log('===================');
    
    if (allTestsPassed) {
        console.log('🎉 Tous les tests sont passés avec succès !');
        console.log('✅ La fonctionnalité de déconnexion fonctionne correctement');
    } else {
        console.log('❌ Certains tests ont échoué');
        console.log('🔧 Vérifiez la configuration et les logs');
    }

    console.log('\n📝 Points vérifiés :');
    console.log('   - Connexion utilisateur');
    console.log('   - Déconnexion avec révocation du token');
    console.log('   - Vérification que le token révoqué ne fonctionne plus');
    console.log('   - Possibilité de se reconnecter après déconnexion');
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
    runTests().catch(error => {
        console.error('❌ Erreur lors de l\'exécution des tests:', error);
        process.exit(1);
    });
}

module.exports = {
    testLogin,
    testLogout,
    testRevokedToken,
    testNewLogin,
    runTests
}; 