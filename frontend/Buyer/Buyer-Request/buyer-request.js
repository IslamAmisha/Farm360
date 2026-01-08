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

//main script
(function () {
  const API_BASE = "http://localhost:8080";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");


  // TRANSLATIONS
  const translations = {
    en: {
      brandName: "Farm360",
      navHome: "Home",
      navModules: "Modules",
      navAbout: "About",
      navInsights: "Insights",
      navSupport: "Support",

      pageTitle: "My Requests",
      pageSubtitle: "Incoming and outgoing requests",
      incomingLabel: "Incoming",
      outgoingLabel: "Outgoing",

      tabIncoming: "Incoming Requests",
      tabOutgoing: "Outgoing Requests",

      statusPENDING: "Pending",
      statusACCEPTED: "Accepted",
      statusREJECTED: "Rejected",

      btnView: "View",
      btnAccept: "Accept",
      btnReject: "Reject",

      sentOn: "Sent On",
      noIncoming: "No incoming requests",
      noOutgoing: "No outgoing requests",
    },

    bn: {
      brandName: "Farm360",
      navHome: "হোম",
      navModules: "মডিউল",
      navAbout: "সম্পর্কিত",
      navInsights: "ইনসাইটস",
      navSupport: "সহায়তা",

      pageTitle: "আমার অনুরোধসমূহ",
      pageSubtitle: "আসা ও পাঠানো অনুরোধসমূহ",
      incomingLabel: "আসা",
      outgoingLabel: "পাঠানো",

      tabIncoming: "আইনকামিং রিকোয়েস্ট",
      tabOutgoing: "আউটগোয়িং রিকোয়েস্ট",

      statusPENDING: "অপেক্ষমাণ",
      statusACCEPTED: "গৃহীত",
      statusREJECTED: "প্রত্যাখ্যাত",

      btnView: "দেখুন",
      btnAccept: "গ্রহণ",
      btnReject: "প্রত্যাখ্যান",

      sentOn: "পাঠানো",
      noIncoming: "কোনো আসা অনুরোধ নেই",
      noOutgoing: "কোনো পাঠানো অনুরোধ নেই",
    },
  };

  let currentLanguage = window.currentLanguage || "en";
  let currentTheme = window.currentTheme || "light";

  function t() {
    return translations[currentLanguage];
  }

//theme and language
  function applyTheme(theme) {
    document.body.classList.toggle("theme-dark", theme === "dark");
    currentTheme = theme;
    window.currentTheme = theme;
  }

  function toggleTheme() {
    applyTheme(currentTheme === "light" ? "dark" : "light");
  }

  function applyLanguage(lang) {
    currentLanguage = lang;
    window.currentLanguage = lang;

    const tr = t();
    document.body.classList.toggle("lang-bn", lang === "bn");

    document.querySelectorAll("[data-text]").forEach((el) => {
      const key = el.dataset.text;
      if (tr[key]) el.textContent = tr[key];
    });

    renderAll();
  }

  function toggleLanguage() {
    applyLanguage(currentLanguage === "en" ? "bn" : "en");
  }

  //state
  let incoming = [];
  let outgoing = [];

  
  // DOM ELEMENTS

  const incomingList = document.getElementById("incomingList");
  const outgoingList = document.getElementById("outgoingList");
  const incomingCount = document.getElementById("incomingCount");
  const outgoingCount = document.getElementById("outgoingCount");

  const tabIncoming = document.getElementById("tabIncoming");
  const tabOutgoing = document.getElementById("tabOutgoing");

  
  // HELPERS

  function formatDate(str) {
    if (!str) return "—";
    const d = new Date(str);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

 
  // API CALLS

  // Farmer → Buyer
  async function loadIncomingRequests() {
    try {
      const res = await fetch(`${API_BASE}/request/incoming?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      incoming = data.requests || [];
    } catch (e) {
      incoming = [];
      console.error("Error incoming:", e);
    }
  }

  // Buyer → Farmer
  async function loadOutgoingRequests() {
    try {
      const res = await fetch(`${API_BASE}/request/outgoing?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      outgoing = data.requests || [];
    } catch (e) {
      outgoing = [];
      console.error("Error outgoing:", e);
    }
  }

  async function handleAccept(id) {
    if (!confirm("Accept this request?")) return;

    await fetch(`${API_BASE}/request/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId: id, action: "ACCEPT", actionUserId: userId }),
    });

    await loadIncomingRequests();
    renderAll();
  }

  async function handleReject(id) {
    if (!confirm("Reject this request?")) return;

    await fetch(`${API_BASE}/request/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId: id, action: "REJECT",actionUserId: userId  }),
    });

    await loadIncomingRequests();
    renderAll();
  }

  // RENDERING
  function updateCounts() {
    incomingCount.textContent = incoming.length;
    outgoingCount.textContent = outgoing.length;
  }

  // INCOMING (Farmer → Buyer)
  function renderIncoming() {
    const tr = t();
    incomingList.innerHTML = "";

    if (!incoming.length) {
      incomingList.innerHTML = `
        <div class="empty-state">📥 ${tr.noIncoming}</div>
      `;
      return;
    }

    incoming.forEach((req) => {
      const statusClass =
        req.status === "PENDING"
          ? "pending"
          : req.status === "ACCEPTED"
          ? "accepted"
          : "rejected";

      const card = document.createElement("div");
      card.className = "request-card";
      card.dataset.requestId = req.requestId;

      card.innerHTML = `
  <div class="request-row">
    <div class="col-left">
     
      <div class="user-company">${req.companyName || ""}</div>
      <div class="user-location">${req.city}, ${req.district}</div>
      <div class="user-rating">👍 ${req.thumbsUp} &nbsp; 👎 ${req.thumbsDown}</div>
    </div>

   

  <div class="request-body">
    <div class="request-dates">${tr.sentOn}: ${formatDate(req.createdAt)}</div>

    <div class="request-actions">

  ${
    req.status === "PENDING"
      ? `
    <button class="btn-accept" data-id="${req.requestId}">
      ${tr.btnAccept}
    </button>
    <button class="btn-reject" data-id="${req.requestId}">
      ${tr.btnReject}
    </button>
    `
      : ""
  }

  <button class="btn-view" data-id="${req.requestId}">
    ${tr.btnView}
  </button>

  ${
    req.status === "ACCEPTED" && !req.proposalId
      ? `
    <button class="btn-primary btn-proposal-create"
      data-request="${req.requestId}">
      Create Proposal
    </button>
    `
      : ""
  }

  ${
    req.proposalId
      ? `
    <button class="btn-outline btn-proposal-edit"
      data-proposal="${req.proposalId}">
      Edit Proposal
    </button>
    `
      : ""
  }

</div>

  </div>
`;


      incomingList.appendChild(card);

      

    });

    // attach events
    incomingList
      .querySelectorAll(".btn-accept")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          handleAccept(e.target.dataset.id)
        )
      );

    incomingList
      .querySelectorAll(".btn-reject")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          handleReject(e.target.dataset.id)
        )
      );
      incomingList.querySelectorAll(".btn-view").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const req = incoming.find(r => r.requestId == id);
    openRequestViewModal(req);
  });
});
  }

  // OUTGOING (Buyer → Farmer)
  function renderOutgoing() {
    const tr = t();
    outgoingList.innerHTML = "";

    if (!outgoing.length) {
      outgoingList.innerHTML = `
        <div class="empty-state">📤 ${tr.noOutgoing}</div>
      `;
      return;
    }

    outgoing.forEach((req) => {
      const statusClass =
        req.status === "PENDING"
          ? "pending"
          : req.status === "ACCEPTED"
          ? "accepted"
          : "rejected";

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
    <div class="request-dates">
      ${tr.sentOn}: ${formatDate(req.createdAt)}
    </div>

    <div class="request-actions">

  ${
    req.status === "ACCEPTED" && !req.proposalId
      ? `<span class="waiting-text">
           Waiting for farmer proposal
         </span>`
      : ""
  }

  ${
    req.proposalId
      ? `<button class="btn-outline btn-proposal-view"
            data-proposal="${req.proposalId}">
           View Proposal
         </button>`
      : `<button class="btn-view" data-id="${req.requestId}">
           ${tr.btnView}
         </button>`
  }

</div>

  </div>
`;


      outgoingList.appendChild(card);
      

    });

    outgoingList.querySelectorAll(".btn-view").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const req = outgoing.find(r => r.requestId == id);
    openRequestViewModal(req);
  });
});
  }

  function renderAll() {
    updateCounts();
    renderIncoming();
    renderOutgoing();
  }

  
  // TABS
  function switchTab(tab) {
    if (tab === "incoming") {
      incomingList.style.display = "flex";
      outgoingList.style.display = "none";
      tabIncoming.classList.add("active");
      tabOutgoing.classList.remove("active");
    } else {
      incomingList.style.display = "none";
      outgoingList.style.display = "flex";
      tabIncoming.classList.remove("active");
      tabOutgoing.classList.add("active");
    }
  }

  
  // INIT
  document.addEventListener("DOMContentLoaded", async () => {
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);

    await loadIncomingRequests();
    await loadOutgoingRequests();

    renderAll();
    switchTab("incoming");
  });

  document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("btn-proposal-create") &&
      !e.target.classList.contains("btn-proposal-edit") &&
      !e.target.classList.contains("btn-view")) {
    return;
  }

  e.stopPropagation();

  // CREATE PROPOSAL
  if (e.target.classList.contains("btn-proposal-create")) {
    const requestId = e.target.dataset.request;
    window.location.href =
      `../../Proposal/proposal.html?requestId=${requestId}`;
  }

  // EDIT PROPOSAL
  if (e.target.classList.contains("btn-proposal-edit")) {
    const proposalId = e.target.dataset.proposal;
    window.location.href =
      `../../Proposal/proposal.html?proposalId=${proposalId}`;
  }

});


  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document
    .getElementById("mobileThemeToggle")
    ?.addEventListener("click", toggleTheme);

  document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
  document
    .getElementById("mobileLangToggle")
    ?.addEventListener("click", toggleLanguage);

  tabIncoming?.addEventListener("click", () => switchTab("incoming"));
  tabOutgoing?.addEventListener("click", () => switchTab("outgoing"));

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    const menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  });
})();

function openRequestViewModal(req) {
  if (!req) return;

  const modal = document.getElementById("requestViewModal");
  const body = document.getElementById("requestViewBody");

  const contractModelText =
    req.contractModel === "ANNUAL"
      ? "Annual"
      : req.contractModel === "SEASONAL"
      ? "Seasonal"
      : "—";

  const seasonText =
    req.contractModel === "ANNUAL"
      ? "All Seasons"
      : req.season || "—";

  body.innerHTML = `
    <div class="request-view-grid">

      <div class="item">
        <label>Crop</label>
        <span>${req.cropName || "—"}</span>
      </div>

      <div class="item">
        <label>Crop Type</label>
        <span>${req.subCategoryName || "—"}</span>
      </div>

      <div class="item">
        <label>Land</label>
        <span>${req.landSize ?? "—"} Acres</span>
      </div>

      <div class="item">
        <label>Contract Model</label>
        <span class="${
          req.contractModel === "ANNUAL"
            ? "contract-annual"
            : "contract-seasonal"
        }">
          ${contractModelText}
        </span>
      </div>

      <div class="item">
        <label>Season</label>
        <span>${seasonText}</span>
      </div>

      <div class="item">
        <label>Status</label>
        <span class="status-badge ${req.status.toLowerCase()}">
          ${req.status}
        </span>
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

document
  .getElementById("closeRequestView")
  ?.addEventListener("click", closeRequestModal);

document
  .getElementById("closeRequestViewBtn")
  ?.addEventListener("click", closeRequestModal);

document
  .getElementById("requestViewModal")
  ?.addEventListener("click", (e) => {
    if (e.target.id === "requestViewModal") {
      closeRequestModal();
    }
  });
