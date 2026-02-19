(function () {
  // const token = localStorage.getItem('token');
  // const role = (localStorage.getItem('role') || '').toLowerCase();
  // if (!token || !['farmer','buyer'].includes(role)) {
  //   alert('User not found or unauthorized access!');
  //   localStorage.clear();
  //   window.location.href = '../Login/login.html';
  //   return;
  // }

  const ordersListEl = document.getElementById('ordersList');
  const modal = document.getElementById('orderModal');
  const modalBody = document.getElementById('modalBody');

  async function fetchOrders() {
    try {
      const res = await fetch('/api/advance-supply/my-orders', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  function statusClass(status) {
    return 'status-' + (status || '').toUpperCase();
  }

  function formatDate(d) {
    if (!d) return '-';
    const dt = new Date(d);
    return dt.toLocaleDateString();
  }

  function renderOrders(list) {
    ordersListEl.innerHTML = '';
    if (!list || list.length === 0) {
      ordersListEl.innerHTML = '<p class="empty-text">No supply orders found.</p>';
      return;
    }

    list.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const left = document.createElement('div');
      left.className = 'order-left';

      const meta = document.createElement('div');
      meta.className = 'order-meta';
      meta.innerHTML = `
        <div><strong>Agreement:</strong> ${order.agreementId || order.agreement || '-'}</div>
        <div><strong>Supplier:</strong> ${order.supplierType || '-'}</div>
        <div><strong>Expected:</strong> ${formatDate(order.expectedDeliveryDate)}</div>
      `;

      const stageBadge = document.createElement('div');
      stageBadge.className = `badge-stage badge-${order.stage || 'ADVANCE'}`;
      stageBadge.textContent = order.stage || '-';

      left.appendChild(stageBadge);
      left.appendChild(meta);

      const right = document.createElement('div');
      right.className = 'order-actions';

      const amount = document.createElement('div');
      amount.className = 'order-amount';
      amount.textContent = '₹ ' + (order.allocatedAmount ?? order.demandAmount ?? 0);

      const status = document.createElement('div');
      status.className = `status-badge ${statusClass(order.status)}`;
      status.textContent = order.status || '-';

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-outline';
      viewBtn.textContent = 'View Details';
      viewBtn.addEventListener('click', () => openModal(order));

      right.appendChild(amount);
      right.appendChild(status);
      right.appendChild(viewBtn);

      // Confirm Delivery button
      if ((order.status || '').toUpperCase() === 'DISPATCHED') {
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn-primary';
        confirmBtn.textContent = 'Confirm Delivery';
        confirmBtn.addEventListener('click', () => confirmDelivery(order));
        right.appendChild(confirmBtn);
      }

      // Dispatch Harvest button
      if ((order.stage || '').toUpperCase() === 'FINAL' && (order.status || '').toUpperCase() === 'FARMER_CONFIRMED') {
        const dispatchBtn = document.createElement('button');
        dispatchBtn.className = 'btn-primary';
        dispatchBtn.textContent = 'Dispatch Harvest';
        dispatchBtn.addEventListener('click', () => openDispatchDialog(order));
        right.appendChild(dispatchBtn);
      }

      card.appendChild(left);
      card.appendChild(right);
      ordersListEl.appendChild(card);
    });
  }

  // modal helpers
  function openModal(order) {
    modalBody.innerHTML = '';

    const hdr = document.createElement('div');
    hdr.innerHTML = `<h3>Order: ${order.orderId || order.id || '—'}</h3>`;
    modalBody.appendChild(hdr);

    // items
    const itemsSec = document.createElement('div');
    itemsSec.className = 'modal-body-section';
    itemsSec.innerHTML = '<strong>Items</strong>';
    const list = document.createElement('ul');
    (order.items || []).forEach(it => {
      const li = document.createElement('li');
      li.textContent = `${it.productName || '-'} — ${it.quantity || '-'} ${it.unit || ''} (₹ ${it.expectedPrice ?? '-'})`;
      list.appendChild(li);
    });
    itemsSec.appendChild(list);
    modalBody.appendChild(itemsSec);

    // invoice breakdown
    const inv = document.createElement('div');
    inv.className = 'modal-body-section';
    inv.innerHTML = `<strong>Invoice</strong><div>Allocated: ₹ ${order.allocatedAmount ?? 0}</div><div>Invoice Amount: ₹ ${order.invoiceAmount ?? '-'}</div>`;
    modalBody.appendChild(inv);

    // proofs
    const proofsSec = document.createElement('div');
    proofsSec.className = 'modal-body-section';
    proofsSec.innerHTML = '<strong>Proof Images</strong>';
    const proofsWrap = document.createElement('div');
    proofsWrap.className = 'proof-images';
    (order.proofUrls || order.proofs || []).forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      proofsWrap.appendChild(img);
    });
    proofsSec.appendChild(proofsWrap);
    modalBody.appendChild(proofsSec);

    // system remark
    if (order.systemRemark) {
      const rm = document.createElement('div');
      rm.className = 'modal-body-section';
      rm.innerHTML = `<strong>System remark</strong><div>${order.systemRemark}</div>`;
      modalBody.appendChild(rm);
    }

    // timeline
    const timelineSec = document.createElement('div');
    timelineSec.className = 'modal-body-section';
    timelineSec.innerHTML = '<strong>Status timeline</strong>';
    const tlist = document.createElement('ol');
    (order.statusHistory || []).forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.status} — ${s.timestamp ? new Date(s.timestamp).toLocaleString() : ''}`;
      tlist.appendChild(li);
    });
    timelineSec.appendChild(tlist);
    modalBody.appendChild(timelineSec);

    modal.classList.remove('hidden');
  }

  document.querySelector('#orderModal .modal-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) modal.classList.add('hidden');
  });

  // Confirm delivery API
  async function confirmDelivery(order) {
    if (!confirm('Confirm delivery for this order?')) return;
    try {
      const res = await fetch('/api/advance-supply/farmer/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ orderId: order.id || order.orderId })
      });
      if (!res.ok) throw new Error('Confirm failed');
      if (window.toast) window.toast('Delivery confirmed'); else alert('Delivery confirmed');
      loadAndRender();
    } catch (err) {
      console.error(err);
      alert('Failed to confirm delivery');
    }
  }

  // Dispatch harvest: show file input and then call dispatch endpoint
  function openDispatchDialog(order) {
    // reuse modal for upload
    modalBody.innerHTML = '';
    const hdr = document.createElement('div');
    hdr.innerHTML = `<h3>Dispatch Harvest — ${order.orderId || order.id}</h3>`;
    modalBody.appendChild(hdr);

    const inpWrap = document.createElement('div');
    inpWrap.className = 'modal-body-section';
    inpWrap.innerHTML = '<strong>Upload proof images</strong>';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    inpWrap.appendChild(fileInput);
    modalBody.appendChild(inpWrap);

    const actions = document.createElement('div');
    actions.className = 'modal-body-section';
    const sendBtn = document.createElement('button');
    sendBtn.className = 'btn-primary';
    sendBtn.textContent = 'Send Dispatch Proof';
    sendBtn.addEventListener('click', async () => {
      const files = Array.from(fileInput.files || []);
      // upload files first
      const urls = [];
      for (const f of files) {
        try {
          const uploaded = await uploadImage(f);
          if (uploaded) urls.push(uploaded);
        } catch (err) {
          console.error('Upload failed', err);
        }
      }

      // call dispatch API
      try {
        const res = await fetch('/api/advance-supply/farmer/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ orderId: order.id || order.orderId, proofUrls: urls })
        });
        if (!res.ok) throw new Error('Dispatch failed');
        if (window.toast) window.toast('Dispatch submitted'); else alert('Dispatch submitted');
        modal.classList.add('hidden');
        loadAndRender();
      } catch (err) {
        console.error(err);
        alert('Failed to send dispatch');
      }
    });

    actions.appendChild(sendBtn);
    modalBody.appendChild(actions);
    modal.classList.remove('hidden');
  }

  // basic image upload helper — expects /api/uploads to return { url }
  async function uploadImage(file) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: fd, headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Upload failed');
      const body = await res.json();
      return body.url || body.data?.url || null;
    } catch (err) {
      console.error(err);
      // fallback: return object URL so UI shows images (backend will likely reject)
      return URL.createObjectURL(file);
    }
  }

  // refresh loop
  async function loadAndRender() {
    const data = await fetchOrders();
    renderOrders(data);
  }

  loadAndRender();
  setInterval(loadAndRender, 30000); // refresh every 30s
})();