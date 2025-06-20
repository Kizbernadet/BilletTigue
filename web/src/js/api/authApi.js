import { API_CONFIG, getAuthHeaders, handleApiError, apiRequest } from './config.js';

/**
 * Service API pour l'authentification
 * Gère les requêtes d'inscription et de connexion
 */

class AuthAPI {
    /**
     * Inscription d'un nouvel utilisateur
     * @param {Object} userData - Données de l'utilisateur
     * @param {string} userData.email - Email de l'utilisateur
     * @param {string} userData.password - Mot de passe
     * @param {string} userData.role - Rôle (user ou transporter)
     * @param {string} userData.service - Service sélectionné
     * @param {Object} userData.profile - Données du profil selon le rôle
     * @returns {Promise<Object>} Résultat de l'inscription
     */
    static async register(userData) {
        try {
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: API_CONFIG.DEFAULT_HEADERS,
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: data
                    }
                };
            }

            return {
                success: true,
                data: data,
                message: 'Inscription réussie'
            };

        } catch (error) {
            return handleApiError(error);
        }
    }

    /**
     * Connexion d'un utilisateur
     * @param {Object} credentials - Identifiants de connexion
     * @param {string} credentials.email - Email de l'utilisateur
     * @param {string} credentials.password - Mot de passe
     * @returns {Promise<Object>} Résultat de la connexion
     */
    static async login(credentials) {
        try {
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: API_CONFIG.DEFAULT_HEADERS,
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: data
                    }
                };
            }

            // Sauvegarder le token dans le localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
            }

            return {
                success: true,
                data: data,
                message: 'Connexion réussie'
            };

        } catch (error) {
            return handleApiError(error);
        }
    }

    /**
     * Déconnexion de l'utilisateur
     * @returns {Promise<Object>} Résultat de la déconnexion
     */
    static async logout() {
        try {
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            // Supprimer les données locales même si la requête échoue
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: data
                    }
                };
            }

            return {
                success: true,
                message: 'Déconnexion réussie'
            };

        } catch (error) {
            // Supprimer les données locales même en cas d'erreur
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            return handleApiError(error);
        }
    }

    /**
     * Vérifier si l'utilisateur est connecté
     * @returns {boolean} True si connecté, false sinon
     */
    static isAuthenticated() {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    /**
     * Obtenir les données de l'utilisateur connecté
     * @returns {Object|null} Données de l'utilisateur ou null
     */
    static getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
}

export default AuthAPI; 