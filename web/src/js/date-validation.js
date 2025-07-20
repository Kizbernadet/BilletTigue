/**
 * Date Validation Manager
 * Gère les validations dynamiques des dates dans les formulaires de recherche
 */
class DateValidationManager {
    constructor() {
        this.today = new Date();
        this.maxFutureDate = new Date();
        this.maxFutureDate.setFullYear(this.maxFutureDate.getFullYear() + 1); // Limite à 1 an
        
        this.init();
    }

    /**
     * Initialise les validations de dates
     */
    init() {
        this.setupDateInputs();
        this.setupEventListeners();
    }

    /**
     * Configure les inputs de dates avec les attributs min/max
     */
    setupDateInputs() {
        // Format de date pour les attributs min/max (YYYY-MM-DD)
        const todayString = this.formatDateForInput(this.today);
        const maxDateString = this.formatDateForInput(this.maxFutureDate);

        // Sélectionner tous les inputs de date de départ
        const departureDateInputs = document.querySelectorAll('input[type="date"]#date');
        departureDateInputs.forEach(input => {
            input.setAttribute('min', todayString);
            input.setAttribute('max', maxDateString);
            input.setAttribute('data-date-type', 'departure');
        });

        // Sélectionner tous les inputs de date de retour
        const returnDateInputs = document.querySelectorAll('input[type="date"]#return-date');
        returnDateInputs.forEach(input => {
            input.setAttribute('min', todayString);
            input.setAttribute('max', maxDateString);
            input.setAttribute('data-date-type', 'return');
        });

        // Appliquer les valeurs par défaut si les champs sont vides
        this.setDefaultDates();
    }

    /**
     * Configure les écouteurs d'événements pour les validations dynamiques
     */
    setupEventListeners() {
        // Écouter les changements sur les dates de départ
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="date"][data-date-type="departure"]')) {
                this.handleDepartureDateChange(e.target);
            }
        });

        // Écouter les changements sur les dates de retour
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="date"][data-date-type="return"]')) {
                this.handleReturnDateChange(e.target);
            }
        });

        // Validation en temps réel
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="date"]')) {
                this.validateDateInput(e.target);
            }
        });
    }

    /**
     * Gère le changement de date de départ
     */
    handleDepartureDateChange(departureInput) {
        const departureDate = new Date(departureInput.value);
        const returnInput = this.findReturnDateInput(departureInput);
        
        if (returnInput) {
            // Mettre à jour la date minimale de retour
            const minReturnDate = new Date(departureDate);
            minReturnDate.setDate(minReturnDate.getDate() + 1); // Retour au minimum le lendemain
            
            returnInput.setAttribute('min', this.formatDateForInput(minReturnDate));
            
            // Si la date de retour actuelle est antérieure à la nouvelle date de départ
            if (returnInput.value && new Date(returnInput.value) <= departureDate) {
                returnInput.value = this.formatDateForInput(minReturnDate);
            }
        }

        this.validateDateInput(departureInput);
    }

    /**
     * Gère le changement de date de retour
     */
    handleReturnDateChange(returnInput) {
        const returnDate = new Date(returnInput.value);
        const departureInput = this.findDepartureDateInput(returnInput);
        
        if (departureInput && departureInput.value) {
            const departureDate = new Date(departureInput.value);
            
            // Si la date de retour est antérieure ou égale à la date de départ
            if (returnDate <= departureDate) {
                const minReturnDate = new Date(departureDate);
                minReturnDate.setDate(minReturnDate.getDate() + 1);
                returnInput.value = this.formatDateForInput(minReturnDate);
                
                this.showValidationMessage(returnInput, 'La date de retour doit être postérieure à la date de départ');
            }
        }

        this.validateDateInput(returnInput);
    }

    /**
     * Valide un input de date
     */
    validateDateInput(input) {
        const selectedDate = new Date(input.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignorer l'heure pour la comparaison

        // Supprimer les messages d'erreur précédents
        this.removeValidationMessage(input);

        // Validation de la date de départ
        if (input.getAttribute('data-date-type') === 'departure') {
            if (selectedDate < today) {
                this.showValidationMessage(input, 'La date de départ ne peut pas être dans le passé');
                input.setCustomValidity('La date de départ ne peut pas être dans le passé');
                return false;
            }
        }

        // Validation de la date de retour
        if (input.getAttribute('data-date-type') === 'return') {
            const departureInput = this.findDepartureDateInput(input);
            if (departureInput && departureInput.value) {
                const departureDate = new Date(departureInput.value);
                if (selectedDate <= departureDate) {
                    this.showValidationMessage(input, 'La date de retour doit être postérieure à la date de départ');
                    input.setCustomValidity('La date de retour doit être postérieure à la date de départ');
                    return false;
                }
            }
        }

        // Validation de la limite future
        if (selectedDate > this.maxFutureDate) {
            this.showValidationMessage(input, 'La date ne peut pas dépasser 1 an dans le futur');
            input.setCustomValidity('La date ne peut pas dépasser 1 an dans le futur');
            return false;
        }

        // Date valide
        input.setCustomValidity('');
        return true;
    }

    /**
     * Trouve l'input de date de retour correspondant
     */
    findReturnDateInput(departureInput) {
        const form = departureInput.closest('form');
        if (form) {
            return form.querySelector('input[type="date"][data-date-type="return"]');
        }
        return null;
    }

    /**
     * Trouve l'input de date de départ correspondant
     */
    findDepartureDateInput(returnInput) {
        const form = returnInput.closest('form');
        if (form) {
            return form.querySelector('input[type="date"][data-date-type="departure"]');
        }
        return null;
    }

    /**
     * Définit les dates par défaut si les champs sont vides
     */
    setDefaultDates() {
        const departureInputs = document.querySelectorAll('input[type="date"][data-date-type="departure"]');
        const returnInputs = document.querySelectorAll('input[type="date"][data-date-type="return"]');

        // Date de départ par défaut : demain
        const defaultDeparture = new Date();
        defaultDeparture.setDate(defaultDeparture.getDate() + 1);
        const defaultDepartureString = this.formatDateForInput(defaultDeparture);

        // Date de retour par défaut : dans 2 jours
        const defaultReturn = new Date();
        defaultReturn.setDate(defaultReturn.getDate() + 2);
        const defaultReturnString = this.formatDateForInput(defaultReturn);

        departureInputs.forEach(input => {
            if (!input.value) {
                input.value = defaultDepartureString;
            }
        });

        returnInputs.forEach(input => {
            if (!input.value) {
                input.value = defaultReturnString;
            }
        });
    }

    /**
     * Affiche un message de validation
     */
    showValidationMessage(input, message) {
        // Supprimer les messages existants
        this.removeValidationMessage(input);

        // Créer le message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'date-validation-error';
        errorDiv.style.cssText = `
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 0.75rem;"></i>
            <span>${message}</span>
        `;

        // Insérer après l'input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        
        // Ajouter une classe d'erreur à l'input
        input.classList.add('date-input-error');
    }

    /**
     * Supprime les messages de validation
     */
    removeValidationMessage(input) {
        const existingError = input.parentNode.querySelector('.date-validation-error');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('date-input-error');
    }

    /**
     * Formate une date pour les attributs HTML (YYYY-MM-DD)
     */
    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Valide un formulaire complet
     */
    validateForm(form) {
        const dateInputs = form.querySelectorAll('input[type="date"]');
        let isValid = true;

        dateInputs.forEach(input => {
            if (!this.validateDateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Réinitialise les validations
     */
    reset() {
        const errorMessages = document.querySelectorAll('.date-validation-error');
        errorMessages.forEach(error => error.remove());

        const errorInputs = document.querySelectorAll('.date-input-error');
        errorInputs.forEach(input => input.classList.remove('date-input-error'));
    }
}

// Initialiser le gestionnaire de validation des dates
document.addEventListener('DOMContentLoaded', function() {
    window.dateValidationManager = new DateValidationManager();
});

// Exporter pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateValidationManager;
} 