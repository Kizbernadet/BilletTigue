/**
 * Module de protection d'authentification pour les pages sécurisées
 * Vérifie automatiquement si l'utilisateur est connecté et a les bonnes permissions
 */

class AuthProtection {
    constructor() {
        this.init();
    }

    /**
     * Initialise la protection d'authentification
     */
    init() {
        // Vérifier l'authentification dès le chargement de la page
        this.checkAuthentication();
    }

    /**
     * Vérifie si l'utilisateur est authentifié et a les bonnes permissions
     */
    checkAuthentication() {
        // Récupérer le token d'authentification
        const token = sessionStorage.getItem('authToken');
        
        if (!token) {
            console.log('🔒 Aucun token d\'authentification trouvé - Redirection vers login');
            this.redirectToLogin();
            return false;
        }

        // Récupérer les données utilisateur
        const userData = this.getUserData();
        
        if (!userData) {
            console.log('🔒 Données utilisateur introuvables - Redirection vers login');
            this.redirectToLogin();
            return false;
        }

        // Vérifier si l'utilisateur a le bon rôle pour cette page
        if (!this.checkUserRole(userData)) {
            console.log('🔒 Rôle utilisateur non autorisé pour cette page - Redirection');
            this.redirectToAppropriateArea(userData);
            return false;
        }

        console.log('✅ Authentification validée pour:', userData.role);
        return true;
    }

    /**
     * Récupère les données utilisateur depuis le stockage
     */
    getUserData() {
        try {
            const userDataString = sessionStorage.getItem('userData');
            if (!userDataString) {
                return null;
            }
            return JSON.parse(userDataString);
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
            return null;
        }
    }

    /**
     * Vérifie si l'utilisateur a le bon rôle pour accéder à cette page
     */
    checkUserRole(userData) {
        const currentPage = window.location.pathname;
        
        // Pages transporteur - nécessitent le rôle 'transporteur' ou 'admin'
        if (currentPage.includes('transporter-')) {
            return userData.role === 'transporteur' || userData.role === 'admin';
        }
        
        // Pages admin - nécessitent le rôle 'admin'
        if (currentPage.includes('admin-')) {
            return userData.role === 'admin';
        }
        
        // Pages utilisateur - nécessitent le rôle 'user' ou 'admin'
        if (currentPage.includes('user-')) {
            return userData.role === 'user' || userData.role === 'admin';
        }
        
        // Par défaut, autoriser l'accès (pour les pages génériques)
        return true;
    }

    /**
     * Redirige l'utilisateur vers la zone appropriée selon son rôle
     */
    redirectToAppropriateArea(userData) {
        console.log('🔄 Redirection vers zone appropriée pour rôle:', userData.role);
        switch (userData.role) {
            case 'admin':
                window.location.href = './admin-dashboard.html';
                break;
            case 'transporteur':
                window.location.href = './transporter-dashboard.html';
                break;
            case 'user':
                window.location.href = './user-dashboard.html';
                break;
            default:
                console.log('⚠️ Rôle non reconnu, redirection vers login');
                this.redirectToLogin();
        }
    }

    /**
     * Redirige vers la page de connexion appropriée selon le type de page
     */
    redirectToLogin() {
        // Nettoyer les données d'authentification invalides
        this.clearAuthData();
        
        // Sauvegarder l'URL actuelle pour redirection après connexion
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        
        // Déterminer le formulaire de connexion approprié selon la page
        const currentPage = window.location.pathname;
        let loginUrl = './login.html';
        
        if (currentPage.includes('transporter-')) {
            // Pages transporteur → formulaire de connexion transporteur
            loginUrl = './login.html?role=transporter';
            console.log('🚛 Redirection vers connexion transporteur');
        } else if (currentPage.includes('admin-') || currentPage.includes('user-')) {
            // Pages admin et user → formulaire de connexion utilisateur
            loginUrl = './login.html?role=user';
            console.log('👤 Redirection vers connexion utilisateur/admin');
        }
        
        // Rediriger vers la page de login appropriée
        window.location.href = loginUrl;
    }

    /**
     * Nettoie toutes les données d'authentification
     */
    clearAuthData() {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
    }

    /**
     * Vérifie périodiquement la validité du token (optionnel)
     */
    startTokenValidationTimer() {
        // Vérifier le token toutes les 30 minutes
        setInterval(() => {
            this.checkAuthentication();
        }, 30 * 60 * 1000);
    }

    /**
     * Méthode statique pour initialiser la protection sur une page
     */
    static protect() {
        // S'assurer que le DOM est chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new AuthProtection();
            });
        } else {
            new AuthProtection();
        }
    }
}

// Export pour utilisation dans d'autres scripts
window.AuthProtection = AuthProtection; 