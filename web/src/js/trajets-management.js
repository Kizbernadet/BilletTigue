// ===== GESTION DES TRAJETS - BilletTigue =====

// Données des trajets (simulation d'une base de données)
const trajetsData = {
  1: {
    id: 1,
    statut: 'En cours',
    itineraire: 'Dakar → Thiès',
    date: '18/12/2024',
    heure: '08:00',
    validite: '18/12/2024',
    vehicule: 'Renault Kangoo',
    chauffeur: 'Jean Dupont',
    places: '8/12',
    prix: '2,500 FCFA',
    distance: '70 km'
  },
  2: {
    id: 2,
    statut: 'Terminé',
    itineraire: 'Thiès → Saint-Louis',
    date: '15/12/2024',
    heure: '14:30',
    validite: '15/12/2024',
    vehicule: 'Mercedes Sprinter',
    chauffeur: 'Marie Diop',
    places: '12/12',
    prix: '3,000 FCFA',
    distance: '120 km'
  },
  3: {
    id: 3,
    statut: 'En attente',
    itineraire: 'Saint-Louis → Dakar',
    date: '18/12/2024',
    heure: '07:00',
    validite: '18/12/2024',
    vehicule: 'Toyota Hiace',
    chauffeur: 'Pierre Sall',
    places: '12/12',
    prix: '2,800 FCFA',
    distance: '110 km'
  },
  4: {
    id: 4,
    statut: 'En cours',
    itineraire: 'Kaolack → Fatick',
    date: '20/12/2024',
    heure: '09:15',
    validite: '20/12/2024',
    vehicule: 'Ford Transit',
    chauffeur: 'Fatou Ba',
    places: '6/10',
    prix: '1,800 FCFA',
    distance: '45 km'
  },
  5: {
    id: 5,
    statut: 'Terminé',
    itineraire: 'Fatick → Mbour',
    date: '10/12/2024',
    heure: '11:00',
    validite: '10/12/2024',
    vehicule: 'Nissan Urvan',
    chauffeur: 'Omar Diallo',
    places: '10/10',
    prix: '2,200 FCFA',
    distance: '60 km'
  },
  6: {
    id: 6,
    statut: 'En attente',
    itineraire: 'Mbour → Dakar',
    date: '22/12/2024',
    heure: '06:45',
    validite: '22/12/2024',
    vehicule: 'Peugeot Boxer',
    chauffeur: 'Aissatou Fall',
    places: '12/12',
    prix: '2,000 FCFA',
    distance: '80 km'
  },
  7: {
    id: 7,
    statut: 'En cours',
    itineraire: 'Dakar → Ziguinchor',
    date: '25/12/2024',
    heure: '13:00',
    validite: '25/12/2024',
    vehicule: 'Iveco Daily',
    chauffeur: 'Moussa Cissé',
    places: '4/15',
    prix: '5,500 FCFA',
    distance: '250 km'
  }
};

let trajetActuel = null;

// ===== FONCTIONS DE GESTION DU PROFIL UTILISATEUR =====

function toggleProfileMenu() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// ===== FONCTIONS DE GESTION DES TRAJETS =====

// Fonction pour afficher le profil d'un trajet
function afficherProfilTrajet(trajetId) {
  const trajet = trajetsData[trajetId];
  if (!trajet) {
    alert('Trajet non trouvé');
    return;
  }

  trajetActuel = trajet;

  // Remplir les données de la modal
  document.getElementById('modalTrajetTitre').textContent = `Trajet ${trajet.itineraire}`;
  document.getElementById('modalStatut').textContent = trajet.statut;
  document.getElementById('modalItineraire').textContent = trajet.itineraire;
  document.getElementById('modalDate').textContent = trajet.date;
  document.getElementById('modalHeure').textContent = trajet.heure;
  document.getElementById('modalValidite').textContent = trajet.validite;
  document.getElementById('modalVehicule').textContent = trajet.vehicule;
  document.getElementById('modalChauffeur').textContent = trajet.chauffeur;
  document.getElementById('modalPlaces').textContent = trajet.places;
  document.getElementById('modalPrix').textContent = trajet.prix;
  document.getElementById('modalDistance').textContent = trajet.distance;

  // Gérer l'affichage des boutons selon le statut
  const btnDemarrer = document.getElementById('btnDemarrer');
  const btnTerminer = document.getElementById('btnTerminer');
  const btnRapport = document.getElementById('btnRapport');
  const btnModifier = document.getElementById('btnModifier');
  const btnSupprimer = document.getElementById('btnSupprimer');

  // Masquer tous les boutons d'action spécifiques
  btnDemarrer.style.display = 'none';
  btnTerminer.style.display = 'none';
  btnRapport.style.display = 'none';

  // Afficher les boutons selon le statut
  switch(trajet.statut) {
    case 'En attente':
      btnDemarrer.style.display = 'inline-flex';
      break;
    case 'En cours':
      btnTerminer.style.display = 'inline-flex';
      break;
    case 'Terminé':
      btnRapport.style.display = 'inline-flex';
      btnSupprimer.style.display = 'none'; // Pas de suppression pour les trajets terminés
      break;
  }

  // Afficher la modal
  document.getElementById('trajetModal').style.display = 'flex';
}

// Fonction pour fermer la modal
function fermerModal() {
  document.getElementById('trajetModal').style.display = 'none';
  trajetActuel = null;
}

// Fonction pour modifier un trajet
function modifierTrajet(trajetId) {
  // Ici on pourrait ouvrir un formulaire de modification
  alert(`Modifier le trajet ${trajetId} - Fonctionnalité à implémenter`);
}

function modifierTrajetModal() {
  if (trajetActuel) {
    modifierTrajet(trajetActuel.id);
    fermerModal();
  }
}

// Fonction pour supprimer un trajet
function supprimerTrajet(trajetId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
    // Ici on pourrait faire un appel API pour supprimer
    alert(`Trajet ${trajetId} supprimé avec succès`);
    // Recharger la liste ou supprimer l'élément du DOM
  }
}

function supprimerTrajetModal() {
  if (trajetActuel) {
    supprimerTrajet(trajetActuel.id);
    fermerModal();
  }
}

// Fonction pour démarrer un trajet
function demarrerTrajet(trajetId) {
  // Ici on pourrait faire un appel API pour changer le statut
  alert(`Trajet ${trajetId} démarré avec succès`);
}

function demarrerTrajetModal() {
  if (trajetActuel) {
    demarrerTrajet(trajetActuel.id);
    fermerModal();
  }
}

// Fonction pour terminer un trajet
function terminerTrajetModal() {
  if (trajetActuel) {
    // Ici on pourrait faire un appel API pour changer le statut
    alert(`Trajet ${trajetActuel.id} terminé avec succès`);
    fermerModal();
  }
}

// Fonction pour générer un rapport
function genererRapport(trajetId) {
  // Ici on pourrait générer et télécharger un rapport
  alert(`Rapport généré pour le trajet ${trajetId}`);
}

function genererRapportModal() {
  if (trajetActuel) {
    genererRapport(trajetActuel.id);
    fermerModal();
  }
}

// ===== FONCTIONS POUR LE FORMULAIRE D'AJOUT DE TRAJET =====

// Ouvrir le formulaire d'ajout de trajet
function ouvrirFormulaireTrajet() {
  document.getElementById('formulaireTrajetModal').style.display = 'flex';
  // Définir la date minimale à aujourd'hui
  const dateCourante = new Date().toISOString().split('T')[0];
  document.getElementById('dateDepart').min = dateCourante;
  document.getElementById('dateValidite').min = dateCourante;
}

// Fermer le formulaire d'ajout de trajet
function fermerFormulaireTrajet() {
  document.getElementById('formulaireTrajetModal').style.display = 'none';
  reinitialiserFormulaire();
}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
  document.getElementById('formNouveauTrajet').reset();
  document.getElementById('formMessages').innerHTML = '';
}

// Valider le formulaire
function validerFormulaire(formData) {
  const erreurs = [];

  // Validation des champs requis
  if (!formData.lieuDepart.trim()) {
    erreurs.push("Le lieu de départ est requis");
  }
  if (!formData.lieuArrivee.trim()) {
    erreurs.push("Le lieu d'arrivée est requis");
  }
  if (!formData.dateDepart) {
    erreurs.push("La date de départ est requise");
  }
  if (!formData.heureDepart) {
    erreurs.push("L'heure de départ est requise");
  }
  if (!formData.dateValidite) {
    erreurs.push("La date de validité est requise");
  }
  if (!formData.vehicule) {
    erreurs.push("Le véhicule est requis");
  }
  if (!formData.chauffeur) {
    erreurs.push("Le chauffeur est requis");
  }
  if (!formData.nombrePlaces || formData.nombrePlaces < 1) {
    erreurs.push("Le nombre de places doit être supérieur à 0");
  }
  if (!formData.prixPlace || formData.prixPlace < 100) {
    erreurs.push("Le prix par place doit être d'au moins 100 FCFA");
  }

  // Validation des dates
  const dateDepart = new Date(formData.dateDepart);
  const dateValidite = new Date(formData.dateValidite);
  const dateCourante = new Date();
  dateCourante.setHours(0, 0, 0, 0);

  if (dateDepart < dateCourante) {
    erreurs.push("La date de départ ne peut pas être dans le passé");
  }
  if (dateValidite < dateDepart) {
    erreurs.push("La date de validité ne peut pas être antérieure à la date de départ");
  }

  return erreurs;
}

// Soumettre le formulaire
function soumettreFormulaireTrajet(event) {
  event.preventDefault();
  
  try {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Valider le formulaire
    const erreurs = validerFormulaire(data);
    
    if (erreurs.length > 0) {
      afficherMessages(erreurs, 'error');
      return;
    }

    // Simuler l'envoi au serveur
    simulerCreationTrajet(data);
  } catch (error) {
    afficherMessages(['Une erreur est survenue lors de la soumission du formulaire'], 'error');
  }
}

// Afficher les messages d'erreur ou de succès
function afficherMessages(messages, type) {
  try {
    const container = document.getElementById('formMessages');
    if (!container) return;
    
    const className = type === 'error' ? 'form-error' : 'form-success';
    
    container.innerHTML = messages.map(msg => 
      `<div class="${className}">${msg}</div>`
    ).join('');
  } catch (error) {
    console.error('Erreur lors de l\'affichage des messages:', error);
  }
}

// Simuler la création d'un trajet
function simulerCreationTrajet(data) {
  try {
    // Afficher un message de chargement
    afficherMessages(['Création du trajet en cours...'], 'success');
    
    // Simuler un délai de traitement
    setTimeout(() => {
      try {
        // Générer un nouvel ID
        const ids = Object.keys(trajetsData).map(Number);
        const nouvelId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        
        // Créer l'objet trajet
        const nouveauTrajet = {
          id: nouvelId,
          statut: data.statutInitial || 'En attente',
          itineraire: `${data.lieuDepart} → ${data.lieuArrivee}`,
          date: formaterDate(data.dateDepart),
          heure: data.heureDepart,
          validite: formaterDate(data.dateValidite),
          vehicule: data.vehicule,
          chauffeur: data.chauffeur,
          places: `0/${data.nombrePlaces}`,
          prix: `${data.prixPlace} FCFA`,
          distance: data.distance ? `${data.distance} km` : 'Non spécifiée'
        };

        // Ajouter à la base de données simulée
        trajetsData[nouvelId] = nouveauTrajet;

        // Afficher le message de succès
        afficherMessages(['Trajet créé avec succès !'], 'success');

        // Fermer le formulaire après 2 secondes
        setTimeout(() => {
          fermerFormulaireTrajet();
        }, 2000);

      } catch (error) {
        afficherMessages(['Erreur lors de la création du trajet'], 'error');
      }
    }, 1500);
  } catch (error) {
    afficherMessages(['Erreur lors du traitement'], 'error');
  }
}

// Formater une date pour l'affichage
function formaterDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    return date.toLocaleDateString('fr-FR');
  } catch (error) {
    return 'Date invalide';
  }
}

// Recharger la liste des trajets (fonction optionnelle pour l'avenir)
function rechargerListeTrajets() {
  // Cette fonction pourrait être utilisée pour recharger la liste depuis le serveur
  // Pour l'instant, elle est commentée car nous utilisons des données simulées
  console.log('Rechargement de la liste des trajets...');
}

// ===== ÉVÉNEMENTS ET INITIALISATION =====

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
  // Fermer le menu quand on clique ailleurs
  document.addEventListener('click', function(event) {
    const profileBtn = document.getElementById('profileBtn');
    const dropdown = document.getElementById('profileDropdown');
    
    if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.style.display = 'none';
    }
  });

  // Fermer la modal en cliquant sur l'overlay
  document.getElementById('trajetModal').addEventListener('click', function(event) {
    if (event.target === this) {
      fermerModal();
    }
  });

  // Fermer la modal de formulaire en cliquant sur l'overlay
  document.getElementById('formulaireTrajetModal').addEventListener('click', function(event) {
    if (event.target === this) {
      fermerFormulaireTrajet();
    }
  });

  // Fermer les modales avec la touche Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      // Fermer la modal de profil trajet si elle est ouverte
      if (document.getElementById('trajetModal').style.display === 'flex') {
        fermerModal();
      }
      // Fermer la modal de formulaire si elle est ouverte
      if (document.getElementById('formulaireTrajetModal').style.display === 'flex') {
        fermerFormulaireTrajet();
      }
    }
  });
}); 