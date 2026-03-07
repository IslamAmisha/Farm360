/* ============================================================
   Farm360 — Supplier Supply Orders
   Two tabs: Available Requests | My Accepted Orders

   Endpoints:
     GET  /dashboard/supplier/overview           → stats
     GET  /api/advance-supply/available          → SUPPLIER_NOTIFIED orders
     GET  /api/advance-supply/my-orders          → accepted orders (supplier role)
     POST /api/advance-supply/{id}/supplier/accept → accept order
   ============================================================ */
(function () {
  const token  = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role   = (localStorage.getItem('role') || '').toLowerCase();

  if (!token || !userId || role !== 'supplier') {
    alert('User not found or unauthorized access!');
    localStorage.clear();
    window.location.href = '../../Login/login.html';
    return;
  }
  const API = 'http://localhost:8080/api/advance-supply';

  const availableListEl  = document.getElementById('availableList');
  const acceptedListEl   = document.getElementById('acceptedList');
  const orderModal       = document.getElementById('orderDetailsModal');
  const orderModalBody   = document.getElementById('orderDetailsBody');
  const orderModalClose  = document.getElementById('orderModalCloseBtn');

  const tabAvailableBtn = document.getElementById('tabAvailableBtn');
  const tabMyOrdersBtn  = document.getElementById('tabMyOrdersBtn');
  const tabAvailable    = document.getElementById('tabAvailable');
  const tabMyOrders     = document.getElementById('tabMyOrders');

  function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
  }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      return Array.isArray(d)
        ? new Date(d[0], d[1]-1, d[2]).toLocaleDateString('en-IN')
        : new Date(d).toLocaleDateString('en-IN');
    } catch { return String(d); }
  }

  function fmtCurrency(n) {
    return '₹ ' + Number(n || 0).toLocaleString('en-IN');
  }

  function orderId(o) { return o.id || o.orderId; }

  /* ── Tabs ── */
  function setActiveTab(tab) {
    tabAvailableBtn?.classList.toggle('active', tab === 'available');
    tabMyOrdersBtn?.classList.toggle('active', tab === 'myorders');
    tabAvailable?.classList.toggle('active', tab === 'available');
    tabMyOrders?.classList.toggle('active', tab === 'myorders');
  }

  tabAvailableBtn?.addEventListener('click', () => setActiveTab('available'));
  tabMyOrdersBtn?.addEventListener('click',  () => setActiveTab('myorders'));

  /* ── Load dashboard stats ── */
  async function loadStats() {
    try {
      const res = await fetch('http://localhost:8080/dashboard/supplier/overview', { headers: authHeaders() });
      if (!res.ok) return;
      const d = await res.json();
      const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setText('statActive',    d.activeDeliveries    ?? 0);
      setText('statPending',   d.billsPendingApproval ?? 0);
      setText('statCompleted', d.completedJobs        ?? 0);
      setText('statWallet',    fmtCurrency(d.walletBalance));
    } catch { /* stats are non-critical */ }
  }

  async function loadOrderDetails(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      headers: authHeaders()
    });

    if (!res.ok) throw new Error("Failed to load order");

    const order = await res.json();

    openDetailsModal(order);

  } catch (err) {
    console.error(err);
    alert("Unable to load order details");
  }
}

  /* ── Render available requests ── */
  function renderAvailable(list) {
    availableListEl.innerHTML = '';
    if (!list?.length) {
      availableListEl.innerHTML = '<p class="empty-text">No available requests.</p>';
      return;
    }

    list.forEach(o => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const left = document.createElement('div');
      left.className = 'order-left';
      const badge = document.createElement('div');
      badge.className = `badge-stage badge-${o.stage || 'ADVANCE'}`;
      badge.textContent = o.stage || '—';
      const meta = document.createElement('div');
      meta.className = 'order-meta';
      meta.innerHTML = `
        <div><strong>Agreement:</strong> #${o.agreementId || '—'}</div>
        <div><strong>Type:</strong> ${o.supplierType || '—'}</div>
        <div><strong>Expected:</strong> ${fmtDate(o.expectedDeliveryDate)}</div>
        <div><strong>Allocated:</strong> ${fmtCurrency(o.allocatedAmount)}</div>
      `;
      left.append(badge, meta);

      const right = document.createElement('div');
      right.className = 'order-right';

      const amount = document.createElement('div');
      amount.className = 'order-amount';
      amount.textContent = fmtCurrency(o.allocatedAmount);

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-outline';
      viewBtn.textContent = 'View Details';
     viewBtn.addEventListener('click', () => loadOrderDetails(orderId(o)));

      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'btn-primary';
      acceptBtn.textContent = 'Accept Order';
      acceptBtn.addEventListener('click', async () => {
        acceptBtn.disabled = true;
        try {
          const res = await fetch(
            `${API}/${encodeURIComponent(orderId(o))}/supplier/accept`,
            { method: 'POST', headers: authHeaders() }
          );
          if (!res.ok) throw new Error(await res.text() || 'Accept failed');
          if (window.toast) window.toast('Order accepted');
          else alert('Order accepted');
          await loadAll();
        } catch (err) {
          alert(err.message || 'Failed to accept order');
          acceptBtn.disabled = false;
        }
      });

      right.append(amount, viewBtn, acceptBtn);
      card.append(left, right);
      availableListEl.appendChild(card);
    });
  }

  /* ── Render accepted / active orders ── */
  function renderAccepted(list) {
    acceptedListEl.innerHTML = '';
    if (!list?.length) {
      acceptedListEl.innerHTML = '<p class="empty-text">No accepted orders.</p>';
      return;
    }

    list.forEach(o => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const left = document.createElement('div');
      left.className = 'order-left';
      const badge = document.createElement('div');
      badge.className = `badge-stage badge-${o.stage || 'ADVANCE'}`;
      badge.textContent = o.stage || '—';
      const meta = document.createElement('div');
      meta.className = 'order-meta';
      meta.innerHTML = `
        <div><strong>Agreement:</strong> #${o.agreementId || '—'}</div>
        <div><strong>Stage:</strong> ${o.stage || '—'}</div>
        <div><strong>Status:</strong>
          <span class="status-badge status-${(o.status || '').toUpperCase()}">${o.status || '—'}</span>
        </div>
        <div><strong>Amount:</strong> ${fmtCurrency(o.billAmount ?? o.allocatedAmount)}</div>
      `;
      left.append(badge, meta);

      const right = document.createElement('div');
      right.className = 'order-right';

      const payStatus = (o.escrowStatus || 'HELD').toUpperCase();
      const payBadge = document.createElement('div');
      payBadge.className = `status-badge status-${payStatus}`;
      payBadge.textContent = payStatus;

      const actions = document.createElement('div');
      actions.className = 'order-actions';

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-outline';
      viewBtn.textContent = 'View Details';
viewBtn.addEventListener('click', () => loadOrderDetails(orderId(o)));
      actions.appendChild(viewBtn);

      // Upload bill when SUPPLIER_ACCEPTED
      if ((o.status || '').toUpperCase() === 'SUPPLIER_ACCEPTED') {
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'btn-primary';
        uploadBtn.textContent = 'Upload Bill';
        uploadBtn.addEventListener('click', () => {
          window.location.href =
             `../supplier-bill/supplier-upload-bill.html?orderId=${encodeURIComponent(orderId(o))}`;
        });
        actions.appendChild(uploadBtn);
      }

      right.append(payBadge, actions);
      card.append(left, right);
      acceptedListEl.appendChild(card);
    });
  }

  /* ── Detail modal ── */
function openDetailsModal(o) {

  let itemsRows = '';

  if (o.items && o.items.length > 0) {
    itemsRows = o.items.map(i => `
      <tr>
        <td>${i.type || '—'}</td>
        <td>${i.productName || '—'}</td>
        <td>${i.brandName || '—'}</td>
        <td>${i.quantity || '—'}</td>
        <td>${i.unit || '—'}</td>
        <td>₹ ${i.expectedPrice || '—'}</td>
      </tr>
    `).join('');
  }

  orderModalBody.innerHTML = `
    <div class="request-details-grid">

      <div>
        <label>Agreement ID</label>
        <p>#${o.agreementId || '—'}</p>
      </div>

      <div>
        <label>Farming Stage</label>
        <p>${o.stage || '—'}</p>
      </div>

      <div>
        <label>Supplier Type</label>
        <p>${o.supplierType || '—'}</p>
      </div>

      <div>
        <label>Expected Delivery</label>
        <p>${fmtDate(o.expectedDeliveryDate)}</p>
      </div>

      <div>
        <label>Demand Amount</label>
        <p>${fmtCurrency(o.allocatedAmount)}</p>
      </div>

      <div>
        <label>Farmer</label>
        <p>${o.farmerName || '—'}</p>
      </div>

      <div>
        <label>Buyer</label>
        <p>${o.buyerName || '—'}</p>
      </div>

      <div>
        <label>Crop</label>
        <p>${o.cropName || '—'}</p>
      </div>

      <div>
        <label>Delivery Location</label>
        <p>${o.deliveryLocation || '—'}</p>
      </div>

    </div>

    <h4 class="items-title">Requested Items</h4>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item Type</th>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Expected Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
  `;

  orderModal.hidden = false;
}

  orderModalClose?.addEventListener('click', () => { if (orderModal) orderModal.hidden = true; });
  orderModal?.addEventListener('click', e => { if (e.target === orderModal) orderModal.hidden = true; });

  /* ── Load all ── */
  async function loadAll() {
    availableListEl.innerHTML = '<p class="empty-text">Loading…</p>';
    acceptedListEl.innerHTML  = '<p class="empty-text">Loading…</p>';

    try {
      const [availRes, myRes] = await Promise.all([
        fetch(`${API}/available`,  { headers: authHeaders() }),
        fetch(`${API}/my-orders`,  { headers: authHeaders() })
      ]);

      const available = availRes.ok ? await availRes.json() : [];
      const myOrders  = myRes.ok   ? await myRes.json()    : [];

      renderAvailable(available);
      renderAccepted(myOrders);
    } catch (err) {
      console.error('Load failed', err);
      availableListEl.innerHTML = '<p class="empty-text">Failed to load requests.</p>';
      acceptedListEl.innerHTML  = '<p class="empty-text">Failed to load orders.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    setActiveTab('available');
    await loadStats();
    await loadAll();
    setInterval(loadAll, 30000);
  });
})();