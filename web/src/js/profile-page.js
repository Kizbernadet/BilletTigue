// Gestion de la modale "Voir mon compte" sur la page profil

document.addEventListener('DOMContentLoaded', function () {
  const viewBtn = document.getElementById('viewAccountBtn');
  const modal = document.getElementById('viewAccountModal');
  const closeBtn = document.getElementById('closeViewAccountModalBtn');

  // Helper pour récupérer les infos utilisateur (depuis sessionStorage ou API)
  function getUserData() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) return null;
    try { return JSON.parse(userData); } catch { return null; }
  }

  // Remplit la modale avec les infos du compte
  function fillModal(user) {
    if (!user) return;
    function getField(obj, ...keys) {
      for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
      }
      return '-';
    }
    // Initiales
    const initials = (getField(user, 'firstName', 'prenom', 'first_name').charAt(0) || '') + (getField(user, 'lastName', 'nom', 'last_name').charAt(0) || '');
    document.getElementById('modalProfileAvatar').textContent = initials.toUpperCase();
    document.getElementById('modalProfileName').textContent = getField(user, 'firstName', 'prenom', 'first_name') + ' ' + getField(user, 'lastName', 'nom', 'last_name');
    document.getElementById('modalProfileRole').textContent = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Utilisateur';
    document.getElementById('modalProfileFirstName').textContent = getField(user, 'firstName', 'prenom', 'first_name');
    document.getElementById('modalProfileLastName').textContent = getField(user, 'lastName', 'nom', 'last_name');
    document.getElementById('modalProfileEmail').textContent = getField(user, 'email');
    document.getElementById('modalProfilePhone').textContent = getField(user, 'phoneNumber', 'phone', 'phone_number');
    document.getElementById('modalProfileSince').textContent = getField(user, 'createdAt', 'since', 'date_creation');
    document.getElementById('modalProfileStatus').textContent = getField(user, 'status', 'statut', 'etat');
    document.getElementById('modalProfileEmailVerified').textContent = user.emailVerified ? 'Oui' : 'Non';
    document.getElementById('modalProfilePhoneVerified').textContent = user.phoneVerified ? 'Oui' : 'Non';
  }

  // Ouvre la modale
  function openModal() {
    const user = getUserData();
    fillModal(user);
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('show'); }, 10);
  }

  // Ferme la modale
  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 200);
  }

  if (viewBtn && modal) {
    viewBtn.addEventListener('click', openModal);
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeModal);
  }
  // Fermer la modale en cliquant sur l'overlay
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
  // Fermer avec la touche Echap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
});

// Gestion de la modale "Modifier mon profil" sur la page profil

document.addEventListener('DOMContentLoaded', function () {
  // ... (modale Voir mon compte déjà gérée plus haut)

  const editBtn = document.getElementById('editProfileBtn');
  const editModal = document.getElementById('editProfileModal');
  const closeEditBtn = document.getElementById('closeEditProfileModalBtn');
  const cancelEditBtn = document.getElementById('cancelEditProfileBtn');
  const editForm = document.getElementById('editProfileForm');
  const editError = document.getElementById('editProfileError');

  function getUserData() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) return null;
    try { return JSON.parse(userData); } catch { return null; }
  }

  function fillEditModal(user) {
    if (!user) return;
    function getField(obj, ...keys) {
      for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
      }
      return '';
    }
    editForm.editFirstName.value = getField(user, 'firstName', 'prenom', 'first_name');
    editForm.editLastName.value = getField(user, 'lastName', 'nom', 'last_name');
    editForm.editEmail.value = getField(user, 'email');
    editForm.editPhone.value = getField(user, 'phoneNumber', 'phone', 'phone_number');
    editForm.editAddress.value = getField(user, 'address', 'adresse');
  }

  function openEditModal() {
    const user = getUserData();
    fillEditModal(user);
    editModal.style.display = 'flex';
    setTimeout(() => { editModal.classList.add('show'); }, 10);
    if (editError) editError.style.display = 'none';
  }
  function closeEditModal() {
    editModal.classList.remove('show');
    setTimeout(() => { editModal.style.display = 'none'; }, 200);
    if (editError) editError.style.display = 'none';
  }

  if (editBtn && editModal) {
    editBtn.addEventListener('click', openEditModal);
  }
  if (closeEditBtn && editModal) {
    closeEditBtn.addEventListener('click', closeEditModal);
  }
  if (cancelEditBtn && editModal) {
    cancelEditBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeEditModal();
    });
  }
  if (editModal) {
    editModal.addEventListener('click', function (e) {
      if (e.target === editModal) closeEditModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && editModal.style.display === 'flex') closeEditModal();
  });

  // Soumission du formulaire de modification
  if (editForm) {
    editForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (editError) editError.style.display = 'none';
      // Récupérer les valeurs
      const firstName = editForm.editFirstName.value.trim();
      const lastName = editForm.editLastName.value.trim();
      const email = editForm.editEmail.value.trim();
      const phone = editForm.editPhone.value.trim();
      const address = editForm.editAddress.value.trim();
      // Validation simple
      if (!firstName || !lastName || !email) {
        if (editError) {
          editError.textContent = 'Prénom, nom et email sont obligatoires.';
          editError.style.display = 'block';
        }
        return;
      }
      // Appel API backend
      try {
        const token = (window.AuthAPI && window.AuthAPI.getToken) ? window.AuthAPI.getToken() : null;
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            firstName, lastName, email, phone, address
          })
        });
        const data = await res.json();
        if (res.ok) {
          // Mettre à jour sessionStorage
          const user = getUserData() || {};
          user.firstName = firstName;
          user.lastName = lastName;
          user.email = email;
          user.phoneNumber = phone;
          user.address = address;
          sessionStorage.setItem('userData', JSON.stringify(user));
          closeEditModal();
          // Optionnel : afficher un message de succès
          if (window.showMessage) window.showMessage('Profil mis à jour avec succès', 'success');
          else alert('Profil mis à jour avec succès');
        } else {
          if (editError) {
            editError.textContent = data.message || 'Erreur lors de la mise à jour du profil.';
            editError.style.display = 'block';
          }
        }
      } catch (err) {
        if (editError) {
          editError.textContent = 'Erreur réseau ou serveur.';
          editError.style.display = 'block';
        }
      }
    });
  }
});

// Gestion de la modale "Changer le mot de passe" sur la page profil

document.addEventListener('DOMContentLoaded', function () {
  const pwdBtn = document.getElementById('changePwdBtn');
  const pwdModal = document.getElementById('changePwdModal');
  const closePwdBtn = document.getElementById('closeChangePwdModalBtn');
  const cancelPwdBtn = document.getElementById('cancelChangePwdBtn');
  const pwdForm = document.getElementById('changePwdForm');
  const pwdError = document.getElementById('changePwdError');

  function openPwdModal() {
    pwdForm.reset();
    if (pwdError) pwdError.style.display = 'none';
    pwdModal.style.display = 'flex';
    setTimeout(() => { pwdModal.classList.add('show'); }, 10);
  }
  function closePwdModal() {
    pwdModal.classList.remove('show');
    setTimeout(() => { pwdModal.style.display = 'none'; }, 200);
    if (pwdError) pwdError.style.display = 'none';
  }

  if (pwdBtn && pwdModal) {
    pwdBtn.addEventListener('click', openPwdModal);
  }
  if (closePwdBtn && pwdModal) {
    closePwdBtn.addEventListener('click', closePwdModal);
  }
  if (cancelPwdBtn && pwdModal) {
    cancelPwdBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closePwdModal();
    });
  }
  if (pwdModal) {
    pwdModal.addEventListener('click', function (e) {
      if (e.target === pwdModal) closePwdModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pwdModal.style.display === 'flex') closePwdModal();
  });

  // Soumission du formulaire de changement de mot de passe
  if (pwdForm) {
    pwdForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (pwdError) pwdError.style.display = 'none';
      const currentPwd = pwdForm.currentPwd.value.trim();
      const newPwd = pwdForm.newPwd.value.trim();
      const confirmPwd = pwdForm.confirmPwd.value.trim();
      // Validation
      if (!currentPwd || !newPwd || !confirmPwd) {
        pwdError.textContent = 'Tous les champs sont obligatoires.';
        pwdError.style.display = 'block';
        return;
      }
      if (newPwd.length < 6) {
        pwdError.textContent = 'Le nouveau mot de passe doit contenir au moins 6 caractères.';
        pwdError.style.display = 'block';
        return;
      }
      if (newPwd !== confirmPwd) {
        pwdError.textContent = 'La confirmation ne correspond pas au nouveau mot de passe.';
        pwdError.style.display = 'block';
        return;
      }
      // Appel API backend
      try {
        const token = (window.AuthAPI && window.AuthAPI.getToken) ? window.AuthAPI.getToken() : null;
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            currentPassword: currentPwd,
            newPassword: newPwd
          })
        });
        const data = await res.json();
        if (res.ok) {
          closePwdModal();
          if (window.showMessage) window.showMessage('Mot de passe modifié avec succès', 'success');
          else alert('Mot de passe modifié avec succès');
        } else {
          pwdError.textContent = data.message || 'Erreur lors du changement de mot de passe.';
          pwdError.style.display = 'block';
        }
      } catch (err) {
        pwdError.textContent = 'Erreur réseau ou serveur.';
        pwdError.style.display = 'block';
      }
    });
  }
}); 