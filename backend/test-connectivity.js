/**
 * Test simple de connectivité au serveur backend
 */

const BASE_URL = 'http://localhost:3000/api';

async function testConnectivity() {
    console.log('🔍 Test de connectivité au serveur backend...');
    console.log(`URL: ${BASE_URL}`);
    
    try {
        // Test 1: Endpoint de base
        console.log('\n1. Test endpoint de base...');
        const response1 = await fetch(`${BASE_URL}/trajets`);
        console.log(`Status: ${response1.status}`);
        console.log(`OK: ${response1.ok}`);
        
        if (response1.ok) {
            const data1 = await response1.json();
            console.log('✅ Serveur accessible');
            console.log(`Données reçues: ${JSON.stringify(data1, null, 2)}`);
        } else {
            console.log('❌ Serveur répond mais avec erreur');
        }
        
    } catch (error) {
        console.log('❌ Erreur de connectivité:');
        console.log(`Message: ${error.message}`);
        console.log(`Type: ${error.name}`);
        
        if (error.code) {
            console.log(`Code: ${error.code}`);
        }
    }
    
    try {
        // Test 2: Endpoint de santé
        console.log('\n2. Test endpoint de santé...');
        const response2 = await fetch('http://localhost:3000/');
        console.log(`Status: ${response2.status}`);
        console.log(`OK: ${response2.ok}`);
        
        if (response2.ok) {
            const text = await response2.text();
            console.log('✅ Serveur principal accessible');
            console.log(`Réponse: ${text.substring(0, 100)}...`);
        }
        
    } catch (error) {
        console.log('❌ Erreur endpoint principal:');
        console.log(`Message: ${error.message}`);
    }
}

// Exécution
testConnectivity().catch(error => {
    console.error('Erreur fatale:', error);
}); 