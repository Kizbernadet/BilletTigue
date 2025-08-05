/**
 * Script de test pour les réservations utilisant fetch
 * Teste les fonctionnalités de base de réservation
 */

// Configuration
const BASE_URL = 'http://localhost:3000/api';

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m'
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

// Fonction fetch helper
async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        timeout: 10000
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        return {
            status: response.status,
            ok: response.ok,
            data: data
        };
    } catch (error) {
        throw new Error(`Erreur réseau: ${error.message}`);
    }
}

// Variables de test
let testTrajetId = null;
let testReservationId = null;

// Test 1: Récupérer les trajets disponibles
async function testGetTrajets() {
    logInfo('🔍 Test 1: Récupération des trajets disponibles');
    
    try {
        const response = await apiRequest('/trajets');
        
        if (response.ok && response.data.success && response.data.data.length > 0) {
            testTrajetId = response.data.data[0].id;
            const trajet = response.data.data[0];
            
            logSuccess(`Trajets récupérés: ${response.data.data.length} trajets`);
            logInfo(`Trajet de test: ${trajet.departure_city} → ${trajet.arrival_city}`);
            logInfo(`Prix: ${trajet.price} FCFA, Places: ${trajet.available_seats}`);
            logInfo(`Date: ${new Date(trajet.departure_time).toLocaleString('fr-FR')}`);
            
            return true;
        } else {
            logError('Aucun trajet trouvé');
            return false;
        }
    } catch (error) {
        logError(`Erreur: ${error.message}`);
        return false;
    }
}

// Test 2: Réservation invité
async function testGuestReservation() {
    logInfo('🎫 Test 2: Réservation invité (sans compte)');
    
    if (!testTrajetId) {
        logError('Aucun trajet disponible');
        return false;
    }
    
    try {
        const reservationData = {
            trajet_id: testTrajetId,
            seats_reserved: 1,
            passenger_first_name: 'Moussa',
            passenger_last_name: 'Diallo',
            phone_number: '+223 12345678',
            refundable_option: false,
            refund_supplement_amount: 0,
            total_amount: 5000
        };
        
        const response = await apiRequest('/reservations/guest', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
        
        if (response.ok && response.data.success) {
            testReservationId = response.data.data.id;
            logSuccess(`Réservation créée: ID ${testReservationId}`);
            logInfo(`Référence: ${response.data.data.reference}`);
            logInfo(`Montant: ${response.data.data.total_amount} FCFA`);
            return true;
        } else {
            logError('Échec de la création');
            if (response.data.message) {
                logError(`Message: ${response.data.message}`);
            }
            return false;
        }
    } catch (error) {
        logError(`Erreur: ${error.message}`);
        return false;
    }
}

// Test 3: Réservation avec validation d'erreur
async function testGuestReservationError() {
    logInfo('🎫 Test 3: Test de validation (données invalides)');
    
    if (!testTrajetId) {
        logError('Aucun trajet disponible');
        return false;
    }
    
    try {
        const invalidData = {
            trajet_id: testTrajetId,
            seats_reserved: 0, // Invalide
            passenger_first_name: '', // Invalide
            passenger_last_name: 'Diallo',
            phone_number: '123', // Invalide
            total_amount: 5000
        };
        
        const response = await apiRequest('/reservations/guest', {
            method: 'POST',
            body: JSON.stringify(invalidData)
        });
        
        if (response.status === 400) {
            logSuccess('Validation fonctionne: Erreur 400 reçue pour données invalides');
            logInfo(`Message: ${response.data.message}`);
            return true;
        } else {
            logError('Test échoué: Aucune erreur levée pour des données invalides');
            return false;
        }
    } catch (error) {
        logError(`Erreur inattendue: ${error.message}`);
        return false;
    }
}

// Test 4: Réservation avec trajet inexistant
async function testGuestReservationInvalidTrajet() {
    logInfo('🎫 Test 4: Test avec trajet inexistant');
    
    try {
        const reservationData = {
            trajet_id: 99999, // ID inexistant
            seats_reserved: 1,
            passenger_first_name: 'Moussa',
            passenger_last_name: 'Diallo',
            phone_number: '+223 12345678',
            total_amount: 5000
        };
        
        const response = await apiRequest('/reservations/guest', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
        
        if (response.status === 400) {
            logSuccess('Validation fonctionne: Erreur pour trajet inexistant');
            logInfo(`Message: ${response.data.message}`);
            return true;
        } else {
            logError('Test échoué: Aucune erreur levée pour trajet inexistant');
            return false;
        }
    } catch (error) {
        logError(`Erreur inattendue: ${error.message}`);
        return false;
    }
}

// Test 5: Réservation avec trop de places
async function testGuestReservationTooManySeats() {
    logInfo('🎫 Test 5: Test avec trop de places demandées');
    
    if (!testTrajetId) {
        logError('Aucun trajet disponible');
        return false;
    }
    
    try {
        const reservationData = {
            trajet_id: testTrajetId,
            seats_reserved: 50, // Trop de places
            passenger_first_name: 'Moussa',
            passenger_last_name: 'Diallo',
            phone_number: '+223 12345678',
            total_amount: 250000
        };
        
        const response = await apiRequest('/reservations/guest', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
        
        if (response.status === 400) {
            logSuccess('Validation fonctionne: Erreur pour trop de places');
            logInfo(`Message: ${response.data.message}`);
            return true;
        } else {
            logError('Test échoué: Aucune erreur levée pour trop de places');
            return false;
        }
    } catch (error) {
        logError(`Erreur inattendue: ${error.message}`);
        return false;
    }
}

// Test 6: Vérifier les réservations créées
async function testGetReservations() {
    logInfo('📋 Test 6: Vérification des réservations créées');
    
    try {
        const response = await apiRequest('/reservations/admin/all');
        
        if (response.ok && response.data.success) {
            logSuccess(`Réservations trouvées: ${response.data.data.length}`);
            
            if (response.data.data.length > 0) {
                const reservation = response.data.data[0];
                logInfo(`Dernière réservation:`);
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
        logError(`Erreur: ${error.message}`);
        return false;
    }
}

// Fonction principale
async function runTests() {
    log('🚀 Démarrage des tests de réservation avec fetch', 'yellow');
    log('=' * 60);
    
    const tests = [
        { name: 'Récupération trajets', fn: testGetTrajets },
        { name: 'Réservation invité valide', fn: testGuestReservation },
        { name: 'Validation données invalides', fn: testGuestReservationError },
        { name: 'Trajet inexistant', fn: testGuestReservationInvalidTrajet },
        { name: 'Trop de places', fn: testGuestReservationTooManySeats },
        { name: 'Vérification réservations', fn: testGetReservations }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        log(`\n🧪 Test: ${test.name}`);
        
        try {
            const success = await test.fn();
            if (success) {
                passed++;
                logSuccess(`${test.name} - RÉUSSI`);
            } else {
                failed++;
                logError(`${test.name} - ÉCHOUÉ`);
            }
        } catch (error) {
            failed++;
            logError(`${test.name} - ERREUR: ${error.message}`);
        }
        
        // Pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Résumé
    log('\n' + '=' * 60);
    log(`📊 RÉSUMÉ: ${passed} réussis, ${failed} échoués`, 'yellow');
    
    if (failed === 0) {
        log('🎉 TOUS LES TESTS SONT PASSÉS !', 'green');
    } else {
        log('⚠️  Certains tests ont échoué', 'red');
    }
}

// Exécution
if (require.main === module) {
    runTests().catch(error => {
        logError(`Erreur fatale: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { runTests }; 