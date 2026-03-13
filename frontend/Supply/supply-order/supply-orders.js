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

  const API = 'http://localhost:8080/api/advance-supply';
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

      /* ── FARMER actions ──────────────────────────────────────────
         Backend flow after this session's fix:

         ADVANCE / MID:
           DISPATCHED → farmer confirms → backend auto-releases → APPROVED
           The "Confirm / Reject Delivery" button is shown for DISPATCHED.
           There is NO intermediate FARMER_CONFIRMED state for these stages.

         FINAL:
           DISPATCHED → farmer confirms → FARMER_CONFIRMED
           → farmer dispatches harvest → IN_TRANSIT
           → buyer confirms → APPROVED
           "Confirm / Reject Delivery" shown for DISPATCHED (all stages).
           "Dispatch Harvest" shown ONLY for FINAL + FARMER_CONFIRMED.
      ─────────────────────────────────────────────────────────────── */

      if (role === 'farmer' && status === 'DISPATCHED') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Confirm / Reject Delivery';
        btn.addEventListener('click', () => {
          window.location.href =
            `/Supply/farmer-confirm-supply/farmer-confirm-supply.html?orderId=${orderId(o)}`;
        });
        right.appendChild(btn);
      }

      /* FINAL-only: dispatch after farmer has confirmed the supply materials */
      if (role === 'farmer' && stage === 'FINAL' && status === 'FARMER_CONFIRMED') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Dispatch Harvest';
        btn.addEventListener('click', () => openDispatchDialog(o));
        right.appendChild(btn);
      }

      /* ── BUYER actions ───────────────────────────────────────────
         Buyer only confirms for FINAL stage when harvest is IN_TRANSIT.
         ADVANCE and MID are released automatically — buyer has no action.
      ─────────────────────────────────────────────────────────────── */

      if (role === 'buyer' && stage === 'FINAL' && status === 'IN_TRANSIT') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Confirm Delivery';
        btn.addEventListener('click', () => {
          window.location.href =
            `../Supply/buyer-confirm-harvest/buyer-confirm-harvest.html?orderId=${orderId(o)}`;
        });
        right.appendChild(btn);
      }

      /* DISPUTE — buyer can review */
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
  <div class="order-modal">

    <div class="modal-header">
      <div>
        <h2>Order #${orderId(o)}</h2>
        <span class="agreement-id">Agreement #${o.agreementId || '—'}</span>
      </div>
    </div>

    <div class="modal-grid">

      <div class="modal-section">
        <h4>Order Info</h4>
        <div class="detail-row">
          <span>Stage</span>
          <span class="badge-stage badge-${o.stage}">${o.stage}</span>
        </div>

        <div class="detail-row">
          <span>Status</span>
          <span class="status-badge status-${o.status}">${o.status}</span>
        </div>

        <div class="detail-row">
          <span>Escrow</span>
          <span>${o.escrowStatus || '—'}</span>
        </div>
      </div>

      <div class="modal-section">
        <h4>Supply Details</h4>

        <div class="detail-row">
          <span>Supplier Type</span>
          <span>${o.supplierType || '—'}</span>
        </div>

        <div class="detail-row">
          <span>Allocated</span>
          <span>${fmtCurrency(o.allocatedAmount)}</span>
        </div>

        <div class="detail-row">
          <span>Bill Amount</span>
          <span>${fmtCurrency(o.billAmount)}</span>
        </div>
      </div>

      <div class="modal-section">
        <h4>Delivery</h4>

        <div class="detail-row">
          <span>Expected</span>
          <span>${fmtDate(o.expectedDeliveryDate)}</span>
        </div>

        <div class="detail-row">
          <span>Actual</span>
          <span>${fmtDate(o.actualDeliveryDate)}</span>
        </div>
      </div>

    </div>

  </div>
`;

    if (o.items?.length) {
      const itemsHTML = `
  <div class="modal-section items-section">
      <h4>Items</h4>
      ${o.items.map(it => `
        <div class="item-row">
          <div>${it.productName}</div>
          <div>${it.quantity} ${it.unit}</div>
          <div>₹${it.expectedPrice}</div>
        </div>
      `).join("")}
  </div>`;
      modalBody.innerHTML += itemsHTML;
    }

    // Show system remark prominently in the modal for DISPUTE orders
    if (o.systemRemark) {
      modalBody.innerHTML += `
  <div class="modal-section" style="border-left:3px solid #e74c3c;padding-left:12px;margin-top:12px">
    <h4 style="color:#e74c3c">⚠ System Remark</h4>
    <p>${o.systemRemark}</p>
  </div>`;
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
      const vehicle    = document.getElementById('dVehicle').value.trim();
      const loadingUrl = document.getElementById('dLoadingUrl').value.trim();
      const bagCount   = document.getElementById('dBagCount').value;
      const msgEl      = document.getElementById('dMsg');

      if (!vehicle)    { msgEl.textContent = 'Vehicle number is required'; return; }
      if (!loadingUrl) { msgEl.textContent = 'Loading photo URL is required'; return; }

      try {
        const res = await fetch(`${API}/farmer/dispatch`, {
          method: 'POST', headers: authHeaders(),
          body: JSON.stringify({
            orderId:         orderId(o),
            vehicleNumber:   vehicle,
            loadingPhotoUrl: loadingUrl,
            bagCount:        bagCount ? Number(bagCount) : null
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