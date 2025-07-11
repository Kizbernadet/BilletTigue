/**
 * Service API pour la gestion des profils utilisateurs
 * Gère les requêtes de récupération et mise à jour des profils
 */

import { API_CONFIG, getAuthHeaders, handleApiError, apiRequest } from './config.js';

class ProfileAPI {
    /**
     * Récupère le profil complet de l'utilisateur connecté
     * @returns {Promise<Object>} Profil complet de l'utilisateur
     */
    static async getCurrentUserProfile() {
        try {
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/profile`, {
                method: 'GET',
                headers: getAuthHeaders()
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
                data: data.data,
                message: 'Profil récupéré avec succès'
            };

        } catch (error) {
            return handleApiError(error);
        }
    }

    /**
     * Met à jour le profil de l'utilisateur connecté
     * @param {Object} profileData - Données du profil à mettre à jour
     * @returns {Promise<Object>} Profil mis à jour
     */
    static async updateUserProfile(profileData) {
        try {
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/profile`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(profileData)
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
                data: data.data,
                message: data.message || 'Profil mis à jour avec succès'
            };

        } catch (error) {
            return handleApiError(error);
        }
    }

    /**
     * Change le mot de passe de l'utilisateur connecté
     * @param {Object} passwordData - { currentPassword, newPassword }
     * @returns {Promise<Object>} Résultat du changement de mot de passe
     */
    static async changePassword(passwordData) {
        try {
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/profile/change-password`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(passwordData)
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
                message: data.message || 'Mot de passe modifié avec succès'
            };

        } catch (error) {
            return handleApiError(error);
        }
    }

    /**
     * Récupère et met à jour les données utilisateur dans le sessionStorage
     * @returns {Promise<Object>} Données utilisateur mises à jour
     */
    static async refreshUserData() {
        try {
            const result = await this.getCurrentUserProfile();
            
            if (result.success) {
                // Mettre à jour les données dans sessionStorage
                sessionStorage.setItem('userData', JSON.stringify(result.data));
                
                // Déclencher un événement pour notifier les autres composants
                window.dispatchEvent(new CustomEvent('userDataUpdated', {
                    detail: { userData: result.data }
                }));
                
                return {
                    success: true,
                    data: result.data,
                    message: 'Données utilisateur mises à jour'
                };
            } else {
                throw new Error(result.message || 'Erreur lors de la récupération du profil');
            }

        } catch (error) {
            console.error('Erreur lors de la mise à jour des données utilisateur:', error);
            return {
                success: false,
                message: error.message || 'Erreur lors de la mise à jour des données utilisateur'
            };
        }
    }
}

export default ProfileAPI; 