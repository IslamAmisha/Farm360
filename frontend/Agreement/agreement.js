(function () {

  const API_BASE = "http://localhost:8080";

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    };
  }

  // Null-safe setter — logs a warning instead of crashing if an ID is missing
  function setText(id, val) {
    const node = document.getElementById(id);
    if (node) node.textContent = val;
    else console.warn("agreement.js: #" + id + " not found in DOM");
  }
  function el(id) { return document.getElementById(id); }

  function fmtCurrency(v) {
    if (v == null) return "—";
    const n = Number(v);
    if (isNaN(n)) return "—";
    return "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtDate(val) {
    if (!val) return "—";
    try {
      let d;
      if (Array.isArray(val)) {
        // Jackson serialises LocalDateTime as [year, month(1-based), day, h, m, s]
        d = new Date(val[0], val[1] - 1, val[2], val[3] || 0, val[4] || 0, val[5] || 0);
      } else {
        d = new Date(val);
      }
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch (e) { return String(val); }
  }

  function showError(msg) {
    const main = document.querySelector("main");
    if (main) main.innerHTML = `
      <div style="text-align:center;padding:80px 20px;">
        <p style="font-size:1.2rem;color:#c0392b;">⚠ ${msg}</p>
        <a href="javascript:history.back()" style="margin-top:16px;display:inline-block;">← Go back</a>
      </div>`;
  }

  /* ----------------------------------------------------------  PROFILE FETCHERS  */
  async function fetchFarmerProfile(userId) {
    try {
      const res = await fetch(`${API_BASE}/api/profile/farmer/${userId}`, { headers: authHeaders() });
      if (!res.ok) { console.warn("farmerProfile " + res.status); return null; }
      const d = await res.json();
      console.log("farmerProfile:", d);
      return d;
    } catch (e) { console.warn("farmerProfile err", e); return null; }
  }

  async function fetchBuyerProfile(userId) {
    try {
      const res = await fetch(`${API_BASE}/api/profile/buyer/${userId}`, { headers: authHeaders() });
      if (!res.ok) { console.warn("buyerProfile " + res.status); return null; }
      const d = await res.json();
      console.log("buyerProfile:", d);
      return d;
    } catch (e) { console.warn("buyerProfile err", e); return null; }
  }

  function farmerNameFromProfile(p) {
    if (!p) return "—";
    return p.farmerName || p.fullName || p.name || "—";
  }
  function farmerLocationFromProfile(p) {
    if (!p) return "—";
    return [p.village, p.blockName, p.districtName].filter(Boolean).join(", ") || "—";
  }
  function buyerNameFromProfile(p) {
    if (!p) return "—";
    return p.fullName || p.buyerName || p.name || "—";
  }
  function buyerBusinessFromProfile(p) { return p?.businessName || "—"; }
  function buyerLocationFromProfile(p) {
    if (!p) return "—";
    return [p.cityName, p.districtName, p.blockName].filter(Boolean).join(", ") || "—";
  }

  /* ----------------------------------------------------------  CROP NAMES  */
  async function resolveCropNames(crops) {
    if (!crops.length) return crops;
    if (crops.every(c => c.cropName && c.cropName !== "—" &&
                         c.cropSubCategoryName && c.cropSubCategoryName !== "—")) return crops;

    let cropList = [];
    try {
      const res = await fetch(`${API_BASE}/master/crops`, { headers: authHeaders() });
      if (res.ok) cropList = await res.json();
    } catch (e) {}

    const cropIdsNeeded = [...new Set(
      crops.filter(c => (!c.cropSubCategoryName || c.cropSubCategoryName === "—") && c.cropSubCategoryId)
           .map(c => c.cropId)
    )];

    const subsByCropId = {};
    await Promise.all(cropIdsNeeded.map(async cropId => {
      try {
        const res = await fetch(`${API_BASE}/master/subcategories/${cropId}`, { headers: authHeaders() });
        if (res.ok) subsByCropId[cropId] = await res.json();
      } catch (e) {}
    }));

    return crops.map(c => ({
      ...c,
      cropName: (c.cropName && c.cropName !== "—")
        ? c.cropName
        : (cropList.find(x => String(x.id) === String(c.cropId))?.name || String(c.cropId)),
      cropSubCategoryName: (c.cropSubCategoryName && c.cropSubCategoryName !== "—")
        ? c.cropSubCategoryName
        : ((subsByCropId[c.cropId] || []).find(x => String(x.id) === String(c.cropSubCategoryId))?.name || String(c.cropSubCategoryId))
    }));
  }

  /* ----------------------------------------------------------  LOAD  */
  async function loadAgreement() {
    const params = new URLSearchParams(location.search);
    const agreementId = params.get("agreementId");
    if (!agreementId) { showError("No agreement ID provided."); return; }

    let agreement;
    try {
      const res = await fetch(`${API_BASE}/api/agreements/${agreementId}`, { headers: authHeaders() });
      if (!res.ok) { showError(await res.text() || "Failed to load agreement."); return; }
      agreement = await res.json();
    } catch (e) { showError("Network error loading agreement."); return; }

    let snap = {};
    try {
      snap = typeof agreement.agreementSnapshot === "string"
        ? JSON.parse(agreement.agreementSnapshot)
        : (agreement.agreementSnapshot || {});
    } catch (e) { console.warn("snapshot parse error", e); }

    const farmerUserId = snap.farmerUserId || agreement.farmerUserId;
    const buyerUserId  = snap.buyerUserId  || agreement.buyerUserId;

    const needFarmer = !snap.farmerName || snap.farmerName === "—";
    const needBuyer  = !snap.buyerName  || snap.buyerName  === "—";

    const [farmerProfile, buyerProfile, resolvedCrops] = await Promise.all([
      needFarmer ? fetchFarmerProfile(farmerUserId) : Promise.resolve(null),
      needBuyer  ? fetchBuyerProfile(buyerUserId)   : Promise.resolve(null),
      resolveCropNames(snap.crops || [])
    ]);

    snap = { ...snap, crops: resolvedCrops };
    render(agreement, snap, farmerProfile, buyerProfile);
  }

  /* ----------------------------------------------------------  RENDER  */
  function render(a, snap, farmerProfile, buyerProfile) {

    // Header
    setText("agreementId",   a.agreementId || "—");
    setText("proposalRef",   `#${snap.proposalId || a.proposalId || "—"} v${snap.proposalVersion || a.proposalVersion || 1}`);
    setText("signedAt",      fmtDate(a.signedAt));
    setText("displayStatus", (a.status || "SIGNED").toUpperCase());
    setText("displayEscrow", "LOCKED");

    const badge = el("statusBadge");
    if (badge) {
      badge.textContent = (a.status || "SIGNED").toUpperCase();
      badge.className   = "status-badge badge-" + (a.status || "signed").toLowerCase();
    }

    // Farmer
    const farmerName     = (snap.farmerName     && snap.farmerName     !== "—") ? snap.farmerName     : farmerNameFromProfile(farmerProfile);
    const farmerLocation = (snap.farmerLocation && snap.farmerLocation !== "—") ? snap.farmerLocation : farmerLocationFromProfile(farmerProfile);

    setText("farmerName",     farmerName);
    setText("farmerUserId",   String(snap.farmerUserId || a.farmerUserId || "—"));
    setText("farmerLocation", farmerLocation);
    setText("landId",         String(snap.landId || "—"));
    setText("landAreaUsed",   snap.landAreaUsed != null ? snap.landAreaUsed + " acres" : "—");

    // Buyer
    const buyerName     = (snap.buyerName         && snap.buyerName         !== "—") ? snap.buyerName         : buyerNameFromProfile(buyerProfile);
    const buyerBiz      = (snap.buyerBusinessName && snap.buyerBusinessName !== "—") ? snap.buyerBusinessName : buyerBusinessFromProfile(buyerProfile);
    const buyerLocation = (snap.buyerLocation     && snap.buyerLocation     !== "—") ? snap.buyerLocation     : buyerLocationFromProfile(buyerProfile);

    setText("buyerName",     buyerName);
    setText("buyerUserId",   String(snap.buyerUserId || a.buyerUserId || "—"));
    setText("buyerBusiness", buyerBiz);
    setText("buyerLocation", buyerLocation);

    // Contract
    setText("contractModel", snap.contractModel || "—");
    setText("season",        snap.season        || "—");
    setText("startYear",     String(snap.startYear || "—"));
    setText("endYear",       String(snap.endYear   || "—"));

    // Crops
    renderCropTable(snap.crops || [], snap.pricePerUnit);

    // Financial
    const total = snap.totalContractAmount ?? null;
    setText("totalContractValue",  fmtCurrency(total));
    setText("advancePercent",      (snap.advancePercent     || 0) + "%");
    setText("midPercent",          (snap.midCyclePercent    || 0) + "%");
    setText("finalPercent",        (snap.finalPercent       || 0) + "%");
    setText("farmerProfitPercent", (snap.farmerProfitPercent || 0) + "%");

    // Delivery
    setText("deliveryLocation",   snap.deliveryLocation   || "—");
    setText("deliveryWindow",     snap.deliveryWindow     || "—");
    setText("logisticsHandledBy", snap.logisticsHandledBy || "—");
    setText("inputProvided",      "—");
    setText("allowCropChange",    "—");

    // Escrow
    setText("totalEscrow",     fmtCurrency(total));
    setText("remainingEscrow", fmtCurrency(snap.remainingEscrow != null ? snap.remainingEscrow : total));
    setText("escrowStatus",    "LOCKED");

    // Signatures
    const dateStr = fmtDate(a.signedAt);
    setText("farmerSignatureName", farmerName);
    setText("farmerSignatureDate", dateStr);
    setText("buyerSignatureName",  buyerName);
    setText("buyerSignatureDate",  dateStr);
  }

  /* ----------------------------------------------------------  CROP TABLE  */
  function renderCropTable(crops, pricePerUnit) {
    const tbody = el("cropTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!crops.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center">No crop data</td></tr>`;
      return;
    }

    crops.forEach(c => {
      const qty   = Number(c.expectedQuantity || 0);
      const price = Number(pricePerUnit        || 0);
      const total = qty * price;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.cropName            || c.cropId            || "—"}</td>
        <td>${c.cropSubCategoryName || c.cropSubCategoryId || "—"}</td>
        <td>${c.season              || "—"}</td>
        <td>${c.landAreaUsed != null ? c.landAreaUsed + " ac" : "—"}</td>
        <td>${qty > 0 ? qty.toLocaleString("en-IN") : "—"}</td>
        <td>${c.unit                || "—"}</td>
        <td>${fmtCurrency(price)}</td>
        <td>${fmtCurrency(total)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ----------------------------------------------------------  INIT  */
  document.addEventListener("DOMContentLoaded", () => {
    el("downloadBtn")?.addEventListener("click", () => window.print());
    loadAgreement();
  });

})();