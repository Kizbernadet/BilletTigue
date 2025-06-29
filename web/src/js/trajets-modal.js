/**
 * Gestion simple des modales de trajets
 * Script non-module pour éviter les problèmes d'imports
 */

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
      
      // Afficher les trajets (ils sont déjà dans l'ordre décroissant depuis le backend)
      afficherTrajetsListe(result.data);
    } else {
      console.warn('⚠️ Aucun trajet trouvé ou erreur API');
      afficherTrajetsListe([]);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du rechargement des trajets:', error);
    afficherTrajetsListe([]);
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

  // Si aucun trajet, afficher le message
  if (!trajets || trajets.length === 0) {
    trajetsList.innerHTML = `
      <div class="trajet-item-mini trajet-message-empty">
        <p class="size-10 capitalize border-black">Aucun trajet disponible</p>
      </div>
    `;
    console.log('📝 Message "Aucun trajet disponible" affiché');
    return;
  }

  // Afficher les trajets (ordre décroissant déjà fourni par le backend)
  trajetsList.innerHTML = trajets.map(trajet => {
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
  
  console.log(`✅ ${trajets.length} trajets affichés (ordre décroissant: du plus récent au plus ancien)`);
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

    // Construire la date de départ complète
    const departureDateTime = data.departure_date && data.departure_time 
      ? new Date(`${data.departure_date}T${data.departure_time}:00`)
      : null;

    if (!departureDateTime) {
      throw new Error('Date et heure de départ requises');
    }

    // Gérer les places disponibles (par défaut = nombre total de places)
    const available_seats = data.available_seats || data.seats_count;

    // Traiter la checkbox accepts_packages
    const accepts_packages = data.accepts_packages === 'on';

    // Préparer les données pour l'API selon le modèle Trajet
    const trajetData = {
      departure_city: data.departure_city,
      arrival_city: data.arrival_city,
      departure_time: departureDateTime.toISOString(),
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

    console.log('✅ Données préparées pour l\'API (format table trajets):', trajetData);

    // Appel API réel pour créer le trajet
    afficherMessages(['Création du trajet en cours...'], 'info');
    
    try {
      // Utiliser l'API client pour créer le trajet
      const result = await window.TrajetsApi.createTrajet(trajetData);
      
      // Succès
      afficherMessages(['Trajet créé avec succès !'], 'success');
      
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
  if (!data.departure_date) {
    erreurs.push("La date de départ est requise");
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

  // Validation des dates
  if (data.departure_date) {
    const dateDepart = new Date(data.departure_date);
    const dateCourante = new Date();
    dateCourante.setHours(0, 0, 0, 0);

    if (dateDepart < dateCourante) {
      erreurs.push("La date de départ ne peut pas être dans le passé");
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
 * Afficher le profil d'un trajet (version simplifiée)
 */
function afficherProfilTrajet(trajetId) {
  console.log(`🔍 Affichage du profil du trajet ${trajetId}`);
  // Cette fonction sera complétée plus tard avec les vraies données
  alert(`Affichage du trajet ${trajetId} - Fonctionnalité en cours de développement`);
}

/**
 * Modifier un trajet
 */
function modifierTrajet(trajetId) {
  console.log(`✏️ Modification du trajet ${trajetId}`);
  alert(`Modification du trajet ${trajetId} - Fonctionnalité en cours de développement`);
}

/**
 * Supprimer un trajet
 */
function supprimerTrajet(trajetId) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le trajet ${trajetId} ?`)) {
    console.log(`🗑️ Suppression du trajet ${trajetId}`);
    alert(`Trajet ${trajetId} supprimé - Fonctionnalité en cours de développement`);
  }
}

/**
 * Démarrer un trajet
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
window.supprimerTrajet = supprimerTrajet;
window.demarrerTrajet = demarrerTrajet;
window.genererRapport = genererRapport;
window.rechargeTrajets = rechargeTrajets;
window.afficherTrajetsListe = afficherTrajetsListe;

console.log('🌐 Fonctions exposées globalement pour les modales de trajets'); 