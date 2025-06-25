// Gestionnaire du menu dropdown profil
document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileWrapper = document.querySelector('.profile-dropdown-wrapper');
    
    if (!profileBtn || !profileDropdown || !profileWrapper) {
        console.error('Éléments du menu profil non trouvés');
        return;
    }

    let isMenuOpen = false;

    // Fonction pour ouvrir le menu
    function openMenu() {
        profileDropdown.style.display = 'block';
        isMenuOpen = true;
        console.log('Menu ouvert');
    }

    // Fonction pour fermer le menu
    function closeMenu() {
        profileDropdown.style.display = 'none';
        isMenuOpen = false;
        console.log('Menu fermé');
    }

    // Fonction pour basculer le menu
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Clic sur le bouton profil
    profileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Clic sur le bouton profil');
        toggleMenu();
    });

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !profileWrapper.contains(e.target)) {
            console.log('Clic en dehors du menu');
            closeMenu();
        }
    });

    // Gestionnaire pour le bouton de déconnexion
    document.querySelectorAll('.logout-link').forEach(logoutLink => {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Logique de déconnexion
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            closeMenu();
            window.location.href = '../index.html';
        });
    });

    // Gestionnaires pour les autres liens du menu (optionnel)
    const menuLinks = document.querySelectorAll('.profile-dropdown-link:not(.logout-link)');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clic sur:', this.textContent.trim());
            // Ici tu peux ajouter la logique pour chaque option
            closeMenu();
        });
    });

    console.log('Menu profil initialisé');
}); 