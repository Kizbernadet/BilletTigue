/**
 * Utilitaires pour les redirections d'authentification
 * Gère les redirections vers login.html avec le bon paramètre de rôle
 */

class AuthRedirectUtils {
    /**
     * Redirige vers la page de connexion avec le bon paramètre de rôle
     * @param {string} role - Rôle de l'utilisateur ('user', 'transporter', 'admin')
     */
    static redirectToLogin(role = 'user') {
        // Toujours utiliser le chemin absolu
        let loginPath = '/pages/login.html';
        // Construire l'URL avec le paramètre de rôle
        const url = new URL(loginPath, window.location.origin);
        url.searchParams.set('role', role);
        console.log('🔄 Redirection vers login:', url.href);
        window.location.href = url.href;
    }

    /**
     * Redirige vers la page de connexion selon le rôle de l'utilisateur connecté
     */
    static redirectToLoginWithUserRole() {
        const userData = sessionStorage.getItem('userData');
        let role = 'user'; // Par défaut

        if (userData) {
            try {
                const user = JSON.parse(userData);
                role = user.role || 'user';
            } catch (error) {
                console.warn('⚠️ Erreur lors du parsing des données utilisateur:', error);
            }
        }

        this.redirectToLogin(role);
    }

    /**
     * Redirige vers la page de connexion pour un transporteur
     */
    static redirectToTransporterLogin() {
        this.redirectToLogin('transporter');
    }

    /**
     * Redirige vers la page de connexion pour un utilisateur standard
     */
    static redirectToUserLogin() {
        this.redirectToLogin('user');
    }

    /**
     * Redirige vers la page de connexion pour un administrateur
     */
    static redirectToAdminLogin() {
        this.redirectToLogin('admin');
    }

    /**
     * Redirige vers le dashboard approprié selon le rôle
     * @param {Object} user - Données de l'utilisateur
     */
    static redirectToDashboard(user) {
        if (!user || !user.role) {
            console.warn('⚠️ Aucun utilisateur ou rôle trouvé, redirection vers login');
            this.redirectToUserLogin();
            return;
        }

        let dashboardPath;
        switch (user.role) {
            case 'admin':
                dashboardPath = './admin-dashboard.html';
                break;
            case 'transporter':
                dashboardPath = './transporter-dashboard.html';
                break;
            case 'user':
                dashboardPath = './user-dashboard.html';
                break;
            default:
                console.warn('⚠️ Rôle inconnu:', user.role);
                dashboardPath = './user-dashboard.html';
        }

        window.location.href = dashboardPath;
    }

    /**
     * Redirige vers la page d'accueil avec nettoyage des paramètres
     */
    static redirectToHome() {
        // Nettoyer les paramètres d'URL
        const url = new URL(window.location.origin);
        url.pathname = window.location.pathname.includes('/pages/') ? '../index.html' : './index.html';
        window.location.href = url.pathname;
    }
}

// Exposer globalement pour compatibilité
window.AuthRedirectUtils = AuthRedirectUtils; 