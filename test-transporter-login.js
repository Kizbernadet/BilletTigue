/**
 * Script de test pour vérifier la connexion des transporteurs
 */

const API_BASE = 'http://localhost:3000/api';

async function testTransporterLogin() {
    console.log('🧪 Test de connexion transporteur...');
    
    // Test avec un transporteur existant
    const testCredentials = {
        email: 'transporteur@test.com',
        password: 'Test123!'
    };
    
    try {
        // Test 1: Connexion transporteur directe
        console.log('\n📋 Test 1: Connexion transporteur directe');
        const response1 = await fetch(`${API_BASE}/auth/login-transporter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testCredentials)
        });
        
        console.log('Status:', response1.status);
        const data1 = await response1.json();
        console.log('Réponse:', data1);
        
        // Test 2: Connexion générique
        console.log('\n📋 Test 2: Connexion générique');
        const response2 = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testCredentials)
        });
        
        console.log('Status:', response2.status);
        const data2 = await response2.json();
        console.log('Réponse:', data2);
        
        // Test 3: Vérifier les transporteurs en base
        console.log('\n📋 Test 3: Liste des transporteurs en base');
        const response3 = await fetch(`${API_BASE}/admin/transporters`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (data1.token || data2.token || 'test')
            }
        });
        
        console.log('Status:', response3.status);
        if (response3.ok) {
            const data3 = await response3.json();
            console.log('Transporteurs:', data3);
        } else {
            console.log('Erreur accès transporteurs:', await response3.text());
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

// Exécuter le test
testTransporterLogin(); 