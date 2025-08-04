// Script pour afficher l'historique des réservations utilisateur avec pagination

document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.querySelector('#reservationsTable tbody');
  const noReservationsMsg = document.getElementById('noReservationsMsg');
  const token = sessionStorage.getItem('authToken');
  const tableContainer = document.getElementById('reservationsTableContainer');

  let currentPage = 1;
  let totalPages = 1;
  const limit = 6;

  function renderPagination(totalCount) {
    // Supprimer l'ancienne pagination si elle existe
    const oldPagination = document.getElementById('paginationControls');
    if (oldPagination) oldPagination.remove();
    if (totalCount <= limit) return; // N'affiche la pagination que si plus de 8 réservations
    if (totalPages <= 1) return;
    const pagination = document.createElement('div');
    pagination.id = 'paginationControls';
    pagination.style.display = 'flex';
    pagination.style.justifyContent = 'center';
    pagination.style.gap = '1rem';
    pagination.style.margin = '1rem 0';
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Précédent';
    prevBtn.className = 'btn-secondary';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = function () {
      if (currentPage > 1) {
        currentPage--;
        fetchAndRenderReservations();
      }
    };
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Suivant';
    nextBtn.className = 'btn-secondary';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = function () {
      if (currentPage < totalPages) {
        currentPage++;
        fetchAndRenderReservations();
      }
    };
    
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    pageInfo.style.alignSelf = 'center';
    pageInfo.style.fontWeight = '500';
    
    pagination.appendChild(prevBtn);
    pagination.appendChild(pageInfo);
    pagination.appendChild(nextBtn);
    tableContainer.appendChild(pagination);
  }

  async function fetchAndRenderReservations() {
    if (!token) {
      tableBody.innerHTML = '<tr><td colspan="7" style="color:#dc3545; text-align:center;">Vous devez être connecté pour voir vos réservations.</td></tr>';
      return;
    }
    try {
      const response = await fetch(`/api/reservations?page=${currentPage}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log(result);
      if (!result.success || !result.data || result.data.length === 0) {
        noReservationsMsg.style.display = 'block';
        tableBody.innerHTML = '';
        renderPagination(0);
        return;
      }
      noReservationsMsg.style.display = 'none';
      tableBody.innerHTML = '';
      result.data.forEach(res => {
        const date = new Date(res.reservation_date).toLocaleDateString();
        const bookingDate = res.created_at ? new Date(res.created_at).toLocaleDateString() : '-';
        const bookingNumber = res.booking_number || '-';
        const trajet = res.trajet ? `${res.trajet.departure_city || ''} → ${res.trajet.arrival_city || ''}` : '-';
        const statut = res.status.charAt(0).toUpperCase() + res.status.slice(1);
        const montant = res.total_amount ? `${res.total_amount} FCFA` : '-';
        const places = res.seats_reserved !== undefined ? res.seats_reserved : '-';
        tableBody.innerHTML += `
          <tr>
            <td>${date}</td>
            <td>${bookingDate}</td>
            <td>${bookingNumber}</td>
            <td>${trajet}</td>
            <td>${statut}</td>
            <td>${montant}</td>
            <td>${places}</td>
            <td><button class="btn-secondary" onclick="alert('Détail à venir')">Détail</button></td>
          </tr>
        `;
      });
      // Pagination
      if (result.pagination) {
        totalPages = result.pagination.totalPages;
        currentPage = result.pagination.currentPage;
        renderPagination(result.pagination.totalCount || (totalPages * limit));
      } else {
        totalPages = 1;
        currentPage = 1;
        renderPagination(result.data.length);
      }
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="7" style="color:#dc3545; text-align:center;">Erreur lors du chargement des réservations.</td></tr>`;
      noReservationsMsg.style.display = 'none';
      renderPagination(0);
    }
  }

  fetchAndRenderReservations();
}); 