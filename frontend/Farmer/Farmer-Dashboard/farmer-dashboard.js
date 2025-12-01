/* ============================================
   FARMER DASHBOARD JS  
   Uses landing-page language system (data-text)
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

    dashboardTitle: "Farmer Dashboard",
    dashboardSubtitle:
      "View your agreements, proposals and connect with trusted buyers.",

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

    dashboardTitle: "চাষির ড্যাশবোর্ড",
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
  },
};

// Merge into global `translations` from landing-page.js
if (typeof translations !== "undefined") {
  Object.assign(translations.en, dashboardTranslations.en);
  Object.assign(translations.bn, dashboardTranslations.bn);
}

// 2) Dummy buyers
const buyersData = [
  {
    id: 1,
    name: "Rajesh Patel",
    bnName: "রাজেশ প্যাটেল",
    company: "Fresh Valley",
    crops: ["Rice", "Wheat", "Corn"],
    location: "Kolkata",
    bnLocation: "কলকাতা",
    thumbsUp: 45,
    thumbsDown: 12
  },
  {
    id: 2,
    name: "Priya Sharma",
    bnName: "প্রিয়া শর্মা",
    company: "Green Harvest",
    crops: ["Tomato", "Onion"],
    location: "Howrah",
    bnLocation: "হাওড়া",
    thumbsUp: 19,
    thumbsDown: 11
  },
  {
    id: 3,
    name: "Amit Kumar",
    bnName: "অমিত কুমার",
    company: "Bengal Foods",
    crops: ["Corn", "Rice"],
    location: "Durgapur",
    bnLocation: "দুর্গাপুর",
    thumbsUp: 26,
    thumbsDown: 7
  },
  {
    id: 4,
    name: "Meera Verma",
    bnName: "মীরা ভার্মা",
    company: "Rural Connect",
    crops: ["Potato", "Wheat"],
    location: "Siliguri",
    bnLocation: "শিলিগুড়ি",
    thumbsUp: 38,
    thumbsDown: 9
  },
];

// 3) Stars
function getThumbRating(buyer) {
  return `
    <div class="thumb-line">👍 ${buyer.thumbsUp}</div>
    <div class="thumb-line">👎 ${buyer.thumbsDown}</div>
  `;
}


// 4) Render buyers (uses translations + data-text)
function renderBuyers(list) {
  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) || dashboardTranslations[lang];

  const container = document.getElementById("buyersGrid");
  if (!container) return;

  container.innerHTML = list
    .map((b) => {
      const cropBadges = b.crops
        .map((c) => {
          const key = "crop_" + c.toLowerCase();
          const label = (t && t[key]) || c;
          return `<span class="crop-badge" data-text="${key}">${label}</span>`;
        })
        .join("");

      const btnReq = (t && t.btnRequest) || "Request";
      const btnDet = (t && t.btnDetails) || "Details";

      return `
      <div class="buyer-card">
        <h3>${lang === "bn" ? b.bnName : b.name}</h3>
       <div class="buyer-rating">${getThumbRating(b)}</div>
        <p class="buyer-company">${b.company}</p>
        <p class="buyer-location">📍 ${lang === "bn" ? b.bnLocation : b.location}</p>

        <div class="buyer-crops">
          ${cropBadges}
        </div>

        <div class="buyer-buttons">
          <button class="btn-request" data-text="btnRequest">${btnReq}</button>
          <button class="btn-details" data-text="btnDetails">${btnDet}</button>
        </div>
      </div>`;
    })
    .join("");
}

// 5) Filters
function applyFilters() {
  const searchText =
    document.getElementById("buyerSearch").value.toLowerCase();
  const cropFilter = document.getElementById("cropFilter").value;

  let filtered = buyersData;

  if (searchText) {
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(searchText) ||
        b.bnName.toLowerCase().includes(searchText) ||  
        b.company.toLowerCase().includes(searchText)
    );
  }

  if (cropFilter) {
    filtered = filtered.filter((b) =>
      b.crops.some((c) => c.toLowerCase() === cropFilter)
    );
  }

  renderBuyers(filtered);
  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }
}

// 6) Sync dashboard when language changes
function syncDashboardLanguage() {
  renderBuyers(buyersData);

  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) || dashboardTranslations[lang];

  const search = document.getElementById("buyerSearch");
  if (search && t && t.searchPlaceholder) {
    search.placeholder = t.searchPlaceholder;
  }

  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }
}

// 7) Attach extra listeners to language buttons (after landing-page toggle)
document.getElementById("langToggle")?.addEventListener("click", () => {
  setTimeout(syncDashboardLanguage, 0);
});
document
  .getElementById("mobileLangToggle")
  ?.addEventListener("click", () => {
    setTimeout(syncDashboardLanguage, 0);
  });

// 8) Sidebar collapse (unchanged)
document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

// 9) Init
document.addEventListener("DOMContentLoaded", () => {
  // initial render according to currentLanguage (default "en")
  syncDashboardLanguage();

  document
    .getElementById("applyFiltersBtn")
    ?.addEventListener("click", applyFilters);
});
