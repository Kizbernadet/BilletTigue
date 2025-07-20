/**
 * Utilitaires pour la gestion des redirections de connexion avec returnUrl
 * Usage : Inclure ce fichier dans toutes les pages qui ont des boutons "Se connecter"
 * Permet de revenir à la page d'origine après connexion
 */

class LoginRedirectUtils {
    /**
     * Capture l'URL actuelle comme URL de retour
     * À appeler avant de rediriger vers la page de connexion
     */
    static captureReturnUrl() {
        const currentUrl = window.location.href;
        const returnUrl = encodeURIComponent(currentUrl);
        console.log('📍 URL de retour capturée:', currentUrl);
        return returnUrl;
    }

    /**
     * Sauvegarde l'URL d'origine avant la redirection vers login
     * @returns {string} L'URL d'origine sauvegardée
     */
    static saveOriginPathBeforeLogin() {
        const originPath = window.location.href;
        localStorage.setItem('originPathBeforeLogin', originPath);
        console.log('💾 URL d\'origine sauvegardée dans localStorage:', originPath);
        return originPath;
    }

    /**
     * Récupère l'URL d'origine sauvegardée avant login
     * @returns {string|null} L'URL d'origine ou null si non trouvée
     */
    static getOriginPathBeforeLogin() {
        const originPath = localStorage.getItem('originPathBeforeLogin');
        console.log('📂 URL d\'origine récupérée depuis localStorage:', originPath);
        return originPath;
    }

    /**
     * Nettoie l'URL d'origine sauvegardée
     */
    static clearOriginPathBeforeLogin() {
        localStorage.removeItem('originPathBeforeLogin');
        console.log('🧹 URL d\'origine nettoyée du localStorage');
    }

    /**
     * Redirige vers la page de connexion avec l'URL de retour
     * @param {string} userType - Type d'utilisateur ('user' ou 'transporter')
     * @param {string} returnUrl - URL de retour (optionnel, capture automatiquement si non fournie)
     */
    static redirectToLogin(userType = 'user', returnUrl = null) {
        // Capturer l'URL de retour si non fournie
        if (!returnUrl) {
            returnUrl = this.captureReturnUrl();
        }

        // Utiliser les nouveaux utilitaires d'authentification si disponibles
        if (window.AuthRedirectUtils) {
            // Utiliser AuthRedirectUtils pour la redirection correcte
            AuthRedirectUtils.redirectToLogin(userType);
        } else {
            // Fallback vers l'ancienne méthode avec détection de chemin
            let loginUrl;
            if (window.location.pathname.includes('/pages/')) {
                loginUrl = `./login.html?role=${userType}&returnUrl=${returnUrl}`;
            } else {
                loginUrl = `./pages/login.html?role=${userType}&returnUrl=${returnUrl}`;
            }
            console.log('🔄 Redirection vers login avec retour (fallback):', loginUrl);
            window.location.href = loginUrl;
        }
        
        // Sauvegarder l'URL d'origine dans le localStorage
        this.saveOriginPathBeforeLogin();
    }

    /**
     * Redirige vers la page de connexion avec sauvegarde de l'URL d'origine
     * @param {string} userType - Type d'utilisateur ('user' ou 'transporter')
     * @param {string} returnUrl - URL de retour (optionnel, capture automatiquement si non fournie)
     */
    static redirectToLoginWithOriginSave(userType = 'user', returnUrl = null) {
        // D'abord sauvegarder l'URL d'origine dans le localStorage
        this.saveOriginPathBeforeLogin();
        
        // Capturer l'URL de retour si non fournie
        if (!returnUrl) {
            returnUrl = this.captureReturnUrl();
        }

        // Utiliser les nouveaux utilitaires d'authentification si disponibles
        if (window.AuthRedirectUtils) {
            // Utiliser AuthRedirectUtils pour la redirection correcte
            AuthRedirectUtils.redirectToLogin(userType);
        } else {
            // Fallback vers l'ancienne méthode avec détection de chemin
            let loginUrl;
            if (window.location.pathname.includes('/pages/')) {
                loginUrl = `./login.html?role=${userType}&returnUrl=${returnUrl}`;
            } else {
                loginUrl = `./pages/login.html?role=${userType}&returnUrl=${returnUrl}`;
            }
            console.log('🔄 Redirection vers login avec sauvegarde d\'origine (fallback):', loginUrl);
            window.location.href = loginUrl;
        }
    }

    /**
     * Récupère l'URL de retour depuis les paramètres de l'URL
     * @returns {string|null} URL de retour ou null si non trouvée
     */
    static getReturnUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log('🔄 URL params:', urlParams);
        const returnUrl = urlParams.get('returnUrl');
        if (returnUrl) {
            return decodeURIComponent(returnUrl);
        }
        return null;
    }

    /**
     * Redirige vers le dashboard par défaut selon le rôle de l'utilisateur
     * @param {Object} user - Objet utilisateur avec le rôle
     * @param {string} defaultDashboard - Dashboard par défaut (optionnel)
     */
    static redirectAfterLogin(user, defaultDashboard = null) {
        // Rediriger selon le rôle de l'utilisateur
        let destinationPath;
        
        switch (user.role) {
            case 'admin':
                destinationPath = './admin-dashboard.html';
                break;
            case 'transporteur':
            case 'transporter':
            case 'freight-carrier':
            case 'passenger-carrier':
                destinationPath = './transporter-dashboard.html';
                break;
            case 'user':
            default:
                // Vérifier s'il y a une URL d'origine sauvegardée dans le localStorage
                const originPath = this.getOriginPathBeforeLogin();
                if (originPath) {
                    // Retourner à la page d'origine
                    console.log('🔄 Retour à la page d\'origine depuis localStorage:', originPath);
                    this.clearOriginPathBeforeLogin(); // Nettoyer après utilisation
                    setTimeout(() => {
                        window.location.href = originPath;
                    }, 1500);
                    return;
                }
                // Fallback vers la page d'accueil si pas d'URL d'origine
                destinationPath = './index.html';
                break;
        }
        
        // Déterminer le chemin relatif selon la page actuelle
        if (window.location.pathname.includes('/pages/')) {
            if (user.role === 'user') {
                destinationPath = '../index.html'; // Pour les pages dans le dossier pages
            } else {
                destinationPath = `./${destinationPath}`; // Pour les dashboards
            }
        } else {
            if (user.role === 'user') {
                destinationPath = './index.html'; // Pour les autres pages
            } else {
                destinationPath = `./pages/${destinationPath}`; // Pour les dashboards
            }
        }
        
        console.log('🔄 Redirection vers:', destinationPath);
        setTimeout(() => {
            window.location.href = destinationPath;
        }, 1500);
    }

    /**
     * Vérifie si on vient d'une page de connexion avec URL de retour
     * @returns {boolean} True si on a une URL de retour
     */
    static hasReturnUrl() {
        return this.getReturnUrl() !== null;
    }

    /**
     * Nettoie les paramètres de retour de l'URL (pour éviter les redirections en boucle)
     */
    static cleanReturnUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete('returnUrl');
        url.searchParams.delete('role');
        
        // Mettre à jour l'URL sans recharger la page
        window.history.replaceState({}, '', url.toString());
    }
}

/**
 * Fonction pour vérifier si l'utilisateur est déjà connecté
 * et rediriger vers la page appropriée
 */
window.checkAuthAndRedirect = function() {
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            console.log('👤 Utilisateur déjà connecté détecté:', user);
            
            // Vérifier s'il y a une URL de retour
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('returnUrl');
            
            if (returnUrl && window.location.pathname.includes('login.html')) {
                // Rediriger vers la page d'origine si on est sur login
                const decodedReturnUrl = decodeURIComponent(returnUrl);
                console.log('🔄 Redirection vers page d\'origine:', decodedReturnUrl);
                window.location.href = decodedReturnUrl;
                return true;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'auth:', error);
        }
    }
    
    return false;
};

/**
 * Mettre à jour l'affichage des menus selon l'état de connexion
 */
window.updateTopbarMenus = function() {
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    
    const loginMenu = document.getElementById('login-menu');
    const userMenu = document.getElementById('user-menu');
    
    if (token && userData) {
        // Utilisateur connecté
        try {
            const user = JSON.parse(userData);
            
            if (loginMenu) loginMenu.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = document.getElementById('user-name');
                if (userName) {
                    userName.textContent = user.first_name || user.company_name || 'Utilisateur';
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des menus:', error);
        }
    } else {
        // Utilisateur non connecté
        if (loginMenu) loginMenu.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
};

/**
 * Initialiser les utilitaires de redirection de connexion
 * À appeler au chargement de chaque page
 */
window.initLoginRedirectUtils = function() {
    console.log('🔧 Initialisation des utilitaires de redirection de connexion');
    
    // Mettre à jour l'affichage des menus
    updateTopbarMenus();
    
    // Configurer les liens de profil selon la page actuelle
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        let profilePath = './pages/profile.html'; // Pour la page d'accueil
        if (window.location.pathname.includes('/pages/')) {
            profilePath = './profile.html'; // Pour les pages dans le dossier pages
        }
        profileLink.href = profilePath;
    }
    
    // Configurer la déconnexion si le bouton existe
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.SecureLogout) {
                window.SecureLogout.logout();
            } else {
                sessionStorage.clear();
                localStorage.clear();
                let homePath = '../index.html?fallback=true';
            if (!window.location.pathname.includes('/pages/')) {
                    homePath = './index.html?fallback=true';
                }
                window.location.href = homePath;
            }
        });
    }
    
    // Écouter les changements de localStorage pour synchroniser entre onglets
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken' || e.key === 'userData') {
            updateTopbarMenus();
        }
    });
};

// Exposer la classe et les fonctions globalement
window.LoginRedirectUtils = LoginRedirectUtils;
window.redirectToLogin = LoginRedirectUtils.redirectToLogin.bind(LoginRedirectUtils);

// Nettoyer automatiquement les paramètres de retour une fois utilisés
if (LoginRedirectUtils.hasReturnUrl()) {
    // Attendre un peu avant de nettoyer pour permettre l'utilisation
    setTimeout(() => {
        LoginRedirectUtils.cleanReturnUrl();
    }, 2000);
}

console.log('✅ Login Redirect Utils chargé'); 