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
        const rememberMe = form.querySelector('#remember-me').checked;
        
        if (!email || !password) {
            this.showMessage('Veuillez remplir tous les champs', 'error');
            return;
        }

        // Déterminer le type d'utilisateur selon le sélecteur de rôle ou l'URL
        const roleUserRadio = document.getElementById('role-user');
        const roleTransporterRadio = document.getElementById('role-transporter');
        
        let userType = 'user'; // Par défaut utilisateur
        
        // Priorité 1: Sélecteur de rôle dans la page
        if (roleTransporterRadio && roleTransporterRadio.checked) {
            userType = 'transporter';
        } else if (roleUserRadio && roleUserRadio.checked) {
            userType = 'user';
        } else {
            // Priorité 2: Paramètre URL
            const urlParams = new URLSearchParams(window.location.search);
            const roleParam = urlParams.get('role');
            userType = roleParam || 'user';
        }

        console.log(`🔑 Tentative de connexion ${userType === 'transporter' ? 'transporteur' : 'utilisateur'}:`, email);

        // Afficher un indicateur de chargement amélioré
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const originalHTML = submitButton.innerHTML;
        
        // Désactiver le bouton et afficher l'indicateur de chargement
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Connexion en cours...</span>
        `;
        
        // Ajouter une classe CSS pour le style de chargement
        submitButton.classList.add('loading');

        try {
            // Utiliser l'API avec détection automatique du type d'utilisateur
            const result = await AuthAPI.login({ 
                email, 
                password, 
                rememberMe,
                userType // Passer le type explicitement
            });
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                
                // Marquer la connexion récente pour l'animation de bienvenue
                if (window.ProfileButtonEnhancer) {
                    ProfileButtonEnhancer.markRecentLogin();
                }
                
                // Rediriger selon le rôle de l'utilisateur retourné par l'API
                setTimeout(() => {
                    const user = AuthAPI.getCurrentUser();
                    console.log('🔄 Redirection après connexion pour:', user);
                    
                    this.redirectUserToDashboard(user);
                }, 1500);
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            // Gestion spécifique des erreurs réseau
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showMessage('Erreur de connexion réseau. Vérifiez votre connexion internet et réessayez.', 'error');
            } else if (error.name === 'AbortError') {
                this.showMessage('La requête a été annulée. Veuillez réessayer.', 'error');
            } else {
                this.showMessage('Une erreur inattendue est survenue lors de la connexion. Veuillez réessayer.', 'error');
            }
            console.error('Erreur de connexion:', error);
        } finally {
            // Restaurer le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalHTML;
            submitButton.classList.remove('loading');
        }
    }

    /**
     * Redirige l'utilisateur vers la page d'accueil après connexion
     */
    redirectUserToDashboard(user) {
        if (!user) {
            console.error('❌ Aucun utilisateur trouvé pour la redirection');
            window.location.href = './pages/login.html';
            return;
        }

        // Utiliser le système de redirection vers la page d'accueil
        if (window.LoginRedirectUtils) {
            console.log('🔄 Utilisation du système de redirection vers la page d\'accueil');
            LoginRedirectUtils.redirectAfterLogin(user);
            return;
        }

        // Fallback vers l'ancien système si LoginRedirectUtils n'est pas disponible
        console.log('⚠️ Fallback vers l\'ancien système de redirection');
        
        // Rediriger vers la page d'accueil
        console.log('🔄 Redirection vers la page d\'accueil pour:', user.role);
        
        setTimeout(() => {
            let homePath;
            
            // Déterminer le chemin relatif selon la page actuelle
            if (window.location.pathname.includes('/pages/')) {
                homePath = '../index.html'; // Pour les pages dans le dossier pages
            } else {
                homePath = './index.html'; // Pour les autres pages
            }
            
            console.log('🎯 Redirection vers la page d\'accueil:', homePath);
            window.location.href = homePath;
        }, 1500); // 1.5 secondes pour voir le message de succès
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

        // Afficher un indicateur de chargement amélioré
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const originalHTML = submitButton.innerHTML;
        
        // Désactiver le bouton et afficher l'indicateur de chargement
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Inscription en cours...</span>
        `;
        
        // Ajouter une classe CSS pour le style de chargement
        submitButton.classList.add('loading');

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
            // Gestion spécifique des erreurs réseau
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showMessage('Erreur de connexion réseau. Vérifiez votre connexion internet et réessayez.', 'error');
            } else if (error.name === 'AbortError') {
                this.showMessage('La requête a été annulée. Veuillez réessayer.', 'error');
            } else {
                this.showMessage('Une erreur inattendue est survenue lors de l\'inscription. Veuillez réessayer.', 'error');
            }
            console.error('Erreur d\'inscription:', error);
        } finally {
            // Restaurer le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalHTML;
            submitButton.classList.remove('loading');
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
        let userData = {};

        if (role === 'user') {
            const lastName = form.querySelector('#last-name').value;
            const firstName = form.querySelector('#first-name').value;
            
            if (!lastName || !firstName) {
                this.showMessage('Veuillez remplir le nom et prénom', 'error');
                return null;
            }
            
            // Format attendu par le backend pour les utilisateurs
            const phoneNumber = form.querySelector('#user-phone').value;
            if (!phoneNumber) {
                this.showMessage('Veuillez remplir le numéro de téléphone', 'error');
                return null;
            }
            
            userData = {
                email,
                password,
                firstName,
                lastName,
                phoneNumber
            };
        } else {
            // Validation spécifique aux transporteurs
            const companyName = form.querySelector('#company-name').value;
            const phoneNumber = form.querySelector('#phone-number').value;
            
            if (!companyName || !phoneNumber || !service) {
                this.showMessage('Veuillez remplir le nom de la compagnie, le numéro de téléphone et sélectionner un service', 'error');
                return null;
            }
            
            // Mapper le service vers companyType
            let companyType;
            switch (service) {
                case 'passengers':
                    companyType = 'passenger-carrier';
                    break;
                case 'packages':
                    companyType = 'freight-carrier';
                    break;
                default:
                    companyType = 'mixte';
            }
            
            // Format attendu par le backend pour les transporteurs
            userData = {
                email,
                password,
                phoneNumber,
                companyName,
                companyType
            };
        }

        return userData;
    }

    /**
     * Vérifie le statut d'authentification de manière sécurisée
     */
    async checkAuthenticationStatus() {
        // DÉSACTIVATION TEMPORAIRE - Commenter pour éviter la connexion auto
        console.log('🔧 Vérification automatique d\'authentification désactivée temporairement');
        return;
        
        // Ne vérifier l'authentification que sur les pages de login et register
        const isOnAuthPage = window.location.pathname.includes('login.html') || 
                            window.location.pathname.includes('register.html');
        
        if (!isOnAuthPage) {
            return; // Ne rien faire si on n'est pas sur une page d'auth
        }

        // Vérifier si on vient d'une déconnexion
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') || urlParams.get('emergency') || urlParams.get('fallback')) {
            console.log('🔓 Arrivée après déconnexion, nettoyage préventif');
            this.preventiveCleanup();
            return;
        }

        if (AuthAPI.isAuthenticated()) {
            console.log('🔍 Token trouvé, vérification de validité...');
            
            // Vérifier la validité du token côté serveur
            const isValidToken = await this.verifyTokenValidity();
            
            if (isValidToken) {
                const user = AuthAPI.getCurrentUser();
                console.log('✅ Token valide, utilisateur connecté:', user);
                
                // Vérifier s'il y a une URL de retour
                const urlParams = new URLSearchParams(window.location.search);
                const returnUrl = urlParams.get('returnUrl');
                
                if (returnUrl) {
                    // Il y a une URL de retour, rediriger directement vers celle-ci
                    const decodedReturnUrl = decodeURIComponent(returnUrl);
                    console.log('🔄 Utilisateur déjà connecté, redirection vers page d\'origine:', decodedReturnUrl);
                    window.location.href = decodedReturnUrl;
                } else {
                    // Pas d'URL de retour, redirection normale vers dashboard
                    console.log('🔄 Redirection automatique pour utilisateur déjà connecté:', user);
                    this.redirectUserToDashboard(user);
                }
            } else {
                console.log('❌ Token invalide, nettoyage et maintien sur page de connexion');
                this.preventiveCleanup();
            }
        }
    }

    /**
     * Vérifie la validité du token côté serveur
     */
    async verifyTokenValidity() {
        try {
            const token = sessionStorage.getItem('authToken');
            
            if (!token) {
                return false;
            }

            // Faire une requête simple pour vérifier le token
            const response = await fetch('/api/auth/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.ok;
        } catch (error) {
            console.warn('⚠️ Impossible de vérifier le token:', error.message);
            return false; // En cas d'erreur, considérer le token comme invalide
        }
    }

    /**
     * Nettoyage préventif des données d'authentification
     */
    preventiveCleanup() {
        console.log('🧹 Nettoyage préventif des données d\'authentification');
        
        // Nettoyer les données principales
        const authKeys = ['authToken', 'userData', 'user', 'token'];
        authKeys.forEach(key => {
            sessionStorage.removeItem(key);
        });
        
        // Nettoyer l'URL
        if (window.history && window.history.replaceState) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    /**
     * Affiche un message à l'utilisateur
     */
    showMessage(message, type = 'info') {
        // Supprimer les messages existants
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Définir l'icône selon le type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle" style="font-size:1.5em;margin-right:0.5em;"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle" style="font-size:1.5em;margin-right:0.5em;"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle" style="font-size:1.5em;margin-right:0.5em;"></i>';
                break;
        }

        // Créer le message avec un bouton de fermeture
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <span style="display:flex;align-items:center;gap:0.7em;">
                ${icon}<span style="flex:1;">${message}</span>
                <button class="close-message-btn" style="background:none;border:none;color:white;font-size:1.3em;cursor:pointer;line-height:1;">&times;</button>
            </span>
        `;
        
        // Style amélioré
        messageDiv.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 2000;
            min-width: 280px;
            max-width: 420px;
            padding: 1.3rem 2.2rem 1.3rem 1.5rem;
            border-radius: 14px;
            color: white;
            font-weight: 600;
            font-size: 1.18rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            border: 2.5px solid ${type === 'success' ? '#1e7e34' : type === 'error' ? '#b21f2d' : '#117a8b'};
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1);
        `;

        // Animation d'apparition
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);

        // Bouton de fermeture
        const closeBtn = messageDiv.querySelector('.close-message-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateY(-20px)';
                setTimeout(() => messageDiv.remove(), 400);
            });
        }

        // Ajouter le message au DOM
        document.body.appendChild(messageDiv);

        // Supprimer le message après 5 secondes avec animation
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 400);
            }
        }, 5000);
    }
}

// Initialiser la gestion de l'authentification
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
}); 