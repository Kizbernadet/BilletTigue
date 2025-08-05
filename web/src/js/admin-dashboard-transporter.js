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
  
  if (submitBtn && cancelBtn) {
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
}

/**
 * Afficher/masquer le loader pour le formulaire d'édition
 */
function showEditFormLoader(show) {
  const submitBtn = document.querySelector('#editTransporterModal .btn-primary');
  const cancelBtn = document.querySelector('#editTransporterModal .btn-secondary');
  
  if (submitBtn && cancelBtn) {
    if (show) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Modification en cours...';
      cancelBtn.disabled = true;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Enregistrer les modifications';
      cancelBtn.disabled = false;
    }
  }
}

/**
 * Consulter la liste des transporteurs
 */
function readTransporters() {
  console.log('Consulter les transporteurs');
  showTransportersListModal();
}

/**
 * Afficher la modal de liste des transporteurs
 */
function showTransportersListModal() {
  // Vérifier si la modal existe déjà
  let modal = document.getElementById('transportersListModal');
  
  if (!modal) {
    // Créer la modal si elle n'existe pas
    modal = createTransportersListModalHTML();
    document.body.appendChild(modal);
  }
  
  // Afficher la modal
  modal.style.display = 'flex';
  
  // Charger les données des transporteurs
  loadTransportersData();
  
  // Ajouter les event listeners
  setupTransportersListEvents();
}

/**
 * Créer le HTML de la modal de liste des transporteurs
 */
function createTransportersListModalHTML() {
  const modal = document.createElement('div');
  modal.id = 'transportersListModal';
  modal.className = 'modal-overlay';
  
  modal.innerHTML = `
    <div class="modal-container large-modal">
      <div class="modal-header">
        <h2><i class="fa-solid fa-list"></i> Liste des transporteurs</h2>
        <button class="modal-close" onclick="closeTransportersListModal()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- Barre de recherche et filtres -->
        <div class="search-filters-bar">
          <div class="search-box">
            <input type="text" id="transporterSearch" placeholder="Rechercher un transporteur...">
            <i class="fa-solid fa-search"></i>
          </div>
          <div class="filters">
            <select id="statusFilter">
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendus</option>
            </select>
            <select id="typeFilter">
              <option value="">Tous les types</option>
              <option value="passenger-carrier">Passagers</option>
              <option value="freight-carrier">Fret</option>
              <option value="mixte">Mixte</option>
            </select>
          </div>
        </div>
        
        <!-- Tableau des transporteurs -->
        <div class="table-container">
          <table id="transportersTable" class="data-table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Type</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Date création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="transportersTableBody">
              <tr>
                <td colspan="7" class="loading-row">
                  <i class="fa-solid fa-spinner fa-spin"></i> Chargement...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="pagination-container">
          <div class="pagination-info">
            <span id="paginationInfo">Affichage de 1-10 sur 0 transporteurs</span>
          </div>
          <div class="pagination-controls">
            <button id="prevPage" class="pagination-btn" disabled>
              <i class="fa-solid fa-chevron-left"></i> Précédent
            </button>
            <span id="pageNumbers" class="page-numbers"></span>
            <button id="nextPage" class="pagination-btn" disabled>
              Suivant <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="closeTransportersListModal()">
          <i class="fa-solid fa-times"></i> Fermer
        </button>
        <button type="button" class="btn-primary" onclick="exportTransportersData()">
          <i class="fa-solid fa-download"></i> Exporter
        </button>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Fermer la modal de liste des transporteurs
 */
function closeTransportersListModal() {
  const modal = document.getElementById('transportersListModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Charger les données des transporteurs depuis l'API
 */
async function loadTransportersData(page = 1, filters = {}) {
  try {
    const tbody = document.getElementById('transportersTableBody');
    if (!tbody) return;
    
    // Afficher le loader
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="loading-row">
          <i class="fa-solid fa-spinner fa-spin"></i> Chargement...
        </td>
      </tr>
    `;
    
    // Construire l'URL avec les paramètres
    const params = new URLSearchParams({
      page: page,
      limit: 10,
      ...filters
    });
    
    const response = await fetch(`${getApiBaseUrl()}/admin/transporters?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // S'assurer que les données ont la structure attendue
    const processedData = {
      transporters: data.transporters || data.data || data || [],
      pagination: data.pagination || null
    };
    
    // Afficher les données
    displayTransportersData(processedData);
    
  } catch (error) {
    console.error('Erreur lors du chargement des transporteurs:', error);
    const tbody = document.getElementById('transportersTableBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="error-row">
            <i class="fa-solid fa-exclamation-triangle"></i> Erreur de chargement: ${error.message}
          </td>
        </tr>
      `;
    }
    
    // Afficher une notification d'erreur
    showNotification(`Erreur lors du chargement des transporteurs: ${error.message}`, 'error');
  }
}

/**
 * Afficher les données des transporteurs dans le tableau
 */
function displayTransportersData(data) {
  const tbody = document.getElementById('transportersTableBody');
  const paginationInfo = document.getElementById('paginationInfo');
  
  if (!tbody) return;
  
  if (!data.transporters || data.transporters.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-row">
          <i class="fa-solid fa-inbox"></i> Aucun transporteur trouvé
        </td>
      </tr>
    `;
    return;
  }
  
  // Générer les lignes du tableau
  const rows = data.transporters.map(transporter => `
    <tr data-transporter-id="${transporter.id}">
      <td>
        <div class="company-info">
          <strong>${transporter.company_name || 'N/A'}</strong>
          <small>${transporter.company_type || 'N/A'}</small>
        </div>
      </td>
      <td>
        <span class="type-badge ${transporter.company_type}">
          ${getTypeLabel(transporter.company_type)}
        </span>
      </td>
      <td>${transporter.email || 'N/A'}</td>
      <td>${transporter.phone_number || 'N/A'}</td>
      <td>
        <span class="status-badge ${transporter.status}">
          ${getStatusLabel(transporter.status)}
        </span>
      </td>
      <td>${formatDate(transporter.created_at)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-action btn-view" onclick="viewTransporterDetails(${transporter.id})" title="Voir détails">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-action btn-edit" onclick="editTransporter(${transporter.id})" title="Modifier">
            <i class="fa-solid fa-edit"></i>
          </button>
          <button class="btn-action btn-delete" onclick="deleteTransporterAction(${transporter.id})" title="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  tbody.innerHTML = rows;
  
  // Mettre à jour la pagination si disponible
  if (data.pagination) {
    updatePagination(data.pagination);
    
    // Mettre à jour les informations de pagination
    if (paginationInfo) {
      const { currentPage, totalPages, totalItems, itemsPerPage } = data.pagination;
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      paginationInfo.textContent = `Affichage de ${start}-${end} sur ${totalItems} transporteurs`;
    }
  } else {
    // Pagination par défaut si non disponible
    updatePagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: data.transporters ? data.transporters.length : 0,
      itemsPerPage: 10
    });
    
    if (paginationInfo) {
      const totalItems = data.transporters ? data.transporters.length : 0;
      paginationInfo.textContent = `Affichage de 1-${totalItems} sur ${totalItems} transporteurs`;
    }
  }
}

/**
 * Configurer les événements de la liste des transporteurs
 */
function setupTransportersListEvents() {
  // Recherche en temps réel
  const searchInput = document.getElementById('transporterSearch');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const filters = getCurrentFilters();
        loadTransportersData(1, filters);
      }, 300);
    });
  }
  
  // Filtres
  const statusFilter = document.getElementById('statusFilter');
  const typeFilter = document.getElementById('typeFilter');
  
  [statusFilter, typeFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', function() {
        const filters = getCurrentFilters();
        loadTransportersData(1, filters);
      });
    }
  });
  
  // Pagination
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      const currentPage = getCurrentPage();
      if (currentPage > 1) {
        const filters = getCurrentFilters();
        loadTransportersData(currentPage - 1, filters);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const currentPage = getCurrentPage();
      const filters = getCurrentFilters();
      loadTransportersData(currentPage + 1, filters);
    });
  }
}

/**
 * Obtenir les filtres actuels
 */
function getCurrentFilters() {
  const search = document.getElementById('transporterSearch')?.value || '';
  const status = document.getElementById('statusFilter')?.value || '';
  const type = document.getElementById('typeFilter')?.value || '';
  
  const filters = {};
  if (search) filters.search = search;
  if (status) filters.status = status;
  if (type) filters.type = type;
  
  return filters;
}

/**
 * Obtenir la page actuelle
 */
function getCurrentPage() {
  const paginationInfo = document.getElementById('paginationInfo');
  if (!paginationInfo) return 1;
  
  const text = paginationInfo.textContent;
  const match = text.match(/Affichage de (\d+)-/);
  return match ? Math.ceil(parseInt(match[1]) / 10) : 1;
}

/**
 * Mettre à jour la pagination
 */
function updatePagination(pagination) {
  const { currentPage, totalPages } = pagination;
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageNumbers = document.getElementById('pageNumbers');
  
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
  
  if (pageNumbers) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    
    pageNumbers.innerHTML = pages.map(page => {
      if (page === '...') {
        return '<span class="page-ellipsis">...</span>';
      }
      return `<button class="page-number ${page === currentPage ? 'active' : ''}" onclick="goToPage(${page})">${page}</button>`;
    }).join('');
  }
}

/**
 * Aller à une page spécifique
 */
function goToPage(page) {
  const filters = getCurrentFilters();
  loadTransportersData(page, filters);
}

/**
 * Exporter les données des transporteurs
 */
function exportTransportersData() {
  // TODO: Implémenter l'export CSV/Excel
  showNotification('Fonctionnalité d\'export en cours de développement', 'info');
}

/**
 * Voir les détails d'un transporteur
 */
function viewTransporterDetails(transporterId) {
  showTransporterDetailsModal(transporterId);
}

/**
 * Afficher la modal de détails d'un transporteur
 */
function showTransporterDetailsModal(transporterId) {
  // Vérifier si la modal existe déjà
  let modal = document.getElementById('transporterDetailsModal');
  
  if (!modal) {
    // Créer la modal si elle n'existe pas
    modal = createTransporterDetailsModalHTML();
    document.body.appendChild(modal);
  }
  
  // Afficher la modal
  modal.style.display = 'flex';
  
  // Charger les données du transporteur
  loadTransporterDetails(transporterId);
  
  // Ajouter les event listeners
  setupTransporterDetailsEvents(transporterId);
}

/**
 * Créer le HTML de la modal de détails
 */
function createTransporterDetailsModalHTML() {
  const modal = document.createElement('div');
  modal.id = 'transporterDetailsModal';
  modal.className = 'modal-overlay';
  
  modal.innerHTML = `
    <div class="modal-container large-modal">
      <div class="modal-header">
        <h2><i class="fa-solid fa-truck"></i> Détails du transporteur</h2>
        <button class="modal-close" onclick="closeTransporterDetailsModal()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- En-tête du transporteur -->
        <div id="transporterDetailsHeader" class="transporter-details-header">
          <div class="loading-item">
            <i class="fa-solid fa-spinner fa-spin"></i> Chargement...
          </div>
        </div>
        
        <!-- Onglets de navigation -->
        <div class="transporter-tabs">
          <button class="tab-btn active" data-tab="info">
            <i class="fa-solid fa-info-circle"></i> Informations
          </button>
          <button class="tab-btn" data-tab="activity">
            <i class="fa-solid fa-chart-line"></i> Activité
          </button>
          <button class="tab-btn" data-tab="security">
            <i class="fa-solid fa-shield-alt"></i> Sécurité
          </button>
          <button class="tab-btn" data-tab="documents">
            <i class="fa-solid fa-file-alt"></i> Documents
          </button>
        </div>
        
        <!-- Contenu des onglets -->
        <div class="tab-content">
          <!-- Onglet Informations -->
          <div id="tab-info" class="tab-pane active">
            <div class="loading-item">
              <i class="fa-solid fa-spinner fa-spin"></i> Chargement des informations...
            </div>
          </div>
          
          <!-- Onglet Activité -->
          <div id="tab-activity" class="tab-pane">
            <div class="loading-item">
              <i class="fa-solid fa-spinner fa-spin"></i> Chargement de l'activité...
            </div>
          </div>
          
          <!-- Onglet Sécurité -->
          <div id="tab-security" class="tab-pane">
            <div class="loading-item">
              <i class="fa-solid fa-spinner fa-spin"></i> Chargement des informations de sécurité...
            </div>
          </div>
          
          <!-- Onglet Documents -->
          <div id="tab-documents" class="tab-pane">
            <div class="loading-item">
              <i class="fa-solid fa-spinner fa-spin"></i> Chargement des documents...
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="closeTransporterDetailsModal()">
          <i class="fa-solid fa-times"></i> Fermer
        </button>
        <div class="action-buttons">
          <button type="button" class="btn-primary" onclick="editTransporterFromDetails()">
            <i class="fa-solid fa-edit"></i> Modifier
          </button>
          <button type="button" class="btn-danger" onclick="deleteTransporterFromDetails()">
            <i class="fa-solid fa-trash"></i> Supprimer
          </button>
        </div>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Fermer la modal de détails
 */
function closeTransporterDetailsModal() {
  const modal = document.getElementById('transporterDetailsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Charger les détails d'un transporteur
 */
async function loadTransporterDetails(transporterId) {
  try {
    // Charger les données de base
    const response = await fetch(`${getApiBaseUrl()}/admin/transporters/${transporterId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const transporter = await response.json();
    
    // S'assurer que les données du transporteur sont complètes
    const processedTransporter = {
      id: transporter.id,
      company_name: transporter.company_name || transporter.companyName || 'N/A',
      company_type: transporter.company_type || transporter.companyType || 'N/A',
      email: transporter.email || 'N/A',
      phone_number: transporter.phone_number || transporter.phoneNumber || 'N/A',
      status: transporter.status || 'active',
      created_at: transporter.created_at || transporter.createdAt || new Date().toISOString(),
      last_login: transporter.last_login || transporter.lastLogin || null,
      // Données par défaut pour les statistiques
      total_trips: transporter.total_trips || transporter.totalTrips || 0,
      active_trips: transporter.active_trips || transporter.activeTrips || 0,
      completed_trips: transporter.completed_trips || transporter.completedTrips || 0,
      cancelled_trips: transporter.cancelled_trips || transporter.cancelledTrips || 0,
      average_rating: transporter.average_rating || transporter.averageRating || 0,
      total_reviews: transporter.total_reviews || transporter.totalReviews || 0,
      total_revenue: transporter.total_revenue || transporter.totalRevenue || '0€',
      // Données de sécurité par défaut
      email_verified: transporter.email_verified || transporter.emailVerified || false,
      phone_verified: transporter.phone_verified || transporter.phoneVerified || false,
      account_locked: transporter.account_locked || transporter.accountLocked || false,
      login_attempts: transporter.login_attempts || transporter.loginAttempts || 0,
      failed_logins: transporter.failed_logins || transporter.failedLogins || 0,
      last_failed_login: transporter.last_failed_login || transporter.lastFailedLogin || null,
      last_profile_update: transporter.last_profile_update || transporter.lastProfileUpdate || null,
      password_changed_at: transporter.password_changed_at || transporter.passwordChangedAt || null,
      // Données supplémentaires
      service_areas: transporter.service_areas || transporter.serviceAreas || [],
      vehicles_count: transporter.vehicles_count || transporter.vehiclesCount || 0,
      vehicle_types: transporter.vehicle_types || transporter.vehicleTypes || []
    };
    
    // Afficher l'en-tête
    displayTransporterDetailsHeader(processedTransporter);
    
    // Charger le contenu de l'onglet actif
    loadActiveTabContent(processedTransporter);
    
    // Stocker l'ID du transporteur pour les actions
    const modal = document.getElementById('transporterDetailsModal');
    if (modal) {
      modal.dataset.transporterId = transporterId;
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des détails du transporteur:', error);
    showNotification(`Erreur lors du chargement des détails du transporteur: ${error.message}`, 'error');
    
    // Afficher un message d'erreur dans le modal
    const header = document.getElementById('transporterDetailsHeader');
    if (header) {
      header.innerHTML = `
        <div class="error-message">
          <i class="fa-solid fa-exclamation-triangle"></i>
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger les détails du transporteur: ${error.message}</p>
        </div>
      `;
    }
    
    // Fermer le modal en cas d'erreur après un délai
    setTimeout(() => {
      closeTransporterDetailsModal();
    }, 3000);
  }
}

/**
 * Afficher l'en-tête du transporteur
 */
function displayTransporterDetailsHeader(transporter) {
  const header = document.getElementById('transporterDetailsHeader');
  if (!header) return;
  
  header.innerHTML = `
    <div class="transporter-profile-header">
      <div class="transporter-avatar-large">
        <i class="fa-solid fa-truck"></i>
      </div>
      <div class="transporter-info-main">
        <h3>${transporter.company_name || 'N/A'}</h3>
        <div class="transporter-meta">
          <span class="type-badge ${transporter.company_type}">
            ${getTypeLabel(transporter.company_type)}
          </span>
          <span class="status-badge ${transporter.status}">
            ${getStatusLabel(transporter.status)}
          </span>
          <span class="member-since">
            <i class="fa-solid fa-calendar"></i>
            Membre depuis ${formatDate(transporter.created_at)}
          </span>
        </div>
      </div>
      <div class="transporter-quick-stats">
        <div class="quick-stat">
          <span class="stat-number">${transporter.total_trips || 0}</span>
          <span class="stat-label">Trajets</span>
        </div>
        <div class="quick-stat">
          <span class="stat-number">${transporter.average_rating || 'N/A'}</span>
          <span class="stat-label">Note</span>
        </div>
        <div class="quick-stat">
          <span class="stat-number">${transporter.active_trips || 0}</span>
          <span class="stat-label">Actifs</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Charger le contenu de l'onglet actif
 */
function loadActiveTabContent(transporter) {
  const activeTab = document.querySelector('.tab-btn.active');
  if (!activeTab) return;
  
  const tabName = activeTab.dataset.tab;
  
  switch (tabName) {
    case 'info':
      loadInfoTabContent(transporter);
      break;
    case 'activity':
      loadActivityTabContent(transporter);
      break;
    case 'security':
      loadSecurityTabContent(transporter);
      break;
    case 'documents':
      loadDocumentsTabContent(transporter);
      break;
  }
}

/**
 * Charger le contenu de l'onglet Informations
 */
function loadInfoTabContent(transporter) {
  const tabContent = document.getElementById('tab-info');
  if (!tabContent) return;
  
  tabContent.innerHTML = `
    <div class="info-sections">
      <!-- Informations de base -->
      <div class="info-section">
        <h4><i class="fa-solid fa-building"></i> Informations de l'entreprise</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>Nom de l'entreprise:</label>
            <span>${transporter.company_name || 'N/A'}</span>
          </div>
          <div class="info-item">
            <label>Type d'activité:</label>
            <span>${getTypeLabel(transporter.company_type)}</span>
          </div>
          <div class="info-item">
            <label>Statut du compte:</label>
            <span class="status-badge ${transporter.status}">
              ${getStatusLabel(transporter.status)}
            </span>
          </div>
          <div class="info-item">
            <label>Date de création:</label>
            <span>${formatDate(transporter.created_at)}</span>
          </div>
        </div>
      </div>
      
      <!-- Informations de contact -->
      <div class="info-section">
        <h4><i class="fa-solid fa-address-book"></i> Informations de contact</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>Email:</label>
            <span>${transporter.email || 'N/A'}</span>
          </div>
          <div class="info-item">
            <label>Téléphone:</label>
            <span>${transporter.phone_number || 'N/A'}</span>
          </div>
          <div class="info-item">
            <label>Dernière connexion:</label>
            <span>${transporter.last_login ? formatDate(transporter.last_login) : 'Jamais'}</span>
          </div>
        </div>
      </div>
      
      <!-- Zones de service -->
      <div class="info-section">
        <h4><i class="fa-solid fa-map-marker-alt"></i> Zones de service</h4>
        <div class="service-areas">
          ${transporter.service_areas ? transporter.service_areas.map(area => 
            `<span class="area-badge">${area}</span>`
          ).join('') : '<span class="no-data">Aucune zone définie</span>'}
        </div>
      </div>
      
      <!-- Véhicules -->
      <div class="info-section">
        <h4><i class="fa-solid fa-car"></i> Véhicules</h4>
        <div class="vehicles-info">
          <div class="vehicle-stat">
            <span class="stat-number">${transporter.vehicles_count || 0}</span>
            <span class="stat-label">Véhicules</span>
          </div>
          <div class="vehicle-types">
            ${transporter.vehicle_types ? transporter.vehicle_types.map(type => 
              `<span class="vehicle-type-badge">${type}</span>`
            ).join('') : '<span class="no-data">Aucun véhicule enregistré</span>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Charger le contenu de l'onglet Activité
 */
function loadActivityTabContent(transporter) {
  const tabContent = document.getElementById('tab-activity');
  if (!tabContent) return;
  
  tabContent.innerHTML = `
    <div class="activity-sections">
      <!-- Statistiques générales -->
      <div class="activity-section">
        <h4><i class="fa-solid fa-chart-bar"></i> Statistiques générales</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-route"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">${transporter.total_trips || 0}</span>
              <span class="stat-label">Trajets totaux</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-play-circle"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">${transporter.active_trips || 0}</span>
              <span class="stat-label">Trajets actifs</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">${transporter.completed_trips || 0}</span>
              <span class="stat-label">Trajets terminés</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-times-circle"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">${transporter.cancelled_trips || 0}</span>
              <span class="stat-label">Trajets annulés</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Évaluations -->
      <div class="activity-section">
        <h4><i class="fa-solid fa-star"></i> Évaluations clients</h4>
        <div class="rating-info">
          <div class="rating-overview">
            <div class="average-rating">
              <span class="rating-number">${transporter.average_rating || 'N/A'}</span>
              <div class="stars">
                ${generateStars(transporter.average_rating || 0)}
              </div>
              <span class="total-reviews">${transporter.total_reviews || 0} avis</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Revenus -->
      <div class="activity-section">
        <h4><i class="fa-solid fa-euro-sign"></i> Revenus</h4>
        <div class="revenue-info">
          <div class="revenue-stat">
            <span class="stat-number">${transporter.total_revenue || '0€'}</span>
            <span class="stat-label">Revenus totaux</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Charger le contenu de l'onglet Sécurité
 */
function loadSecurityTabContent(transporter) {
  const tabContent = document.getElementById('tab-security');
  if (!tabContent) return;
  
  tabContent.innerHTML = `
    <div class="security-sections">
      <!-- Statut du compte -->
      <div class="security-section">
        <h4><i class="fa-solid fa-user-shield"></i> Statut du compte</h4>
        <div class="security-grid">
          <div class="security-item">
            <label>Email vérifié:</label>
            <span class="status-indicator ${transporter.email_verified ? 'verified' : 'unverified'}">
              <i class="fa-solid fa-${transporter.email_verified ? 'check' : 'times'}"></i>
              ${transporter.email_verified ? 'Vérifié' : 'Non vérifié'}
            </span>
          </div>
          <div class="security-item">
            <label>Téléphone vérifié:</label>
            <span class="status-indicator ${transporter.phone_verified ? 'verified' : 'unverified'}">
              <i class="fa-solid fa-${transporter.phone_verified ? 'check' : 'times'}"></i>
              ${transporter.phone_verified ? 'Vérifié' : 'Non vérifié'}
            </span>
          </div>
          <div class="security-item">
            <label>Compte verrouillé:</label>
            <span class="status-indicator ${transporter.account_locked ? 'locked' : 'unlocked'}">
              <i class="fa-solid fa-${transporter.account_locked ? 'lock' : 'unlock'}"></i>
              ${transporter.account_locked ? 'Verrouillé' : 'Déverrouillé'}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Connexions -->
      <div class="security-section">
        <h4><i class="fa-solid fa-sign-in-alt"></i> Activité de connexion</h4>
        <div class="login-info">
          <div class="login-stat">
            <span class="stat-number">${transporter.login_attempts || 0}</span>
            <span class="stat-label">Tentatives de connexion</span>
          </div>
          <div class="login-stat">
            <span class="stat-number">${transporter.failed_logins || 0}</span>
            <span class="stat-label">Échecs de connexion</span>
          </div>
          <div class="login-stat">
            <span class="stat-label">Dernière connexion échouée:</span>
            <span>${transporter.last_failed_login ? formatDate(transporter.last_failed_login) : 'Aucune'}</span>
          </div>
        </div>
      </div>
      
      <!-- Modifications récentes -->
      <div class="security-section">
        <h4><i class="fa-solid fa-history"></i> Modifications récentes</h4>
        <div class="modifications-list">
          <div class="modification-item">
            <span class="modification-label">Dernière mise à jour du profil:</span>
            <span>${transporter.last_profile_update ? formatDate(transporter.last_profile_update) : 'Jamais'}</span>
          </div>
          <div class="modification-item">
            <span class="modification-label">Dernier changement de mot de passe:</span>
            <span>${transporter.password_changed_at ? formatDate(transporter.password_changed_at) : 'Jamais'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Charger le contenu de l'onglet Documents
 */
function loadDocumentsTabContent(transporter) {
  const tabContent = document.getElementById('tab-documents');
  if (!tabContent) return;
  
  tabContent.innerHTML = `
    <div class="documents-sections">
      <div class="documents-section">
        <h4><i class="fa-solid fa-file-alt"></i> Documents du transporteur</h4>
        <div class="documents-list">
          <div class="document-item">
            <i class="fa-solid fa-file-pdf"></i>
            <div class="document-info">
              <span class="document-name">Licence de transport</span>
              <span class="document-status verified">Vérifié</span>
            </div>
            <button class="btn-action btn-view" title="Voir le document">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
          <div class="document-item">
            <i class="fa-solid fa-file-pdf"></i>
            <div class="document-info">
              <span class="document-name">Assurance véhicule</span>
              <span class="document-status pending">En attente</span>
            </div>
            <button class="btn-action btn-view" title="Voir le document">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
          <div class="document-item">
            <i class="fa-solid fa-file-pdf"></i>
            <div class="document-info">
              <span class="document-name">Certificat de conformité</span>
              <span class="document-status unverified">Non vérifié</span>
            </div>
            <button class="btn-action btn-view" title="Voir le document">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Configurer les événements de la modal de détails
 */
function setupTransporterDetailsEvents(transporterId) {
  // Gestion des onglets
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Retirer la classe active de tous les onglets
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Ajouter la classe active à l'onglet cliqué
      this.classList.add('active');
      const tabName = this.dataset.tab;
      document.getElementById(`tab-${tabName}`).classList.add('active');
      
      // Charger le contenu de l'onglet si nécessaire
      loadTabContentIfNeeded(tabName, transporterId);
    });
  });
  
  // Fermer la modal en cliquant sur l'overlay
  const modal = document.getElementById('transporterDetailsModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeTransporterDetailsModal();
      }
    });
  }
}

/**
 * Charger le contenu d'un onglet si nécessaire
 */
function loadTabContentIfNeeded(tabName, transporterId) {
  const tabContent = document.getElementById(`tab-${tabName}`);
  if (!tabContent) return;
  
  // Vérifier si le contenu est déjà chargé
  const loadingElement = tabContent.querySelector('.loading-item');
  if (!loadingElement) return; // Contenu déjà chargé
  
  // Recharger les données du transporteur et afficher l'onglet
  loadTransporterDetails(transporterId);
}

/**
 * Actions depuis la modal de détails
 */
function editTransporterFromDetails() {
  const modal = document.getElementById('transporterDetailsModal');
  const transporterId = modal.dataset.transporterId;
  
  if (transporterId) {
    closeTransporterDetailsModal();
    loadTransporterForEdit(transporterId);
  }
}

function deleteTransporterFromDetails() {
  const modal = document.getElementById('transporterDetailsModal');
  const transporterId = modal.dataset.transporterId;
  
  if (transporterId) {
    closeTransporterDetailsModal();
    confirmDeleteTransporter(transporterId);
  }
}

/**
 * Générer les étoiles pour les évaluations
 */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // Étoiles pleines
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fa-solid fa-star"></i>';
  }
  
  // Demi-étoile
  if (hasHalfStar) {
    stars += '<i class="fa-solid fa-star-half-alt"></i>';
  }
  
  // Étoiles vides
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="fa-regular fa-star"></i>';
  }
  
  return stars;
}

/**
 * Obtenir le label d'un type de transporteur
 */
function getTypeLabel(type) {
  const labels = {
    'passenger-carrier': 'Passagers',
    'freight-carrier': 'Fret',
    'mixte': 'Mixte'
  };
  return labels[type] || type;
}

/**
 * Obtenir le label d'un statut
 */
function getStatusLabel(status) {
  const labels = {
    'active': 'Actif',
    'pending': 'En attente',
    'suspended': 'Suspendu'
  };
  return labels[status] || status;
}

/**
 * Formater une date
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR');
}

/**
 * Modifier un transporteur existant
 */
function updateTransporter() {
  console.log('Modifier un transporteur');
  showTransporterSelectionModal('edit');
}

/**
 * Afficher la modal de sélection de transporteur pour modification
 */
function showTransporterSelectionModal(action = 'edit') {
  // Vérifier si la modal existe déjà
  let modal = document.getElementById('transporterSelectionModal');
  
  if (!modal) {
    // Créer la modal si elle n'existe pas
    modal = createTransporterSelectionModalHTML(action);
    document.body.appendChild(modal);
  } else {
    // Mettre à jour le titre selon l'action
    const title = modal.querySelector('.modal-header h2');
    if (title) {
      title.innerHTML = action === 'edit' 
        ? '<i class="fa-solid fa-edit"></i> Sélectionner un transporteur à modifier'
        : '<i class="fa-solid fa-trash"></i> Sélectionner un transporteur à supprimer';
    }
  }
  
  // Afficher la modal
  modal.style.display = 'flex';
  
  // Charger la liste des transporteurs
  loadTransportersForSelection();
  
  // Ajouter les event listeners
  setupTransporterSelectionEvents(action);
}

/**
 * Créer le HTML de la modal de sélection de transporteur
 */
function createTransporterSelectionModalHTML(action) {
  const modal = document.createElement('div');
  modal.id = 'transporterSelectionModal';
  modal.className = 'modal-overlay';
  
  const title = action === 'edit' 
    ? '<i class="fa-solid fa-edit"></i> Sélectionner un transporteur à modifier'
    : '<i class="fa-solid fa-trash"></i> Sélectionner un transporteur à supprimer';
  
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" onclick="closeTransporterSelectionModal()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- Barre de recherche -->
        <div class="search-box">
          <input type="text" id="transporterSelectionSearch" placeholder="Rechercher un transporteur...">
          <i class="fa-solid fa-search"></i>
        </div>
        
        <!-- Liste des transporteurs -->
        <div class="transporters-selection-list" id="transportersSelectionList">
          <div class="loading-item">
            <i class="fa-solid fa-spinner fa-spin"></i> Chargement...
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="closeTransporterSelectionModal()">
          <i class="fa-solid fa-times"></i> Annuler
        </button>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Fermer la modal de sélection de transporteur
 */
function closeTransporterSelectionModal() {
  const modal = document.getElementById('transporterSelectionModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Charger les transporteurs pour la sélection
 */
async function loadTransportersForSelection() {
  try {
    const listContainer = document.getElementById('transportersSelectionList');
    if (!listContainer) return;
    
    // Afficher le loader
    listContainer.innerHTML = `
      <div class="loading-item">
        <i class="fa-solid fa-spinner fa-spin"></i> Chargement...
      </div>
    `;
    
    const response = await fetch(`${getApiBaseUrl()}/admin/transporters?limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Afficher la liste
    displayTransportersForSelection(data.transporters);
    
  } catch (error) {
    console.error('Erreur lors du chargement des transporteurs:', error);
    const listContainer = document.getElementById('transportersSelectionList');
    if (listContainer) {
      listContainer.innerHTML = `
        <div class="error-item">
          <i class="fa-solid fa-exclamation-triangle"></i> Erreur de chargement
        </div>
      `;
    }
  }
}

/**
 * Afficher la liste des transporteurs pour sélection
 */
function displayTransportersForSelection(transporters) {
  const listContainer = document.getElementById('transportersSelectionList');
  if (!listContainer) return;
  
  if (!transporters || transporters.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-item">
        <i class="fa-solid fa-inbox"></i> Aucun transporteur trouvé
      </div>
    `;
    return;
  }
  
  const items = transporters.map(transporter => `
    <div class="transporter-selection-item" data-transporter-id="${transporter.id}">
      <div class="transporter-info">
        <div class="transporter-name">
          <strong>${transporter.company_name || 'N/A'}</strong>
          <span class="transporter-type">${getTypeLabel(transporter.company_type)}</span>
        </div>
        <div class="transporter-details">
          <span class="transporter-email">${transporter.email || 'N/A'}</span>
          <span class="transporter-phone">${transporter.phone_number || 'N/A'}</span>
        </div>
        <div class="transporter-status">
          <span class="status-badge ${transporter.status}">
            ${getStatusLabel(transporter.status)}
          </span>
        </div>
      </div>
      <div class="transporter-actions">
        <button class="btn-action btn-select" onclick="selectTransporter(${transporter.id})" title="Sélectionner">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  listContainer.innerHTML = items;
}

/**
 * Configurer les événements de sélection de transporteur
 */
function setupTransporterSelectionEvents(action) {
  // Recherche en temps réel
  const searchInput = document.getElementById('transporterSelectionSearch');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterTransportersForSelection(this.value);
      }, 300);
    });
  }
}

/**
 * Filtrer les transporteurs dans la liste de sélection
 */
function filterTransportersForSelection(searchTerm) {
  const items = document.querySelectorAll('.transporter-selection-item');
  
  items.forEach(item => {
    const name = item.querySelector('.transporter-name strong').textContent.toLowerCase();
    const email = item.querySelector('.transporter-email').textContent.toLowerCase();
    const phone = item.querySelector('.transporter-phone').textContent.toLowerCase();
    
    const matches = name.includes(searchTerm.toLowerCase()) ||
                   email.includes(searchTerm.toLowerCase()) ||
                   phone.includes(searchTerm.toLowerCase());
    
    item.style.display = matches ? 'flex' : 'none';
  });
}

/**
 * Sélectionner un transporteur pour modification
 */
function selectTransporter(transporterId) {
  closeTransporterSelectionModal();
  
  // Charger les données du transporteur et afficher le formulaire d'édition
  loadTransporterForEdit(transporterId);
}

/**
 * Charger les données d'un transporteur pour modification
 */
async function loadTransporterForEdit(transporterId) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/admin/transporters/${transporterId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const transporter = await response.json();
    
    // Afficher le formulaire d'édition
    showEditTransporterModal(transporter);
    
  } catch (error) {
    console.error('Erreur lors du chargement du transporteur:', error);
    showNotification('Erreur lors du chargement des données du transporteur', 'error');
  }
}

/**
 * Afficher la modal d'édition de transporteur
 */
function showEditTransporterModal(transporter) {
  // Vérifier si la modal existe déjà
  let modal = document.getElementById('editTransporterModal');
  
  if (!modal) {
    // Créer la modal si elle n'existe pas
    modal = createEditTransporterModalHTML();
    document.body.appendChild(modal);
  }
  
  // Afficher la modal
  modal.style.display = 'flex';
  
  // Remplir le formulaire avec les données du transporteur
  populateEditTransporterForm(transporter);
  
  // Ajouter les event listeners
  setupEditTransporterEvents();
}

/**
 * Créer le HTML de la modal d'édition
 */
function createEditTransporterModalHTML() {
  const modal = document.createElement('div');
  modal.id = 'editTransporterModal';
  modal.className = 'modal-overlay';
  
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2><i class="fa-solid fa-edit"></i> Modifier le transporteur</h2>
        <button class="modal-close" onclick="closeEditTransporterModal()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form id="editTransporterForm" class="transporter-form">
          <input type="hidden" id="edit_transporter_id" name="transporter_id">
          
          <!-- Informations de l'entreprise -->
          <div class="form-section">
            <h3><i class="fa-solid fa-building"></i> Informations de l'entreprise</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="edit_company_name">Nom de l'entreprise *</label>
                <input type="text" id="edit_company_name" name="company_name" required>
              </div>
              <div class="form-group">
                <label for="edit_company_type">Type d'entreprise *</label>
                <select id="edit_company_type" name="company_type" required>
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
                <label for="edit_email">Email *</label>
                <input type="email" id="edit_email" name="email" required>
              </div>
              <div class="form-group">
                <label for="edit_phone_number">Téléphone *</label>
                <input type="tel" id="edit_phone_number" name="phone_number" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="edit_status">Statut du compte *</label>
                <select id="edit_status" name="status" required>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
              <div class="form-group">
                <label for="edit_new_password">Nouveau mot de passe (optionnel)</label>
                <input type="password" id="edit_new_password" name="new_password">
                <small>Laissez vide pour conserver le mot de passe actuel</small>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="closeEditTransporterModal()">
          <i class="fa-solid fa-times"></i> Annuler
        </button>
        <button type="submit" form="editTransporterForm" class="btn-primary">
          <i class="fa-solid fa-save"></i> Enregistrer les modifications
        </button>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Fermer la modal d'édition
 */
function closeEditTransporterModal() {
  const modal = document.getElementById('editTransporterModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Remplir le formulaire d'édition avec les données du transporteur
 */
function populateEditTransporterForm(transporter) {
  const form = document.getElementById('editTransporterForm');
  if (!form) return;
  
  // Remplir les champs
  document.getElementById('edit_transporter_id').value = transporter.id;
  document.getElementById('edit_company_name').value = transporter.company_name || '';
  document.getElementById('edit_company_type').value = transporter.company_type || '';
  document.getElementById('edit_email').value = transporter.email || '';
  document.getElementById('edit_phone_number').value = transporter.phone_number || '';
  document.getElementById('edit_status').value = transporter.status || 'active';
  document.getElementById('edit_new_password').value = '';
}

/**
 * Configurer les événements du formulaire d'édition
 */
function setupEditTransporterEvents() {
  const form = document.getElementById('editTransporterForm');
  if (!form) return;
  
  // Gérer la soumission du formulaire
  form.addEventListener('submit', handleEditTransporterSubmit);
  
  // Fermer la modal en cliquant sur l'overlay
  const modal = document.getElementById('editTransporterModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeEditTransporterModal();
      }
    });
  }
}

/**
 * Gérer la soumission du formulaire d'édition
 */
async function handleEditTransporterSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Convertir FormData en objet
  const data = Object.fromEntries(formData.entries());
  
  // Validation
  if (!validateEditTransporterForm(data)) {
    return;
  }
  
  try {
    showEditFormLoader(true);
    
    await submitEditTransporter(data);
    
    showNotification('Transporteur modifié avec succès', 'success');
    closeEditTransporterModal();
    
    // Recharger les données si la liste est ouverte
    if (document.getElementById('transportersListModal')?.style.display === 'flex') {
      loadTransportersData();
    }
    
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    showNotification(error.message || 'Erreur lors de la modification du transporteur', 'error');
  } finally {
    showEditFormLoader(false);
  }
}

/**
 * Valider le formulaire d'édition
 */
function validateEditTransporterForm(data) {
  const errors = [];
  
  if (!data.company_name?.trim()) {
    errors.push('Le nom de l\'entreprise est requis');
  }
  
  if (!data.company_type) {
    errors.push('Le type d\'entreprise est requis');
  }
  
  if (!data.email?.trim()) {
    errors.push('L\'email est requis');
  } else if (!isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
  }
  
  if (!data.phone_number?.trim()) {
    errors.push('Le numéro de téléphone est requis');
  }
  
  if (errors.length > 0) {
    showNotification(errors.join('\n'), 'error');
    return false;
  }
  
  return true;
}

/**
 * Soumettre les modifications du transporteur
 */
async function submitEditTransporter(data) {
  const transporterId = data.transporter_id;
  
  // Préparer les données à envoyer
  const updateData = {
    company_name: data.company_name,
    company_type: data.company_type,
    email: data.email,
    phone_number: data.phone_number,
    status: data.status
  };
  
  // Ajouter le mot de passe seulement s'il est fourni
  if (data.new_password?.trim()) {
    updateData.password = data.new_password;
  }
  
  const response = await fetch(`${getApiBaseUrl()}/admin/transporters/${transporterId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(updateData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erreur API: ${response.status}`);
  }
  
  const result = await response.json();
  return result;
}

/**
 * Valider un email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Supprimer/Désactiver un transporteur
 */
function deleteTransporter() {
  console.log('Supprimer un transporteur');
  showTransporterSelectionModal('delete');
}

/**
 * Action de suppression depuis le tableau (appelée par les boutons du tableau)
 */
function deleteTransporterAction(transporterId) {
  confirmDeleteTransporter(transporterId);
}

/**
 * Action de modification depuis le tableau (appelée par les boutons du tableau)
 */
function editTransporter(transporterId) {
  loadTransporterForEdit(transporterId);
}

/**
 * Confirmer la suppression d'un transporteur
 */
function confirmDeleteTransporter(transporterId) {
  const action = confirmAction(
    'Êtes-vous sûr de vouloir supprimer/désactiver ce transporteur ?\n\n' +
    'Cette action peut être réversible en modifiant le statut du compte.'
  );
  
  if (action) {
    showDeleteTransporterModal(transporterId);
  }
}

/**
 * Afficher la modal de suppression/désactivation
 */
function showDeleteTransporterModal(transporterId) {
  // Vérifier si la modal existe déjà
  let modal = document.getElementById('deleteTransporterModal');
  
  if (!modal) {
    // Créer la modal si elle n'existe pas
    modal = createDeleteTransporterModalHTML();
    document.body.appendChild(modal);
  }
  
  // Afficher la modal
  modal.style.display = 'flex';
  
  // Charger les informations du transporteur
  loadTransporterForDelete(transporterId);
  
  // Ajouter les event listeners
  setupDeleteTransporterEvents(transporterId);
}

/**
 * Créer le HTML de la modal de suppression
 */
function createDeleteTransporterModalHTML() {
  const modal = document.createElement('div');
  modal.id = 'deleteTransporterModal';
  modal.className = 'modal-overlay';
  
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2><i class="fa-solid fa-exclamation-triangle"></i> Supprimer/Désactiver un transporteur</h2>
        <button class="modal-close" onclick="closeDeleteTransporterModal()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div id="transporterDeleteInfo" class="transporter-delete-info">
          <div class="loading-item">
            <i class="fa-solid fa-spinner fa-spin"></i> Chargement des informations...
          </div>
        </div>
        
        <form id="deleteTransporterForm" class="delete-form">
          <input type="hidden" id="delete_transporter_id" name="transporter_id">
          
          <div class="form-section">
            <h3><i class="fa-solid fa-cog"></i> Options de suppression</h3>
            
            <div class="form-group">
              <label for="delete_action">Action à effectuer *</label>
              <select id="delete_action" name="action" required>
                <option value="suspend">Suspendre le compte</option>
                <option value="delete">Supprimer définitivement</option>
                <option value="deactivate">Désactiver temporairement</option>
              </select>
              <small>Choisissez l'action appropriée selon la situation</small>
            </div>
            
            <div class="form-group">
              <label for="delete_reason">Raison de la suppression *</label>
              <textarea id="delete_reason" name="reason" rows="3" required 
                placeholder="Expliquez la raison de cette action..."></textarea>
              <small>Cette information sera enregistrée dans les logs</small>
            </div>
            
            <div class="form-group">
              <label for="delete_notify">Notifier le transporteur</label>
              <div class="checkbox-group">
                <input type="checkbox" id="delete_notify" name="notify" checked>
                <label for="delete_notify">Envoyer un email de notification</label>
              </div>
              <small>Le transporteur sera informé de cette action par email</small>
            </div>
          </div>
          
          <div class="warning-section">
            <div class="warning-box">
              <i class="fa-solid fa-exclamation-triangle"></i>
              <div class="warning-content">
                <h4>Attention !</h4>
                <p>Cette action peut avoir des conséquences importantes :</p>
                <ul>
                  <li>Le transporteur ne pourra plus se connecter</li>
                  <li>Ses trajets actifs pourront être affectés</li>
                  <li>Les réservations en cours pourront être annulées</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="closeDeleteTransporterModal()">
          <i class="fa-solid fa-times"></i> Annuler
        </button>
        <button type="submit" form="deleteTransporterForm" class="btn-danger">
          <i class="fa-solid fa-trash"></i> Confirmer la suppression
        </button>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Fermer la modal de suppression
 */
function closeDeleteTransporterModal() {
  const modal = document.getElementById('deleteTransporterModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Charger les informations du transporteur pour suppression
 */
async function loadTransporterForDelete(transporterId) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/admin/transporters/${transporterId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const transporter = await response.json();
    
    // Afficher les informations du transporteur
    displayTransporterDeleteInfo(transporter);
    
  } catch (error) {
    console.error('Erreur lors du chargement du transporteur:', error);
    const infoContainer = document.getElementById('transporterDeleteInfo');
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div class="error-item">
          <i class="fa-solid fa-exclamation-triangle"></i> Erreur de chargement
        </div>
      `;
    }
  }
}

/**
 * Afficher les informations du transporteur pour suppression
 */
function displayTransporterDeleteInfo(transporter) {
  const infoContainer = document.getElementById('transporterDeleteInfo');
  if (!infoContainer) return;
  
  infoContainer.innerHTML = `
    <div class="transporter-info-card">
      <div class="transporter-header">
        <div class="transporter-avatar">
          <i class="fa-solid fa-truck"></i>
        </div>
        <div class="transporter-details">
          <h3>${transporter.company_name || 'N/A'}</h3>
          <p class="transporter-type">${getTypeLabel(transporter.company_type)}</p>
          <p class="transporter-status">
            <span class="status-badge ${transporter.status}">
              ${getStatusLabel(transporter.status)}
            </span>
          </p>
        </div>
      </div>
      
      <div class="transporter-contact">
        <div class="contact-item">
          <i class="fa-solid fa-envelope"></i>
          <span>${transporter.email || 'N/A'}</span>
        </div>
        <div class="contact-item">
          <i class="fa-solid fa-phone"></i>
          <span>${transporter.phone_number || 'N/A'}</span>
        </div>
        <div class="contact-item">
          <i class="fa-solid fa-calendar"></i>
          <span>Membre depuis ${formatDate(transporter.created_at)}</span>
        </div>
      </div>
      
      <div class="transporter-stats">
        <div class="stat-item">
          <span class="stat-number">0</span>
          <span class="stat-label">Trajets actifs</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">0</span>
          <span class="stat-label">Réservations en cours</span>
        </div>
      </div>
    </div>
  `;
  
  // Mettre à jour l'ID du transporteur dans le formulaire
  const idInput = document.getElementById('delete_transporter_id');
  if (idInput) {
    idInput.value = transporter.id;
  }
}

/**
 * Configurer les événements de la modal de suppression
 */
function setupDeleteTransporterEvents(transporterId) {
  const form = document.getElementById('deleteTransporterForm');
  if (!form) return;
  
  // Gérer la soumission du formulaire
  form.addEventListener('submit', handleDeleteTransporterSubmit);
  
  // Fermer la modal en cliquant sur l'overlay
  const modal = document.getElementById('deleteTransporterModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeDeleteTransporterModal();
      }
    });
  }
}

/**
 * Gérer la soumission du formulaire de suppression
 */
async function handleDeleteTransporterSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Convertir FormData en objet
  const data = Object.fromEntries(formData.entries());
  
  // Validation
  if (!validateDeleteTransporterForm(data)) {
    return;
  }
  
  // Confirmation finale
  const finalConfirmation = confirmAction(
    'Êtes-vous ABSOLUMENT sûr de vouloir procéder à cette action ?\n\n' +
    'Cette action ne peut pas être annulée facilement.'
  );
  
  if (!finalConfirmation) {
    return;
  }
  
  try {
    showFormLoader(true);
    
    await submitDeleteTransporter(data);
    
    showNotification('Transporteur supprimé/désactivé avec succès', 'success');
    closeDeleteTransporterModal();
    
    // Recharger les données si la liste est ouverte
    if (document.getElementById('transportersListModal')?.style.display === 'flex') {
      loadTransportersData();
    }
    
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showNotification(error.message || 'Erreur lors de la suppression du transporteur', 'error');
  } finally {
    showFormLoader(false);
  }
}

/**
 * Valider le formulaire de suppression
 */
function validateDeleteTransporterForm(data) {
  const errors = [];
  
  if (!data.action) {
    errors.push('Veuillez sélectionner une action');
  }
  
  if (!data.reason?.trim()) {
    errors.push('Veuillez indiquer la raison de cette action');
  }
  
  if (errors.length > 0) {
    showNotification(errors.join('\n'), 'error');
    return false;
  }
  
  return true;
}

/**
 * Soumettre la suppression du transporteur
 */
async function submitDeleteTransporter(data) {
  const transporterId = data.transporter_id;
  
  // Préparer les données à envoyer
  const deleteData = {
    action: data.action,
    reason: data.reason,
    notify: data.notify === 'on'
  };
  
  const response = await fetch(`${getApiBaseUrl()}/admin/transporters/${transporterId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(deleteData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erreur API: ${response.status}`);
  }
  
  const result = await response.json();
  return result;
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
      return 'http://localhost:3000/api';
}

/**
 * Obtenir le token d'authentification
 */
function getAuthToken() {
  return sessionStorage.getItem('authToken');
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
window.showEditFormLoader = showEditFormLoader;

// Fonctions pour la liste des transporteurs
window.closeTransportersListModal = closeTransportersListModal;
window.exportTransportersData = exportTransportersData;
window.viewTransporterDetails = viewTransporterDetails;
window.editTransporter = editTransporter;
window.deleteTransporterAction = deleteTransporterAction;
window.goToPage = goToPage;

// Fonctions pour la sélection de transporteur
window.closeTransporterSelectionModal = closeTransporterSelectionModal;
window.selectTransporter = selectTransporter;

// Fonctions pour l'édition
window.closeEditTransporterModal = closeEditTransporterModal;

// Fonctions pour la suppression
window.closeDeleteTransporterModal = closeDeleteTransporterModal;
window.confirmDeleteTransporter = confirmDeleteTransporter;

// Fonctions pour les détails
window.closeTransporterDetailsModal = closeTransporterDetailsModal;
window.editTransporterFromDetails = editTransporterFromDetails;
window.deleteTransporterFromDetails = deleteTransporterFromDetails;

// Fonctions pour les actions du tableau
window.deleteTransporterAction = deleteTransporterAction; 