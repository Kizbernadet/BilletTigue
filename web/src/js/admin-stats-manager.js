/**
 * Gestionnaire des statistiques dynamiques pour les dashboards admin
 * Remplace les valeurs statiques par des données réelles de la base
 */

class AdminStatsManager {
    constructor() {
        this.loadingIndicators = new Map();
        this.refreshInterval = null;
        this.autoRefreshEnabled = true;
        this.refreshIntervalMs = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Initialiser le gestionnaire de statistiques
     */
    async init() {
        console.log('📊 Initialisation du gestionnaire de statistiques admin...');
        
        try {
            // Utiliser le service API directement (pas d'import ES6)
            this.StatsAPI = {
                getGeneralStatsWithCache: this.getGeneralStatsWithCache.bind(this),
                getTransporterStatsWithCache: this.getTransporterStatsWithCache.bind(this),
                clearStatsCache: this.clearStatsCache.bind(this)
            };
            
            // Déterminer le type de dashboard
            this.dashboardType = this.detectDashboardType();
            
            // Charger les statistiques appropriées
            await this.loadDashboardStats();
            
            // Configurer l'actualisation automatique
            this.setupAutoRefresh();
            
            console.log('✅ Gestionnaire de statistiques initialisé');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du gestionnaire de statistiques:', error);
            this.showErrorFallback();
        }
    }

    /**
     * Détecter le type de dashboard actuel
     */
    detectDashboardType() {
        const path = window.location.pathname;
        
        if (path.includes('admin-dashboard-transporter')) {
            return 'transporters';
        } else if (path.includes('admin-dashboard')) {
            return 'general';
        }
        
        return 'general';
    }

    /**
     * Charger les statistiques selon le type de dashboard
     */
    async loadDashboardStats() {
        switch (this.dashboardType) {
            case 'general':
                await this.loadGeneralDashboardStats();
                break;
            case 'transporters':
                await this.loadTransporterDashboardStats();
                break;
            default:
                console.warn('⚠️ Type de dashboard non reconnu:', this.dashboardType);
        }
    }

    /**
     * Charger les statistiques du dashboard général
     */
    async loadGeneralDashboardStats() {
        console.log('📈 Chargement des statistiques du dashboard général...');
        
        // Afficher les indicateurs de chargement
        this.showLoadingStates([
            'users-stat',
            'transporters-stat', 
            'trajets-stat',
            'colis-stat',
            'revenue-stat',
            'satisfaction-stat',
            'security-stat'
        ]);

        try {
            // Récupérer les statistiques générales
            const result = await this.StatsAPI.getGeneralStatsWithCache();
            
            if (result.success) {
                this.updateGeneralStats(result.data);
                this.hideLoadingStates();
                
                if (result.fromCache) {
                    console.log('🔄 Statistiques affichées depuis le cache');
                }
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement des statistiques générales:', error);
            this.showErrorStates();
        }
    }

    /**
     * Charger les statistiques du dashboard transporteurs
     */
    async loadTransporterDashboardStats() {
        console.log('🚛 Chargement des statistiques transporteurs...');
        
        // Afficher les indicateurs de chargement
        this.showLoadingStates([
            'total-transporters',
            'validated-transporters',
            'pending-transporters', 
            'suspended-transporters'
        ]);

        try {
            // Récupérer les statistiques transporteurs
            const result = await this.StatsAPI.getTransporterStatsWithCache();
            
            if (result.success) {
                this.updateTransporterStats(result.data);
                this.hideLoadingStates();
                
                if (result.fromCache) {
                    console.log('🔄 Statistiques transporteurs affichées depuis le cache');
                }
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement des statistiques transporteurs:', error);
            this.showErrorStates();
        }
    }

    /**
     * Mettre à jour les statistiques du dashboard général
     */
    updateGeneralStats(stats) {
        console.log('🔄 Mise à jour des statistiques générales...', stats);

        // Chercher et mettre à jour chaque statistique par icône
        const statMappings = [
            { icon: 'ri-user-3-line', value: stats.users?.active || 0 },
            { icon: 'ri-truck-line', value: stats.transporters?.validated || 0 },
            { icon: 'ri-route-line', value: stats.trajets?.active || 0 },
            { icon: 'ri-box-3-line', value: stats.colis?.inTransit || 0 },
            { icon: 'ri-currency-euro-line', value: this.formatCurrency(stats.revenue?.monthly || 0) },
            { icon: 'ri-line-chart-line', value: `${stats.satisfaction?.rate || 0}%` },
            { icon: 'ri-shield-check-line', value: stats.security?.incidents || 0 }
        ];

        statMappings.forEach(mapping => {
            this.updateStatByIcon(mapping.icon, mapping.value);
        });

        console.log('✅ Statistiques générales mises à jour');
    }

    /**
     * Mettre à jour les statistiques du dashboard transporteurs
     */
    updateTransporterStats(stats) {
        console.log('🔄 Mise à jour des statistiques transporteurs...', stats);

        // Mapping des statistiques par icône pour un ciblage précis
        const statMappings = [
            { icon: 'ri-truck-line', value: stats.total || 0, label: 'Total transporteurs' },
            { icon: 'ri-checkbox-circle-line', value: stats.validated || 0, label: 'Transporteurs validés' },
            { icon: 'ri-time-line', value: stats.pending || 0, label: 'Transporteurs en attente' },
            { icon: 'ri-forbid-line', value: stats.suspended || 0, label: 'Transporteurs suspendus' }
        ];

        // Mettre à jour chaque statistique en ciblant par icône
        statMappings.forEach(mapping => {
            this.updateStatByIcon(mapping.icon, mapping.value);
        });

        // Alternative: cibler directement par ordre dans la section transporters-stats-section
        const transporterSection = document.querySelector('.transporters-stats-section');
        if (transporterSection) {
            const statNumbers = transporterSection.querySelectorAll('.stat-number');
            
            if (statNumbers.length >= 4) {
                this.animateStatChange(statNumbers[0], stats.total || 0);
                this.animateStatChange(statNumbers[1], stats.validated || 0); 
                this.animateStatChange(statNumbers[2], stats.pending || 0);
                this.animateStatChange(statNumbers[3], stats.suspended || 0);
            }
        }

        console.log('✅ Statistiques transporteurs mises à jour:', {
            total: stats.total,
            validated: stats.validated,
            pending: stats.pending,
            suspended: stats.suspended
        });
    }

    /**
     * Mettre à jour une valeur statistique avec animation
     */
    updateStatValue(selector, newValue) {
        const element = document.querySelector(selector);
        
        if (element) {
            const oldValue = element.textContent;
            
            // Animation de changement
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1.1)';
            element.style.color = '#4CAF50';
            
            setTimeout(() => {
                element.textContent = newValue;
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.color = '';
                }, 150);
            }, 150);
            
            console.log(`📊 Stat mise à jour: ${selector} | ${oldValue} → ${newValue}`);
        } else {
            console.warn(`⚠️ Élément non trouvé pour le sélecteur: ${selector}`);
        }
    }

    /**
     * Mettre à jour une statistique en cherchant par icône
     */
    updateStatByIcon(iconClass, newValue) {
        // Chercher l'icône puis remonter au dashboard-card parent
        const iconElement = document.querySelector(`i.${iconClass}`);
        
        if (iconElement) {
            // Remonter jusqu'au dashboard-card
            const card = iconElement.closest('.dashboard-card');
            if (card) {
                const statNumber = card.querySelector('.stat-number');
                if (statNumber) {
                    this.animateStatChange(statNumber, newValue);
                    console.log(`📊 Stat mise à jour par icône ${iconClass}: ${newValue}`);
                    return;
                }
            }
        }
        
        console.warn(`⚠️ Impossible de trouver la statistique pour l'icône: ${iconClass}`);
    }

    /**
     * Animer le changement de valeur d'une statistique
     */
    animateStatChange(element, newValue) {
        const oldValue = element.textContent;
        
        // Animation de changement
        element.style.transition = 'all 0.3s ease';
        element.style.transform = 'scale(1.1)';
        element.style.color = '#4CAF50';
        
        setTimeout(() => {
            element.textContent = newValue;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 150);
        }, 150);
        
        console.log(`📊 Animation: ${oldValue} → ${newValue}`);
    }

    /**
     * Formatter un montant en devise
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Afficher les états de chargement
     */
    showLoadingStates(statIds = []) {
        const allStatNumbers = document.querySelectorAll('.stat-number');
        
        allStatNumbers.forEach((element, index) => {
            const originalText = element.textContent;
            this.loadingIndicators.set(element, originalText);
            
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            element.style.color = '#999';
        });
        
        console.log('⏳ États de chargement affichés');
    }

    /**
     * Masquer les états de chargement
     */
    hideLoadingStates() {
        this.loadingIndicators.forEach((originalText, element) => {
            element.style.color = '';
        });
        
        this.loadingIndicators.clear();
        console.log('✅ États de chargement masqués');
    }

    /**
     * Afficher les états d'erreur
     */
    showErrorStates() {
        this.loadingIndicators.forEach((originalText, element) => {
            element.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            element.style.color = '#f44336';
            element.title = 'Erreur lors du chargement';
        });
        
        console.log('❌ États d\'erreur affichés');
    }

    /**
     * Afficher un fallback en cas d'erreur
     */
    showErrorFallback() {
        console.log('⚠️ Affichage du fallback d\'erreur - conservation des valeurs statiques');
        
        // Optionnel : afficher un message d'erreur discret
        const errorBanner = document.createElement('div');
        errorBanner.innerHTML = `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 8px 16px; border-radius: 6px; margin: 10px; font-size: 14px;">
                <i class="fas fa-exclamation-triangle"></i> 
                Statistiques en mode hors ligne. Les données affichées peuvent ne pas être à jour.
            </div>
        `;
        
        const mainContent = document.querySelector('.transporter-main-content');
        if (mainContent) {
            mainContent.insertBefore(errorBanner.firstElementChild, mainContent.firstChild);
        }
    }

    /**
     * Actualiser manuellement les statistiques
     */
    async refreshStats() {
        console.log('🔄 Actualisation manuelle des statistiques...');
        
        // Vider le cache pour forcer le rechargement
        if (this.StatsAPI) {
            this.StatsAPI.clearStatsCache();
        }
        
        // Recharger les statistiques
        await this.loadDashboardStats();
    }

    /**
     * Configurer l'actualisation automatique
     */
    setupAutoRefresh() {
        if (this.autoRefreshEnabled) {
            this.refreshInterval = setInterval(async () => {
                console.log('🔄 Actualisation automatique des statistiques...');
                await this.loadDashboardStats();
            }, this.refreshIntervalMs);
            
            console.log(`⏰ Actualisation automatique configurée (${this.refreshIntervalMs / 1000}s)`);
        }
    }

    /**
     * Arrêter l'actualisation automatique
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('⏹️ Actualisation automatique arrêtée');
        }
    }

    /**
     * Nettoyer les ressources
     */
    destroy() {
        this.stopAutoRefresh();
        this.loadingIndicators.clear();
        
        if (this.StatsAPI) {
            this.StatsAPI.clearStatsCache();
        }
        
        console.log('🧹 Gestionnaire de statistiques nettoyé');
    }

    /**
     * Récupérer les statistiques générales avec cache
     */
    async getGeneralStatsWithCache(forceRefresh = false) {
        const cacheKey = 'admin_general_stats';
        
        // Vérifier le cache d'abord
        if (!forceRefresh) {
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return { success: true, data: cached, fromCache: true };
            }
        }

        try {
            const response = await this.makeAPIRequest('/api/stats/general');
            
            if (response.success) {
                this.setCachedData(cacheKey, response.data);
                return response;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('❌ Erreur récupération statistiques générales:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Récupérer les statistiques transporteurs avec cache
     */
    async getTransporterStatsWithCache(forceRefresh = false) {
        const cacheKey = 'admin_transporter_stats';
        
        // Vérifier le cache d'abord
        if (!forceRefresh) {
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return { success: true, data: cached, fromCache: true };
            }
        }

        try {
            const response = await this.makeAPIRequest('/api/stats/transporters');
            
            if (response.success) {
                this.setCachedData(cacheKey, response.data);
                return response;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('❌ Erreur récupération statistiques transporteurs:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Faire une requête API vers le backend
     */
    async makeAPIRequest(endpoint) {
        try {
            // Récupérer le token d'authentification
            const token = sessionStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }

            console.log(`🔗 Requête API: ${endpoint}`);

            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Erreur HTTP ${response.status}`);
            }

            console.log(`✅ Réponse API reçue:`, data);
            return data;

        } catch (error) {
            console.error(`❌ Erreur requête API ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Gérer le cache des données
     */
    setCachedData(key, data) {
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            ttl: 5 * 60 * 1000 // 5 minutes
        };
        
        try {
            sessionStorage.setItem(`stats_${key}`, JSON.stringify(cacheData));
            console.log(`💾 Données mises en cache: ${key}`);
        } catch (error) {
            console.warn('⚠️ Impossible de mettre en cache:', error);
        }
    }

    /**
     * Récupérer les données du cache
     */
    getCachedData(key) {
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

            console.log(`🔄 Données récupérées du cache: ${key}`);
            return cached.data;
            
        } catch (error) {
            console.warn('⚠️ Erreur lecture cache:', error);
            return null;
        }
    }

    /**
     * Vider le cache
     */
    clearStatsCache() {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith('stats_')) {
                sessionStorage.removeItem(key);
            }
        });
        console.log('🧹 Cache des statistiques vidé');
    }
}

// Export global pour utilisation dans HTML
window.AdminStatsManager = AdminStatsManager; 