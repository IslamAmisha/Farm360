//proposal-list.js

/* ============================================================
   Farm360 — My Proposals List
   Shows all proposals sent/received by the current user.

   Endpoint:
     GET /api/proposals/my?userId={id}&role={role}
     → List<ProposalListRS>

   ProposalListRS fields:
     proposalId, requestId, proposalVersion, proposalStatus,
     senderUserId, receiverUserId, senderName, receiverName,
     senderRole, contractModel, season, totalContractAmount,
     pricePerUnit, actionRequiredBy, validUntil, createdAt
   ============================================================ */
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
        ? new Date(d[0], d[1]-1, d[2]).toLocaleDateString('en-IN')
        : new Date(d).toLocaleDateString('en-IN');
    } catch { return String(d); }
  }

  function fmtCurrency(n) {
    if (n == null) return '—';
    return '₹ ' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  // Status → CSS class + label
  const STATUS_META = {
    DRAFT:          { cls: 'draft',          label: 'Draft' },
    SENT:           { cls: 'sent',           label: 'Sent' },
    COUNTERED:      { cls: 'countered',      label: 'Countered' },
    ACCEPTED:       { cls: 'accepted',       label: 'Accepted' },
    FINAL_ACCEPTED: { cls: 'final-accepted', label: 'Finalized' },
    REJECTED:       { cls: 'rejected',       label: 'Rejected' },
    CANCELLED:      { cls: 'cancelled',      label: 'Cancelled' },
    EXPIRED:        { cls: 'expired',        label: 'Expired' },
  };

  function statusBadge(status) {
    const m = STATUS_META[status] || { cls: 'unknown', label: status || '—' };
    return `<span class="status-badge status-${m.cls}">${m.label}</span>`;
  }

  /* ── Load ── */
  async function loadProposals() {
    const listEl = document.getElementById('proposalsList');
    listEl.innerHTML = '<p class="empty-text">Loading…</p>';

    try {
      const res = await fetch(
        `${API_BASE}/api/proposals/my?userId=${userId}&role=${role}`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error('Failed to load proposals');
      const list = await res.json();
      render(list);
    } catch (err) {
      console.error(err);
      listEl.innerHTML = '<p class="empty-text">Failed to load proposals.</p>';
    }
  }

  /* ── Render ── */
  function render(list) {
    const listEl = document.getElementById('proposalsList');
    listEl.innerHTML = '';

    if (!list?.length) {
      listEl.innerHTML = '<p class="empty-text">No proposals found.</p>';
      return;
    }

    // Filter tabs
    const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'ALL';
    const filtered = activeFilter === 'ALL'
      ? list
      : list.filter(p => p.proposalStatus === activeFilter);

    if (!filtered.length) {
      listEl.innerHTML = '<p class="empty-text">No proposals matching this filter.</p>';
      return;
    }

    filtered.forEach(p => {
      const isSender   = String(p.senderUserId) === String(userId);
      const counterParty = isSender ? p.receiverName : p.senderName;
      const myRole     = isSender ? 'Sender' : 'Receiver';
      const actionNeeded = p.actionRequiredBy === role && p.proposalStatus === 'SENT';

      const card = document.createElement('div');
      card.className = 'proposal-card' + (actionNeeded ? ' action-needed' : '');
      card.innerHTML = `
        <div class="proposal-card-left">
          <div class="proposal-card-header">
            <span class="proposal-id">#${p.proposalId}</span>
            <span class="proposal-version">v${p.proposalVersion || 1}</span>
            ${statusBadge(p.proposalStatus)}
            ${actionNeeded ? '<span class="action-badge">Action Required</span>' : ''}
          </div>
          <div class="proposal-card-meta">
            <div><strong>Request:</strong> #${p.requestId || '—'}</div>
            <div><strong>${myRole}:</strong> ${isSender ? 'You' : counterParty || '—'}</div>
            <div><strong>${isSender ? 'To' : 'From'}:</strong> ${isSender ? (counterParty || '—') : 'You'}</div>
            <div><strong>Model:</strong> ${p.contractModel || '—'}${p.season ? ' / ' + p.season : ''}</div>
            <div><strong>Total:</strong> ${fmtCurrency(p.totalContractAmount)}</div>
            <div><strong>Created:</strong> ${fmtDate(p.createdAt)}</div>
            ${p.validUntil ? `<div><strong>Expires:</strong> ${fmtDate(p.validUntil)}</div>` : ''}
          </div>
        </div>
        <div class="proposal-card-actions">
          <button class="btn-outline btn-view" data-id="${p.proposalId}">View</button>
          ${p.requestId ? `<button class="btn-outline btn-history" data-rid="${p.requestId}" data-pid="${p.proposalId}">History</button>` : ''}
        </div>
      `;

      // View → proposal-view page
      card.querySelector('.btn-view').addEventListener('click', () => {
        window.location.href = `../Proposal-view/proposal-view.html?proposalId=${p.proposalId}`;
      });

      // History → proposal-history page
      card.querySelector('.btn-history')?.addEventListener('click', () => {
        const btn = card.querySelector('.btn-history');
        window.location.href =
          `../Proposal-history/proposal-history.html?requestId=${btn.dataset.rid}&proposalId=${btn.dataset.pid}`;
      });

      listEl.appendChild(card);
    });
  }

  /* ── Filter tabs ── */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadProposals();
    });
  });

  /* ── Search ── */
  document.getElementById('proposalSearch')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.proposal-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  loadProposals();
})();