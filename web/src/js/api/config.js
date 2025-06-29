import { DEV_CONFIG, logRequest, logResponse, logError } from './config.dev.js';

// Configuration de l'API
const API_CONFIG = {
    // URL de base de l'API (backend)
    BASE_URL: DEV_CONFIG.BASE_URL,
    
    // Headers par défaut
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Timeout pour les requêtes (en millisecondes)
    TIMEOUT: DEV_CONFIG.TIMEOUT
};

// Fonction pour obtenir les headers avec le token d'authentification
const getAuthHeaders = () => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    return {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Fonction pour gérer les erreurs de requête
const handleApiError = (error) => {
    console.error('Erreur API:', error);
    
    if (error.response) {
        // Erreur de réponse du serveur
        const { status, data } = error.response;
        return {
            success: false,
            status,
            message: data.message || 'Une erreur est survenue',
            data: data
        };
    } else if (error.request) {
        // Erreur de réseau
        return {
            success: false,
            status: 0,
            message: 'Impossible de se connecter au serveur',
            data: null
        };
    } else {
        // Autre erreur
        return {
            success: false,
            status: 0,
            message: error.message || 'Une erreur inattendue est survenue',
            data: null
        };
    }
};

// Fonction utilitaire pour faire des requêtes HTTP avec logging
const apiRequest = async (url, options) => {
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body) : null;
    
    // Logger la requête
    logRequest(method, url, data);
    
    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        // Logger la réponse
        logResponse(method, url, responseData);
        
        return { response, data: responseData };
    } catch (error) {
        // Logger l'erreur
        logError(method, url, error);
        throw error;
    }
};

// Export de CONFIG pour compatibilité avec les autres fichiers
const CONFIG = {
    API_BASE_URL: API_CONFIG.BASE_URL,
    ...API_CONFIG
};

export { API_CONFIG, CONFIG, getAuthHeaders, handleApiError, apiRequest }; 