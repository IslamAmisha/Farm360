/* ============================================
   BUYER DASHBOARD JS  (BACKEND-INTEGRATED)
   Buyer sees: Available FARMERS
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
    sidebarFarmers: "Farmers",
    sidebarProfile: "My Profile",
    sidebarRequests: "Requests",
    sidebarAgreements: "Agreements",
    sidebarPayments: "Payments",
    sidebarNotifications: "Notifications",
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
    summaryPayments: "Payments",
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
    sidebarFarmers: "চাষিরা",
    sidebarProfile: "আমার প্রোফাইল",
    sidebarRequests: "অনুরোধ",
    sidebarAgreements: "চুক্তি",
    sidebarPayments: "পেমেন্ট",
    sidebarNotifications: "বিজ্ঞপ্তি",
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
    summaryPayments: "মোট পেমেন্ট",
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

const BUYER_API_BASE_URL = "http://localhost:8080";

/* ============================================
   ACCESS CONTROL (BUYER ONLY)
============================================ */
(function protectBuyerDashboard() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();

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
      <div class="farmer-card buyer-card" data-receiver-id="${f.userId}">
        <h3>${f.name}</h3>

        <div class="buyer-rating">
          ${getThumbRatingForFarmer(f.ratingUp, f.ratingDown)}
        </div>

        <p class="buyer-company">${f.villageOrCity || ""}</p>
        <p class="buyer-location">📍 ${locationText}</p>

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

// Send request from buyer to farmer
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
}

// Language toggle listeners
document.getElementById("langToggle")?.addEventListener("click", () => {
  setTimeout(syncBuyerDashboardLanguage, 0);
});

document.getElementById("mobileLangToggle")?.addEventListener("click", () => {
  setTimeout(syncBuyerDashboardLanguage, 0);
});

// Sidebar toggle
document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

// Init
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
