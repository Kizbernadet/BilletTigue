/**
 * Gestionnaire de profil pour la page de profil utilisateur
 */

class ProfileManager {
    constructor() {
        this.initializeProfile();
    }

    /**
     * Initialise la gestion du profil
     */
    initializeProfile() {
        // Vérifier l'authentification
        this.checkAuthentication();
        
        // Charger les données du profil
        this.loadProfileData();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Mettre à jour l'affichage du nom d'utilisateur
        this.updateUserName();
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    checkAuthentication() {
        if (!AuthAPI.isAuthenticated()) {
            // Rediriger vers la page de connexion si non authentifié
            window.location.href = './pages/login.html';
            return;
        }
    }

    /**
     * Charge les données du profil depuis l'API
     */
    async loadProfileData() {
        try {
            // Afficher un indicateur de chargement
            this.showLoadingState(true);
            
            // Récupérer les données du profil
            const user = AuthAPI.getCurrentUser();
            
            if (user) {
                // Remplir le formulaire avec les données existantes
                this.populateForm(user);
            } else {
                // Si pas de données utilisateur, essayer de les récupérer depuis l'API
                const profileData = await this.fetchProfileData();
                if (profileData) {
                    this.populateForm(profileData);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
            this.showMessage('Erreur lors du chargement des données du profil', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    /**
     * Récupère les données du profil depuis l'API
     */
    async fetchProfileData() {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthAPI.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Erreur lors de la récupération du profil');
            }
        } catch (error) {
            console.error('Erreur API:', error);
            return null;
        }
    }

    /**
     * Remplit le formulaire avec les données utilisateur
     */
    populateForm(user) {
        // Helper pour récupérer la bonne valeur d'un champ
        function getField(obj, ...keys) {
            for (const key of keys) {
                if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
            }
            return '';
        }
        document.getElementById('firstName').value = getField(user, 'firstName', 'prenom', 'first_name');
        document.getElementById('lastName').value = getField(user, 'lastName', 'nom', 'last_name');
        document.getElementById('email').value = getField(user, 'email');
        document.getElementById('phone').value = getField(user, 'phoneNumber', 'phone', 'phone_number');
        document.getElementById('address').value = getField(user, 'address', 'adresse');
        this.updateUserName();
    }

    /**
     * Met à jour l'affichage du nom d'utilisateur dans la topbar
     */
    updateUserName() {
        const user = AuthAPI.getCurrentUser();
        const userNameElement = document.getElementById('user-name');
        const burgerUserName = document.getElementById('burger-user-name');
        const burgerUserEmail = document.getElementById('burger-user-email');
        const burgerUserAvatar = document.getElementById('burger-user-avatar');
        function getField(obj, ...keys) {
            for (const key of keys) {
                if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
            }
            return '';
        }
        if (user && userNameElement) {
            const displayName = getField(user, 'firstName', 'prenom', 'first_name') || (user.email ? user.email.split('@')[0] : '');
            userNameElement.textContent = displayName;
        }
        if (user) {
            const firstName = getField(user, 'firstName', 'prenom', 'first_name');
            const lastName = getField(user, 'lastName', 'nom', 'last_name');
            if (burgerUserName) {
                const fullName = `${firstName} ${lastName}`.trim() || (user.email ? user.email.split('@')[0] : '');
                burgerUserName.textContent = fullName;
            }
            if (burgerUserEmail) {
                burgerUserEmail.textContent = getField(user, 'email');
            }
            if (burgerUserAvatar) {
                this.updateUserAvatar(burgerUserAvatar, firstName, lastName);
            }
        }
    }

    /**
     * Met à jour l'avatar utilisateur avec les initiales
     */
    updateUserAvatar(avatarElement, firstName, lastName) {
        if (avatarElement) {
            const initials = this.getUserInitials(firstName, lastName);
            avatarElement.innerHTML = initials || '<i class="fas fa-user"></i>';
        }
    }

    /**
     * Génère les initiales d'un utilisateur
     */
    getUserInitials(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return first + last;
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Gestion du formulaire de profil
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileSubmit(profileForm);
            });
        }

        // Gestion du bouton Annuler
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Gestion de la déconnexion
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    /**
     * Gère la soumission du formulaire de profil
     */
    async handleProfileSubmit(form) {
        // Récupérer les données du formulaire
        const formData = this.getFormData(form);
        
        // Validation
        if (!this.validateForm(formData)) {
            return;
        }

        // Afficher un indicateur de chargement
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Sauvegarde en cours...</span>
        `;
        submitButton.classList.add('loading');

        try {
            // Préparer les données à envoyer
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phone,
                address: formData.address
            };

            // Si changement de mot de passe demandé
            if (formData.currentPassword && formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            // Envoyer les données à l'API
            const result = await this.updateProfile(updateData);
            
            if (result.success) {
                this.showMessage('Profil mis à jour avec succès', 'success');
                
                // Mettre à jour les données locales
                this.updateLocalUserData(updateData);
                
                // Réinitialiser les champs de mot de passe
                this.resetPasswordFields();
                
                // Mettre à jour l'affichage du nom
                this.updateUserName();
            } else {
                this.showMessage(result.message || 'Erreur lors de la mise à jour', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showMessage('Erreur de connexion réseau. Vérifiez votre connexion internet.', 'error');
            } else {
                this.showMessage('Une erreur inattendue est survenue', 'error');
            }
        } finally {
            // Restaurer le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalHTML;
            submitButton.classList.remove('loading');
        }
    }

    /**
     * Récupère les données du formulaire
     */
    getFormData(form) {
        return {
            firstName: form.querySelector('#firstName').value.trim(),
            lastName: form.querySelector('#lastName').value.trim(),
            email: form.querySelector('#email').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            address: form.querySelector('#address').value.trim(),
            currentPassword: form.querySelector('#currentPassword').value,
            newPassword: form.querySelector('#newPassword').value,
            confirmPassword: form.querySelector('#confirmPassword').value
        };
    }

    /**
     * Valide les données du formulaire
     */
    validateForm(data) {
        // Validation des champs obligatoires
        if (!data.firstName || !data.lastName) {
            this.showMessage('Le prénom et le nom sont obligatoires', 'error');
            return false;
        }

        // Validation du changement de mot de passe
        if (data.currentPassword || data.newPassword || data.confirmPassword) {
            if (!data.currentPassword) {
                this.showMessage('Le mot de passe actuel est requis pour changer le mot de passe', 'error');
                return false;
            }
            if (!data.newPassword) {
                this.showMessage('Le nouveau mot de passe est requis', 'error');
                return false;
            }
            if (data.newPassword.length < 6) {
                this.showMessage('Le nouveau mot de passe doit contenir au moins 6 caractères', 'error');
                return false;
            }
            if (data.newPassword !== data.confirmPassword) {
                this.showMessage('Les mots de passe ne correspondent pas', 'error');
                return false;
            }
        }

        return true;
    }

    /**
     * Met à jour le profil via l'API
     */
    async updateProfile(updateData) {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${AuthAPI.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();
            
            if (response.ok) {
                return { success: true, data: result };
            } else {
                return { success: false, message: result.message || 'Erreur lors de la mise à jour' };
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Met à jour les données utilisateur locales
     */
    updateLocalUserData(updateData) {
        const user = AuthAPI.getCurrentUser();
        if (user) {
            // Mettre à jour les données locales
            Object.assign(user, updateData);
            sessionStorage.setItem('userData', JSON.stringify(user));
        }
    }

    /**
     * Réinitialise les champs de mot de passe
     */
    resetPasswordFields() {
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    /**
     * Réinitialise le formulaire
     */
    resetForm() {
        this.loadProfileData();
        this.resetPasswordFields();
        this.showMessage('Formulaire réinitialisé', 'info');
    }

    /**
     * Gère la déconnexion
     */
    async handleLogout() {
        try {
            if (window.SecureLogout) {
                await SecureLogout.logout();
            } else {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('./pages/login.html?fallback=true');
            }
        } catch (error) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.replace('./pages/login.html?emergency=true');
        }
    }

    /**
     * Affiche un état de chargement
     */
    showLoadingState(loading) {
        const form = document.getElementById('profileForm');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, button');
            inputs.forEach(input => {
                input.disabled = loading;
            });
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
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }

        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `${icon}<span>${message}</span>`;
        
        // Positionner le message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        // Ajouter le message au DOM
        document.body.appendChild(messageDiv);

        // Supprimer le message après 5 secondes
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

function getUserInitials(user) {
    if (!user) return '?';
    const first = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const last = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return (first + last) || (user.email ? user.email.charAt(0).toUpperCase() : '?');
}

function renderProfile() {
    const container = document.getElementById('profileContainer');
    if (!container) return; // Sécurise l'appel
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        container.innerHTML = `<div style="padding:2rem 0; color:#764ba2; font-size:1.1rem;">Vous n'êtes pas connecté.<br><a href='../index.html' style='color:#667eea;text-decoration:underline;'>Retour à l'accueil</a></div>`;
        return;
    }
    const user = JSON.parse(userData);
    function getField(obj, ...keys) {
        for (const key of keys) {
            if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return '';
    }
    container.innerHTML = `
        <div class="profile-avatar">${getUserInitials(user)}</div>
        <div class="profile-info">
            <h2>${getField(user, 'firstName', 'prenom', 'first_name')} ${getField(user, 'lastName', 'nom', 'last_name')}</h2>
            <div class="profile-role">${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Utilisateur'}</div>
            <div class="profile-email"><i class="ri-mail-line"></i> ${getField(user, 'email')}</div>
            ${getField(user, 'phoneNumber', 'phone', 'phone_number') ? `<div class="profile-phone"><i class="ri-phone-line"></i> ${getField(user, 'phoneNumber', 'phone', 'phone_number')}</div>` : ''}
        </div>
        <div class="profile-actions">
            <button class="edit-btn" onclick="openEditProfileModal()"><i class="ri-user-settings-line"></i> Modifier le profil</button>
            <button class="pwd-btn" onclick="openChangePwdModal()"><i class="ri-lock-password-line"></i> Changer le mot de passe</button>
        </div>
    `;
}

// Placeholders pour les modales (à implémenter ensuite)
function openEditProfileModal() {
    alert('Modale "Modifier le profil" à implémenter.');
}
function openChangePwdModal() {
    alert('Modale "Changer le mot de passe" à implémenter.');
}

document.addEventListener('DOMContentLoaded', function() {
    renderProfile();
    if (window.authStateManager) window.authStateManager.checkAuthState();
}); 