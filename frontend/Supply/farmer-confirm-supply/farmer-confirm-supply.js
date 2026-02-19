(function () {
//   const qs = new URLSearchParams(window.location.search);
//   const orderId = qs.get('orderId');
//   const API = '/api/advance-supply';
//   const token = localStorage.getItem('token');
//   const role = (localStorage.getItem('role') || '').toLowerCase();

  // DOM refs
  const backBtn = document.getElementById('backBtn');
  const agreementIdEl = document.getElementById('agreementId');
  const stageBadgeEl = document.getElementById('stageBadge');
  const supplierNameEl = document.getElementById('supplierName');
  const allocatedAmountEl = document.getElementById('allocatedAmount');
  const invoiceTotalEl = document.getElementById('invoiceTotal');
  const statusBadgeEl = document.getElementById('statusBadge');

  const invoiceNumberEl = document.getElementById('invoiceNumber');
  const invoiceDateEl = document.getElementById('invoiceDate');
  const itemsBody = document.getElementById('itemsBody');
  const totalItemsEl = document.getElementById('totalItems');
  const totalDeliveryEl = document.getElementById('totalDelivery');
  const grandTotalEl = document.getElementById('grandTotal');
  const invoicePreview = document.getElementById('invoicePreview');

  const actualDeliveryDateEl = document.getElementById('actualDeliveryDate');
  const deliveryPhotoEl = document.getElementById('deliveryPhoto');
  const deliveryPreview = document.getElementById('deliveryPreview');
  const billPhotoEl = document.getElementById('billPhoto');
  const billPhotoPreview = document.getElementById('billPhotoPreview');
  const billAmountEnteredEl = document.getElementById('billAmountEntered');
  const farmerRemarkEl = document.getElementById('farmerRemark');
  const validationMsg = document.getElementById('validationMsg');

  const acceptBtn = document.getElementById('acceptBtn');
  const rejectBtn = document.getElementById('rejectBtn');

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

  // upload helper (re-uses /api/uploads)
  async function uploadImage(file) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: fd, headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('upload-failed');
      const body = await res.json();
      return body.url || body.data?.url || null;
    } catch (err) {
      console.error('uploadImage', err);
      return URL.createObjectURL(file);
    }
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
    supplierNameEl.textContent = o.supplierName || o.supplierType || '-';

    allocatedAmountEl.textContent = money(o.allocatedAmount || o.demandAmount || 0);

    const items = (o.items || []).map(it => ({ description: it.description || it.productName || '-', quantity: Number(it.quantity || 0), rate: Number(it.rate || it.expectedPrice || 0) }));
    const itemsTotal = items.reduce((s, it) => s + (it.quantity * it.rate), 0);
    const deliveryCharge = Number(o.deliveryCharge || 0);
    const grand = (o.invoiceAmount != null) ? Number(o.invoiceAmount) : (itemsTotal + deliveryCharge);

    invoiceTotalEl.textContent = money(grand);

    invoiceNumberEl.textContent = o.invoiceNumber || '-';
    invoiceDateEl.textContent = o.invoiceDate ? new Date(o.invoiceDate).toLocaleDateString() : (o.invoiceAt ? new Date(o.invoiceAt).toLocaleDateString() : '-');

    // render items (read-only)
    itemsBody.innerHTML = '';
    if (items.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" class="empty-text">No items</td>`;
      itemsBody.appendChild(tr);
    } else {
      items.forEach(it => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${it.description}</td><td>${it.quantity}</td><td>${money(it.rate)}</td><td class="amount">${money(it.quantity * it.rate)}</td>`;
        itemsBody.appendChild(tr);
      });
    }

    totalItemsEl.textContent = money(itemsTotal);
    totalDeliveryEl.textContent = money(deliveryCharge);
    grandTotalEl.textContent = money(grand);

    // invoice photo preview if provided by supplier
    if (o.invoicePhotoUrl) {
      invoicePreview.innerHTML = `<img src="${o.invoicePhotoUrl}" alt="invoice" />`;
    } else if ((o.proofUrls || []).length) {
      const p = (o.proofUrls || []).find(u => /invoice|bill|receipt/i.test(u) || u.includes('invoice'));
      if (p) invoicePreview.innerHTML = `<img src="${p}" alt="invoice" />`;
    }

    // status
    statusBadgeEl.textContent = o.status || '-';
    statusBadgeEl.className = `status-badge ${statusClass(o.status)}`;

    // disable actions if not DISPATCHED
    if ((o.status || '').toUpperCase() !== 'DISPATCHED') {
      acceptBtn.disabled = true;
      rejectBtn.disabled = true;
      showToast('This page is for DISPATCHED orders only');
    }
  }

  // file previews
  deliveryPhotoEl.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) { deliveryPreview.textContent = 'No file chosen'; return; }
    deliveryPreview.innerHTML = `<img src="${URL.createObjectURL(f)}"/>`;
  });

  billPhotoEl.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) { billPhotoPreview.textContent = 'No file chosen'; return; }
    billPhotoPreview.innerHTML = `<img src="${URL.createObjectURL(f)}"/>`;
  });

  // Accept handler
  acceptBtn.addEventListener('click', async () => {
    validationMsg.textContent = '';

    // strict validation per spec
    const deliveryFile = deliveryPhotoEl.files[0];
    const billFile = billPhotoEl.files[0];
    const billAmountEntered = Number(billAmountEnteredEl.value || 0);

    if (!deliveryFile) return (validationMsg.textContent = 'Delivery photo is required');
    if (!billFile) return (validationMsg.textContent = 'Bill photo is required');
    if (!billAmountEntered) return (validationMsg.textContent = 'Bill amount is required');

    acceptBtn.disabled = true;
    try {
      const deliveryUrl = await uploadImage(deliveryFile);
      const billUrl = await uploadImage(billFile);

      const payload = {
        orderId: orderId,
        accepted: true,
        deliveryPhotoUrl: deliveryUrl,
        billPhotoUrl: billUrl,
        billAmountEntered: billAmountEntered,
        actualDeliveryDate: actualDeliveryDateEl.value || null,
        farmerRemark: (farmerRemarkEl.value || '').trim()
      };

      const res = await fetch('/api/advance-supply/farmer/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => 'Confirm failed');
        throw new Error(text);
      }

      showToast('Delivery accepted', 'success');
      setTimeout(() => { window.location.href = '../supply-order/supply-orders.html'; }, 600);
    } catch (err) {
      console.error(err);
      validationMsg.textContent = err.message || 'Failed to accept delivery';
      acceptBtn.disabled = false;
    }
  });

  // Reject handler
  rejectBtn.addEventListener('click', async () => {
    validationMsg.textContent = '';
    const remark = (farmerRemarkEl.value || '').trim();
    if (!remark) return (validationMsg.textContent = 'Remark is required to reject');

    rejectBtn.disabled = true;
    try {
      const payload = {
        orderId: orderId,
        accepted: false,
        deliveryPhotoUrl: null,
        billPhotoUrl: null,
        billAmountEntered: null,
        actualDeliveryDate: actualDeliveryDateEl.value || null,
        farmerRemark: remark
      };

      const res = await fetch('/api/advance-supply/farmer/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => 'Reject failed');
        throw new Error(text);
      }

      showToast('Delivery rejected', 'success');
      setTimeout(() => { window.location.href = '../supply-order/supply-orders.html'; }, 600);
    } catch (err) {
      console.error(err);
      validationMsg.textContent = err.message || 'Failed to reject delivery';
      rejectBtn.disabled = false;
    }
  });

  backBtn.addEventListener('click', () => window.history.back());

  // init
  (function init() {
    if (!token || role !== 'farmer') {
      // basic client-side guard
      // do not redirect automatically in case of shared dev environment — but show warning
      console.warn('Missing token or role != farmer');
    }
    fetchOrder();
  })();

})();
