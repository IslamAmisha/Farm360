/* ============================================================
   Farm360 — My Supply Orders  (farmer / buyer)

   Endpoints:
     GET  /api/advance-supply/my-orders          → list
     POST /api/advance-supply/farmer/dispatch    → dispatch harvest (FINAL)
   Action buttons navigate to dedicated confirm pages.
   ============================================================ */
(function () {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('role') || '').toLowerCase();

  if (!token || !['farmer', 'buyer'].includes(role)) {
    alert('User not found or unauthorized access!');
    localStorage.clear();
    window.location.href = '../../Login/login.html';
    return;
  }

  const API = '/api/advance-supply';
  const ordersListEl = document.getElementById('ordersList');
  const modal        = document.getElementById('orderModal');
  const modalBody    = document.getElementById('modalBody');

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
    if (n == null) return '—';
    return '₹ ' + Number(n).toLocaleString('en-IN');
  }

  function orderId(o) { return o.id || o.orderId; }

  /* ── Fetch ── */
  async function fetchOrders() {
    try {
      const res = await fetch(`${API}/my-orders`, { headers: authHeaders() });
      return res.ok ? await res.json() : [];
    } catch { return []; }
  }

  /* ── Render ── */
  function renderOrders(list) {
    ordersListEl.innerHTML = '';
    if (!list?.length) {
      ordersListEl.innerHTML = '<p class="empty-text">No supply orders found.</p>';
      return;
    }

    list.forEach(o => {
      const card  = document.createElement('div');
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
        <div><strong>Amount:</strong> ${fmtCurrency(o.allocatedAmount)}</div>
      `;

      left.append(badge, meta);

      const right = document.createElement('div');
      right.className = 'order-actions';

      const statusBadge = document.createElement('div');
      statusBadge.className = `status-badge status-${(o.status || '').toUpperCase()}`;
      statusBadge.textContent = o.status || '—';

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-outline';
      viewBtn.textContent = 'View Details';
      viewBtn.addEventListener('click', () => openModal(o));

      right.append(statusBadge, viewBtn);

      const status = (o.status || '').toUpperCase();
      const stage  = (o.stage  || '').toUpperCase();

      /* FARMER: confirm/reject delivery when DISPATCHED */
      if (role === 'farmer' && status === 'DISPATCHED') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Confirm / Reject Delivery';
        btn.addEventListener('click', () => {
          window.location.href =
            `../supply-confirm/farmer-confirm-delivery.html?orderId=${orderId(o)}`;
        });
        right.appendChild(btn);
      }

      /* FARMER: dispatch harvest when FINAL + FARMER_CONFIRMED */
      if (role === 'farmer' && stage === 'FINAL' && status === 'FARMER_CONFIRMED') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Dispatch Harvest';
        btn.addEventListener('click', () => openDispatchDialog(o));
        right.appendChild(btn);
      }

      /* BUYER: confirm delivery when FINAL + IN_TRANSIT */
      if (role === 'buyer' && stage === 'FINAL' && status === 'IN_TRANSIT') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Confirm Delivery';
        btn.addEventListener('click', () => {
          window.location.href =
            `../supply-confirm/buyer-confirm-delivery.html?orderId=${orderId(o)}`;
        });
        right.appendChild(btn);
      }

      /* BUYER: view system remark on DISPUTE */
      if (role === 'buyer' && status === 'DISPUTE') {
        const btn = document.createElement('button');
        btn.className = 'btn-outline';
        btn.textContent = 'View Dispute';
        btn.addEventListener('click', () => openModal(o));
        right.appendChild(btn);
      }

      card.append(left, right);
      ordersListEl.appendChild(card);
    });
  }

  /* ── Detail modal ── */
  function openModal(o) {
    modalBody.innerHTML = `
      <h3>Order #${orderId(o) || '—'}</h3>
      <div class="modal-body-section">
        <div><strong>Agreement:</strong> #${o.agreementId || '—'}</div>
        <div><strong>Stage:</strong> ${o.stage || '—'}</div>
        <div><strong>Status:</strong> ${o.status || '—'}</div>
        <div><strong>Escrow:</strong> ${o.escrowStatus || '—'}</div>
        <div><strong>Supplier Type:</strong> ${o.supplierType || '—'}</div>
        <div><strong>Allocated:</strong> ${fmtCurrency(o.allocatedAmount)}</div>
        <div><strong>Bill Amount:</strong> ${fmtCurrency(o.billAmount)}</div>
        <div><strong>Expected Delivery:</strong> ${fmtDate(o.expectedDeliveryDate)}</div>
        <div><strong>Actual Delivery:</strong> ${fmtDate(o.actualDeliveryDate)}</div>
        ${o.systemRemark ? `<div class="system-remark"><strong>⚠ System:</strong> ${o.systemRemark}</div>` : ''}
      </div>
    `;

    if (o.items?.length) {
      const sec = document.createElement('div');
      sec.className = 'modal-body-section';
      sec.innerHTML = '<strong>Items</strong>';
      const ul = document.createElement('ul');
      o.items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = `${it.productName || it.description || '—'} — ${it.quantity || '—'} ${it.unit || ''} @ ₹${it.expectedPrice ?? it.rate ?? '—'}`;
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      modalBody.appendChild(sec);
    }

    modal.classList.remove('hidden');
  }

  document.querySelector('#orderModal .modal-close')
    ?.addEventListener('click', () => modal.classList.add('hidden'));
  modal?.addEventListener('click', ev => {
    if (ev.target === modal) modal.classList.add('hidden');
  });

  /* ── Dispatch harvest dialog ── */
  function openDispatchDialog(o) {
    modalBody.innerHTML = `
      <h3>Dispatch Harvest — Order #${orderId(o)}</h3>
      <div class="modal-body-section">
        <div class="form-row">
          <label>Vehicle Number *</label>
          <input id="dVehicle" type="text" placeholder="e.g. WB-1234" />
        </div>
        <div class="form-row">
          <label>Loading Photo URL *</label>
          <input id="dLoadingUrl" type="text" placeholder="https://..." />
        </div>
        <div class="form-row">
          <label>Bag Count</label>
          <input id="dBagCount" type="number" min="0" />
        </div>
        <div id="dMsg" style="color:#c0392b;margin-top:8px;min-height:20px"></div>
        <button id="dSubmit" class="btn-primary" style="margin-top:12px">Submit Dispatch</button>
      </div>
    `;
    modal.classList.remove('hidden');

    document.getElementById('dSubmit').addEventListener('click', async () => {
      const vehicle   = document.getElementById('dVehicle').value.trim();
      const loadingUrl = document.getElementById('dLoadingUrl').value.trim();
      const bagCount  = document.getElementById('dBagCount').value;
      const msgEl     = document.getElementById('dMsg');

      if (!vehicle)    { msgEl.textContent = 'Vehicle number is required'; return; }
      if (!loadingUrl) { msgEl.textContent = 'Loading photo URL is required'; return; }

      try {
        const res = await fetch(`${API}/farmer/dispatch`, {
          method: 'POST', headers: authHeaders(),
          body: JSON.stringify({
            orderId:      orderId(o),
            vehicleNumber: vehicle,
            loadingPhotoUrl: loadingUrl,
            bagCount: bagCount ? Number(bagCount) : null
          })
        });
        if (!res.ok) throw new Error(await res.text() || 'Dispatch failed');
        modal.classList.add('hidden');
        if (window.toast) window.toast('Harvest dispatched — buyer notified');
        else alert('Harvest dispatched — buyer has been notified');
        loadAndRender();
      } catch (err) {
        document.getElementById('dMsg').textContent = err.message || 'Failed';
      }
    });
  }

  async function loadAndRender() {
    ordersListEl.innerHTML = '<p class="empty-text">Loading…</p>';
    renderOrders(await fetchOrders());
  }

  loadAndRender();
  setInterval(loadAndRender, 30000);
})();