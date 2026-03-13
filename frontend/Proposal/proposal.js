/* =========================================================
   Farm360 – Proposal Page Logic
   Fully Dynamic (DB Driven)
   ========================================================= */

(function () {

  const API_BASE = "http://localhost:8080";

  /* ===============================
     GLOBAL STATE
  =============================== */
  const state = {
    user: {
      id: Number(localStorage.getItem("userId")),
      role: localStorage.getItem("role") // farmer / buyer
    },
    farmerProfile: null,
    proposal: null,
    lands: [],
    cropsMaster: [],
    isAnnual: false
  };

  /* ===============================
     UTIL
  =============================== */
  function showToast(msg, type = "error") {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerText = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    };
  }

  function emptyCrop() {
    return {
      cropId: null,
      cropSubCategoryId: null,
      season: null,
      expectedQuantity: null,
      unit: "QUINTAL",
      landAreaUsed: null,
      farmerProfitPercent: null
    };
  }

  /* ===============================
     LOADERS
  =============================== */
  async function loadFarmerProfile() {
    state.farmerProfile =
      await (await fetch(`${API_BASE}/api/profile/farmer`, { headers: authHeaders() })).json();
  }

  async function loadFarmerLands() {
    if (state.user.role !== "farmer") return;
    state.lands =
      await (await fetch(`${API_BASE}/api/farmers/${state.user.id}/lands`, { headers: authHeaders() })).json();
  }

  async function loadCropMasters() {
    state.cropsMaster =
      await (await fetch(`${API_BASE}/master/crops`, { headers: authHeaders() })).json();
  }

  async function loadSubcategories(cropId) {
    return await (await fetch(`${API_BASE}/master/subcategories/${cropId}`, { headers: authHeaders() })).json();
  }

  async function loadProposalContext() {
    const params = new URLSearchParams(window.location.search);
    const proposalId = params.get("proposalId");
    const requestId = params.get("requestId");

    if (proposalId) {
      const res = await fetch(
        `${API_BASE}/api/proposals/${proposalId}?userId=${state.user.id}`,
        { headers: authHeaders() }
      );

      if (!res.ok) {
        showToast("Failed to load proposal");
        return;
      }

      const proposal = await res.json();

      const isEditable =
        proposal.proposalStatus === "DRAFT" &&
        proposal.senderUserId === state.user.id;

      if (!isEditable) {
        window.location.href =
          `/Proposal/Proposal-view/proposal-view.html?proposalId=${proposalId}`;
        return;
      }

      state.proposal = proposal;

    } else {
      // Brand new proposal
      state.proposal = {
        requestId,
        senderUserId: state.user.id,
        proposalStatus: "DRAFT",
        advancePercent: 30,
        midCyclePercent: 30,
        finalPercent: 40,
        billToleranceType: "PERCENT",
        billToleranceValue: null,
        proposalCrops: [emptyCrop()]
      };
    }
  }

  /* ===============================
     LAND
  =============================== */
  function renderLand() {
    const sel = document.getElementById("landSelect");
    sel.innerHTML = `<option value="">Select Land</option>`;

    if (state.user.role === "farmer") {
      state.lands.forEach(l => {
        sel.add(new Option(`Land ${l.landId} (${l.size} acre)`, l.landId));
      });

      if (state.proposal.landId) {
        sel.value = state.proposal.landId;
        const land = state.lands.find(l => l.landId == state.proposal.landId);
        document.getElementById("totalLand").value = land?.size || "";
      }

      sel.onchange = () => {
        const land = state.lands.find(l => String(l.landId) === sel.value);
        state.proposal.landId = land?.landId;
        document.getElementById("totalLand").value = land?.size || "";
      };

      return;
    }

    // Buyer counter flow — land is read-only
    if (state.user.role === "buyer" && state.proposal.landId) {
      const opt = new Option(
        `Land ${state.proposal.landId}`,
        state.proposal.landId,
        true,
        true
      );
      sel.add(opt);
      sel.disabled = true;

      document.getElementById("totalLand").value = state.proposal.landAreaUsed || "";
      document.getElementById("landUsed").value = state.proposal.landAreaUsed || "";
      document.getElementById("landUsed").readOnly = true;
    }
  }

  function renderProposalInfo() {
    if (!state.proposal) return;

    const senderEl = document.getElementById("senderInfo");
    if (senderEl) {
      senderEl.innerText = state.proposal.senderUserId
        ? `User #${state.proposal.senderUserId}`
        : "—";
    }

    const receiverEl = document.getElementById("receiverInfo");
    if (receiverEl) {
      receiverEl.innerText = state.proposal.receiverUserId
        ? `User #${state.proposal.receiverUserId}`
        : "—";
    }

    const expiryEl = document.getElementById("expiryInfo");
    if (expiryEl) {
      expiryEl.innerText = state.proposal.validUntil
        ? new Date(state.proposal.validUntil).toLocaleString()
        : "—";
    }
  }

  const landUsedEl = document.getElementById("landUsed");
  if (landUsedEl) {
    landUsedEl.oninput = e => {
      const val = Number(e.target.value || 0);
      state.proposal.landAreaUsed = val;
      state.proposal.proposalCrops.forEach(c => c.landAreaUsed = val);
    };
  }

  function validateLandArea() {
    if (state.user.role === "buyer") return true;

    const land = state.lands.find(l => l.landId == state.proposal.landId);
    if (!land) return showToast("Select land"), false;

    if (!state.proposal.landAreaUsed || state.proposal.landAreaUsed <= 0)
      return showToast("Enter land used"), false;

    if (state.proposal.landAreaUsed > land.size)
      return showToast(`Land used cannot exceed ${land.size}`), false;

    return true;
  }

  function syncLandUsedFromUI() {
    const input = document.getElementById("landUsed");
    const val = Number(input.value || 0);
    state.proposal.landAreaUsed = val;
    state.proposal.proposalCrops.forEach(c => {
      c.landAreaUsed = val;
    });
  }

  /* ===============================
     CONTRACT MODEL
  =============================== */
  function toggleContractModel() {
    const model = document.getElementById("contractModel").value;
    state.proposal.contractModel = model;
    state.isAnnual = model === "ANNUAL";

    document.getElementById("seasonSelect").parentElement.style.display =
      state.isAnnual ? "none" : "block";

    state.proposal.season = state.isAnnual ? null : document.getElementById("seasonSelect").value;
    state.proposal.proposalCrops = state.proposal.proposalCrops?.length
      ? state.proposal.proposalCrops
      : [emptyCrop()];

    renderCrops();
  }

  /* ===============================
     CROPS
  =============================== */
  function renderCrops() {
    const c = document.getElementById("cropContainer");
    c.innerHTML = "";

    state.proposal.proposalCrops.forEach(crop => {
      const row = document.createElement("div");
      row.className = "crop-row";
      row.innerHTML = `
        <select class="crop"></select>
        <select class="sub"></select>
        ${state.isAnnual ? `
        <select class="season">
          <option value="">Season</option>
          <option value="KHARIF">KHARIF</option>
          <option value="RABI">RABI</option>
          <option value="ZAID">ZAID</option>
        </select>` : ``}
        <input type="number" placeholder="Qty">
        <select class="unit">
          <option value="QUINTAL">QUINTAL</option>
          <option value="TON">TON</option>
        </select>
      `;
      c.appendChild(row);

      row.querySelector('input[placeholder="Qty"]').oninput = e => {
        crop.expectedQuantity = Number(e.target.value || 0);
        recalcTotalAmount();
      };

      bindCropRow(row, crop);
    });
  }

  function bindCropRow(row, crop) {
    const cropSel = row.querySelector(".crop");
    const subSel = row.querySelector(".sub");
    const unitSel = row.querySelector(".unit");
    const qtyInput = row.querySelector('input[placeholder="Qty"]');

    cropSel.innerHTML = `<option value="">Crop</option>`;
    state.cropsMaster.forEach(c => cropSel.add(new Option(c.name, c.id)));

    if (crop.cropId) {
      cropSel.value = crop.cropId;
      loadSubcategories(crop.cropId).then(subs => {
        subSel.innerHTML = `<option value="">Sub-category</option>`;
        subs.forEach(s => subSel.add(new Option(s.name, s.id)));
        if (crop.cropSubCategoryId) subSel.value = crop.cropSubCategoryId;
      });
    }

    if (crop.expectedQuantity) qtyInput.value = crop.expectedQuantity;
    if (crop.unit) unitSel.value = crop.unit;
    if (state.isAnnual && crop.season) {
      const seasonSel = row.querySelector(".season");
      if (seasonSel) seasonSel.value = crop.season;
    }

    cropSel.onchange = async () => {
      crop.cropId = cropSel.value;
      subSel.innerHTML = `<option value="">Sub-category</option>`;
      const subs = await loadSubcategories(cropSel.value);
      subs.forEach(s => subSel.add(new Option(s.name, s.id)));
    };

    subSel.onchange = () => crop.cropSubCategoryId = subSel.value;

    unitSel.onchange = e => {
      crop.unit = e.target.value;
      recalcTotalAmount();
    };

    if (state.isAnnual) {
      row.querySelector(".season").onchange = e => crop.season = e.target.value;
    }
  }

  document.querySelector(".btn-link").onclick = () => {
    if (!state.isAnnual)
      return showToast("Seasonal contract allows only one crop");
    if (state.proposal.proposalCrops.length >= 3)
      return showToast("Maximum 3 crops allowed");
    state.proposal.proposalCrops.push(emptyCrop());
    renderCrops();
  };

  /* ===============================
     DELIVERY
  =============================== */
  function renderDelivery() {
    const loc = document.getElementById("deliveryLocation");
    const log = document.getElementById("logisticsBy");

    ["BUYER_WAREHOUSE", "MANDI", "FARM_GATE", "CUSTOM"]
      .forEach(v => loc.add(new Option(v.replace("_", " "), v)));

    ["BUYER", "FARMER", "SHARED"]
      .forEach(v => log.add(new Option(v, v)));

    loc.onchange = e => state.proposal.deliveryLocation = e.target.value;
    log.onchange = e => state.proposal.logisticsHandledBy = e.target.value;
  }

  document.getElementById("deliveryWindow").oninput =
    e => state.proposal.deliveryWindow = e.target.value;

  /* ===============================
     VALIDATION
  =============================== */
  function validateBeforeSend() {
    syncLandUsedFromUI();
    recalcTotalAmount();
    const p = state.proposal;

    if (
      !p.farmerProfitPercent ||
      p.farmerProfitPercent <= 0 ||
      p.farmerProfitPercent > 100
    ) return showToast("Invalid farmer profit percentage"), false;

    if (!p.contractModel)
      return showToast("Select contract model"), false;

    if (!p.landId)
      return showToast("Select land"), false;

    if (!validateLandArea())
      return false;

    if (!p.startYear || !p.endYear)
      return showToast("Start year and end year required"), false;

    if (Number(p.startYear) > Number(p.endYear))
      return showToast("Start year cannot be greater than end year"), false;

    if (!p.proposalCrops.length)
      return showToast("Add at least one crop"), false;

    if (!state.isAnnual && p.proposalCrops.length !== 1)
      return showToast("Seasonal contract allows only one crop"), false;

    if (state.isAnnual && p.proposalCrops.length !== 3)
      return showToast("Annual contract requires exactly 3 crops"), false;

    if (!state.isAnnual && !p.season)
      return showToast("Season is required"), false;

    for (const c of p.proposalCrops) {
      if (!c.cropId)
        return showToast("Select crop"), false;

      if (!c.cropSubCategoryId)
        return showToast("Select sub-category"), false;

      if (!c.expectedQuantity || c.expectedQuantity <= 0)
        return showToast("Invalid quantity"), false;

      if (!c.unit)
        return showToast("Select unit"), false;

      if (state.isAnnual && !c.season)
        return showToast("Each crop must have a season"), false;
    }

    if (!p.pricePerUnit || p.pricePerUnit <= 0)
      return showToast("Invalid price per unit"), false;

    if (!p.totalContractAmount || p.totalContractAmount <= 0)
      return showToast("Total amount invalid"), false;

    // NEW: bill tolerance validation
    if (!p.billToleranceType)
      return showToast("Select bill tolerance type"), false;

    if (p.billToleranceValue == null || p.billToleranceValue <= 0)
      return showToast("Enter a valid bill tolerance value"), false;

    if (p.billToleranceType === "PERCENT" && p.billToleranceValue > 100)
      return showToast("Bill tolerance percent cannot exceed 100"), false;

    if (!p.deliveryLocation)
      return showToast("Select delivery location"), false;

    if (!p.logisticsHandledBy)
      return showToast("Select logistics handler"), false;

    if (!p.deliveryWindow)
      return showToast("Delivery window required"), false;

    return true;
  }

  /* ===============================
     ACTIONS
  =============================== */
  async function saveDraft() {
    state.proposal.proposalCrops.forEach(c => {
      if (!c.landAreaUsed) {
        c.landAreaUsed = state.proposal.landAreaUsed;
      }
    });

    const res = await fetch(
      `${API_BASE}/api/proposals/draft?senderUserId=${state.user.id}&currentUserRole=${state.user.role}`,
      { method: "POST", headers: authHeaders(), body: JSON.stringify(state.proposal) }
    );

    if (!res.ok) return showToast(await res.text());

    state.proposal = await res.json();
    showToast("Draft saved", "success");
  }

  async function sendProposal() {
    state.proposal.proposalCrops.forEach(c => {
      c.landAreaUsed = state.proposal.landAreaUsed;
    });

    if (!validateBeforeSend()) return;

    const draftRes = await fetch(
      `${API_BASE}/api/proposals/draft?senderUserId=${state.user.id}&currentUserRole=${state.user.role}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(state.proposal)
      }
    );

    if (!draftRes.ok) return showToast(await draftRes.text());

    state.proposal = await draftRes.json();

    const res = await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/send` +
      `?senderUserId=${state.user.id}&currentUserRole=${state.user.role}`,
      {
        method: "POST",
        headers: authHeaders()
      }
    );

    if (!res.ok) return showToast(await res.text());

    showToast("Proposal sent", "success");

    setTimeout(() => {
      window.location.href =
        `/Proposal/Proposal-view/proposal-view.html?proposalId=${state.proposal.proposalId}`;
    }, 800);
  }

  function recalcTotalAmount() {
    const price = Number(state.proposal.pricePerUnit || 0);

    const total = state.proposal.proposalCrops.reduce(
      (sum, c) => sum + (Number(c.expectedQuantity || 0) * price),
      0
    );

    state.proposal.totalContractAmount = total;
    document.getElementById("totalAmount").value =
      total > 0 ? total.toFixed(2) : "";
  }

  /* ===============================
     INIT
  =============================== */
  async function init() {
    await loadProposalContext();

    if (!state.proposal) return;

    const canEdit =
      state.proposal.proposalStatus === "DRAFT" ||
      (
        state.proposal.proposalStatus === "SENT" &&
        state.proposal.actionRequiredBy === state.user.role
      );

    document.querySelector(".proposal-actions").style.display =
      canEdit ? "flex" : "none";

    if (
      state.user.role === "farmer" &&
      (!state.proposal.proposalId || state.proposal.proposalStatus === "DRAFT")
    ) {
      await loadFarmerProfile();
    }

    await loadFarmerLands();
    await loadCropMasters();

    renderProposalInfo();
    renderLand();
    renderDelivery();

    // Restore field values from state
    if (state.user.role === "farmer" && state.proposal.landId) {
      document.getElementById("landSelect").value = state.proposal.landId;
      const land = state.lands.find(l => l.landId == state.proposal.landId);
      document.getElementById("totalLand").value = land?.size || "";
    }

    const landUsedInput = document.getElementById("landUsed");
    if (state.proposal.landAreaUsed && landUsedInput) {
      landUsedInput.value = state.proposal.landAreaUsed;
      state.proposal.proposalCrops.forEach(c => {
        c.landAreaUsed = state.proposal.landAreaUsed;
      });
    }

    const fpEl = document.getElementById("farmerProfitPercent");
    fpEl.value = state.proposal.farmerProfitPercent != null ? state.proposal.farmerProfitPercent : "";
    fpEl.oninput = e => state.proposal.farmerProfitPercent = Number(e.target.value) || null;

    // NEW: bill tolerance fields
    const bttEl = document.getElementById("billToleranceType");
    bttEl.value = state.proposal.billToleranceType || "PERCENT";
    // Keep state in sync with initial select value
    state.proposal.billToleranceType = bttEl.value;
    bttEl.onchange = e => {
      state.proposal.billToleranceType = e.target.value;
    };

    const btvEl = document.getElementById("billToleranceValue");
    btvEl.value = state.proposal.billToleranceValue ?? "";
    btvEl.oninput = e => {
      state.proposal.billToleranceValue = e.target.value ? Number(e.target.value) : null;
    };

    document.getElementById("contractModel").value = state.proposal.contractModel || "";
    document.getElementById("seasonSelect").value = state.proposal.season || "";
    document.getElementById("startYear").value = state.proposal.startYear || "";
    document.getElementById("endYear").value = state.proposal.endYear || "";
    document.getElementById("pricePerUnit").value = state.proposal.pricePerUnit || "";
    document.getElementById("deliveryLocation").value = state.proposal.deliveryLocation || "";
    document.getElementById("logisticsBy").value = state.proposal.logisticsHandledBy || "";

    const dw = document.getElementById("deliveryWindow");
    if (dw && state.proposal.deliveryWindow) {
      dw.value = state.proposal.deliveryWindow.includes("T")
        ? state.proposal.deliveryWindow.split("T")[0]
        : state.proposal.deliveryWindow;
    }

    const remarksEl = document.getElementById("remarks");
    if (remarksEl) {
      remarksEl.value = state.proposal.remarks || "";
      remarksEl.oninput = e => { state.proposal.remarks = e.target.value; };
    }

    const modelSel = document.getElementById("contractModel");
    state.proposal.contractModel = modelSel.value;
    state.isAnnual = modelSel.value === "ANNUAL";
    toggleContractModel();

    document.getElementById("contractModel").onchange = toggleContractModel;
    document.getElementById("seasonSelect").onchange =
      e => state.proposal.season = e.target.value;

    document.getElementById("startYear").oninput =
      e => state.proposal.startYear = e.target.value ? Number(e.target.value) : null;

    document.getElementById("endYear").oninput =
      e => state.proposal.endYear = Number(e.target.value || null);

    document.getElementById("pricePerUnit").oninput = e => {
      state.proposal.pricePerUnit = Number(e.target.value || 0);
      recalcTotalAmount();
    };

    document.querySelector(".proposal-actions .ghost").onclick = saveDraft;
    document.querySelector(".proposal-actions .primary").onclick = sendProposal;
  }

  document.addEventListener("DOMContentLoaded", init);

})();