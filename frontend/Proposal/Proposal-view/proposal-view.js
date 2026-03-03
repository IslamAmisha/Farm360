// proposal-view.js
(function () {
  const API_BASE = "http://localhost:8080";

  const state = {
    user: {
      id: Number(localStorage.getItem("userId")),
      role: localStorage.getItem("role") // farmer / buyer
    },
    proposal: null
  };

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    };
  }

  function showToast(msg, type = "error") {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerText = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  async function loadProposal() {
    const params = new URLSearchParams(window.location.search);
    const proposalId = params.get("proposalId");

    if (!proposalId) {
      showToast("No proposal ID in URL");
      return;
    }

    const res = await fetch(
      `${API_BASE}/api/proposals/${proposalId}?userId=${state.user.id}`,
      { headers: authHeaders() }
    );

    // FIX: guard against non-ok response before parsing JSON
    if (!res.ok) {
      showToast("Failed to load proposal");
      return;
    }

    state.proposal = await res.json();
  }

  function renderMeta() {
    const p = state.proposal;

    document.querySelector(".proposal-meta strong").innerText =
      `#${p.proposalId ?? "—"}`;

    document.getElementById("proposalVersion").innerText =
      `v${p.proposalVersion ?? "—"}`;

    document.getElementById("actionRequired").innerText =
      p.actionRequiredBy ?? "—";

    const side = document.querySelector(".proposal-side");
    side.innerHTML = `
      <p><strong>Sender:</strong> ${p.senderName ?? "—"}</p>
      <p><strong>Sender Role:</strong> ${p.senderRole ?? "—"}</p>
      <p><strong>Receiver:</strong> ${p.receiverName ?? "—"}</p>
      <p><strong>Expires On:</strong>
        ${p.validUntil ? new Date(p.validUntil).toLocaleDateString() : "—"}
      </p>
    `;

    const badge = document.querySelector(".status-badge");
    badge.innerText = p.proposalStatus ?? "DRAFT";
    badge.className = `status-badge ${(p.proposalStatus || "draft").toLowerCase()}`;
  }

  function renderCropsReadOnly() {
    const c = document.getElementById("cropContainer");
    c.innerHTML = "";

    if (!state.proposal.proposalCrops || state.proposal.proposalCrops.length === 0) {
      c.innerHTML = "<p>No crops added</p>";
      return;
    }

    state.proposal.proposalCrops.forEach(cr => {
      const row = document.createElement("div");
      row.className = "crop-row readonly";
      row.innerHTML = `
        <div><strong>Crop:</strong> ${cr.cropName ?? "—"}</div>
        <div><strong>Sub:</strong> ${cr.cropSubCategoryName ?? "—"}</div>
        <div><strong>Qty:</strong> ${cr.expectedQuantity} ${cr.unit}</div>
        ${cr.season ? `<div><strong>Season:</strong> ${cr.season}</div>` : ""}
      `;
      c.appendChild(row);
    });
  }

  function renderProposalData() {
    const p = state.proposal;

    const seasonSelect = document.getElementById("seasonSelect");
    if (seasonSelect) {
      seasonSelect.parentElement.style.display =
        p.contractModel === "ANNUAL" ? "none" : "block";
    }

    document.getElementById("totalLand").value = p.landAreaUsed ?? "";
    document.getElementById("landUsed").value = p.landAreaUsed || "";
    document.getElementById("contractModel").value = p.contractModel || "";
    document.getElementById("seasonSelect").value = p.season || "";
    document.getElementById("logisticsBy").value = p.logisticsHandledBy || "";
    document.getElementById("pricePerUnit").value = p.pricePerUnit || "";
    document.getElementById("startYear").value = p.startYear || "";
    document.getElementById("endYear").value = p.endYear || "";
    document.getElementById("deliveryWindow").value = p.deliveryWindow || "";

    document.getElementById("farmerProfitPercent").value =
      p.farmerProfitPercent != null ? p.farmerProfitPercent : "";

    const remarksView = document.getElementById("remarks");
    if (remarksView) {
      remarksView.value = p.remarks || "";
      remarksView.readOnly = true;
    }

    // FIX: backend field is totalContractAmount, not totalAmount —
    // use the correct field name and fall back to recalc only if missing
    const totalAmount = p.totalContractAmount
      ?? (p.proposalCrops?.length && p.pricePerUnit
        ? p.proposalCrops.reduce(
            (sum, c) => sum + (Number(c.expectedQuantity || 0) * Number(p.pricePerUnit)),
            0
          )
        : 0);

    document.getElementById("totalAmount").value =
      totalAmount ? Number(totalAmount).toFixed(2) : "";
  }

  function renderActions() {
    if (state.proposal.proposalStatus === "FINAL_ACCEPTED") {
      ["acceptBtn", "rejectBtn", "counterBtn"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.style.display = "none";
      });
      return;
    }

    const canAct =
      state.proposal.proposalStatus === "SENT" &&
      state.proposal.actionRequiredBy === state.user.role;

    ["acceptBtn", "rejectBtn", "counterBtn"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.style.display = canAct ? "inline-block" : "none";
    });
  }

  async function acceptProposal() {
    const res = await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/accept` +
      `?userId=${state.user.id}&role=${state.user.role}`,
      { method: "POST", headers: authHeaders() }
    );

    if (!res.ok) return showToast(await res.text());

    // Determine whether this was a FINAL accept by re-fetching the proposal.
    // After the backend processes the accept:
    //   - First accept  → status stays SENT   (other party must confirm)
    //   - Second accept → status = FINAL_ACCEPTED and agreement is created
    const updated = await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}?userId=${state.user.id}`,
      { headers: authHeaders() }
    );

    if (!updated.ok) {
      // Can't determine outcome — just reload to show latest state
      showToast("Accepted", "success");
      setTimeout(() => location.reload(), 800);
      return;
    }

    const latestProposal = await updated.json();

    if (latestProposal.proposalStatus === "FINAL_ACCEPTED") {
      // Agreement was auto-created by the backend — fetch it by proposalId
      const agrRes = await fetch(
        `${API_BASE}/api/agreements/by-proposal/${state.proposal.proposalId}`,
        { headers: authHeaders() }
      );

      if (agrRes.ok) {
        const agreement = await agrRes.json();
        showToast("Agreement created!", "success");
        setTimeout(() => {
          window.location.href =
            `/Agreement/agreement.html?agreementId=${agreement.agreementId}`;
        }, 800);
      } else {
        // Agreement created but lookup failed — go to agreements list
        showToast("Contract finalized!", "success");
        setTimeout(() => {
          window.location.href = `/Agreement/agreement-list.html`;
        }, 800);
      }
    } else {
      // First accept — waiting for the other party
      showToast("Accepted — waiting for other party's confirmation", "success");
      setTimeout(() => location.reload(), 800);
    }
  }

  async function rejectProposal() {
    const res = await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/reject` +
      `?userId=${state.user.id}&role=${state.user.role}`,
      { method: "POST", headers: authHeaders() }
    );

    // FIX: check response before showing success
    if (!res.ok) return showToast(await res.text());

    showToast("Proposal rejected", "success");
    setTimeout(() => location.reload(), 800);
  }

  async function counterProposal() {
    if (state.proposal.proposalStatus !== "SENT") {
      return showToast("Proposal already finalized");
    }

    if (state.proposal.actionRequiredBy !== state.user.role) {
      return showToast("Action not allowed");
    }

    const res = await fetch(
      `${API_BASE}/api/proposals/${state.proposal.proposalId}/counter` +
      `?userId=${state.user.id}&role=${state.user.role}`,
      { method: "POST", headers: authHeaders() }
    );

    // FIX: check response BEFORE parsing JSON.
    // Previously, if the backend returned an error, res.json() would parse the
    // error body as a proposal object and redirect to a garbage proposalId URL.
    if (!res.ok) return showToast(await res.text());

    const newProposal = await res.json();

    // Redirect to edit the NEW counter-proposal draft
    window.location.href =
      `/Proposal/proposal.html?proposalId=${newProposal.proposalId}`;
  }

  async function init() {
    await loadProposal();

    // FIX: if loadProposal failed (bad response / missing ID), state.proposal
    // is null — bail out to prevent null-pointer crashes on render calls
    if (!state.proposal) return;

    // Populate delivery location dropdown before rendering data
    const deliveryLoc = document.getElementById("deliveryLocation");
    if (deliveryLoc) {
      ["BUYER_WAREHOUSE", "MANDI", "FARM_GATE", "CUSTOM"]
        .forEach(v => deliveryLoc.add(new Option(v.replace("_", " "), v)));
    }

    const logisticsBy = document.getElementById("logisticsBy");
    if (logisticsBy) {
      ["BUYER", "FARMER", "SHARED"]
        .forEach(v => logisticsBy.add(new Option(v, v)));
    }

    renderMeta();
    renderActions();
    renderProposalData();
    renderCropsReadOnly();

    const acceptBtn = document.getElementById("acceptBtn");
    if (acceptBtn) acceptBtn.onclick = acceptProposal;

    const rejectBtn = document.getElementById("rejectBtn");
    if (rejectBtn) rejectBtn.onclick = rejectProposal;

    const counterBtn = document.getElementById("counterBtn");
    if (counterBtn) counterBtn.onclick = counterProposal;
  }

  document.addEventListener("DOMContentLoaded", init);
})();