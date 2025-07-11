/**
 * Gestionnaire d'état de connexion visuel
 * Système de bouton profil avec menu dropdown comme Google/YouTube
 */

class AuthStateManager {
    constructor() {
        this.authSection = null;
        this.init();
    }

    /**
     * Initialise le gestionnaire d'état
     */
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.checkAuthState());
        } else {
            this.checkAuthState();
        }

        // Écouter les changements de localStorage (pour synchroniser entre onglets)
        window.addEventListener('storage', (e) => {
            if (e.key === 'userData' || e.key === 'authToken') {
                this.checkAuthState();
            }
        });

        // Écouter les événements de mise à jour des données utilisateur
        window.addEventListener('userDataUpdated', (e) => {
            console.log('🔄 Données utilisateur mises à jour, rafraîchissement de l\'interface');
            this.showUserProfile(e.detail.userData);
        });
    }

    /**
     * Vérifie l'état d'authentification et met à jour l'interface
     */
    async checkAuthState() {
        this.authSection = document.getElementById('auth-section');
        if (!this.authSection) {
            console.warn('⚠️ Élément #auth-section non trouvé');
            return;
        }

        const userData = this.getCurrentUser();
        
        if (userData) {
            // Si on a des données utilisateur, essayer de les rafraîchir depuis la base
            try {
                await this.refreshUserDataFromServer();
            } catch (error) {
                console.warn('⚠️ Impossible de rafraîchir les données utilisateur:', error);
                // Continuer avec les données locales
            }
            
            const updatedUserData = this.getCurrentUser();
            this.showUserProfile(updatedUserData);
        } else {
            this.showLoginButton();
        }
    }

    /**
     * Rafraîchit les données utilisateur depuis le serveur
     */
    async refreshUserDataFromServer() {
        try {
            // Importer dynamiquement ProfileAPI
            const { default: ProfileAPI } = await import('./api/profileApi.js');
            const result = await ProfileAPI.refreshUserData();
            
            if (result.success) {
                console.log('✅ Données utilisateur rafraîchies depuis le serveur');
                return result.data;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('❌ Erreur lors du rafraîchissement des données:', error);
            throw error;
        }
    }

    /**
     * Récupère les données utilisateur depuis le stockage
     */
    getCurrentUser() {
        try {
            const userData = sessionStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
            return null;
        }
    }

    /**
     * Affiche le bouton de connexion
     */
    showLoginButton() {
        this.authSection.innerHTML = `
            <div id="login-menu" class="dropdown dropdown-end dropdown-hover lang-dropdown flex justify-center items-center">
                <label tabindex="0" class="btn-lang">
                    <span class="login-text">Se connecter</span>
                    <i class="fas fa-chevron-down text-xs login-arrow"></i>
                    <i class="fa-solid fa-user login-icon" style="display:none;"></i>
                </label>
                <ul tabindex="0" class="lang-options-list">
                    <li><a href="#" class="lang-option text-sm" onclick="LoginRedirectUtils.redirectToLoginWithOriginSave('user')">Utilisateur</a></li>
                    <li><a href="#" class="lang-option text-sm" onclick="LoginRedirectUtils.redirectToLoginWithOriginSave('transporter')">Transporteur</a></li>
                </ul>
            </div>
        `;
    }

    /**
     * Affiche le bouton profil simple avec dropdown popover
     */
    showUserProfile(user) {
        const userName = this.getUserName(user);
        this.authSection.innerHTML = `
            <div class="profile-dropdown-wrapper" style="position: relative; display: inline-block;">
                <button 
                    id="profile-button" 
                    class="profile-button"
                    aria-label="Profil de ${userName}"
                    type="button"
                >
                    <i class="ri-user-3-line"></i>
                    <span>${userName}</span>
                    <i class="ri-arrow-down-s-line" style="margin-left: 0.3em;"></i>
                </button>
                <ul id="profile-dropdown-menu" class="profile-dropdown-menu" style="display: none;">
                    <li><a href="./pages/profile.html" class="profile-dropdown-link"><i class="ri-user-settings-line"></i> Mon profil</a></li>
                    <li><a href="./pages/profile.html" class="profile-dropdown-link"><i class="ri-user-edit-line"></i> Modifier le profil</a></li>
                    <li><a href="./pages/profile.html" class="profile-dropdown-link"><i class="ri-lock-password-line"></i> Changer le mot de passe</a></li>
                    <li><a href="./pages/reservation.html" class="profile-dropdown-link"><i class="ri-ticket-line"></i> Mes réservations</a></li>
                    <li><button class="profile-dropdown-link logout-link" onclick="logout()"><i class="ri-logout-box-r-line"></i> Déconnexion</button></li>
                </ul>
            </div>
        `;

        // JS pour ouvrir/fermer le menu
        const profileBtn = document.getElementById('profile-button');
        const dropdownMenu = document.getElementById('profile-dropdown-menu');
        if (profileBtn && dropdownMenu) {
            profileBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isOpen ? 'none' : 'block';
            });
            // Fermer le menu si on clique ailleurs
            document.addEventListener('click', function(event) {
                if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }
    }

    /**
     * Récupère l'initiale de l'utilisateur
     */
    getUserInitial(user) {
        if (user.first_name) {
            return user.first_name.charAt(0).toUpperCase();
        } else if (user.last_name) {
            return user.last_name.charAt(0).toUpperCase();
        } else if (user.company_name) {
            return user.company_name.charAt(0).toUpperCase();
        }
        return 'U';
    }

    /**
     * Récupère le nom d'affichage de l'utilisateur
     */
    getUserName(user) {
        // Supporte snake_case ET camelCase
        const firstName = user.first_name || user.firstName;
        const lastName = user.last_name || user.lastName;
        const companyName = user.company_name || user.companyName;

        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        } else if (firstName) {
            return firstName;
        } else if (companyName) {
            return companyName;
        }
        return 'Utilisateur';
    }

    /**
     * Récupère l'affichage du rôle
     */
    getRoleDisplay(role) {
        const roleMap = {
            'user': 'Utilisateur',
            'admin': 'Administrateur',
            'transporteur': 'Transporteur',
            'transporter': 'Transporteur',
            'freight-carrier': 'Transporteur de fret',
            'passenger-carrier': 'Transporteur de passagers'
        };
        return roleMap[role] || role;
    }

    /**
     * Fonction de déconnexion statique
     */
    static logout() {
        // Nettoyer les données de session
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        
        // Nettoyer aussi localStorage si utilisé
        localStorage.removeItem('user');
        
        console.log('🔓 Déconnexion effectuée');
        
        // Recharger la page
        window.location.reload();
    }

    /**
     * Met à jour l'état après connexion
     */
    static async updateAfterLogin(userData) {
        if (window.AuthStateManager && window.AuthStateManager.instance) {
            await window.AuthStateManager.instance.checkAuthState();
        }
    }

    /**
     * Redirige vers la page de connexion avec sauvegarde de l'URL d'origine
     */
    static redirectToLogin() {
        if (window.LoginRedirectUtils) {
            console.log('🔄 Redirection vers login avec sauvegarde d\'origine');
            LoginRedirectUtils.redirectToLoginWithOriginSave('user');
        } else {
            console.error('❌ LoginRedirectUtils non disponible, redirection simple');
            window.location.href = './pages/login.html';
        }
    }
}

// Initialiser le gestionnaire
window.AuthStateManager = AuthStateManager;
window.authStateManager = new AuthStateManager();

// Fonction globale pour la déconnexion
window.logout = AuthStateManager.logout;

console.log('✅ Auth State Manager chargé'); 