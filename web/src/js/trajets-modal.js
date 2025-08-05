/**
 * Gestion simple des modales de trajets
 * Script non-module pour éviter les problèmes d'imports
 */

// ===== CONFIGURATION API =====
const API_BASE_URL = 'http://localhost:3000/api';

// ===== FONCTIONS DE GESTION DES MODALES =====

/**
 * Ouvrir la modale de formulaire d'ajout de trajet
 */
function ouvrirFormulaireTrajet() {
  console.log('🚛 Ouverture du formulaire d\'ajout de trajet...');
  
  // Réinitialiser le formulaire
  const form = document.getElementById('formNouveauTrajet');
  if (form) {
    form.reset();
  }
  
  // Effacer les messages précédents
  const messagesContainer = document.getElementById('formMessages');
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
  }
  
  // Afficher la modal
  const modal = document.getElementById('formulaireTrajetModal');
  if (modal) {
    modal.style.display = 'flex';
    console.log('✅ Formulaire de trajet ouvert');
  } else {
    console.error('❌ Modal formulaire non trouvée');
  }
}

/**
 * Fermer la modale de formulaire d'ajout de trajet
 */
function fermerFormulaireTrajet() {
  console.log('🚛 Fermeture du formulaire d\'ajout de trajet...');
  
  const modal = document.getElementById('formulaireTrajetModal');
  if (modal) {
    modal.style.display = 'none';
    console.log('✅ Formulaire de trajet fermé');
  }
}

/**
 * Réinitialiser le formulaire
 */
function reinitialiserFormulaire() {
  console.log('🔄 Réinitialisation du formulaire...');
  
  const form = document.getElementById('formNouveauTrajet');
  if (form) {
    form.reset();
  }
  
  // Effacer les messages
  const messagesContainer = document.getElementById('formMessages');
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
  }
  
  console.log('✅ Formulaire réinitialisé');
}

// === PAGINATION TRAJETS ===
let currentTrajetsPage = 1;
const TRAJETS_PER_PAGE = 10;
let trajetsPaginationData = [];

function afficherPaginationTrajets(totalTrajets) {
  const trajetsList = document.querySelector('.trajets-list');
  if (!trajetsList) return;
  const totalPages = Math.ceil(totalTrajets / TRAJETS_PER_PAGE);
  if (totalPages <= 1) {
    const oldNav = document.getElementById('trajets-pagination-nav');
    if (oldNav) oldNav.remove();
    return;
  }
  let navHtml = `<div id="trajets-pagination-nav" class="trajets-pagination-nav">`;
  navHtml += `<button class="btn-pagination" id="btnTrajetsPrev" ${currentTrajetsPage === 1 ? 'disabled' : ''}>Précédent</button>`;
  navHtml += `<span class="pagination-info">Page ${currentTrajetsPage} / ${totalPages}</span>`;
  navHtml += `<button class="btn-pagination" id="btnTrajetsNext" ${currentTrajetsPage === totalPages ? 'disabled' : ''}>Suivant</button>`;
  navHtml += `</div>`;
  // Supprimer l'ancienne nav si présente
  const oldNav = document.getElementById('trajets-pagination-nav');
  if (oldNav) oldNav.remove();
  trajetsList.insertAdjacentHTML('afterend', navHtml);
  // Ajouter les listeners
  document.getElementById('btnTrajetsPrev').onclick = () => changerPageTrajets(currentTrajetsPage - 1);
  document.getElementById('btnTrajetsNext').onclick = () => changerPageTrajets(currentTrajetsPage + 1);
}

function changerPageTrajets(page) {
  const totalPages = Math.ceil(trajetsPaginationData.length / TRAJETS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentTrajetsPage = page;
  afficherTrajetsListe(trajetsPaginationData);
  afficherPaginationTrajets(trajetsPaginationData.length);
}

/**
 * Recharger et afficher les trajets du transporteur
 */
async function rechargeTrajets() {
  try {
    console.log('🔄 Rechargement des trajets...');
    
    if (!window.TrajetsApi) {
      console.error('❌ API Trajets non disponible');
      return;
    }
    
    // Récupérer les trajets depuis l'API
    const result = await window.TrajetsApi.getTrajetsByTransporteur();
    
    if (result.success && result.data) {
      console.log('✅ Trajets rechargés:', result.data.length, 'trajets');
      trajetsPaginationData = result.data;
      currentTrajetsPage = 1;
      afficherTrajetsListe(trajetsPaginationData);
      afficherPaginationTrajets(trajetsPaginationData.length);
    } else {
      console.warn('⚠️ Aucun trajet trouvé ou erreur API');
      trajetsPaginationData = [];
      currentTrajetsPage = 1;
      afficherTrajetsListe([]);
      afficherPaginationTrajets(0);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du rechargement des trajets:', error);
    trajetsPaginationData = [];
    currentTrajetsPage = 1;
    afficherTrajetsListe([]);
    afficherPaginationTrajets(0);
  }
}

/**
 * Afficher la liste des trajets dans l'interface
 */
function afficherTrajetsListe(trajets) {
  const trajetsList = document.querySelector('.trajets-list');
  if (!trajetsList) {
    console.warn('⚠️ Container .trajets-list non trouvé');
    return;
  }

  // Pagination locale
  const totalTrajets = trajets.length;
  const totalPages = Math.ceil(totalTrajets / TRAJETS_PER_PAGE);
  const startIdx = (currentTrajetsPage - 1) * TRAJETS_PER_PAGE;
  const endIdx = startIdx + TRAJETS_PER_PAGE;
  const trajetsPage = trajets.slice(startIdx, endIdx);

  // Si aucun trajet, afficher le message
  if (!trajetsPage || trajetsPage.length === 0) {
    trajetsList.innerHTML = `
      <div class="trajet-item-mini trajet-message-empty">
        <p class="size-10 capitalize border-black">Aucun trajet disponible</p>
      </div>
    `;
    console.log('📝 Message "Aucun trajet disponible" affiché');
    return;
  }

  // Afficher les trajets (ordre décroissant déjà fourni par le backend)
  trajetsList.innerHTML = trajetsPage.map(trajet => {
    // Formater les données pour l'affichage
    const dateDepart = new Date(trajet.departure_time);
    const dateFormatee = dateDepart.toLocaleDateString('fr-FR');
    const heureFormatee = dateDepart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const itineraire = `${trajet.departure_city} → ${trajet.arrival_city}`;
    
    // Déterminer le statut en français
    const statusMap = {
      'active': 'En cours',
      'pending': 'En attente', 
      'completed': 'Terminé',
      'cancelled': 'Annulé',
      'scheduled': 'Programmé'
    };
    const statutFr = statusMap[trajet.status] || trajet.status;
    
    return `
      <div class="trajet-item-mini" data-trajet-id="${trajet.id}" onclick="afficherProfilTrajet(${trajet.id})">
        <span class="status-badge ${trajet.status}">${statutFr}</span>
        <span class="trajet-itineraire">${itineraire}</span>
        <span class="trajet-date"><i class="fa-solid fa-calendar"></i> ${dateFormatee}</span>
        <span class="trajet-horaire"><i class="fa-solid fa-clock"></i> ${heureFormatee}</span>
        <div class="trajet-actions">
          <button class="btn-action" title="Voir" onclick="event.stopPropagation(); afficherProfilTrajet(${trajet.id})">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-action" title="Modifier" onclick="event.stopPropagation(); modifierTrajet(${trajet.id})">
            <i class="fa-solid fa-edit"></i>
          </button>
          <button class="btn-action" title="Supprimer" onclick="event.stopPropagation(); supprimerTrajet(${trajet.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // Afficher la pagination si besoin
  afficherPaginationTrajets(totalTrajets);
  console.log(`✅ ${trajetsPage.length} trajets affichés (page ${currentTrajetsPage}/${totalPages})`);
}

/**
 * Soumettre le formulaire d'ajout de trajet
 */
async function soumettreFormulaireTrajet(event) {
  event.preventDefault();
  console.log('📝 Soumission du formulaire de trajet...');
  
  try {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Données du formulaire:', data);
    
    // Valider le formulaire
    const erreurs = validerFormulaire(data);
    
    if (erreurs.length > 0) {
      afficherMessages(erreurs, 'error');
      return;
    }
    
    // Traitement des données selon le modèle Trajet
    console.log('📊 Données du formulaire:', data);

    // Vérifier si on utilise des dates multiples
    const multipleDates = data.multiple_dates === 'on';
    
    let departureDates = [];
    
    if (multipleDates) {
      // Récupérer toutes les dates du formulaire
      const dateInputs = document.querySelectorAll('input[name="departure_dates[]"]');
      dateInputs.forEach(input => {
        if (input.value) {
          departureDates.push(input.value);
        }
      });
      
      if (departureDates.length === 0) {
        throw new Error('Au moins une date de départ est requise');
      }
    } else {
      // Mode date unique
      if (!data.departure_date) {
        throw new Error('Date de départ requise');
      }
      departureDates = [data.departure_date];
    }

    if (!data.departure_time) {
      throw new Error('Heure de départ requise');
    }

    // Gérer les places disponibles (par défaut = nombre total de places)
    const available_seats = data.available_seats || data.seats_count;

    // Traiter la checkbox accepts_packages
    const accepts_packages = data.accepts_packages === 'on';

    // Préparer les données pour l'API selon le modèle Trajet
    const trajetData = {
      departure_city: data.departure_city,
      arrival_city: data.arrival_city,
      departure_dates: departureDates, // Tableau de dates
      departure_time: data.departure_time, // Heure (sera combinée avec chaque date)
      price: parseFloat(data.price),
      seats_count: parseInt(data.seats_count),
      available_seats: parseInt(available_seats),
      status: data.status || 'active',
      accepts_packages: accepts_packages,
      max_package_weight: accepts_packages && data.max_package_weight 
        ? parseFloat(data.max_package_weight) 
        : null,
      departure_point: data.departure_point || null,
      arrival_point: data.arrival_point || null
      // transporteur_id sera ajouté par le backend basé sur l'authentification
    };

    // Vérifier si c'est une modification ou une création
    const trajetId = form.getAttribute('data-trajet-id');
    const isModification = trajetId !== null;

    if (isModification) {
      afficherMessages(['Mise à jour du trajet en cours...'], 'info');
      try {
        // Appel API pour mettre à jour le trajet
        const result = await window.TrajetsApi.updateTrajet(trajetId, trajetData);
        afficherMessages(['Trajet mis à jour avec succès !'], 'success');
        console.log('🎉 Trajet modifié avec succès, mise à jour de l\'interface...');
        // Actualiser stats et liste
        if (window.transporterStatsManager) {
          await window.transporterStatsManager.refreshStats();
        }
        await rechargeTrajets();
        setTimeout(() => {
          fermerFormulaireTrajet();
        }, 1200);
      } catch (error) {
        console.error('❌ Échec de la modification du trajet:', error);
        afficherMessages([error.message || 'Erreur lors de la modification du trajet'], 'error');
      }
      return;
    }

    // Création classique
    console.log('✅ Données préparées pour l\'API (dates multiples):', trajetData);
    afficherMessages(['Création du trajet en cours...'], 'info');
    try {
      // Utiliser l'API client pour créer le trajet
      const result = await window.TrajetsApi.createTrajet(trajetData);
      // Succès
      const message = result.count > 1 
        ? `${result.count} trajets créés avec succès !` 
        : 'Trajet créé avec succès !';
      afficherMessages([message], 'success');
      console.log('🎉 Trajet créé avec succès, mise à jour de l\'interface...');
      // 1. Actualiser les statistiques immédiatement
      if (window.transporterStatsManager) {
        console.log('📊 Actualisation des statistiques...');
        await window.transporterStatsManager.refreshStats();
      }
      // 2. Recharger la liste des trajets immédiatement
      console.log('🔄 Rechargement de la liste des trajets...');
      await rechargeTrajets();
      // 3. Fermer le formulaire après 1.5 secondes
      setTimeout(() => {
        fermerFormulaireTrajet();
      }, 1500);
    } catch (error) {
      console.error('❌ Échec de la création du trajet:', error);
      // Afficher l'erreur à l'utilisateur
      const errorMessage = error.message || 'Erreur lors de la création du trajet';
      afficherMessages([errorMessage], 'error');
    }
  } catch (error) {
    console.error('Erreur formulaire:', error);
    afficherMessages(['Une erreur est survenue lors de la soumission'], 'error');
  }
}

/**
 * Valider les données du formulaire selon le modèle Trajet
 */
function validerFormulaire(data) {
  const erreurs = [];

  // Validation des champs requis (colonnes de la table trajets)
  if (!data.departure_city || !data.departure_city.trim()) {
    erreurs.push("La ville de départ est requise");
  }
  if (!data.arrival_city || !data.arrival_city.trim()) {
    erreurs.push("La ville d'arrivée est requise");
  }
  // Validation des dates selon le mode choisi
  const multipleDates = data.multiple_dates === 'on';
  
  if (multipleDates) {
    // Mode dates multiples
    const dateInputs = document.querySelectorAll('input[name="departure_dates[]"]');
    let hasValidDate = false;
    
    dateInputs.forEach(input => {
      if (input.value) {
        hasValidDate = true;
        const dateDepart = new Date(input.value);
        const dateCourante = new Date();
        dateCourante.setHours(0, 0, 0, 0);

        if (dateDepart < dateCourante) {
          erreurs.push(`La date ${input.value} ne peut pas être dans le passé`);
        }
      }
    });
    
    if (!hasValidDate) {
      erreurs.push("Au moins une date de départ est requise");
    }
  } else {
    // Mode date unique
  if (!data.departure_date) {
    erreurs.push("La date de départ est requise");
    } else {
      const dateDepart = new Date(data.departure_date);
      const dateCourante = new Date();
      dateCourante.setHours(0, 0, 0, 0);

      if (dateDepart < dateCourante) {
        erreurs.push("La date de départ ne peut pas être dans le passé");
      }
    }
  }
  if (!data.departure_time) {
    erreurs.push("L'heure de départ est requise");
  }
  if (!data.price || parseFloat(data.price) < 100) {
    erreurs.push("Le prix par place doit être d'au moins 100 FCFA");
  }
  if (!data.seats_count || parseInt(data.seats_count) < 1) {
    erreurs.push("Le nombre de places doit être supérieur à 0");
  }
  if (parseInt(data.seats_count) > 50) {
    erreurs.push("Le nombre de places ne peut pas dépasser 50");
  }

  // Validation des places disponibles
  if (!data.available_seats || parseInt(data.available_seats) < 0) {
    erreurs.push("Le nombre de places disponibles ne peut pas être négatif");
  }
  if (parseInt(data.available_seats) > parseInt(data.seats_count)) {
    erreurs.push("Les places disponibles ne peuvent pas dépasser le nombre total de places");
  }

  // Validation des colis si acceptés
  if (data.accepts_packages === 'on') {
    if (data.max_package_weight && parseFloat(data.max_package_weight) < 0) {
      erreurs.push("Le poids maximum des colis ne peut pas être négatif");
    }
  }



  // Validation de la longueur des champs
  if (data.departure_city && data.departure_city.length > 100) {
    erreurs.push("La ville de départ ne peut pas dépasser 100 caractères");
  }
  if (data.arrival_city && data.arrival_city.length > 100) {
    erreurs.push("La ville d'arrivée ne peut pas dépasser 100 caractères");
  }
  if (data.departure_point && data.departure_point.length > 200) {
    erreurs.push("Le point de départ ne peut pas dépasser 200 caractères");
  }
  if (data.arrival_point && data.arrival_point.length > 200) {
    erreurs.push("Le point d'arrivée ne peut pas dépasser 200 caractères");
  }

  return erreurs;
}

/**
 * Afficher les messages d'erreur ou de succès
 */
function afficherMessages(messages, type = 'info') {
  try {
    const container = document.getElementById('formMessages');
    if (!container) {
      console.warn('Container de messages non trouvé');
      return;
    }
    
    const className = type === 'error' ? 'form-error' : 
                     type === 'success' ? 'form-success' : 'form-info';
    
    container.innerHTML = messages.map(msg => 
      `<div class="${className}" style="padding: 10px; margin: 5px 0; border-radius: 4px; ${
        type === 'error' ? 'background: #fee; color: #c33; border: 1px solid #faa;' :
        type === 'success' ? 'background: #efe; color: #363; border: 1px solid #afa;' :
        'background: #eef; color: #336; border: 1px solid #aaf;'
      }">${msg}</div>`
    ).join('');
    
    console.log(`${type.toUpperCase()}:`, messages);
    
  } catch (error) {
    console.error('Erreur lors de l\'affichage des messages:', error);
  }
}

// ===== FONCTIONS MODALES PROFIL TRAJET =====

/**
 * Fermer la modale de profil de trajet
 */
function fermerModal() {
  const modal = document.getElementById('trajetModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Afficher le profil d'un trajet avec les vraies données
 */
async function afficherProfilTrajet(trajetId) {
  try {
  console.log(`🔍 Affichage du profil du trajet ${trajetId}`);
    
    // S'assurer que la modale existe et est visible
    const modal = document.getElementById('trajetModal');
    if (!modal) {
      console.error('❌ Modale trajetModal non trouvée');
      alert('Erreur: Modale non trouvée');
      return;
    }
    
    // Afficher la modale immédiatement
    modal.style.display = 'flex';
    
    // Attendre un peu pour que le DOM soit mis à jour
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Vérifier que les éléments sont maintenant disponibles
    const titre = document.getElementById('modalTrajetTitre');
    const details = document.querySelector('.trajet-details');
    
    if (!titre || !details) {
      console.error('❌ Éléments de la modale non trouvés après affichage');
      alert('Erreur: Éléments de la modale non trouvés');
      return;
    }
    
    // Afficher un loader pendant le chargement
    titre.textContent = 'Chargement...';
    details.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent-color);"></i><p>Chargement des détails...</p></div>';
    
    // Récupérer les détails du trajet depuis l'API
    const result = await window.TrajetsApi.getTrajetById(trajetId);
    
    console.log('📡 Réponse API:', result);
    
    // Vérifier la structure de la réponse
    if (result && (result.data || result.trajet || result)) {
      const trajet = result.data || result.trajet || result;
      console.log('✅ Détails du trajet récupérés:', trajet);
      
      // Remplir la modale avec les données
      remplirModalTrajet(trajet);
      
    } else {
      throw new Error(result?.message || 'Erreur lors de la récupération des détails');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage du profil:', error);
    
    // Afficher un message d'erreur dans la modale
    const modal = document.getElementById('trajetModal');
    if (modal) {
      modal.style.display = 'flex';
      const titre = document.getElementById('modalTrajetTitre');
      const details = document.querySelector('.trajet-details');
      
      if (titre) titre.textContent = 'Erreur';
      if (details) {
        details.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: #dc3545;">
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 2rem;"></i>
            <p>Erreur lors du chargement des détails</p>
            <p style="font-size: 0.9rem; margin-top: 1rem;">${error.message}</p>
          </div>
        `;
      }
    }
  }
}

/**
 * Remplir la modale avec les détails du trajet
 */
function remplirModalTrajet(trajet) {
  try {
    console.log('📝 Remplissage de la modale avec les données:', trajet);
    
    // Restaurer le contenu HTML original de la modale
    const details = document.querySelector('.trajet-details');
    if (details) {
      details.innerHTML = `
        <div class="detail-section">
          <h3><i class="fa-solid fa-info-circle"></i> Informations Générales</h3>
          <div class="detail-items-container">
            <div class="detail-item">
              <span class="detail-label">Statut</span>
              <span class="detail-value" id="modalStatut">En cours</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Itinéraire</span>
              <span class="detail-value" id="modalItineraire">Dakar → Thiès</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date de départ</span>
              <span class="detail-value" id="modalDate">18/12/2024</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Heure de départ</span>
              <span class="detail-value" id="modalHeure">08:00</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Prix par place</span>
              <span class="detail-value" id="modalPrix">2,500 FCFA</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Places disponibles</span>
              <span class="detail-value" id="modalPlaces">8/12</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3><i class="fa-solid fa-bus"></i> Détails du Transport</h3>
          <div class="detail-items-container">
            <div class="detail-item">
              <span class="detail-label">Transporteur</span>
              <span class="detail-value" id="modalVehicule">Renault Kangoo</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Point de départ</span>
              <span class="detail-value" id="modalDeparturePoint">Non spécifié</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Point d'arrivée</span>
              <span class="detail-value" id="modalArrivalPoint">Non spécifié</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Accepte les colis</span>
              <span class="detail-value" id="modalAcceptsPackages">Oui</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Poids max. colis</span>
              <span class="detail-value" id="modalMaxPackageWeight">20 kg</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date de création</span>
              <span class="detail-value" id="modalCreatedAt">18/12/2024</span>
            </div>
          </div>
        </div>
      `;
    }
    
    // Attendre un peu pour que le DOM soit mis à jour
    setTimeout(() => {
      // Fonction helper pour mettre à jour un élément de manière sécurisée
      function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
        } else {
          console.warn(`⚠️ Élément avec l'ID '${id}' non trouvé`);
        }
      }
    
      // Mettre à jour le titre
      updateElement('modalTrajetTitre', `Trajet #${trajet.id}`);
      
      // Formater les dates
      const dateDepart = new Date(trajet.departure_time);
      const dateFormatee = dateDepart.toLocaleDateString('fr-FR');
      const heureFormatee = dateDepart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      // Déterminer le statut en français
      const statusMap = {
        'active': 'En cours',
        'pending': 'En attente', 
        'completed': 'Terminé',
        'cancelled': 'Annulé',
        'scheduled': 'Programmé'
      };
      const statutFr = statusMap[trajet.status] || trajet.status;
      
      // Remplir les détails de manière sécurisée
      updateElement('modalStatut', statutFr);
      updateElement('modalItineraire', `${trajet.departure_city} → ${trajet.arrival_city}`);
      updateElement('modalDate', dateFormatee);
      updateElement('modalHeure', heureFormatee);
      updateElement('modalPrix', `${trajet.price.toLocaleString()} FCFA`);
      updateElement('modalPlaces', `${trajet.available_seats}/${trajet.seats_count}`);
      updateElement('modalVehicule', trajet.transporteur?.company_name || 'Non spécifié');
      updateElement('modalDeparturePoint', trajet.departure_point || 'Non spécifié');
      updateElement('modalArrivalPoint', trajet.arrival_point || 'Non spécifié');
      updateElement('modalAcceptsPackages', trajet.accepts_packages ? 'Oui' : 'Non');
      updateElement('modalMaxPackageWeight', trajet.max_package_weight ? `${trajet.max_package_weight} kg` : 'Non spécifié');
      
      // Date de création
      const dateCreation = new Date(trajet.created_at);
      const dateCreationFormatee = dateCreation.toLocaleDateString('fr-FR');
      updateElement('modalCreatedAt', dateCreationFormatee);
      
      // Stocker l'ID du trajet
      const modal = document.getElementById('trajetModal');
      if (modal) {
        modal.setAttribute('data-trajet-id', trajet.id);
      }
      
      // Gérer les boutons d'action selon le statut
      const btnDemarrer = document.getElementById('btnDemarrer');
      const btnTerminer = document.getElementById('btnTerminer');
      const btnRapport = document.getElementById('btnRapport');
      
      if (btnDemarrer) btnDemarrer.style.display = trajet.status === 'pending' ? 'block' : 'none';
      if (btnTerminer) btnTerminer.style.display = trajet.status === 'active' ? 'block' : 'none';
      if (btnRapport) btnRapport.style.display = trajet.status === 'completed' ? 'block' : 'none';
      
      console.log('✅ Modale remplie avec succès');
    }, 50);
    
  } catch (error) {
    console.error('❌ Erreur lors du remplissage de la modale:', error);
    
    // Afficher un message d'erreur dans la modale
    const modal = document.getElementById('trajetModal');
    if (modal) {
      modal.style.display = 'flex';
      const titre = document.getElementById('modalTrajetTitre');
      const details = document.querySelector('.trajet-details');
      
      if (titre) titre.textContent = 'Erreur';
      if (details) {
        details.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: #dc3545;">
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 2rem;"></i>
            <p>Erreur lors du chargement des détails</p>
            <p style="font-size: 0.9rem; margin-top: 1rem;">${error.message}</p>
          </div>
        `;
      }
    }
  }
}

/**
 * Modifier un trajet (depuis la modale)
 */
async function modifierTrajetModal() {
  try {
    const modal = document.getElementById('trajetModal');
    const trajetId = modal.getAttribute('data-trajet-id');
    console.log(`✏️ Modification du trajet ${trajetId} depuis la modale`);
    
    // Récupérer les données du trajet depuis l'API
    const result = await window.TrajetsApi.getTrajetById(trajetId);
    
    if (result && (result.data || result.trajet || result)) {
      const trajet = result.data || result.trajet || result;
      console.log('✅ Données du trajet pour modification:', trajet);
      
      // Fermer la modale de profil
      fermerModal();
      
      // Ouvrir le formulaire de modification
      setTimeout(() => {
        ouvrirFormulaireTrajet();
        preRemplirFormulaireModification(trajet);
      }, 300);
      
    } else {
      throw new Error('Erreur lors de la récupération des données du trajet');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
    alert(`Erreur lors de la modification: ${error.message}`);
  }
}

/**
 * Pré-remplir le formulaire avec les données du trajet à modifier
 */
function preRemplirFormulaireModification(trajet) {
  try {
    console.log('📝 Pré-remplissage du formulaire avec les données:', trajet);
    
    // Changer le titre du formulaire
    const titreFormulaire = document.querySelector('#formulaireTrajetModal .modal-title');
    if (titreFormulaire) {
      titreFormulaire.innerHTML = '<i class="fa-solid fa-edit"></i> Modifier le Trajet';
    }
    
    // Ajouter l'ID du trajet au formulaire
    const formulaire = document.getElementById('formNouveauTrajet');
    if (formulaire) {
      formulaire.setAttribute('data-trajet-id', trajet.id);
    }
    
    // Formater la date et l'heure
    const dateDepart = new Date(trajet.departure_time);
    const dateFormatee = dateDepart.toISOString().split('T')[0];
    const heureFormatee = dateDepart.toTimeString().slice(0, 5);
    
    // Remplir les champs du formulaire
    const champs = {
      'departure_city': trajet.departure_city,
      'arrival_city': trajet.arrival_city,
      'departure_time': heureFormatee,
      'departure_date': dateFormatee,
      'price': trajet.price,
      'seats_count': trajet.seats_count,
      'available_seats': trajet.available_seats,
      'departure_point': trajet.departure_point || '',
      'arrival_point': trajet.arrival_point || '',
      'accepts_packages': trajet.accepts_packages ? 'on' : '',
      'max_package_weight': trajet.max_package_weight || ''
    };
    
    // Remplir chaque champ
    Object.keys(champs).forEach(champId => {
      const element = document.getElementById(champId);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = champs[champId] === 'on';
        } else {
          element.value = champs[champId];
        }
      }
    });
    
    // Gérer les colis
    const checkboxColis = document.getElementById('accepts_packages');
    const divPoidsMax = document.getElementById('max_package_weight_group');
    
    if (checkboxColis && divPoidsMax) {
      if (checkboxColis.checked) {
        divPoidsMax.style.display = 'block';
      } else {
        divPoidsMax.style.display = 'none';
      }
    }
    
    // Changer le texte du bouton de soumission
    const btnSoumettre = document.querySelector('#formNouveauTrajet button[type="submit"]');
    if (btnSoumettre) {
      btnSoumettre.innerHTML = '<i class="fa-solid fa-save"></i> Mettre à jour';
    }
    
    console.log('✅ Formulaire pré-rempli avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du pré-remplissage:', error);
  }
}

/**
 * Modifier un trajet (depuis la liste)
 */
function modifierTrajet(trajetId) {
  afficherProfilTrajet(trajetId);
  setTimeout(modifierTrajetModal, 400);
}

/**
 * Supprimer un trajet (depuis la modale)
 */
async function supprimerTrajetModal() {
  const modal = document.getElementById('trajetModal');
  const trajetId = modal.getAttribute('data-trajet-id');
  
  try {
    // Récupérer les données du trajet depuis l'API
    const result = await window.TrajetsApi.getTrajetById(trajetId);
    
    if (result && (result.data || result.trajet || result)) {
      const trajet = result.data || result.trajet || result;
      console.log('🗑️ Ouverture de la modale de confirmation pour:', trajet);
      
      // Fermer la modale de détails
      fermerModal();
      
      // Ouvrir la modale de confirmation
      setTimeout(() => {
        ouvrirConfirmationModal(trajet);
      }, 300);
      
    } else {
      throw new Error('Erreur lors de la récupération des données du trajet');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ouverture de la confirmation:', error);
    alert(`Erreur: ${error.message}`);
  }
}

/**
 * Supprimer un trajet (depuis la liste)
 */
async function supprimerTrajet(trajetId) {
  try {
    // Récupérer les données du trajet depuis l'API
    const result = await window.TrajetsApi.getTrajetById(trajetId);
    
    if (result && (result.data || result.trajet || result)) {
      const trajet = result.data || result.trajet || result;
      console.log('🗑️ Ouverture de la modale de confirmation pour:', trajet);
      
      // Ouvrir la modale de confirmation
      ouvrirConfirmationModal(trajet);
      
    } else {
      throw new Error('Erreur lors de la récupération des données du trajet');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ouverture de la confirmation:', error);
    alert(`Erreur: ${error.message}`);
  }
}

/**
 * Démarrer un trajet (depuis la modale)
 */
function demarrerTrajetModal() {
  const modal = document.getElementById('trajetModal');
  const trajetId = modal.getAttribute('data-trajet-id');
  
  if (confirm(`Démarrer le trajet #${trajetId} ?`)) {
    console.log(`▶️ Démarrage du trajet ${trajetId} depuis la modale`);
    
    // TODO: Appeler l'API pour démarrer le trajet
    alert(`Trajet ${trajetId} démarré - Fonctionnalité en cours de développement`);
    
    // Fermer la modale et recharger la liste
    fermerModal();
    setTimeout(() => {
      rechargeTrajets();
    }, 300);
  }
}

/**
 * Terminer un trajet (depuis la modale)
 */
function terminerTrajetModal() {
  const modal = document.getElementById('trajetModal');
  const trajetId = modal.getAttribute('data-trajet-id');
  
  if (confirm(`Terminer le trajet #${trajetId} ?`)) {
    console.log(`✅ Fin du trajet ${trajetId} depuis la modale`);
    
    // TODO: Appeler l'API pour terminer le trajet
    alert(`Trajet ${trajetId} terminé - Fonctionnalité en cours de développement`);
    
    // Fermer la modale et recharger la liste
    fermerModal();
    setTimeout(() => {
      rechargeTrajets();
    }, 300);
  }
}

/**
 * Générer un rapport (depuis la modale)
 */
function genererRapportModal() {
  const modal = document.getElementById('trajetModal');
  const trajetId = modal.getAttribute('data-trajet-id');
  
  console.log(`📊 Génération du rapport pour le trajet ${trajetId} depuis la modale`);
  
  // TODO: Appeler l'API pour générer le rapport
  alert(`Rapport du trajet ${trajetId} - Fonctionnalité en cours de développement`);
}

/**
 * Démarrer un trajet (depuis la liste)
 */
function demarrerTrajet(trajetId) {
  if (confirm(`Démarrer le trajet ${trajetId} ?`)) {
    console.log(`▶️ Démarrage du trajet ${trajetId}`);
    alert(`Trajet ${trajetId} démarré - Fonctionnalité en cours de développement`);
  }
}

/**
 * Générer un rapport
 */
function genererRapport(trajetId) {
  console.log(`📊 Génération du rapport pour le trajet ${trajetId}`);
  alert(`Rapport du trajet ${trajetId} - Fonctionnalité en cours de développement`);
}

// ===== GESTIONNAIRE D'ÉVÉNEMENTS =====

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚛 Script trajets-modal.js chargé');
  
  // Fermer les modales en cliquant sur l'overlay
  const trajetModal = document.getElementById('trajetModal');
  const formulaireModal = document.getElementById('formulaireTrajetModal');
  
  if (trajetModal) {
    trajetModal.addEventListener('click', function(event) {
      if (event.target === this) {
        fermerModal();
      }
    });
  }
  
  if (formulaireModal) {
    formulaireModal.addEventListener('click', function(event) {
      if (event.target === this) {
        fermerFormulaireTrajet();
      }
    });
  }
  
  // Fermer les modales avec la touche Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      if (trajetModal && trajetModal.style.display === 'flex') {
        fermerModal();
      }
      if (formulaireModal && formulaireModal.style.display === 'flex') {
        fermerFormulaireTrajet();
      }
    }
  });
  
  console.log('✅ Gestionnaires d\'événements initialisés');
});

// ===== EXPOSITION GLOBALE DES FONCTIONS =====

// Rendre les fonctions accessibles depuis le HTML
window.ouvrirFormulaireTrajet = ouvrirFormulaireTrajet;
window.fermerFormulaireTrajet = fermerFormulaireTrajet;
window.reinitialiserFormulaire = reinitialiserFormulaire;
window.soumettreFormulaireTrajet = soumettreFormulaireTrajet;
window.afficherProfilTrajet = afficherProfilTrajet;
window.fermerModal = fermerModal;
window.modifierTrajet = modifierTrajet;
window.modifierTrajetModal = modifierTrajetModal;
window.supprimerTrajet = supprimerTrajet;
window.supprimerTrajetModal = supprimerTrajetModal;
window.demarrerTrajet = demarrerTrajet;
window.demarrerTrajetModal = demarrerTrajetModal;
window.terminerTrajetModal = terminerTrajetModal;
window.genererRapport = genererRapport;
window.genererRapportModal = genererRapportModal;
window.rechargeTrajets = rechargeTrajets;
window.afficherTrajetsListe = afficherTrajetsListe;

console.log('🌐 Fonctions exposées globalement pour les modales de trajets'); 

// ===== FONCTION DE TEST =====

/**
 * Test de la modale avec des données fictives
 */
function testModalTrajet() {
  console.log('🧪 Test de la modale de trajet...');
  
  const trajetTest = {
    id: 999,
    departure_city: 'Dakar',
    arrival_city: 'Thiès',
    departure_time: '2024-12-20T08:00:00.000Z',
    price: 2500,
    available_seats: 8,
    seats_count: 12,
    status: 'pending',
    departure_point: 'Gare routière de Dakar',
    arrival_point: 'Gare routière de Thiès',
    accepts_packages: true,
    max_package_weight: 20,
    created_at: '2024-12-18T10:00:00.000Z',
    transporteur: {
      company_name: 'Transport Express'
    }
  };
  
  // Afficher la modale avec les données de test
  remplirModalTrajet(trajetTest);
}

// Exposer la fonction de test
window.testModalTrajet = testModalTrajet;

// ===== GESTION DE LA MODALE DE CONFIRMATION =====

let trajetASupprimer = null;

/**
 * Ouvre la modale de confirmation de suppression
 * @param {Object} trajet - Les données du trajet à supprimer
 */
function ouvrirConfirmationModal(trajet) {
  trajetASupprimer = trajet;
  
  // Mettre à jour les informations du trajet dans la modale
  const trajetInfo = document.getElementById('confirmationTrajetInfo');
  if (trajetInfo) {
    trajetInfo.textContent = `${trajet.departure_city} → ${trajet.arrival_city} (${trajet.price} FCFA)`;
  }
  
  // Afficher la modale
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Ferme la modale de confirmation
 */
function fermerConfirmationModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  trajetASupprimer = null;
}

/**
 * Confirme la suppression du trajet
 */
async function confirmerSuppression() {
  if (!trajetASupprimer) {
    console.error('Aucun trajet à supprimer');
    return;
  }
  
  try {
    // Afficher un indicateur de chargement
    const btnSupprimer = document.querySelector('#confirmationModal .btn-danger');
    const originalText = btnSupprimer.innerHTML;
    btnSupprimer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Suppression...';
    btnSupprimer.disabled = true;
    
    // Appeler l'API de suppression
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    
    const response = await fetch(`${API_BASE_URL}/trajets/${trajetASupprimer.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Fermer la modale de confirmation
      fermerConfirmationModal();
      
      // Fermer aussi la modale de détails si elle est ouverte
      fermerModal();
      
      // Afficher un message de succès
      afficherMessages(['Trajet supprimé avec succès'], 'success');
      
      // Recharger la liste des trajets
      if (typeof chargerTrajets === 'function') {
        chargerTrajets();
      } else if (typeof rechargeTrajets === 'function') {
        rechargeTrajets();
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    afficherMessages([`Erreur lors de la suppression: ${error.message}`], 'error');
  } finally {
    // Restaurer le bouton
    const btnSupprimer = document.querySelector('#confirmationModal .btn-danger');
    if (btnSupprimer) {
      btnSupprimer.innerHTML = '<i class="fa-solid fa-trash"></i> Supprimer définitivement';
      btnSupprimer.disabled = false;
    }
  }
}

// Fermer la modale en cliquant à l'extérieur
document.addEventListener('DOMContentLoaded', function() {
  const confirmationModal = document.getElementById('confirmationModal');
  if (confirmationModal) {
    confirmationModal.addEventListener('click', function(e) {
      if (e.target === confirmationModal) {
        fermerConfirmationModal();
      }
    });
  }
});

// Exposer les fonctions de confirmation
window.ouvrirConfirmationModal = ouvrirConfirmationModal;
window.fermerConfirmationModal = fermerConfirmationModal;
window.confirmerSuppression = confirmerSuppression;

/**
 * Test de la modale de confirmation
 */
function testConfirmationModal() {
  console.log('🧪 Test de la modale de confirmation...');
  
  const trajetTest = {
    id: 999,
    departure_city: 'Dakar',
    arrival_city: 'Thiès',
    price: 2500
  };
  
  // Ouvrir la modale de confirmation avec les données de test
  ouvrirConfirmationModal(trajetTest);
}

// Exposer la fonction de test
window.testConfirmationModal = testConfirmationModal; 