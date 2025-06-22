import { AuthAPI } from './api/index.js';

/**
 * Gestionnaire des tableaux de bord (utilisateur et administrateur)
 */

class DashboardManager {
    constructor() {
        this.initializeDashboard();
    }

    /**
     * Initialise le tableau de bord
     */
    initializeDashboard() {
        // Vérifier l'authentification
        if (!this.checkAuthentication()) {
            return;
        }

        // Charger les informations utilisateur
        this.loadUserInfo();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Vérifier les permissions selon le rôle
        this.checkPermissions();
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    checkAuthentication() {
        if (!AuthAPI.isAuthenticated()) {
            this.showMessage('Vous devez être connecté pour accéder à cette page', 'error');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);
            return false;
        }
        return true;
    }

    /**
     * Charge et affiche les informations de l'utilisateur
     */
    loadUserInfo() {
        const user = AuthAPI.getCurrentUser();
        if (!user) {
            this.showMessage('Impossible de récupérer les informations utilisateur', 'error');
            return;
        }

        // Déterminer le type de page (utilisateur ou admin)
        const isAdminPage = window.location.pathname.includes('admin-dashboard');
        const isUserPage = window.location.pathname.includes('user-dashboard');

        if (isAdminPage && user.role !== 'admin') {
            this.showMessage('Accès refusé. Vous devez être administrateur.', 'error');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);
            return;
        }

        if (isUserPage && user.role === 'admin') {
            // Rediriger l'admin vers son tableau de bord
            window.location.href = './admin-dashboard.html';
            return;
        }

        // Afficher les informations utilisateur
        this.displayUserInfo(user);
    }

    /**
     * Affiche les informations utilisateur dans l'interface
     */
    displayUserInfo(user) {
        const isAdminPage = window.location.pathname.includes('admin-dashboard');
        const containerId = isAdminPage ? 'adminDetails' : 'userDetails';
        const container = document.getElementById(containerId);

        if (!container) return;

        const userInfo = this.formatUserInfo(user, isAdminPage);
        container.innerHTML = userInfo;
    }

    /**
     * Formate les informations utilisateur pour l'affichage
     */
    formatUserInfo(user, isAdmin = false) {
        const baseInfo = `
            <div class="user-detail">
                <i class="fas fa-envelope"></i>
                <span><strong>Email:</strong> ${user.email}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-user-tag"></i>
                <span><strong>Rôle:</strong> ${this.formatRole(user.role)}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-calendar-alt"></i>
                <span><strong>Connecté le:</strong> ${new Date().toLocaleDateString('fr-FR')}</span>
            </div>
        `;

        if (isAdmin) {
            return `
                <div class="admin-detail">
                    <i class="fas fa-envelope"></i>
                    <span><strong>Email:</strong> ${user.email}</span>
                </div>
                <div class="admin-detail">
                    <i class="fas fa-crown"></i>
                    <span><strong>Rôle:</strong> Administrateur</span>
                </div>
                <div class="admin-detail">
                    <i class="fas fa-shield-alt"></i>
                    <span><strong>Permissions:</strong> Accès complet</span>
                </div>
                <div class="admin-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span><strong>Connecté le:</strong> ${new Date().toLocaleDateString('fr-FR')}</span>
                </div>
            `;
        }

        return baseInfo;
    }

    /**
     * Formate le rôle pour l'affichage
     */
    formatRole(role) {
        const roleMap = {
            'user': 'Utilisateur',
            'transporter': 'Transporteur',
            'admin': 'Administrateur'
        };
        return roleMap[role] || role;
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Boutons de déconnexion
        const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtn2');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleLogout());
        });

        // Gestion du menu de langue
        this.setupLanguageMenu();
    }

    /**
     * Configure le menu de langue
     */
    setupLanguageMenu() {
        const langOptions = document.querySelectorAll('.lang-option');
        const currentLangText = document.getElementById('current-lang-text');

        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const langName = option.getAttribute('data-lang-name');
                if (currentLangText) {
                    currentLangText.textContent = langName;
                }
                this.showMessage(`Langue changée vers ${langName}`, 'success');
            });
        });
    }

    /**
     * Gère la déconnexion
     */
    async handleLogout() {
        try {
            const result = await AuthAPI.logout();
            
            if (result.success) {
                this.showMessage('Déconnexion réussie', 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                this.showMessage('Erreur lors de la déconnexion', 'error');
            }
        } catch (error) {
            // Même en cas d'erreur, supprimer les données locales
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            this.showMessage('Déconnexion effectuée', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        }
    }

    /**
     * Vérifie les permissions selon le rôle
     */
    checkPermissions() {
        const user = AuthAPI.getCurrentUser();
        if (!user) return;

        const isAdminPage = window.location.pathname.includes('admin-dashboard');
        
        if (isAdminPage && user.role !== 'admin') {
            this.showMessage('Accès refusé. Redirection...', 'error');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);
        }
    }

    /**
     * Affiche un message à l'utilisateur
     */
    showMessage(message, type = 'info') {
        // Créer un élément de message temporaire
        const messageDiv = document.createElement('div');
        messageDiv.className = `dashboard-message dashboard-message-${type}`;
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                ${type === 'success' ? 'background: #28a745;' : ''}
                ${type === 'error' ? 'background: #dc3545;' : ''}
                ${type === 'info' ? 'background: #17a2b8;' : ''}
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(messageDiv);

        // Supprimer le message après 3 secondes
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    /**
     * Met à jour les statistiques (pour l'admin)
     */
    updateStats() {
        const user = AuthAPI.getCurrentUser();
        if (!user || user.role !== 'admin') return;

        // Ici vous pourriez faire un appel API pour récupérer les vraies statistiques
        console.log('Mise à jour des statistiques...');
    }
}

// Initialiser le gestionnaire de tableau de bord
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Exporter pour utilisation dans d'autres modules
export default DashboardManager; 