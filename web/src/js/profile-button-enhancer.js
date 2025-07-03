/**
 * Enhancer pour le bouton de profil utilisateur
 * Ajoute des interactions avancées et animations
 */

class ProfileButtonEnhancer {
    constructor() {
        this.userDropdown = null;
        this.userButton = null;
        this.userName = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialise l'enhancer du bouton de profil
     */
    init() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupProfileButton());
        } else {
            this.setupProfileButton();
        }
    }

    /**
     * Configure le bouton de profil avec les améliorations
     */
    setupProfileButton() {
        this.userDropdown = document.getElementById('user-menu');
        this.userButton = document.querySelector('.btn-user');
        this.userName = document.getElementById('user-name');

        if (!this.userDropdown || !this.userButton) {
            // Réessayer après un délai si les éléments ne sont pas encore prêts
            setTimeout(() => this.setupProfileButton(), 500);
            return;
        }

        this.setupInteractions();
        this.setupAnimations();
        this.setupAccessibility();
        this.setupWelcomeAnimation();
        
        this.isInitialized = true;
        console.log('✨ Profile Button Enhancer initialisé');
    }

    /**
     * Configure les interactions du bouton
     */
    setupInteractions() {
        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!this.userDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Gestion du clic sur le bouton
        this.userButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Améliorer l'expérience tactile (mobile)
        this.userButton.addEventListener('touchstart', (e) => {
            this.userButton.style.transform = 'scale(0.95)';
        });

        this.userButton.addEventListener('touchend', (e) => {
            setTimeout(() => {
                this.userButton.style.transform = '';
            }, 150);
        });
    }

    /**
     * Configure les animations
     */
    setupAnimations() {
        // Animation d'entrée en fondu pour le nom d'utilisateur
        if (this.userName && this.userName.textContent.trim()) {
            this.animateUserNameEntry();
        }

        // Observer les changements de nom d'utilisateur
        if (this.userName) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        this.animateUserNameEntry();
                    }
                });
            });

            observer.observe(this.userName, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    /**
     * Animation d'entrée du nom d'utilisateur
     */
    animateUserNameEntry() {
        if (!this.userName) return;

        // Ajouter la classe d'animation
        this.userName.style.opacity = '0';
        this.userName.style.transform = 'translateX(-10px)';

        // Déclencher l'animation
        setTimeout(() => {
            this.userName.style.transition = 'all 0.5s ease-out';
            this.userName.style.opacity = '1';
            this.userName.style.transform = 'translateX(0)';
        }, 100);

        // Ajouter un effet de mise en évidence temporaire
        setTimeout(() => {
            this.userButton.classList.add('highlight');
            setTimeout(() => {
                this.userButton.classList.remove('highlight');
            }, 3000);
        }, 600);
    }

    /**
     * Configure l'accessibilité
     */
    setupAccessibility() {
        // Ajouter les attributs ARIA
        this.userButton.setAttribute('aria-haspopup', 'true');
        this.userButton.setAttribute('aria-expanded', 'false');
        this.userButton.setAttribute('aria-label', 'Menu du profil utilisateur');

        const userOptionsList = this.userDropdown.querySelector('.user-options-list');
        if (userOptionsList) {
            userOptionsList.setAttribute('role', 'menu');
            userOptionsList.setAttribute('aria-label', 'Options du profil');

            // Ajouter les attributs aux items du menu
            const menuItems = userOptionsList.querySelectorAll('.user-option');
            menuItems.forEach((item, index) => {
                item.setAttribute('role', 'menuitem');
                item.setAttribute('tabindex', '-1');
            });
        }

        // Gestion du clavier
        this.userButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDropdown();
            } else if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }

    /**
     * Animation de bienvenue pour les nouveaux utilisateurs
     */
    setupWelcomeAnimation() {
        // Vérifier si c'est une première connexion récente
        const isRecentLogin = sessionStorage.getItem('recentLogin');
        if (isRecentLogin === 'true') {
            setTimeout(() => {
                this.showWelcomeAnimation();
                sessionStorage.removeItem('recentLogin');
            }, 1000);
        }
    }

    /**
     * Affiche une animation de bienvenue
     */
    showWelcomeAnimation() {
        // Créer une notification de bienvenue
        const welcomeNotification = document.createElement('div');
        welcomeNotification.className = 'welcome-notification';
        welcomeNotification.innerHTML = `
            <div class="welcome-content">
                <i class="fas fa-check-circle"></i>
                <span>Connexion réussie !</span>
            </div>
        `;

        // Styles pour la notification
        welcomeNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(46, 204, 113, 0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.4s ease;
            font-family: 'Comfortaa', sans-serif;
            font-weight: 500;
        `;

        // Ajouter au DOM
        document.body.appendChild(welcomeNotification);

        // Animer l'entrée
        setTimeout(() => {
            welcomeNotification.style.opacity = '1';
            welcomeNotification.style.transform = 'translateX(0)';
        }, 100);

        // Retirer après 3 secondes
        setTimeout(() => {
            welcomeNotification.style.opacity = '0';
            welcomeNotification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (welcomeNotification.parentNode) {
                    welcomeNotification.parentNode.removeChild(welcomeNotification);
                }
            }, 400);
        }, 3000);
    }

    /**
     * Ouvre/ferme le dropdown
     */
    toggleDropdown() {
        const userOptionsList = this.userDropdown.querySelector('.user-options-list');
        if (!userOptionsList) return;

        const isVisible = userOptionsList.style.opacity === '1' || 
                         getComputedStyle(userOptionsList).opacity === '1';

        if (isVisible) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    /**
     * Ouvre le dropdown
     */
    openDropdown() {
        const userOptionsList = this.userDropdown.querySelector('.user-options-list');
        if (!userOptionsList) return;

        userOptionsList.style.opacity = '1';
        userOptionsList.style.visibility = 'visible';
        userOptionsList.style.transform = 'translateY(0)';
        
        this.userButton.setAttribute('aria-expanded', 'true');
        
        // Focus sur le premier élément du menu
        const firstMenuItem = userOptionsList.querySelector('.user-option');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }

    /**
     * Ferme le dropdown
     */
    closeDropdown() {
        const userOptionsList = this.userDropdown.querySelector('.user-options-list');
        if (!userOptionsList) return;

        userOptionsList.style.opacity = '0';
        userOptionsList.style.visibility = 'hidden';
        userOptionsList.style.transform = 'translateY(-10px)';
        
        this.userButton.setAttribute('aria-expanded', 'false');
    }

    /**
     * Met à jour le nom d'utilisateur avec animation
     */
    updateUserName(newName) {
        if (!this.userName || !newName) return;

        // Animation de sortie
        this.userName.style.transform = 'translateX(-10px)';
        this.userName.style.opacity = '0';

        setTimeout(() => {
            this.userName.textContent = newName;
            this.animateUserNameEntry();
        }, 200);
    }

    /**
     * Marque une connexion récente pour l'animation de bienvenue
     */
    static markRecentLogin() {
        sessionStorage.setItem('recentLogin', 'true');
    }
}

// Initialiser automatiquement l'enhancer
const profileEnhancer = new ProfileButtonEnhancer();

// Exposer globalement pour utilisation externe
window.ProfileButtonEnhancer = ProfileButtonEnhancer;
window.profileEnhancer = profileEnhancer;

console.log('🎨 Profile Button Enhancer chargé'); 