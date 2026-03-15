
(function () {
  const token  = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role   = (localStorage.getItem('role') || '').toLowerCase();

  if (!token || !userId) {
    alert('Session expired. Please login again.');
    localStorage.clear();
    window.location.href = '../../Login/login.html';
    return;
  }

  const API_BASE = 'http://localhost:8080';

  function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
  }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      return Array.isArray(d)
        ? new Date(d[0], d[1]-1, d[2]).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
        : new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    } catch { return String(d); }
  }

  const STATUS_META = {
    SIGNED:      { cls: 'signed',      label: 'Active',    icon: '✓' },
    COMPLETED:   { cls: 'completed',   label: 'Completed', icon: '🏆' },
    TERMINATED:  { cls: 'terminated',  label: 'Terminated',icon: '✗' },
    DISPUTED:    { cls: 'disputed',    label: 'Disputed',  icon: '⚠' },
  };

  function statusBadge(status) {
    const m = STATUS_META[status] || { cls: 'unknown', label: status || '—', icon: '?' };
    return `<span class="status-badge status-${m.cls}">${m.icon} ${m.label}</span>`;
  }

  let allAgreements = [];

  /* ── Load ── */
  async function load() {
    const listEl = document.getElementById('agreementsList');
    listEl.innerHTML = '<p class="empty-text">Loading…</p>';

    try {
      const res = await fetch(
        `${API_BASE}/api/agreements/my/agreement`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error('Failed to load agreements');
      allAgreements = await res.json();
      renderAgreements(allAgreements);
      updateSummary(allAgreements);
    } catch (err) {
      console.error(err);
      listEl.innerHTML = '<p class="empty-text">Failed to load agreements.</p>';
    }
  }

  /* ── Summary counts ── */
  function updateSummary(list) {
    const active    = list.filter(a => a.status === 'SIGNED').length;
    const completed = list.filter(a => a.status === 'COMPLETED').length;
    const total     = list.length;

    const el = id => document.getElementById(id);
    if (el('summaryTotal'))     el('summaryTotal').textContent     = total;
    if (el('summaryActive'))    el('summaryActive').textContent    = active;
    if (el('summaryCompleted')) el('summaryCompleted').textContent = completed;
  }

  /* ── Render ── */
  function renderAgreements(list) {
    const listEl = document.getElementById('agreementsList');
    listEl.innerHTML = '';

    const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'ALL';
    const filtered = activeFilter === 'ALL'
      ? list
      : list.filter(a => a.status === activeFilter);

    if (!filtered.length) {
      listEl.innerHTML = `<p class="empty-text">No ${activeFilter === 'ALL' ? '' : activeFilter.toLowerCase() + ' '}agreements found.</p>`;
      return;
    }

    // Sort: SIGNED first, then COMPLETED, by signedAt desc
    filtered.sort((a, b) => {
      if (a.status === 'SIGNED' && b.status !== 'SIGNED') return -1;
      if (b.status === 'SIGNED' && a.status !== 'SIGNED') return  1;
      return 0;
    });

    filtered.forEach(a => {
      const isActive   = a.status === 'SIGNED';
      const cpRole     = a.counterPartyRole || '—';
      const cpName     = a.counterPartyName || `${cpRole} #${a.counterPartyId || '?'}`;

      const card = document.createElement('div');
      card.className = 'agreement-card' + (isActive ? ' agreement-active' : '');
      card.innerHTML = `
        <div class="agreement-card-left">
          <div class="agreement-card-header">
            <span class="agreement-id">Agreement #${a.agreementId}</span>
            ${statusBadge(a.status)}
          </div>

          <div class="agreement-card-meta">
            <div>
              <strong>${role === 'farmer' ? 'Buyer' : 'Farmer'}:</strong>
              ${cpName}
              <span class="role-chip">${cpRole}</span>
            </div>
            <div><strong>Proposal:</strong> #${a.proposalId || '—'} v${a.proposalVersion || 1}</div>
            <div><strong>Request:</strong> #${a.requestId || '—'}</div>
            <div><strong>Signed:</strong> ${fmtDate(a.signedAt)}</div>
          </div>
        </div>

        <div class="agreement-card-right">
          <div class="agreement-actions">
            <button class="btn-primary btn-view-agreement" data-id="${a.agreementId}">
              View Agreement
            </button>
            ${isActive ? `
            <button class="btn-outline btn-supply-request" data-id="${a.agreementId}">
              Create Supply Request
            </button>` : ''}
            <button class="btn-outline btn-supply-orders" data-id="${a.agreementId}">
              Supply Orders
            </button>
          </div>
        </div>
      `;

      // View agreement detail
      card.querySelector('.btn-view-agreement').addEventListener('click', () => {
        window.location.href = `../Agreement/agreement.html?agreementId=${a.agreementId}`;
      });

      // Create supply request (active only, farmer/buyer only)
      card.querySelector('.btn-supply-request')?.addEventListener('click', () => {
        window.location.href =
          `../../Supply/supply-req/supply-request.html?agreementId=${a.agreementId}`;
      });

      // View supply orders for this agreement
      card.querySelector('.btn-supply-orders').addEventListener('click', () => {
        window.location.href =
          `../../Supply/supply-order/supply-orders.html?agreementId=${a.agreementId}`;
      });

      listEl.appendChild(card);
    });
  }

  /* ── Filter tabs ── */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderAgreements(allAgreements);
    });
  });

  /* ── Search ── */
  document.getElementById('agreementSearch')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.agreement-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  load();
})();