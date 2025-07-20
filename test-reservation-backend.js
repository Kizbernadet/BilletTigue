/**
 * Script de test pour les fonctionnalités de réservation côté backend
 * Teste les différentes routes et scénarios de réservation
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const API_TIMEOUT = 10000;

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Configuration axios
const api = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Variables globales pour les tests
let testTrajetId = null;
let testReservationId = null;
let testGuestReservationId = null;
let authToken = null;

// ========== TESTS DES TRAJETS ==========

async function testGetTrajets() {
    logInfo('🔍 Test 1: Récupération des trajets disponibles');
    
    try {
        const response = await api.get('/trajets');
        
        if (response.data.success && response.data.data.length > 0) {
            testTrajetId = response.data.data[0].id;
            logSuccess(`Trajets récupérés: ${response.data.data.length} trajets trouvés`);
            logInfo(`Trajet de test sélectionné: ID ${testTrajetId}`);
            
            // Afficher les détails du trajet de test
            const trajet = response.data.data[0];
            logInfo(`Détails du trajet de test:`);
            logInfo(`  - Départ: ${trajet.departure_city} → ${trajet.arrival_city}`);
            logInfo(`  - Date: ${new Date(trajet.departure_time).toLocaleString('fr-FR')}`);
            logInfo(`  - Prix: ${trajet.price} FCFA`);
            logInfo(`  - Places disponibles: ${trajet.available_seats}`);
            logInfo(`  - Statut: ${trajet.status}`);
            
            return true;
        } else {
            logError('Aucun trajet trouvé');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la récupération des trajets: ${error.message}`);
        if (error.response) {
            logError(`Détails: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return false;
    }
}

async function createTestTrajet() {
    logInfo('🔍 Test 1.1: Création d\'un trajet de test');
    
    try {
        // Date de demain à 10h00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        const trajetData = {
            departure_city: 'Bamako',
            arrival_city: 'Sikasso',
            departure_time: tomorrow.toISOString(),
            price: 5000,
            seats_count: 20,
            available_seats: 20,
            departure_point: 'Gare routière de Bamako',
            arrival_point: 'Gare routière de Sikasso',
            accepts_packages: true,
            max_package_weight: 25
        };
        
        const response = await api.post('/trajets', trajetData, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.data.success) {
            testTrajetId = response.data.data.id;
            logSuccess(`Trajet de test créé avec succès: ID ${testTrajetId}`);
            return true;
        } else {
            logError('Échec de la création du trajet de test');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la création du trajet: ${error.message}`);
        return false;
    }
}

// ========== TESTS D'AUTHENTIFICATION ==========

async function testLogin() {
    logInfo('🔐 Test 0: Authentification pour les tests');
    
    try {
        const loginData = {
            email: 'admin@billettigue.com',
            password: 'admin123'
        };
        
        const response = await api.post('/auth/login', loginData);
        
        if (response.data.success && response.data.token) {
            authToken = response.data.token;
            logSuccess('Authentification réussie');
            logInfo(`Token reçu: ${authToken.substring(0, 20)}...`);
            return true;
        } else {
            logError('Échec de l\'authentification');
            return false;
        }
    } catch (error) {
        logError(`Erreur d'authentification: ${error.message}`);
        return false;
    }
}

// ========== TESTS DE RÉSERVATION INVITÉ ==========

async function testGuestReservation() {
    logInfo('🎫 Test 2: Réservation invité (sans compte)');
    
    if (!testTrajetId) {
        logError('Aucun trajet disponible pour le test');
        return false;
    }
    
    try {
        const reservationData = {
            trajet_id: testTrajetId,
            seats_reserved: 2,
            passenger_first_name: 'Moussa',
            passenger_last_name: 'Diallo',
            phone_number: '+223 12345678',
            refundable_option: false,
            refund_supplement_amount: 0,
            total_amount: 10000 // 2 places * 5000 FCFA
        };
        
        const response = await api.post('/reservations/guest', reservationData);
        
        if (response.data.success) {
            testGuestReservationId = response.data.data.id;
            logSuccess(`Réservation invité créée avec succès: ID ${testGuestReservationId}`);
            logInfo(`Référence: ${response.data.data.reference}`);
            logInfo(`Montant total: ${response.data.data.total_amount} FCFA`);
            return true;
        } else {
            logError('Échec de la création de la réservation invité');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la réservation invité: ${error.message}`);
        if (error.response) {
            logError(`Détails: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return false;
    }
}

async function testGuestReservationValidation() {
    logInfo('🎫 Test 2.1: Validation des données de réservation invité');
    
    if (!testTrajetId) {
        logError('Aucun trajet disponible pour le test');
        return false;
    }
    
    const testCases = [
        {
            name: 'Données manquantes',
            data: {
                trajet_id: testTrajetId,
                // passenger_first_name manquant
                passenger_last_name: 'Diallo',
                phone_number: '+223 12345678'
            },
            expectedError: 'obligatoires'
        },
        {
            name: 'Nombre de places invalide',
            data: {
                trajet_id: testTrajetId,
                seats_reserved: 0,
                passenger_first_name: 'Moussa',
                passenger_last_name: 'Diallo',
                phone_number: '+223 12345678'
            },
            expectedError: 'entre 1 et 10'
        },
        {
            name: 'Numéro de téléphone invalide',
            data: {
                trajet_id: testTrajetId,
                seats_reserved: 1,
                passenger_first_name: 'Moussa',
                passenger_last_name: 'Diallo',
                phone_number: '123' // Trop court
            },
            expectedError: 'téléphone invalide'
        }
    ];
    
    for (const testCase of testCases) {
        try {
            logInfo(`Test: ${testCase.name}`);
            await api.post('/reservations/guest', testCase.data);
            logError(`Test échoué: ${testCase.name} - Aucune erreur levée`);
        } catch (error) {
            if (error.response && error.response.data.message.includes(testCase.expectedError)) {
                logSuccess(`Validation réussie: ${testCase.name}`);
            } else {
                logError(`Validation échouée: ${testCase.name} - Erreur inattendue`);
            }
        }
    }
}

// ========== TESTS DE RÉSERVATION UTILISATEUR ==========

async function testUserReservation() {
    logInfo('🎫 Test 3: Réservation utilisateur (avec compte)');
    
    if (!testTrajetId || !authToken) {
        logError('Trajet ou token d\'authentification manquant');
        return false;
    }
    
    try {
        const reservationData = {
            trajet_id: testTrajetId,
            seats_reserved: 1,
            passenger_first_name: 'Fatou',
            passenger_last_name: 'Traoré',
            phone_number: '+223 87654321'
        };
        
        const response = await api.post('/reservations', reservationData, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.data.success) {
            testReservationId = response.data.data.id;
            logSuccess(`Réservation utilisateur créée avec succès: ID ${testReservationId}`);
            logInfo(`Statut: ${response.data.data.status}`);
            logInfo(`Montant: ${response.data.data.total_amount} FCFA`);
            return true;
        } else {
            logError('Échec de la création de la réservation utilisateur');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la réservation utilisateur: ${error.message}`);
        if (error.response) {
            logError(`Détails: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return false;
    }
}

// ========== TESTS DE RÉCUPÉRATION DES RÉSERVATIONS ==========

async function testGetMyReservations() {
    logInfo('📋 Test 4: Récupération de mes réservations');
    
    if (!authToken) {
        logError('Token d\'authentification manquant');
        return false;
    }
    
    try {
        const response = await api.get('/reservations', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.data.success) {
            logSuccess(`Réservations récupérées: ${response.data.data.length} réservations`);
            
            if (response.data.data.length > 0) {
                const reservation = response.data.data[0];
                logInfo(`Exemple de réservation:`);
                logInfo(`  - ID: ${reservation.id}`);
                logInfo(`  - Statut: ${reservation.status}`);
                logInfo(`  - Passager: ${reservation.passenger_first_name} ${reservation.passenger_last_name}`);
                logInfo(`  - Date: ${new Date(reservation.reservation_date).toLocaleString('fr-FR')}`);
            }
            return true;
        } else {
            logError('Échec de la récupération des réservations');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la récupération des réservations: ${error.message}`);
        return false;
    }
}

async function testGetReservationById() {
    logInfo('📋 Test 5: Récupération d\'une réservation spécifique');
    
    if (!testReservationId || !authToken) {
        logError('ID de réservation ou token manquant');
        return false;
    }
    
    try {
        const response = await api.get(`/reservations/${testReservationId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.data.success) {
            const reservation = response.data.data;
            logSuccess(`Réservation récupérée: ID ${reservation.id}`);
            logInfo(`Détails complets:`);
            logInfo(`  - Statut: ${reservation.status}`);
            logInfo(`  - Passager: ${reservation.passenger_first_name} ${reservation.passenger_last_name}`);
            logInfo(`  - Téléphone: ${reservation.phone_number}`);
            logInfo(`  - Places: ${reservation.seats_reserved}`);
            logInfo(`  - Montant: ${reservation.total_amount} FCFA`);
            logInfo(`  - Trajet: ${reservation.trajet?.departure_city} → ${reservation.trajet?.arrival_city}`);
            return true;
        } else {
            logError('Échec de la récupération de la réservation');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la récupération de la réservation: ${error.message}`);
        return false;
    }
}

// ========== TESTS D'ANNULATION ==========

async function testCancelReservation() {
    logInfo('❌ Test 6: Annulation d\'une réservation');
    
    if (!testReservationId || !authToken) {
        logError('ID de réservation ou token manquant');
        return false;
    }
    
    try {
        const response = await api.put(`/reservations/${testReservationId}/cancel`, {}, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.data.success) {
            logSuccess(`Réservation annulée avec succès: ID ${testReservationId}`);
            logInfo(`Nouveau statut: ${response.data.data.status}`);
            if (response.data.data.paiement) {
                logInfo(`Statut paiement: ${response.data.data.paiement.status}`);
            }
            return true;
        } else {
            logError('Échec de l\'annulation de la réservation');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de l'annulation: ${error.message}`);
        if (error.response) {
            logError(`Détails: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return false;
    }
}

// ========== TESTS DE STATISTIQUES ==========

async function testReservationStats() {
    logInfo('📊 Test 7: Statistiques des réservations');
    
    if (!authToken) {
        logError('Token d\'authentification manquant');
        return false;
    }
    
    try {
        const response = await api.get('/reservations/stats/overview', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.data.success) {
            const stats = response.data.data;
            logSuccess('Statistiques récupérées avec succès');
            logInfo(`Résumé:`);
            logInfo(`  - Total réservations: ${stats.total}`);
            logInfo(`  - Confirmées: ${stats.confirmed}`);
            logInfo(`  - En attente: ${stats.pending}`);
            logInfo(`  - Annulées: ${stats.cancelled}`);
            logInfo(`  - Terminées: ${stats.completed}`);
            return true;
        } else {
            logError('Échec de la récupération des statistiques');
            return false;
        }
    } catch (error) {
        logError(`Erreur lors de la récupération des statistiques: ${error.message}`);
        return false;
    }
}

// ========== FONCTION PRINCIPALE ==========

async function runAllTests() {
    log('🚀 Démarrage des tests de réservation backend', 'bright');
    log('=' * 50, 'cyan');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };
    
    const tests = [
        { name: 'Authentification', fn: testLogin },
        { name: 'Récupération trajets', fn: testGetTrajets },
        { name: 'Réservation invité', fn: testGuestReservation },
        { name: 'Validation réservation invité', fn: testGuestReservationValidation },
        { name: 'Réservation utilisateur', fn: testUserReservation },
        { name: 'Récupération mes réservations', fn: testGetMyReservations },
        { name: 'Récupération réservation spécifique', fn: testGetReservationById },
        { name: 'Annulation réservation', fn: testCancelReservation },
        { name: 'Statistiques réservations', fn: testReservationStats }
    ];
    
    for (const test of tests) {
        results.total++;
        log(`\n🧪 Test ${results.total}: ${test.name}`, 'magenta');
        
        try {
            const success = await test.fn();
            if (success) {
                results.passed++;
                logSuccess(`${test.name} - RÉUSSI`);
            } else {
                results.failed++;
                logError(`${test.name} - ÉCHOUÉ`);
            }
        } catch (error) {
            results.failed++;
            logError(`${test.name} - ERREUR: ${error.message}`);
        }
        
        // Pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Résumé final
    log('\n' + '=' * 50, 'cyan');
    log('📊 RÉSUMÉ DES TESTS', 'bright');
    log(`Total: ${results.total}`, 'cyan');
    log(`Réussis: ${results.passed}`, 'green');
    log(`Échoués: ${results.failed}`, 'red');
    log(`Taux de réussite: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'yellow');
    
    if (results.failed === 0) {
        log('\n🎉 TOUS LES TESTS SONT PASSÉS !', 'green');
    } else {
        log('\n⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.', 'yellow');
    }
}

// Exécution des tests
if (require.main === module) {
    runAllTests().catch(error => {
        logError(`Erreur fatale: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    testLogin,
    testGetTrajets,
    testGuestReservation,
    testUserReservation,
    testGetMyReservations,
    testCancelReservation,
    testReservationStats
}; 