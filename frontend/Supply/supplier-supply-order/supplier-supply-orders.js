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

  const API = '/api/advance-supply';
  const availableListEl = document.getElementById('availableList');
  const acceptedListEl = document.getElementById('acceptedList');
  const orderModal = document.getElementById('orderDetailsModal');
  const orderModalBody = document.getElementById('orderDetailsBody');
  const orderModalCloseBtn = document.getElementById('orderModalCloseBtn');

  // Tabs
  const tabAvailableBtn = document.getElementById('tabAvailableBtn');
  const tabMyOrdersBtn = document.getElementById('tabMyOrdersBtn');
  const tabAvailable = document.getElementById('tabAvailable');
  const tabMyOrders = document.getElementById('tabMyOrders');

  function setActiveTab(tab) {
    tabAvailableBtn.classList.toggle('active', tab === 'available');
    tabMyOrdersBtn.classList.toggle('active', tab === 'myorders');
    tabAvailable.classList.toggle('active', tab === 'available');
    tabMyOrders.classList.toggle('active', tab === 'myorders');
  }

  tabAvailableBtn.addEventListener('click', () => setActiveTab('available'));
  tabMyOrdersBtn.addEventListener('click', () => setActiveTab('myorders'));

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
  }

  function formatCurrency(n) { try { return '₹ ' + Number(n || 0).toLocaleString(); } catch (e) { return '₹ 0'; } }

  // render available requests
  function renderAvailable(list) {
    availableListEl.innerHTML = '';
    if (!list || list.length === 0) {
      availableListEl.innerHTML = '<p class="empty-text">No available requests.</p>';
      return;
    }

    list.forEach((o) => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const left = document.createElement('div');
      left.className = 'order-left';
      const badge = document.createElement('div');
      badge.className = 'badge-stage badge-' + (o.stage || 'ADVANCE');
      badge.textContent = (o.stage || '-');

      const meta = document.createElement('div');
      meta.className = 'order-meta';
      meta.innerHTML = `
        <div><strong>Agreement:</strong> ${o.agreementId || o.id || '-'}</div>
        <div><strong>Supplier Type:</strong> ${o.supplierType || '-'}</div>
        <div><strong>Expected:</strong> ${formatDate(o.expectedDeliveryDate)}</div>
      `;

      left.appendChild(badge);
      left.appendChild(meta);

      const right = document.createElement('div');
      right.className = 'order-right';
      const amount = document.createElement('div');
      amount.className = 'order-amount';
      amount.textContent = formatCurrency(o.allocatedAmount || o.phaseAmount || 0);

      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'btn-primary';
      acceptBtn.textContent = 'Accept Order';

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-outline';
      viewBtn.textContent = 'View Details';

      right.appendChild(amount);
      right.appendChild(viewBtn);
      right.appendChild(acceptBtn);

      // handlers
      viewBtn.addEventListener('click', () => openDetailsModal(o));
      acceptBtn.addEventListener('click', async () => {
        acceptBtn.disabled = true;
        try {
          const token = localStorage.getItem('token');
          const id = encodeURIComponent(o.id || o.orderId || o.agreementId);
          const res = await fetch(`${API}/${id}/supplier/accept`, { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
          if (!res.ok) throw new Error('accept-failed');
          // refresh both lists
          await loadAll();
          (window.toast || alert)('Order accepted');
        } catch (err) {
          console.error(err);
          acceptBtn.disabled = false;
          alert('Failed to accept order');
        }
      });

      card.appendChild(left);
      card.appendChild(right);
      availableListEl.appendChild(card);
    });
  }

  // render accepted orders
  function renderAccepted(list) {
    acceptedListEl.innerHTML = '';
    if (!list || list.length === 0) {
      acceptedListEl.innerHTML = '<p class="empty-text">No accepted orders.</p>';
      return;
    }

    list.forEach((o) => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const left = document.createElement('div');
      left.className = 'order-left';
      const badge = document.createElement('div');
      badge.className = 'badge-stage badge-' + (o.stage || 'ADVANCE');
      badge.textContent = (o.stage || '-');

      const meta = document.createElement('div');
      meta.className = 'order-meta';
      meta.innerHTML = `
        <div><strong>Agreement:</strong> ${o.agreementId || o.id || '-'}</div>
        <div><strong>Stage:</strong> ${o.stage || '-'}</div>
        <div><strong>Status:</strong> <span class="status-badge status-${(o.status || '').toUpperCase()}">${o.status || '-'}</span></div>
      `;

      left.appendChild(badge);
      left.appendChild(meta);

      const right = document.createElement('div');
      right.className = 'order-right';
      const amount = document.createElement('div');
      amount.className = 'order-amount';
      amount.textContent = formatCurrency(o.billAmount ?? o.allocatedAmount ?? 0);

      // payment status badge
      const payment = document.createElement('div');
      const payStatus = (o.paymentStatus || 'HELD').toUpperCase();
      const payBadge = document.createElement('div');
      payBadge.className = 'status-badge';
      payBadge.textContent = payStatus;
      if (payStatus === 'HELD') payBadge.classList.add('status-HELD');
      else if (payStatus === 'RELEASED') payBadge.classList.add('status-RELEASED');
      else if (payStatus === 'DISPUTE') payBadge.classList.add('status-DISPUTE');

      const actions = document.createElement('div');
      actions.className = 'order-actions';

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-outline';
      viewBtn.textContent = 'View Details';
      viewBtn.addEventListener('click', () => openDetailsModal(o));

      actions.appendChild(viewBtn);

      // Upload Bill button (only when supplier has accepted but not yet uploaded bill)
      if ((o.status || '').toUpperCase() === 'SUPPLIER_ACCEPTED') {
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'btn-primary';
        uploadBtn.textContent = 'Upload Bill';
        uploadBtn.addEventListener('click', () => {
          const id = encodeURIComponent(o.id || o.orderId || o.agreementId);
          window.location.href = `supplier-upload-bill.html?orderId=${id}`;
        });
        actions.appendChild(uploadBtn);
      }

      right.appendChild(amount);
      right.appendChild(payBadge);
      right.appendChild(actions);

      card.appendChild(left);
      card.appendChild(right);
      acceptedListEl.appendChild(card);
    });
  }

  function openDetailsModal(o) {
    orderModalBody.innerHTML = '';

    const itemsSec = document.createElement('div');
    itemsSec.className = 'modal-section';
    itemsSec.innerHTML = `<strong>Items</strong>`;
    const ul = document.createElement('ul');
    (o.items || []).forEach((it) => {
      const li = document.createElement('li');
      li.textContent = `${it.description || it.productName || '-'} — ${it.quantity || '-'} ${it.unit || ''} (₹ ${it.rate ?? it.expectedPrice ?? '-'})`;
      ul.appendChild(li);
    });
    itemsSec.appendChild(ul);

    const invSec = document.createElement('div');
    invSec.className = 'modal-section';
    invSec.innerHTML = `<strong>Invoice</strong><div>Allocated: ${formatCurrency(o.allocatedAmount || 0)}</div><div>Invoice Amount: ${formatCurrency(o.invoiceAmount || o.billAmount || 0)}</div>`;

    const statusSec = document.createElement('div');
    statusSec.className = 'modal-section';
    statusSec.innerHTML = `<strong>Status</strong><div>${o.status || '-'}</div><div>Payment: ${(o.paymentStatus || 'HELD')}</div>`;

    const remarkSec = document.createElement('div');
    remarkSec.className = 'modal-section';
    if (o.systemRemark) remarkSec.innerHTML = `<strong>System remark</strong><div>${o.systemRemark}</div>`;

    const proofsSec = document.createElement('div');
    proofsSec.className = 'modal-section';
    proofsSec.innerHTML = '<strong>Proofs</strong>';
    const wrap = document.createElement('div');
    (o.proofs || o.proofUrls || []).forEach((url) => {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'proof-thumb';
      wrap.appendChild(img);
    });
    proofsSec.appendChild(wrap);

    orderModalBody.appendChild(itemsSec);
    orderModalBody.appendChild(invSec);
    orderModalBody.appendChild(statusSec);
    if (o.systemRemark) orderModalBody.appendChild(remarkSec);
    orderModalBody.appendChild(proofsSec);

    orderModal.hidden = false;
  }

  orderModalCloseBtn?.addEventListener('click', () => (orderModal.hidden = true));
  orderModal?.addEventListener('click', (e) => { if (e.target === orderModal) orderModal.hidden = true; });

  // LOAD data
  async function loadAll() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    // show placeholder
    availableListEl.innerHTML = '<div class="order-card"><div class="order-meta">Loading…</div></div>';
    acceptedListEl.innerHTML = '<div class="order-card"><div class="order-meta">Loading…</div></div>';

    try {
      // available requests — server filter by status SUPPLIER_NOTIFIED
      const [availResp, myResp] = await Promise.all([
        fetch(`${API}/available?status=SUPPLIER_NOTIFIED`, { headers: { Authorization: 'Bearer ' + token } }),
        fetch(`${API}/my-orders`, { headers: { Authorization: 'Bearer ' + token } })
      ]);

      const available = availResp.ok ? await availResp.json() : [];
      const myOrders = myResp.ok ? await myResp.json() : [];

      // myOrders: filter those where supplierUserId === logged user OR supplier accepted
      const acceptedForMe = (myOrders || []).filter((x) => (x.supplierUserId || x.assignedSupplierId || '').toString() === (userId || '').toString());

      renderAvailable(available || []);
      renderAccepted(acceptedForMe || []);
    } catch (err) {
      console.error('Load supplier supply orders failed', err);
      availableListEl.innerHTML = '<p class="empty-text">Failed to load requests.</p>';
      acceptedListEl.innerHTML = '<p class="empty-text">Failed to load orders.</p>';
    }
  }

  // wire navigation items back to supplier profile / dashboard
  document.getElementById('supplierProfileMenu')?.addEventListener('click', () => { window.location.href = '../Supplier-Profile/supplier-profile.html'; });

  document.addEventListener('DOMContentLoaded', async () => {
    await loadAll();
    setInterval(loadAll, 30000);
  });
})();
