/* ============================================
<<<<<<< Updated upstream
   BUYER DASHBOARD JS  (BACKEND-INTEGRATED)
   Buyer sees: Available FARMERS
=======
   BUYER DASHBOARD JS (Updated for new sidebar)
>>>>>>> Stashed changes
============================================ */

const buyerDashboardTranslations = {
  en: {
    brandName: "Farm360",

    navHome: "Home",
    navModules: "Modules",
    navAbout: "About",
    navInsights: "Insights",
    navSupport: "Support",

    dashboard: "Dashboard",
    sidebarDashboard: "Dashboard",
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
      "Here is your activity summary and available connections.",

    searchLabel: "Search farmers",
    searchPlaceholder: "Search farmers...",

    filterApply: "Apply",
    filterSeason: "Season",
    seasonAll: "All Seasons",
    filterCropType: "Crop",
    cropAll: "All Crops",

    summaryAgreements: "Agreements",
    summaryRequests: "Requests",
    summaryProgress: "Progress",

    farmerProfiles: "Available Farmers",
    farmerProfilesSubtitle:
      "Connect with farmers cultivating your preferred crops",

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

    msgNoFarmers: "No farmers found for the selected filters.",
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
    sidebarLandFarmers: "ভূমি ও চাষি",
    sidebarProposals: "অনুরোধ / প্রস্তাবনা",
    sidebarNegotiation: "আলোচনা / বার্তা",
    sidebarAgreements: "চুক্তি",
    sidebarEscrowWallet: "ইস্ক্রো ও ওয়ালেট",
    sidebarInputSupply: "ইনপুট সাপ্লাই",
    sidebarCultivation: "চাষ / ফসল",
    sidebarLogistics: "সরবরাহ / লজিস্টিক্স",
    sidebarSettings: "সেটিংস",
    sidebarLogout: "লগআউট",

    dashboardTitle: "ওভারভিউ",
    dashboardSubtitle:
      "আপনার চুক্তি দেখুন, চাষিদের খুঁজুন এবং সহযোগিতা করুন।",

    searchLabel: "চাষি খুঁজুন",
    searchPlaceholder: "চাষি খুঁজুন...",

    filterApply: "ফিল্টার প্রয়োগ",
    filterSeason: "মৌসুম",
    seasonAll: "সব মৌসুম",
    filterCropType: "ফসল",
    cropAll: "সব ফসল",

    summaryAgreements: "মোট চুক্তি",
    summaryRequests: "মোট অনুরোধ",
    summaryProgress: "অগ্রগতি",

    farmerProfiles: "উপলব্ধ চাষি",
    farmerProfilesSubtitle:
      "আপনার পছন্দসই ফসল উৎপাদনকারী চাষিদের সাথে সংযোগ করুন",

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

    msgNoFarmers: "এই ফিল্টার অনুযায়ী কোনো চাষি পাওয়া যায়নি।",
    msgLoginRequired: "অনুগ্রহ করে আবার লগইন করুন।",
    msgRequestSent: "অনুরোধ সফলভাবে পাঠানো হয়েছে।",
    msgRequestFailed: "অনুরোধ পাঠাতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
  },
};

// merge into global system
if (typeof translations !== "undefined") {
  Object.assign(translations.en, buyerDashboardTranslations.en);
  Object.assign(translations.bn, buyerDashboardTranslations.bn);
}

<<<<<<< Updated upstream
const BUYER_API_BASE_URL = "http://localhost:8080";

/* ============================================
   ACCESS CONTROL (BUYER ONLY)
============================================ */
(function protectBuyerDashboard() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();
=======
// 2) FARMERS DATA (same as before)
const farmersData = [
  { id: 1, name: "Rakesh Das", bnName: "রাকেশ দাস", village: "Bara Village", crops: ["Rice", "Wheat"], location: "Nadia", bnLocation: "নদিয়া", thumbsUp: 51, thumbsDown: 9 },
  { id: 2, name: "Soma Mondal", bnName: "সোমা মন্ডল", village: "Dakshin Para", crops: ["Potato", "Tomato"], location: "Howrah", bnLocation: "হাওড়া", thumbsUp: 32, thumbsDown: 7 },
  { id: 3, name: "Ajoy Manna", bnName: "অজয় মান্না", village: "Majher Para", crops: ["Corn", "Onion"], location: "Burdwan", bnLocation: "বর্ধমান", thumbsUp: 44, thumbsDown: 10 },
  { id: 4, name: "Lata Soren", bnName: "লতা সরেন", village: "North Colony", crops: ["Rice", "Tomato"], location: "Bankura", bnLocation: "বাঁকুড়া", thumbsUp: 29, thumbsDown: 6 },
];

// 3) Rating
function getThumbRating(farmer) {
  return `<div class="thumb-line">👍 ${farmer.thumbsUp}</div><div class="thumb-line">👎 ${farmer.thumbsDown}</div>`;
}
>>>>>>> Stashed changes

  // If not logged in OR wrong role OR missing data → block access
  if (!token || !userId || role !== "buyer") {
    alert("User not found or unauthorized access!");
    localStorage.clear();
    window.location.href = "../../Login/login.html"; // adjust path if needed
    return;
  }
})();


function getBuyerText() {
  const lang = window.currentLanguage || "en";
<<<<<<< Updated upstream
  const t =
    (window.translations && window.translations[lang]) ||
    buyerDashboardTranslations[lang];
  return { lang, t };
}

function getAuthInfo() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  return { token, userId, role };
}

// Rating display
function getThumbRatingForFarmer(ratingUp, ratingDown) {
  return `
    <div class="thumb-line">👍 ${ratingUp ?? 0}</div>
    <div class="thumb-line">👎 ${ratingDown ?? 0}</div>
  `;
}

// Render farmers from backend
function renderFarmers(list) {
  const { lang, t } = getBuyerText();
=======
  const t = (window.translations && window.translations[lang]) || buyerDashboardTranslations[lang];
>>>>>>> Stashed changes
  const container = document.getElementById("farmersGrid");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="farmer-card buyer-card empty-card">
        <p>${t.msgNoFarmers}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list
    .map((f) => {
      const cropBadges = (f.crops || [])
        .map((c) => {
          const key = "crop_" + String(c).toLowerCase();
          const label = (t && t[key]) || c;
          return `<span class="crop-badge" data-text="${key}">${label}</span>`;
        })
        .join("");

      let requestLabel = t.btnRequest;
      let requestDisabled = false;

      if (!f.canSendRequest) {
        if (f.requestStatus === "PENDING") {
          requestLabel = t.btnRequested;
        } else if (f.requestStatus === "ACCEPTED") {
          requestLabel = t.btnConnected;
        }
        requestDisabled = true;
      }

      const btnReq = requestLabel;
      const btnDet = (t && t.btnDetails) || "Details";

      const locationText = [f.villageOrCity, f.district]
        .filter(Boolean)
        .join(", ");

      return `
<<<<<<< Updated upstream
      <div class="farmer-card buyer-card" data-receiver-id="${f.userId}">
        <h3>${f.name}</h3>

        <div class="buyer-rating">
          ${getThumbRatingForFarmer(f.ratingUp, f.ratingDown)}
        </div>

        <p class="buyer-company">${f.villageOrCity || ""}</p>
        <p class="buyer-location">📍 ${locationText}</p>

=======
      <div class="farmer-card buyer-card">
        <h3>${lang === "bn" ? f.bnName : f.name}</h3>
        <div class="buyer-rating">${getThumbRating(f)}</div>
        <p class="buyer-company">${f.village}</p>
        <p class="buyer-location">📍 ${lang === "bn" ? f.bnLocation : f.location}</p>
>>>>>>> Stashed changes
        <div class="buyer-crops">${cropBadges}</div>
        <div class="buyer-buttons">
          <button class="btn-request"
                  data-text="btnRequest"
                  ${requestDisabled ? "disabled" : ""}>
            ${btnReq}
          </button>
          <button class="btn-details" data-text="btnDetails">${btnDet}</button>
        </div>
      </div>`;
    })
    .join("");

<<<<<<< Updated upstream
  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }

  attachFarmerRequestHandlers();
}

// Load farmers from backend
async function loadFarmers() {
  const { token, userId } = getAuthInfo();
  const { t } = getBuyerText();

  if (!token || !userId) {
    alert(t.msgLoginRequired);
    return;
  }

  const searchText =
    document.getElementById("farmerSearch")?.value.trim().toLowerCase() || "";
  const cropFilter = document.getElementById("cropFilter")?.value || "";

  const params = new URLSearchParams();
  params.append("buyerUserId", userId);
  if (searchText) params.append("search", searchText);
  if (cropFilter) params.append("crop", cropFilter);

  const container = document.getElementById("farmersGrid");
  if (container) {
    container.innerHTML = `
      <div class="buyer-card loading-card">
        <div class="loader"></div>
      </div>`;
  }

  try {
    const resp = await fetch(
      `${BUYER_API_BASE_URL}/dashboard/farmers?` + params.toString(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!resp.ok) {
      console.error("Failed to load farmers:", resp.status);
      renderFarmers([]);
      return;
    }

    const data = await resp.json(); // { users: [...] }
    renderFarmers(data.users || []);
  } catch (err) {
    console.error("Error loading farmers:", err);
    renderFarmers([]);
  }
}


async function sendRequestToFarmer(receiverUserId, buttonEl) {
  const { token, userId } = getAuthInfo();
  const { t } = getBuyerText();

  if (!token || !userId) {
    alert(t.msgLoginRequired);
    return;
  }

  buttonEl.disabled = true;

  try {
    const resp = await fetch(
      `${BUYER_API_BASE_URL}/request/send?userId=${encodeURIComponent(
        userId
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ receiverId: receiverUserId }),
      }
    );

    const body = await resp.json().catch(() => ({}));

    if (resp.ok && body.success) {
      alert(t.msgRequestSent);
      buttonEl.textContent = t.btnRequested;
      buttonEl.disabled = true;
    } else {
      console.error("Request failed:", body);
      alert(t.msgRequestFailed);
      buttonEl.disabled = false;
    }
  } catch (e) {
    console.error("Error sending request:", e);
    alert(t.msgRequestFailed);
    buttonEl.disabled = false;
  }
}

// Attach handlers to request buttons
function attachFarmerRequestHandlers() {
  const container = document.getElementById("farmersGrid");
  if (!container) return;

  container.querySelectorAll(".btn-request").forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const card = btn.closest(".farmer-card");
      if (!card) return;
      const receiverId = card.getAttribute("data-receiver-id");
      if (!receiverId) return;

      sendRequestToFarmer(receiverId, btn);
    });
  });
}

// Filters
function applyBuyerFilters() {
  loadFarmers();
}

// Language sync
function syncBuyerDashboardLanguage() {
  const { t } = getBuyerText();

  const search = document.getElementById("farmerSearch");
  if (search && t && t.searchPlaceholder) {
    search.placeholder = t.searchPlaceholder;
  }

  loadFarmers();
=======
// 5) Filters
function applyFilters() {
  const searchText = document.getElementById("farmerSearch").value.toLowerCase();
  const cropFilter = document.getElementById("cropFilter").value;

  let filtered = farmersData;
  if (searchText) {
    filtered = filtered.filter(
      (f) => f.name.toLowerCase().includes(searchText) ||
             f.bnName.toLowerCase().includes(searchText) ||
             f.village.toLowerCase().includes(searchText)
    );
  }

  if (cropFilter) {
    filtered = filtered.filter((f) => f.crops.some((c) => c.toLowerCase() === cropFilter));
  }

  renderFarmers(filtered);
  if (typeof updateTranslatedText === "function") updateTranslatedText();
}

// 6) Language sync
function syncBuyerDashboardLanguage() {
  renderFarmers(farmersData);
  const lang = window.currentLanguage || "en";
  const t = (window.translations && window.translations[lang]) || buyerDashboardTranslations[lang];
  const search = document.getElementById("farmerSearch");
  if (search) search.placeholder = t.searchPlaceholder;
  if (typeof updateTranslatedText === "function") updateTranslatedText();
>>>>>>> Stashed changes
}

// Language toggle listeners
document.getElementById("langToggle")?.addEventListener("click", () => {
  setTimeout(syncBuyerDashboardLanguage, 0);
});

document.getElementById("mobileLangToggle")?.addEventListener("click", () => {
  setTimeout(syncBuyerDashboardLanguage, 0);
});

<<<<<<< Updated upstream
// Sidebar toggle
=======
// 7) Sidebar toggle
>>>>>>> Stashed changes
document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

<<<<<<< Updated upstream
// Init
=======
// 8) Init
>>>>>>> Stashed changes
document.addEventListener("DOMContentLoaded", () => {
  const { t } = getBuyerText();
  const search = document.getElementById("farmerSearch");
  if (search && t && t.searchPlaceholder) {
    search.placeholder = t.searchPlaceholder;
  }

  document
    .getElementById("applyFiltersBtn")
    ?.addEventListener("click", applyBuyerFilters);

  loadFarmers();
});
