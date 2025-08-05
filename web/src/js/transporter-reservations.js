/**
 * Gestionnaire des réservations pour les transporteurs
 * Permet aux transporteurs de voir et gérer les réservations de leurs trajets
 */

import { apiRequest, getAuthHeaders, API_CONFIG } from './api/config.js';

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

            const url = `${API_CONFIG.BASE_URL}/transporter/reservations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            
            const { response, data } = await apiRequest(url, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors du chargement des réservations');
            }

            this.reservations = data.data || [];
            console.log('📊 Données reçues:', this.reservations);
            
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
        
        if (!tbody) {
            console.error('❌ Élément tbody non trouvé');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (this.reservations.length === 0) {
            if (noReservationsMsg) {
                noReservationsMsg.style.display = 'block';
            }
            return;
        }
        
        if (noReservationsMsg) {
            noReservationsMsg.style.display = 'none';
        }
        
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
        // Formatage des dates
        const dateReservation = reservation.created_at ? new Date(reservation.created_at).toLocaleDateString('fr-FR') : 'N/A';
        const dateDepart = reservation.date_depart ? new Date(reservation.date_depart).toLocaleDateString('fr-FR') : 'N/A';

        // Informations du trajet
        const trajetDepart = reservation.trajet_depart || 'N/A';
        const trajetArrivee = reservation.trajet_arrivee || 'N/A';

        // Informations du client
        const clientNom = reservation.client_nom || 'N/A';
        const clientPrenom = reservation.client_prenom || 'N/A';

        // Statut
        const statusClass = this.getStatusClass(reservation.status);
        const statusText = this.getStatusText(reservation.status);

        // Montant
        const montant = reservation.montant_total ? `${reservation.montant_total} F` : 'N/A';

        row.innerHTML = `
            <td>${dateReservation}</td>
            <td>${reservation.numero_reservation || 'N/A'}</td>
            <td>${trajetDepart} → ${trajetArrivee}</td>
            <td>${clientPrenom} ${clientNom}</td>
            <td>${dateDepart}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${montant}</td>
            <td>${reservation.nombre_places || 'N/A'}</td>
            <td>
                <button class="btn-action" onclick="window.transporterReservationsManager.viewReservationDetails(${reservation.id})" title="Voir les détails">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-action" onclick="window.transporterReservationsManager.updateReservationStatus(${reservation.id})" title="Modifier le statut">
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
            'en_attente': 'status-pending',
            'confirmee': 'status-confirmed',
            'terminee': 'status-completed',
            'annulee': 'status-cancelled'
        };
        return statusClasses[status] || 'status-default';
    }

    /**
     * Obtenir le texte du statut
     */
    getStatusText(status) {
        const statusTexts = {
            'en_attente': 'En attente',
            'confirmee': 'Confirmée',
            'terminee': 'Terminée',
            'annulee': 'Annulée'
        };
        return statusTexts[status] || status;
    }

    /**
     * Voir les détails d'une réservation
     */
    async viewReservationDetails(reservationId) {
        try {
            console.log(`Affichage des détails de la réservation ${reservationId}...`);
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/transporter/reservations/${reservationId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors du chargement des détails');
            }

            this.showReservationModal(data.data);
            
        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            this.showErrorMessage('Erreur lors du chargement des détails');
        }
    }

    /**
     * Afficher la modal de détails
     */
    showReservationModal(reservation) {
        // Vérifier si la modale existe déjà
        let modal = document.getElementById('reservationModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'reservationModal';
            modal.className = 'reservation-modal';
            modal.innerHTML = `
                <div class="reservation-modal-content">
                    <div class="reservation-modal-header">
                        <h2>Détails de la réservation</h2>
                        <button class="reservation-modal-close" title="Fermer">&times;</button>
                    </div>
                    <div class="reservation-details"></div>
                    <div class="reservation-modal-actions">
                        <button class="reservation-modal-btn secondary reservation-modal-close">Fermer</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Remplir les détails
        const detailsDiv = modal.querySelector('.reservation-details');
        detailsDiv.innerHTML = `
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Numéro</div>
                <div class="reservation-detail-value">${reservation.numero_reservation || 'N/A'}</div>
            </div>
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Client</div>
                <div class="reservation-detail-value">${reservation.Compte?.Utilisateur?.prenom || reservation.client_prenom || 'N/A'} ${reservation.Compte?.Utilisateur?.nom || reservation.client_nom || ''}</div>
            </div>
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Trajet</div>
                <div class="reservation-detail-value">${reservation.Trajet?.lieu_depart || reservation.trajet_depart || 'N/A'} → ${reservation.Trajet?.lieu_arrivee || reservation.trajet_arrivee || 'N/A'}</div>
            </div>
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Date de départ</div>
                <div class="reservation-detail-value">${reservation.Trajet ? new Date(reservation.Trajet.date_depart).toLocaleDateString('fr-FR') : (reservation.date_depart ? new Date(reservation.date_depart).toLocaleDateString('fr-FR') : 'N/A')}</div>
            </div>
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Statut</div>
                <div class="reservation-detail-value">${this.getStatusText(reservation.statut || reservation.status)}</div>
            </div>
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Montant</div>
                <div class="reservation-detail-value">${reservation.montant_total ? reservation.montant_total + ' F' : 'N/A'}</div>
            </div>
            <div class="reservation-detail-item">
                <div class="reservation-detail-label">Nombre de places</div>
                <div class="reservation-detail-value">${reservation.nombre_places || 'N/A'}</div>
            </div>
        `;

        // Afficher la modale
        modal.classList.add('show');

        // Fermer la modale sur clic des boutons ou fond
        const closeBtns = modal.querySelectorAll('.reservation-modal-close');
        closeBtns.forEach(btn => {
            btn.onclick = () => {
                modal.classList.remove('show');
            };
        });
        // Fermer si clic en dehors du contenu
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        };
    }

    /**
     * Mettre à jour le statut d'une réservation
     */
    async updateReservationStatus(reservationId) {
        const newStatus = prompt('Nouveau statut (en_attente/confirmee/terminee/annulee):');
        
        if (!newStatus) return;
        
        try {
            console.log(`🔄 Mise à jour du statut de la réservation ${reservationId} vers ${newStatus}...`);
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/transporter/reservations/${reservationId}/status`, {
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
        
        if (table) {
            if (loading) {
                table.classList.add('loading');
            } else {
                table.classList.remove('loading');
            }
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
    console.log('🚀 Page chargée, initialisation du gestionnaire de réservations...');
    if (window.transporterReservationsManager) {
        window.transporterReservationsManager.init();
    }
}); 