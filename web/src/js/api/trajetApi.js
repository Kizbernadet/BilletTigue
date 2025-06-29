// ===== API TRAJETS - BilletTigue =====

import { API_CONFIG, getAuthHeaders, handleApiError, apiRequest } from './config.js';

// URL de base pour les trajets
const TRAJET_BASE_URL = `${API_CONFIG.BASE_URL}/trajets`;

// ===== FONCTIONS API TRAJETS =====

/**
 * Créer un nouveau trajet
 * @param {Object} trajetData - Données du trajet à créer
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const createTrajet = async (trajetData) => {
    try {
        const url = TRAJET_BASE_URL;
        const options = {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                villeDepart: trajetData.villeDepart,
                villeArrivee: trajetData.villeArrivee,
                dateDepart: trajetData.dateDepart,
                heureDepart: trajetData.heureDepart,
                prix: parseFloat(trajetData.prix),
                nombrePlaces: parseInt(trajetData.nombrePlaces),
                placesDisponibles: parseInt(trajetData.placesDisponibles),
                description: trajetData.description || '',
                typeVehicule: trajetData.typeVehicule || 'bus',
                accepteColis: trajetData.accepteColis === 'true',
                poidsMaxColis: trajetData.accepteColis === 'true' ? parseFloat(trajetData.poidsMaxColis) : null,
                prixColis: trajetData.accepteColis === 'true' ? parseFloat(trajetData.prixColis) : null,
                pointDepart: trajetData.pointDepart || '',
                pointArrivee: trajetData.pointArrivee || '',
                conditions: trajetData.conditions || ''
            })
        };

        const { response, data } = await apiRequest(url, options);

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la création du trajet');
        }

        return {
            success: true,
            data: data.data,
            message: data.message
        };

    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Récupérer tous les trajets d'un transporteur
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const getTrajetsByTransporteur = async () => {
    try {
        const url = `${API_CONFIG.BASE_URL}/transporteur/trajets`;
        const options = {
            method: 'GET',
            headers: getAuthHeaders()
        };

        const { response, data } = await apiRequest(url, options);

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération des trajets');
        }

        return {
            success: true,
            data: data.data,
            message: data.message
        };

    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Récupérer un trajet par ID
 * @param {number} trajetId - ID du trajet
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const getTrajetById = async (trajetId) => {
    try {
        const url = `${TRAJET_BASE_URL}/${trajetId}`;
        const options = {
            method: 'GET',
            headers: getAuthHeaders()
        };

        const { response, data } = await apiRequest(url, options);

        if (!response.ok) {
            throw new Error(data.message || 'Trajet non trouvé');
        }

        return {
            success: true,
            data: data.data,
            message: data.message
        };

    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Mettre à jour un trajet
 * @param {number} trajetId - ID du trajet
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const updateTrajet = async (trajetId, updateData) => {
    try {
        const url = `${TRAJET_BASE_URL}/${trajetId}`;
        const options = {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData)
        };

        const { response, data } = await apiRequest(url, options);

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la mise à jour du trajet');
        }

        return {
            success: true,
            data: data.data,
            message: data.message
        };

    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Supprimer (annuler) un trajet
 * @param {number} trajetId - ID du trajet
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const deleteTrajet = async (trajetId) => {
    try {
        const url = `${TRAJET_BASE_URL}/${trajetId}`;
        const options = {
            method: 'DELETE',
            headers: getAuthHeaders()
        };

        const { response, data } = await apiRequest(url, options);

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la suppression du trajet');
        }

        return {
            success: true,
            message: data.message
        };

    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Changer le statut d'un trajet
 * @param {number} trajetId - ID du trajet
 * @param {string} nouveauStatut - Nouveau statut ('en_cours', 'terminé', 'annulé')
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const changeStatutTrajet = async (trajetId, nouveauStatut) => {
    try {
        const url = `${TRAJET_BASE_URL}/${trajetId}`