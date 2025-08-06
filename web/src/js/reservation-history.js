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
            <td><button class="btn-secondary details-btn" data-reservation='${JSON.stringify(res).replace(/'/g, "&#39;")}' type="button">Détail</button></td>
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

  // Gestion de la modale détails (doit être en dehors de fetchAndRenderReservations)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('details-btn')) {
      const res = JSON.parse(e.target.getAttribute('data-reservation').replace(/&#39;/g, "'"));
      // Remplir la modale
      document.getElementById('details-reference').textContent = res.booking_number || res.id || '-';
      document.getElementById('details-route').textContent = res.trajet ? `${res.trajet.departure_city || ''} → ${res.trajet.arrival_city || ''}` : '-';
      document.getElementById('details-passenger').textContent = `${res.passenger_first_name || ''} ${res.passenger_last_name || ''}`.trim();
      document.getElementById('details-seats').textContent = res.seats_reserved || '-';
      document.getElementById('details-status').textContent = res.status || '-';
      document.getElementById('details-total').textContent = res.total_amount ? `${res.total_amount} FCFA` : '-';
      document.getElementById('details-payment').textContent = res.payment_method || '-';
      // Tickets QR
      const ticketsListDiv = document.getElementById('details-tickets-list');
      ticketsListDiv.innerHTML = '';
      const tickets = res.tickets || [];
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
      // QR principal
      const qrDiv = document.getElementById('details-qr-code');
      qrDiv.innerHTML = '';
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
      document.getElementById('reservation-details-modal').style.display = 'flex';
    }
    if (e.target.id === 'close-details-modal' || e.target.id === 'close-details-modal-btn' || e.target.id === 'reservation-details-modal') {
      document.getElementById('reservation-details-modal').style.display = 'none';
    }
  });
}); 