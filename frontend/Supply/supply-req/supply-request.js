(function () {
  // page protection: allow farmer or buyer
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (!token || !['farmer','buyer'].includes(role)) {
    alert('User not found or unauthorized access!');
    localStorage.clear();
    window.location.href = "../../Login/login.html";
    return;
  }

  // DOM refs
  const agreementIdEl = document.getElementById('agreementId');
  const proposalVersionEl = document.getElementById('proposalVersion');
  const stageEl = document.getElementById('stage');
  const supplierTypeEl = document.getElementById('supplierType');
  const expectedDateEl = document.getElementById('expectedDeliveryDate');
  const demandAmountEl = document.getElementById('demandAmount');
  const itemsTableBody = document.querySelector('#itemsTable tbody');
  const addItemBtn = document.getElementById('addItemBtn');
  const supplyForm = document.getElementById('supplyForm');

  // supply item types (example list; include OTHER)
  const SupplyItemType = [
    'SEED',
    'FERTILIZER',
    'CHEMICAL',
    'EQUIPMENT',
    'LABOUR',
    'OTHER'
  ];

  // helper: create select for item type
  function createItemTypeSelect(selected) {
    const sel = document.createElement('select');
    SupplyItemType.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      if (v === selected) opt.selected = true;
      sel.appendChild(opt);
    });
    return sel;
  }

  // fetch active agreements for logged user
  async function loadAgreements() {
    try {
      const res = await fetch('/api/agreements/active', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Failed to load agreements');
      const list = await res.json();
      agreementIdEl.innerHTML = '<option value="">-- Select agreement --</option>';
      list.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.agreementId || a.id || a.agreementId;
        opt.textContent = `${opt.value} — ${a.title || a.counterparty || a.agreementId || ''}`;
        agreementIdEl.appendChild(opt);
      });
    } catch (err) {
      console.error(err);
      // fallback: leave empty
    }
  }

  // fetch item names based on supplierType
  async function loadItemNames(supplierType) {
    try {
      if (!supplierType) return [];
      const url = `/api/item-names?supplierType=${encodeURIComponent(supplierType)}`;
      const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Failed to load item names');
      return await res.json(); // expect array of strings
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  // create a new item row
  async function addItemRow(prefill = {}) {
    const row = document.createElement('tr');

    // Item type
    const tdType = document.createElement('td');
    const itemTypeSelect = createItemTypeSelect(prefill.type || 'SEED');
    tdType.appendChild(itemTypeSelect);

    // Product name (select or text if OTHER)
    const tdProduct = document.createElement('td');
    const productSelect = document.createElement('select');
    const productText = document.createElement('input');
    productText.type = 'text';
    productText.classList.add('hidden');

    tdProduct.appendChild(productSelect);
    tdProduct.appendChild(productText);

    // Brand
    const tdBrand = document.createElement('td');
    const brandInput = document.createElement('input');
    brandInput.type = 'text';
    brandInput.value = prefill.brandName || '';
    tdBrand.appendChild(brandInput);

    // Quantity
    const tdQty = document.createElement('td');
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '0';
    qtyInput.step = '0.01';
    qtyInput.value = prefill.quantity ?? '';
    tdQty.appendChild(qtyInput);

    // Unit
    const tdUnit = document.createElement('td');
    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.value = prefill.unit || '';
    tdUnit.appendChild(unitInput);

    // Expected Price
    const tdPrice = document.createElement('td');
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.min = '0';
    priceInput.step = '0.01';
    priceInput.value = prefill.expectedPrice ?? '';
    tdPrice.appendChild(priceInput);

    // Remove
    const tdRemove = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-danger-outline';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => row.remove());
    tdRemove.appendChild(removeBtn);

    row.appendChild(tdType);
    row.appendChild(tdProduct);
    row.appendChild(tdBrand);
    row.appendChild(tdQty);
    row.appendChild(tdUnit);
    row.appendChild(tdPrice);
    row.appendChild(tdRemove);

    // helper to repopulate product names when supplierType or itemType changes
    async function refreshProductOptions() {
      const supplierType = supplierTypeEl.value;
      const names = await loadItemNames(supplierType);
      productSelect.innerHTML = '';
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '-- Select product --';
      productSelect.appendChild(emptyOpt);
      names.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = n;
        productSelect.appendChild(opt);
      });
      // allow OTHER if product not found
      const otherOpt = document.createElement('option');
      otherOpt.value = 'OTHER';
      otherOpt.textContent = 'OTHER';
      productSelect.appendChild(otherOpt);

      // set prefill value if provided
      if (prefill.productName) {
        const found = Array.from(productSelect.options).some(o => o.value === prefill.productName);
        if (found) productSelect.value = prefill.productName;
        else {
          productSelect.value = 'OTHER';
          productText.value = prefill.productName;
          productText.classList.remove('hidden');
          productSelect.classList.add('hidden');
        }
      }
    }

    // when item type === OTHER show product text input instead of select?
    itemTypeSelect.addEventListener('change', () => {
      // keep product UI unchanged here — requirement was: if user selects OTHER in item type show text input for product name
      if (itemTypeSelect.value === 'OTHER') {
        productSelect.classList.add('hidden');
        productText.classList.remove('hidden');
      } else {
        productSelect.classList.remove('hidden');
        productText.classList.add('hidden');
      }
    });

    // when supplierType changes, reload product options
    supplierTypeEl.addEventListener('change', refreshProductOptions);

    // when productSelect user chooses OTHER, show text input
    productSelect.addEventListener('change', () => {
      if (productSelect.value === 'OTHER') {
        productSelect.classList.add('hidden');
        productText.classList.remove('hidden');
      }
    });

    // initial population
    await refreshProductOptions();

    itemsTableBody.appendChild(row);
    return row;
  }

  addItemBtn.addEventListener('click', () => addItemRow());

  // form validation
  function validateForm() {
    const errors = [];
    const agreementId = agreementIdEl.value;
    const stage = stageEl.value;
    const supplierType = supplierTypeEl.value;
    const demandAmount = parseFloat(demandAmountEl.value || '0');

    if (!agreementId) errors.push('Agreement is required');
    if (!stage) errors.push('Stage is required');
    if (!supplierType) errors.push('Supplier type is required');
    if (!(demandAmount > 0)) errors.push('Demand amount must be greater than 0');

    const rows = Array.from(itemsTableBody.querySelectorAll('tr'));
    if (rows.length === 0) errors.push('At least one item is required');

    rows.forEach((r, idx) => {
      const selType = r.querySelector('select')?.value;
      const prodSel = r.querySelector('select:nth-of-type(2)');
      const prodText = r.querySelector('input[type="text"]');
      const qty = parseFloat(r.querySelector('input[type="number"]')?.value || '0');

      if (!selType) errors.push(`Item ${idx + 1}: type required`);
      const prodVal = prodSel && !prodSel.classList.contains('hidden') ? prodSel.value : (prodText ? prodText.value : '');
      if (!prodVal) errors.push(`Item ${idx + 1}: product name required`);
      if (!(qty > 0)) errors.push(`Item ${idx + 1}: quantity must be > 0`);
    });

    return errors;
  }

  // collect payload
  function collectPayload() {
    const agreementId = agreementIdEl.value;
    const payload = {
      agreementId,
      proposalVersion: proposalVersionEl.value || null,
      stage: stageEl.value,
      supplierType: supplierTypeEl.value,
      demandAmount: parseFloat(demandAmountEl.value),
      expectedDeliveryDate: expectedDateEl.value,
      items: []
    };

    const rows = Array.from(itemsTableBody.querySelectorAll('tr'));
    rows.forEach(r => {
      const selType = r.querySelector('select')?.value;
      const prodSel = r.querySelector('select:nth-of-type(2)');
      const prodText = r.querySelector('input[type="text"]');
      const brand = r.querySelector('td:nth-child(3) input')?.value || '';
      const qty = parseFloat(r.querySelector('td:nth-child(4) input')?.value || '0');
      const unit = r.querySelector('td:nth-child(5) input')?.value || '';
      const price = parseFloat(r.querySelector('td:nth-child(6) input')?.value || '0');

      const productName = prodSel && !prodSel.classList.contains('hidden') ? prodSel.value : (prodText ? prodText.value : '');

      payload.items.push({
        type: selType,
        brandName: brand,
        productName: productName,
        quantity: qty,
        unit: unit,
        expectedPrice: price
      });
    });

    return payload;
  }

  // submit
  supplyForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    const payload = collectPayload();
    try {
      const res = await fetch('/api/advance-supply/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create supply request');
      }

      // success
      // show toast if landing-page.js provides toast(), otherwise alert
      if (window.toast) window.toast('Supply request broadcasted');
      else alert('Supply request broadcasted');

      // redirect to supply orders
      window.location.href = 'supply-orders.html';
    } catch (err) {
      console.error(err);
      alert('Failed to submit supply request');
    }
  });

  // init
  (async function init() {
    await loadAgreements();
    // add one empty item row by default
    await addItemRow();
  })();
})();