(function () {
  const qs = new URLSearchParams(window.location.search);
  const orderId = qs.get('orderId');
  const API = '/api/advance-supply';
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toLowerCase();

  // DOM refs
  const backBtn = document.getElementById('backBtn');
  const agreementIdEl = document.getElementById('agreementId');
  const stageBadgeEl = document.getElementById('stageBadge');
  const farmerNameEl = document.getElementById('farmerName');
  const supplierNameEl = document.getElementById('supplierName');
  const allocatedAmountEl = document.getElementById('allocatedAmount');
  const invoiceTotalEl = document.getElementById('invoiceTotal');
  const statusBadgeEl = document.getElementById('statusBadge');

  const vehicleNumberEl = document.getElementById('vehicleNumber');
  const farmLoadingPreview = document.getElementById('farmLoadingPreview');
  const warehouseUnloadingPreview = document.getElementById('warehouseUnloadingPreview');

  const confirmBtn = document.getElementById('confirmBtn');
  const raiseDisputeBtn = document.getElementById('raiseDisputeBtn');
  const proofWarning = document.getElementById('proofWarning');

  let order = null;

  function showToast(msg, type = 'error') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  function money(n) { return '₹ ' + (Number(n || 0).toLocaleString()); }
  function statusClass(status) { if (!status) return ''; return 'status-' + String(status).toUpperCase(); }

  // Helper: try to find image URL from various possible fields / proofUrls
  function findImage(o, patterns = []) {
    if (!o) return null;
    // direct named fields
    const keys = Object.keys(o || {});
    for (const k of keys) {
      const v = (o[k] || '').toString();
      if (!v) continue;
      for (const p of patterns) {
        if (k.toLowerCase().includes(p) && (v.startsWith('http') || v.startsWith('/')) ) return v;
      }
    }

    // check common explicit fields
    for (const k of ['farmLoadingPhotoUrl','farmLoadingPhoto','loadingPhotoUrl','loadingPhoto','warehouseUnloadingPhotoUrl','warehouseUnloadingPhoto','unloadingPhotoUrl','unloadingPhoto']) {
      if (o[k]) return o[k];
    }

    // fallback to proofUrls/proofs array
    const arr = (o.proofUrls || o.proofs || []);
    if (Array.isArray(arr) && arr.length) {
      for (const p of patterns) {
        const found = arr.find(u => u && (new RegExp(p, 'i')).test(u));
        if (found) return found;
      }
      // otherwise return first image-like URL
      const first = arr.find(u => /\.(jpg|jpeg|png|webp|gif)$/i.test(u));
      if (first) return first;
    }

    return null;
  }

  async function fetchOrder() {
    if (!orderId) return showToast('Order not specified');
    try {
      const res = await fetch(`${API}/${encodeURIComponent(orderId)}`, { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('fetch-failed');
      order = await res.json();
      populateOrder(order);
    } catch (err) {
      console.error(err);
      showToast('Failed to load order');
    }
  }

  function populateOrder(o) {
    agreementIdEl.textContent = o.agreementId || o.agreement || o.id || '-';
    stageBadgeEl.textContent = (o.stage || '-').toUpperCase();
    stageBadgeEl.className = `badge-stage badge-${(o.stage || '').toUpperCase()}`;

    farmerNameEl.textContent = o.farmerName || o.farmer?.name || '-';
    supplierNameEl.textContent = o.supplierName || o.supplier?.name || '-';

    allocatedAmountEl.textContent = money(o.allocatedAmount || o.demandAmount || 0);
    invoiceTotalEl.textContent = money(o.invoiceAmount || o.total || 0);

    statusBadgeEl.textContent = o.status || '-';
    statusBadgeEl.className = `status-badge ${statusClass(o.status)}`;

    // vehicle number (try several possible fields)
    const veh = o.vehicleNumber || o.vehicle_no || o.truckNumber || o.truckNo || o.vehicleNumberAtSource || o.vehicle || o.vehicleNo || o.truck_no;
    vehicleNumberEl.textContent = veh || (o.transport || {}).vehicleNumber || '—';

    // images
    const farmLoading = findImage(o, ['load', 'loading', 'farm']);
    const warehouseUnload = findImage(o, ['unload', 'unloading', 'warehouse', 'delivery']);

    if (farmLoading) {
      farmLoadingPreview.innerHTML = `<img src="${farmLoading}" alt="farm-loading"/>`;
    }
    if (warehouseUnload) {
      warehouseUnloadingPreview.innerHTML = `<img src="${warehouseUnload}" alt="warehouse-unload"/>`;
    }

    // enable confirm only when conditions met and proofs present
    const isFinal = (String(o.stage || '').toUpperCase() === 'FINAL');
    const inTransit = (String(o.status || '').toUpperCase() === 'IN_TRANSIT');

    const hasVehicle = Boolean(veh || (o.transport && (o.transport.vehicleNumber || o.transport.truckNo)));
    const hasFarmLoading = Boolean(farmLoading);
    const hasWarehouseUnloading = Boolean(warehouseUnload);

    const proofsPresent = hasVehicle && hasFarmLoading && hasWarehouseUnloading;

    if (!isFinal || !inTransit) {
      confirmBtn.disabled = true;
      proofWarning.textContent = 'Confirm available only when Stage = FINAL and Status = IN_TRANSIT.';
    } else if (!proofsPresent) {
      confirmBtn.disabled = true;
      const missing = [];
      if (!hasVehicle) missing.push('Vehicle Number');
      if (!hasFarmLoading) missing.push('Farm Loading Photo');
      if (!hasWarehouseUnloading) missing.push('Warehouse Unloading Photo');
      proofWarning.textContent = 'Missing proof: ' + missing.join(', ');
    } else {
      confirmBtn.disabled = false;
      proofWarning.textContent = '';
    }
  }

  confirmBtn.addEventListener('click', async () => {
    if (!orderId) return showToast('Order not specified');
    confirmBtn.disabled = true;
    try {
      const res = await fetch(`${API}/${encodeURIComponent(orderId)}/buyer/confirm`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) {
        const text = await res.text().catch(() => 'Confirm failed');
        throw new Error(text || 'Confirm failed');
      }
      showToast('Delivery confirmed — escrow release approved', 'success');
      // redirect to agreement view (include agreementId if available)
      const agr = (order && (order.agreementId || order.agreement || order.id)) || '';
      setTimeout(() => { window.location.href = `../Agreement/agreement.html?agreementId=${encodeURIComponent(agr)}`; }, 700);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Confirm failed');
      confirmBtn.disabled = false;
    }
  });

  raiseDisputeBtn.addEventListener('click', () => {
    // navigate to Support with context (simple fallback)
    const q = new URLSearchParams({ orderId: orderId || '', type: 'dispute' });
    window.location.href = `../Support/support.html?${q.toString()}`;
  });

  backBtn.addEventListener('click', () => window.history.back());

  // init
  (function init() {
    if (!token || role !== 'buyer') {
      // client-side guard only — show warning but do not forcibly redirect
      console.warn('Missing token or role != buyer');
    }
    fetchOrder();
  })();

})();
