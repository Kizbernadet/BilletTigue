/**
 * Effets visuels avancés pour le menu profil
 * Gestion des animations, effets de ripple, et interactions
 */

class ProfileMenuEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupRippleEffects();
        this.setupGlitchEffect();
        this.setupParticleEffects();
        this.setupKeyboardNavigation();
        this.setupAccessibilityFeatures();
    }

    /**
     * Effet de ripple pour les liens du menu
     */
    setupRippleEffects() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.profile-dropdown-link');
            if (link) {
                this.createRipple(e, link);
            }
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Effet de glitch pour le nom d'utilisateur
     */
    setupGlitchEffect() {
        const profileNames = document.querySelectorAll('.profile-details span:first-child');
        profileNames.forEach(name => {
            name.setAttribute('data-text', name.textContent);
            
            // Déclencher l'effet glitch au hover
            name.addEventListener('mouseenter', () => {
                name.style.animation = 'glitch 0.3s ease-in-out infinite';
            });
            
            name.addEventListener('mouseleave', () => {
                name.style.animation = '';
            });
        });
    }

    /**
     * Effet de particules pour le bouton de déconnexion
     */
    setupParticleEffects() {
        const logoutLinks = document.querySelectorAll('.profile-dropdown-link.logout-link');
        logoutLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.createParticles(link);
            });
        });
    }

    createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#dc3545';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.transition = 'all 0.6s ease-out';

            document.body.appendChild(particle);

            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;

            setTimeout(() => {
                particle.style.left = endX + 'px';
                particle.style.top = endY + 'px';
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
            }, 10);

            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    /**
     * Navigation au clavier
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const dropdown = document.querySelector('.profile-dropdown-menu.show');
            if (!dropdown) return;

            const links = dropdown.querySelectorAll('.profile-dropdown-link');
            const currentIndex = Array.from(links).findIndex(link => link === document.activeElement);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % links.length;
                    links[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
                    links[prevIndex].focus();
                    break;
                case 'Escape':
                    this.closeMenu();
                    break;
            }
        });
    }

    /**
     * Fonctionnalités d'accessibilité
     */
    setupAccessibilityFeatures() {
        // Ajouter des attributs ARIA
        const profileBtn = document.querySelector('.profile-btn');
        const dropdown = document.querySelector('.profile-dropdown-menu');
        
        if (profileBtn) {
            profileBtn.setAttribute('aria-haspopup', 'true');
            profileBtn.setAttribute('aria-expanded', 'false');
        }

        if (dropdown) {
            dropdown.setAttribute('role', 'menu');
            dropdown.setAttribute('aria-label', 'Menu du profil utilisateur');
        }

        // Mettre à jour aria-expanded
        document.addEventListener('click', (e) => {
            if (e.target.closest('.profile-btn')) {
                const isExpanded = dropdown.classList.contains('show');
                profileBtn.setAttribute('aria-expanded', isExpanded);
            }
        });
    }

    /**
     * Fermer le menu
     */
    closeMenu() {
        const dropdown = document.querySelector('.profile-dropdown-menu.show');
        if (dropdown) {
            dropdown.classList.remove('show');
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Ajouter une notification à un élément du menu
     */
    addNotification(element, message = 'Nouveau') {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.classList.add('new-item');
            
            // Ajouter un badge de notification
            const badge = document.createElement('span');
            badge.textContent = message;
            badge.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: #dc3545;
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 10px;
                animation: notificationPulse 2s ease-in-out infinite;
            `;
            
            element.style.position = 'relative';
            element.appendChild(badge);
        }
    }

    /**
     * Effet de chargement
     */
    showLoading() {
        const dropdown = document.querySelector('.profile-dropdown-menu');
        if (dropdown) {
            dropdown.classList.add('loading');
        }
    }

    hideLoading() {
        const dropdown = document.querySelector('.profile-dropdown-menu');
        if (dropdown) {
            dropdown.classList.remove('loading');
        }
    }

    /**
     * Animation d'entrée pour les nouveaux éléments
     */
    animateNewElement(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.profileMenuEffects = new ProfileMenuEffects();
});

// Export pour utilisation manuelle
export default ProfileMenuEffects; 