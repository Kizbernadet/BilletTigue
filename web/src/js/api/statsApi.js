/**
 * Service API pour les statistiques administrateur
 * Gère les appels vers les endpoints de statistiques dynamiques
 */

import { apiRequest, getAuthHeaders } from './config.js';
import API_CONFIG from './config.dev.js';

class StatsAPI {
    /**
     * Récupérer les statistiques générales du dashboard admin principal
     * @returns {Promise<Object>} Statistiques générales
     */
    static async getGeneralStats() {
        try {
            console.log('📊 Récupération des statistiques générales...');
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/stats/general`, {
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

            console.log('✅ Statistiques générales récupérées:', data);
            return {
                success: true,
                data: data.data,
                message: data.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques générales:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des statistiques générales',
                error: error
            };
        }
    }

    /**
     * Récupérer les statistiques détaillées des transporteurs
     * @returns {Promise<Object>} Statistiques transporteurs
     */
    static async getTransporterStats() {
        try {
            console.log('🚛 Récupération des statistiques transporteurs...');
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/stats/transporters`, {
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

            console.log('✅ Statistiques transporteurs récupérées:', data);
            return {
                success: true,
                data: data.data,
                message: data.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques transporteurs:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des statistiques transporteurs',
                error: error
            };
        }
    }

    /**
     * Récupérer les statistiques détaillées des trajets
     * @returns {Promise<Object>} Statistiques trajets
     */
    static async getTrajetStats() {
        try {
            console.log('🛣️ Récupération des statistiques trajets...');
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/stats/trajets`, {
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

            console.log('✅ Statistiques trajets récupérées:', data);
            return {
                success: true,
                data: data.data,
                message: data.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques trajets:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des statistiques trajets',
                error: error
            };
        }
    }

    /**
     * Récupérer toutes les statistiques en une seule requête (optimisé)
     * @returns {Promise<Object>} Toutes les statistiques
     */
    static async getAllStats() {
        try {
            console.log('📈 Récupération de toutes les statistiques...');
            
            const { response, data } = await apiRequest(`${API_CONFIG.BASE_URL}/stats/all`, {
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

            console.log('✅ Toutes les statistiques récupérées:', data);
            return {
                success: true,
                data: data.data,
                message: data.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la récupération de toutes les statistiques:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des statistiques',
                error: error
            };
        }
    }

    /**
     * Mettre en cache les statistiques pour éviter les requêtes répétées
     * @param {string} key - Clé de cache
     * @param {Object} data - Données à mettre en cache
     * @param {number} ttl - Durée de vie en minutes (défaut: 5 minutes)
     */
    static cacheStats(key, data, ttl = 5) {
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl * 60 * 1000 // Convertir en millisecondes
        };
        
        try {
            sessionStorage.setItem(`stats_${key}`, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('⚠️ Impossible de mettre en cache les statistiques:', error);
        }
    }

    /**
     * Récupérer les statistiques depuis le cache si disponibles et valides
     * @param {string} key - Clé de cache
     * @returns {Object|null} Données du cache ou null si expiré/absent
     */
    static getCachedStats(key) {
        try {
            const cachedString = sessionStorage.getItem(`stats_${key}`);
            if (!cachedString) {
                return null;
            }

            const cached = JSON.parse(cachedString);
            const now = Date.now();
            
            // Vérifier si le cache est encore valide
            if (now - cached.timestamp > cached.ttl) {
                sessionStorage.removeItem(`stats_${key}`);
                return null;
            }

            console.log(`🔄 Statistiques récupérées depuis le cache: ${key}`);
            return cached.data;
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de la lecture du cache des statistiques:', error);
            return null;
        }
    }

    /**
     * Vider le cache des statistiques
     */
    static clearStatsCache() {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith('stats_')) {
                sessionStorage.removeItem(key);
            }
        });
        console.log('🧹 Cache des statistiques vidé');
    }

    /**
     * Récupérer les statistiques générales avec mise en cache
     * @param {boolean} forceRefresh - Forcer le rechargement depuis l'API
     * @returns {Promise<Object>} Statistiques générales
     */
    static async getGeneralStatsWithCache(forceRefresh = false) {
        if (!forceRefresh) {
            const cached = this.getCachedStats('general');
            if (cached) {
                return { success: true, data: cached, fromCache: true };
            }
        }

        const result = await this.getGeneralStats();
        
        if (result.success) {
            this.cacheStats('general', result.data);
        }
        
        return result;
    }

    /**
     * Récupérer les statistiques transporteurs avec mise en cache
     * @param {boolean} forceRefresh - Forcer le rechargement depuis l'API
     * @returns {Promise<Object>} Statistiques transporteurs
     */
    static async getTransporterStatsWithCache(forceRefresh = false) {
        if (!forceRefresh) {
            const cached = this.getCachedStats('transporters');
            if (cached) {
                return { success: true, data: cached, fromCache: true };
            }
        }

        const result = await this.getTransporterStats();
        
        if (result.success) {
            this.cacheStats('transporters', result.data);
        }
        
        return result;
    }
}

export default StatsAPI; 