/**
 * Gestionnaire de menu profil global
 * S'applique à toutes les pages accessibles aux utilisateurs clients
 */

class GlobalProfileMenu {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthAndSetupMenu();
        this.setupProfileMenuEvents();
        this.setupLoginRedirectUtils();
    }

    checkAuthAndSetupMenu() {
        const token = sessionStorage.getItem('authToken');
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        
        const loginMenu = document.getElementById('login-menu');
        const profileMenu = document.getElementById('profile-menu');
        
        if (token && userData.first_name) {
            // Utilisateur connecté - afficher le menu profil
            if (loginMenu) loginMenu.style.display = 'none';
            if (profileMenu) {
                profileMenu.style.display = 'flex';
                this.updateProfileInfo(userData);
            }
        } else {
            // Utilisateur non connecté - afficher le menu de connexion
            if (loginMenu) loginMenu.style.display = 'flex';
            if (profileMenu) profileMenu.style.display = 'none';
        }
    }

    updateProfileInfo(userData) {
        const profileName = document.getElementById('profile-name');
        const profileFullName = document.getElementById('profile-full-name');
        const profileRole = document.getElementById('profile-role');
        
        if (profileName) {
            profileName.textContent = userData.first_name;
        }
        
        if (profileFullName) {
            profileFullName.textContent = `${userData.first_name} ${userData.last_name}`;
        }
        
        if (profileRole) {
            profileRole.textContent = userData.role || 'Utilisateur';
        }
    }

    setupProfileMenuEvents() {
        // Fermer le menu quand on clique ailleurs
        document.addEventListener('click', (event) => {
            const profileBtn = document.getElementById('profileBtn');
            const dropdown = document.getElementById('profileDropdown');
            
            if (profileBtn && dropdown && !profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });

        // Échappement pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }
        });
    }

    setupLoginRedirectUtils() {
        // Fonction globale pour rediriger vers la page de connexion appropriée
        window.redirectToLogin = function(userType) {
            const currentPage = window.location.pathname;
            const returnUrl = encodeURIComponent(currentPage);
            
            if (userType === 'user') {
                window.location.href = `login.html?return=${returnUrl}`;
            } else if (userType === 'transporter') {
                window.location.href = `login.html?type=transporter&return=${returnUrl}`;
            }
        };
    }
}

// Fonction globale pour toggle le menu profil
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Fonction globale pour la déconnexion
function logout() {
    // Supprimer les données de session
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    
    // Rediriger vers la page d'accueil
    window.location.href = '../index.html';
}

// Initialisation automatique au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    new GlobalProfileMenu();
});

// Export pour utilisation dans d'autres modules
export default GlobalProfileMenu; 