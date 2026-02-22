(function () {
  // protect supplier
  (function protect() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = (localStorage.getItem('role') || '').toLowerCase();
    if (!token || !userId || role !== 'supplier') {
      alert('User not found or unauthorized access!');
      localStorage.clear();
      window.location.href = '../../Login/login.html';
      return;
    }
  })();

  const qs = new URLSearchParams(location.search);
  const orderId = qs.get('orderId');
  const API = '/api/advance-supply';

  // DOM refs
  const sumAgreement = document.getElementById('sumAgreement');
  const sumStage = document.getElementById('sumStage');
  const sumAllocated = document.getElementById('sumAllocated');
  const sumExpected = document.getElementById('sumExpected');

  const invoiceNumberEl = document.getElementById('invoiceNumber');
  const deliveryChargeEl = document.getElementById('deliveryCharge');
  const invoicePhotoEl = document.getElementById('invoicePhoto');
  const invoicePreview = document.getElementById('invoicePreview');

  const itemsBody = document.getElementById('itemsBody');
  const addItemBtn = document.getElementById('addItemBtn');

  const totalItemsEl = document.getElementById('totalItems');
  const totalDeliveryEl = document.getElementById('totalDelivery');
  const grandTotalEl = document.getElementById('grandTotal');
  const validationMsg = document.getElementById('validationMsg');
  const submitBtn = document.getElementById('submitInvoiceBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  let items = [];
  let order = null;

  function money(n) { return '₹ ' + (Number(n || 0).toLocaleString()); }

  async function fetchOrder() {
    if (!orderId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/${encodeURIComponent(orderId)}`, { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('fetch-order-failed');
      order = await res.json();
      populateOrder(order);
    } catch (err) {
      console.error(err);
      alert('Failed to load order');
    }
  }

  function populateOrder(o) {
    sumAgreement.textContent = o.agreementId || o.id || '-';
    sumStage.textContent = o.stage || '-';
    sumAllocated.textContent = money(o.allocatedAmount || 0);
    sumExpected.textContent = o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : '-';

    // prefill items from order.items if present
    items = (o.items || []).map((it) => ({ description: it.description || it.productName || '', quantity: it.quantity || 1, rate: it.rate || it.expectedPrice || 0, unit: it.unit || '' }));
    if (items.length === 0) items.push({ description: '', quantity: 1, rate: 0, unit: '' });
    renderItems();
    recalcTotals();
  }

  function renderItems() {
    itemsBody.innerHTML = '';
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input data-idx="${idx}" class="desc" value="${it.description || ''}" /></td>
        <td><input data-idx="${idx}" type="number" class="qty" min="0" value="${it.quantity || 0}" /></td>
        <td><input data-idx="${idx}" type="number" class="rate" min="0" value="${it.rate || 0}" /></td>
        <td><input data-idx="${idx}" class="unit" value="${it.unit || ''}" /></td>
        <td class="amount">${money((it.quantity || 0) * (it.rate || 0))}</td>
        <td><button class="btn-danger-outline remove">Remove</button></td>
      `;

      itemsBody.appendChild(tr);
    });

    // attach listeners
    itemsBody.querySelectorAll('input').forEach((inp) => {
      inp.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        const row = items[idx];
        if (e.target.classList.contains('qty')) row.quantity = Number(e.target.value || 0);
        if (e.target.classList.contains('rate')) row.rate = Number(e.target.value || 0);
        if (e.target.classList.contains('desc')) row.description = e.target.value;
        if (e.target.classList.contains('unit')) row.unit = e.target.value;
        renderItems();
        recalcTotals();
      });
    });

    itemsBody.querySelectorAll('.remove').forEach((btn, i) => {
      btn.addEventListener('click', () => { items.splice(i, 1); if (items.length === 0) items.push({ description: '', quantity: 1, rate: 0, unit: '' }); renderItems(); recalcTotals(); });
    });
  }

  addItemBtn.addEventListener('click', () => { items.push({ description: '', quantity: 1, rate: 0, unit: '' }); renderItems(); recalcTotals(); });

  invoicePhotoEl.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) { invoicePreview.textContent = 'No file chosen'; return; }
    invoicePreview.innerHTML = `<img src="${URL.createObjectURL(f)}" style="max-width:160px;border-radius:8px;border:1px solid var(--border)"/>`;
  });

  deliveryChargeEl.addEventListener('input', recalcTotals);

  function recalcTotals() {
    const itemsTotal = items.reduce((s, it) => s + ((Number(it.quantity || 0) * Number(it.rate || 0)) || 0), 0);
    const delivery = Number(deliveryChargeEl.value || 0);
    const grand = itemsTotal + delivery;
    totalItemsEl.textContent = money(itemsTotal);
    totalDeliveryEl.textContent = money(delivery);
    grandTotalEl.textContent = money(grand);

    // validation: delivery <= 25% of itemsTotal
    validationMsg.textContent = '';
    if (itemsTotal > 0 && delivery > itemsTotal * 0.25) {
      validationMsg.textContent = 'Delivery charge cannot exceed 25% of items total.';
    }
  }

  // helper to upload image and return url (re-uses repo /api/uploads)
  async function uploadImage(file) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/uploads', { method: 'POST', body: fd, headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('upload-failed');
      const body = await res.json();
      return body.url || body.data?.url || null;
    } catch (err) {
      console.error('uploadImage', err);
      return URL.createObjectURL(file);
    }
  }

  // submit invoice
  submitBtn.addEventListener('click', async () => {
    validationMsg.textContent = '';
    const invoiceNumber = invoiceNumberEl.value.trim();
    const deliveryCharge = Number(deliveryChargeEl.value || 0);
    const photoFile = invoicePhotoEl.files[0];

    // validations
    if (!invoiceNumber) return (validationMsg.textContent = 'Invoice number is required');
    if (items.length === 0 || items.reduce((s,i)=>s + (i.quantity||0),0) === 0) return (validationMsg.textContent = 'Add at least one item');
    const itemsTotal = items.reduce((s, it) => s + ((Number(it.quantity || 0) * Number(it.rate || 0)) || 0), 0);
    if (deliveryCharge > itemsTotal * 0.25) return (validationMsg.textContent = 'Delivery charge cannot exceed 25% of items total');
    if (!photoFile) return (validationMsg.textContent = 'Invoice photo is required');

    submitBtn.disabled = true;
    try {
      // upload invoice photo first
      const photoUrl = await uploadImage(photoFile);

      const payload = {
        orderId: orderId,
        invoiceNumber: invoiceNumber,
        deliveryCharge: deliveryCharge,
        invoicePhotoUrl: photoUrl,
        items: items.map((it) => ({ description: it.description, quantity: Number(it.quantity || 0), rate: Number(it.rate || 0), unit: it.unit })),
        proofs: [ { type: 'INVOICE', fileUrl: photoUrl, metadata: {} } ]
      };

      const token = localStorage.getItem('token');
      const res = await fetch('/api/advance-supply/supplier/bill', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('submit-failed');

      (window.toast || alert)('Invoice submitted');
      window.location.href = 'supplier-supply-orders.html';
    } catch (err) {
      console.error(err);
      validationMsg.textContent = 'Failed to submit invoice';
      submitBtn.disabled = false;
    }
  });

  cancelBtn.addEventListener('click', () => window.history.back());

  // init
  (async function init() {
    await fetchOrder();
    recalcTotals();
  })();
})();
