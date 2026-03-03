//protect buyer
(function protectBuyerRequest() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token || !userId || role !== "buyer") {
    alert("User not found or unauthorized access!");
    localStorage.clear();
    window.location.href = "../../Login/login.html";
    return;
  }
})();

(function () {
  const API_BASE = "http://localhost:8080";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  /* ----------------------------------------------------------
     TRANSLATIONS
  ---------------------------------------------------------- */
  const translations = {
    en: {
      brandName: "Farm360",
      navHome: "Home", navModules: "Modules", navAbout: "About",
      navInsights: "Insights", navSupport: "Support",
      pageTitle: "My Requests",
      pageSubtitle: "Incoming and outgoing requests",
      incomingLabel: "Incoming", outgoingLabel: "Outgoing",
      tabIncoming: "Incoming Requests", tabOutgoing: "Outgoing Requests",
      statusPENDING: "Pending", statusACCEPTED: "Accepted",
      statusREJECTED: "Rejected", statusPROPOSAL_SENT: "Proposal Sent",
      btnView: "View", btnAccept: "Accept", btnReject: "Reject",
      sentOn: "Sent On",
      noIncoming: "No incoming requests", noOutgoing: "No outgoing requests",
    },
    bn: {
      brandName: "Farm360",
      navHome: "হোম", navModules: "মডিউল", navAbout: "সম্পর্কিত",
      navInsights: "ইনসাইটস", navSupport: "সহায়তা",
      pageTitle: "আমার অনুরোধসমূহ",
      pageSubtitle: "আসা ও পাঠানো অনুরোধসমূহ",
      incomingLabel: "আসা", outgoingLabel: "পাঠানো",
      tabIncoming: "আইনকামিং রিকোয়েস্ট", tabOutgoing: "আউটগোয়িং রিকোয়েস্ট",
      statusPENDING: "অপেক্ষমাণ", statusACCEPTED: "গৃহীত",
      statusREJECTED: "প্রত্যাখ্যাত", statusPROPOSAL_SENT: "প্রস্তাব পাঠানো",
      btnView: "দেখুন", btnAccept: "গ্রহণ", btnReject: "প্রত্যাখ্যান",
      sentOn: "পাঠানো",
      noIncoming: "কোনো আসা অনুরোধ নেই", noOutgoing: "কোনো পাঠানো অনুরোধ নেই",
    },
  };

  let currentLanguage = window.currentLanguage || "en";
  let currentTheme = window.currentTheme || "light";
  const t = () => translations[currentLanguage];

  /* ----------------------------------------------------------
     THEME / LANGUAGE
  ---------------------------------------------------------- */
  function applyTheme(theme) {
    document.body.classList.toggle("theme-dark", theme === "dark");
    currentTheme = theme;
    window.currentTheme = theme;
  }
  function toggleTheme() { applyTheme(currentTheme === "light" ? "dark" : "light"); }

  function applyLanguage(lang) {
    currentLanguage = lang;
    window.currentLanguage = lang;
    document.body.classList.toggle("lang-bn", lang === "bn");
    document.querySelectorAll("[data-text]").forEach(el => {
      if (t()[el.dataset.text]) el.textContent = t()[el.dataset.text];
    });
    renderAll();
  }
  function toggleLanguage() { applyLanguage(currentLanguage === "en" ? "bn" : "en"); }

  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */
  let incoming = [];
  let outgoing = [];
  const proposalMeta = new Map(); // proposalId → { proposalStatus, agreementId }

  const incomingList  = document.getElementById("incomingList");
  const outgoingList  = document.getElementById("outgoingList");
  const incomingCount = document.getElementById("incomingCount");
  const outgoingCount = document.getElementById("outgoingCount");
  const tabIncoming   = document.getElementById("tabIncoming");
  const tabOutgoing   = document.getElementById("tabOutgoing");

  function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric"
    });
  }

  function authHeaders() {
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  }

  /* ----------------------------------------------------------
     PROPOSAL META FETCH
  ---------------------------------------------------------- */
  async function fetchProposalMeta(proposalId) {
    if (proposalMeta.has(proposalId)) return proposalMeta.get(proposalId);

    try {
      const res = await fetch(
        `${API_BASE}/api/proposals/${proposalId}?userId=${userId}`,
        { headers: authHeaders() }
      );
      if (!res.ok) { proposalMeta.set(proposalId, null); return null; }

      const proposal = await res.json();
      const isFinal  = proposal.proposalStatus === "FINAL_ACCEPTED";

      let agreementId = null;
      if (isFinal) {
        const agrRes = await fetch(
          `${API_BASE}/api/agreements/by-proposal/${proposalId}`,
          { headers: authHeaders() }
        );
        if (agrRes.ok) {
          const agr = await agrRes.json();
          agreementId = agr.agreementId;
        }
      }

      const meta = { proposalStatus: proposal.proposalStatus, agreementId };
      proposalMeta.set(proposalId, meta);
      return meta;
    } catch (e) {
      proposalMeta.set(proposalId, null);
      return null;
    }
  }

  /* ----------------------------------------------------------
     PROPOSAL BUTTON BUILDER
  ---------------------------------------------------------- */
  function proposalActionPlaceholder(proposalId) {
    return `<span class="proposal-action-loading"
                  data-proposal-action="${proposalId}">…</span>`;
  }

  async function updateProposalActionBtn(proposalId) {
    const meta = await fetchProposalMeta(proposalId);
    document.querySelectorAll(`[data-proposal-action="${proposalId}"]`)
      .forEach(el => { el.outerHTML = proposalBtnHTML(proposalId, meta); });
  }

  function proposalBtnHTML(proposalId, meta) {
    if (meta && meta.proposalStatus === "FINAL_ACCEPTED" && meta.agreementId) {
      return `<button class="btn-success btn-view-agreement"
                data-agreement="${meta.agreementId}">
                ✅ View Agreement
              </button>`;
    }
    return `<button class="btn-outline btn-proposal-view"
              data-proposal="${proposalId}">
              View Proposal
            </button>`;
  }

  /* ----------------------------------------------------------
     API
  ---------------------------------------------------------- */
  async function loadIncomingRequests() {
    try {
      const res = await fetch(`${API_BASE}/request/incoming?userId=${userId}`,
        { headers: authHeaders() });
      const data = await res.json();
      incoming = data.requests || [];
    } catch (e) { incoming = []; }
  }

  async function loadOutgoingRequests() {
    try {
      const res = await fetch(`${API_BASE}/request/outgoing?userId=${userId}`,
        { headers: authHeaders() });
      const data = await res.json();
      outgoing = data.requests || [];
    } catch (e) { outgoing = []; }
  }

  /* ----------------------------------------------------------
     ACCEPT / REJECT
  ---------------------------------------------------------- */
  async function handleAccept(id) {
    if (!confirm("Accept this request?")) return;
    await fetch(`${API_BASE}/request/update`, {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify({ requestId: id, action: "ACCEPT", actionUserId: userId })
    });
    await loadIncomingRequests();
    renderAll();
  }

  async function handleReject(id) {
    if (!confirm("Reject this request?")) return;
    await fetch(`${API_BASE}/request/update`, {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify({ requestId: id, action: "REJECT", actionUserId: userId })
    });
    await loadIncomingRequests();
    renderAll();
  }

  /* ----------------------------------------------------------
     RENDER — INCOMING (Farmer → Buyer)
  ---------------------------------------------------------- */
  function renderIncoming() {
    const tr = t();
    incomingList.innerHTML = "";

    if (!incoming.length) {
      incomingList.innerHTML = `<div class="empty-state">📥 ${tr.noIncoming}</div>`;
      return;
    }

    incoming.forEach(req => {
      const statusClass = (req.status || "pending").toLowerCase();
      const card = document.createElement("div");
      card.className = "request-card";
      card.dataset.requestId = req.requestId;

      card.innerHTML = `
        <div class="request-row">
          <div class="col-left">
            <div class="user-company">${req.companyName || ""}</div>
            <div class="user-location">${req.city || ""}${req.city && req.district ? ", " : ""}${req.district || ""}</div>
            <div class="user-rating">👍 ${req.thumbsUp ?? 0} &nbsp; 👎 ${req.thumbsDown ?? 0}</div>
          </div>

          <div class="request-body">
            <div class="request-status ${statusClass}">
              ${tr["status" + req.status] || req.status}
            </div>
            <div class="request-dates">${tr.sentOn}: ${formatDate(req.createdAt)}</div>

            <div class="request-actions">
              ${req.status === "PENDING" ? `
                <button class="btn-accept" data-id="${req.requestId}">${tr.btnAccept}</button>
                <button class="btn-reject" data-id="${req.requestId}">${tr.btnReject}</button>` : ""}

              <button class="btn-view" data-id="${req.requestId}">${tr.btnView}</button>

              ${req.status === "ACCEPTED" && !req.proposalId ? `
                <button class="btn-primary btn-proposal-create"
                  data-request="${req.requestId}">
                  Create Proposal
                </button>` : ""}

              ${req.proposalId ? proposalActionPlaceholder(req.proposalId) : ""}
            </div>
          </div>
        </div>
      `;

      incomingList.appendChild(card);
      if (req.proposalId) updateProposalActionBtn(req.proposalId);
    });

    incomingList.querySelectorAll(".btn-accept")
      .forEach(btn => btn.addEventListener("click", e => handleAccept(e.target.dataset.id)));
    incomingList.querySelectorAll(".btn-reject")
      .forEach(btn => btn.addEventListener("click", e => handleReject(e.target.dataset.id)));
    incomingList.querySelectorAll(".btn-view")
      .forEach(btn => btn.addEventListener("click", () => {
        const req = incoming.find(r => r.requestId == btn.dataset.id);
        openRequestViewModal(req);
      }));
  }

  /* ----------------------------------------------------------
     RENDER — OUTGOING (Buyer → Farmer)
  ---------------------------------------------------------- */
  function renderOutgoing() {
    const tr = t();
    outgoingList.innerHTML = "";

    if (!outgoing.length) {
      outgoingList.innerHTML = `<div class="empty-state">📤 ${tr.noOutgoing}</div>`;
      return;
    }

    outgoing.forEach(req => {
      const statusClass = (req.status || "pending").toLowerCase();
      const card = document.createElement("div");
      card.className = "request-card";
      card.dataset.requestId = req.requestId;

      card.innerHTML = `
        <div class="request-row">
          <div class="col-left">
            <div class="user-company">${req.companyName || ""}</div>
            <div class="user-location">
              ${req.city || ""}${req.city && req.district ? ", " : ""}${req.district || ""}
            </div>
            <div class="user-rating">
              👍 ${req.thumbsUp ?? 0} &nbsp; 👎 ${req.thumbsDown ?? 0}
            </div>
          </div>

          <div class="request-body">
            <div class="request-status ${statusClass}">
              ${tr["status" + req.status] || req.status}
            </div>
            <div class="request-dates">${tr.sentOn}: ${formatDate(req.createdAt)}</div>

            <div class="request-actions">
              ${req.status === "ACCEPTED" && !req.proposalId ? `
                <span class="waiting-text">Waiting for farmer proposal</span>` : ""}

              ${req.proposalId ? proposalActionPlaceholder(req.proposalId) : ""}

              <button class="btn-view" data-id="${req.requestId}">${tr.btnView}</button>
            </div>
          </div>
        </div>
      `;

      outgoingList.appendChild(card);
      if (req.proposalId) updateProposalActionBtn(req.proposalId);
    });

    outgoingList.querySelectorAll(".btn-view")
      .forEach(btn => btn.addEventListener("click", () => {
        const req = outgoing.find(r => r.requestId == btn.dataset.id);
        openRequestViewModal(req);
      }));
  }

  /* ----------------------------------------------------------
     COUNTS + FULL RE-RENDER
  ---------------------------------------------------------- */
  function renderAll() {
    incomingCount.textContent = incoming.length;
    outgoingCount.textContent = outgoing.length;
    renderIncoming();
    renderOutgoing();
  }

  /* ----------------------------------------------------------
     TABS
  ---------------------------------------------------------- */
  function switchTab(tab) {
    const isIncoming = tab === "incoming";
    incomingList.style.display = isIncoming ? "flex" : "none";
    outgoingList.style.display = isIncoming ? "none" : "flex";
    tabIncoming.classList.toggle("active", isIncoming);
    tabOutgoing.classList.toggle("active", !isIncoming);
  }

  /* ----------------------------------------------------------
     GLOBAL CLICK DELEGATION
  ---------------------------------------------------------- */
  document.addEventListener("click", e => {

    if (e.target.classList.contains("btn-proposal-create")) {
      window.location.href =
        `../../Proposal/proposal.html?requestId=${e.target.dataset.request}`;
      return;
    }

    if (e.target.classList.contains("btn-proposal-edit")) {
      window.location.href =
        `../../Proposal/proposal.html?proposalId=${e.target.dataset.proposal}`;
      return;
    }

    if (e.target.classList.contains("btn-proposal-view")) {
      window.location.href =
        `../../Proposal/Proposal-view/proposal-view.html?proposalId=${e.target.dataset.proposal}`;
      return;
    }

    // NEW: navigate to agreement page
    if (e.target.classList.contains("btn-view-agreement")) {
      window.location.href =
        `../../Agreement/agreement.html?agreementId=${e.target.dataset.agreement}`;
      return;
    }
  });

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", async () => {
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    await loadIncomingRequests();
    await loadOutgoingRequests();
    renderAll();
    switchTab("incoming");
  });

  /* ----------------------------------------------------------
     HEADER CONTROLS
  ---------------------------------------------------------- */
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("mobileThemeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
  document.getElementById("mobileLangToggle")?.addEventListener("click", toggleLanguage);
  tabIncoming?.addEventListener("click", () => switchTab("incoming"));
  tabOutgoing?.addEventListener("click", () => switchTab("outgoing"));
  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    const menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  });

})();

/* ----------------------------------------------------------
   REQUEST VIEW MODAL
---------------------------------------------------------- */
function openRequestViewModal(req) {
  if (!req) return;

  const modal = document.getElementById("requestViewModal");
  const body  = document.getElementById("requestViewBody");

  const contractModelText =
    req.contractModel === "ANNUAL" ? "Annual" :
    req.contractModel === "SEASONAL" ? "Seasonal" : "—";

  const seasonText =
    req.contractModel === "ANNUAL" ? "All Seasons" : req.season || "—";

  body.innerHTML = `
    <div class="request-view-grid">
      <div class="item"><label>Crop</label><span>${req.cropName || "—"}</span></div>
      <div class="item"><label>Crop Type</label><span>${req.subCategoryName || "—"}</span></div>
      <div class="item"><label>Land</label><span>${req.landSize ?? "—"} Acres</span></div>
      <div class="item">
        <label>Contract Model</label>
        <span class="${req.contractModel === "ANNUAL" ? "contract-annual" : "contract-seasonal"}">
          ${contractModelText}
        </span>
      </div>
      <div class="item"><label>Season</label><span>${seasonText}</span></div>
      <div class="item">
        <label>Status</label>
        <span class="status-badge ${(req.status || "").toLowerCase()}">${req.status || "—"}</span>
      </div>
      <div class="item">
        <label>Sent On</label>
        <span>${new Date(req.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  `;

  modal.hidden = false;
  modal.style.display = "flex";
}

function closeRequestModal() {
  document.getElementById("requestViewModal").style.display = "none";
}

document.getElementById("closeRequestView")
  ?.addEventListener("click", closeRequestModal);
document.getElementById("closeRequestViewBtn")
  ?.addEventListener("click", closeRequestModal);
document.getElementById("requestViewModal")
  ?.addEventListener("click", e => {
    if (e.target.id === "requestViewModal") closeRequestModal();
  });