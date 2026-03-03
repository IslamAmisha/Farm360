/* ============================================================
   Farm360 — Agreement Page
   Names and crop details come directly from agreementSnapshot
   (stored at signing time) — no separate profile API calls needed.
   ============================================================ */
(function () {

  const API_BASE = "http://localhost:8080";

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    };
  }

  function el(id) { return document.getElementById(id); }

  function fmtCurrency(v) {
    return "₹ " + (Number(v) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  function fmtDate(val) {
    if (!val) return "—";
    try {
      return new Date(val).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      });
    } catch (e) { return val; }
  }

  function showError(msg) {
    document.querySelector("main").innerHTML = `
      <div style="text-align:center;padding:80px 20px;">
        <p style="font-size:1.2rem;color:var(--error,#c0392b);">⚠ ${msg}</p>
        <a href="javascript:history.back()" style="margin-top:16px;display:inline-block;">← Go back</a>
      </div>`;
  }

  /* ----------------------------------------------------------
     LOAD
  ---------------------------------------------------------- */
  async function loadAgreement() {
    const params = new URLSearchParams(location.search);
    const agreementId = params.get("agreementId");
    if (!agreementId) { showError("No agreement ID provided."); return; }

    const res = await fetch(`${API_BASE}/api/agreements/${agreementId}`, { headers: authHeaders() });
    if (!res.ok) { showError(await res.text() || "Failed to load agreement."); return; }

    const agreement = await res.json();

    // Parse snapshot — this is the single source of truth for all fields
    let snap = {};
    try {
      snap = typeof agreement.agreementSnapshot === "string"
        ? JSON.parse(agreement.agreementSnapshot)
        : (agreement.agreementSnapshot || {});
    } catch (e) { console.warn("Could not parse agreementSnapshot", e); }

    render(agreement, snap);
  }

  /* ----------------------------------------------------------
     RENDER — reads everything from snap, falls back to agreement
  ---------------------------------------------------------- */
  function render(a, snap) {

    /* ---- Header ---- */
    el("agreementId").textContent   = a.agreementId || "—";
    el("proposalRef").textContent   =
      `#${snap.proposalId || a.proposalId || "—"} v${snap.proposalVersion || a.proposalVersion || 1}`;
    el("signedAt").textContent      = fmtDate(a.signedAt);
    el("displayStatus").textContent = (a.status || "SIGNED").toUpperCase();
    el("displayEscrow").textContent = "LOCKED";

    const badge = el("statusBadge");
    badge.textContent = (a.status || "SIGNED").toUpperCase();
    badge.className   = "status-badge badge-" + (a.status || "signed").toLowerCase();

    /* ---- Farmer ---- */
    // snap.farmerName / snap.farmerLocation are stored at signing time
    el("farmerName").textContent     = snap.farmerName     || "—";
    el("farmerUserId").textContent   = snap.farmerUserId   || a.farmerUserId  || "—";
    el("farmerLocation").textContent = snap.farmerLocation || "—";
    el("landId").textContent         = snap.landId         || "—";
    el("landAreaUsed").textContent   = snap.landAreaUsed != null
      ? snap.landAreaUsed + " acres" : "—";

    /* ---- Buyer ---- */
    el("buyerName").textContent      = snap.buyerName         || "—";
    el("buyerUserId").textContent    = snap.buyerUserId        || a.buyerUserId   || "—";
    el("buyerBusiness").textContent  = snap.buyerBusinessName  || "—";
    el("buyerLocation").textContent  = snap.buyerLocation      || "—";

    /* ---- Contract ---- */
    el("contractModel").textContent = snap.contractModel || "—";
    el("season").textContent        = snap.season        || "—";
    el("startYear").textContent     = snap.startYear     || "—";
    el("endYear").textContent       = snap.endYear       || "—";

    /* ---- Crop table ---- */
    renderCropTable(snap.crops || [], snap.pricePerUnit);

    /* ---- Financial ---- */
    el("totalContractValue").textContent  = fmtCurrency(snap.totalContractAmount);
    el("advancePercent").textContent      = (snap.advancePercent   || 0) + "%";
    el("midPercent").textContent          = (snap.midCyclePercent  || 0) + "%";
    el("finalPercent").textContent        = (snap.finalPercent     || 0) + "%";
    el("farmerProfitPercent").textContent = (snap.farmerProfitPercent || 0) + "%";

    /* ---- Delivery ---- */
    el("deliveryLocation").textContent   = snap.deliveryLocation   || "—";
    el("deliveryWindow").textContent     = snap.deliveryWindow     || "—";
    el("logisticsHandledBy").textContent = snap.logisticsHandledBy || "—";
    el("inputProvided").textContent      = "—";
    el("allowCropChange").textContent    = "—";

    /* ---- Escrow ---- */
    const total = snap.totalContractAmount || 0;
    el("totalEscrow").textContent     = fmtCurrency(total);
    el("remainingEscrow").textContent = fmtCurrency(snap.remainingEscrow ?? total);
    el("escrowStatus").textContent    = "LOCKED";

    /* ---- Signatures — use real names from snapshot ---- */
    const dateStr = fmtDate(a.signedAt);
    el("farmerSignatureName").textContent = snap.farmerName || "—";
    el("farmerSignatureDate").textContent = dateStr;
    el("buyerSignatureName").textContent  = snap.buyerName  || "—";
    el("buyerSignatureDate").textContent  = dateStr;
  }

  /* ----------------------------------------------------------
     CROP TABLE — names come from snapshot, no master API needed
  ---------------------------------------------------------- */
  function renderCropTable(crops, pricePerUnit) {
    const tbody = el("cropTableBody");
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
        <td>${c.cropName            || c.cropId           || "—"}</td>
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

  /* ----------------------------------------------------------
     DOWNLOAD / PRINT
  ---------------------------------------------------------- */
  el("downloadBtn").addEventListener("click", () => window.print());

  document.addEventListener("DOMContentLoaded", loadAgreement);

})();