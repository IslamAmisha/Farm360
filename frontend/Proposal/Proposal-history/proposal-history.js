//proposal-history.js

/* ============================================================
   Farm360 — Proposal History
   Shows the full negotiation thread for a single request:
   all proposal versions in chronological order with their
   status, who sent each, and action history.

   Endpoint:
     GET /api/proposals/{requestId}/history?userId={id}
     → ProposalHistoryRS {
         requestId,
         proposals: ProposalListRS[],   // all versions, oldest first
         actionHistory: ProposalActionHistoryRS[]
       }

   Also used:
     GET /api/proposals/request/{requestId}?userId={id}
     → List<ProposalRS>  (fallback if history endpoint unavailable)
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

  const API_BASE  = 'http://localhost:8080';
  const params    = new URLSearchParams(window.location.search);
  const requestId = params.get('requestId');
  const highlightId = params.get('proposalId'); // highlight a specific version

  function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
  }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      return Array.isArray(d)
        ? new Date(d[0], d[1]-1, d[2], d[3]||0, d[4]||0).toLocaleString('en-IN')
        : new Date(d).toLocaleString('en-IN');
    } catch { return String(d); }
  }

  function fmtCurrency(n) {
    if (n == null) return '—';
    return '₹ ' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  const STATUS_META = {
    DRAFT:          { cls: 'draft',          label: 'Draft',      icon: '✏' },
    SENT:           { cls: 'sent',           label: 'Sent',       icon: '📤' },
    COUNTERED:      { cls: 'countered',      label: 'Countered',  icon: '↩' },
    ACCEPTED:       { cls: 'accepted',       label: 'Accepted',   icon: '✓' },
    FINAL_ACCEPTED: { cls: 'final-accepted', label: 'Finalized',  icon: '🔒' },
    REJECTED:       { cls: 'rejected',       label: 'Rejected',   icon: '✗' },
    CANCELLED:      { cls: 'cancelled',      label: 'Cancelled',  icon: '⊘' },
  };

  function statusBadge(status) {
    const m = STATUS_META[status] || { cls: 'unknown', label: status || '—', icon: '?' };
    return `<span class="status-badge status-${m.cls}">${m.icon} ${m.label}</span>`;
  }

  /* ── Load ── */
  async function load() {
    if (!requestId) {
      document.getElementById('historyTimeline').innerHTML =
        '<p class="empty-text">No request ID provided.</p>';
      return;
    }

    document.getElementById('historyTimeline').innerHTML =
      '<p class="empty-text">Loading…</p>';

    try {
      // Primary: use history endpoint
      const res = await fetch(
        `${API_BASE}/api/proposals/${requestId}/history?userId=${userId}`,
        { headers: authHeaders() }
      );

      if (res.ok) {
        const data = await res.json();
        renderHistory(data.proposals || [], data.actionHistory || []);
        if (data.requestId) {
          const hdr = document.getElementById('historyRequestId');
          if (hdr) hdr.textContent = '#' + data.requestId;
        }
        return;
      }
    } catch (e) { /* fall through to fallback */ }

    // Fallback: load all proposals for this request
    try {
      const res2 = await fetch(
        `${API_BASE}/api/proposals/request/${requestId}?userId=${userId}`,
        { headers: authHeaders() }
      );
      if (!res2.ok) throw new Error('Failed');
      const proposals = await res2.json();
      // Sort by version ascending
      proposals.sort((a, b) => (a.proposalVersion || 0) - (b.proposalVersion || 0));
      renderHistory(proposals, []);
    } catch (err) {
      console.error(err);
      document.getElementById('historyTimeline').innerHTML =
        '<p class="empty-text">Failed to load proposal history.</p>';
    }
  }

  /* ── Render timeline ── */
  function renderHistory(proposals, actions) {
    const timeline = document.getElementById('historyTimeline');
    timeline.innerHTML = '';

    if (!proposals.length) {
      timeline.innerHTML = '<p class="empty-text">No proposals found for this request.</p>';
      return;
    }

    proposals.forEach((p, idx) => {
      const isSender   = String(p.senderUserId) === String(userId);
      const counterParty = isSender ? (p.receiverName || 'Receiver') : (p.senderName || 'Sender');
      const isHighlighted = String(p.proposalId) === String(highlightId);
      const isFinal    = p.proposalStatus === 'FINAL_ACCEPTED';
      const isLatest   = idx === proposals.length - 1;

      const item = document.createElement('div');
      item.className = 'timeline-item' +
        (isHighlighted ? ' highlighted' : '') +
        (isFinal       ? ' finalized'   : '');

      item.innerHTML = `
        <div class="timeline-connector">
          <div class="timeline-dot ${isFinal ? 'dot-final' : ''}"></div>
          ${idx < proposals.length - 1 ? '<div class="timeline-line"></div>' : ''}
        </div>

        <div class="timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-title">
              <span class="version-label">v${p.proposalVersion || idx+1}</span>
              ${statusBadge(p.proposalStatus)}
              ${isLatest && !isFinal ? '<span class="latest-badge">Latest</span>' : ''}
              ${isFinal ? '<span class="final-badge">🔒 Agreement Created</span>' : ''}
            </div>
            <div class="timeline-date">${fmtDate(p.createdAt || p.validUntil)}</div>
          </div>

          <div class="timeline-card-body">
            <div class="timeline-row">
              <span class="lbl">From</span>
              <span>${isSender ? 'You (' + role + ')' : counterParty + ' (' + (p.senderRole || '?') + ')'}</span>
            </div>
            <div class="timeline-row">
              <span class="lbl">To</span>
              <span>${isSender ? counterParty : 'You (' + role + ')'}</span>
            </div>
            <div class="timeline-row">
              <span class="lbl">Model</span>
              <span>${p.contractModel || '—'}${p.season ? ' / ' + p.season : ''}</span>
            </div>
            <div class="timeline-row">
              <span class="lbl">Total Value</span>
              <span>${fmtCurrency(p.totalContractAmount)}</span>
            </div>
            <div class="timeline-row">
              <span class="lbl">Price/Unit</span>
              <span>${p.pricePerUnit ? fmtCurrency(p.pricePerUnit) : '—'}</span>
            </div>
            ${p.validUntil ? `
            <div class="timeline-row">
              <span class="lbl">Expires</span>
              <span>${fmtDate(p.validUntil)}</span>
            </div>` : ''}
            ${p.remarks ? `
            <div class="timeline-row timeline-remarks">
              <span class="lbl">Remarks</span>
              <span>${p.remarks.split('\n').pop()}</span>
            </div>` : ''}
          </div>

          <div class="timeline-card-actions">
            <button class="btn-outline btn-view-proposal" data-id="${p.proposalId}">
              View Details
            </button>
            ${isFinal ? `
            <button class="btn-primary btn-view-agreement" data-rid="${requestId}" data-pid="${p.proposalId}">
              View Agreement
            </button>` : ''}
          </div>
        </div>
      `;

      // View proposal
      item.querySelector('.btn-view-proposal').addEventListener('click', () => {
        window.location.href =
          `../Proposal-view/proposal-view.html?proposalId=${p.proposalId}`;
      });

      // View agreement (final only)
      item.querySelector('.btn-view-agreement')?.addEventListener('click', async () => {
        try {
          const r = await fetch(
            `${API_BASE}/api/agreements/by-proposal/${p.proposalId}`,
            { headers: authHeaders() }
          );
          if (!r.ok) throw new Error();
          const agr = await r.json();
          window.location.href =
            `/Agreement/agreement.html?agreementId=${agr.agreementId}`;
        } catch {
          alert('Agreement not found for this proposal.');
        }
      });

      timeline.appendChild(item);
    });

    // Action history section (if available)
    if (actions.length) {
      const section = document.createElement('div');
      section.className = 'action-history-section';
      section.innerHTML = `
        <h3 class="section-title">Action Log</h3>
        <table class="action-table">
          <thead>
            <tr><th>Version</th><th>Action</th><th>By</th><th>When</th><th>Remark</th></tr>
          </thead>
          <tbody>
            ${actions.map(a => `
              <tr>
                <td>v${a.proposalVersion || '—'}</td>
                <td><span class="action-type action-${(a.actionType||'').toLowerCase()}">${a.actionType || '—'}</span></td>
                <td>${a.actionBy || '—'}</td>
                <td>${fmtDate(a.actionAt)}</td>
                <td>${a.remarks || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      timeline.appendChild(section);
    }
  }

  /* ── Back button ── */
  document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());

  load();
})();