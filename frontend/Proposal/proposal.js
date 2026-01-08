/* =========================================================
   Farm360 – Proposal Page Logic
   Fully Dynamic (DB Driven)
   ========================================================= */

(function () {

  /* ===============================
     CONFIG
  =============================== */

  const API_BASE = "http://localhost:8080";

  /* ===============================
     GLOBAL STATE
  =============================== */

  const state = {
    user: {
      id: Number(localStorage.getItem("userId")),
      role: localStorage.getItem("role") // FARMER / BUYER
    },
    farmerProfile: null,
    proposal: null,
    lands: [],
    cropsMaster: [],
     showSeason: true,
    deliveryLocations: [
      { id: "WAREHOUSE", name: "Warehouse" },
      { id: "FARM_GATE", name: "Farm Gate" }
    ],
    logisticsBy: [
      { id: "BUYER", name: "Buyer" },
      { id: "FARMER", name: "Farmer" }
    ]
  };

  /* ===============================
     HELPERS
  =============================== */

  const $ = (q) => document.querySelector(q);
  const $$ = (q) => Array.from(document.querySelectorAll(q));

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    };
  }

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      requestId: params.get("requestId"),
      proposalId: params.get("proposalId")
    };
  }

  function formatDate(d) {
    return d ? new Date(d).toLocaleDateString() : "—";
  }

  function emptyCrop() {
    return {
      cropId: "",
      cropSubCategoryId: "",
       season: null,    
      expectedQuantity: "",
      unit: "QUINTAL",
      landAreaUsed: ""
    };
  }

  /* ===============================
     API LOADERS
  =============================== */

  async function loadFarmerProfile() {
    const res = await fetch(`${API_BASE}/api/profile/farmer`, {
      headers: authHeaders()
    });
    state.farmerProfile = await res.json();
  }

  async function loadFarmerLands() {
    const res = await fetch(
      `${API_BASE}/api/farmers/${state.user.id}/lands`,
      { headers: authHeaders() }
    );
    state.lands = await res.json();
  }

  async function loadCropMasters() {
    const res = await fetch(`${API_BASE}/master/crops`, {
      headers: authHeaders()
    });
    state.cropsMaster = await res.json();
  }

  async function loadSubcategories(cropId) {
    const res = await fetch(
      `${API_BASE}/master/subcategories/${cropId}`,
      { headers: authHeaders() }
    );
    return await res.json();
  }

  async function loadProposalContext() {
    const { requestId, proposalId } = getQueryParams();

    if (proposalId) {
      const res = await fetch(
        `${API_BASE}/api/proposals/${proposalId}?userId=${state.user.id}`,
        { headers: authHeaders() }
      );
      state.proposal = await res.json();
    } else {
      state.proposal = {
        requestId,
        senderUserId: state.user.id,
        proposalStatus: "DRAFT",
        actionRequiredBy: "FARMER",
        proposalCrops: [emptyCrop()]
      };
    }
  }
function toggleContractModel() {
  const model = document.getElementById("contractModel").value;
  const seasonField = document.getElementById("seasonSelect").closest("div");

  state.proposal.contractModel = model;

  if (model === "SEASONAL") {
    state.showSeason = true;
    seasonField.style.display = "block";
    state.proposal.proposalCrops = [emptyCrop()];
  }

  if (model === "ANNUAL") {
    state.showSeason = false;
    seasonField.style.display = "none"; // ✅ IMPORTANT
    state.proposal.season = null;
    state.proposal.proposalCrops = [
      emptyCrop(), emptyCrop(), emptyCrop()
    ];
  }

  renderCrops();
}




  /* ===============================
     RENDER FUNCTIONS
  =============================== */


function renderLand() {
  const sel = document.getElementById("landSelect");
  sel.innerHTML = `<option value="">Select Land</option>`;

  state.lands.forEach(l => {
    const label = `Land ${l.landId} (${l.size} acre) – ${
      l.crops?.map(c => c.name).join(", ") || ""
    }`;
    sel.add(new Option(label, l.landId));
  });

  sel.onchange = () => {
    const land = state.lands.find(l => l.landId == sel.value);

    document.getElementById("totalLand").value = land ? land.size : "";

    state.proposal.landId = land ? land.landId : null;

    // 🔴 IMPORTANT: reset land usage when land changes
    state.proposal.landAreaUsed = null;
    document.getElementById("landUsed").value = "";
  };

  // ✅ CORRECT PLACE FOR BINDING
  document.getElementById("landUsed").oninput = (e) => {
    const val = Number(e.target.value);
    state.proposal.landAreaUsed = val > 0 ? val : null;
  };
}




  function renderCrops() {
  const container = document.querySelector(".crop-row").parentElement;
  container.querySelectorAll(".crop-row").forEach(r => r.remove());

  state.proposal.proposalCrops.forEach((c, idx) => {
    const row = document.createElement("div");
    row.className = "crop-row";

    row.innerHTML = `
      <select class="crop"></select>
      <select class="sub"></select>
      ${
        state.showSeason
          ? `<select class="season">
               <option value="">Season</option>
               <option value="KHARIF">KHARIF</option>
               <option value="RABI">RABI</option>
               <option value="ZAID">ZAID</option>
             </select>`
          : ``
      }
      <input type="number" placeholder="Qty">
      <select class="unit">
        <option value="QUINTAL">QUINTAL</option>
        <option value="TON">TON</option>
      </select>
      <input type="number" placeholder="Area (acre)">
    `;

    container.insertBefore(row, container.lastElementChild);

    bindCropRow(row, c);
    const qtyInput = row.querySelector('input[placeholder="Qty"]');
const areaInput = row.querySelector('input[placeholder="Area (acre)"]');
const unitSel = row.querySelector('.unit');
const seasonSel = row.querySelector('.season');

qtyInput.oninput = () => {
  c.expectedQuantity = qtyInput.value;
  recalcTotalAmount();
};

areaInput.oninput = () => {
  c.landAreaUsed = areaInput.value;
  validateLandArea();
};

unitSel.onchange = () => {
  c.unit = unitSel.value;
};

if (seasonSel) {
  seasonSel.onchange = () => {
   c.season = seasonSel.value || null;
  };
}


  });
}


  function renderDelivery() {
  const locSel = document.getElementById("deliveryLocation");
  const logSel = document.getElementById("logisticsBy");

  locSel.innerHTML = "";
  logSel.innerHTML = "";

  ["BUYER_WAREHOUSE", "MANDI", "FARM_GATE", "CUSTOM"]
    .forEach(v => locSel.add(new Option(v.replace("_", " "), v)));

  ["BUYER", "FARMER", "SHARED"]
    .forEach(v => logSel.add(new Option(v, v)));

  locSel.value = state.proposal.deliveryLocation || "";
  logSel.value = state.proposal.logisticsHandledBy || "";
}
function bindCropRow(row, cropModel) {
  const cropSel = row.querySelector(".crop");
  const subSel = row.querySelector(".sub");

  cropSel.innerHTML = `<option value="">Crop</option>`;
  subSel.innerHTML = `<option value="">Sub-category</option>`;

  const model = state.proposal.contractModel;
  let crops = [];

  if (model === "SEASONAL") {
    const land = state.lands.find(l => l.landId == state.proposal.landId);
    crops = land ? land.crops : [];
  } else {
    crops = state.cropsMaster;
  }

  // ❗ prevent duplicates in ANNUAL
  const selectedIds = state.proposal.proposalCrops
    .map(c => c.cropId)
    .filter(Boolean);

  crops.forEach(c => {
    if (model === "ANNUAL" && selectedIds.includes(String(c.id))) return;
    cropSel.add(new Option(c.name, c.id));
  });

  cropSel.onchange = async () => {
    cropModel.cropId = cropSel.value;
    subSel.innerHTML = `<option value="">Sub-category</option>`;

    let subs = [];

    if (model === "SEASONAL") {
      const land = state.lands.find(l => l.landId == state.proposal.landId);
      const crop = land.crops.find(c => c.id == cropSel.value);
      subs = crop.subcategories;
    } else {
      subs = await loadSubcategories(cropSel.value);
    }

    subs.forEach(sc => subSel.add(new Option(sc.name, sc.id)));
  };
}


function validateLandArea() {
  const land = state.lands.find(l => l.landId == state.proposal.landId);
  if (!land) return true;

  const model = state.proposal.contractModel;

  if (model === "SEASONAL") {
    // Same season → land is split
    const totalUsed = state.proposal.proposalCrops.reduce(
      (sum, c) => sum + (Number(c.landAreaUsed) || 0),
      0
    );

    if (totalUsed > land.size) {
      alert(
        `Total crop area (${totalUsed}) exceeds land size (${land.size})`
      );
      return false;
    }
  }

  if (model === "ANNUAL") {
    // Different seasons → land reused
    for (const c of state.proposal.proposalCrops) {
      const used = Number(c.landAreaUsed) || 0;
      if (used > land.size) {
        alert(
          `Crop area (${used}) cannot exceed land size (${land.size})`
        );
        return false;
      }
    }
  }

  return true;
}

function applyPermissions() {
  const editable = state.proposal.proposalStatus === "DRAFT";

  document
    .querySelectorAll("input, select, textarea")
    .forEach(el => el.disabled = !editable);
}
function renderVersionInfo() {
  if (!state.proposal.proposalVersion) return;

  document.querySelector(".proposal-side").innerHTML += `
    <hr>
    <p><strong>Version:</strong> v${state.proposal.proposalVersion}</p>
  `;
}
function recalcTotalAmount() {
  const price = Number(state.proposal.pricePerUnit || 0);

  const total = state.proposal.proposalCrops.reduce(
    (sum, c) => sum + (Number(c.expectedQuantity || 0) * price),
    0
  );

  document.getElementById("totalAmount").value = total.toFixed(2);
}
document.getElementById("pricePerUnit").oninput = (e) => {
  state.proposal.pricePerUnit = e.target.value;
  recalcTotalAmount();
};
document.getElementById("startYear").oninput =
  e => state.proposal.startYear = e.target.value;

document.getElementById("endYear").oninput =
  e => state.proposal.endYear = e.target.value;


 function renderProposalInfo() {
  const f = state.farmerProfile || {};
  const p = state.proposal || {};

  document.querySelector(".proposal-side").innerHTML = `
    <h4>Proposal Info</h4>
    <p><strong>Farmer:</strong> ${f.farmerName || "—"}</p>
    <p><strong>Phone:</strong> ${f.phone || "—"}</p>
    <p><strong>Expires On:</strong> ${
      p.actionDueAt ? new Date(p.actionDueAt).toLocaleDateString() : "—"
    }</p>
  `;
}

  function renderAll() {
    renderMeta();
    renderLand();
    renderCrops();
    renderDelivery();
    renderProposalInfo();
    applyPermissions();
  }
document.getElementById("landUsed").oninput = (e) => {
  state.proposal.landAreaUsed = Number(e.target.value);
};

  /* ===============================
     ACTIONS
  =============================== */

  function sanitizeProposalBeforeSave() {
  if (state.proposal.contractModel === "ANNUAL") {
    state.proposal.proposalCrops.forEach(c => {
      c.season = null; // ⛔ remove invalid enum
    });
  }
}


async function saveDraft() {
  sanitizeProposalBeforeSave();

  const res = await fetch(
    `${API_BASE}/api/proposals/draft?senderUserId=${state.user.id}&currentUserRole=${state.user.role}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(state.proposal)
    }
  );

  if (!res.ok) {
    alert(await res.text());
    return;
  }

  state.proposal = await res.json();
  renderMeta();
  alert("Draft saved");
}


function renderMeta() {
  const p = state.proposal || {};

  const status = p.proposalStatus || "DRAFT";

  const metaStrong = document.querySelectorAll(".proposal-meta strong");
  metaStrong[0].innerText = p.proposalId ? `#${p.proposalId}` : "#—";
  metaStrong[1].innerText = `v${p.proposalVersion || 1}`;
  metaStrong[2].innerText = p.actionRequiredBy || "—";

  const badge = document.querySelector(".status-badge");
  badge.innerText = status;
  badge.className = `status-badge ${status.toLowerCase()}`;
}




  async function sendProposal() {
    await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/send?senderUserId=${state.user.id}&currentUserRole=${state.user.role}`,
      { method: "POST", headers: authHeaders() }
    );
    window.location.href = "../../Farmer-Request/farmer-request.html";
  }

  async function acceptProposal() {
    await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/accept?receiverUserId=${state.user.id}`,
      { method: "POST", headers: authHeaders() }
    );
    alert("Accepted");
  }

  async function rejectProposal() {
    await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/reject?receiverUserId=${state.user.id}`,
      { method: "POST", headers: authHeaders() }
    );
    alert("Rejected");
  }

  /* ===============================
     INIT
  =============================== */

  async function init() {
    await loadFarmerProfile();
    await loadFarmerLands();
    await loadCropMasters();
    await loadProposalContext();

    renderAll();

    $(".proposal-actions .ghost").onclick = saveDraft;
    $(".proposal-actions .primary").onclick = sendProposal;
    $(".proposal-actions .success").onclick = acceptProposal;
    $(".proposal-actions .danger").onclick = rejectProposal;

    $(".back-link").onclick = () => {
      window.location.href = "../../Farmer-Request/farmer-request.html";
    };
  }
document.getElementById("contractModel")
  .addEventListener("change", toggleContractModel);

  document.addEventListener("DOMContentLoaded", init);

})();
