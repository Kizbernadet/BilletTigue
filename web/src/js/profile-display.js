/**
 * Module de personnalisation de l'affichage du profil dans les dashboards
 * Récupère les données utilisateur et met à jour l'interface
 */

class ProfileDisplay {
    constructor() {
        this.userData = null;
        this.init();
    }

    /**
     * Initialise le module de profil
     */
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadUserProfile();
            });
        } else {
            this.loadUserProfile();
        }
    }

    /**
     * Récupère les données utilisateur depuis le stockage
     */
    getUserData() {
        try {
            const userDataString = sessionStorage.getItem('userData');
            if (!userDataString) {
                console.log('🔒 Aucune donnée utilisateur trouvée');
                return null;
            }
            return JSON.parse(userDataString);
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des données utilisateur:', error);
            return null;
        }
    }

    /**
     * Charge et affiche le profil utilisateur
     */
    loadUserProfile() {
        this.userData = this.getUserData();
        
        if (!this.userData) {
            console.log('⚠️ Impossible de charger les données utilisateur');
            return;
        }

        console.log('📋 Données utilisateur récupérées:', this.userData);

        // Mettre à jour l'affichage du profil
        this.updateProfileDisplay();
    }

    /**
     * Met à jour l'affichage du bouton profil selon le type d'utilisateur
     */
    updateProfileDisplay() {
        const profileBtn = document.getElementById('profileBtn');
        
        if (!profileBtn) {
            console.log('⚠️ Bouton profileBtn non trouvé');
            return;
        }

        // Chercher le span dans le bouton profil (excluant les icônes FontAwesome)
        const spans = profileBtn.querySelectorAll('span');
        let profileSpan = null;
        
        // Filtrer les spans pour trouver celui qui n'est pas une icône FontAwesome
        for (const span of spans) {
            const classes = span.className;
            if (!classes.includes('fa-') && !classes.includes('fas ') && !classes.includes('far ') && !classes.includes('fab ')) {
                profileSpan = span;
                break;
            }
        }
        
        if (!profileSpan) {
            console.log('⚠️ Span de profil non trouvé dans le bouton');
            return;
        }

        // Générer le contenu selon le rôle
        const profileContent = this.generateProfileContent();
        
        // Mettre à jour le contenu
        profileSpan.innerHTML = profileContent;
        
        console.log('✅ Profil mis à jour:', profileContent);
    }

    /**
     * Génère le contenu d'affichage selon le type d'utilisateur
     */
    generateProfileContent() {
        const role = this.userData.role;

        switch (role) {
            case 'transporteur':
            case 'transporter':
                return this.generateTransporterProfile();
                
            case 'admin':
                return this.generateAdminProfile();
                
            case 'user':
                return this.generateUserProfile();
                
            default:
                console.log('⚠️ Rôle non reconnu:', role);
                return 'Utilisateur';
        }
    }

    /**
     * Génère l'affichage pour un transporteur
     */
    generateTransporterProfile() {
        const companyName = this.userData.companyName || 'Entreprise de transport';
        const companyType = this.userData.companyType || '';
        
        // Traduire le type de compagnie
        const companyTypeDisplay = this.translateCompanyType(companyType);
        
        return `
            <div class="profile-display">
                <div class="profile-line primary">${companyName}</div>
                <div class="profile-line secondary">${companyTypeDisplay}</div>
            </div>
        `;
    }

    /**
     * Génère l'affichage pour un administrateur
     */
    generateAdminProfile() {
        const firstName = this.userData.firstName || '';
        const lastName = this.userData.lastName || '';
        
        if (firstName && lastName) {
            return `
                <div class="profile-display">
                    <div class="profile-line primary">${firstName} ${lastName}</div>
                    <div class="profile-line secondary">Administrateur</div>
                </div>
            `;
        } else {
            return `
                <div class="profile-display">
                    <div class="profile-line primary">Administrateur</div>
                    <div class="profile-line secondary">Système</div>
                </div>
            `;
        }
    }

    /**
     * Génère l'affichage pour un utilisateur
     */
    generateUserProfile() {
        const firstName = this.userData.firstName || '';
        const lastName = this.userData.lastName || '';
        const email = this.userData.email || '';
        
        if (firstName && lastName) {
            return `
                <div class="profile-display">
                    <div class="profile-line primary">${firstName} ${lastName}</div>
                    <div class="profile-line secondary">Utilisateur</div>
                </div>
            `;
        } else if (email) {
            return `
                <div class="profile-display">
                    <div class="profile-line primary">${email}</div>
                    <div class="profile-line secondary">Utilisateur</div>
                </div>
            `;
        } else {
            return 'Utilisateur';
        }
    }

    /**
     * Traduit le type de compagnie en français
     */
    translateCompanyType(companyType) {
        const translations = {
            'freight-carrier': 'Transport de marchandises',
            'passenger-carrier': 'Transport de voyageurs',
            'mixte': 'Transport mixte',
            'express-delivery': 'Livraison express',
            'logistics': 'Logistique'
        };

        return translations[companyType] || companyType || 'Transport';
    }

    /**
     * Méthode statique pour initialiser le module
     */
    static init() {
        return new ProfileDisplay();
    }

    /**
     * Met à jour manuellement le profil (utile après modification des données)
     */
    refresh() {
        this.loadUserProfile();
    }
}

// CSS pour le style des profils (injecté dynamiquement)
const profileStyles = `
<style>
.profile-display {
    text-align: left;
    line-height: 1.2;
}

.profile-line {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.profile-line.primary {
    font-weight: 600;
    font-size: 0.95em;
}

.profile-line.secondary {
    font-weight: 400;
    font-size: 0.85em;
    opacity: 0.8;
    margin-top: 2px;
}

#profileBtn .profile-display {
    margin-left: 8px;
}

/* Responsive */
@media (max-width: 768px) {
    .profile-line {
        max-width: 150px;
    }
}
</style>
`;

// Injecter les styles CSS dans le document
if (!document.querySelector('#profile-display-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'profile-display-styles';
    styleElement.innerHTML = profileStyles;
    document.head.appendChild(styleElement);
}

// Export pour utilisation dans d'autres scripts
window.ProfileDisplay = ProfileDisplay; 