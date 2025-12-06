/* ============================================
   FARMER DASHBOARD JS  (BACKEND-INTEGRATED)
   Uses landing-page language system (data-text)
   Farmer sees: Available BUYERS
============================================ */

// 1) Extend global translations with dashboard keys
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
    sidebarProfile: "My Profile",
    sidebarLand: "My Land",
    sidebarProposals: "Proposals",
    sidebarAgreements: "Agreements",
    sidebarCultivation: "Cultivation Progress",
    sidebarPayments: "Payments",
    sidebarNotifications: "Notifications",
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
    buyerProfilesSubtitle: "Connect with buyers interested in your crops",

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
    sidebarProfile: "আমার প্রোফাইল",
    sidebarLand: "আমার জমি",
    sidebarProposals: "প্রস্তাব",
    sidebarAgreements: "চুক্তি",
    sidebarCultivation: "চাষের অগ্রগতি",
    sidebarPayments: "পেমেন্ট",
    sidebarNotifications: "বিজ্ঞপ্তি",
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
    summaryProposals: "মোট প্রস্তাব",
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

// Merge into global `translations` from landing-page.js if present
if (typeof translations !== "undefined") {
  Object.assign(translations.en, dashboardTranslations.en);
  Object.assign(translations.bn, dashboardTranslations.bn);
}

// ==== CONFIG ====
const API_BASE_URL = "http://localhost:8080";

// Helper: get current language & texts
function getDashText() {
  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) ||
    dashboardTranslations[lang];
  return { lang, t };
}

// Helper: get auth info from localStorage
function getAuthInfo() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  return { token, userId, role };
}

// 3) Rating display
function getThumbRating(ratingUp, ratingDown) {
  return `
    <div class="thumb-line">👍 ${ratingUp ?? 0}</div>
    <div class="thumb-line">👎 ${ratingDown ?? 0}</div>
  `;
}

// 4) Render buyers from BACKEND response
// each item = DashboardCardRS
function renderBuyers(list) {
  const { lang, t } = getDashText();
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

  container.innerHTML = list
    .map((b) => {
      const cropBadges = (b.crops || [])
        .map((c) => {
          const key = "crop_" + String(c).toLowerCase();
          const label = (t && t[key]) || c;
          return `<span class="crop-badge" data-text="${key}">${label}</span>`;
        })
        .join("");

      let requestLabel = t.btnRequest;
      let requestDisabled = false;

      if (!b.canSendRequest) {
        if (b.requestStatus === "PENDING") {
          requestLabel = t.btnRequested;
        } else if (b.requestStatus === "ACCEPTED") {
          requestLabel = t.btnConnected;
        }
        requestDisabled = true;
      }

      const btnDet = (t && t.btnDetails) || "Details";

      const locationText = [b.villageOrCity, b.district]
        .filter(Boolean)
        .join(", ");

      return `
      <div class="buyer-card" data-receiver-id="${b.userId}">
        <h3>${b.name}</h3>
        <div class="buyer-rating">
          ${getThumbRating(b.ratingUp, b.ratingDown)}
        </div>
        <p class="buyer-company">${b.businessName || ""}</p>
        <p class="buyer-location">📍 ${locationText}</p>

        <div class="buyer-crops">
          ${cropBadges}
        </div>

        <div class="buyer-buttons">
          <button class="btn-request"
                  data-text="btnRequest"
                  ${requestDisabled ? "disabled" : ""}>
            ${requestLabel}
          </button>
          <button class="btn-details" data-text="btnDetails">${btnDet}</button>
        </div>
      </div>`;
    })
    .join("");

  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }

  attachRequestButtonHandlers();
}

// 5) Fetch buyers from backend
async function loadBuyers() {
  const { token, userId } = getAuthInfo();
  const { t } = getDashText();

  if (!token || !userId) {
    alert(t.msgLoginRequired);
    return;
  }

  const searchText =
    document.getElementById("buyerSearch")?.value.trim().toLowerCase() || "";
  const cropFilter = document.getElementById("cropFilter")?.value || "";

  const params = new URLSearchParams();
  params.append("farmerUserId", userId);
  if (searchText) params.append("search", searchText);
  if (cropFilter) params.append("crop", cropFilter);

  const container = document.getElementById("buyersGrid");
  if (container) {
    container.innerHTML = `
      <div class="buyer-card loading-card">
        <div class="loader"></div>
      </div>`;
  }

  try {
    const resp = await fetch(
      `${API_BASE_URL}/dashboard/buyers?` + params.toString(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!resp.ok) {
      console.error("Failed to load buyers:", resp.status);
      renderBuyers([]);
      return;
    }

    const data = await resp.json(); // expected: { users: [...] }
    renderBuyers(data.users || []);
  } catch (err) {
    console.error("Error loading buyers:", err);
    renderBuyers([]);
  }
}

// 6) Send request from farmer to buyer
async function sendRequestToBuyer(receiverUserId, buttonEl) {
  const { token, userId } = getAuthInfo();
  const { t } = getDashText();

  if (!token || !userId) {
    alert(t.msgLoginRequired);
    return;
  }

  buttonEl.disabled = true;

  try {
    const resp = await fetch(
      `${API_BASE_URL}/request/send?userId=${encodeURIComponent(userId)}`,
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

// 7) Attach click handlers to "Request" buttons
function attachRequestButtonHandlers() {
  const container = document.getElementById("buyersGrid");
  if (!container) return;

  container.querySelectorAll(".btn-request").forEach((btn) => {
    if (btn.dataset.bound === "1") return; // avoid double binding
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      if (btn.disabled) return;

      const card = btn.closest(".buyer-card");
      if (!card) return;

      const receiverId = card.getAttribute("data-receiver-id");
      if (!receiverId) return;

      sendRequestToBuyer(receiverId, btn);
    });
  });
}

// 8) Filters
function applyFilters() {
  loadBuyers();
}

// 9) Sync dashboard when language changes
function syncDashboardLanguage() {
  // Just reload buyers so text + placeholders update
  const { t } = getDashText();

  const search = document.getElementById("buyerSearch");
  if (search && t && t.searchPlaceholder) {
    search.placeholder = t.searchPlaceholder;
  }

  loadBuyers();
}

// 10) Language toggle listeners
document.getElementById("langToggle")?.addEventListener("click", () => {
  setTimeout(syncDashboardLanguage, 0);
});
document
  .getElementById("mobileLangToggle")
  ?.addEventListener("click", () => {
    setTimeout(syncDashboardLanguage, 0);
  });

// 11) Sidebar collapse
document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

// 12) Init
document.addEventListener("DOMContentLoaded", () => {
  const { t } = getDashText();
  const search = document.getElementById("buyerSearch");
  if (search && t && t.searchPlaceholder) {
    search.placeholder = t.searchPlaceholder;
  }

  document
    .getElementById("applyFiltersBtn")
    ?.addEventListener("click", applyFilters);

  loadBuyers(); // initial load
});
