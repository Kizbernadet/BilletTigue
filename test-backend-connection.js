/**
 * Test rapide de connexion au backend
 */

const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
};

console.log('🧪 Test de connexion au backend...');
console.log('📍 URL: http://localhost:3000');

const req = http.request(options, (res) => {
    console.log(`✅ Serveur accessible! Status: ${res.statusCode}`);
    console.log(`📋 Réponse: ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`📄 Contenu: ${data}`);
        console.log('🎉 Backend opérationnel!');
    });
});

req.on('error', (error) => {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('💡 Assurez-vous que le serveur backend est démarré avec: npm start');
});

req.end(); 