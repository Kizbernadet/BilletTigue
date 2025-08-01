/**
 * Injecteur global de menu profil
 * Ce script peut être inclus dans n'importe quelle page pour ajouter automatiquement le menu profil
 */

class ProfileMenuInjector {
    constructor() {
        this.init();
    }

    init() {
        this.injectProfileMenu();
        this.injectStyles();
        this.setupProfileMenu();
    }

    injectProfileMenu() {
        // Trouver le menu de connexion existant
        const loginMenu = document.getElementById('login-menu');
        
        if (loginMenu && !document.getElementById('profile-menu')) {
            // Créer le menu profil
            const profileMenuHTML = `
                <div id="profile-menu" class="profile-dropdown-wrapper" style="display: none;">
                    <button id="profileBtn" onclick="toggleProfileMenu()" class="profile-btn">
                        <i class="ri-user-3-line"></i>
                        <span id="profile-name">Utilisateur</span>
                        <i class="ri-arrow-down-s-line"></i>
                    </button>
                    <ul class="profile-dropdown-menu" id="profileDropdown">
                        <li class="profile-info">
                            <div class="profile-header">
                                <i class="ri-user-line"></i>
                                <div class="profile-details">
                                    <span id="profile-full-name">Prénom Nom</span>
                                    <span id="profile-role" class="profile-role">Utilisateur</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <a href="/pages/profile.html" class="profile-dropdown-link">
                                <i class="ri-user-settings-line"></i>
                                Mon Profil
                            </a>
                        </li>
                        <li>
                            <a href="/web/pages/user-dashboard.html" class="profile-dropdown-link">
                                <i class="ri-dashboard-line"></i>
                                Mes Réservations
                            </a>
                        </li>
                        <li>
                            <a href="#" class="profile-dropdown-link">
                                <i class="ri-notification-3-line"></i>
                                Notifications
                            </a>
                        </li>
                        <li>
                            <a href="#" class="profile-dropdown-link" onclick="logout()">
                                <i class="ri-logout-box-r-line"></i>
                                Déconnexion
                            </a>
                        </li>
                    </ul>
                </div>
            `;
            
            // Insérer après le menu de connexion
            loginMenu.insertAdjacentHTML('afterend', profileMenuHTML);
        }
    }

    injectStyles() {
        // Vérifier si les styles sont déjà chargés
        if (!document.querySelector('link[href*="profile-menu.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../public/assets/css/profile-menu.css';
            document.head.appendChild(link);
        }
    }

    setupProfileMenu() {
        // Initialiser le menu profil
        const profileMenu = new GlobalProfileMenu();
        
        // Fonctions globales
        window.toggleProfileMenu = function() {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        };

        window.logout = function() {
            if (window.SecureLogout) {
                window.SecureLogout.logout();
            } else {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('../index.html?fallback=true');
            }
        };
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    new ProfileMenuInjector();
});

// Export pour utilisation manuelle
export default ProfileMenuInjector; 