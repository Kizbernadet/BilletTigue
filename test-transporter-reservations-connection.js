/**
 * Test de connexion aux routes de réservations transporteur
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testConnection() {
    console.log('🧪 Test de connexion aux routes de réservations transporteur...\n');
    
    try {
        // Test 1: Vérifier que le serveur répond
        console.log('1️⃣ Test de connexion au serveur...');
        try {
            const healthResponse = await axios.get(`${API_BASE_URL}/api/auth/login`);
            console.log('✅ Serveur accessible (route auth disponible)');
        } catch (error) {
            if (error.response && error.response.status === 405) {
                console.log('✅ Serveur accessible (méthode non autorisée = serveur répond)');
            } else {
                throw error;
            }
        }
        
        // Test 2: Test de login transporteur
        console.log('\n2️⃣ Test de login transporteur...');
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: 'transporteur@test.com',
            mot_de_passe: 'password123'
        });
        
        if (loginResponse.data.success) {
            console.log('✅ Login réussi');
            const token = loginResponse.data.token;
            
            // Test 3: Test des réservations transporteur
            console.log('\n3️⃣ Test des réservations transporteur...');
            const reservationsResponse = await axios.get(`${API_BASE_URL}/api/transporter/reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('✅ Réservations récupérées:', reservationsResponse.data);
            console.log('📊 Nombre de réservations:', reservationsResponse.data.data?.length || 0);
            
        } else {
            console.log('❌ Login échoué:', loginResponse.data.message);
        }
        
    } catch (error) {
        console.error('❌ Erreur de test:', error.message);
        if (error.response) {
            console.error('📋 Détails:', error.response.data);
        }
    }
}

// Lancer le test
testConnection(); 