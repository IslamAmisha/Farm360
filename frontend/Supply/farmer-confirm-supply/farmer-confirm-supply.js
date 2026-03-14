/* ============================================================
   Farm360 — Farmer Confirm Delivery
   Farmer accepts or rejects a DISPATCHED supply order.

   Endpoints:
     GET  /api/advance-supply/{orderId}      → load order + invoice
     POST /api/advance-supply/farmer/confirm → accept / reject
     POST /api/uploads                       → upload photos
   ============================================================ */
(function () {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('role') || '').toLowerCase();

  if (!token || role !== 'farmer') {
    alert('User not found or unauthorized access!');
    localStorage.clear();
    window.location.href = '../../Login/login.html';
    return;
  }

  const qs      = new URLSearchParams(location.search);
  const orderId = qs.get('orderId');
  const API_BASE = 'http://localhost:8080';
  const API      = API_BASE + '/api/advance-supply';

  function authHeaders(json = false) {
    const h = { Authorization: 'Bearer ' + token };
    if (json) h['Content-Type'] = 'application/json';
    return h;
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

  function setText(id, v) {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  }

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
    setText('agreementId',    o.agreementId || '—');
    setText('supplierName',   o.supplierName || o.supplierType || '—');
    setText('allocatedAmount', money(o.allocatedAmount));

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

    // Invoice summary
    const inv     = o.invoice || {};
    const itmotal = (inv.items || []).reduce((s, it) => s + (it.amount || 0), 0);
    const grand   = o.billAmount || inv.totalAmount || 0;
    setText('invoiceNumber',  inv.invoiceNumber  || o.invoiceNumber || '—');
    setText('invoiceDate',    fmtDate(inv.createdAt));
    setText('invoiceTotal',   money(grand));
    setText('totalItems',     money(itmotal));
    setText('totalDelivery',  money(inv.deliveryCharge));
    setText('grandTotal',     money(grand));

    // Invoice items table
    const tbody = document.getElementById('itemsBody');
    if (tbody) {
      tbody.innerHTML = '';
      const rows = inv.items?.length ? inv.items : (o.items || []);
      rows.forEach(it => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${it.description || it.productName || '—'}</td>
          <td>${it.quantity || '—'}</td>
          <td>${money(it.rate || it.expectedPrice)}</td>
          <td>${money((it.quantity || 0) * (it.rate || it.expectedPrice || 0))}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Invoice photo — only render if it's a real persistent URL (not a blob)
    const photoUrl  = inv.invoicePhotoUrl || o.invoicePhotoUrl;
    const previewEl = document.getElementById('invoicePreview');
    if (previewEl) {
      if (photoUrl && !photoUrl.startsWith('blob:')) {
        const fullUrl = photoUrl.startsWith('http') ? photoUrl : API_BASE + photoUrl;
        previewEl.innerHTML =
          `<img src="${fullUrl}" alt="invoice" style="max-width:220px;border-radius:8px" />`;
      } else {
        previewEl.innerHTML = `<p style="color:#888;text-align:center;padding:20px">No invoice photo uploaded</p>`;
      }
    }

    // Disable actions if not DISPATCHED
    const acceptBtn = document.getElementById('acceptBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    if ((o.status || '').toUpperCase() !== 'DISPATCHED') {
      if (acceptBtn) acceptBtn.disabled = true;
      if (rejectBtn) rejectBtn.disabled = true;
      showToast('Actions available only for DISPATCHED orders');
    }
  }

  /* ── Upload image → returns a persistent server URL, never a blob ── */
  async function uploadImage(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(API_BASE + '/api/uploads', {
      method: 'POST',
      body: fd,
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Photo upload failed (' + res.status + '). Check your connection.');
    const b = await res.json();
    const url = b.url || b.data?.url || null;
    if (!url) throw new Error('Server did not return a photo URL.');
    return url;
  }

  /* ── Photo previews (local blob for preview only — never sent to server) ── */
  function wirePreview(inputId, previewId) {
    const inp = document.getElementById(inputId);
    const prv = document.getElementById(previewId);
    inp?.addEventListener('change', e => {
      const f = e.target.files[0];
      if (f && prv) prv.innerHTML = `<img src="${URL.createObjectURL(f)}" style="max-width:160px;border-radius:8px"/>`;
    });
  }
  wirePreview('deliveryPhoto', 'deliveryPreview');
  wirePreview('billPhoto',     'billPhotoPreview');

  /* ── Accept ── */
  document.getElementById('acceptBtn')?.addEventListener('click', async () => {
    const validationMsg = document.getElementById('validationMsg');
    if (validationMsg) validationMsg.textContent = '';

    const deliveryFile = document.getElementById('deliveryPhoto')?.files[0];
    const billFile     = document.getElementById('billPhoto')?.files[0];
    const billAmt      = Number(document.getElementById('billAmountEntered')?.value || 0);
    const actualDate   = document.getElementById('actualDeliveryDate')?.value;
    const remark       = (document.getElementById('farmerRemark')?.value || '').trim();

    if (!deliveryFile) { if (validationMsg) validationMsg.textContent = 'Delivery photo required'; return; }
    if (!billFile)     { if (validationMsg) validationMsg.textContent = 'Bill photo required'; return; }
    if (!billAmt)      { if (validationMsg) validationMsg.textContent = 'Bill amount required'; return; }

    document.getElementById('acceptBtn').disabled = true;

    try {
      const [deliveryUrl, billUrl] = await Promise.all([
        uploadImage(deliveryFile),
        uploadImage(billFile)
      ]);

      const res = await fetch(`${API}/farmer/confirm`, {
        method: 'POST', headers: authHeaders(true),
        body: JSON.stringify({
          orderId:            Number(orderId),
          accepted:           true,
          deliveryPhotoUrl:   deliveryUrl,
          billPhotoUrl:       billUrl,
          billAmountEntered:  billAmt,
          actualDeliveryDate: actualDate || null,
          farmerRemark:       remark || null
        })
      });

      if (!res.ok) throw new Error(await res.text() || 'Confirm failed');
      showToast('Delivery accepted — buyer has been notified', 'success');
      setTimeout(() => window.location.href = '../supply-order/supply-orders.html', 800);
    } catch (err) {
      const msg = document.getElementById('validationMsg');
      if (msg) msg.textContent = err.message || 'Failed to accept delivery';
      document.getElementById('acceptBtn').disabled = false;
    }
  });

  /* ── Reject ── */
  document.getElementById('rejectBtn')?.addEventListener('click', async () => {
    const validationMsg = document.getElementById('validationMsg');
    if (validationMsg) validationMsg.textContent = '';

    const remark     = (document.getElementById('farmerRemark')?.value || '').trim();
    const actualDate = document.getElementById('actualDeliveryDate')?.value;

    if (!remark) { if (validationMsg) validationMsg.textContent = 'Rejection reason is required'; return; }

    document.getElementById('rejectBtn').disabled = true;

    try {
      const res = await fetch(`${API}/farmer/confirm`, {
        method: 'POST', headers: authHeaders(true),
        body: JSON.stringify({
          orderId:            Number(orderId),
          accepted:           false,
          deliveryPhotoUrl:   null,
          billPhotoUrl:       null,
          billAmountEntered:  null,
          actualDeliveryDate: actualDate || null,
          farmerRemark:       remark
        })
      });

      if (!res.ok) throw new Error(await res.text() || 'Reject failed');
      showToast('Delivery rejected', 'success');
      window.location.href = '../supply-order/supply-orders.html';
    } catch (err) {
      const msg = document.getElementById('validationMsg');
      if (msg) msg.textContent = err.message || 'Failed to reject delivery';
      document.getElementById('rejectBtn').disabled = false;
    }
  });

  document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());

  fetchOrder();
})();