/* ============================================================
   Farm360 — Buyer Confirm Delivery  (FINAL stage only)
   Buyer reviews transport proofs and confirms delivery,
   which triggers autoApproveAndRelease() on the backend.

   Endpoints:
     GET  /api/advance-supply/{orderId}           → load order
     POST /api/advance-supply/{orderId}/buyer/confirm → confirm
   ============================================================ */
(function () {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('role') || '').toLowerCase();

  if (!token || role !== 'buyer') {
    alert('User not found or unauthorized access!');
    localStorage.clear();
    window.location.href = '../../Login/login.html';
    return;
  }

  const qs      = new URLSearchParams(location.search);
  const orderId = qs.get('orderId');
  const API     = '/api/advance-supply';

  function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
  }

  function money(n) { return '₹ ' + Number(n || 0).toLocaleString('en-IN'); }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      return Array.isArray(d)
        ? new Date(d[0], d[1]-1, d[2]).toLocaleDateString('en-IN')
        : new Date(d).toLocaleDateString('en-IN');
    } catch { return String(d); }
  }

  function showToast(msg, type = 'error') {
    const c = document.getElementById('toast-container');
    if (!c) { console.warn(msg); return; }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  let order = null;

  /* ── Load order ── */
  async function fetchOrder() {
    if (!orderId) { showToast('No order specified'); return; }
    try {
      const res = await fetch(
        `${API}/${encodeURIComponent(orderId)}`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error('Failed to load order');
      order = await res.json();
      populateOrder(order);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to load order');
    }
  }

  function populateOrder(o) {
    setText('agreementId',    o.agreementId  || '—');
    setText('farmerName',     o.farmerName   || '—');
    setText('supplierName',   o.supplierName || o.supplierType || '—');
    setText('allocatedAmount', money(o.allocatedAmount));
    setText('invoiceTotal',   money(o.billAmount || o.invoiceAmount));

    const badge = document.getElementById('stageBadge');
    if (badge) {
      badge.textContent = (o.stage || '—').toUpperCase();
      badge.className   = `badge-stage badge-${(o.stage || '').toUpperCase()}`;
    }

    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
      statusBadge.textContent = o.status || '—';
      statusBadge.className   = `status-badge status-${(o.status || '').toUpperCase()}`;
    }

    // Transport proofs — find vehicle number and photos from proofs[]
    const proofs = o.proofs || [];

    const vehicleProof = proofs.find(p =>
      (p.type || '').toUpperCase() === 'VEHICLE_NUMBER_AT_SOURCE');
    const loadingProof = proofs.find(p =>
      (p.type || '').toUpperCase() === 'FARM_LOADING_PHOTO');
    const warehouseProof = proofs.find(p =>
      (p.type || '').toUpperCase() === 'WAREHOUSE_UNLOADING_PHOTO');

    setText('vehicleNumber', vehicleProof?.metadata || o.vehicleNumber || '—');

    const farmLoadingPrev = document.getElementById('farmLoadingPreview');
    if (farmLoadingPrev && loadingProof?.fileUrl)
      farmLoadingPrev.innerHTML = `<img src="${loadingProof.fileUrl}" alt="farm-loading"/>`;

    const warehousePrev = document.getElementById('warehouseUnloadingPreview');
    if (warehousePrev && warehouseProof?.fileUrl)
      warehousePrev.innerHTML = `<img src="${warehouseProof.fileUrl}" alt="warehouse"/>`;

    // System remark
    if (o.systemRemark) showToast('⚠ ' + o.systemRemark);

    // Enable confirm button only when FINAL + IN_TRANSIT + all proofs present
    const confirmBtn   = document.getElementById('confirmBtn');
    const proofWarning = document.getElementById('proofWarning');

    const isFinal    = (o.stage   || '').toUpperCase() === 'FINAL';
    const inTransit  = (o.status  || '').toUpperCase() === 'IN_TRANSIT';
    const hasVehicle = Boolean(vehicleProof?.metadata || o.vehicleNumber);
    const hasLoading = Boolean(loadingProof?.fileUrl);
    // Warehouse proof is uploaded by supplier — buyer checks it arrived
    const hasWarehouse = Boolean(warehouseProof?.fileUrl);

    const proofsOk = hasVehicle && hasLoading; // warehouse required by autoApprove, encouraged here

    if (!isFinal || !inTransit) {
      if (confirmBtn)   confirmBtn.disabled = true;
      if (proofWarning) proofWarning.textContent =
        'Confirm available only when Stage = FINAL and Status = IN_TRANSIT.';
    } else if (!proofsOk) {
      if (confirmBtn)   confirmBtn.disabled = true;
      const missing = [];
      if (!hasVehicle)   missing.push('Vehicle Number');
      if (!hasLoading)   missing.push('Farm Loading Photo');
      if (!hasWarehouse) missing.push('Warehouse Unloading Photo (supplier must upload)');
      if (proofWarning) proofWarning.textContent = 'Waiting for proof: ' + missing.join(', ');
    } else {
      if (confirmBtn)   confirmBtn.disabled = false;
      if (proofWarning) proofWarning.textContent = '';
    }
  }

  /* ── Confirm ── */
  document.getElementById('confirmBtn')?.addEventListener('click', async () => {
    if (!orderId) { showToast('Order not specified'); return; }
    const btn = document.getElementById('confirmBtn');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(
        `${API}/${encodeURIComponent(orderId)}/buyer/confirm`,
        { method: 'POST', headers: authHeaders() }
      );
      if (!res.ok) throw new Error(await res.text() || 'Confirm failed');

      showToast('Delivery confirmed — escrow release in progress', 'success');

      const agrId = order?.agreementId || '';
      setTimeout(() => {
        window.location.href =
          `../Agreement/agreement.html?agreementId=${encodeURIComponent(agrId)}`;
      }, 900);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Confirm failed');
      const btn = document.getElementById('confirmBtn');
      if (btn) btn.disabled = false;
    }
  });

  /* ── Raise dispute ── */
  document.getElementById('raiseDisputeBtn')?.addEventListener('click', () => {
    const q = new URLSearchParams({ orderId: orderId || '', type: 'dispute' });
    window.location.href = `../../Support/support.html?${q.toString()}`;
  });

  document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());

  fetchOrder();
})();