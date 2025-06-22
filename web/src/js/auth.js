import { AuthAPI } from './api/index.js';

/**
 * Gestionnaire d'authentification pour les pages de connexion et d'inscription
 */

class AuthManager {
    constructor() {
        this.initializeAuth();
    }

    /**
     * Initialise la gestion de l'authentification
     */
    initializeAuth() {
        // Gestion du formulaire de connexion
        this.setupLoginForm();
        
        // Gestion du formulaire d'inscription
        this.setupRegisterForm();
        
        // Vérifier si l'utilisateur est déjà connecté
        this.checkAuthenticationStatus();
    }

    /**
     * Configure le formulaire de connexion
     */
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(loginForm);
        });
    }

    /**
     * Configure le formulaire d'inscription
     */
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) return;

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(registerForm);
        });

        // Gestion du sélecteur de rôle
        this.setupRoleSelector();
    }

    /**
     * Configure le sélecteur de rôle pour l'inscription
     */
    setupRoleSelector() {
        const roleUserRadio = document.getElementById('role-user');
        const roleTransporterRadio = document.getElementById('role-transporter');
        const servicesSelect = document.getElementById('services');
        
        if (!roleUserRadio || !roleTransporterRadio) return;

        const updateFormFields = (selectedRole) => {
            const userFields = document.querySelector('[data-role="user"]');
            const transporterFields = document.querySelector('[data-role="transporter"]');
            
            // Champs utilisateur
            const firstNameInput = document.getElementById('first-name');
            const lastNameInput = document.getElementById('last-name');
            
            // Champs transporteur
            const companyNameInput = document.getElementById('company-name');
            const phoneNumberInput = document.getElementById('phone-number');
            
            if (selectedRole === 'transporter') {
                // Afficher les champs transporteur, cacher les champs utilisateur
                userFields.classList.add('hidden');
                transporterFields.classList.remove('hidden');
                
                // Rendre les champs transporteur required
                if (servicesSelect) {
                    servicesSelect.setAttribute('required', 'required');
                }
                if (companyNameInput) {
                    companyNameInput.setAttribute('required', 'required');
                }
                if (phoneNumberInput) {
                    phoneNumberInput.setAttribute('required', 'required');
                }
                
                // Retirer required des champs utilisateur
                if (firstNameInput) {
                    firstNameInput.removeAttribute('required');
                }
                if (lastNameInput) {
                    lastNameInput.removeAttribute('required');
                }
                
            } else {
                // Afficher les champs utilisateur, cacher les champs transporteur
                userFields.classList.remove('hidden');
                transporterFields.classList.add('hidden');
                
                // Rendre les champs utilisateur required
                if (firstNameInput) {
                    firstNameInput.setAttribute('required', 'required');
                }
                if (lastNameInput) {
                    lastNameInput.setAttribute('required', 'required');
                }
                
                // Retirer required des champs transporteur
                if (servicesSelect) {
                    servicesSelect.removeAttribute('required');
                }
                if (companyNameInput) {
                    companyNameInput.removeAttribute('required');
                }
                if (phoneNumberInput) {
                    phoneNumberInput.removeAttribute('required');
                }
            }
        };

        roleUserRadio.addEventListener('change', () => updateFormFields('user'));
        roleTransporterRadio.addEventListener('change', () => updateFormFields('transporter'));
        
        // Initialiser avec le rôle par défaut
        updateFormFields('user');
    }

    /**
     * Gère la soumission du formulaire de connexion
     */
    async handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        if (!email || !password) {
            this.showMessage('Veuillez remplir tous les champs', 'error');
            return;
        }

        // Afficher un indicateur de chargement
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Connexion en cours...';
        submitButton.disabled = true;

        try {
            const result = await AuthAPI.login({ email, password });
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                
                // Rediriger selon le rôle de l'utilisateur
                setTimeout(() => {
                    const user = AuthAPI.getCurrentUser();
                    if (user && user.role === 'admin') {
                        // Rediriger l'admin vers son tableau de bord
                        window.location.href = './admin-dashboard.html';
                    } else if (user && user.role === 'transporter') {
                        // Rediriger les transporteurs vers leur tableau de bord
                        window.location.href = './transporter-dashboard.html';
                    } else {
                        // Rediriger les autres utilisateurs vers le tableau de bord utilisateur
                        window.location.href = './user-dashboard.html';
                    }
                }, 1500);
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue lors de la connexion', 'error');
        } finally {
            // Restaurer le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    /**
     * Gère la soumission du formulaire d'inscription
     */
    async handleRegister(form) {
        // Récupérer les données du formulaire
        const formData = this.getRegisterFormData(form);
        
        if (!formData) {
            return; // Les erreurs de validation sont déjà affichées
        }

        // Afficher un indicateur de chargement
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Inscription en cours...';
        submitButton.disabled = true;

        try {
            const result = await AuthAPI.register(formData);
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                // Rediriger vers la page de connexion
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1500);
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue lors de l\'inscription', 'error');
        } finally {
            // Restaurer le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    /**
     * Récupère et valide les données du formulaire d'inscription
     */
    getRegisterFormData(form) {
        const roleUser = document.getElementById('role-user');
        const roleTransporter = document.getElementById('role-transporter');
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirm-password').value;
        const service = form.querySelector('#services').value;

        // Validation de base
        if (!email || !password || !confirmPassword) {
            this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return null;
        }

        if (password !== confirmPassword) {
            this.showMessage('Les mots de passe ne correspondent pas', 'error');
            return null;
        }

        // Déterminer le rôle
        const role = roleTransporter.checked ? 'transporter' : 'user';

        // Construire les données selon le rôle
        const userData = {
            email,
            password,
            confirmPassword,
            role,
            profile: {}
        };

        if (role === 'user') {
            const lastName = form.querySelector('#last-name').value;
            const firstName = form.querySelector('#first-name').value;
            
            if (!lastName || !firstName) {
                this.showMessage('Veuillez remplir le nom et prénom', 'error');
                return null;
            }
            
            userData.profile = {
                lastName,
                firstName
            };
        } else {
            // Validation spécifique aux transporteurs
            const companyName = form.querySelector('#company-name').value;
            const phoneNumber = form.querySelector('#phone-number').value;
            
            if (!companyName || !phoneNumber || !service) {
                this.showMessage('Veuillez remplir le nom de la compagnie, le numéro de téléphone et sélectionner un service', 'error');
                return null;
            }
            
            userData.profile = {
                companyName,
                phoneNumber
            };
            userData.service = service;
        }

        return userData;
    }

    /**
     * Vérifie le statut d'authentification
     */
    checkAuthenticationStatus() {
        // Ne vérifier l'authentification que sur les pages de login et register
        const isOnAuthPage = window.location.pathname.includes('login.html') || 
                            window.location.pathname.includes('register.html');
        
        if (!isOnAuthPage) {
            return; // Ne rien faire si on n'est pas sur une page d'auth
        }

        if (AuthAPI.isAuthenticated()) {
            const user = AuthAPI.getCurrentUser();
            console.log('Utilisateur connecté:', user);
            
            // Rediriger selon le rôle de l'utilisateur
            if (user && user.role === 'admin') {
                window.location.href = './admin-dashboard.html';
            } else if (user && user.role === 'transporter') {
                window.location.href = './transporter-dashboard.html';
            } else {
                window.location.href = './user-dashboard.html';
            }
        }
    }

    /**
     * Affiche un message à l'utilisateur
     */
    showMessage(message, type = 'info') {
        // Supprimer les messages existants
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message auth-message-${type}`;
        messageDiv.textContent = message;
        
        // Styles pour les messages
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out'
        };

        // Couleurs selon le type
        if (type === 'success') {
            styles.backgroundColor = '#10b981';
        } else if (type === 'error') {
            styles.backgroundColor = '#ef4444';
        } else {
            styles.backgroundColor = '#3b82f6';
        }

        // Appliquer les styles
        Object.assign(messageDiv.style, styles);

        // Ajouter l'animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Ajouter le message au DOM
        document.body.appendChild(messageDiv);

        // Supprimer le message après 5 secondes
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialiser la gestion de l'authentification
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
}); 