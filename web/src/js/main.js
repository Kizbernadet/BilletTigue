document.addEventListener('DOMContentLoaded', function() {
    // ========== Initialisation du système de redirection ==========
    if (window.LoginRedirectUtils) {
        console.log('✅ Système de redirection initialisé sur toutes les pages');
        // Initialiser les utilitaires de redirection si disponibles
        if (window.initLoginRedirectUtils) {
            window.initLoginRedirectUtils();
        }
    }

    // ========== Gestion de l'état d'authentification ==========
    const loginMenu = document.getElementById('login-menu');
    
    // Éléments du menu burger
    const burgerMenu = document.getElementById('burger-menu');
    const burgerBtn = document.getElementById('burger-btn');
    const burgerDropdown = document.getElementById('burger-dropdown');
    const burgerUserName = document.getElementById('burger-user-name');
    const burgerUserEmail = document.getElementById('burger-user-email');
    const burgerUserAvatar = document.getElementById('burger-user-avatar');
    const burgerLogoutBtn = document.getElementById('burger-logout-btn');

    // Fonction pour générer les initiales d'un utilisateur
    function getUserInitials(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return first + last;
    }

    // Fonction pour mettre à jour l'avatar utilisateur
    function updateUserAvatar(avatarElement, firstName, lastName) {
        if (avatarElement) {
            const initials = getUserInitials(firstName, lastName);
            avatarElement.innerHTML = initials || '<i class="fas fa-user"></i>';
        }
    }

    // Fonction pour vérifier si l'utilisateur est connecté
    function checkAuthState() {
        const token = sessionStorage.getItem('authToken');
        const userData = sessionStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        
        if (token && user) {
            // Utilisateur connecté - cacher le menu de connexion
            if (loginMenu) loginMenu.style.display = 'none';
        } else {
            // Utilisateur non connecté - afficher le menu de connexion
            if (loginMenu) loginMenu.style.display = 'flex';
        }
    }

    // Gestion du bouton burger
    if (burgerBtn) {
        burgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle de la classe active pour ouvrir/fermer le menu
            burgerMenu.classList.toggle('active');
        });
    }

    // Fermer le menu burger en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (burgerMenu && !burgerMenu.contains(e.target)) {
            burgerMenu.classList.remove('active');
        }
    });

    // Gestion de la déconnexion depuis le menu burger
    if (burgerLogoutBtn) {
        burgerLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.SecureLogout) {
                window.SecureLogout.logout();
            } else {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('/?fallback=true');
            }
        });
    }



    // Vérifier l'état d'authentification au chargement
    checkAuthState();

    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            console.log('Tentative de connexion avec:', { email });
        });
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            // Simulation d'envoi du message
            console.log('Message envoyé:', { name, email, message });
            alert('Merci pour votre message ! Nous vous répondrons bientôt.');
            this.reset();
        });
    }

    // Gestion du formulaire de recherche de trajets (page d'accueil)
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm && !window.location.pathname.includes('search-trajets')) {
        bookingForm.addEventListener('submit', function(e) {
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
            
            // Construire l'URL avec les paramètres
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
            window.location.href = searchUrl;
        });
    }

    // Gestion des contrôles du nombre de passagers (page d'accueil)
    const decrementBtn = document.getElementById('decrement-btn');
    const incrementBtn = document.getElementById('increment-btn');
    const passengersInput = document.getElementById('passengers');

    if (decrementBtn && incrementBtn && passengersInput && !window.location.pathname.includes('search-trajets')) {
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

    // Animation smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gestion de l'interrupteur de thème
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        // Appliquer le thème sauvegardé au chargement de la page
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                themeToggle.checked = true;
            }
        }

        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Gestion du sélecteur de langue
    const langOptions = document.getElementById('lang-options');
    const currentLangText = document.getElementById('current-lang-text');

    const setLanguage = (name) => {
        if (currentLangText) {
            currentLangText.textContent = name;
        }
        localStorage.setItem('language', name);

        // Update active class for language options
        if (langOptions) {
            const allOptions = langOptions.querySelectorAll('.lang-option');
            allOptions.forEach(option => {
                if (option.dataset.langName === name) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    };

    // Appliquer la langue sauvegardée au chargement
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }

    if (langOptions) {
        langOptions.addEventListener('click', function(e) {
            e.preventDefault();
            const target = e.target.closest('.lang-option');
            
            if (!target) {
                return;
            }

            const langName = target.dataset.langName;
            
            setLanguage(langName);

            // Ferme le dropdown après sélection
            if (document.activeElement) {
                document.activeElement.blur();
            }
        });
    }

    // --- Logic for Auth Pages ---
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        const authSubtitle = document.querySelector('.auth-subtitle');

        // Logic for Login Page
        if (document.getElementById('loginForm')) {
            if (role === 'transporter') {
                authTitle.textContent = 'Connexion Transporteur';
                if(authSubtitle) authSubtitle.textContent = 'Accédez à votre espace pour gérer vos trajets.';
            } else {
                // Default to user
                authTitle.textContent = 'Connectez-vous';
                if(authSubtitle) authSubtitle.textContent = 'Accédez à votre espace pour gérer vos réservations.';
            }
        }

        // Logic for Register Page
        if (document.getElementById('registerForm')) {
            const roleUserRadio = document.getElementById('role-user');
            const roleTransporterRadio = document.getElementById('role-transporter');
            
            const userFields = document.getElementById('user-fields');
            const transporterFields = document.getElementById('transporter-fields');

            const fullNameInput = document.getElementById('fullname');
            const companyNameInput = document.getElementById('company-name');
            const phoneInput = document.getElementById('phone-number');

            function toggleRegistrationFields() {
                if (!roleTransporterRadio || !roleUserRadio || !userFields || !transporterFields || !fullNameInput || !companyNameInput || !phoneInput) return;

                if (roleTransporterRadio.checked) {
                    userFields.classList.add('hidden');
                    transporterFields.classList.remove('hidden');
                    fullNameInput.required = false;
                    companyNameInput.required = true;
                    phoneInput.required = true;
                } else { // Default to user
                    userFields.classList.remove('hidden');
                    transporterFields.classList.add('hidden');
                    fullNameInput.required = true;
                    companyNameInput.required = false;
                    phoneInput.required = false;
                }
            }

            if(roleUserRadio && roleTransporterRadio){
                roleUserRadio.addEventListener('change', toggleRegistrationFields);
                roleTransporterRadio.addEventListener('change', toggleRegistrationFields);
            }
            
            toggleRegistrationFields(); // Initial call
        }
    }



    // --- Logique pour les pages d'authentification ---

    // 1. Gérer le titre de la page de connexion en fonction du rôle
    const loginTitle = document.querySelector('.auth-title');
    if (loginTitle && window.location.pathname.includes('login.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');

        if (role === 'transporter') {
            loginTitle.innerHTML = `<i class="fas fa-truck-moving"></i> <span>Connexion Transporteur</span>`;
        } else {
            loginTitle.innerHTML = `<i class="fas fa-user"></i> <span>Connexion Utilisateur</span>`;
        }
    }

    // 2. Gérer le formulaire d'inscription dynamique
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const roleInputs = document.querySelectorAll('input[name="role"]');
        const allRoleFields = registerForm.querySelectorAll('[data-role]');

        // Regex patterns pour la validation
        const validationPatterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            phone: /^(\+33|0)[1-9](\d{8})$/,
            name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
            company: /^[a-zA-Z0-9À-ÿ\s'-]{2,100}$/
        };

        // Messages d'erreur
        const errorMessages = {
            email: 'Veuillez entrer une adresse email valide',
            password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
            phone: 'Veuillez entrer un numéro de téléphone français valide',
            name: 'Le nom doit contenir entre 2 et 50 caractères (lettres, espaces, tirets et apostrophes autorisés)',
            company: 'Le nom de la compagnie doit contenir entre 2 et 100 caractères',
            required: 'Ce champ est obligatoire',
            passwordMatch: 'Les mots de passe ne correspondent pas'
        };

        // Fonction pour créer un message d'erreur
        function createErrorMessage(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            return errorDiv;
        }

        // Fonction pour supprimer les messages d'erreur
        function removeErrorMessage(field) {
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }

        // Fonction pour valider un champ
        function validateField(field, pattern, errorMessage) {
            const value = field.value.trim();
            removeErrorMessage(field);

            if (!value) {
                field.parentNode.appendChild(createErrorMessage(errorMessages.required));
                return false;
            }

            if (pattern && !pattern.test(value)) {
                field.parentNode.appendChild(createErrorMessage(errorMessage));
                return false;
            }

            return true;
        }

        // Fonction pour vérifier la force du mot de passe
        function checkPasswordStrength(password) {
            const checks = {
                length: password.length >= 8,
                lowercase: /[a-z]/.test(password),
                uppercase: /[A-Z]/.test(password),
                number: /\d/.test(password),
                special: /[@$!%*?&]/.test(password)
            };

            const strength = Object.values(checks).filter(Boolean).length;
            return { strength, checks };
        }

        // Fonction pour afficher l'indicateur de force du mot de passe
        function showPasswordStrength(password) {
            const strengthIndicator = document.getElementById('password-strength');
            const progressBar = document.getElementById('strength-progress');
            if (!strengthIndicator || !progressBar) return;

            const { strength, checks } = checkPasswordStrength(password);
            const strengthTexts = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
            const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
            const progressWidths = [20, 40, 60, 80, 100];

            // Mettre à jour le texte et la couleur
            strengthIndicator.textContent = strengthTexts[strength - 1] || '';
            strengthIndicator.style.color = strengthColors[strength - 1] || '#6b7280';

            // Animer la barre de progression
            const targetWidth = progressWidths[strength - 1] || 0;
            progressBar.style.width = targetWidth + '%';
            progressBar.style.backgroundColor = strengthColors[strength - 1] || '#6b7280';

            // Mettre à jour les critères avec animations
            updateCriteriaIndicators(checks);
        }

        // Fonction pour mettre à jour les indicateurs de critères
        function updateCriteriaIndicators(checks) {
            const criteriaItems = document.querySelectorAll('.criteria-item');
            
            criteriaItems.forEach(item => {
                const criteria = item.dataset.criteria;
                const icon = item.querySelector('.criteria-icon');
                const isMet = checks[criteria];
                
                if (isMet) {
                    // Animation pour critère satisfait
                    icon.textContent = '✓';
                    icon.style.color = '#22c55e';
                    item.classList.add('valid');
                } else {
                    // Animation pour critère non satisfait
                    icon.textContent = '○';
                    icon.style.color = '#6b7280';
                    item.classList.remove('valid');
                }
            });
        }

        // Fonction pour afficher/masquer la barre de force du mot de passe
        function togglePasswordStrengthBar(show) {
            const strengthBar = document.querySelector('.password-strength-bar');
            if (strengthBar) {
                if (show) {
                    strengthBar.style.display = 'block';
                    strengthBar.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    strengthBar.style.display = 'none';
                }
            }
        }

        // Validation en temps réel
        const emailField = registerForm.querySelector('#email');
        const servicesField = registerForm.querySelector('#services');
        const passwordField = registerForm.querySelector('#password');
        const confirmPasswordField = registerForm.querySelector('#confirm-password');
        const lastNameField = registerForm.querySelector('#last-name');
        const firstNameField = registerForm.querySelector('#first-name');
        const companyField = registerForm.querySelector('#company-name');
        const phoneField = registerForm.querySelector('#phone-number');

        // Validation email
        if (emailField) {
            emailField.addEventListener('blur', () => {
                validateField(emailField, validationPatterns.email, errorMessages.email);
            });
        }

        // Validation services
        if (servicesField) {
            servicesField.addEventListener('blur', () => {
                const value = servicesField.value.trim();
                removeErrorMessage(servicesField);

                if (!value) {
                    servicesField.parentNode.appendChild(createErrorMessage('Veuillez sélectionner un service'));
                    return false;
                }

                if (!['passengers', 'packages'].includes(value)) {
                    servicesField.parentNode.appendChild(createErrorMessage('Veuillez sélectionner un service valide'));
                    return false;
                }

                return true;
            });
        }

        // Validation mot de passe
        if (passwordField) {
            passwordField.addEventListener('focus', () => {
                togglePasswordStrengthBar(true);
            });

            passwordField.addEventListener('input', () => {
                showPasswordStrength(passwordField.value);
                // Mettre à jour la confirmation si le champ de confirmation n'est pas vide
                if (confirmPasswordField && confirmPasswordField.value) {
                    checkPasswordConfirmation();
                }
            });

            passwordField.addEventListener('blur', () => {
                validateField(passwordField, validationPatterns.password, errorMessages.password);
                // Masquer la barre si le champ est vide
                if (!passwordField.value) {
                    togglePasswordStrengthBar(false);
                }
            });
        }

        // Fonction pour vérifier la confirmation du mot de passe
        function checkPasswordConfirmation() {
            const password = passwordField ? passwordField.value : '';
            const confirmPassword = confirmPasswordField ? confirmPasswordField.value : '';
            const confirmationIndicator = document.getElementById('password-confirmation');
            
            if (!confirmationIndicator) return;
            
            if (!confirmPassword) {
                confirmationIndicator.textContent = '';
                confirmationIndicator.style.color = '';
                return;
            }
            
            if (password === confirmPassword) {
                confirmationIndicator.textContent = '✓ Les mots de passe correspondent';
                confirmationIndicator.style.color = '#22c55e';
                confirmationIndicator.style.fontWeight = '500';
            } else {
                confirmationIndicator.textContent = '✗ Les mots de passe ne correspondent pas';
                confirmationIndicator.style.color = '#ef4444';
                confirmationIndicator.style.fontWeight = '500';
            }
        }

        // Validation confirmation mot de passe
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('input', () => {
                checkPasswordConfirmation();
            });

            confirmPasswordField.addEventListener('blur', () => {
                const password = passwordField ? passwordField.value : '';
                const confirmPassword = confirmPasswordField.value;
                removeErrorMessage(confirmPasswordField);

                if (!confirmPassword) {
                    confirmPasswordField.parentNode.appendChild(createErrorMessage(errorMessages.required));
                    return false;
                }

                if (password !== confirmPassword) {
                    confirmPasswordField.parentNode.appendChild(createErrorMessage(errorMessages.passwordMatch));
                    return false;
                }

                return true;
            });
        }

        // Validation nom et prénom
        if (lastNameField) {
            lastNameField.addEventListener('blur', () => {
                validateField(lastNameField, validationPatterns.name, errorMessages.name);
            });
        }

        if (firstNameField) {
            firstNameField.addEventListener('blur', () => {
                validateField(firstNameField, validationPatterns.name, errorMessages.name);
            });
        }

        // Validation champs transporteur
        if (companyField) {
            companyField.addEventListener('blur', () => {
                validateField(companyField, validationPatterns.company, errorMessages.company);
            });
        }

        if (phoneField) {
            phoneField.addEventListener('blur', () => {
                validateField(phoneField, validationPatterns.phone, errorMessages.phone);
            });
        }

        // Fonction pour réinitialiser le formulaire
        function resetForm() {
            // Réinitialiser tous les champs
            registerForm.reset();
            
            // Supprimer tous les messages d'erreur
            registerForm.querySelectorAll('.error-message').forEach(error => error.remove());
            
            // Réinitialiser l'indicateur de force du mot de passe
            const strengthIndicator = document.getElementById('password-strength');
            const progressBar = document.getElementById('strength-progress');
            if (strengthIndicator) strengthIndicator.textContent = '';
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.style.backgroundColor = '#6b7280';
            }
            
            // Réinitialiser l'indicateur de confirmation
            const confirmationIndicator = document.getElementById('password-confirmation');
            if (confirmationIndicator) {
                confirmationIndicator.textContent = '';
                confirmationIndicator.style.color = '';
            }
            
            // Réinitialiser les critères de mot de passe
            const criteriaItems = document.querySelectorAll('.criteria-item');
            criteriaItems.forEach(item => {
                const icon = item.querySelector('.criteria-icon');
                if (icon) {
                    icon.textContent = '○';
                    icon.style.color = '#6b7280';
                }
                item.classList.remove('valid');
            });
            
            // Masquer la barre de force du mot de passe
            togglePasswordStrengthBar(false);
        }

        const updateFormFields = (selectedRole) => {
            // Réinitialiser le formulaire avant de changer les champs
            resetForm();
            
            allRoleFields.forEach(field => {
                const input = field.querySelector('input');
                if (field.dataset.role === selectedRole) {
                    field.classList.remove('hidden');
                    field.classList.add('flex');
                    if(input) input.required = true;
                } else {
                    field.classList.add('hidden');
                    field.classList.remove('flex');
                    if(input) input.required = false;
                }
            });
        };

        roleInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                updateFormFields(e.target.value);
            });
        });

        // Initialiser le formulaire au chargement de la page
        const initiallySelectedRole = document.querySelector('input[name="role"]:checked');
        if (initiallySelectedRole) {
            updateFormFields(initiallySelectedRole.value);
        }

        // Gestion de la soumission du formulaire
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Supprimer tous les messages d'erreur existants
            registerForm.querySelectorAll('.error-message').forEach(error => error.remove());
            
            let isValid = true;
            const selectedRole = document.querySelector('input[name="role"]:checked').value;
            
            // Validation des champs communs
            if (emailField) {
                if (!validateField(emailField, validationPatterns.email, errorMessages.email)) {
                    isValid = false;
                }
            }
            
            if (servicesField) {
                const value = servicesField.value.trim();
                if (!value) {
                    servicesField.parentNode.appendChild(createErrorMessage('Veuillez sélectionner un service'));
                    isValid = false;
                } else if (!['passengers', 'packages'].includes(value)) {
                    servicesField.parentNode.appendChild(createErrorMessage('Veuillez sélectionner un service valide'));
                    isValid = false;
                }
            }
            
            if (passwordField) {
                if (!validateField(passwordField, validationPatterns.password, errorMessages.password)) {
                    isValid = false;
                }
            }
            
            if (confirmPasswordField) {
                const password = passwordField ? passwordField.value : '';
                const confirmPassword = confirmPasswordField.value;
                
                if (!confirmPassword) {
                    confirmPasswordField.parentNode.appendChild(createErrorMessage(errorMessages.required));
                    isValid = false;
                } else if (password !== confirmPassword) {
                    confirmPasswordField.parentNode.appendChild(createErrorMessage(errorMessages.passwordMatch));
                    isValid = false;
                }
            }
            
            // Validation selon le rôle sélectionné
            if (selectedRole === 'user') {
                if (lastNameField && !validateField(lastNameField, validationPatterns.name, errorMessages.name)) {
                    isValid = false;
                }
                if (firstNameField && !validateField(firstNameField, validationPatterns.name, errorMessages.name)) {
                    isValid = false;
                }
            } else if (selectedRole === 'transporter') {
                if (companyField && !validateField(companyField, validationPatterns.company, errorMessages.company)) {
                    isValid = false;
                }
                if (phoneField && !validateField(phoneField, validationPatterns.phone, errorMessages.phone)) {
                    isValid = false;
                }
            }
            
            // Si le formulaire est valide, procéder à l'inscription
            if (isValid) {
                const formData = {
                    role: selectedRole,
                    email: emailField ? emailField.value : '',
                    password: passwordField ? passwordField.value : '',
                    nom: selectedRole === 'user' ? lastNameField.value : undefined,
                    prenom: selectedRole === 'user' ? firstNameField.value : undefined,
                    nom_compagnie: selectedRole === 'transporter' ? companyField.value : undefined,
                    num_tel: selectedRole === 'transporter' ? phoneField.value : undefined,
                    service: servicesField ? servicesField.value : ''
                };

                // Supprimer les clés non définies
                Object.keys(formData).forEach(key => formData[key] === undefined && delete formData[key]);

                // Envoyer les données au backend
                fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        // Si le serveur renvoie une erreur (ex: 400, 409), la lancer
                        throw new Error(data.message || 'Une erreur serveur est survenue.');
                    }
                    return data;
                })
                .then(data => {
                    // Le backend a répondu avec succès
                    console.log('Réponse du serveur:', data);
                    alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
                    registerForm.reset();
                    
                    // Rediriger vers la page de connexion après un court délai
                    setTimeout(() => {
                        window.location.href = './pages/login.html';
                    }, 1000);
                })
                .catch(error => {
                    // Gérer les erreurs (réseau ou celles du serveur)
                    console.error('Erreur lors de l\'inscription:', error);
                    alert(`Erreur d'inscription : ${error.message}`);
                });
            } else {
                // Faire défiler vers la première erreur
                const firstError = registerForm.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }



    // Fonction de nettoyage automatique des anciennes données d'authentification
    function cleanupOldAuthData() {
        const authKeys = [
            'authToken', 'userData', 'user', 'token', 'userToken', 
            'sessionToken', 'refreshToken', 'rememberMe', 'loginData', 
            'authData', 'userProfile', 'currentUser', 'userSession'
        ];
        
        // Supprimer les anciennes données d'authentification de localStorage
        authKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                console.log(`🧹 Suppression ancienne donnée localStorage: ${key}`);
                localStorage.removeItem(key);
            }
        });
        
        // Nettoyer par pattern pour localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
                console.log(`🧹 Suppression ancienne donnée localStorage (pattern): ${key}`);
                localStorage.removeItem(key);
            }
        }
    }

    // Exécuter le nettoyage au chargement
    cleanupOldAuthData();
});