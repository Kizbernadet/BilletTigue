/**
 * Gestionnaire des réservations pour les transporteurs
 * Permet aux transporteurs de voir et gérer les réservations de leurs trajets
 */

import { apiRequest, getAuthHeaders } from './api/config.js';
import API_CONFIG from './api/config.dev.js';

class TransporterReservationsManager {
    constructor() {
        this.reservations = [];
        this.isLoading = false;
    }

    /**
     * Initialiser le gestionnaire de réservations
     */
    async init() {
        console.log('🚛 Initialisation du gestionnaire de réservations transporteur...');
        
        try {
            // Charger les données initiales
            await this.loadReservations();
            
            console.log('✅ Gestionnaire de réservations transporteur initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showErrorMessage('Erreur lors du chargement des données');
        }
    }

    /**
     * Charger les réservations du transporteur
     */
    async loadReservations(filters = {}) {
        try {
            this.setLoading(true);
            console.log('📋 Chargement des réservations transporteur...');

            const queryParams = new URLSearchParams();
            if (filters.trajet_id) queryParams.append('trajet_id', filters.trajet_id);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.date_depart) queryParams.append('date_depart', filters.date_depart);
            if (filters.client) queryParams.append('client', filters.client);

            const url = `${API_CONFIG.BASE_URL}/reservations/transporter${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            
            const { response, data } = await apiRequest(url, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors du chargement des réservations');
            }

            this.reservations = data.data || [];
            
            this.renderReservationsTable();
            
            console.log(`✅ ${this.reservations.length} réservations chargées`);
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement des réservations:', error);
            this.showErrorMessage('Erreur lors du chargement des réservations');
        } finally {
            this.setLoading(false);
        }
    }





    /**
     * Rendre le tableau des réservations
     */
    renderReservationsTable() {
        const tbody = document.querySelector('#reservationsTable tbody');
        const noReservationsMsg = document.getElementById('noReservationsMsg');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (this.reservations.length === 0) {
            noReservationsMsg.style.display = 'block';
            return;
        }
        
        noReservationsMsg.style.display = 'none';
        
        this.reservations.forEach(reservation => {
            const row = this.createReservationRow(reservation);
            tbody.appendChild(row);
        });
    }

    /**
     * Créer une ligne de réservation
     */
    createReservationRow(reservation) {
        const row = document.createElement('tr');
        
        const dateReservation = new Date(reservation.created_at).toLocaleDateString('fr-FR');
        const dateDepart = new Date(reservation.date_depart).toLocaleDateString('fr-FR');
        const statusClass = this.getStatusClass(reservation.status);
        const statusText = this.getStatusText(reservation.status);
        
        row.innerHTML = `
            <td>${dateReservation}</td>
            <td>${reservation.numero_reservation || 'N/A'}</td>
            <td>${reservation.trajet_depart} → ${reservation.trajet_arrivee}</td>
            <td>${reservation.client_nom} ${reservation.client_prenom}</td>
            <td>${dateDepart}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${reservation.montant_total} €</td>
            <td>${reservation.nombre_places}</td>
            <td>
                <button class="btn-action" onclick="transporterReservationsManager.viewReservationDetails(${reservation.id})" title="Voir les détails">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-action" onclick="transporterReservationsManager.updateReservationStatus(${reservation.id})" title="Modifier le statut">
                    <i class="fa-solid fa-edit"></i>
                </button>
            </td>
        `;
        
        return row;
    }

    /**
     * Obtenir la classe CSS pour le statut
     */
    getStatusClass(status) {
        const statusClasses = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-default';
    }

    /**
     * Obtenir le texte du statut
     */
    getStatusText(status) {
        const statusTexts = {
            'pending': 'En attente',
            'confirmed': 'Confirmée',
            'completed': 'Terminée',
            'cancelled': 'Annulée'
        };
        return statusTexts[status] || status;
    }



    /**
     * Voir les détails d'une réservation
     */
    async viewReservationDetails(reservationId) {
        try {
            console.log(`👁️ Affichage des détails de la réservation ${reservationId}...`);
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/reservations/${reservationId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors du chargement des détails');
            }

            this.showReservationModal(data.data);
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement des détails:', error);
            this.showErrorMessage('Erreur lors du chargement des détails');
        }
    }

    /**
     * Afficher la modal de détails
     */
    showReservationModal(reservation) {
        // TODO: Implémenter l'affichage de la modal avec les détails
        console.log('📋 Détails de la réservation:', reservation);
        alert(`Détails de la réservation ${reservation.numero_reservation}\n\nCette fonctionnalité sera implémentée prochainement.`);
    }

    /**
     * Mettre à jour le statut d'une réservation
     */
    async updateReservationStatus(reservationId) {
        const newStatus = prompt('Nouveau statut (pending/confirmed/completed/cancelled):');
        
        if (!newStatus) return;
        
        try {
            console.log(`🔄 Mise à jour du statut de la réservation ${reservationId} vers ${newStatus}...`);
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/reservations/${reservationId}/status`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la mise à jour');
            }

            // Recharger les réservations
            await this.loadReservations();
            this.showSuccessMessage('Statut mis à jour avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour du statut:', error);
            this.showErrorMessage('Erreur lors de la mise à jour du statut');
        }
    }

    /**
     * Définir l'état de chargement
     */
    setLoading(loading) {
        this.isLoading = loading;
        const table = document.getElementById('reservationsTable');
        
        if (loading) {
            table.style.opacity = '0.5';
            table.style.pointerEvents = 'none';
        } else {
            table.style.opacity = '1';
            table.style.pointerEvents = 'auto';
        }
    }

    /**
     * Afficher un message de succès
     */
    showSuccessMessage(message) {
        // TODO: Implémenter un système de notifications
        console.log(`✅ ${message}`);
        alert(message);
    }

    /**
     * Afficher un message d'erreur
     */
    showErrorMessage(message) {
        // TODO: Implémenter un système de notifications
        console.error(`❌ ${message}`);
        alert(`Erreur: ${message}`);
    }
}

// Initialiser le gestionnaire globalement
window.transporterReservationsManager = new TransporterReservationsManager();

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (window.transporterReservationsManager) {
        window.transporterReservationsManager.init();
    }
});

// Page simplifiée - pas de filtres pour l'instant 