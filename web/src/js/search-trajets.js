// Search Trajets - Logique de pagination et filtrage

// Gestion de la pagination
class PaginationManager {
    constructor() {
        this.currentPage = 1;
        this.trajetsPerPage = 3;
        this.allTrajets = this.generateTrajets(); // Générer tous les trajets
        this.filteredTrajets = [...this.allTrajets]; // Trajets après filtrage
        this.maxPrice = 6000; // Prix maximum pour le filtre
        this.calculateTotalPages();
        this.init();
    }

    generateTrajets() {
        const transporteurs = ['Transport Mouride', 'Dakar Dem Dikk', 'Trans Kaolack Express', 'Ndèye Express', 'Car Rapide Deluxe', 'Tata Express'];
        const routes = [
            { departure: 'Dakar', arrival: 'Thiès', departurePoint: 'Gare Routière', arrivalPoint: 'Gare Centrale' },
            { departure: 'Dakar', arrival: 'Saint-Louis', departurePoint: 'Terminus Liberté 6', arrivalPoint: 'Gare Routière' },
            { departure: 'Kaolack', arrival: 'Dakar', departurePoint: 'Marché Central', arrivalPoint: 'Gare Routière' },
            { departure: 'Thiès', arrival: 'Mbour', departurePoint: 'Gare Routière', arrivalPoint: 'Terminal' },
            { departure: 'Ziguinchor', arrival: 'Dakar', departurePoint: 'Gare Sud', arrivalPoint: 'Pompiers' },
            { departure: 'Tambacounda', arrival: 'Kaolack', departurePoint: 'Gare Routière', arrivalPoint: 'Marché Central' }
        ];

        const trajets = [];
        for (let i = 0; i < 24; i++) { // 24 trajets au total (8 pages x 3 trajets)
            const route = routes[i % routes.length];
            const transporteur = transporteurs[i % transporteurs.length];
            const date = new Date();
            date.setDate(date.getDate() + (i % 30)); // Dates étalées sur 30 jours

            trajets.push({
                id: i + 1,
                transporteur: transporteur,
                date: date.toLocaleDateString('fr-FR'),
                time: `${String(6 + (i % 12)).padStart(2, '0')}:${i % 2 === 0 ? '30' : '15'}`,
                departure: route.departure,
                arrival: route.arrival,
                departurePoint: route.departurePoint,
                arrivalPoint: route.arrivalPoint,
                seats: Math.floor(Math.random() * 15) + 1,
                totalSeats: 15,
                price: (2500 + (i * 200)) % 5000 + 1500,
                acceptsPackages: i % 3 !== 0,
                maxWeight: i % 3 !== 0 ? (i % 2 === 0 ? 20 : 15) : 0
            });
        }
        return trajets;
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.filteredTrajets.length / this.trajetsPerPage);
    }

    init() {
        this.renderTrajets();
        this.updatePaginationNumbers();
        this.setupEventListeners();
        this.setupFilterListeners();
    }

    renderTrajets() {
        const start = (this.currentPage - 1) * this.trajetsPerPage;
        const end = start + this.trajetsPerPage;
        const currentTrajets = this.filteredTrajets.slice(start, end);

        const container = document.querySelector('.offers-container');
        const existingCards = container.querySelectorAll('.route-card');
        existingCards.forEach(card => card.remove());
        
        // Supprimer aussi les messages "aucun résultat"
        const noResultsMessages = container.querySelectorAll('.no-results-message');
        noResultsMessages.forEach(message => message.remove());

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
                <button class="price-button">
                    <span class="price">${trajet.price}</span>
                    <span class="currency">FCFA</span>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        return card;
    }

    selectRoute(routeId) {
        console.log('Trajet sélectionné:', routeId);
        alert(`Vous avez sélectionné le trajet ${routeId}. Redirection vers la réservation...`);
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
                
                // Simulation de recherche
                alert('Recherche mise à jour ! Les trajets seront filtrés selon vos nouveaux critères.');
                
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
    // Initialiser la pagination
    const paginationManager = new PaginationManager();
    
    // Initialiser le gestionnaire de formulaire de recherche
    const searchFormManager = new SearchFormManager();
    
    // Initialiser le menu mobile
    const mobileMenuManager = new MobileMenuManager();
    
    // Initialiser le menu profil
    const profileMenuManager = new ProfileMenuManager();
    
    console.log('✅ Search Trajets - Page initialisée avec succès');
}); 