/* Agreement page script — read-only binding + print/download */
(function () {
  // SAMPLE data (replace with backend fetch if available)
  const sampleAgreement = {
    agreementId: "AGR-2026-00071",
    proposalId: "PROP-2026-110",
    proposalVersion: 2,
    signedAt: "2026-02-10T11:30:00Z",
    status: "SIGNED",
    farmer: {
      name: "Ramesh Kumar",
      userId: "F-10023",
      location: "Village: Rampur, Block: A, District: X",
    },
    buyer: {
      name: "Green Agri Traders",
      userId: "B-9087",
      businessName: "Green Agri Traders Pvt Ltd",
      location: "Market Road, Town Y",
    },
    landId: "LND-5532",
    landAreaUsed: "3.5 acres",
    contractModel: "Fixed Price",
    season: "Kharif",
    startYear: 2026,
    endYear: 2026,
    crops: [
      { crop: "Rice", variety: "IR64", season: "Kharif", areaUsed: "2.0", expectedQty: "4,000", unit: "kg", pricePerUnit: 25, total: 100000 },
      { crop: "Maize", variety: "HQ MZ", season: "Kharif", areaUsed: "1.5", expectedQty: "2,000", unit: "kg", pricePerUnit: 20, total: 40000 },
    ],
    totalContractAmount: 140000,
    advancePercent: 30,
    midCyclePercent: 30,
    finalPercent: 40,
    farmerProfitPercent: 18,
    deliveryLocation: "Warehouse — Market Y",
    deliveryWindow: "Oct 2026 - Nov 2026",
    logisticsHandledBy: "Buyer",
    inputProvided: "Fertilizer & Seed (buyer-provided)",
    allowCropChangeBetweenSeasons: false,
    escrow: { totalLocked: 140000, remaining: 0, status: "LOCKED" },
    signatures: {
      farmerName: "Ramesh Kumar",
      farmerDate: "2026-02-10",
      buyerName: "Green Agri Traders",
      buyerDate: "2026-02-10",
    },
  };

  // Helpers
  function qs(sel) { return document.querySelector(sel); }
  function qsid(id) { return document.getElementById(id); }
  function fmtCurrency(v) { return "₹ " + (Number(v) || 0).toLocaleString(); }
  function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(); } catch(e) { return iso || "—"; } }

  function renderCropTable(crops) {
    const tbody = qsid("cropTableBody");
    tbody.innerHTML = "";
    (crops || []).forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.crop || "-"}</td>
        <td>${r.variety || "-"}</td>
        <td>${r.season || "-"}</td>
        <td>${r.areaUsed || "-"}</td>
        <td>${r.expectedQty || "-"}</td>
        <td>${r.unit || "-"}</td>
        <td>${fmtCurrency(r.pricePerUnit)}</td>
        <td>${fmtCurrency(r.total)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function populateAgreement(a) {
    if (!a) a = sampleAgreement;

    qsid("agreementId").textContent = a.agreementId || "—";
    qsid("proposalRef").textContent = `${a.proposalId || "—"} v${a.proposalVersion || 1}`;
    qsid("signedAt").textContent = fmtDate(a.signedAt || a.signDate || new Date());
    qsid("displayStatus").textContent = (a.status || "LOCKED").toUpperCase();
    qsid("displayEscrow").textContent = (a.escrow && a.escrow.status) || "LOCKED";

    // Parties
    qsid("farmerName").textContent = a.farmer?.name || "—";
    qsid("farmerUserId").textContent = a.farmer?.userId || "—";
    qsid("farmerLocation").textContent = a.farmer?.location || "—";

    qsid("buyerName").textContent = a.buyer?.name || "—";
    qsid("buyerUserId").textContent = a.buyer?.userId || "—";
    qsid("buyerBusiness").textContent = a.buyer?.businessName || "—";
    qsid("buyerLocation").textContent = a.buyer?.location || "—";

    qsid("landId").textContent = a.landId || "—";
    qsid("landAreaUsed").textContent = a.landAreaUsed || "—";

    qsid("contractModel").textContent = a.contractModel || "—";
    qsid("season").textContent = a.season || "—";
    qsid("startYear").textContent = a.startYear || "—";
    qsid("endYear").textContent = a.endYear || "—";

    renderCropTable(a.crops || []);

    qsid("totalContractValue").textContent = fmtCurrency(a.totalContractAmount || 0);
    qsid("advancePercent").textContent = (a.advancePercent || 0) + "%";
    qsid("midPercent").textContent = (a.midCyclePercent || a.midPercent || 0) + "%";
    qsid("finalPercent").textContent = (a.finalPercent || 0) + "%";
    qsid("farmerProfitPercent").textContent = (a.farmerProfitPercent || 0) + "%";

    qsid("deliveryLocation").textContent = a.deliveryLocation || "—";
    qsid("deliveryWindow").textContent = a.deliveryWindow || "—";
    qsid("logisticsHandledBy").textContent = a.logisticsHandledBy || "—";
    qsid("inputProvided").textContent = a.inputProvided || "—";
    qsid("allowCropChange").textContent = a.allowCropChangeBetweenSeasons ? "Yes" : "No";

    qsid("totalEscrow").textContent = fmtCurrency(a.escrow?.totalLocked || 0);
    qsid("remainingEscrow").textContent = fmtCurrency(a.escrow?.remaining || 0);
    qsid("escrowStatus").textContent = a.escrow?.status || "LOCKED";

    qsid("farmerSignatureName").textContent = a.signatures?.farmerName || a.farmer?.name || "—";
    qsid("farmerSignatureDate").textContent = a.signatures?.farmerDate || fmtDate(a.signedAt) || "—";
    qsid("buyerSignatureName").textContent = a.signatures?.buyerName || a.buyer?.name || "—";
    qsid("buyerSignatureDate").textContent = a.signatures?.buyerDate || fmtDate(a.signedAt) || "—";

    // Status badge
    const sb = qsid("statusBadge");
    sb.textContent = (a.status || "SIGNED").toUpperCase();
    if ((a.status || "").toUpperCase() === "SIGNED") {
      sb.classList.add("badge-signed");
    }
  }

  // Attempt to load a real agreement (optional): if querystring contains id, fetch from API
  async function loadAgreement() {
    const params = new URLSearchParams(location.search);
    const id = params.get("agreementId");
    if (!id) {
      populateAgreement(sampleAgreement);
      return;
    }

    // If your backend exposes an endpoint, uncomment and update the URL below.
    // try {
    //   const res = await fetch(`/api/agreements/${id}`, { headers: { Authorization: 'Bearer '+localStorage.getItem('token') }});
    //   if (res.ok) { const data = await res.json(); populateAgreement(data); return; }
    // } catch(e) { console.warn('Agreement fetch failed', e); }

    // fallback to sample
    populateAgreement(sampleAgreement);
  }

  // Print / download
  qsid("downloadBtn").addEventListener("click", () => {
    // print stylesheet will hide site header and controls
    window.print();
  });

  document.addEventListener("DOMContentLoaded", () => {
    loadAgreement();
  });
})();
