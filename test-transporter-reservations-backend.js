/**
 * Test des endpoints backend pour les réservations transporteur
 * Usage: node test-transporter-reservations-backend.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const TEST_EMAIL = 'transporteur@test.com';
const TEST_PASSWORD = 'password123';

let authToken = null;

// Fonction pour se connecter
async function login() {
    try {
        console.log('🔐 Connexion en cours...');
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });

        if (response.data.success) {
            authToken = response.data.data.token;
            console.log('✅ Connexion réussie');
            return true;
        } else {
            console.log('❌ Échec de la connexion');
            return false;
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.response?.data || error.message);
        return false;
    }
}

// Fonction pour tester les réservations
async function testGetReservations() {
    try {
        console.log('\n📋 Test: Récupération des réservations...');
        const response = await axios.get(`${BASE_URL}/transporter/reservations`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.success) {
            console.log('✅ Réservations récupérées avec succès');
            console.log(`📊 Nombre de réservations: ${response.data.data.length}`);
            console.log(`📄 Pagination: ${JSON.stringify(response.data.pagination)}`);
            
            if (response.data.data.length > 0) {
                console.log('📋 Première réservation:', {
                    id: response.data.data[0].id,
                    numero: response.data.data[0].numero_reservation,
                    status: response.data.data[0].status,
                    client: `${response.data.data[0].client_prenom} ${response.data.data[0].client_nom}`,
                    montant: response.data.data[0].montant_total
                });
            }
        } else {
            console.log('❌ Échec de la récupération des réservations');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des réservations:', error.response?.data || error.message);
    }
}

// Fonction pour tester les détails d'une réservation
async function testGetReservationDetails() {
    try {
        console.log('\n👁️ Test: Récupération des détails d\'une réservation...');
        
        // D'abord récupérer une liste de réservations
        const listResponse = await axios.get(`${BASE_URL}/transporter/reservations`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (listResponse.data.success && listResponse.data.data.length > 0) {
            const reservationId = listResponse.data.data[0].id;
            
            const response = await axios.get(`${BASE_URL}/transporter/reservations/${reservationId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.data.success) {
                console.log('✅ Détails de la réservation récupérés avec succès');
                console.log('📋 Détails:', {
                    id: response.data.data.id,
                    numero: response.data.data.numero_reservation,
                    status: response.data.data.status,
                    trajet: `${response.data.data.trajet?.departure_city} → ${response.data.data.trajet?.arrival_city}`,
                    client: `${response.data.data.client?.first_name} ${response.data.data.client?.last_name}`,
                    montant: response.data.data.total_amount
                });
            } else {
                console.log('❌ Échec de la récupération des détails');
            }
        } else {
            console.log('⚠️ Aucune réservation disponible pour tester les détails');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des détails:', error.response?.data || error.message);
    }
}

// Fonction pour tester les statistiques
async function testGetStats() {
    try {
        console.log('\n📊 Test: Récupération des statistiques...');
        const response = await axios.get(`${BASE_URL}/transporter/reservations/stats/overview?period=month`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.success) {
            console.log('✅ Statistiques récupérées avec succès');
            console.log('📊 Statistiques:', {
                periode: response.data.data.period,
                total_reservations: response.data.data.total_reservations,
                total_revenue: response.data.data.total_revenue,
                recent_reservations: response.data.data.recent_reservations,
                by_status: response.data.data.by_status
            });
        } else {
            console.log('❌ Échec de la récupération des statistiques');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des statistiques:', error.response?.data || error.message);
    }
}

// Fonction pour tester la récupération des trajets
async function testGetTrips() {
    try {
        console.log('\n🚌 Test: Récupération des trajets...');
        const response = await axios.get(`${BASE_URL}/transporter/reservations/trips/list`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.success) {
            console.log('✅ Trajets récupérés avec succès');
            console.log(`📊 Nombre de trajets: ${response.data.data.length}`);
            
            if (response.data.data.length > 0) {
                console.log('🚌 Premier trajet:', {
                    id: response.data.data[0].id,
                    trajet: `${response.data.data[0].departure_city} → ${response.data.data[0].arrival_city}`,
                    date: response.data.data[0].departure_time
                });
            }
        } else {
            console.log('❌ Échec de la récupération des trajets');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des trajets:', error.response?.data || error.message);
    }
}

// Fonction pour tester les filtres
async function testFilters() {
    try {
        console.log('\n🔍 Test: Filtres de réservations...');
        
        // Test avec filtre par statut
        const statusResponse = await axios.get(`${BASE_URL}/transporter/reservations?status=pending`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (statusResponse.data.success) {
            console.log('✅ Filtre par statut fonctionne');
            console.log(`📊 Réservations en attente: ${statusResponse.data.data.length}`);
        }

        // Test avec pagination
        const pageResponse = await axios.get(`${BASE_URL}/transporter/reservations?page=1&limit=5`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (pageResponse.data.success) {
            console.log('✅ Pagination fonctionne');
            console.log(`📄 Page: ${pageResponse.data.pagination.currentPage}/${pageResponse.data.pagination.totalPages}`);
            console.log(`📊 Éléments par page: ${pageResponse.data.pagination.itemsPerPage}`);
        }

    } catch (error) {
        console.error('❌ Erreur lors du test des filtres:', error.response?.data || error.message);
    }
}

// Fonction principale de test
async function runTests() {
    console.log('🚀 Démarrage des tests backend pour les réservations transporteur...\n');

    // Test de connexion
    const loginSuccess = await login();
    if (!loginSuccess) {
        console.log('❌ Impossible de continuer sans connexion');
        return;
    }

    // Tests des endpoints
    await testGetReservations();
    await testGetReservationDetails();
    await testGetStats();
    await testGetTrips();
    await testFilters();

    console.log('\n✅ Tests terminés !');
}

// Exécuter les tests si le fichier est appelé directement
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    runTests,
    login,
    testGetReservations,
    testGetReservationDetails,
    testGetStats,
    testGetTrips,
    testFilters
}; 