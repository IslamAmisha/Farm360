(function protectFarmerDashboard() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token || !userId || role !== "farmer") {
    alert("User not found or unauthorized access!");
    localStorage.clear();
    window.location.href = "../../Login/login.html";
    return;
  }
})();

function logoutUser() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/auth/logout", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).finally(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../../Login/login.html";
  });
}
// Extended translations
const dashboardTranslations = {
  en: {
    brandName: "Farm360",

    navHome: "Home",
    navModules: "Modules",
    navAbout: "About",
    navInsights: "Insights",
    navSupport: "Support",

    dashboard: "Dashboard",

    sidebarDashboard: "Dashboard",
sidebarMyProfile: "My Profile",
sidebarLandsBuyers: "My Lands & Buyers",
sidebarProposalsRequests: "Proposals / Requests",
sidebarNegotiation: "Negotiation / Messages",
sidebarAgreements: "Agreements",
sidebarWallet: "Wallet",
sidebarInputSupply: "Input Supply",
sidebarCultivationHarvest: "Cultivation / Harvest",
sidebarDelivery: "Delivery / Logistics",
sidebarSettings: "Settings",
sidebarLogout: "Logout",


    dashboardTitle: "Overview",
    dashboardSubtitle:
      "Here is your activity summary and available connections.",

    searchLabel: "Search buyers",
    searchPlaceholder: "Search buyers...",

    filterApply: "Apply",
    filterSeason: "Season",
    seasonAll: "All Seasons",
    filterCropType: "Crop",
    cropAll: "All Crops",

    summaryAgreements: "Agreements",
    summaryProposals: "Proposals",
    summaryPayments: "Payments",
    summaryProgress: "Progress",

    buyerProfiles: "Available Buyers",
    buyerProfilesSubtitle:
      "Connect with buyers interested in your crops.",

    btnRequest: "Request",
    btnRequested: "Requested",
    btnConnected: "Connected",
    btnDetails: "Details",

    crop_rice: "Rice",
    crop_wheat: "Wheat",
    crop_potato: "Potato",
    crop_tomato: "Tomato",
    crop_corn: "Corn",
    crop_onion: "Onion",

    season_kharif: "Kharif",
    season_rabi: "Rabi",
    season_summer: "Summer",

    msgNoBuyers: "No buyers found for the selected filters.",
    msgLoginRequired: "Please login again. User info not found.",
    msgRequestSent: "Request sent successfully.",
    msgRequestFailed: "Failed to send request. Please try again.",
  },

  bn: {
    brandName: "ফার্ম৩৬০",

    navHome: "হোম",
    navModules: "মডিউল",
    navAbout: "আমাদের সম্পর্কে",
    navInsights: "তথ্য ও বিশ্লেষণ",
    navSupport: "সহায়তা",

    dashboard: "ড্যাশবোর্ড",

    sidebarDashboard: "ড্যাশবোর্ড",
sidebarMyProfile: "আমার প্রোফাইল",
sidebarLandsBuyers: "জমি ও ক্রেতা",
sidebarRequests: "Requests",
sidebarProposals: "Proposals",

sidebarNegotiation: "আলোচনা / বার্তা",
sidebarAgreements: "চুক্তি",
sidebarWallet: "ওয়ালেট",
sidebarInputSupply: "ইনপুট সরবরাহ",
sidebarCultivationHarvest: "চাষ / ফসল সংগ্রহ",
sidebarDelivery: "ডেলিভারি / লজিস্টিক্স",
sidebarSettings: "সেটিংস",
sidebarLogout: "লগআউট",


    dashboardTitle: "ওভারভিউ",
    dashboardSubtitle:
      "আপনার চুক্তি, প্রস্তাব দেখুন এবং বিশ্বস্ত ক্রেতাদের সাথে সংযোগ করুন।",

    searchLabel: "ক্রেতা খুঁজুন",
    searchPlaceholder: "ক্রেতা খুঁজুন...",

    filterApply: "ফিল্টার প্রয়োগ",
    filterSeason: "মৌসুম",
    seasonAll: "সব মৌসুম",
    filterCropType: "ফসল",
    cropAll: "সব ফসল",

    summaryAgreements: "মোট চুক্তি",
    sidebarRequests: "অনুরোধ",
sidebarProposals: "প্রস্তাব",

    summaryPayments: "মোট পেমেন্ট",
    summaryProgress: "অগ্রগতি",

    buyerProfiles: "উপলব্ধ ক্রেতা",
    buyerProfilesSubtitle:
      "আপনার ফসলে আগ্রহী ক্রেতাদের সাথে সংযোগ করুন",

    btnRequest: "অনুরোধ",
    btnRequested: "অনুরোধ পাঠানো হয়েছে",
    btnConnected: "সংযুক্ত",
    btnDetails: "বিস্তারিত",

    crop_rice: "চাল",
    crop_wheat: "গম",
    crop_potato: "আলু",
    crop_tomato: "টমেটো",
    crop_corn: "ভুট্টা",
    crop_onion: "পেঁয়াজ",

    season_kharif: "খরিফ",
    season_rabi: "রবি",
    season_summer: "গ্রীষ্ম",

    msgNoBuyers: "এই ফিল্টার অনুযায়ী কোনো ক্রেতা পাওয়া যায়নি।",
    msgLoginRequired: "অনুগ্রহ করে আবার লগইন করুন।",
    msgRequestSent: "অনুরোধ সফলভাবে পাঠানো হয়েছে।",
    msgRequestFailed: "অনুরোধ পাঠাতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
  },
};

// Handle My Profile button click
document.getElementById("farmerProfileMenu")?.addEventListener("click", () => {
  window.location.href = "../Farmer-Profile/farmer-profile.html";
});


// Merge translations
if (typeof translations !== "undefined") {
  Object.assign(translations.en, dashboardTranslations.en);
  Object.assign(translations.bn, dashboardTranslations.bn);
}

const API_BASE_URL = "http://localhost:8080";

let buyerDetailsModal, buyerDetailsBody, buyerModalCloseBtn;


function getDashText() {
  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) ||
    dashboardTranslations[lang];
  return { lang, t };
}

function getAuthInfo() {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
  };
}

function getThumbRating(up, down) {
  return `
    <div class="thumb-line">👍 ${up ?? 0}</div>
    <div class="thumb-line">👎 ${down ?? 0}</div>
  `;
}
function maskPhone(phone) {
  if (!phone) return "-";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length < 6) return "******";
  const start = digits.slice(0, 2);
  const end = digits.slice(-2);
  return `${start}******${end}`;
}

function maskAadhaar(aadhaar) {
  if (!aadhaar) return "N/A";
  const digits = String(aadhaar).replace(/\D/g, "");
  if (digits.length < 4) return "XXXX-XXXX-XXXX";
  return `XXXX-XXXX-${digits.slice(-4)}`;
}


function detailRow(label, value) {
  if (!value) return "";
  return `
    <div class="detail-row">
      <div class="detail-label">${label}</div>
      <div class="detail-value">${value}</div>
    </div>
  `;
}


function renderBuyers(list) {
  const { t } = getDashText();
  const container = document.getElementById("buyersGrid");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="buyer-card empty-card">
        <p>${t.msgNoBuyers}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  list.forEach((b) => {
    // badges
    const cropBadges = (b.crops || [])
      .map((c) => {
        const key = "crop_" + String(c).toLowerCase();
        const label = t[key] || c;
        return `<span class="crop-badge">${label}</span>`;
      })
      .join("");

    // request button state
    let requestLabel = t.btnRequest;
    let disabled = false;
    if (!b.canSendRequest) {
      if (b.requestStatus === "PENDING") requestLabel = t.btnRequested;
      else if (b.requestStatus === "ACCEPTED") requestLabel = t.btnConnected;
      disabled = true;
    }

    const location = [b.villageOrCity, b.district].filter(Boolean).join(", ");

    // create card element
    const card = document.createElement("div");
    card.className = "buyer-card";
    card.dataset.receiverId = b.userId;

    card.innerHTML = `
      <h3>${b.name}</h3>

      <div class="buyer-rating">
        ${getThumbRating(b.ratingUp, b.ratingDown)}
      </div>

      <p class="buyer-company">${b.businessName || ""}</p>
      <p class="buyer-location">📍 ${location}</p>

      <div class="buyer-crops">${cropBadges}</div>

      <div class="buyer-buttons buyer-actions">
        <button class="btn-request" ${disabled ? "disabled" : ""}>
          ${requestLabel}
        </button>
        <button class="btn-details">
          ${t.btnDetails}
        </button>
      </div>
    `;

    const reqBtn = card.querySelector(".btn-request");
    const detailsBtn = card.querySelector(".btn-details");

    if (reqBtn && !disabled) {
      reqBtn.addEventListener("click", () => {
  selectedBuyer = b;
  openRequestModal(b);
});

    }

    if (detailsBtn) {
      detailsBtn.addEventListener("click", () => openBuyerDetailsModal(b));
    }

    container.appendChild(card);
  });

  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }
}

function openBuyerDetailsModal(buyer) {
  if (!buyerDetailsModal || !buyerDetailsBody) return;

  const maskedPhone =
    buyer.maskedPhone || maskPhone(buyer.phoneNumber || buyer.phone);

  const maskedAadhaar =
    buyer.maskedAadhaar || maskAadhaar(buyer.aadhaarNo || buyer.aadhaar);

  const seasons = Array.isArray(buyer.seasons)
    ? buyer.seasons.join(", ")
    : (buyer.seasons || "N/A");

  const crops = Array.isArray(buyer.crops)
    ? buyer.crops.join(", ")
    : (buyer.crops || "N/A");

  const subcats = Array.isArray(buyer.cropSubcategories || buyer.subcategories)
    ? (buyer.cropSubcategories || buyer.subcategories).join(", ")
    : (buyer.cropSubcategories || buyer.subcategories || "N/A");

 buyerDetailsBody.innerHTML = `
  <div class="section-header">BUYER OVERVIEW</div>
  <div class="info-card">
    <div class="details-grid">
      ${detailRow("Name", buyer.name)}
      ${detailRow("Business Name", buyer.businessName)}
      ${detailRow("Phone", maskedPhone)}
      ${detailRow("Aadhaar", maskedAadhaar)}
    </div>
  </div>

  <div class="section-header">LOCATION</div>
  <div class="info-card">
    <div class="details-grid">
      ${detailRow("District", buyer.district)}
      ${detailRow("Village / City", buyer.villageOrCity)}
      ${detailRow("Warehouse Name", buyer.warehouseName)}
      ${detailRow("Warehouse Location", buyer.warehouseLocation)}
    </div>
  </div>

  <div class="section-header">BUSINESS INFORMATION</div>
  <div class="info-card">
    <div class="details-grid">
      ${detailRow("Business Type", buyer.businessType)}
      ${detailRow("Business Scale", buyer.businessScale)}
      ${detailRow("Annual Purchase", buyer.annualPurchase)}
      ${detailRow("Contract Model", buyer.contractModel)}
    </div>
  </div>

  <div class="section-header">CROPS & SEASONS</div>
  <div class="info-card">
    <div class="details-grid">
      ${detailRow("Seasons", seasons)}
      ${detailRow("Crops", crops)}
      ${detailRow("Crop Subcategories", subcats)}
    </div>
  </div>
`;



  buyerDetailsModal.hidden = false;
}



function closeBuyerModal() {
  if (buyerDetailsModal) buyerDetailsModal.hidden = true;
}


async function loadBuyers() {
  const { token, userId } = getAuthInfo();
  const { t } = getDashText();

  if (!token || !userId) return alert(t.msgLoginRequired);

  const search =
    document.getElementById("buyerSearch")?.value.trim().toLowerCase() || "";
  const crop = document.getElementById("cropFilter")?.value || "";

  const params = new URLSearchParams();
  params.append("farmerUserId", userId);
  if (search) params.append("search", search);
  if (crop) params.append("crop", crop);

  const container = document.getElementById("buyersGrid");
  container.innerHTML = `
      <div class="buyer-card loading-card">
        <div class="loader"></div>
      </div>`;

  try {
    const resp = await fetch(
      `${API_BASE_URL}/dashboard/buyers?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!resp.ok) {
      console.error("Load error:", resp.status);
      return renderBuyers([]);
    }

    const data = await resp.json();
    renderBuyers(data.users || []);
  } catch (e) {
    console.error("Load error:", e);
    renderBuyers([]);
  }
}

// async function sendRequestToBuyer(receiverUserId, btn) {
//   const { token, userId } = getAuthInfo();
//   const { t } = getDashText();

//   if (!token || !userId) return alert(t.msgLoginRequired);

//   btn.disabled = true;

//   try {
//     const resp = await fetch(
//       `${API_BASE_URL}/request/send?userId=${encodeURIComponent(userId)}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//         body: JSON.stringify({ receiverId: receiverUserId }),
//       }
//     );

//     const body = await resp.json().catch(() => ({}));

//     if (resp.ok && body.success) {
//       alert(t.msgRequestSent);
//       btn.textContent = t.btnRequested;
//       btn.disabled = true;
//     } else {
//       alert(t.msgRequestFailed);
//       btn.disabled = false;
//     }
//   } catch (e) {
//     alert(t.msgRequestFailed);
//     btn.disabled = false;
//   }
// }

function attachRequestButtonHandlers() {
  const cards = document.querySelectorAll(".buyer-card .btn-request");

  cards.forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", () => {
      if (btn.disabled) return;

      const card = btn.closest(".buyer-card");
      const receiver = card.getAttribute("data-receiver-id");
      if (receiver) sendRequestToBuyer(receiver, btn);
    });
  });
}

function applyFilters() {
  loadBuyers();
}

function syncDashboardLanguage() {
  const { t } = getDashText();

  const search = document.getElementById("buyerSearch");
  if (search) search.placeholder = t.searchPlaceholder;

  loadBuyers();
}

// Requests page link
document.getElementById("farmerRequestsMenu")?.addEventListener("click", () => {
  window.location.href = "../Farmer-Request/farmer-request.html";
});

// Proposals page link
document.getElementById("farmerProposalsMenu")?.addEventListener("click", () => {
  window.location.href = "../Farmer-Proposals/farmer-proposals.html"; 
  // (or your actual proposals page)
});


document.getElementById("langToggle")?.addEventListener("click", () =>
  setTimeout(syncDashboardLanguage, 0)
);
document.getElementById("mobileLangToggle")?.addEventListener("click", () =>
  setTimeout(syncDashboardLanguage, 0)
);

document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

document.addEventListener("DOMContentLoaded", async () => {
  const { t } = getDashText();
  const search = document.getElementById("buyerSearch");
  if (search) search.placeholder = t.searchPlaceholder;

  buyerDetailsModal = document.getElementById("buyerDetailsModal");
  buyerDetailsBody = document.getElementById("buyerDetailsBody");
  buyerModalCloseBtn = document.getElementById("buyerModalCloseBtn");

  buyerModalCloseBtn?.addEventListener("click", closeBuyerModal);

  // close when clicking outside modal box
  buyerDetailsModal?.addEventListener("click", (e) => {
    if (e.target === buyerDetailsModal) {
      closeBuyerModal();
    }
  });

  document
    .getElementById("applyFiltersBtn")
    ?.addEventListener("click", applyFilters);

  document.querySelector(".logout")?.addEventListener("click", logoutUser);

    await loadFarmerLands();
  loadBuyers();
});

let selectedBuyer = null;
let selectedLandId = null;
let selectedCropId = null;
let selectedSubCategoryId = null;

function openRequestModal(buyer) {

  if (!farmerLands || farmerLands.length === 0) {
    alert("Your lands are still loading. Please try again.");
    return;
  }

  selectedBuyer = buyer;
  selectedLandId = null;
  selectedCropId = null;
  selectedSubCategoryId = null;

  const modal = document.getElementById("requestModal");
  const landInput = document.getElementById("reqLandInput");
  const landPicker = document.getElementById("landPicker");
  const cropSelect = document.getElementById("reqCropSelect");
  const subSelect = document.getElementById("reqSubCategorySelect");

  // reset UI
  landInput.value = "";
  landPicker.innerHTML = "";
  cropSelect.innerHTML = `<option value="">Select crop</option>`;
  subSelect.innerHTML = `<option value="">Select crop type</option>`;

  // -------- populate land picker --------
  farmerLands.forEach(land => {
    const div = document.createElement("div");
    div.className = "picker-item";
    div.textContent = `Land – ${land.size} Acre`;

    div.onclick = () => {
      landInput.value = div.textContent;
      selectedLandId = land.landId;

      // reset crop + subcategory
      cropSelect.innerHTML = `<option value="">Select crop</option>`;
      subSelect.innerHTML = `<option value="">Select crop type</option>`;
      selectedCropId = null;
      selectedSubCategoryId = null;

      // populate crops
      land.crops.forEach(crop => {
        const opt = document.createElement("option");
        opt.value = crop.id;        // ✅ cropId
        opt.textContent = crop.name;
        cropSelect.appendChild(opt);
      });

      landPicker.classList.add("hidden");
    };

    landPicker.appendChild(div);
  });

  landInput.onclick = () => landPicker.classList.toggle("hidden");

  const seasonGroup = document.getElementById("seasonGroup");
const seasonSelect = document.getElementById("reqSeasonSelect");

// 🔑 CONTRACT MODEL BASED UI
if (buyer.contractModel === "SEASONAL") {
  seasonGroup.style.display = "block";
  seasonSelect.value = "";
} else {
  // ANNUAL contract → no season selection
  seasonGroup.style.display = "none";
  seasonSelect.value = "";
}


  // -------- crop → subcategory --------
  cropSelect.onchange = () => {
    selectedCropId = Number(cropSelect.value);
    selectedSubCategoryId = null;
    subSelect.innerHTML = `<option value="">Select crop type</option>`;

    if (!selectedCropId || !selectedLandId) return;

    const land = farmerLands.find(l => l.landId === selectedLandId);
    const crop = land.crops.find(c => c.id === selectedCropId);

    crop.subcategories.forEach(sc => {
      const opt = document.createElement("option");
      opt.value = sc.id;          // ✅ subCategoryId
      opt.textContent = sc.name;
      subSelect.appendChild(opt);
    });
  };

  subSelect.onchange = () => {
    selectedSubCategoryId = Number(subSelect.value);
  };

  modal.hidden = false;
}



document.getElementById("requestModalClose").onclick =
document.getElementById("cancelRequestBtn").onclick = () => {
  document.getElementById("requestModal").hidden = true;
};


document.getElementById("confirmRequestBtn").onclick = async () => {

  const { token, userId } = getAuthInfo();
const season =
  selectedBuyer.contractModel === "SEASONAL"
    ? document.getElementById("reqSeasonSelect").value
    : null;

  // -------- frontend validation --------
  if (!selectedLandId) {
    alert("Please select land");
    return;
  }

  if (!selectedCropId) {
    alert("Please select crop");
    return;
  }

  if (!selectedSubCategoryId) {
    alert("Please select crop type");
    return;
  }

  if (
  selectedBuyer.contractModel === "SEASONAL" &&
  !season
) {
  alert("Please select season");
  return;
}


  // -------- send request --------
  const resp = await fetch(
    `${API_BASE_URL}/request/send?userId=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        receiverId: selectedBuyer.userId,
        landId: selectedLandId,
        cropId: selectedCropId,
        subCategoryId: selectedSubCategoryId,
        season: season || null
      })
    }
  );

  const res = await resp.json();
  alert(res.message || "Request sent");

  document.getElementById("requestModal").hidden = true;
  loadBuyers();
};


let farmerLands = [];

async function loadFarmerLands() {
  const { token, userId } = getAuthInfo();

  const resp = await fetch(
    `${API_BASE_URL}/api/farmers/${userId}/lands`,
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );

  if (!resp.ok) {
    console.error("Failed to load lands", resp.status);
    farmerLands = [];
    return;
  }

  farmerLands = await resp.json();
  console.log("Farmer lands loaded:", farmerLands);
}


