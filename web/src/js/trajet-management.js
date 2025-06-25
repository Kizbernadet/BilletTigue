// Configuration API
const API_BASE_URL = 'http://localhost:5000/api';
const API_ENDPOINTS = {
    trajets: `${API_BASE_URL}/trajets`,
    transporteurTrajets: `${API_BASE_URL}/transporteur/trajets`
};

// Éléments DOM
const elements = {
    toggleFormBtn: document.getElementById('toggleFormBtn'),
    createTrajetForm: document.getElementById('createTrajetForm'),
    trajetsList: document.getElementById('trajetsList'),
    statusFilter: document.getElementById('statusFilter'),
    refreshBtn: document.getElementById('refreshBtn'),
    accepteColis: document.getElementById('accepteColis'),
    colisOptions: document.getElementById('colisOptions'),
    confirmModal: document.getElementById('confirmModal'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmYes: document.getElementById('confirmYes'),
    confirmNo: document.getElementById('confirmNo')
};

// État de l'application
let currentTrajets = [];
let pendingAction = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadTrajets();
    setMinDate();
});

// Configuration des écouteurs d'événements
function initializeEventListeners() {
    // Toggle du formulaire
    elements.toggleFormBtn.addEventListener('click', toggleForm);
    
    // Soumission du formulaire
    elements.createTrajetForm.addEventListener('submit', handleCreateTrajet);
    
    // Options de colis
    elements.accepteColis.addEventListener('change', toggleColisOptions);
    
    // Filtres et actualisation
    elements.statusFilter.addEventListener('change', filterTrajets);
    elements.refreshBtn.addEventListener('click', loadTrajets);
    
    // Modal de confirmation
    elements.confirmYes.addEventListener('click', executePendingAction);
    elements.confirmNo.addEventListener('click', closeModal);
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Fermer modal en cliquant à l'extérieur
    elements.confirmModal.addEventListener('click', function(e) {
        if (e.target === elements.confirmModal) {
            closeModal();
        }
    });
}

// Fonctions utilitaires
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateDepart').min = today;
}

function toggleForm() {
    const form = elements.createTrajetForm;
    const btn = elements.toggleFormBtn;
    
    if (form.classList.contains('show')) {
        form.classList.remove('show');
        btn.classList.remove('rotated');
    } else {
        form.classList.add('show');
        btn.classList.add('rotated');
    }
}

function toggleColisOptions() {
    const colisOptions = elements.colisOptions;
    if (elements.accepteColis.checked) {
        colisOptions.style.display = 'block';
    } else {
        colisOptions.style.display = 'none';
    }
}

// Gestion des trajets
async function loadTrajets() {
    try {
        showLoading();
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }
        
        const response = await fetch(API_ENDPOINTS.transporteurTrajets, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentTrajets = result.data;
            renderTrajets(currentTrajets);
        } else {
            throw new Error(result.message || 'Erreur lors du chargement des trajets');
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des trajets:', error);
        showError('Erreur lors du chargement des trajets: ' + error.message);
    }
}

function renderTrajets(trajets) {
    if (trajets.length === 0) {
        elements.trajetsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-route"></i>
                <h3>Aucun trajet trouvé</h3>
                <p>Vous n'avez pas encore créé de trajets.</p>
            </div>
        `;
        return;
    }
    
    const trajetsHTML = trajets.map(trajet => createTrajetCard(trajet)).join('');
    elements.trajetsList.innerHTML = trajetsHTML;
    
    // Ajouter les écouteurs d'événements pour les actions
    addTrajetActionListeners();
}

function createTrajetCard(trajet) {
    const dateDepart = new Date(trajet.dateDepart).toLocaleDateString('fr-FR');
    const heureDepart = trajet.heureDepart;
    const statusClass = `status-${trajet.statut}`;
    const statusText = getStatusText(trajet.statut);
    
    return `
        <div class="trajet-card" data-trajet-id="${trajet.idTrajet}">
            <div class="trajet-header">
                <div class="trajet-route">
                    <h3>${trajet.villeDepart} → ${trajet.villeArrivee}</h3>
                    <div class="route-info">
                        <i class="fas fa-calendar"></i>
                        <span>${dateDepart} à ${heureDepart}</span>
                    </div>
                </div>
                <span class="trajet-status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="trajet-details">
                <div class="detail-item">
                    <span class="detail-label">Prix</span>
                    <span class="detail-value">${trajet.prix} FCFA</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Places</span>
                    <span class="detail-value">${trajet.placesDisponibles}/${trajet.nombrePlaces}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Véhicule</span>
                    <span class="detail-value">${getVehiculeText(trajet.typeVehicule)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Colis</span>
                    <span class="detail-value">${trajet.accepteColis ? 'Acceptés' : 'Non acceptés'}</span>
                </div>
            </div>
            
            ${trajet.description ? `
                <div class="trajet-description">
                    <p>${trajet.description}</p>
                </div>
            ` : ''}
            
            <div class="trajet-actions">
                ${trajet.statut === 'actif' ? `
                    <button class="action-btn btn-edit" data-action="edit" data-trajet-id="${trajet.idTrajet}">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="action-btn btn-delete" data-action="delete" data-trajet-id="${trajet.idTrajet}">
                        <i class="fas fa-trash"></i> Annuler
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function addTrajetActionListeners() {
    // Écouteurs pour les boutons d'action
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const trajetId = this.dataset.trajetId;
            
            if (action === 'edit') {
                editTrajet(trajetId);
            } else if (action === 'delete') {
                confirmDeleteTrajet(trajetId);
            }
        });
    });
}

// Création de trajet
async function handleCreateTrajet(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const trajetData = Object.fromEntries(formData.entries());
        
        // Validation
        if (!validateTrajetData(trajetData)) {
            return;
        }
        
        // Préparation des données
        const dataToSend = {
            ...trajetData,
            accepteColis: trajetData.accepteColis === 'on',
            poidsMaxColis: trajetData.accepteColis === 'on' ? parseFloat(trajetData.poidsMaxColis) : null,
            prixColis: trajetData.accepteColis === 'on' ? parseFloat(trajetData.prixColis) : null
        };
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }
        
        const response = await fetch(API_ENDPOINTS.trajets, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Trajet créé avec succès !');
            event.target.reset();
            toggleForm();
            loadTrajets();
        } else {
            throw new Error(result.message || 'Erreur lors de la création du trajet');
        }
        
    } catch (error) {
        console.error('Erreur lors de la création du trajet:', error);
        showError('Erreur lors de la création du trajet: ' + error.message);
    }
}

// Modification de trajet
function editTrajet(trajetId) {
    const trajet = currentTrajets.find(t => t.idTrajet == trajetId);
    if (!trajet) {
        showError('Trajet non trouvé');
        return;
    }
    
    // Remplir le formulaire avec les données du trajet
    fillFormWithTrajet(trajet);
    toggleForm();
    
    // Changer le bouton de soumission
    const submitBtn = document.querySelector('.form-actions .btn-primary');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Modifier le trajet';
    submitBtn.dataset.mode = 'edit';
    submitBtn.dataset.trajetId = trajetId;
}

// Suppression de trajet
function confirmDeleteTrajet(trajetId) {
    const trajet = currentTrajets.find(t => t.idTrajet == trajetId);
    if (!trajet) {
        showError('Trajet non trouvé');
        return;
    }
    
    elements.confirmMessage.textContent = `Êtes-vous sûr de vouloir annuler le trajet ${trajet.villeDepart} → ${trajet.villeArrivee} ?`;
    pendingAction = { type: 'delete', trajetId };
    showModal();
}

async function executePendingAction() {
    if (!pendingAction) return;
    
    try {
        if (pendingAction.type === 'delete') {
            await deleteTrajet(pendingAction.trajetId);
        }
        
        closeModal();
        pendingAction = null;
        
    } catch (error) {
        console.error('Erreur lors de l\'exécution de l\'action:', error);
        showError('Erreur lors de l\'exécution de l\'action: ' + error.message);
    }
}

async function deleteTrajet(trajetId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Token d\'authentification manquant');
    }
    
    const response = await fetch(`${API_ENDPOINTS.trajets}/${trajetId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    const result = await response.json();
    
    if (result.success) {
        showSuccess('Trajet annulé avec succès !');
        loadTrajets();
    } else {
        throw new Error(result.message || 'Erreur lors de l\'annulation du trajet');
    }
}

// Filtrage
function filterTrajets() {
    const statusFilter = elements.statusFilter.value;
    
    if (!statusFilter) {
        renderTrajets(currentTrajets);
        return;
    }
    
    const filteredTrajets = currentTrajets.filter(trajet => trajet.statut === statusFilter);
    renderTrajets(filteredTrajets);
}

// Fonctions utilitaires
function validateTrajetData(data) {
    const requiredFields = ['villeDepart', 'villeArrivee', 'dateDepart', 'heureDepart', 'prix', 'nombrePlaces'];
    
    for (const field of requiredFields) {
        if (!data[field]) {
            showError(`Le champ ${field} est obligatoire`);
            return false;
        }
    }
    
    if (data.accepteColis === 'on') {
        if (!data.poidsMaxColis || !data.prixColis) {
            showError('Veuillez remplir les informations de colis');
            return false;
        }
    }
    
    return true;
}

function fillFormWithTrajet(trajet) {
    const form = elements.createTrajetForm;
    
    // Remplir les champs
    form.villeDepart.value = trajet.villeDepart;
    form.villeArrivee.value = trajet.villeArrivee;
    form.dateDepart.value = trajet.dateDepart.split('T')[0];
    form.heureDepart.value = trajet.heureDepart;
    form.prix.value = trajet.prix;
    form.nombrePlaces.value = trajet.nombrePlaces;
    form.typeVehicule.value = trajet.typeVehicule;
    form.pointDepart.value = trajet.pointDepart || '';
    form.pointArrivee.value = trajet.pointArrivee || '';
    form.description.value = trajet.description || '';
    form.conditions.value = trajet.conditions || '';
    
    // Gérer les colis
    form.accepteColis.checked = trajet.accepteColis;
    toggleColisOptions();
    
    if (trajet.accepteColis) {
        form.poidsMaxColis.value = trajet.poidsMaxColis || '';
        form.prixColis.value = trajet.prixColis || '';
    }
}

function getStatusText(status) {
    const statusMap = {
        'actif': 'Actif',
        'en_cours': 'En cours',
        'terminé': 'Terminé',
        'annulé': 'Annulé'
    };
    return statusMap[status] || status;
}

function getVehiculeText(vehicule) {
    const vehiculeMap = {
        'bus': 'Bus',
        'minibus': 'Minibus',
        'voiture': 'Voiture',
        'camion': 'Camion'
    };
    return vehiculeMap[vehicule] || vehicule;
}

// UI Helpers
function showLoading() {
    elements.trajetsList.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Chargement des trajets...
        </div>
    `;
}

function showSuccess(message) {
    // Implémenter une notification de succès
    alert('Succès: ' + message);
}

function showError(message) {
    // Implémenter une notification d'erreur
    alert('Erreur: ' + message);
}

function showModal() {
    elements.confirmModal.classList.add('show');
}

function closeModal() {
    elements.confirmModal.classList.remove('show');
    pendingAction = null;
} 