
(function protectBuyerDashboard() {
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

//logout
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
// TRANSLATIONS

const buyerDashboardTranslations = {
  en: {
    dashboard: "Dashboard",

    navHome: "Home",
    navModules: "Modules",
    navAbout: "About",
    navInsights: "Insights",
    navSupport: "Support",

    sidebarDashboard: "Dashboard",
    sidebarMyProfile: "My Profile",
    sidebarLandFarmers: "Land & Farmers",
    sidebarRequests: "Requests",
    sidebarProposals: "Proposals",
    sidebarNegotiation: "Negotiation / Messages",
    sidebarAgreements: "Agreements",
    sidebarEscrowWallet: "Escrow & Wallet",
    sidebarInputSupply: "Input Supply",
    sidebarCultivation: "Cultivation / Harvest",
    sidebarLogistics: "Delivery / Logistics",
    sidebarSettings: "Settings",
    sidebarLogout: "Logout",

    dashboardTitle: "Overview",
    dashboardSubtitle:
      "View your agreements, find farmers and collaborate effectively.",

    searchLabel: "Search farmers",
    searchPlaceholder: "Search farmers...",
    filterApply: "Apply",

    filterSeason: "Season",
    seasonAll: "All Seasons",

    filterCropType: "Crop",
    cropAll: "All Crops",

    crop_rice: "Rice",
    crop_wheat: "Wheat",
    crop_potato: "Potato",
    crop_tomato: "Tomato",
    crop_corn: "Corn",
    crop_onion: "Onion",

    season_kharif: "Kharif",
    season_rabi: "Rabi",
    season_summer: "Summer",

    farmerProfiles: "Available Farmers",
    farmerProfilesSubtitle:
      "Connect with farmers cultivating your preferred crops.",

    btnRequest: "Request",
    btnDetails: "Details",

    msgLoginRequired: "Please login again. User info not found.",
    msgNoFarmers: "No farmers found for the selected filters.",
  },

  bn: {
    dashboard: "ড্যাশবোর্ড",

    navHome: "হোম",
    navModules: "মডিউল",
    navAbout: "আমাদের সম্পর্কে",
    navInsights: "তথ্য ও বিশ্লেষণ",
    navSupport: "সহায়তা",

    sidebarDashboard: "ড্যাশবোর্ড",
    sidebarMyProfile: "আমার প্রোফাইল",
    sidebarLandFarmers: "জমি ও চাষি",
    sidebarRequests: "অনুরোধ",
    sidebarProposals: "প্রস্তাব",
    sidebarNegotiation: "আলোচনা / বার্তা",
    sidebarAgreements: "চুক্তি",
    sidebarEscrowWallet: "এসক্রো ও ওয়ালেট",
    sidebarInputSupply: "ইনপুট সরবরাহ",
    sidebarCultivation: "চাষ / ফসল সংগ্রহ",
    sidebarLogistics: "ডেলিভারি / লজিস্টিক্স",
    sidebarSettings: "সেটিংস",
    sidebarLogout: "লগআউট",

    dashboardTitle: "ওভারভিউ",
    dashboardSubtitle:
      "আপনার চুক্তি দেখুন, চাষিদের খুঁজুন এবং সহজে সহযোগিতা করুন।",

    searchLabel: "চাষি খুঁজুন",
    searchPlaceholder: "চাষি খুঁজুন...",
    filterApply: "ফিল্টার প্রয়োগ",

    filterSeason: "মৌসুম",
    seasonAll: "সব মৌসুম",

    filterCropType: "ফসল",
    cropAll: "সব ফসল",

    crop_rice: "চাল",
    crop_wheat: "গম",
    crop_potato: "আলু",
    crop_tomato: "টমেটো",
    crop_corn: "ভুট্টা",
    crop_onion: "পেঁয়াজ",

    season_kharif: "খরিফ",
    season_rabi: "রবি",
    season_summer: "গ্রীষ্ম",

    farmerProfiles: "উপলব্ধ চাষি",
    farmerProfilesSubtitle:
      "আপনার পছন্দের ফসলের চাষিদের সাথে সংযোগ করুন।",

    btnRequest: "অনুরোধ",
    btnDetails: "বিস্তারিত",

    msgLoginRequired: "অনুগ্রহ করে আবার লগইন করুন।",
    msgNoFarmers: "এই ফিল্টার অনুযায়ী কোনো চাষি পাওয়া যায়নি।",
  },
};

// OPEN BUYER PROFILE PAGE
document.getElementById("buyerProfileMenu")?.addEventListener("click", () => {
  window.location.href = "../Buyer-Profile/buyer-profile.html";
});

// OPEN REQUEST PAGE
document.getElementById("buyerRequestsMenu")?.addEventListener("click", () => {
  window.location.href = "../Buyer-Request/buyer-request.html";
});

// OPEN PROPOSALS PAGE
document.getElementById("buyerProposalsMenu")?.addEventListener("click", () => {
  window.location.href = "../Buyer-Proposals/buyer-proposals.html";
});

// merge into global translations if available
if (typeof translations !== "undefined") {
  Object.assign(translations.en, buyerDashboardTranslations.en);
  Object.assign(translations.bn, buyerDashboardTranslations.bn);
}

const API_BASE_URL = "http://localhost:8080";

function getDashText() {
  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) ||
    buyerDashboardTranslations[lang];
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
  if (!phone) return "N/A";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length < 4) return "******";
  const start = digits.slice(0, 2);
  const end = digits.slice(-2);
  return `${start}******${end}`;
}

// cache for farmer details
let farmersCache = {};

// RENDER FARMERS

function renderFarmers(list) {
  const { t } = getDashText();
  const container = document.getElementById("farmersGrid");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="farmer-card empty-card">
        <p>${t.msgNoFarmers}</p>
      </div>`;
    return;
  }

  container.innerHTML = list
    .map((f) => {
      const cropBadges = (f.crops || [])
        .map((c) => {
          const key = "crop_" + String(c).toLowerCase();
          const label = t[key] || c;
          return `<span class="crop-badge">${label}</span>`;
        })
        .join("");

      const location = [f.villageOrCity, f.district]
        .filter(Boolean)
        .join(", ");

      // Detect already requested
      const isRequested =
        f.requestStatus === "PENDING" ||
        f.requestStatus === "ACCEPTED" ||
        f.alreadyRequested === true;

      const requestButton = isRequested
        ? `<button class="btn-request requested" disabled>✔ Requested</button>`
        : `<button class="btn-request">${t.btnRequest}</button>`;

      return `
        <div class="farmer-card buyer-card" data-farmer-id="${f.userId}">
          <h3>${f.name}</h3>

          <div class="buyer-rating">
            ${getThumbRating(f.ratingUp, f.ratingDown)}
          </div>

          <p class="buyer-company">${f.villageOrCity || ""}</p>
          <p class="buyer-location">📍 ${location}</p>

          <div class="buyer-crops">${cropBadges}</div>

          <div class="buyer-buttons">
            ${requestButton}
            <button class="btn-details">${t.btnDetails}</button>
          </div>
        </div>
      `;
    })
    .join("");

  // Attach events
  const cards = container.querySelectorAll(".farmer-card.buyer-card");
  cards.forEach((card) => {
    const farmerId = card.getAttribute("data-farmer-id");
    const farmer = farmersCache[farmerId];

    const reqBtn = card.querySelector(".btn-request");
    const detBtn = card.querySelector(".btn-details");

    if (reqBtn && !reqBtn.classList.contains("requested")) {
      reqBtn.onclick = () => {
        if (farmerId) sendRequestToFarmer(farmerId, reqBtn);
      };
    }

    if (detBtn) {
      detBtn.onclick = () => {
        if (farmer) openFarmerDetails(farmer);
      };
    }
  });

  if (typeof updateTranslatedText === "function") updateTranslatedText();
}



// LOAD FARMERS

async function loadFarmers() {
  const { token, userId } = getAuthInfo();
  const { t } = getDashText();

  if (!token || !userId) return alert(t.msgLoginRequired);

  const search =
    document.getElementById("farmerSearch")?.value.trim().toLowerCase() || "";
  const crop = document.getElementById("cropFilter")?.value || "";

  const params = new URLSearchParams();
  params.append("buyerUserId", userId);
  if (search) params.append("search", search);
  if (crop) params.append("crop", crop);

  const container = document.getElementById("farmersGrid");
  container.innerHTML = `
    <div class="buyer-card loading-card">
      <div class="loader"></div>
    </div>
  `;

  try {
    const resp = await fetch(
      `${API_BASE_URL}/dashboard/farmers?${params.toString()}`,
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
      farmersCache = {};
      return renderFarmers([]);
    }

    const data = await resp.json();
    farmersCache = {};
    (data.users || []).forEach((f) => {
      if (f && f.userId != null) {
        farmersCache[String(f.userId)] = f;
      }
    });

    renderFarmers(data.users || []);
  } catch (e) {
    console.error("Load error:", e);
    farmersCache = {};
    renderFarmers([]);
  }
}


// SEND REQUEST

async function sendRequestToFarmer(farmerId, btn) {
  const { token, userId } = getAuthInfo();
  const { t } = getDashText();

  if (!token || !userId) return alert(t.msgLoginRequired);

  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const resp = await fetch(
      `${API_BASE_URL}/request/send?userId=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ receiverId: farmerId }),
      }
    );

    // No matter what, lock the button
    btn.textContent = "✔ Requested";
    btn.classList.add("requested");
    btn.disabled = true;

  } catch (e) {
    console.error(e);
    btn.textContent = t.btnRequest;
    btn.disabled = false;
  }
}



// POPUP DETAILS

function openFarmerDetails(f) {
  if (!f) return;

  // Top header
  document.getElementById("fd_name").textContent = f.name || "";
  document.getElementById("fd_location").textContent =
    `${f.villageOrCity || ""}${f.villageOrCity && f.district ? ", " : ""}${f.district || ""}`;

  // Overview
  document.getElementById("fd_fullName").textContent = f.name || "";
  document.getElementById("fd_phone").textContent = f.maskedPhone || "N/A";
  
  // Address
  document.getElementById("fd_district").textContent = f.district || "N/A";
  document.getElementById("fd_block").textContent = "N/A";
  document.getElementById("fd_village").textContent =
    f.villageOrCity || "N/A";
  document.getElementById("fd_pin").textContent = f.pinCode || "N/A";

  // Lands (FINAL)
const lands = Array.isArray(f.lands) ? f.lands : [];
let html = "";

if (!lands.length) {
  html = `<p class="fd-empty">No lands added</p>`;
} else {
  lands.forEach((land, idx) => {
    const size = land.size ?? "N/A";
    const type = land.croppingPattern
      ? land.croppingPattern.charAt(0) +
        land.croppingPattern.slice(1).toLowerCase()
      : "N/A";
    const crops = (land.crops || []).join(", ") || "N/A";
    const subs = (land.subcategories || []).join(", ") || "N/A";

    html += `
      <div class="fd-land-card">
        <div class="fd-land-header">
          <span class="fd-land-title">Land ${idx + 1}</span>
        </div>
        <div class="fd-land-body">
          <div class="fd-row"><span class="fd-label">Size</span><span>${size} acres</span></div>
          <div class="fd-row"><span class="fd-label">Type</span><span>${type}</span></div>
          <div class="fd-row"><span class="fd-label">Crops</span><span>${crops}</span></div>
          <div class="fd-row"><span class="fd-label">Subcategories</span><span>${subs}</span></div>
        </div>
      </div>
    `;
  });
}

document.getElementById("fd_lands").innerHTML = html;


  // Show overlay
  document.getElementById("farmerDetailsPopup").classList.remove("hidden");
}




function closeFarmerDetails() {
  document.getElementById("farmerDetailsPopup").classList.add("hidden");
}


// FILTER + LANGUAGE

function applyFilters() {
  loadFarmers();
}

function syncBuyerDashboardLanguage() {
  const { t } = getDashText();
  const search = document.getElementById("farmerSearch");
  if (search) search.placeholder = t.searchPlaceholder;
  loadFarmers();
}


// EVENTS

document.getElementById("langToggle")?.addEventListener("click", () =>
  setTimeout(syncBuyerDashboardLanguage, 0)
);
document
  .getElementById("mobileLangToggle")
  ?.addEventListener("click", () =>
    setTimeout(syncBuyerDashboardLanguage, 0)
  );

document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

document.addEventListener("DOMContentLoaded", () => {
  const { t } = getDashText();
  const search = document.getElementById("farmerSearch");
  if (search) search.placeholder = t.searchPlaceholder;

  document
    .getElementById("applyFiltersBtn")
    ?.addEventListener("click", applyFilters);

  document.querySelector(".logout")?.addEventListener("click", logoutUser);

  

  loadFarmers();

  const overlay = document.getElementById("farmerDetailsPopup");
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeFarmerDetails();
    }
  });
});
