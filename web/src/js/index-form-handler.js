/**
 * Gestionnaire de formulaire pour la page d'accueil
 * Gère la soumission du formulaire de recherche avec validation des dates
 */
class IndexFormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormSubmission();
        this.setupPassengerControls();
    }

    setupFormSubmission() {
        const bookingForm = document.querySelector('.booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const departure = document.getElementById('departure').value.trim();
                const arrival = document.getElementById('arrival').value.trim();
                const date = document.getElementById('date').value;
                const returnDate = document.getElementById('return-date').value;
                const passengers = document.getElementById('passengers').value;
                
                // Validation des champs obligatoires
                if (!departure || !arrival || !date) {
                    alert('Veuillez remplir les champs obligatoires : Départ, Arrivée et Date');
                    return;
                }
                
                // Validation des dates avec le gestionnaire de validation
                if (window.dateValidationManager) {
                    const isDateValid = window.dateValidationManager.validateForm(bookingForm);
                    if (!isDateValid) {
                        console.log('❌ Validation des dates échouée');
                        return;
                    }
                }
                
                // Construire l'URL de redirection vers la page de recherche
                const params = new URLSearchParams({
                    departure: departure,
                    arrival: arrival,
                    date: date,
                    passengers: passengers
                });
                
                // Ajouter la date de retour si elle est renseignée
                if (returnDate) {
                    params.append('return-date', returnDate);
                }
                
                // Rediriger vers la page de recherche avec les paramètres
                const searchUrl = `./pages/search-trajets.html?${params.toString()}`;
                console.log('✅ Redirection vers la recherche:', searchUrl);
                
                window.location.href = searchUrl;
            });
        }
    }

    setupPassengerControls() {
        // Gestion des boutons + et - pour les passagers
        const decrementBtn = document.getElementById('decrement-btn');
        const incrementBtn = document.getElementById('increment-btn');
        const passengersInput = document.getElementById('passengers');

        if (decrementBtn && incrementBtn && passengersInput) {
            decrementBtn.addEventListener('click', function() {
                let value = parseInt(passengersInput.value);
                if (value > 1) {
                    passengersInput.value = value - 1;
                }
            });

            incrementBtn.addEventListener('click', function() {
                let value = parseInt(passengersInput.value);
                passengersInput.value = value + 1;
            });
        }
    }
}

// Initialiser le gestionnaire de formulaire au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que le gestionnaire de validation des dates soit initialisé
    setTimeout(() => {
        new IndexFormHandler();
        console.log('✅ Index Form Handler initialisé');
    }, 100);
}); 