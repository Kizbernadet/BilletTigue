// Search Trajets - Logique de pagination et filtrage

// Importation de l'API des trajets
import trajetsApi from './api/trajetsApi.js';

// Gestion de la pagination
class PaginationManager {
    constructor() {
        this.currentPage = 1;
        this.trajetsPerPage = 3;
        this.allTrajets = []; // Trajets récupérés de l'API
        this.filteredTrajets = []; // Trajets après filtrage
        this.maxPrice = 6000; // Prix maximum pour le filtre
        this.searchParams = {}; // Paramètres de recherche
        this.isLoading = false;
        this.init();
    }

    // Récupérer les paramètres de recherche depuis l'URL
    getSearchParamsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            departure: urlParams.get('departure'),
            arrival: urlParams.get('arrival'),
            date: urlParams.get('date'),
            returnDate: urlParams.get('return-date'),
            passengers: urlParams.get('passengers') || '1'
        };
    }

    // Charger les trajets depuis l'API
    async loadTrajetsFromApi(searchParams = {}) {
        try {
            this.isLoading = true;
            this.showLoadingState();
            
            console.log('🔍 Recherche de trajets avec les paramètres:', searchParams);
            
            // Construire les paramètres pour l'API GET
            // Note: returnDate n'est pas utilisée car c'est optionnel pour la recherche de trajets simples
            const filters = {};
            if (searchParams.departure) filters.departure_city = searchParams.departure;
            if (searchParams.arrival) filters.arrival_city = searchParams.arrival;
            if (searchParams.date) filters.departure_date = searchParams.date;
            if (searchParams.passengers) filters.minPlaces = searchParams.passengers;

            // Appel API via la route GET publique (maintenant corrigée)
            const response = await trajetsApi.getAllTrajets(filters);
            
            if (response.success) {
                this.allTrajets = this.formatTrajetsFromApi(response.data);
                this.filteredTrajets = [...this.allTrajets];
                console.log('✅ Trajets chargés depuis l\'API:', this.allTrajets.length, 'trajets');
            } else {
                console.error('❌ Erreur lors du chargement des trajets:', response.message);
                this.allTrajets = [];
                this.filteredTrajets = [];
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la recherche de trajets:', error);
            this.allTrajets = [];
            this.filteredTrajets = [];
            this.showErrorState(error.message);
        } finally {
            this.isLoading = false;
            this.calculateTotalPages();
            this.renderTrajets();
            this.updatePaginationNumbers();
        }
    }

    // Formater les trajets depuis l'API pour l'affichage
    formatTrajetsFromApi(trajets) {
        return trajets.map(trajet => {
            // Support des deux formats : direct et via search
            const isSearchFormat = trajet.departure_date && trajet.departure_time;
            
            if (isSearchFormat) {
                // Format de la route POST /trajets/search
                return {
                    id: trajet.id,
                    transporteur: trajet.transporteur?.company_name || 'Transporteur',
                    date: new Date(trajet.departure_date).toLocaleDateString('fr-FR'),
                    time: trajet.departure_time,
                    departure: trajet.departure_city,
                    arrival: trajet.arrival_city,
                    departurePoint: trajet.departure_point || 'Point de départ',
                    arrivalPoint: trajet.arrival_point || 'Point d\'arrivée',
                    seats: trajet.available_seats,
                    totalSeats: trajet.total_seats,
                    price: trajet.price,
                    acceptsPackages: trajet.accepts_packages,
                    maxWeight: trajet.max_package_weight || 0,
                    description: trajet.description || '',
                    status: trajet.status || 'active'
                };
            } else {
                // Format de la route GET /trajets (legacy)
                return {
                    id: trajet.id,
                    transporteur: trajet.transporteur?.company_name || 'Transporteur',
                    date: new Date(trajet.departure_time).toLocaleDateString('fr-FR'),
                    time: new Date(trajet.departure_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    departure: trajet.departure_city,
                    arrival: trajet.arrival_city,
                    departurePoint: trajet.departure_point || 'Point de départ',
                    arrivalPoint: trajet.arrival_point || 'Point d\'arrivée',
                    seats: trajet.available_seats,
                    totalSeats: trajet.seats_count,
                    price: trajet.price,
                    acceptsPackages: trajet.accepts_packages,
                    maxWeight: trajet.max_package_weight || 0,
                    description: trajet.description || '',
                    status: trajet.status || 'active'
                };
            }
        });
    }

    // Afficher l'état de chargement
    showLoadingState() {
        const container = document.querySelector('.offers-container');
        const existingCards = container.querySelectorAll('.route-card, .no-results-message, .error-message');
        existingCards.forEach(card => card.remove());
        
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        loadingMessage.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280; font-family: 'Comfortaa', cursive;">
                <div class="loading-spinner" style="margin: 0 auto 1rem; width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Recherche en cours...</h3>
                <p>Nous recherchons les meilleurs trajets pour vous.</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        container.insertBefore(loadingMessage, container.querySelector('.pagination-container'));
    }

    // Afficher l'état d'erreur
    showErrorState(errorMessage) {
        const container = document.querySelector('.offers-container');
        const existingMessages = container.querySelectorAll('.loading-message, .no-results-message, .error-message');
        existingMessages.forEach(message => message.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444; font-family: 'Comfortaa', cursive;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #f87171;"></i>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Erreur de recherche</h3>
                <p style="margin-bottom: 1rem;">${errorMessage}</p>
                <button onclick="window.location.reload()" style="background: #ef4444; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
                    <i class="fas fa-redo"></i> Réessayer
                </button>
            </div>
        `;
                container.insertBefore(errorDiv, container.querySelector('.pagination-container'));
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.filteredTrajets.length / this.trajetsPerPage);
    }

    async init() {
        // Récupérer les paramètres de recherche depuis l'URL
        this.searchParams = this.getSearchParamsFromUrl();
        
        // Charger les trajets depuis l'API
        await this.loadTrajetsFromApi(this.searchParams);
        
        this.setupEventListeners();
        this.setupFilterListeners();
        this.setupModalEventListeners();
    }

    renderTrajets() {
        const start = (this.currentPage - 1) * this.trajetsPerPage;
        const end = start + this.trajetsPerPage;
        const currentTrajets = this.filteredTrajets.slice(start, end);

        const container = document.querySelector('.offers-container');
        const existingCards = container.querySelectorAll('.route-card, .no-results-message, .error-message, .loading-message');
        existingCards.forEach(card => card.remove());

        const title = container.querySelector('.offers-title');
        
        if (currentTrajets.length === 0) {
            // Afficher un message si aucun trajet ne correspond au filtre
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280; font-family: 'Comfortaa', cursive;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #d1d5db;"></i>
                    <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Aucun trajet trouvé</h3>
                    <p>Aucun trajet ne correspond à vos critères de prix. Essayez d'augmenter le prix maximum.</p>
                </div>
            `;
            container.insertBefore(noResultsMessage, container.querySelector('.pagination-container'));
        } else {
            currentTrajets.forEach(trajet => {
                const card = this.createTrajetCard(trajet);
                container.insertBefore(card, container.querySelector('.pagination-container'));
            });
        }
    }

    createTrajetCard(trajet) {
        const card = document.createElement('div');
        card.className = 'route-card';
        card.onclick = () => this.selectRoute(trajet.id);

        card.innerHTML = `
            <div class="card-header">
                <div class="brand-logo">${trajet.transporteur}</div>
                <div class="trip-date">${trajet.date}</div>
            </div>
            
            <div class="route-main">
                <div class="time-location">
                    <div class="time">${trajet.time}</div>
                    <div class="city">${trajet.departure}</div>
                    <div class="location">${trajet.departurePoint}</div>
                </div>
                
                <div class="route-arrow">
                    <div class="arrow-line"></div>
                    <small>direct</small>
                </div>
                
                <div class="time-location" style="text-align: right;">
                    <div class="time">Arrivée estimée</div>
                    <div class="city">${trajet.arrival}</div>
                    <div class="location">${trajet.arrivalPoint}</div>
                </div>
            </div>
            
            <div class="route-info">
                <div class="transport-info">
                    <div class="seats-info">
                        <i class="fas fa-users"></i>
                        <span class="seats-count">${trajet.seats}/${trajet.totalSeats} places</span>
                    </div>
                    <div class="package-info">
                        ${trajet.acceptsPackages 
                            ? '<i class="fas fa-box"></i><span class="package-text">Colis acceptés (max ' + trajet.maxWeight + 'kg)</span>'
                            : '<i class="fas fa-times-circle"></i><span class="package-text">Colis non acceptés</span>'
                        }
                    </div>
                </div>
                <div class="route-actions">
                    <div class="price-display">
                    <span class="price">${trajet.price}</span>
                    <span class="currency">FCFA</span>
                    </div>
                    <div class="action-buttons">
                        <button class="details-btn" onclick="event.stopPropagation(); paginationManager.showTrajetDetails(${trajet.id})" title="Voir les détails">
                            <i class="fas fa-info-circle"></i>
                            <span>Détails</span>
                        </button>
                        <button class="book-btn ${trajet.seats <= 0 ? 'disabled' : ''}" 
                                onclick="event.stopPropagation(); ${trajet.seats > 0 ? `paginationManager.selectRoute(${trajet.id})` : ''}" 
                                title="${trajet.seats <= 0 ? 'Trajet complet' : 'Réserver ce trajet'}"
                                ${trajet.seats <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-${trajet.seats <= 0 ? 'times' : 'ticket-alt'}"></i>
                            <span>${trajet.seats <= 0 ? 'Complet' : 'Réserver'}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    selectRoute(routeId) {
        console.log('Trajet sélectionné:', routeId);
        this.handleDirectBooking(routeId);
    }

    // Gérer la réservation directe depuis les cartes de trajets
    handleDirectBooking(trajetId) {
        // Trouver le trajet dans la liste pour vérifier la disponibilité
        const trajet = this.allTrajets.find(t => t.id == trajetId);
        
        if (trajet && trajet.seats <= 0) {
            alert('Ce trajet est complet.');
            return;
        }

        // Rediriger directement vers la page de réservation (connexion sera demandée à la fin)
        const reservationUrl = `reservation.html?trajet_id=${trajetId}`;
        window.location.href = reservationUrl;
        
        console.log('🎫 Redirection vers la page de réservation depuis la carte:', trajetId);
    }

    // Afficher les détails d'un trajet dans une modale
    async showTrajetDetails(trajetId) {
        console.log('🔍 Ouverture des détails pour le trajet:', trajetId);
        
        // Stocker l'ID pour le bouton réessayer
        this.currentTrajetId = trajetId;
        
        // Ouvrir la modale
        this.openModal();
        
        // Charger les détails
        await this.loadTrajetDetailsForModal(trajetId);
    }

    // Ouvrir la modale
    openModal() {
        const modal = document.getElementById('trajet-modal');
        modal.style.display = 'flex';
        
        // Sauvegarder l'état original du scroll
        this.originalOverflow = document.body.style.overflow;
        this.originalOverflowX = document.body.style.overflowX;
        
        // Empêcher le scroll de la page
        document.body.style.overflow = 'hidden';
        document.body.style.overflowX = 'hidden';
        
        // États initiaux
        document.getElementById('modal-loading').style.display = 'block';
        document.getElementById('modal-error').style.display = 'none';
        document.getElementById('modal-details').style.display = 'none';
    }

    // Fermer la modale
    closeModal() {
        const modal = document.getElementById('trajet-modal');
        modal.style.display = 'none';
        
        // Restaurer l'état original du scroll
        document.body.style.overflow = this.originalOverflow || '';
        document.body.style.overflowX = this.originalOverflowX || '';
        
        // Nettoyer les propriétés sauvegardées
        delete this.originalOverflow;
        delete this.originalOverflowX;
    }

    // Charger les détails d'un trajet pour la modale
    async loadTrajetDetailsForModal(trajetId) {
        try {
            const API_BASE_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_BASE_URL}/trajets/${trajetId}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Erreur HTTP ${response.status}`);
            }

            if (!result.success) {
                throw new Error(result.message || 'Erreur lors du chargement des détails');
            }

            const trajetData = result.data;
            console.log('✅ Détails du trajet chargés pour la modale:', trajetData);

            // Afficher les détails dans la modale
            this.displayTrajetDetailsInModal(trajetData);

        } catch (error) {
            console.error('❌ Erreur lors du chargement des détails:', error);
            this.showModalError(error.message);
        }
    }

    // Afficher les détails dans la modale
    displayTrajetDetailsInModal(trajet) {
        // Masquer le loading et afficher le contenu
        document.getElementById('modal-loading').style.display = 'none';
        document.getElementById('modal-error').style.display = 'none';
        document.getElementById('modal-details').style.display = 'block';

        // Informations de base
        document.getElementById('modal-departure-city').textContent = trajet.departure_city;
        document.getElementById('modal-arrival-city').textContent = trajet.arrival_city;
        
        // Date et heure - Gestion robuste des formats
        let formattedDateTime, formattedTime;
        
        try {
            const departureDate = new Date(trajet.departure_time);
            
            // Vérifier si la date est valide
            if (!isNaN(departureDate.getTime())) {
                formattedDateTime = `${departureDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })} à ${departureDate.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}`;
                
                formattedTime = departureDate.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            } else {
                // Fallback si la date n'est pas valide
                formattedDateTime = trajet.departure_time || 'Date non disponible';
                formattedTime = 'Heure non disponible';
            }
        } catch (error) {
            console.warn('Erreur lors du formatage de la date:', error);
            formattedDateTime = trajet.departure_time || 'Date non disponible';
            formattedTime = 'Heure non disponible';
        }
        
        document.getElementById('modal-datetime').textContent = formattedDateTime;
        document.getElementById('modal-time').textContent = formattedTime;

        // Prix
        document.getElementById('modal-price').textContent = `${trajet.price} FCFA`;

        // Places
        document.getElementById('modal-seats').textContent = 
            `${trajet.available_seats} / ${trajet.seats_count}`;

        // Points de départ et d'arrivée
        document.getElementById('modal-departure-point').textContent = 
            trajet.departure_point || 'Point de départ non spécifié';
        document.getElementById('modal-arrival-point').textContent = 
            trajet.arrival_point || 'Point d\'arrivée non spécifié';

        // Colis
        const packagesInfo = trajet.accepts_packages 
            ? `Oui${trajet.max_package_weight ? ` (max ${trajet.max_package_weight}kg)` : ''}`
            : 'Non';
        document.getElementById('modal-packages').textContent = packagesInfo;

        // Informations transporteur
        const transporteur = trajet.transporteur;
        if (transporteur) {
            document.getElementById('modal-company-name').textContent = 
                transporteur.company_name || 'Transporteur';
            document.getElementById('modal-company-type').textContent = 
                transporteur.company_type || 'Société de transport';
            document.getElementById('modal-company-phone').textContent = 
                transporteur.phone_number || 'Contact non disponible';
        } else {
            document.getElementById('modal-company-name').textContent = 'Transporteur';
            document.getElementById('modal-company-type').textContent = 'Informations non disponibles';
            document.getElementById('modal-company-phone').textContent = 'Contact non disponible';
        }

        // Description (optionnelle)
        if (trajet.description && trajet.description.trim()) {
            document.getElementById('modal-description-section').style.display = 'block';
            document.getElementById('modal-description-text').textContent = trajet.description;
        } else {
            document.getElementById('modal-description-section').style.display = 'none';
        }

        // Gérer le bouton de réservation
        const bookBtn = document.getElementById('modal-book-btn');
        const isAvailable = trajet.available_seats > 0 && trajet.status === 'active';
        
        if (isAvailable) {
            bookBtn.disabled = false;
            bookBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> Réserver ce trajet';
            bookBtn.onclick = () => this.handleModalBooking(trajet);
        } else {
            bookBtn.disabled = true;
            bookBtn.innerHTML = '<i class="fas fa-times"></i> Trajet complet';
            bookBtn.style.background = '#9ca3af';
            bookBtn.style.cursor = 'not-allowed';
        }
    }

    // Afficher une erreur dans la modale
    showModalError(message) {
        document.getElementById('modal-loading').style.display = 'none';
        document.getElementById('modal-details').style.display = 'none';
        document.getElementById('modal-error').style.display = 'block';
        document.getElementById('modal-error-message').textContent = message;
    }

    // Gérer la réservation depuis la modale
    handleModalBooking(trajet) {
        // Vérifier la disponibilité
        if (trajet.available_seats <= 0) {
            alert('Ce trajet est complet.');
            return;
        }

        // Rediriger directement vers la page de réservation (connexion sera demandée à la fin)
        const reservationUrl = `reservation.html?trajet_id=${trajet.id}`;
        window.location.href = reservationUrl;
        
        console.log('🎫 Redirection vers la page de réservation:', trajet.id);
    }

    // Initialiser les événements de la modale
    setupModalEventListeners() {
        // Bouton fermer (X)
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Bouton fermer (Fermer)
        document.getElementById('modal-close-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Bouton réessayer
        document.getElementById('modal-retry').addEventListener('click', () => {
            // Relancer le chargement (nécessite de stocker l'ID du trajet)
            if (this.currentTrajetId) {
                this.loadTrajetDetailsForModal(this.currentTrajetId);
            }
        });

        // Clic sur l'overlay pour fermer
        document.getElementById('trajet-modal').addEventListener('click', (e) => {
            if (e.target.id === 'trajet-modal') {
                this.closeModal();
            }
        });

        // Échappement pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('trajet-modal').style.display === 'flex') {
                this.closeModal();
            }
        });
    }

    updatePaginationNumbers() {
        const paginationText = document.getElementById('pagination-text');
        
        // Mettre à jour le texte d'information
        if (this.totalPages === 0) {
            paginationText.textContent = 'Aucun résultat';
        } else {
            paginationText.textContent = `Page ${this.currentPage}`;
        }

        // Mettre à jour les boutons précédent/suivant
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        
        // Désactiver les boutons si pas de résultats
        if (this.totalPages === 0) {
            prevButton.className = 'pagination-button disabled';
            nextButton.className = 'pagination-button disabled';
        } else {
            prevButton.className = `pagination-button ${this.currentPage === 1 ? 'disabled' : ''}`;
            nextButton.className = `pagination-button ${this.currentPage === this.totalPages ? 'disabled' : ''}`;
        }
    }

    setupEventListeners() {
        // Bouton précédent
        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.totalPages > 0 && this.currentPage > 1) {
                this.goToPage(this.currentPage - 1);
            }
        });

        // Bouton suivant
        document.getElementById('next-page').addEventListener('click', () => {
            if (this.totalPages > 0 && this.currentPage < this.totalPages) {
                this.goToPage(this.currentPage + 1);
            }
        });
    }

    setupFilterListeners() {
        // Slider de prix
        const priceSlider = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        
        priceSlider.addEventListener('input', (e) => {
            priceValue.textContent = e.target.value;
        });

        // Bouton appliquer filtre
        document.getElementById('apply-filter').addEventListener('click', () => {
            const maxPrice = parseInt(priceSlider.value);
            this.applyPriceFilter(maxPrice);
        });

        // Bouton réinitialiser filtre
        document.getElementById('reset-filter').addEventListener('click', () => {
            this.resetFilter();
        });
    }

    applyPriceFilter(maxPrice) {
        this.maxPrice = maxPrice;
        this.filteredTrajets = this.allTrajets.filter(trajet => trajet.price <= maxPrice);
        this.calculateTotalPages();
        this.currentPage = 1; // Retourner à la première page
        this.renderTrajets();
        this.updatePaginationNumbers();
        
        // Scroll vers les résultats
        document.querySelector('.offers-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    resetFilter() {
        this.maxPrice = 6000;
        this.filteredTrajets = [...this.allTrajets];
        this.calculateTotalPages();
        this.currentPage = 1;
        
        // Réinitialiser le slider
        document.getElementById('price-range').value = 6000;
        document.getElementById('price-value').textContent = '6000';
        
        this.renderTrajets();
        this.updatePaginationNumbers();
        
        // Scroll vers les résultats
        document.querySelector('.offers-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    goToPage(page) {
        if (this.totalPages === 0) return; // Pas de navigation si pas de résultats
        
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.renderTrajets();
            this.updatePaginationNumbers();
            
            // Scroll vers le haut des trajets
            document.querySelector('.offers-container').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

// Gestion du formulaire de recherche
class SearchFormManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadSearchParams();
        this.setupPassengerControls();
        this.setupFormSubmission();
    }

    // Charger les paramètres de recherche depuis l'URL
    loadSearchParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Pré-remplir les champs du formulaire avec les paramètres URL
        const departure = urlParams.get('departure');
        const arrival = urlParams.get('arrival');
        const date = urlParams.get('date');
        const returnDate = urlParams.get('return-date');
        const passengers = urlParams.get('passengers');

        if (departure) {
            const departureInput = document.getElementById('departure');
            if (departureInput) departureInput.value = departure;
        }

        if (arrival) {
            const arrivalInput = document.getElementById('arrival');
            if (arrivalInput) arrivalInput.value = arrival;
        }

        if (date) {
            const dateInput = document.getElementById('date');
            if (dateInput) dateInput.value = date;
        }

        if (returnDate) {
            const returnDateInput = document.getElementById('return-date');
            if (returnDateInput) returnDateInput.value = returnDate;
        }

        if (passengers) {
            const passengersInput = document.getElementById('passengers');
            if (passengersInput) passengersInput.value = passengers;
        }

        // Afficher un message si des paramètres ont été chargés
        if (departure || arrival || date) {
            console.log('✅ Paramètres de recherche chargés depuis l\'URL:', {
                departure, arrival, date, returnDate, passengers
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

    setupFormSubmission() {
        // Gestion de la soumission du formulaire de recherche
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
                
                // Mettre à jour l'URL avec les nouveaux paramètres
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
                
                // Mettre à jour l'URL sans recharger la page
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.pushState({}, '', newUrl);
                
                console.log('✅ Nouvelle recherche de trajets:', {
                    departure, arrival, date, returnDate, passengers
                });
                
                // Lancer une nouvelle recherche avec les nouveaux paramètres
                const paginationManager = window.paginationManager;
                if (paginationManager) {
                    paginationManager.searchParams = { departure, arrival, date, returnDate, passengers };
                    await paginationManager.loadTrajetsFromApi(paginationManager.searchParams);
                }
                
                // Scroll vers les résultats
                document.querySelector('.offers-container').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            });
        }
    }
}

// Menu mobile hamburger
class MobileMenuManager {
    constructor() {
        this.hamburger = document.getElementById('mobile-hamburger');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        if (this.hamburger && this.mobileMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
            // Fermer le menu si on clique en dehors
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('is-active');
        if (this.hamburger.classList.contains('is-active')) {
            this.mobileMenu.style.display = 'block';
            setTimeout(() => this.mobileMenu.classList.add('mobile-menu--open'), 10);
            document.body.style.overflow = 'hidden';
        } else {
            this.mobileMenu.classList.remove('mobile-menu--open');
            setTimeout(() => { this.mobileMenu.style.display = 'none'; }, 350);
            document.body.style.overflow = '';
        }
    }
}

// Menu profil
class ProfileMenuManager {
    constructor() {
        this.init();
    }

    init() {
        // Fonction pour le menu profil
        window.toggleProfileMenu = function() {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        };
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les utilitaires de redirection de connexion
    initLoginRedirectUtils();
    
    // Initialiser la pagination
    const paginationManager = new PaginationManager();
    
    // Stocker l'instance globalement pour les onclick dans le HTML
    window.paginationManager = paginationManager;
    
    // Initialiser le gestionnaire de formulaire de recherche
    const searchFormManager = new SearchFormManager();
    
    // Initialiser le menu mobile
    const mobileMenuManager = new MobileMenuManager();
    
    // Initialiser le menu profil
    const profileMenuManager = new ProfileMenuManager();
    
    console.log('✅ Search Trajets - Page initialisée avec succès');
}); 