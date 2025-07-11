/**
 * Client API Trajets - Version Script Classique (non-module)
 * Compatible avec les scripts traditionnels sans import/export
 */

(function() {
  'use strict';

  // Configuration API (version simple)
  const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api'
  };

  /**
   * Client API pour la gestion des trajets
   */
  class TrajetsApiSimple {
    constructor() {
      this.baseUrl = `${CONFIG.API_BASE_URL}/trajets`;
    }

    /**
     * Headers par défaut avec authentification
     */
    getHeaders() {
      const token = sessionStorage.getItem('authToken');
      return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      };
    }

    /**
     * Créer un nouveau trajet
     */
    async createTrajet(trajetData) {
      try {
        console.log('🚛 Création d\'un trajet via API...', trajetData);
        
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(trajetData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Erreur HTTP ${response.status}`);
        }

        console.log('✅ Trajet créé avec succès:', result);
        return result;

      } catch (error) {
        console.error('❌ Erreur lors de la création du trajet:', error);
        throw error;
      }
    }

    /**
     * Récupérer tous les trajets du transporteur connecté
     */
    async getTrajetsByTransporteur() {
      try {
        console.log('🚛 Récupération des trajets du transporteur...');
        
        const response = await fetch(`${this.baseUrl}/transporteur/mes-trajets`, {
          method: 'GET',
          headers: this.getHeaders()
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Erreur HTTP ${response.status}`);
        }

        console.log('✅ Trajets récupérés:', result);
        return result;

      } catch (error) {
        console.error('❌ Erreur lors de la récupération des trajets:', error);
        throw error;
      }
    }

    /**
     * Récupérer un trajet par ID
     */
    async getTrajetById(trajetId) {
      try {
        console.log(`🚛 Récupération du trajet ${trajetId}...`);
        
        const response = await fetch(`${this.baseUrl}/${trajetId}`, {
          method: 'GET',
          headers: this.getHeaders()
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Erreur HTTP ${response.status}`);
        }

        console.log('✅ Trajet récupéré:', result);
        return result;

      } catch (error) {
        console.error(`❌ Erreur lors de la récupération du trajet ${trajetId}:`, error);
        throw error;
      }
    }

    /**
     * Mettre à jour un trajet
     */
    async updateTrajet(trajetId, updateData) {
      try {
        console.log(`🚛 Mise à jour du trajet ${trajetId}...`, updateData);
        
        const response = await fetch(`${this.baseUrl}/${trajetId}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Erreur HTTP ${response.status}`);
        }

        console.log('✅ Trajet mis à jour:', result);
        return result;

      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour du trajet ${trajetId}:`, error);
        throw error;
      }
    }

    /**
     * Supprimer un trajet (annulation logique)
     */
    async deleteTrajet(trajetId) {
      try {
        console.log(`🚛 Suppression du trajet ${trajetId}...`);
        
        const response = await fetch(`${this.baseUrl}/${trajetId}`, {
          method: 'DELETE',
          headers: this.getHeaders()
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Erreur HTTP ${response.status}`);
        }

        console.log('✅ Trajet supprimé:', result);
        return result;

      } catch (error) {
        console.error(`❌ Erreur lors de la suppression du trajet ${trajetId}:`, error);
        throw error;
      }
    }

    /**
     * Récupérer tous les trajets publics (avec filtres)
     */
    async getAllTrajets(filters = {}) {
      try {
        console.log('🚛 Récupération des trajets publics...', filters);
        
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            queryParams.append(key, filters[key]);
          }
        });

        const url = queryParams.toString() 
          ? `${this.baseUrl}?${queryParams.toString()}`
          : this.baseUrl;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Erreur HTTP ${response.status}`);
        }

        console.log('✅ Trajets publics récupérés:', result);
        return result;

      } catch (error) {
        console.error('❌ Erreur lors de la récupération des trajets publics:', error);
        throw error;
      }
    }
  }

  // Créer une instance et l'exposer globalement
  window.TrajetsApi = new TrajetsApiSimple();
  
  console.log('✅ Client API Trajets (version simple) chargé et disponible sur window.TrajetsApi');

})(); 