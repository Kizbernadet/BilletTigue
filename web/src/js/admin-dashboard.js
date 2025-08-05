/**
 * Dashboard Administrateur - BilletTigue
 * Gestion des transporteurs, utilisateurs et statistiques
 */

// Configuration de l'API
const API_BASE = 'http://localhost:3000/api';
let currentStats = {};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadStats();
    loadTransporters();
    setupEventListeners();
});

// Vérifier l'authentification
function checkAuth() {
    const token = sessionStorage.getItem('authToken');
    const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Vérifier si l'utilisateur est admin
    if (user.role !== 'admin') {
        alert('Accès refusé. Vous devez être administrateur pour accéder à cette page.');
        window.location.href = '../index.html';
        return;
    }
}

// Configuration des événements
function setupEventListeners() {
    // Onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Boutons
    document.getElementById('addTransporterBtn').addEventListener('click', function() {
        openModal('addTransporterModal');
    });

    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadStats();
        loadCurrentTabData();
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });

    // Formulaire d'ajout de transporteur
    document.getElementById('addTransporterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createTransporter();
    });
}

// Changer d'onglet
function switchTab(tabName) {
    // Mettre à jour les onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Mettre à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Charger les données si nécessaire
    loadTabData(tabName);
}

// Charger les données d'un onglet
function loadTabData(tabName) {
    switch(tabName) {
        case 'transporters':
            loadTransporters();
            break;
        case 'users':
            loadUsers();
            break;
        case 'accounts':
            loadAccounts();
            break;
    }
}

// Charger les données de l'onglet actuel
function loadCurrentTabData() {
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    loadTabData(activeTab);
}

// Charger les statistiques
async function loadStats() {
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentStats = data.stats;
            updateStatsDisplay();
        } else if (response.status === 401) {
            logout();
        } else {
            console.error('Erreur lors du chargement des statistiques');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Mettre à jour l'affichage des statistiques
function updateStatsDisplay() {
    document.getElementById('totalUsers').textContent = currentStats.totalUsers || 0;
    document.getElementById('totalTransporters').textContent = currentStats.totalTransporters || 0;
    document.getElementById('totalAccounts').textContent = currentStats.totalAccounts || 0;
    document.getElementById('activeAccounts').textContent = currentStats.activeAccounts || 0;
}

// Charger les transporteurs
async function loadTransporters() {
    const loading = document.getElementById('transportersLoading');
    const table = document.getElementById('transportersTable');
    const empty = document.getElementById('transportersEmpty');
    
    loading.classList.add('show');
    table.style.display = 'none';
    empty.style.display = 'none';

    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/transporters`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayTransporters(data.transporters);
        } else if (response.status === 401) {
            logout();
        } else {
            console.error('Erreur lors du chargement des transporteurs');
        }
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        loading.classList.remove('show');
    }
}

// Afficher les transporteurs
function displayTransporters(transporters) {
    const tbody = document.getElementById('transportersTableBody');
    const table = document.getElementById('transportersTable');
    const empty = document.getElementById('transportersEmpty');

    if (transporters.length === 0) {
        empty.style.display = 'block';
        table.style.display = 'none';
        return;
    }

    tbody.innerHTML = transporters.map(transporter => `
        <tr>
            <td>${transporter.first_name} ${transporter.last_name}</td>
            <td>${transporter.email}</td>
            <td>${transporter.company_name}</td>
            <td>
                <span class="status-badge ${transporter.company_type === 'freight-carrier' ? 'status-active' : 'status-inactive'}">
                    ${transporter.company_type === 'freight-carrier' ? 'Marchandises' : 'Voyageurs'}
                </span>
            </td>
            <td>
                <span class="status-badge ${transporter.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${transporter.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="toggleTransporterStatus(${transporter.id}, '${transporter.status}')">
                        <i class="fas fa-toggle-${transporter.status === 'active' ? 'off' : 'on'}"></i>
                        ${transporter.status === 'active' ? 'Désactiver' : 'Activer'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransporter(${transporter.id})">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    table.style.display = 'table';
    empty.style.display = 'none';
}

// Charger les utilisateurs
async function loadUsers() {
    const loading = document.getElementById('usersLoading');
    const table = document.getElementById('usersTable');
    const empty = document.getElementById('usersEmpty');
    
    loading.classList.add('show');
    table.style.display = 'none';
    empty.style.display = 'none';

    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayUsers(data.users);
        } else if (response.status === 401) {
            logout();
        } else {
            console.error('Erreur lors du chargement des utilisateurs');
        }
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        loading.classList.remove('show');
    }
}

// Afficher les utilisateurs
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    const table = document.getElementById('usersTable');
    const empty = document.getElementById('usersEmpty');

    if (users.length === 0) {
        empty.style.display = 'block';
        table.style.display = 'none';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
            <td>${user.phone_number || '-'}</td>
            <td>
                <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${user.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="toggleUserStatus(${user.id}, '${user.status}')">
                        <i class="fas fa-toggle-${user.status === 'active' ? 'off' : 'on'}"></i>
                        ${user.status === 'active' ? 'Désactiver' : 'Activer'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    table.style.display = 'table';
    empty.style.display = 'none';
}

// Charger tous les comptes
async function loadAccounts() {
    const loading = document.getElementById('accountsLoading');
    const table = document.getElementById('accountsTable');
    
    loading.classList.add('show');
    table.style.display = 'none';

    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/accounts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayAccounts(data.accounts);
        } else if (response.status === 401) {
            logout();
        } else {
            console.error('Erreur lors du chargement des comptes');
        }
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        loading.classList.remove('show');
    }
}

// Afficher tous les comptes
function displayAccounts(accounts) {
    const tbody = document.getElementById('accountsTableBody');
    const table = document.getElementById('accountsTable');

    tbody.innerHTML = accounts.map(account => `
        <tr>
            <td>${account.email}</td>
            <td>
                <span class="status-badge status-active">
                    ${account.role}
                </span>
            </td>
            <td>
                <span class="status-badge ${account.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${account.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>${new Date(account.created_at).toLocaleDateString('fr-FR')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary">
                        <i class="fas fa-edit"></i>
                        Modifier
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    table.style.display = 'table';
}

// Créer un transporteur
async function createTransporter() {
    const form = document.getElementById('addTransporterForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/create-transporter`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Transporteur créé avec succès !');
            closeModal('addTransporterModal');
            form.reset();
            loadTransporters();
            loadStats();
            
            // Noter le nouveau compte
            noteNewAccount(result.transporter, 'TRANSPORTEUR');
        } else if (response.status === 401) {
            logout();
        } else {
            const error = await response.json();
            alert('Erreur: ' + error.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la création du transporteur');
    }
}

// Noter un nouveau compte
function noteNewAccount(accountData, type) {
    console.log(`🚛 NOUVEAU COMPTE ${type} CRÉÉ:`, {
        email: accountData.email,
        nom: `${accountData.first_name} ${accountData.last_name}`,
        entreprise: accountData.company_name,
        type: accountData.company_type,
        date: new Date().toISOString()
    });
    
    // Enregistrer localement pour le suivi
    const existingAccounts = JSON.parse(sessionStorage.getItem('createdAccounts') || '[]');
    existingAccounts.push({
        type,
        email: accountData.email,
        name: `${accountData.first_name} ${accountData.last_name}`,
        company: accountData.company_name,
        companyType: accountData.company_type,
        createdAt: new Date().toISOString(),
        source: 'ADMIN_DASHBOARD'
    });
    sessionStorage.setItem('createdAccounts', JSON.stringify(existingAccounts));
}

// Basculer le statut d'un transporteur
async function toggleTransporterStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/transporters/${id}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            loadTransporters();
            loadStats();
        } else if (response.status === 401) {
            logout();
        } else {
            alert('Erreur lors de la mise à jour du statut');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du statut');
    }
}

// Basculer le statut d'un utilisateur
async function toggleUserStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/users/${id}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            loadUsers();
            loadStats();
        } else if (response.status === 401) {
            logout();
        } else {
            alert('Erreur lors de la mise à jour du statut');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du statut');
    }
}

// Supprimer un transporteur
async function deleteTransporter(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce transporteur ?')) {
        return;
    }

    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/transporters/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            loadTransporters();
            loadStats();
        } else if (response.status === 401) {
            logout();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// Supprimer un utilisateur
async function deleteUser(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        return;
    }

    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            loadUsers();
            loadStats();
        } else if (response.status === 401) {
            logout();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// Ouvrir une modal
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

// Fermer une modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Déconnexion
function logout() {
    if (window.SecureLogout) {
        window.SecureLogout.logout();
    } else {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('login.html?fallback=true');
    }
}

// Fermer les modals en cliquant à l'extérieur
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Fonction pour afficher les comptes créés (pour le suivi)
function showCreatedAccountsLog() {
    const accounts = JSON.parse(sessionStorage.getItem('createdAccounts') || '[]');
    console.log('📋 HISTORIQUE DES COMPTES CRÉÉS:', accounts);
    return accounts;
}

// Exposer la fonction pour le debugging
window.showCreatedAccountsLog = showCreatedAccountsLog; 