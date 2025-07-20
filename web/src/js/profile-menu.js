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
        // Cette fonction est maintenant gérée par login-redirect-utils.js
        // Ne pas redéfinir window.redirectToLogin ici
        console.log('✅ Profile menu initialisé - redirection gérée par login-redirect-utils.js');
    }
}

// Fonction globale pour toggle le menu profil
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        const isVisible = dropdown.style.display === 'block' || dropdown.classList.contains('show');
        
        if (isVisible) {
            // Fermer le menu
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
            console.log('🔽 Menu profil fermé');
        } else {
            // Ouvrir le menu
            dropdown.style.display = 'block';
            // Force reflow pour que l'animation fonctionne
            dropdown.offsetHeight;
            dropdown.classList.add('show');
            console.log('🔼 Menu profil ouvert');
        }
    }
}

// Fonction unifiée pour tous les boutons profil
function toggleAnyProfileMenu(buttonId, dropdownId) {
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    
    if (button && dropdown) {
        const isVisible = dropdown.style.display === 'block' || dropdown.classList.contains('show');
        
        if (isVisible) {
            // Fermer le menu
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
            dropdown.style.pointerEvents = 'none';
            console.log(`🔽 Menu profil fermé (${dropdownId})`);
        } else {
            // Positionner le menu par rapport au bouton si c'est un menu fixe
            if (dropdown.style.position === 'fixed' || dropdown.classList.contains('profile-dropdown-menu')) {
                const btnRect = button.getBoundingClientRect();
                dropdown.style.position = 'fixed';
                dropdown.style.top = (btnRect.bottom + 5) + 'px';
                dropdown.style.right = (window.innerWidth - btnRect.right) + 'px';
            }
            
            // Ouvrir le menu
            dropdown.style.display = 'block';
            // Force reflow pour que l'animation fonctionne
            dropdown.offsetHeight;
            dropdown.classList.add('show');
            dropdown.style.pointerEvents = 'auto';
            console.log(`🔼 Menu profil ouvert (${dropdownId})`);
        }
    }
}

// Fonction globale pour la déconnexion
function logout() {
    if (window.SecureLogout) {
        window.SecureLogout.logout();
    } else {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('../index.html?fallback=true');
    }
}

// Exposer les fonctions globalement
window.toggleProfileMenu = toggleProfileMenu;
window.toggleAnyProfileMenu = toggleAnyProfileMenu;
window.logout = logout;

// Initialisation automatique au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    new GlobalProfileMenu();
    console.log('✅ Menu profil initialisé avec interactions');
});

// Export pour utilisation dans d'autres modules
export default GlobalProfileMenu; 