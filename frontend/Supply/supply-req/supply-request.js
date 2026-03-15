/* ============================================================
   Farm360 — Supply Execution Request
   Farmer or buyer creates a supply request for an active agreement.

   Endpoints:
     GET  /api/agreements/active             → agreement dropdown
     GET  /api/item-names?supplierType=XYZ  → product name dropdown
     POST /api/advance-supply/create         → submit
   ============================================================ */
(function () {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('role') || '').toLowerCase();

  if (!token || !['farmer', 'buyer'].includes(role)) {
    alert('Unauthorized access');
    localStorage.clear();
    window.location.href = '../../Login/login.html';
    return;
  }

  const API_BASE = 'http://localhost:8080';
  const API = API_BASE + '/api/advance-supply';

  function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
  }

  const agreementIdEl     = document.getElementById('agreementId');
  const proposalVersionEl = document.getElementById('proposalVersion');
  const stageEl           = document.getElementById('stage');
  const supplierTypeEl    = document.getElementById('supplierType');
  const expectedDateEl    = document.getElementById('expectedDeliveryDate');
  const demandAmountEl    = document.getElementById('demandAmount');
  const minBillEl         = document.getElementById('minBillAmount');
  const maxBillEl         = document.getElementById('maxBillAmount');
  const deliveryAddressEl = document.getElementById('deliveryAddress');
  const itemsTableBody    = document.querySelector('#itemsTable tbody');
  const addItemBtn        = document.getElementById('addItemBtn');
  const supplyForm        = document.getElementById('supplyForm');

  const ITEM_TYPES = ['SEED','FERTILIZER','PESTICIDE','MACHINERY','EQUIPMENT','LABOUR','SERVICE','OTHER'];

  // Types where quantity, unit and brand are not applicable
  const NO_QTY_TYPES = new Set(['SERVICE', 'LABOUR']);

  /* ── Load active agreements ── */
  async function loadAgreements() {
    try {
      const res = await fetch(API_BASE + '/api/agreements/active', { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed');
      const list = await res.json();

      agreementIdEl.innerHTML = '<option value="">-- Select agreement --</option>';
      list.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.agreementId;
        opt.textContent = `#${a.agreementId} — ${a.counterPartyName || 'Unknown'} (${a.counterPartyRole || ''})`;
        opt.dataset.proposalVersion = a.proposalVersion || '';
        agreementIdEl.appendChild(opt);
      });
    } catch (err) {
      console.error('loadAgreements:', err);
    }
  }

  /* Auto-fill proposalVersion when agreement changes */
  agreementIdEl.addEventListener('change', () => {
    const sel = agreementIdEl.options[agreementIdEl.selectedIndex];
    if (proposalVersionEl) proposalVersionEl.value = sel?.dataset?.proposalVersion || '';
  });

  /* ── Load product names for a supplier type ── */
  async function loadItemNames(supplierType) {
    if (!supplierType) return [];
    try {
      const res = await fetch(
        `${API_BASE}/api/item-names?supplierType=${encodeURIComponent(supplierType)}`,
        { headers: authHeaders() }
      );
      return res.ok ? await res.json() : [];
    } catch (e) { return []; }
  }

  function makeTypeSelect(selected) {
    const sel = document.createElement('select');
    ITEM_TYPES.forEach(v => {
      const o = document.createElement('option');
      o.value = v; o.textContent = v;
      if (v === selected) o.selected = true;
      sel.appendChild(o);
    });
    return sel;
  }

  /* ── Add item row ── */
  async function addItemRow(prefill = {}) {
    const row = document.createElement('tr');

    const tdType     = document.createElement('td');
    const typeSelect = makeTypeSelect(prefill.type || 'SEED');
    tdType.appendChild(typeSelect);

    const tdProduct  = document.createElement('td');
    const prodSelect = document.createElement('select');
    const prodText   = document.createElement('input');
    prodText.type = 'text';
    prodText.placeholder = 'Enter service / product name';
    prodText.classList.add('hidden');
    tdProduct.append(prodSelect, prodText);

    const tdBrand  = document.createElement('td');
    const brandInp = document.createElement('input');
    brandInp.type = 'text'; brandInp.value = prefill.brandName || '';
    brandInp.placeholder = 'Optional';
    tdBrand.appendChild(brandInp);

    const tdQty  = document.createElement('td');
    const qtyInp = document.createElement('input');
    qtyInp.type = 'number'; qtyInp.min = '0'; qtyInp.step = '0.01';
    qtyInp.value = prefill.quantity ?? '';
    qtyInp.placeholder = 'N/A for service';
    tdQty.appendChild(qtyInp);

    const tdUnit  = document.createElement('td');
    const unitInp = document.createElement('input');
    unitInp.type = 'text'; unitInp.value = prefill.unit || '';
    unitInp.placeholder = 'Optional';
    tdUnit.appendChild(unitInp);

    const tdPrice  = document.createElement('td');
    const priceInp = document.createElement('input');
    priceInp.type = 'number'; priceInp.min = '0'; priceInp.step = '0.01';
    priceInp.value = prefill.expectedPrice ?? '';
    tdPrice.appendChild(priceInp);

    const tdRemove  = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button'; removeBtn.className = 'btn-danger-outline';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => row.remove());
    tdRemove.appendChild(removeBtn);

    row.append(tdType, tdProduct, tdBrand, tdQty, tdUnit, tdPrice, tdRemove);

    /* Update qty/unit/brand placeholder visibility based on item type */
    function updateRowForType(typeVal) {
      const isNoQty = NO_QTY_TYPES.has(typeVal);
      qtyInp.placeholder  = isNoQty ? 'N/A' : 'Qty';
      unitInp.placeholder = isNoQty ? 'N/A' : 'Unit';
      brandInp.placeholder = isNoQty ? 'N/A' : 'Brand (optional)';
      qtyInp.style.opacity  = isNoQty ? '0.5' : '1';
      unitInp.style.opacity = isNoQty ? '0.5' : '1';
    }

    /* Reload product options when supplierType or itemType changes */
    async function refreshProducts() {
      const typeVal = typeSelect.value;
      const isOther = typeVal === 'OTHER';
      const isNoQty = NO_QTY_TYPES.has(typeVal);

      updateRowForType(typeVal);

      if (isNoQty) {
        // SERVICE / LABOUR — free-text name only, no dropdown
        prodSelect.classList.add('hidden');
        prodText.classList.remove('hidden');
        prodText.placeholder = typeVal === 'SERVICE' ? 'e.g. Transport to warehouse' : 'e.g. Loading / unloading';
        return;
      }

      if (isOther) {
        prodSelect.classList.add('hidden');
        prodText.classList.remove('hidden');
        prodText.placeholder = 'Enter product name';
        return;
      }

      // Physical items — load from API
      prodText.classList.add('hidden');
      prodSelect.classList.remove('hidden');

      const names = await loadItemNames(supplierTypeEl.value);
      prodSelect.innerHTML = '<option value="">-- Select --</option>';
      names.forEach(n => {
        const o = document.createElement('option');
        o.value = n; o.textContent = n;
        prodSelect.appendChild(o);
      });
      const otherOpt = document.createElement('option');
      otherOpt.value = 'OTHER'; otherOpt.textContent = 'OTHER (type below)';
      prodSelect.appendChild(otherOpt);

      if (prefill.productName) {
        const found = Array.from(prodSelect.options).some(o => o.value === prefill.productName);
        if (found) { prodSelect.value = prefill.productName; }
        else {
          prodSelect.value = 'OTHER';
          prodText.value = prefill.productName;
          prodText.classList.remove('hidden');
          prodSelect.classList.add('hidden');
        }
      }
    }

    typeSelect.addEventListener('change', refreshProducts);
    supplierTypeEl.addEventListener('change', refreshProducts);

    prodSelect.addEventListener('change', () => {
      if (prodSelect.value === 'OTHER') {
        prodSelect.classList.add('hidden');
        prodText.classList.remove('hidden');
      }
    });

    await refreshProducts();
    itemsTableBody.appendChild(row);
  }

  addItemBtn.addEventListener('click', () => addItemRow());

  /* ── Validate ── */
  function validate() {
    const errs = [];
    if (!agreementIdEl.value)  errs.push('Agreement is required');
    if (!stageEl.value)        errs.push('Stage is required');
    if (!supplierTypeEl.value) errs.push('Supplier type is required');
    if (!expectedDateEl.value) errs.push('Expected delivery date is required');
    if (!(parseFloat(demandAmountEl.value) > 0)) errs.push('Demand amount must be > 0');

    const minBill = parseFloat(minBillEl?.value || '0');
    const maxBill = parseFloat(maxBillEl?.value || '0');
    const demand  = parseFloat(demandAmountEl.value || '0');
    const delivAddr = deliveryAddressEl?.value?.trim() || '';

    if (!(minBill >= 0))         errs.push('Min bill amount must be 0 or more');
    if (!(maxBill > 0))          errs.push('Max bill amount must be greater than 0');
    if (minBill > maxBill)       errs.push('Min bill amount cannot exceed max bill amount');
    if (maxBill > demand)        errs.push('Max bill amount cannot exceed demand amount');
    if (!delivAddr)              errs.push('Delivery address is required');

    const rows = Array.from(itemsTableBody.querySelectorAll('tr'));
    if (!rows.length) errs.push('Add at least one item');
    rows.forEach((r, i) => {
      const sels    = r.querySelectorAll('select');
      const typeVal = sels[0]?.value || '';
      const prodSel = sels[1];
      const prodTxt = r.querySelector('input[type="text"]');
      const prod    = (prodSel && !prodSel.classList.contains('hidden'))
        ? prodSel.value : (prodTxt?.value?.trim() || '');
      const qty     = parseFloat(r.querySelector('input[type="number"]')?.value || '0');

      if (!typeVal) errs.push(`Item ${i+1}: type required`);
      if (!prod)    errs.push(`Item ${i+1}: product / service name required`);

      // Quantity only required for physical items (not SERVICE or LABOUR)
      if (!NO_QTY_TYPES.has(typeVal) && !(qty > 0))
        errs.push(`Item ${i+1}: quantity must be > 0`);
    });
    return errs;
  }

  /* ── Collect payload → SupplyExecutionCreateRQ ── */
  function collectPayload() {
    return {
      agreementId:          Number(agreementIdEl.value),
      proposalVersion:      proposalVersionEl?.value ? Number(proposalVersionEl.value) : null,
      stage:                stageEl.value,
      supplierType:         supplierTypeEl.value,
      demandAmount:         parseFloat(demandAmountEl.value),
      expectedDeliveryDate: expectedDateEl.value,
      minBillAmount:        parseFloat(minBillEl?.value || '0'),
      maxBillAmount:        parseFloat(maxBillEl?.value || '0'),
      deliveryAddress:      deliveryAddressEl?.value?.trim() || '',
      items: Array.from(itemsTableBody.querySelectorAll('tr')).map(r => {
        const sels      = r.querySelectorAll('select');
        const typeVal   = sels[0]?.value || '';
        const prodSel   = sels[1];
        const prodTxt   = r.querySelector('input[type="text"]');
        const productName = (prodSel && !prodSel.classList.contains('hidden'))
          ? prodSel.value : (prodTxt?.value?.trim() || '');
        const rawQty    = parseFloat(r.querySelector('td:nth-child(4) input')?.value || '0');
        return {
          type:          typeVal,
          brandName:     r.querySelector('td:nth-child(3) input')?.value || '',
          productName,
          // SERVICE / LABOUR have no physical qty — default to 1 so backend doesn't reject
          quantity:      NO_QTY_TYPES.has(typeVal) ? (rawQty > 0 ? rawQty : 1) : rawQty,
          unit:          r.querySelector('td:nth-child(5) input')?.value?.trim() || null,
          expectedPrice: parseFloat(r.querySelector('td:nth-child(6) input')?.value || '0')
        };
      })
    };
  }

  /* ── Submit ── */
  supplyForm.addEventListener('submit', async ev => {
    ev.preventDefault();
    const errs = validate();
    if (errs.length) { alert(errs.join('\n')); return; }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    try {
      const res = await fetch(`${API}/create`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify(collectPayload())
      });
      if (!res.ok) throw new Error(await res.text() || 'Failed');
      if (window.toast) window.toast('Supply request broadcasted to suppliers');
      else alert('Supply request broadcasted');
      window.location.href = '../supply-order/supply-orders.html';
    } catch (err) {
      alert(err.message || 'Failed to submit');
      submitBtn.disabled = false;
    }
  });

  (async function init() {
    await loadAgreements();
    await addItemRow();
  })();
})();