/**
 * Utilitaires pour la gestion des redirections de connexion avec returnUrl
 * Usage : Inclure ce fichier dans toutes les pages qui ont des boutons "Se connecter"
 */

/**
 * Fonction globale de redirection vers login avec returnUrl
 * @param {string} role - 'user' ou 'transporter'  
 */
window.redirectToLogin = function(role) {
    // Capturer l'URL actuelle complète (avec paramètres)
    const currentUrl = encodeURIComponent(window.location.href);
    
    // Construire l'URL de login avec returnUrl
    const loginUrl = `./login.html?role=${role}&returnUrl=${currentUrl}`;
    
    console.log('🔗 Redirection vers login avec retour:', {
        role: role,
        returnUrl: window.location.href,
        loginUrl: loginUrl
    });
    
    // Rediriger vers la page de login
    window.location.href = loginUrl;
};

/**
 * Fonction pour vérifier si l'utilisateur est déjà connecté
 * et rediriger vers la page appropriée
 */
window.checkAuthAndRedirect = function() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            console.log('👤 Utilisateur déjà connecté détecté:', user);
            
            // Vérifier s'il y a une URL de retour
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('returnUrl');
            
            if (returnUrl && window.location.pathname.includes('login.html')) {
                // Rediriger vers la page d'origine si on est sur login
                const decodedReturnUrl = decodeURIComponent(returnUrl);
                console.log('🔄 Redirection vers page d\'origine:', decodedReturnUrl);
                window.location.href = decodedReturnUrl;
                return true;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'auth:', error);
        }
    }
    
    return false;
};

/**
 * Mettre à jour l'affichage des menus selon l'état de connexion
 */
window.updateTopbarMenus = function() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    const loginMenu = document.getElementById('login-menu');
    const userMenu = document.getElementById('user-menu');
    
    if (token && userData) {
        // Utilisateur connecté
        try {
            const user = JSON.parse(userData);
            
            if (loginMenu) loginMenu.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = document.getElementById('user-name');
                if (userName) {
                    userName.textContent = user.first_name || user.company_name || 'Utilisateur';
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des menus:', error);
        }
    } else {
        // Utilisateur non connecté
        if (loginMenu) loginMenu.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
};

/**
 * Initialiser les utilitaires de redirection de connexion
 * À appeler au chargement de chaque page
 */
window.initLoginRedirectUtils = function() {
    console.log('🔧 Initialisation des utilitaires de redirection de connexion');
    
    // Mettre à jour l'affichage des menus
    updateTopbarMenus();
    
    // Configurer la déconnexion si le bouton existe
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Nettoyer les données de connexion
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userData');
            
            console.log('🔓 Déconnexion effectuée');
            
            // Rediriger vers la page d'accueil
            window.location.href = '../index.html';
        });
    }
    
    // Écouter les changements de localStorage pour synchroniser entre onglets
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken' || e.key === 'userData') {
            updateTopbarMenus();
        }
    });
};

console.log('✅ Login Redirect Utils chargé'); 