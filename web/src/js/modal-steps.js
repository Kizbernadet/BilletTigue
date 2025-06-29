/**
 * Gestion des étapes de la modal d'ajout de transporteur
 */

// Variables globales
let currentModalStep = 1;
const totalSteps = 3;

// Naviguer vers l'étape suivante
function nextStep() {
    console.log('🔄 Next step appelé, étape actuelle:', currentModalStep);
    if (validateCurrentStep()) {
        if (currentModalStep < totalSteps) {
            currentModalStep++;
            showStep(currentModalStep);
            updateProgressBar();
            
            if (currentModalStep === 3) {
                generateSummary();
            }
        }
    }
}

// Naviguer vers l'étape précédente
function previousStep() {
    console.log('🔄 Previous step appelé, étape actuelle:', currentModalStep);
    if (currentModalStep > 1) {
        currentModalStep--;
        showStep(currentModalStep);
        updateProgressBar();
    }
}

// Naviguer vers une étape spécifique
function goToStep(stepNumber) {
    console.log('🔄 Go to step appelé:', stepNumber);
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
        currentModalStep = stepNumber;
        showStep(currentModalStep);
        updateProgressBar();
    }
}

// Afficher l'étape spécifiée
function showStep(stepNumber) {
    console.log('🔄 Affichage étape:', stepNumber);
    
    // Masquer toutes les étapes du formulaire
    const allFormSteps = document.querySelectorAll('.form-step');
    console.log('📋 Étapes trouvées:', allFormSteps.length);
    
    allFormSteps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Afficher l'étape courante
    const currentFormStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (currentFormStep) {
        currentFormStep.classList.add('active');
        currentFormStep.style.display = 'block';
        console.log('✅ Étape affichée avec succès');
    } else {
        console.error('❌ Étape formulaire non trouvée:', stepNumber);
    }
    
    // Mettre à jour les boutons de navigation
    updateNavigationButtons();
}

// Mettre à jour les boutons de navigation
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn && nextBtn && submitBtn) {
        // Bouton Précédent
        if (currentModalStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-flex';
        }
        
        // Bouton Suivant / Créer
        if (currentModalStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }
}

// Mettre à jour la barre de progression
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const percentage = (currentModalStep / totalSteps) * 100;
        progressFill.style.width = percentage + '%';
    }
}

// Réinitialiser la modal à la première étape
function resetModalToFirstStep() {
    console.log('🔄 Réinitialisation de la modale');
    
    currentModalStep = 1;
    showStep(1);
    updateProgressBar();
    clearFormErrors();
    
    const form = document.getElementById('addTransporterForm');
    if (form) {
        form.reset();
        console.log('✅ Formulaire réinitialisé');
    }
}

// Valider l'étape courante
function validateCurrentStep() {
    clearFormErrors();
    let isValid = true;
    
    if (currentModalStep === 1) {
        isValid = validateStep1();
    } else if (currentModalStep === 2) {
        isValid = validateStep2();
    } else if (currentModalStep === 3) {
        isValid = validateStep3();
    }
    
    return isValid;
}

// Validation étape 1
function validateStep1() {
    let isValid = true;
    
    const fields = [
        { name: 'company_name', label: 'Nom de l\'entreprise', required: true },
        { name: 'company_type', label: 'Type de transport', required: true },
        { name: 'phone_number', label: 'Numéro de téléphone', required: true }
    ];
    
    fields.forEach(field => {
        const input = document.querySelector(`[name="${field.name}"]`);
        if (input) {
            const value = input.value.trim();
            
            if (field.required && !value) {
                showFieldError(input, `${field.label} est requis`);
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Validation étape 2
function validateStep2() {
    let isValid = true;
    
    const fields = [
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'password', label: 'Mot de passe', required: true }
    ];
    
    fields.forEach(field => {
        const input = document.querySelector(`[name="${field.name}"]`);
        if (input) {
            const value = input.value.trim();
            
            if (field.required && !value) {
                showFieldError(input, `${field.label} est requis`);
                isValid = false;
            } else if (field.type === 'email' && value && !isValidEmail(value)) {
                showFieldError(input, 'Format d\'email invalide');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Validation étape 3
function validateStep3() {
    return true; // Étape de résumé, pas de validation supplémentaire
}

// Générer le résumé
function generateSummary() {
    const form = document.getElementById('addTransporterForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const summaryElement = document.getElementById('transporterSummary');
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="summary-item">
                <strong>Entreprise:</strong> ${data.company_name || 'Non renseigné'}
            </div>
            <div class="summary-item">
                <strong>Type:</strong> ${getCompanyTypeLabel(data.company_type)}
            </div>
            <div class="summary-item">
                <strong>Email:</strong> ${data.email || 'Non renseigné'}
            </div>
            <div class="summary-item">
                <strong>Téléphone:</strong> ${data.phone_number || 'Non renseigné'}
            </div>
        `;
    }
}

// Utilitaires
function getCompanyTypeLabel(type) {
    const labels = {
        'freight-carrier': '🚛 Transport de marchandises',
        'passenger-carrier': '🚌 Transport de voyageurs',
        'mixte': '🚛🚌 Transport mixte'
    };
    return labels[type] || type;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message) {
    const feedback = input.parentNode.querySelector('.input-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.style.color = '#e74c3c';
    }
    input.style.borderColor = '#e74c3c';
}

function clearFormErrors() {
    document.querySelectorAll('.input-feedback').forEach(feedback => {
        feedback.textContent = '';
    });
    
    document.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = '';
    });
}

// Exposer les fonctions globalement
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.resetModalToFirstStep = resetModalToFirstStep; 