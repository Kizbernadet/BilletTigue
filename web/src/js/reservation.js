/**
 * Gestion de la page de réservation
 */

// Import des APIs nécessaires
import trajetsApi from './api/trajetsApi.js';

class ReservationManager {
    constructor() {
        this.trajetId = null;
        this.trajetData = null;
        this.unitPrice = 0;
        this.maxSeats = 0;
        this.isLoading = false;
        this.pendingFormData = null;
        this.refundSupplementRate = 0.15; // 15% de supplément
        
        this.init();
    }

    async init() {
        // Récupérer l'ID du trajet depuis l'URL
        this.trajetId = this.getTrajetIdFromUrl();
        
        if (!this.trajetId) {
            this.showError('Aucun trajet spécifié');
            return;
        }

        // Charger les détails du trajet
        await this.loadTrajetDetails();
        
        // Initialiser les événements
        this.setupEventListeners();
        
        // Charger les informations utilisateur
        this.loadUserInfo();
    }

    getTrajetIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('trajet_id');
    }

    async loadTrajetDetails() {
        try {
            this.showLoading();
            
            console.log('🔍 Chargement des détails du trajet:', this.trajetId);
            
            // Appel API pour récupérer les détails du trajet
            const response = await trajetsApi.getTrajetById(this.trajetId);
            
            if (response.success && response.data) {
                this.trajetData = response.data;
                this.displayTrajetDetails();
                this.showReservationContent();
                console.log('✅ Détails du trajet chargés:', this.trajetData);
            } else {
                throw new Error(response.message || 'Trajet introuvable');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement du trajet:', error);
            this.showError(error.message || 'Erreur lors du chargement du trajet');
        }
    }

    displayTrajetDetails() {
        const trajet = this.trajetData;
        
        // Formatter la date et l'heure
        const departureDate = new Date(trajet.departure_time || trajet.departure_date);
        const formattedDate = departureDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = departureDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Remplir les informations du trajet
        document.getElementById('departure-city').textContent = trajet.departure_city;
        document.getElementById('arrival-city').textContent = trajet.arrival_city;
        document.getElementById('departure-point').textContent = trajet.departure_point || 'Point de départ';
        document.getElementById('arrival-point').textContent = trajet.arrival_point || 'Point d\'arrivée';
        document.getElementById('departure-date-time').textContent = `${formattedDate} à ${formattedTime}`;
        document.getElementById('arrival-info').textContent = 'Arrivée estimée';
        document.getElementById('transporteur-name').textContent = trajet.transporteur?.company_name || 'Transporteur';
        document.getElementById('available-seats').textContent = trajet.available_seats || 0;
        document.getElementById('trajet-price').textContent = `${trajet.price || 0} FCFA`;

        // Mettre à jour le statut
        const statusElement = document.getElementById('trajet-status');
        if (trajet.available_seats > 0) {
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>Disponible</span>';
            statusElement.className = 'trajet-status';
        } else {
            statusElement.innerHTML = '<i class="fas fa-times-circle"></i><span>Complet</span>';
            statusElement.className = 'trajet-status unavailable';
        }

        // Stocker les données pour les calculs
        this.unitPrice = parseInt(trajet.price) || 0;
        this.maxSeats = trajet.available_seats || 0;

        // Mettre à jour le récapitulatif
        this.updateSummary();
        
        // Définir les limites du sélecteur de places
        const seatsInput = document.getElementById('seats-reserved');
        seatsInput.max = this.maxSeats;
        
        if (this.maxSeats <= 0) {
            seatsInput.disabled = true;
            document.getElementById('confirm-reservation').disabled = true;
        }
    }

    loadUserInfo() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            if (userData.first_name) {
                document.getElementById('passenger-first-name').value = userData.first_name;
            }
            if (userData.last_name) {
                document.getElementById('passenger-last-name').value = userData.last_name;
            }
            if (userData.phone) {
                document.getElementById('phone-number').value = userData.phone;
            }
        } catch (error) {
            console.log('Impossible de charger les infos utilisateur:', error);
        }
    }

    setupEventListeners() {
        // Contrôles de places
        document.getElementById('decrement-seats').addEventListener('click', () => {
            this.adjustSeats(-1);
        });
        
        document.getElementById('increment-seats').addEventListener('click', () => {
            this.adjustSeats(1);
        });
        
        document.getElementById('seats-reserved').addEventListener('input', () => {
            this.updateSummary();
        });

        // Option remboursable
        document.getElementById('refundable-option').addEventListener('change', (e) => {
            this.toggleRefundPolicy(e.target.checked);
            this.updateSummary();
        });

        // Bouton retour
        document.querySelector('.btn-back-to-search').addEventListener('click', () => {
            window.history.back();
        });

        // Formulaire de réservation
        document.getElementById('reservation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReservation();
        });

        // Fermer la modale de succès en cliquant sur l'overlay
        document.getElementById('success-modal').addEventListener('click', (e) => {
            if (e.target.id === 'success-modal') {
                this.closeSuccessModal();
            }
        });

        // Gestionnaires pour la modal d'authentification
        document.getElementById('close-auth-modal').addEventListener('click', () => {
            this.closeAuthModal();
        });

        document.getElementById('continue-as-guest').addEventListener('click', () => {
            this.continueAsGuest();
        });

        document.getElementById('show-login-form').addEventListener('click', () => {
            this.showLoginForm();
        });

        document.getElementById('back-to-options').addEventListener('click', () => {
            this.showAuthOptions();
        });

        document.getElementById('auth-modal').addEventListener('click', (e) => {
            if (e.target.id === 'auth-modal') {
                this.closeAuthModal();
            }
        });

        document.getElementById('login-form').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        // Échappement pour fermer les modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('auth-modal').style.display === 'flex') {
                    this.closeAuthModal();
                } else if (document.getElementById('success-modal').style.display === 'flex') {
                    this.closeSuccessModal();
                }
            }
        });
    }

    adjustSeats(change) {
        const seatsInput = document.getElementById('seats-reserved');
        const currentSeats = parseInt(seatsInput.value) || 1;
        const newSeats = Math.max(1, Math.min(this.maxSeats, currentSeats + change));
        
        seatsInput.value = newSeats;
        this.updateSummary();
        
        // Mettre à jour l'état des boutons
        document.getElementById('decrement-seats').disabled = newSeats <= 1;
        document.getElementById('increment-seats').disabled = newSeats >= this.maxSeats;
    }

    updateSummary() {
        const seats = parseInt(document.getElementById('seats-reserved').value) || 1;
        const subtotal = this.unitPrice * seats;
        const isRefundable = document.getElementById('refundable-option').checked;
        const refundSupplement = isRefundable ? Math.round(subtotal * this.refundSupplementRate) : 0;
        const total = subtotal + refundSupplement;
        
        // Mettre à jour l'affichage
        document.getElementById('unit-price').textContent = `${this.unitPrice} FCFA`;
        document.getElementById('seats-count').textContent = seats;
        document.getElementById('subtotal-price').textContent = `${subtotal} FCFA`;
        document.getElementById('refund-supplement').textContent = `${refundSupplement} FCFA`;
        document.getElementById('total-price').textContent = `${total} FCFA`;
        
        // Afficher/masquer le supplément remboursable
        const supplementRow = document.getElementById('refund-supplement-row');
        if (isRefundable) {
            supplementRow.style.display = 'flex';
        } else {
            supplementRow.style.display = 'none';
        }
    }

    toggleRefundPolicy(isChecked) {
        const policyDiv = document.getElementById('refund-policy');
        
        if (isChecked) {
            policyDiv.style.display = 'block';
            console.log('✅ Option remboursable activée (+15%)');
        } else {
            policyDiv.style.display = 'none';
            console.log('❌ Option remboursable désactivée');
        }
    }

    async submitReservation() {
        if (this.isLoading) return;
        
        // Vérifier la connexion au moment de la soumission
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Pas connecté - proposer les options
            this.pendingFormData = this.getFormData();
            
            // Validation des données avant d'ouvrir la modal
            if (!this.validateFormData(this.pendingFormData)) {
                return;
            }
            
            this.showAuthModal();
            return;
        }
        
        // Utilisateur connecté - procéder à la réservation
        await this.processReservation();
    }

    async processReservation(formData = null) {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showSubmitLoading();
            
            // Utiliser les données fournies ou récupérer du formulaire
            const reservationData = formData || this.getFormData();
            
            // Validation
            if (!this.validateFormData(reservationData)) {
                this.isLoading = false;
                this.hideSubmitLoading();
                return;
            }
            
            console.log('📝 Soumission de la réservation:', reservationData);
            
            // Appel API pour créer la réservation
            const response = await this.createReservation(reservationData);
            
            if (response.success) {
                console.log('✅ Réservation créée avec succès:', response.data);
                // Les données de réservation sont dans response.data.reservation
                const reservationInfo = response.data.reservation || response.data;
                this.showSuccessModal(reservationInfo, response.data);
            } else {
                throw new Error(response.message || 'Erreur lors de la création de la réservation');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la réservation:', error);
            
            // Gestion d'erreurs avec messages plus user-friendly
            let errorMessage = error.message;
            
            if (error.message.includes('Session expirée')) {
                errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
                // Supprimer le token invalide
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            } else if (error.message.includes('Plus assez de places')) {
                errorMessage = 'Plus assez de places disponibles. Veuillez réduire le nombre de places ou choisir un autre trajet.';
            } else if (error.message.includes('déjà réservé')) {
                errorMessage = 'Vous avez déjà une réservation active pour ce trajet.';
            }
            
            // Afficher l'erreur de manière plus élégante
            this.showErrorAlert(errorMessage);
        } finally {
            this.isLoading = false;
            this.hideSubmitLoading();
        }
    }

    getFormData() {
        const isRefundable = document.getElementById('refundable-option').checked;
        const seats = parseInt(document.getElementById('seats-reserved').value);
        const baseAmount = this.unitPrice * seats;
        const refundSupplement = isRefundable ? Math.round(baseAmount * this.refundSupplementRate) : 0;
        
        return {
            trajet_id: parseInt(this.trajetId),
            passenger_first_name: document.getElementById('passenger-first-name').value.trim(),
            passenger_last_name: document.getElementById('passenger-last-name').value.trim(),
            phone_number: document.getElementById('phone-number').value.trim(),
            seats_reserved: seats,
            payment_method: document.querySelector('input[name="payment_method"]:checked').value,
            refundable_option: isRefundable,
            refund_supplement_amount: refundSupplement,
            total_amount: baseAmount + refundSupplement
        };
    }

    validateFormData(data) {
        // Validation des champs requis
        if (!data.passenger_first_name) {
            alert('Le prénom est requis');
            document.getElementById('passenger-first-name').focus();
            return false;
        }
        
        if (!data.passenger_last_name) {
            alert('Le nom est requis');
            document.getElementById('passenger-last-name').focus();
            return false;
        }
        
        if (!data.phone_number) {
            alert('Le numéro de téléphone est requis');
            document.getElementById('phone-number').focus();
            return false;
        }
        
        // Validation du téléphone (formats maliens acceptés)
        if (!this.validatePhoneNumber(data.phone_number)) {
            this.showErrorAlert('Format de téléphone invalide. Exemples valides :<br>' +
                '• 65 12 34 56 (Orange Mali)<br>' +
                '• 70 12 34 56 (Malitel)<br>' +
                '• 80 12 34 56 (Telecel)<br>' +
                '• +223 90 12 34 56 (avec indicatif)');
            document.getElementById('phone-number').focus();
            return false;
        }
        
        // Validation du nombre de places
        if (data.seats_reserved < 1 || data.seats_reserved > this.maxSeats) {
            alert(`Le nombre de places doit être entre 1 et ${this.maxSeats}`);
            document.getElementById('seats-reserved').focus();
            return false;
        }
        
        return true;
    }

    validatePhoneNumber(phoneNumber) {
        // Nettoyer le numéro (enlever espaces, tirets, parenthèses)
        const cleanPhone = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
        
        // Formats acceptés pour le Mali :
        // 1. Numéros locaux : 65XXXXXX, 70XXXXXX, 80XXXXXX, 90XXXXXX (8 chiffres total)
        // 2. Avec indicatif : +22365XXXXXX, +22370XXXXXX, etc.
        // Préfixes valides : 65-69 (Orange), 70-79 (Malitel), 80-89 (Telecel), 90-99 (Sotelma)
        
        const malianRegex = /^(\+223)?[6-9]\d{7}$/;
        
        // Tester la regex
        const isValid = malianRegex.test(cleanPhone);
        
        if (isValid) {
            console.log('📞 Numéro malien valide:', cleanPhone);
            return true;
        }
        
        console.log('❌ Numéro malien invalide:', cleanPhone);
        return false;
    }

    async createReservation(formData) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }
        
        console.log('📤 Envoi des données de réservation:', formData);
        
        const response = await fetch('http://localhost:5000/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        console.log('📥 Réponse du serveur:', data);
        
        if (!response.ok) {
            // Gestion d'erreurs spécifiques
            if (response.status === 401) {
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            } else if (response.status === 404) {
                throw new Error('Trajet introuvable ou non disponible.');
            } else if (response.status === 400) {
                throw new Error(data.message || 'Données de réservation invalides.');
            } else {
                throw new Error(data.message || `Erreur serveur (${response.status})`);
            }
        }
        
        return data;
    }

    showSuccessModal(reservationData, fullResponse = null) {
        // Remplir les détails dans la modale avec les vraies données du backend
        const reservationId = reservationData.id || 'N/A';
        const seatsReserved = reservationData.seats_reserved || 1;
        const paymentInfo = fullResponse?.payment_info || {};
        const totalAmount = paymentInfo.amount || (seatsReserved * this.unitPrice);
        
        document.getElementById('reservation-reference').textContent = reservationId;
        document.getElementById('success-route').textContent = 
            `${this.trajetData.departure_city} → ${this.trajetData.arrival_city}`;
        document.getElementById('success-seats').textContent = seatsReserved;
        document.getElementById('success-total').textContent = `${totalAmount} FCFA`;
        
        // Adapter le message selon le type d'utilisateur
        const isLoggedIn = localStorage.getItem('token') !== null;
        const successMessage = document.querySelector('.success-message p');
        
        if (isLoggedIn) {
            successMessage.textContent = 'Votre réservation a été enregistrée avec succès dans votre compte.';
            console.log('✅ Réservation liée au compte utilisateur');
        } else {
            successMessage.textContent = 'Votre réservation a été créée avec succès. Conservez bien votre référence.';
            console.log('✅ Réservation invité créée');
        }
        
        // Log des informations pour debug
        console.log('📋 Informations de réservation:', {
            id: reservationId,
            seats: seatsReserved,
            total: totalAmount,
            type: isLoggedIn ? 'Compte utilisateur' : 'Invité',
            nextStep: fullResponse?.next_step,
            paymentInfo: paymentInfo
        });
        
        // Adapter le bouton d'action selon le type d'utilisateur
        const actionBtn = document.getElementById('dashboard-or-receipt-btn');
        if (isLoggedIn) {
            actionBtn.onclick = () => window.location.href = 'user-dashboard.html';
            actionBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i><span>Mes réservations</span>';
        } else {
            actionBtn.onclick = () => this.downloadGuestReceipt(reservationId);
            actionBtn.innerHTML = '<i class="fas fa-download"></i><span>Télécharger e-facture</span>';
        }
        
        // Afficher la modale
        document.getElementById('success-modal').style.display = 'flex';
    }

    downloadGuestReceipt(reservationId) {
        // TODO: Implémenter le téléchargement de l'e-facture
        console.log('📄 Téléchargement e-facture pour réservation:', reservationId);
        
        // Simuler le téléchargement
        alert('Fonctionnalité de téléchargement e-facture en cours d\'implémentation.\n\n' + 
              'Votre référence: ' + reservationId + '\n' +
              'Conservez bien cette référence pour vos trajets.');
    }

    closeSuccessModal() {
        document.getElementById('success-modal').style.display = 'none';
    }

    // Gestion de la modal d'authentification
    showAuthModal() {
        document.getElementById('auth-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Réinitialiser l'affichage - montrer les options
        this.showAuthOptions();
    }

    closeAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Nettoyer les données en attente si annulation
        this.pendingFormData = null;
        
        // Réinitialiser l'affichage pour la prochaine fois
        this.showAuthOptions();
    }

    showAuthOptions() {
        document.querySelector('.reservation-options').style.display = 'flex';
        document.getElementById('login-form-container').style.display = 'none';
    }

    showLoginForm() {
        document.querySelector('.reservation-options').style.display = 'none';
        document.getElementById('login-form-container').style.display = 'block';
        
        // Focus sur le champ email
        setTimeout(() => {
            document.getElementById('login-email').focus();
        }, 300);
    }

    async continueAsGuest() {
        // Fermer la modal d'authentification
        this.closeAuthModal();
        
        console.log('🎫 Achat en tant qu\'invité...');
        
        // Procéder à la réservation sans authentification
        await this.processGuestReservation(this.pendingFormData);
    }

    async processGuestReservation(formData) {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showSubmitLoading();
            
            console.log('📝 Réservation invité:', formData);
            
            // Appel API pour créer une réservation invité
            const response = await this.createGuestReservation(formData);
            
            if (response.success) {
                console.log('✅ Réservation invité créée avec succès:', response.data);
                // Afficher la modal de succès avec E-facture et QR code
                this.showGuestSuccessModal(response.data);
            } else {
                throw new Error(response.message || 'Erreur lors de la création de la réservation');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la réservation invité:', error);
            this.showErrorAlert('Erreur lors de la réservation: ' + error.message);
        } finally {
            this.isLoading = false;
            this.hideSubmitLoading();
        }
    }

    async createGuestReservation(formData) {
        console.log('📤 Envoi réservation invité:', formData);
        
        const response = await fetch('http://localhost:5000/api/reservations/guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        console.log('📥 Réponse serveur invité:', data);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Service de réservation invité non disponible.');
            } else if (response.status === 400) {
                throw new Error(data.message || 'Données de réservation invalides.');
            } else {
                throw new Error(data.message || `Erreur serveur (${response.status})`);
            }
        }
        
        return data;
    }

    showGuestSuccessModal(reservationData) {
        // Pour l'instant, utiliser la même modal de succès
        // TODO: Créer une modal spéciale avec QR code et e-facture
        this.showSuccessModal(reservationData.reservation || reservationData, reservationData);
        
        // Ajouter des informations spécifiques à l'invité
        console.log('🎫 Réservation invité confirmée:', {
            reference: reservationData.reference,
            qrCode: reservationData.qr_code,
            invoice: reservationData.invoice_url
        });
        
        // TODO: Générer le QR code et afficher l'e-facture
        this.generateQRCode(reservationData.reference);
    }

    generateQRCode(reference) {
        // TODO: Implémenter la génération du QR code
        console.log('🔲 Génération QR code pour:', reference);
        
        // Simuler les données QR code
        const qrData = {
            reference: reference,
            platform: 'BilletTigue',
            type: 'reservation',
            url: `${window.location.origin}/verify/${reference}`
        };
        
        console.log('📋 Données QR code:', qrData);
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        try {
            // Afficher loading sur le bouton de connexion
            const submitBtn = document.getElementById('login-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connexion...</span>';
            
            console.log('🔐 Tentative de connexion pour la réservation');
            
            // Appel API de connexion
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Connexion réussie - sauvegarder les données
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('userData', JSON.stringify(result.data.user));
                
                console.log('✅ Connexion réussie, soumission de la réservation...');
                
                // Fermer la modal
                this.closeAuthModal();
                
                // Mettre à jour le menu utilisateur
                this.updateUserMenu(result.data.user);
                
                // Soumettre automatiquement la réservation avec les données en attente
                if (this.pendingFormData) {
                    console.log('🔄 Traitement de la réservation avec compte utilisateur...');
                    await this.processReservation(this.pendingFormData);
                    this.pendingFormData = null;
                }
                
            } else {
                throw new Error(result.message || 'Erreur de connexion');
            }
            
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            alert('Erreur de connexion: ' + error.message);
        } finally {
            // Restaurer le bouton
            const submitBtn = document.getElementById('login-submit');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Se connecter</span>';
        }
    }

    updateUserMenu(userData) {
        const userMenu = document.getElementById('user-menu');
        if (userMenu && userData.first_name) {
            userMenu.style.display = 'flex';
            document.getElementById('user-name').textContent = userData.first_name;
        }
    }

    showSubmitLoading() {
        const button = document.getElementById('confirm-reservation');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Traitement en cours...</span>';
    }

    hideSubmitLoading() {
        const button = document.getElementById('confirm-reservation');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i><span>Confirmer la réservation</span>';
    }

    showLoading() {
        document.getElementById('loading-section').style.display = 'flex';
        document.getElementById('error-section').style.display = 'none';
        document.getElementById('reservation-content').style.display = 'none';
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('error-section').style.display = 'flex';
        document.getElementById('reservation-content').style.display = 'none';
    }

    showReservationContent() {
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('error-section').style.display = 'none';
        document.getElementById('reservation-content').style.display = 'block';
    }

    showErrorAlert(message) {
        // Créer une alerte personnalisée plus élégante que alert()
        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-alert error-alert';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-suppression après 10 secondes (plus long pour lire les exemples)
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 10000);
    }
}

// Mobile Menu Manager (réutilisé)
class MobileMenuManager {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.hamburger = document.getElementById('mobile-hamburger');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    toggleMobileMenu() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.mobileMenu.style.display = 'block';
            this.hamburger.classList.add('active');
        } else {
            this.mobileMenu.style.display = 'none';
            this.hamburger.classList.remove('active');
        }
    }
}

// Profile Menu Manager (réutilisé)
class ProfileMenuManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthAndSetupMenu();
    }

    checkAuthAndSetupMenu() {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const userMenu = document.getElementById('user-menu');
        
        if (token && userData.first_name) {
            // Utilisateur connecté - afficher le menu utilisateur
            userMenu.style.display = 'flex';
            document.getElementById('user-name').textContent = userData.first_name;
        } else {
            // Utilisateur non connecté - masquer le menu (connexion sera demandée à la confirmation)
            userMenu.style.display = 'none';
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les utilitaires de redirection de connexion
    initLoginRedirectUtils();
    
    new ReservationManager();
    new MobileMenuManager();
    new ProfileMenuManager();
});

// Export pour utilisation externe si nécessaire
export default ReservationManager; 