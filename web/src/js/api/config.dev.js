// Configuration de développement pour l'API
export const DEV_CONFIG = {
    // URL de base de l'API en développement
    BASE_URL: 'http://localhost:3000/api',
    
    // Mode debug
    DEBUG: true,
    
    // Timeout plus long pour le développement
    TIMEOUT: 15000,
    
    // Logs détaillés
    LOG_REQUESTS: true,
    LOG_RESPONSES: true,
    LOG_ERRORS: true
};

// Fonction pour logger les requêtes en mode développement
export const logRequest = (method, url, data) => {
    if (DEV_CONFIG.LOG_REQUESTS) {
        console.log(`🚀 [API] ${method} ${url}`, data ? data : '');
    }
};

// Fonction pour logger les réponses en mode développement
export const logResponse = (method, url, response) => {
    if (DEV_CONFIG.LOG_RESPONSES) {
        console.log(`✅ [API] ${method} ${url}`, response);
    }
};

// Fonction pour logger les erreurs en mode développement
export const logError = (method, url, error) => {
    if (DEV_CONFIG.LOG_ERRORS) {
        console.error(`❌ [API] ${method} ${url}`, error);
    }
}; 