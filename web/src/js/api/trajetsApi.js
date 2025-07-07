/**
 * Client API pour la gestion des trajets
 * Gère les appels CRUD vers les endpoints de trajets
 */

import { CONFIG } from './config.js';

class TrajetsApi {
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
   * @param {Object} trajetData - Données du trajet selon le modèle DB
   * @returns {Promise<Object>} Réponse de l'API
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
   * @returns {Promise<Object>} Liste des trajets
   */
  async getTrajetsByTransporteur() {
    try {
      console.log('🚛 Récupération des trajets du transporteur...');
      
      const response = await fetch(`${CONFIG.API_BASE_URL}/transporteur/trajets`, {
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
   * @param {number} trajetId - ID du trajet
   * @returns {Promise<Object>} Détails du trajet
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
   * @param {number} trajetId - ID du trajet
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Trajet mis à jour
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
   * @param {number} trajetId - ID du trajet
   * @returns {Promise<Object>} Confirmation de suppression
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
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<Object>} Liste des trajets publics
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
      
      // Essayer d'abord sans authentification (recherche publique)
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Si 401, essayer avec authentification si disponible
      if (response.status === 401) {
        console.log('🔐 Tentative avec authentification...');
        
        const token = sessionStorage.getItem('authToken');
        if (token) {
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }

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

// Instance globale
const trajetsApi = new TrajetsApi();

// Export pour compatibilité ES6 et script classique
if (typeof window !== 'undefined') {
  window.TrajetsApi = trajetsApi;
}

export default trajetsApi; 