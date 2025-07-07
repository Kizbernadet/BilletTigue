/**
 * Module de déconnexion sécurisée
 * Centralise la logique de déconnexion et nettoie complètement toutes les données
 */

class SecureLogout {
    /**
     * Effectue une déconnexion complète et sécurisée
     */
    static async performSecureLogout() {
        console.log('🔓 Début de la déconnexion sécurisée...');
        
        try {
            // 1. Tenter la déconnexion côté serveur si on a un token
            await this.serverLogout();
        } catch (error) {
            console.warn('⚠️ Déconnexion serveur échouée, nettoyage local forcé:', error.message);
        }
        
        // 2. Nettoyer complètement toutes les données locales
        this.clearAllAuthData();
        
        // 3. Nettoyer les données de profil personnalisé
        this.clearProfileData();
        
        // 4. Vider le cache du navigateur pour cette session
        this.clearSessionCache();
        
        console.log('✅ Déconnexion sécurisée terminée');
        
        // 5. Rediriger vers la page d'accueil avec un paramètre pour éviter la redirection automatique
        this.redirectToHome();
    }
    
    /**
     * Tente la déconnexion côté serveur
     */
    static async serverLogout() {
        const token = sessionStorage.getItem('authToken');
        
        if (!token) {
            console.log('📝 Aucun token trouvé, déconnexion locale uniquement');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ Déconnexion serveur réussie');
            } else {
                throw new Error(`Erreur serveur: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Déconnexion serveur échouée: ${error.message}`);
        }
    }
    
    /**
     * Nettoie complètement toutes les données d'authentification
     */
    static clearAllAuthData() {
        console.log('🧹 Nettoyage complet des données d\'authentification...');
        
        // Liste complète de toutes les clés possibles
        const authKeys = [
            'authToken',
            'userData',
            'user',
            'token',
            'userToken',
            'sessionToken',
            'refreshToken',
            'rememberMe',
            'loginData',
            'authData',
            'userProfile',
            'currentUser',
            'userSession'
        ];
        
        // Nettoyer sessionStorage
        authKeys.forEach(key => {
            if (sessionStorage.getItem(key)) {
                console.log(`🗑️ Suppression sessionStorage: ${key}`);
                sessionStorage.removeItem(key);
            }
        });
        
        // Nettoyer localStorage  
        authKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                console.log(`🗑️ Suppression localStorage: ${key}`);
                localStorage.removeItem(key);
            }
        });
        
        // Nettoyer toutes les clés liées à l'auth (au cas où)
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
                console.log(`🗑️ Suppression localStorage (pattern): ${key}`);
                localStorage.removeItem(key);
            }
        }
        
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
                console.log(`🗑️ Suppression sessionStorage (pattern): ${key}`);
                sessionStorage.removeItem(key);
            }
        }
    }
    
    /**
     * Nettoie les données de profil personnalisé
     */
    static clearProfileData() {
        console.log('👤 Nettoyage des données de profil...');
        
        const profileKeys = [
            'redirectAfterLogin',
            'lastLoginType',
            'userPreferences',
            'dashboardData'
        ];
        
        profileKeys.forEach(key => {
            sessionStorage.removeItem(key);
        });
    }
    
    /**
     * Vide le cache de session
     */
    static clearSessionCache() {
        try {
            // Effacer l'historique de navigation pour cette session si possible
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, null, window.location.pathname);
            }
        } catch (error) {
            console.warn('⚠️ Impossible de vider le cache de session:', error.message);
        }
    }
    
    /**
     * Redirige vers la page d'accueil avec sécurité
     */
    static redirectToHome() {
        // Ajouter un timestamp pour éviter le cache et la redirection automatique
        const timestamp = Date.now();
        const homeUrl = `../index.html?logout=${timestamp}`;
        
        console.log('🏠 Redirection vers:', homeUrl);
        
        // Forcer le rechargement complet
        window.location.replace(homeUrl);
    }
    
    /**
     * Vérification de sécurité : s'assurer qu'aucune donnée sensible ne reste
     */
    static verifyCleanup() {
        const remainingKeys = [];
        
        // Vérifier sessionStorage
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
                remainingKeys.push(`sessionStorage: ${key}`);
            }
        }
        
        // Vérifier localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
                remainingKeys.push(`localStorage: ${key}`);
            }
        }
        
        if (remainingKeys.length > 0) {
            console.warn('⚠️ Données sensibles encore présentes:', remainingKeys);
            return false;
        }
        
        console.log('✅ Vérification : toutes les données sensibles ont été supprimées');
        return true;
    }
    
    /**
     * Déconnexion d'urgence (si la déconnexion normale échoue)
     */
    static emergencyLogout() {
        console.warn('🚨 Déconnexion d\'urgence activée');
        
        // Vider complètement les storages
        try {
            sessionStorage.clear();
            localStorage.clear();
        } catch (error) {
            console.error('❌ Impossible de vider les storages:', error);
        }
        
        // Redirection forcée
        window.location.replace('../index.html?emergency=true');
    }
    
    /**
     * Méthode publique simplifiée pour déclencher la déconnexion
     */
    static async logout() {
        try {
            await this.performSecureLogout();
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion sécurisée:', error);
            // En cas d'erreur, utiliser la déconnexion d'urgence
            this.emergencyLogout();
        }
    }
}

// Export global
window.SecureLogout = SecureLogout; 