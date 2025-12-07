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


const buyerDashboardTranslations = {
  en: {
  
    dashboard: "Dashboard",

    navHome: "Home",
    navModules: "Modules",
    navAbout: "About",
    navInsights: "Insights",
    navSupport: "Support",

    /* ---------------------------------------
       SIDEBAR
    ----------------------------------------*/
    sidebarDashboard: "Dashboard",
    sidebarMyProfile: "My Profile",
    sidebarLandFarmers: "Land & Farmers",
    sidebarProposals: "Proposals / Requests",
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
    sidebarProposals: "প্রস্তাব / অনুরোধ",
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

    /* ---------------------------------------
       SEARCH + FILTERS
    ----------------------------------------*/
    searchLabel: "চাষি খুঁজুন",
    searchPlaceholder: "চাষি খুঁজুন...",
    filterApply: "ফিল্টার প্রয়োগ",

    filterSeason: "মৌসুম",
    seasonAll: "সব মৌসুম",

    filterCropType: "ফসল",
    cropAll: "সব ফসল",

    /* ---------------------------------------
       CROPS
    ----------------------------------------*/
    crop_rice: "চাল",
    crop_wheat: "গম",
    crop_potato: "আলু",
    crop_tomato: "টমেটো",
    crop_corn: "ভুট্টা",
    crop_onion: "পেঁয়াজ",

    /* ---------------------------------------
       SEASONS
    ----------------------------------------*/
    season_kharif: "খরিফ",
    season_rabi: "রবি",
    season_summer: "গ্রীষ্ম",

    /* ---------------------------------------
       FARMER LIST SECTION
    ----------------------------------------*/
    farmerProfiles: "উপলব্ধ চাষি",
    farmerProfilesSubtitle:
      "আপনার পছন্দের ফসলের চাষিদের সাথে সংযোগ করুন।",

    /* ---------------------------------------
       BUTTONS
    ----------------------------------------*/
    btnRequest: "অনুরোধ",
    btnDetails: "বিস্তারিত",

    /* ---------------------------------------
       MESSAGES
    ----------------------------------------*/
    msgLoginRequired: "অনুগ্রহ করে আবার লগইন করুন।",
    msgNoFarmers: "এই ফিল্টার অনুযায়ী কোনো চাষি পাওয়া যায়নি।",
  },
};


// OPEN BUYER PROFILE PAGE
document.getElementById("buyerProfileMenu")?.addEventListener("click", () => {
  window.location.href = "../Buyer-Profile/buyer-profile.html";
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

/*******************************
  RENDER FARMERS  (LIKE FARMER RENDERS BUYERS)
*******************************/
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
      // crops: backend field should be `crops` (like buyers endpoint)
      const cropBadges = (f.crops || [])
        .map((c) => {
          const key = "crop_" + String(c).toLowerCase();
          const label = t[key] || c;
          return `<span class="crop-badge">${label}</span>`;
        })
        .join("");

      // location: use villageOrCity + district (same as farmer dashboard buyers)
      const location = [f.villageOrCity, f.district]
        .filter(Boolean)
        .join(", ");

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
            <button class="btn-request" data-text="btnRequest">${t.btnRequest}</button>
            <button class="btn-details" data-text="btnDetails">${t.btnDetails}</button>
          </div>
        </div>
      `;
    })
    .join("");

  if (typeof updateTranslatedText === "function") updateTranslatedText();
}


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
      return renderFarmers([]);
    }

    const data = await resp.json();
    // EXPECTS: data.users = [ { userId, name, villageOrCity, district, crops[], ratingUp, ratingDown } ]
    renderFarmers(data.users || []);
  } catch (e) {
    console.error("Load error:", e);
    renderFarmers([]);
  }
}

/*******************************
  FILTER + LANGUAGE
*******************************/
function applyFilters() {
  loadFarmers();
}

function syncBuyerDashboardLanguage() {
  const { t } = getDashText();
  const search = document.getElementById("farmerSearch");
  if (search) search.placeholder = t.searchPlaceholder;
  loadFarmers();
}

/*******************************
  EVENT BINDINGS
*******************************/
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

  // initial load
  loadFarmers();
});
