import { AuthAPI } from './api/index.js';

/**
 * Gestionnaire du tableau de bord transporteur
 */

class TransporterDashboard {
    constructor() {
        this.initializeDashboard();
    }

    /**
     * Initialise le tableau de bord
     */
    initializeDashboard() {
        // Vérifier l'authentification
        this.checkAuthentication();
        
        // Charger les données du transporteur
        this.loadTransporterData();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Charger les statistiques
        this.loadStatistics();
    }

    /**
     * Vérifie l'authentification et redirige si nécessaire
     */
    checkAuthentication() {
        if (!AuthAPI.isAuthenticated()) {
            window.location.href = './pages/login.html';
            return;
        }

        const user = AuthAPI.getCurrentUser();
        if (!user || (user.role !== 'transporteur' && user.role !== 'transporter')) {
            // Rediriger vers la page appropriée selon le rôle
            if (user && user.role === 'admin') {
                window.location.href = './admin-dashboard.html';
            } else {
                window.location.href = './user-dashboard.html';
            }
            return;
        }

        console.log('Transporteur connecté:', user);
    }

    /**
     * Charge les données du transporteur
     */
    loadTransporterData() {
        const user = AuthAPI.getCurrentUser();
        if (!user) return;

        // Mettre à jour les informations affichées
        const companyNameEl = document.getElementById('companyName');
        const phoneNumberEl = document.getElementById('phoneNumber');
        const userEmailEl = document.getElementById('userEmail');

        if (companyNameEl) {
            companyNameEl.textContent = user.profile?.companyName || 'Non défini';
        }
        if (phoneNumberEl) {
            phoneNumberEl.textContent = user.profile?.phoneNumber || 'Non défini';
        }
        if (userEmailEl) {
            userEmailEl.textContent = user.email || 'Non défini';
        }

        // Mettre à jour les services
        this.updateServicesList(user.service);
    }

    /**
     * Met à jour la liste des services
     */
    updateServicesList(service) {
        const servicesListEl = document.getElementById('servicesList');
        if (!servicesListEl) return;

        const serviceLabels = {
            'passengers': 'Transport des passagers',
            'packages': 'Transport des colis',
            'both': 'Transport des passagers et colis'
        };

        const serviceLabel = serviceLabels[service] || service || 'Non défini';
        servicesListEl.innerHTML = `<span class="service-badge">${serviceLabel}</span>`;
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Boutons de déconnexion
        const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnMain');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleLogout());
        });

        // Actions rapides
        const quickActionCards = document.querySelectorAll('.quick-action-card');
        quickActionCards.forEach((card, index) => {
            card.addEventListener('click', () => this.handleQuickAction(index));
        });

        // Actions principales
        const actionBtns = document.querySelectorAll('.dashboard-actions .dashboard-btn');
        actionBtns.forEach((btn, index) => {
            if (!btn.id.includes('logout')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleMainAction(index);
                });
            }
        });
    }

    /**
     * Gère la déconnexion
     */
    async handleLogout() {
        try {
            if (window.SecureLogout) {
                await SecureLogout.logout();
            } else {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('./pages/login.html?fallback=true');
            }
        } catch (error) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.replace('./pages/login.html?emergency=true');
        }
    }

    /**
     * Gère les actions rapides
     */
    handleQuickAction(index) {
        const actions = [
            { name: 'Nouveau Trajet', url: '#', icon: 'fas fa-route' },
            { name: 'Planning', url: '#', icon: 'fas fa-calendar-alt' },
            { name: 'Rapports', url: '#', icon: 'fas fa-chart-line' },
            { name: 'Paramètres', url: '#', icon: 'fas fa-cog' }
        ];

        const action = actions[index];
        if (action) {
            this.showMessage(`Ouverture de ${action.name}...`, 'info');
            // Ici vous pouvez ajouter la logique pour ouvrir les différentes sections
            console.log(`Action rapide: ${action.name}`);
        }
    }

    /**
     * Gère les actions principales
     */
    handleMainAction(index) {
        const actions = [
            { name: 'Nouveau Trajet', url: '#', icon: 'fas fa-plus' },
            { name: 'Mes Trajets', url: '#', icon: 'fas fa-list' },
            { name: 'Clients', url: '#', icon: 'fas fa-users' },
            { name: 'Factures', url: '#', icon: 'fas fa-file-invoice' }
        ];

        const action = actions[index];
        if (action) {
            this.showMessage(`Ouverture de ${action.name}...`, 'info');
            // Ici vous pouvez ajouter la logique pour ouvrir les différentes sections
            console.log(`Action principale: ${action.name}`);
        }
    }

    /**
     * Charge les statistiques (simulation)
     */
    loadStatistics() {
        // Simulation de données - à remplacer par des appels API réels
        const stats = {
            totalTrips: 45,
            activeTrips: 3,
            totalRevenue: '12,450€',
            rating: 4.8
        };

        // Mettre à jour les statistiques
        const totalTripsEl = document.getElementById('totalTrips');
        const activeTripsEl = document.getElementById('activeTrips');
        const totalRevenueEl = document.getElementById('totalRevenue');
        const ratingEl = document.getElementById('rating');

        if (totalTripsEl) totalTripsEl.textContent = stats.totalTrips;
        if (activeTripsEl) activeTripsEl.textContent = stats.activeTrips;
        if (totalRevenueEl) totalRevenueEl.textContent = stats.totalRevenue;
        if (ratingEl) ratingEl.textContent = stats.rating;
    }

    /**
     * Affiche un message à l'utilisateur
     */
    showMessage(message, type = 'info') {
        // Supprimer les messages existants
        const existingMessages = document.querySelectorAll('.dashboard-message');
        existingMessages.forEach(msg => msg.remove());

        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `dashboard-message dashboard-message-${type}`;
        messageDiv.textContent = message;
        
        // Styles pour les messages
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out'
        };

        // Couleurs selon le type
        if (type === 'success') {
            styles.backgroundColor = '#28a745';
        } else if (type === 'error') {
            styles.backgroundColor = '#dc3545';
        } else if (type === 'info') {
            styles.backgroundColor = '#17a2b8';
        } else {
            styles.backgroundColor = '#FF9800';
        }

        // Appliquer les styles
        Object.assign(messageDiv.style, styles);

        // Ajouter l'animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Ajouter le message au DOM
        document.body.appendChild(messageDiv);

        // Supprimer le message après 3 secondes
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Initialiser le tableau de bord transporteur
document.addEventListener('DOMContentLoaded', () => {
    new TransporterDashboard();
}); 