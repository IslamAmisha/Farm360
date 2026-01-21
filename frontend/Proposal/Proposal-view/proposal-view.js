//proposal-view.js
(function () {
  const API_BASE = "http://localhost:8080";

  const state = {
  user: {
    id: Number(localStorage.getItem("userId")),
    role: localStorage.getItem("role") // FARMER / BUYER
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

    state.proposal = await (
      await fetch(
        `${API_BASE}/api/proposals/${proposalId}?userId=${state.user.id}`,
        { headers: authHeaders() }
      )
    ).json();

    if (
  state.proposal.senderUserId !== state.user.id &&
  state.proposal.receiverUserId !== state.user.id
) {
  showToast("Unauthorized access");
  window.location.href = "/dashboard.html";
  return;
}
const canEdit =
  state.proposal.proposalStatus === "DRAFT" &&
  state.proposal.senderUserId === state.user.id;

// ✅ ONLY draft creator can edit
if (canEdit) {
  window.location.href =
    `proposal.html?proposalId=${state.proposal.proposalId}`;
  return;
}


  }

//   async function loadSenderProfile() {
//     const senderUserId = state.proposal.senderUserId;

//     const senderRole =
//   state.proposal.senderUserId === state.user.id
//     ? state.user.role
//     : (state.user.role === "farmer" ? "buyer" : "farmer");

//     const url =
//       senderRole === "farmer"
//         ? `${API_BASE}/api/profile/farmer/${senderUserId}`
//         : `${API_BASE}/api/profile/buyer/${senderUserId}`;

//     state.senderProfile = await (
//       await fetch(url, { headers: authHeaders() })
//     ).json();
//   }

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
      <div><strong>Crop:</strong> ${cr.cropName}</div>
      <div><strong>Sub:</strong> ${cr.cropSubCategoryName}</div>
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
  const seasonBlock = seasonSelect.parentElement;
  seasonBlock.style.display =
    p.contractModel === "ANNUAL" ? "none" : "block";
}
document.getElementById("totalLand").value =
  p.landAreaUsed ?? "";


document.getElementById("landUsed").value = p.landAreaUsed || "";
  document.getElementById("contractModel").value = p.contractModel || "";
document.getElementById("seasonSelect").value = p.season || "";
document.getElementById("logisticsBy").value = p.logisticsHandledBy || "";

  document.getElementById("pricePerUnit").value = p.pricePerUnit || "";
document.getElementById("totalAmount").value =
  p.totalAmount ?? "";
  document.getElementById("startYear").value = p.startYear || "";
  document.getElementById("endYear").value = p.endYear || "";
  document.getElementById("deliveryWindow").value = p.deliveryWindow || "";
  document.getElementById("inputProvided").checked = !!p.inputProvided;
document.getElementById("allowCropChange").checked = !!p.allowCropChangeBetweenSeasons;

}


  function renderActions() {
const canAct =
  state.proposal.proposalStatus === "SENT" &&
  state.proposal.actionRequiredBy === state.user.role;

["acceptBtn","rejectBtn","counterBtn"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.style.display = canAct ? "inline-block" : "none";
});

  }

  async function acceptProposal() {
  await fetch(
    `${API_BASE}/api/proposals/${state.proposal.proposalId}/accept` +
    `?userId=${state.user.id}&role=${state.user.role}`,
    { method: "POST", headers: authHeaders() }
  );
  showToast("Proposal accepted", "success");
  setTimeout(() => location.reload(), 800);
}


async function rejectProposal() {
  await fetch(
    `${API_BASE}/api/proposals/${state.proposal.proposalId}/reject` +
    `?userId=${state.user.id}&role=${state.user.role}`,
    { method: "POST", headers: authHeaders() }
  );
  showToast("Proposal rejected", "success");
  setTimeout(() => location.reload(), 800);
}


async function counterProposal() {
  if (
    state.proposal.proposalStatus !== "SENT" ||
    state.proposal.actionRequiredBy !== state.user.role
  ) {
    return showToast("Action not allowed");
  }

  const res = await fetch(
    `${API_BASE}/api/proposals/${state.proposal.proposalId}/counter` +
      `?userId=${state.user.id}&role=${state.user.role}`,
    { method: "POST", headers: authHeaders() }
  );

  const newProposal = await res.json();

  // ✅ ALWAYS GO TO EDIT PAGE
  window.location.href =
    `/Proposal/proposal.html?proposalId=${newProposal.proposalId}`;
}


  async function init() {
    await loadProposal();
    // await loadSenderProfile();
    renderMeta();
    renderActions();

const deliveryLoc = document.getElementById("deliveryLocation");
if (deliveryLoc) {
  ["BUYER_WAREHOUSE","MANDI","FARM_GATE","CUSTOM"]
    .forEach(v => deliveryLoc.add(new Option(v.replace("_"," "), v)));
}

const logisticsBy = document.getElementById("logisticsBy");
if (logisticsBy) {
  ["BUYER","FARMER","SHARED"]
    .forEach(v => logisticsBy.add(new Option(v, v)));
}
  

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
