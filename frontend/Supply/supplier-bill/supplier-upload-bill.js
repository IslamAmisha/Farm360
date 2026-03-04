/* ============================================================
   Farm360 — Supplier Upload Bill
   Supplier uploads invoice after accepting an order.

   Endpoints:
     GET  /api/advance-supply/{orderId}    → load order summary
     POST /api/advance-supply/supplier/bill → submit invoice
     POST /api/uploads                     → upload photo
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

  const qs      = new URLSearchParams(location.search);
  const orderId = qs.get('orderId');
  const API     = '/api/advance-supply';

  function authHeaders(json = false) {
    const h = { Authorization: 'Bearer ' + token };
    if (json) h['Content-Type'] = 'application/json';
    return h;
  }

  // DOM refs
  const sumAgreement  = document.getElementById('sumAgreement');
  const sumStage      = document.getElementById('sumStage');
  const sumAllocated  = document.getElementById('sumAllocated');
  const sumExpected   = document.getElementById('sumExpected');
  const invoiceNumber = document.getElementById('invoiceNumber');
  const deliveryCharge= document.getElementById('deliveryCharge');
  const invoicePhotoEl= document.getElementById('invoicePhoto');
  const invoicePreview= document.getElementById('invoicePreview');
  const itemsBody     = document.getElementById('itemsBody');
  const addItemBtn    = document.getElementById('addItemBtn');
  const totalItemsEl  = document.getElementById('totalItems');
  const totalDelivery = document.getElementById('totalDelivery');
  const grandTotalEl  = document.getElementById('grandTotal');
  const validationMsg = document.getElementById('validationMsg');
  const submitBtn     = document.getElementById('submitInvoiceBtn');
  const cancelBtn     = document.getElementById('cancelBtn');

  let items = [];
  let order = null;

  function money(n) { return '₹ ' + Number(n || 0).toLocaleString('en-IN'); }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      return Array.isArray(d)
        ? new Date(d[0], d[1]-1, d[2]).toLocaleDateString('en-IN')
        : new Date(d).toLocaleDateString('en-IN');
    } catch { return String(d); }
  }

  /* ── Load order ── */
  async function fetchOrder() {
    if (!orderId) { alert('No order specified'); return; }
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
      alert(err.message || 'Failed to load order');
    }
  }

  function populateOrder(o) {
    if (sumAgreement) sumAgreement.textContent = o.agreementId || '—';
    if (sumStage)     sumStage.textContent     = o.stage || '—';
    if (sumAllocated) sumAllocated.textContent = money(o.allocatedAmount);
    if (sumExpected)  sumExpected.textContent  = fmtDate(o.expectedDeliveryDate);

    // Pre-fill items from the order (supplier can edit quantities/rates)
    items = (o.items || []).map(it => ({
      description: it.productName || it.description || '',
      quantity: it.quantity || 1,
      rate: it.expectedPrice || it.rate || 0,
      unit: it.unit || ''
    }));
    if (!items.length) items.push({ description: '', quantity: 1, rate: 0, unit: '' });

    renderItems();
    recalcTotals();
  }

  /* ── Render items table ── */
  function renderItems() {
    if (!itemsBody) return;
    itemsBody.innerHTML = '';
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input data-idx="${idx}" class="idesc" value="${it.description || ''}" /></td>
        <td><input data-idx="${idx}" type="number" class="iqty" min="0" value="${it.quantity || 0}" /></td>
        <td><input data-idx="${idx}" type="number" class="irate" min="0" value="${it.rate || 0}" /></td>
        <td><input data-idx="${idx}" class="iunit" value="${it.unit || ''}" /></td>
        <td class="amount">${money((it.quantity || 0) * (it.rate || 0))}</td>
        <td><button class="btn-danger-outline iremove">Remove</button></td>
      `;
      itemsBody.appendChild(tr);
    });

    itemsBody.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', e => {
        const i = Number(e.target.dataset.idx);
        if (e.target.classList.contains('iqty'))  items[i].quantity    = Number(e.target.value);
        if (e.target.classList.contains('irate')) items[i].rate        = Number(e.target.value);
        if (e.target.classList.contains('idesc')) items[i].description = e.target.value;
        if (e.target.classList.contains('iunit')) items[i].unit        = e.target.value;
        renderItems(); recalcTotals();
      });
    });

    itemsBody.querySelectorAll('.iremove').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        items.splice(i, 1);
        if (!items.length) items.push({ description: '', quantity: 1, rate: 0, unit: '' });
        renderItems(); recalcTotals();
      });
    });
  }

  addItemBtn?.addEventListener('click', () => {
    items.push({ description: '', quantity: 1, rate: 0, unit: '' });
    renderItems(); recalcTotals();
  });

  /* ── Photo preview ── */
  invoicePhotoEl?.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f || !invoicePreview) return;
    invoicePreview.innerHTML =
      `<img src="${URL.createObjectURL(f)}" style="max-width:160px;border-radius:8px"/>`;
  });

  deliveryCharge?.addEventListener('input', recalcTotals);

  /* ── Recalc totals + 25% logistics check ── */
  function recalcTotals() {
    const itemsTotal  = items.reduce((s, it) => s + (Number(it.quantity||0) * Number(it.rate||0)), 0);
    const delivery    = Number(deliveryCharge?.value || 0);
    const grand       = itemsTotal + delivery;

    if (totalItemsEl) totalItemsEl.textContent = money(itemsTotal);
    if (totalDelivery) totalDelivery.textContent = money(delivery);
    if (grandTotalEl) grandTotalEl.textContent = money(grand);

    if (validationMsg) validationMsg.textContent = '';
    if (itemsTotal > 0 && delivery > itemsTotal * 0.25 && validationMsg)
      validationMsg.textContent = 'Delivery charge cannot exceed 25% of items total.';
  }

  /* ── Upload image ── */
  async function uploadImage(file) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: fd, headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error();
      const body = await res.json();
      return body.url || body.data?.url || null;
    } catch {
      return URL.createObjectURL(file); // dev fallback
    }
  }

  /* ── Submit invoice ── */
  submitBtn?.addEventListener('click', async () => {
    if (validationMsg) validationMsg.textContent = '';

    const invNum       = invoiceNumber?.value.trim();
    const delivCharge  = Number(deliveryCharge?.value || 0);
    const photoFile    = invoicePhotoEl?.files[0];

    if (!invNum)    { if (validationMsg) validationMsg.textContent = 'Invoice number is required'; return; }
    if (!items.length || items.every(i => !i.quantity))
                    { if (validationMsg) validationMsg.textContent = 'Add at least one item'; return; }
    const itemsTotal = items.reduce((s,it) => s + (Number(it.quantity||0)*Number(it.rate||0)), 0);
    if (delivCharge > itemsTotal * 0.25)
                    { if (validationMsg) validationMsg.textContent = 'Delivery charge exceeds 25% limit'; return; }
    if (!photoFile) { if (validationMsg) validationMsg.textContent = 'Invoice photo is required'; return; }

    submitBtn.disabled = true;

    try {
      const photoUrl = await uploadImage(photoFile);

      const payload = {
        orderId:         Number(orderId),
        invoiceNumber:   invNum,
        deliveryCharge:  delivCharge,
        invoicePhotoUrl: photoUrl,
        items: items.map(it => ({
          description: it.description,
          quantity:    Number(it.quantity || 0),
          rate:        Number(it.rate || 0),
          unit:        it.unit
        })),
        proofs: [{ type: 'INVOICE', fileUrl: photoUrl, metadata: '' }]
      };

      const res = await fetch(`${API}/supplier/bill`, {
        method: 'POST', headers: authHeaders(true),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text() || 'Submit failed');

      if (window.toast) window.toast('Invoice submitted');
      else alert('Invoice submitted — farmer has been notified');
      window.location.href = 'supplier-supply-orders.html';
    } catch (err) {
      console.error(err);
      if (validationMsg) validationMsg.textContent = err.message || 'Failed to submit invoice';
      submitBtn.disabled = false;
    }
  });

  cancelBtn?.addEventListener('click', () => window.history.back());

  (async function init() { await fetchOrder(); })();
})();