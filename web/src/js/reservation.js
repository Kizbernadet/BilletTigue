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

        // Remplir les informations du trajet avec vérifications de nullité
        const departureCity = document.getElementById('departure-city');
        const arrivalCity = document.getElementById('arrival-city');
        const departurePoint = document.getElementById('departure-point');
        const arrivalPoint = document.getElementById('arrival-point');
        const departureDateTime = document.getElementById('departure-date-time');
        const arrivalInfo = document.getElementById('arrival-info');
        const transporteurName = document.getElementById('transporteur-name');
        const availableSeats = document.getElementById('available-seats');
        const trajetPrice = document.getElementById('trajet-price');
        
        if (departureCity) departureCity.textContent = trajet.departure_city;
        if (arrivalCity) arrivalCity.textContent = trajet.arrival_city;
        if (departurePoint) departurePoint.textContent = trajet.departure_point || 'Point de départ';
        if (arrivalPoint) arrivalPoint.textContent = trajet.arrival_point || 'Point d\'arrivée';
        if (departureDateTime) departureDateTime.textContent = `${formattedDate} à ${formattedTime}`;
        if (arrivalInfo) arrivalInfo.textContent = 'Arrivée estimée';
        if (transporteurName) transporteurName.textContent = trajet.transporteur?.company_name || 'Transporteur';
        if (availableSeats) availableSeats.textContent = trajet.available_seats || 0;
        if (trajetPrice) trajetPrice.textContent = `${trajet.price || 0} FCFA`;

        // Mettre à jour le statut
        const statusElement = document.getElementById('trajet-status');
        if (statusElement) {
            if (trajet.available_seats > 0) {
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>Disponible</span>';
                statusElement.className = 'trajet-status';
            } else {
                statusElement.innerHTML = '<i class="fas fa-times-circle"></i><span>Complet</span>';
                statusElement.className = 'trajet-status unavailable';
            }
        }

        // Stocker les données pour les calculs
        this.unitPrice = parseInt(trajet.price) || 0;
        this.maxSeats = trajet.available_seats || 0;

        // Mettre à jour le récapitulatif
        this.updateSummary();
        
        // Définir les limites du sélecteur de places
        const seatsInput = document.getElementById('seats-reserved');
        if (seatsInput) {
            seatsInput.max = this.maxSeats;
            
            if (this.maxSeats <= 0) {
                seatsInput.disabled = true;
                const confirmButton = document.getElementById('confirm-reservation');
                if (confirmButton) {
                    confirmButton.disabled = true;
                }
            }
        }
    }

    loadUserInfo() {
        try {
            const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            
            const firstNameInput = document.getElementById('passenger-first-name');
            const lastNameInput = document.getElementById('passenger-last-name');
            const phoneInput = document.getElementById('phone-number');
            
            if (userData.first_name && firstNameInput) {
                firstNameInput.value = userData.first_name;
            }
            if (userData.last_name && lastNameInput) {
                lastNameInput.value = userData.last_name;
            }
            if (userData.phone && phoneInput) {
                phoneInput.value = userData.phone;
            }
        } catch (error) {
            console.log('Impossible de charger les infos utilisateur:', error);
        }
    }

    setupEventListeners() {
        // Contrôles de places
        const decrementSeats = document.getElementById('decrement-seats');
        if (decrementSeats) {
            decrementSeats.addEventListener('click', () => {
                this.adjustSeats(-1);
            });
        }
        
        const incrementSeats = document.getElementById('increment-seats');
        if (incrementSeats) {
            incrementSeats.addEventListener('click', () => {
                this.adjustSeats(1);
            });
        }
        
        const seatsReserved = document.getElementById('seats-reserved');
        if (seatsReserved) {
            seatsReserved.addEventListener('input', () => {
                this.updateSummary();
            });
        }

        // Option remboursable
        const refundableOption = document.getElementById('refundable-option');
        if (refundableOption) {
            refundableOption.addEventListener('change', (e) => {
                this.toggleRefundPolicy(e.target.checked);
                this.updateSummary();
            });
        }

        // Bouton retour
        const backButton = document.querySelector('.btn-back-to-search');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.history.back();
            });
        }

        // Formulaire de réservation
        const reservationForm = document.getElementById('reservation-form');
        if (reservationForm) {
            reservationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReservation();
            });
        }

        // Fermer la modale de succès en cliquant sur l'overlay
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target.id === 'success-modal') {
                    this.closeSuccessModal();
                }
            });
        }

        // Gestionnaires pour la modal d'authentification
        const closeAuthModal = document.getElementById('close-auth-modal');
        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', () => {
                this.closeAuthModal();
            });
        }

        const continueAsGuest = document.getElementById('continue-as-guest');
        if (continueAsGuest) {
            continueAsGuest.addEventListener('click', () => {
                this.continueAsGuest();
            });
        }

        const showLoginForm = document.getElementById('show-login-form');
        if (showLoginForm) {
            showLoginForm.addEventListener('click', () => {
                this.showLoginForm();
            });
        }

        const backToOptions = document.getElementById('back-to-options');
        if (backToOptions) {
            backToOptions.addEventListener('click', () => {
                this.showAuthOptions();
            });
        }

        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target.id === 'auth-modal') {
                    this.closeAuthModal();
                }
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                this.handleLogin(e);
            });
        }

        // Échappement pour fermer les modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const authModal = document.getElementById('auth-modal');
                const successModal = document.getElementById('success-modal');
                
                if (authModal && authModal.style.display === 'flex') {
                    this.closeAuthModal();
                } else if (successModal && successModal.style.display === 'flex') {
                    this.closeSuccessModal();
                }
            }
        });
    }

    adjustSeats(change) {
        const seatsInput = document.getElementById('seats-reserved');
        if (!seatsInput) return;
        
        const currentSeats = parseInt(seatsInput.value) || 1;
        const newSeats = Math.max(1, Math.min(this.maxSeats, currentSeats + change));
        
        seatsInput.value = newSeats;
        this.updateSummary();
        
        // Mettre à jour l'état des boutons
        const decrementButton = document.getElementById('decrement-seats');
        const incrementButton = document.getElementById('increment-seats');
        
        if (decrementButton) decrementButton.disabled = newSeats <= 1;
        if (incrementButton) incrementButton.disabled = newSeats >= this.maxSeats;
    }

    updateSummary() {
        const seatsInput = document.getElementById('seats-reserved');
        const refundableOption = document.getElementById('refundable-option');
        
        if (!seatsInput || !refundableOption) return;
        
        const seats = parseInt(seatsInput.value) || 1;
        const subtotal = this.unitPrice * seats;
        const isRefundable = refundableOption.checked;
        const refundSupplement = isRefundable ? Math.round(subtotal * this.refundSupplementRate) : 0;
        const total = subtotal + refundSupplement;
        
        // Mettre à jour l'affichage avec vérifications de nullité
        const unitPriceElement = document.getElementById('unit-price');
        const seatsCountElement = document.getElementById('seats-count');
        const subtotalPriceElement = document.getElementById('subtotal-price');
        const refundSupplementElement = document.getElementById('refund-supplement');
        const totalPriceElement = document.getElementById('total-price');
        
        if (unitPriceElement) unitPriceElement.textContent = `${this.unitPrice} FCFA`;
        if (seatsCountElement) seatsCountElement.textContent = seats;
        if (subtotalPriceElement) subtotalPriceElement.textContent = `${subtotal} FCFA`;
        if (refundSupplementElement) refundSupplementElement.textContent = `${refundSupplement} FCFA`;
        if (totalPriceElement) totalPriceElement.textContent = `${total} FCFA`;
        
        // Afficher/masquer le supplément remboursable
        const supplementRow = document.getElementById('refund-supplement-row');
        if (supplementRow) {
            supplementRow.style.display = isRefundable ? 'flex' : 'none';
        }
    }

    toggleRefundPolicy(isChecked) {
        const policyDiv = document.getElementById('refund-policy');
        
        if (policyDiv) {
            if (isChecked) {
                policyDiv.style.display = 'block';
                console.log('✅ Option remboursable activée (+15%)');
            } else {
                policyDiv.style.display = 'none';
                console.log('❌ Option remboursable désactivée');
            }
        }
    }

    async submitReservation() {
        if (this.isLoading) return;
        
        // Vérifier la connexion au moment de la soumission
        const token = sessionStorage.getItem('authToken');
        
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
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('userData');
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
        const refundableOption = document.getElementById('refundable-option');
        const seatsInput = document.getElementById('seats-reserved');
        const firstNameInput = document.getElementById('passenger-first-name');
        const lastNameInput = document.getElementById('passenger-last-name');
        const phoneInput = document.getElementById('phone-number');
        const paymentMethodInput = document.querySelector('input[name="payment_method"]:checked');
        
        if (!refundableOption || !seatsInput || !firstNameInput || !lastNameInput || !phoneInput || !paymentMethodInput) {
            throw new Error('Tous les champs requis ne sont pas disponibles');
        }
        
        const isRefundable = refundableOption.checked;
        const seats = parseInt(seatsInput.value);
        const baseAmount = this.unitPrice * seats;
        const refundSupplement = isRefundable ? Math.round(baseAmount * this.refundSupplementRate) : 0;
        
        return {
            trajet_id: parseInt(this.trajetId),
            passenger_first_name: firstNameInput.value.trim(),
            passenger_last_name: lastNameInput.value.trim(),
            phone_number: phoneInput.value.trim(),
            seats_reserved: seats,
            payment_method: paymentMethodInput.value,
            refundable_option: isRefundable,
            refund_supplement_amount: refundSupplement,
            total_amount: baseAmount + refundSupplement
        };
    }

    validateFormData(data) {
        // Validation des champs requis
        if (!data.passenger_first_name) {
            alert('Le prénom est requis');
            const firstNameInput = document.getElementById('passenger-first-name');
            if (firstNameInput) firstNameInput.focus();
            return false;
        }
        
        if (!data.passenger_last_name) {
            alert('Le nom est requis');
            const lastNameInput = document.getElementById('passenger-last-name');
            if (lastNameInput) lastNameInput.focus();
            return false;
        }
        
        if (!data.phone_number) {
            alert('Le numéro de téléphone est requis');
            const phoneInput = document.getElementById('phone-number');
            if (phoneInput) phoneInput.focus();
            return false;
        }
        
        // Validation du téléphone (formats maliens acceptés)
        if (!this.validatePhoneNumber(data.phone_number)) {
            this.showErrorAlert('Format de téléphone invalide. Exemples valides :<br>' +
                '• 65 12 34 56 (Orange Mali)<br>' +
                '• 70 12 34 56 (Malitel)<br>' +
                '• 80 12 34 56 (Telecel)<br>' +
                '• +223 90 12 34 56 (avec indicatif)');
            const phoneInput = document.getElementById('phone-number');
            if (phoneInput) phoneInput.focus();
            return false;
        }
        
        // Validation du nombre de places
        if (data.seats_reserved < 1 || data.seats_reserved > this.maxSeats) {
            alert(`Le nombre de places doit être entre 1 et ${this.maxSeats}`);
            const seatsInput = document.getElementById('seats-reserved');
            if (seatsInput) seatsInput.focus();
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
        const token = sessionStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }
        
        console.log('📤 Envoi des données de réservation:', formData);
        
        const response = await fetch('http://localhost:3000/api/reservations', {
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
        // Affichage du QR code principal de la réservation (premier billet)
        const qrDiv = document.getElementById('reservation-qr-code');
        qrDiv.innerHTML = '';
        // On récupère le QR code du premier billet si disponible
        const tickets = reservationData.tickets || [];
        if (tickets.length > 0 && tickets[0].qrCode) {
            const img = document.createElement('img');
            img.src = tickets[0].qrCode;
            img.alt = 'QR Code réservation';
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 2px 8px rgba(76,175,80,0.13)';
            qrDiv.appendChild(img);
        }
        // Remplir les détails dans la modale avec les vraies données du backend
        const reservationId = reservationData.id || 'N/A';
        const seatsReserved = reservationData.seats_reserved || 1;
        const paymentInfo = fullResponse?.payment_info || {};
        const totalAmount = paymentInfo.amount || (seatsReserved * this.unitPrice);
        const passenger = `${reservationData.passenger_first_name || ''} ${reservationData.passenger_last_name || ''}`.trim();
        const paymentMethod = reservationData.payment_method || paymentInfo.method || 'Espèces';
        document.getElementById('reservation-reference').textContent = reservationId;
        document.getElementById('success-route').textContent = 
            `${this.trajetData.departure_city} → ${this.trajetData.arrival_city}`;
        document.getElementById('success-seats').textContent = seatsReserved;
        document.getElementById('success-total').textContent = `${totalAmount} FCFA`;
        document.getElementById('success-passenger').textContent = passenger;
        document.getElementById('success-payment').textContent = paymentMethod;
        // Afficher la liste des billets QR si plusieurs
        const ticketsListDiv = document.getElementById('success-tickets-list');
        ticketsListDiv.innerHTML = '';
        if (tickets.length > 1) {
            const title = document.createElement('div');
            title.style = 'font-weight:600;color:#4CAF50;margin-bottom:0.5rem;font-size:1rem;';
            title.textContent = 'Billets électroniques :';
            ticketsListDiv.appendChild(title);
            const list = document.createElement('div');
            list.style = 'display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:flex-start;';
            tickets.forEach((ticket, idx) => {
                if(ticket.qrCode) {
                    const ticketDiv = document.createElement('div');
                    ticketDiv.style = 'display:flex;flex-direction:column;align-items:center;gap:0.2rem;background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:0.4rem 0.6rem;min-width:70px;max-width:90px;';
                    const img = document.createElement('img');
                    img.src = ticket.qrCode;
                    img.alt = `QR Billet #${idx+1}`;
                    img.style.width = '55px';
                    img.style.height = '55px';
                    img.style.borderRadius = '5px';
                    img.style.boxShadow = '0 1px 4px rgba(76,175,80,0.10)';
                    ticketDiv.appendChild(img);
                    const ref = document.createElement('div');
                    ref.style = 'font-size:0.8rem;color:#666;word-break:break-all;';
                    ref.textContent = ticket.reference || `Billet #${idx+1}`;
                    ticketDiv.appendChild(ref);
                    list.appendChild(ticketDiv);
                }
            });
            ticketsListDiv.appendChild(list);
        }
        // Adapter le message selon le type d'utilisateur
        const isLoggedIn = sessionStorage.getItem('authToken') !== null;
        const successMessage = document.querySelector('.success-message p');
        if (isLoggedIn) {
            successMessage.textContent = 'Votre réservation a été enregistrée avec succès dans votre compte.';
        } else {
            successMessage.textContent = 'Votre réservation a été créée avec succès. Conservez bien votre référence.';
        }
        // Adapter le bouton d'action selon le type d'utilisateur
        const actionBtn = document.getElementById('dashboard-or-receipt-btn');
        const downloadInvoiceBtn = document.getElementById('download-invoice-btn');
        if (isLoggedIn) {
            actionBtn.onclick = () => window.location.href = 'reservation-history.html';
            actionBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i><span>Mes réservations</span>';
            downloadInvoiceBtn.style.display = 'inline-block';
            downloadInvoiceBtn.onclick = () => this.downloadInvoiceWithAuth(reservationId);
        } else {
            actionBtn.onclick = () => this.downloadGuestReceipt(reservationId);
            actionBtn.innerHTML = '<i class="fas fa-download"></i><span>Télécharger e-facture</span>';
            downloadInvoiceBtn.style.display = 'none';
        }
        // Afficher la modale
        document.getElementById('success-modal').style.display = 'flex';
    }

    // Téléchargement sécurisé de la facture PDF avec le token d'authentification
    downloadInvoiceWithAuth(reservationId) {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            alert('Vous devez être connecté pour télécharger la facture.');
            return;
        }
        fetch(`/api/documents/invoice/${reservationId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if (!res.ok) throw new Error('Erreur lors du téléchargement de la facture.');
            return res.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facture-${reservationId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => {
            alert('Impossible de télécharger la facture : ' + err.message);
        });
    }

    downloadGuestReceipt(reservationId) {
        // Implémentation réelle : ouvrir le PDF dans un nouvel onglet
        if (reservationId && reservationId !== 'N/A') {
            window.open(`/api/documents/invoice/${reservationId}`, '_blank');
        } else {
            alert('Référence de réservation manquante.');
        }
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
        
        const response = await fetch('http://localhost:3000/api/reservations/guest', {
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
        // Utiliser la modale spéciale pour les invités
        this.showGuestModal(reservationData);
        
        // Ajouter des informations spécifiques à l'invité
        console.log('🎫 Réservation invité confirmée:', {
            reference: reservationData.reference,
            qrCode: reservationData.qr_code,
            invoice: reservationData.invoice_url
        });
        
        // Générer le QR code et afficher l'e-facture
        this.generateQRCode(reservationData.reference);
    }

    showGuestModal(reservationData) {
        const reservation = reservationData.reservation || reservationData;
        
        // Remplir les informations de la réservation
        document.getElementById('guest-reference').textContent = reservationData.reference || `BT-${reservation.id.toString().padStart(6, '0')}`;
        document.getElementById('guest-route').textContent = `${reservation.trajet?.departure_city || 'Départ'} → ${reservation.trajet?.arrival_city || 'Arrivée'}`;
        document.getElementById('guest-passenger').textContent = `${reservation.passenger_first_name} ${reservation.passenger_last_name}`;
        document.getElementById('guest-seats').textContent = reservation.seats_reserved;
        document.getElementById('guest-total').textContent = `${reservation.total_amount} FCFA`;
        document.getElementById('guest-status').textContent = 'Confirmé';
        
        // Afficher la modale
        document.getElementById('guest-success-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Ajouter les gestionnaires d'événements pour cette modale
        this.setupGuestModalEvents();
    }

    setupGuestModalEvents() {
        // Fermer la modale en cliquant sur l'overlay
        document.getElementById('guest-success-modal').addEventListener('click', (e) => {
            if (e.target.id === 'guest-success-modal') {
                this.closeGuestModal();
            }
        });

        // Bouton de téléchargement de facture
        document.getElementById('download-receipt-btn').addEventListener('click', () => {
            this.downloadGuestReceipt();
        });

        // Bouton de partage
        document.getElementById('share-reservation-btn').addEventListener('click', () => {
            this.shareReservation();
        });

        // Échappement pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('guest-success-modal').style.display === 'flex') {
                this.closeGuestModal();
            }
        });
    }

    closeGuestModal() {
        document.getElementById('guest-success-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    generateQRCode(reference) {
        console.log('🔲 Génération QR code pour:', reference);
        
        // Créer les données QR code
        const qrData = {
            reference: reference,
            platform: 'BilletTigue',
            type: 'reservation',
            url: `${window.location.origin}/verify/${reference}`,
            timestamp: new Date().toISOString()
        };
        
        console.log('📋 Données QR code:', qrData);
        
        // Générer le QR code en utilisant une API en ligne (pour l'instant)
        // TODO: Implémenter une vraie génération de QR code côté client
        this.displayQRCode(reference, qrData);
    }

    displayQRCode(reference, qrData) {
        const qrDisplay = document.getElementById('qr-code-display');
        
        // Pour l'instant, afficher un placeholder stylisé
        // TODO: Remplacer par une vraie génération de QR code
        qrDisplay.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <div style="font-size: 3rem; color: #4CAF50; margin-bottom: 0.5rem;">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div style="font-size: 0.8rem; color: #666; font-weight: 600; margin-bottom: 0.5rem;">
                    ${reference}
                </div>
                <div style="font-size: 0.7rem; color: #999;">
                    QR Code
                </div>
            </div>
        `;
        
        // Ajouter un effet de scan
        qrDisplay.style.animation = 'qrShine 3s infinite';
    }

    downloadGuestReceipt() {
        console.log('📄 Téléchargement de la facture invité...');
        
        // TODO: Implémenter la génération et téléchargement de facture PDF
        // Pour l'instant, afficher un message
        this.showErrorAlert('Fonctionnalité de téléchargement de facture en cours de développement');
    }

    shareReservation() {
        console.log('📤 Partage de la réservation...');
        
        // Récupérer les données de réservation
        const reference = document.getElementById('guest-reference').textContent;
        const route = document.getElementById('guest-route').textContent;
        const passenger = document.getElementById('guest-passenger').textContent;
        
        // Créer le texte de partage
        const shareText = `J'ai réservé mon trajet sur BilletTigue !\n\n` +
                         `🚌 ${route}\n` +
                         `👤 ${passenger}\n` +
                         `🎫 Référence: ${reference}\n\n` +
                         `Réservez vos trajets sur ${window.location.origin}`;
        
        // Utiliser l'API Web Share si disponible
        if (navigator.share) {
            navigator.share({
                title: 'Ma réservation BilletTigue',
                text: shareText,
                url: window.location.origin
            }).catch(err => {
                console.log('Erreur de partage:', err);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(shareText) {
        // Fallback : copier dans le presse-papiers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showErrorAlert('Informations de réservation copiées dans le presse-papiers !');
            }).catch(() => {
                this.showErrorAlert('Impossible de copier dans le presse-papiers');
            });
        } else {
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showErrorAlert('Informations de réservation copiées dans le presse-papiers !');
            } catch (err) {
                this.showErrorAlert('Impossible de copier dans le presse-papiers');
            }
            document.body.removeChild(textArea);
        }
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
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Connexion réussie - sauvegarder les données
                sessionStorage.setItem('authToken', result.data.token);
                sessionStorage.setItem('userData', JSON.stringify(result.data.user));
                
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
        // Mettre à jour le menu profil avec les nouvelles données utilisateur
        const profileMenuManager = new ProfileMenuManager();
        profileMenuManager.checkAuthAndSetupMenu();
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
        if (!this.mobileMenu || !this.hamburger) return;
        
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

// Profile Menu Manager
class ProfileMenuManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthAndSetupMenu();
        this.setupProfileMenuEvents();
    }

    checkAuthAndSetupMenu() {
        const token = sessionStorage.getItem('authToken');
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        
        const loginMenu = document.getElementById('login-menu');
        const profileMenu = document.getElementById('profile-menu');
        
        if (token && userData.first_name) {
            // Utilisateur connecté - afficher le menu profil
            if (loginMenu) loginMenu.style.display = 'none';
            if (profileMenu) {
                profileMenu.style.display = 'flex';
                this.updateProfileInfo(userData);
            }
        } else {
            // Utilisateur non connecté - afficher le menu de connexion
            if (loginMenu) loginMenu.style.display = 'flex';
            if (profileMenu) profileMenu.style.display = 'none';
        }
    }

    updateProfileInfo(userData) {
        const profileName = document.getElementById('profile-name');
        const profileFullName = document.getElementById('profile-full-name');
        const profileRole = document.getElementById('profile-role');
        
        if (profileName) {
            profileName.textContent = userData.first_name;
        }
        
        if (profileFullName) {
            profileFullName.textContent = `${userData.first_name} ${userData.last_name}`;
        }
        
        if (profileRole) {
            profileRole.textContent = userData.role || 'Utilisateur';
        }
    }

    setupProfileMenuEvents() {
        // Fermer le menu quand on clique ailleurs
        document.addEventListener('click', (event) => {
            const profileBtn = document.getElementById('profileBtn');
            const dropdown = document.getElementById('profileDropdown');
            
            if (profileBtn && dropdown && !profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });

        // Échappement pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }
        });
    }
}

// Fonction globale pour toggle le menu profil
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Fonction globale pour la déconnexion
function logout() {
    if (window.SecureLogout) {
        window.SecureLogout.logout();
    } else {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('../index.html?fallback=true');
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