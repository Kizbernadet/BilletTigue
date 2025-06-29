/**
 * Script pour la page de gestion des transporteurs (Admin)
 * Gestion du menu profil et des actions CRUD pour les transporteurs
 */

// ==========================================================================
// GESTION DU MENU PROFIL
// ==========================================================================

/**
 * Toggle l'affichage du menu déroulant du profil
 */
function toggleProfileMenu() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

/**
 * Fermer le menu profil quand on clique ailleurs
 */
function initProfileMenuCloseHandler() {
  document.addEventListener('click', function(event) {
    const profileBtn = document.getElementById('profileBtn');
    const dropdown = document.getElementById('profileDropdown');
    
    if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.style.display = 'none';
    }
  });
}

// ==========================================================================
// FONCTIONS CRUD POUR LES TRANSPORTEURS
// ==========================================================================

/**
 * Créer un nouveau transporteur
 */
function createTransporter() {
  console.log('Créer un nouveau transporteur');
  showCreateTransporterModal();
}

/**
 * Afficher la modal de création de transporteur
 */
function showCreateTransporterModal() {
  // Vérifier si la modal existe déjà
  let modal = document.getElementById('createTransporterModal');
  
  if (!modal) {
    // Créer la modal si elle n'existe pas
    modal = createTransporterModalHTML();
    document.body.appendChild(modal);
  }
  
  // Afficher la modal
  modal.style.display = 'flex';
  
  // Réinitialiser le formulaire
  resetCreateTransporterForm();
  
  // Ajouter les event listeners
  setupCreateTransporterEvents();
}

/**
 * Créer le HTML de la modal de création
 */
function createTransporterModalHTML() {
  const modal = document.createElement('div');
  modal.id = 'createTransporterModal';
  modal.className = 'modal-overlay';
  
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2><i class="fa-solid fa-plus"></i> Créer un nouveau transporteur</h2>
        <button class="modal-close" onclick="closeCreateTransporterModal()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
             <div class="modal-body">
         <form id="createTransporterForm" class="transporter-form">

          <!-- Informations de l'entreprise -->
           <div class="form-section">
             <h3><i class="fa-solid fa-building"></i> Informations de l'entreprise</h3>
             
             <div class="form-row">
               <div class="form-group">
                 <label for="company_name">Nom de l'entreprise *</label>
                 <input type="text" id="company_name" name="company_name" required>
                 <small>Raison sociale ou nom commercial de l'entreprise</small>
               </div>
               <div class="form-group">
                 <label for="company_type">Type d'entreprise *</label>
                 <select id="company_type" name="company_type" required>
                   <option value="">Sélectionner...</option>
                   <option value="passenger-carrier">Transport de passagers</option>
                   <option value="freight-carrier">Transport de frets</option>
                   <option value="mixte">Fret et Passagers</option>
                 </select>
               </div>
             </div>
           </div>
           
           <!-- Informations de compte -->
           <div class="form-section">
             <h3><i class="fa-solid fa-key"></i> Compte utilisateur</h3>
             
             <div class="form-row">
               <div class="form-group">
                 <label for="email">Email *</label>
                 <input type="email" id="email" name="email" required>
                 <small>Adresse email qui servira d'identifiant de connexion</small>
               </div>
               <div class="form-group">
                 <label for="phone_number">Téléphone *</label>
                 <input type="tel" id="phone_number" name="phone_number" required>
                 <small>Numéro de téléphone du transporteur</small>
               </div>
             </div>
             
             <div class="form-row">
               <div class="form-group">
                 <label for="password">Mot de passe temporaire *</label>
                 <input type="password" id="password" name="password" required>
                 <small>Le transporteur devra changer ce mot de passe à sa première connexion</small>
               </div>
               <div class="form-group">
                 <label for="confirmPassword">Confirmer le mot de passe *</label>
                 <input type="password" id="confirmPassword" name="confirmPassword" required>
               </div>
             </div>
           </div>
         </form>
       </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="closeCreateTransporterModal()">
          <i class="fa-solid fa-times"></i> Annuler
        </button>
        <button type="submit" form="createTransporterForm" class="btn-primary">
          <i class="fa-solid fa-save"></i> Créer le compte
        </button>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Fermer la modal de création
 */
function closeCreateTransporterModal() {
  const modal = document.getElementById('createTransporterModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Réinitialiser le formulaire de création
 */
function resetCreateTransporterForm() {
  const form = document.getElementById('createTransporterForm');
  if (form) {
    form.reset();
  }
}

/**
 * Configurer les événements du formulaire de création
 */
function setupCreateTransporterEvents() {
  const form = document.getElementById('createTransporterForm');
  if (!form) return;
  
  // Gérer la soumission du formulaire
  form.addEventListener('submit', handleCreateTransporterSubmit);
  
  // Validation en temps réel du mot de passe
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  
  if (confirmPassword) {
    confirmPassword.addEventListener('input', function() {
      validatePasswordMatch(password.value, this.value);
    });
  }
  
  // Fermer la modal en cliquant sur l'overlay
  const modal = document.getElementById('createTransporterModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeCreateTransporterModal();
      }
    });
  }
}

/**
 * Gérer la soumission du formulaire de création
 */
async function handleCreateTransporterSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const transporterData = Object.fromEntries(formData.entries());
  
  // Validation côté client
  if (!validateCreateTransporterForm(transporterData)) {
    return;
  }
  
  try {
    // Afficher un loader
    showFormLoader(true);
    
    // Envoyer les données à l'API
    const success = await submitCreateTransporter(transporterData);
    
    if (success) {
      showNotification('Transporteur créé avec succès !', 'success');
      closeCreateTransporterModal();
      
      // Recharger les statistiques
      loadTransportersStats();
    }
    
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    showNotification('Erreur lors de la création du transporteur', 'error');
  } finally {
    showFormLoader(false);
  }
}

/**
 * Valider le formulaire de création
 */
function validateCreateTransporterForm(data) {
  const errors = [];
  
  // Vérifications de base - Champs correspondant aux colonnes DB
  if (!data.email?.trim()) errors.push('L\'email est requis');
  if (!data.phone_number?.trim()) errors.push('Le téléphone est requis');
  if (!data.password?.trim()) errors.push('Le mot de passe est requis');
  if (!data.company_name?.trim()) errors.push('Le nom de l\'entreprise est requis');
  if (!data.company_type) errors.push('Le type d\'entreprise est requis');
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Format d\'email invalide');
  }
  
  // Validation format téléphone (optionnel - simple vérification)
  const phoneRegex = /^[+]?[\d\s\-\(\)]{8,}$/;
  if (data.phone_number && !phoneRegex.test(data.phone_number)) {
    errors.push('Format de téléphone invalide');
  }
  
  // Validation du mot de passe
  if (data.password && data.password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  // Vérification de la correspondance des mots de passe
  if (data.password !== data.confirmPassword) {
    errors.push('Les mots de passe ne correspondent pas');
  }
  
  // Afficher les erreurs s'il y en a
  if (errors.length > 0) {
    showNotification(errors.join('\n'), 'error');
    return false;
  }
  
  return true;
}

/**
 * Valider la correspondance des mots de passe en temps réel
 */
function validatePasswordMatch(password, confirmPassword) {
  const confirmField = document.getElementById('confirmPassword');
  
  if (confirmPassword && password !== confirmPassword) {
    confirmField.setCustomValidity('Les mots de passe ne correspondent pas');
    confirmField.style.borderColor = '#dc3545';
  } else {
    confirmField.setCustomValidity('');
    confirmField.style.borderColor = '';
  }
}

/**
 * Envoyer les données à l'API pour créer le transporteur
 */
async function submitCreateTransporter(data) {
  try {
    // Préparer les données selon la structure des tables
    const transporterPayload = {
      // Données pour la table comptes
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      // Données pour la table transporteurs
      company_name: data.company_name,
      company_type: data.company_type
    };
    
    console.log('Données du transporteur à créer:', transporterPayload);
    
    // Appel API réel
    const response = await fetch(`${getApiBaseUrl()}/admin/create-transporter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(transporterPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur API: ${response.status}`);
    }
    
    const result = await response.json();
    return result.message || result.success;
    
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

/**
 * Afficher/masquer le loader du formulaire
 */
function showFormLoader(show) {
  const submitBtn = document.querySelector('#createTransporterModal .btn-primary');
  const cancelBtn = document.querySelector('#createTransporterModal .btn-secondary');
  
  if (show) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création en cours...';
    cancelBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Créer le compte';
    cancelBtn.disabled = false;
  }
}

/**
 * Consulter la liste des transporteurs
 */
function readTransporters() {
  console.log('Consulter les transporteurs');
  // TODO: Afficher tableau avec liste complète des transporteurs
  // TODO: Filtres, recherche, pagination, détails de chaque compte
  
  // Exemple d'implémentation future:
  // loadTransportersTable();
  // showTransportersListModal();
}

/**
 * Modifier un transporteur existant
 */
function updateTransporter() {
  console.log('Modifier un transporteur');
  // TODO: Sélectionner transporteur à modifier
  // TODO: Formulaire d'édition des informations du compte
  
  // Exemple d'implémentation future:
  // showTransporterSelectionModal();
  // puis loadEditTransporterForm(transporterId);
}

/**
 * Supprimer/Désactiver un transporteur
 */
function deleteTransporter() {
  console.log('Supprimer un transporteur');
  // TODO: Sélectionner transporteur à supprimer
  // TODO: Confirmation et désactivation/suppression du compte
  
  // Exemple d'implémentation future:
  // showTransporterSelectionModal('delete');
  // puis confirmDeleteTransporter(transporterId);
}

// ==========================================================================
// GESTION DES STATISTIQUES
// ==========================================================================

/**
 * Charger les statistiques des transporteurs depuis l'API
 * DÉSACTIVÉ: Remplacé par AdminStatsManager pour les statistiques dynamiques
 */
async function loadTransportersStats() {
  // Cette fonction est maintenant désactivée car les statistiques 
  // sont gérées par le système AdminStatsManager qui utilise les vraies données API
  console.log('📊 Statistiques gérées par AdminStatsManager - fonction loadTransportersStats() désactivée');
  return;
  
  /* Code désactivé pour éviter les conflits
  try {
    // TODO: Remplacer par un vrai appel API
    // const response = await fetch('/api/admin/transporters/stats');
    // const stats = await response.json();
    
    // Données exemple pour le moment
    const stats = {
      total: 47,
      active: 24,
      pending: 18,
      suspended: 5
    };
    
    updateStatsDisplay(stats);
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
  }
  */
}

/**
 * Mettre à jour l'affichage des statistiques
 */
function updateStatsDisplay(stats) {
  const statElements = {
    total: document.querySelector('.transporters-stats-section .dashboard-card:nth-child(1) .stat-number'),
    active: document.querySelector('.transporters-stats-section .dashboard-card:nth-child(2) .stat-number'),
    pending: document.querySelector('.transporters-stats-section .dashboard-card:nth-child(3) .stat-number'),
    suspended: document.querySelector('.transporters-stats-section .dashboard-card:nth-child(4) .stat-number')
  };
  
  if (statElements.total) statElements.total.textContent = stats.total;
  if (statElements.active) statElements.active.textContent = stats.active;
  if (statElements.pending) statElements.pending.textContent = stats.pending;
  if (statElements.suspended) statElements.suspended.textContent = stats.suspended;
}

// ==========================================================================
// CONFIGURATION ET UTILITAIRES
// ==========================================================================

/**
 * Obtenir l'URL de base de l'API
 */
function getApiBaseUrl() {
  return 'http://localhost:5000/api';
}

/**
 * Obtenir le token d'authentification
 */
function getAuthToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('authToken');
}

/**
 * Afficher une notification à l'utilisateur
 */
function showNotification(message, type = 'info') {
  // TODO: Implémenter un système de notifications
  console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Confirmer une action avec l'utilisateur
 */
function confirmAction(message) {
  return confirm(message);
}

// ==========================================================================
// INITIALISATION
// ==========================================================================

/**
 * Initialiser la page au chargement
 */
function initAdminTransportersPage() {
  console.log('Dashboard Transporteurs chargé');
  
  // Initialiser les gestionnaires d'événements
  initProfileMenuCloseHandler();
  
  // Charger les données initiales
  loadTransportersStats();
  
  // TODO: Autres initialisations
  // - Vérifier les permissions admin
  // - Configurer les événements des cartes
  // - Initialiser les modals si nécessaire
}

// Démarrer l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initAdminTransportersPage);

// ==========================================================================
// EXPORT DES FONCTIONS GLOBALES (pour les onclick dans le HTML)
// ==========================================================================

// Rendre les fonctions accessibles globalement pour les onclick
window.toggleProfileMenu = toggleProfileMenu;
window.createTransporter = createTransporter;
window.readTransporters = readTransporters;
window.updateTransporter = updateTransporter;
window.deleteTransporter = deleteTransporter;
window.closeCreateTransporterModal = closeCreateTransporterModal; 