/**
 * Service de gestion automatique des statuts des trajets
 * Met à jour automatiquement les statuts des trajets expirés
 */

const { Trajet } = require('../models');
const { Op } = require('sequelize');

class TrajetStatusService {
    
    /**
     * Met à jour automatiquement les statuts des trajets expirés
     * @returns {Promise<Object>} Résultat de la mise à jour
     */
    static async updateExpiredTrajets() {
        const transaction = await require('../config/database').sequelize.transaction();
        
        try {
            const now = new Date();
            
            // Trouver tous les trajets actifs avec une date de départ passée
            const expiredTrajets = await Trajet.findAll({
                where: {
                    status: 'active',
                    departure_time: {
                        [Op.lt]: now
                    }
                },
                transaction
            });
            
            if (expiredTrajets.length === 0) {
                console.log('✅ Aucun trajet expiré à mettre à jour');
                await transaction.commit();
                return {
                    success: true,
                    message: 'Aucun trajet expiré trouvé',
                    updatedCount: 0
                };
            }
            
            // Mettre à jour le statut de tous les trajets expirés
            const trajetIds = expiredTrajets.map(t => t.id);
            await Trajet.update(
                { 
                    status: 'expired',
                    updated_at: now
                },
                {
                    where: {
                        id: {
                            [Op.in]: trajetIds
                        }
                    },
                    transaction
                }
            );
            
            await transaction.commit();
            
            console.log(`🔄 ${expiredTrajets.length} trajets expirés mis à jour automatiquement`);
            
            return {
                success: true,
                message: `${expiredTrajets.length} trajets expirés mis à jour`,
                updatedCount: expiredTrajets.length,
                trajets: expiredTrajets.map(t => ({
                    id: t.id,
                    departure_city: t.departure_city,
                    arrival_city: t.arrival_city,
                    departure_time: t.departure_time
                }))
            };
            
        } catch (error) {
            await transaction.rollback();
            console.error('❌ Erreur lors de la mise à jour des trajets expirés:', error);
            throw error;
        }
    }
    
    /**
     * Vérifie et met à jour un trajet spécifique
     * @param {number} trajetId - ID du trajet
     * @returns {Promise<Object>} Résultat de la vérification
     */
    static async checkAndUpdateTrajet(trajetId) {
        try {
            const trajet = await Trajet.findByPk(trajetId);
            
            if (!trajet) {
                throw new Error('Trajet introuvable');
            }
            
            const now = new Date();
            const departureTime = new Date(trajet.departure_time);
            
            // Si le trajet est actif et que la date de départ est passée
            if (trajet.status === 'active' && departureTime < now) {
                await trajet.update({
                    status: 'expired',
                    updated_at: now
                });
                
                console.log(`🔄 Trajet ${trajetId} marqué comme expiré`);
                
                return {
                    success: true,
                    message: 'Trajet marqué comme expiré',
                    wasUpdated: true,
                    trajet: {
                        id: trajet.id,
                        status: trajet.status,
                        departure_time: trajet.departure_time
                    }
                };
            }
            
            return {
                success: true,
                message: 'Trajet toujours valide',
                wasUpdated: false,
                trajet: {
                    id: trajet.id,
                    status: trajet.status,
                    departure_time: trajet.departure_time
                }
            };
            
        } catch (error) {
            console.error(`❌ Erreur lors de la vérification du trajet ${trajetId}:`, error);
            throw error;
        }
    }
    
    /**
     * Récupère les statistiques des trajets par statut
     * @returns {Promise<Object>} Statistiques des trajets
     */
    static async getTrajetStats() {
        try {
            const stats = await Trajet.findAll({
                attributes: [
                    'status',
                    [require('../config/database').sequelize.fn('COUNT', require('../config/database').sequelize.col('id')), 'count']
                ],
                group: ['status'],
                raw: true
            });
            
            const totalTrajets = await Trajet.count();
            const now = new Date();
            
            // Compter les trajets expirés (même s'ils ne sont pas encore marqués)
            const expiredCount = await Trajet.count({
                where: {
                    departure_time: {
                        [Op.lt]: now
                    }
                }
            });
            
            return {
                success: true,
                stats: stats,
                total: totalTrajets,
                expiredCount: expiredCount
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }
}

module.exports = TrajetStatusService; 