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

  const API_BASE = 'http://localhost:8080';
  const API = API_BASE + '/api/advance-supply';

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
      const res = await fetch('/dashboard/supplier/overview', { headers: authHeaders() });
      if (!res.ok) return;
      const d = await res.json();
      const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setText('statActive',    d.activeDeliveries    ?? 0);
      setText('statPending',   d.billsPendingApproval ?? 0);
      setText('statCompleted', d.completedJobs        ?? 0);
      setText('statWallet',    fmtCurrency(d.walletBalance));
    } catch { /* stats are non-critical */ }
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
        <div><strong>Bill Range:</strong> ${o.minBillAmount != null ? fmtCurrency(o.minBillAmount) + ' – ' + fmtCurrency(o.maxBillAmount) : '—'}</div>
        <div><strong>Deliver To:</strong> ${o.deliveryAddress || '—'}</div>
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
      viewBtn.addEventListener('click', () => openDetailsModal(o));

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
        <div><strong>Bill Range:</strong> ${o.minBillAmount != null ? fmtCurrency(o.minBillAmount) + ' – ' + fmtCurrency(o.maxBillAmount) : '—'}</div>
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
      viewBtn.addEventListener('click', () => openDetailsModal(o));
      actions.appendChild(viewBtn);

      // Upload bill when SUPPLIER_ACCEPTED
      if ((o.status || '').toUpperCase() === 'SUPPLIER_ACCEPTED') {
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'btn-primary';
        uploadBtn.textContent = 'Upload Bill';
        uploadBtn.addEventListener('click', () => {
          window.location.href =
            `supplier-upload-bill.html?orderId=${encodeURIComponent(orderId(o))}`;
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
    const status       = (o.status || '').toUpperCase();
    const isAccepted   = ['SUPPLIER_ACCEPTED','DISPATCHED','FARMER_CONFIRMED',
                          'IN_TRANSIT','BUYER_CONFIRMED','APPROVED'].includes(status);

    // Buyer warehouse / contact — shown only after supplier accepts
    // so unrelated suppliers cannot see private buyer location details
    const warehouseSection = isAccepted ? `
      <div class="modal-section modal-warehouse">
        <div class="warehouse-title">Delivery Destination</div>
        <div><strong>Location:</strong> ${o.buyerLocation || o.deliveryLocation || '—'}</div>
        <div><strong>Warehouse / Address:</strong> ${o.buyerWarehouseAddress || '—'}</div>
        <div><strong>Contact Person:</strong> ${o.buyerName || '—'}</div>
        <div><strong>Phone:</strong> ${o.buyerPhone || '—'}</div>
      </div>` : `
      <div class="modal-section modal-warehouse-locked">
        Accept this order to view buyer warehouse address and contact details.
      </div>`;

    orderModalBody.innerHTML = `
      <h3>Order #${orderId(o) || '—'}</h3>
      <div class="modal-section">
        <div><strong>Agreement:</strong> #${o.agreementId || '—'}</div>
        <div><strong>Stage:</strong> ${o.stage || '—'}</div>
        <div><strong>Status:</strong> ${o.status || '—'}</div>
        <div><strong>Supplier Type:</strong> ${o.supplierType || '—'}</div>
        <div><strong>Allocated:</strong> ${fmtCurrency(o.allocatedAmount)}</div>
        <div><strong>Bill Amount:</strong> ${fmtCurrency(o.billAmount)}</div>
        <div><strong>Expected Delivery:</strong> ${fmtDate(o.expectedDeliveryDate)}</div>
        ${o.systemRemark ? `<div class="system-remark"><strong>⚠ Remark:</strong> ${o.systemRemark}</div>` : ''}
      </div>
      ${warehouseSection}
    `;

    if (o.items?.length) {
      const sec = document.createElement('div');
      sec.className = 'modal-section';
      sec.innerHTML = '<strong>Items</strong>';
      const ul = document.createElement('ul');
      o.items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = `${it.productName || it.description || '—'} — ${it.quantity} ${it.unit || ''} @ ₹${it.expectedPrice ?? it.rate ?? '—'}`;
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      orderModalBody.appendChild(sec);
    }

    if (orderModal) orderModal.hidden = false;
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