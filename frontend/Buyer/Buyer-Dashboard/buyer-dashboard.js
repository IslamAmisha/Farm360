/* ============================================
   BUYER DASHBOARD JS  
   Same as Farmer Dashboard — only reversed.
============================================ */

// 1) Extend translations
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

    dashboardTitle: "Buyer Dashboard",
    dashboardSubtitle:
      "View your agreements, find farmers and collaborate effectively.",

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
    sidebarFarmers: "চাষিরা",
    sidebarProfile: "আমার প্রোফাইল",
    sidebarRequests: "অনুরোধ",
    sidebarAgreements: "চুক্তি",
    sidebarPayments: "পেমেন্ট",
    sidebarNotifications: "বিজ্ঞপ্তি",
    sidebarSettings: "সেটিংস",
    sidebarLogout: "লগআউট",

    dashboardTitle: "ক্রেতার ড্যাশবোর্ড",
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

// merge into global system
if (typeof translations !== "undefined") {
  Object.assign(translations.en, buyerDashboardTranslations.en);
  Object.assign(translations.bn, buyerDashboardTranslations.bn);
}

// 2) FARMERS DATA (MIRROR of buyers)
const farmersData = [
  {
    id: 1,
    name: "Rakesh Das",
    bnName: "রাকেশ দাস",
    village: "Bara Village",
    crops: ["Rice", "Wheat"],
    location: "Nadia",
    bnLocation: "নদিয়া",
    thumbsUp: 51,
    thumbsDown: 9,
  },
  {
    id: 2,
    name: "Soma Mondal",
    bnName: "সোমা মন্ডল",
    village: "Dakshin Para",
    crops: ["Potato", "Tomato"],
    location: "Howrah",
    bnLocation: "হাওড়া",
    thumbsUp: 32,
    thumbsDown: 7,
  },
  {
    id: 3,
    name: "Ajoy Manna",
    bnName: "অজয় মান্না",
    village: "Majher Para",
    crops: ["Corn", "Onion"],
    location: "Burdwan",
    bnLocation: "বর্ধমান",
    thumbsUp: 44,
    thumbsDown: 10,
  },
  {
    id: 4,
    name: "Lata Soren",
    bnName: "লতা সরেন",
    village: "North Colony",
    crops: ["Rice", "Tomato"],
    location: "Bankura",
    bnLocation: "বাঁকুড়া",
    thumbsUp: 29,
    thumbsDown: 6,
  },
];

// 3) Rating
function getThumbRating(farmer) {
  return `
    <div class="thumb-line">👍 ${farmer.thumbsUp}</div>
    <div class="thumb-line">👎 ${farmer.thumbsDown}</div>
  `;
}

// 4) Render farmers
function renderFarmers(list) {
  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) ||
    buyerDashboardTranslations[lang];

  const container = document.getElementById("farmersGrid");
  if (!container) return;

  container.innerHTML = list
    .map((f) => {
      const cropBadges = f.crops
        .map((c) => {
          const key = "crop_" + c.toLowerCase();
          const label = (t && t[key]) || c;
          return `<span class="crop-badge" data-text="${key}">${label}</span>`;
        })
        .join("");

      const btnReq = t.btnRequest;
      const btnDet = t.btnDetails;

      return `
      <div class="farmer-card buyer-card">
        <h3>${lang === "bn" ? f.bnName : f.name}</h3>

        <div class="buyer-rating">
          ${getThumbRating(f)}
        </div>

        <p class="buyer-company">${f.village}</p>
        <p class="buyer-location">📍 ${
          lang === "bn" ? f.bnLocation : f.location
        }</p>

        <div class="buyer-crops">${cropBadges}</div>

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
    document.getElementById("farmerSearch").value.toLowerCase();
  const cropFilter = document.getElementById("cropFilter").value;

  let filtered = farmersData;

  if (searchText) {
    filtered = filtered.filter(
      (f) =>
        f.name.toLowerCase().includes(searchText) ||
        f.bnName.toLowerCase().includes(searchText) ||
        f.village.toLowerCase().includes(searchText)
    );
  }

  if (cropFilter) {
    filtered = filtered.filter((f) =>
      f.crops.some((c) => c.toLowerCase() === cropFilter)
    );
  }

  renderFarmers(filtered);
  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }
}

// 6) Language sync
function syncBuyerDashboardLanguage() {
  renderFarmers(farmersData);

  const lang = window.currentLanguage || "en";
  const t =
    (window.translations && window.translations[lang]) ||
    buyerDashboardTranslations[lang];

  const search = document.getElementById("farmerSearch");
  if (search) search.placeholder = t.searchPlaceholder;

  if (typeof updateTranslatedText === "function") {
    updateTranslatedText();
  }
}

document.getElementById("langToggle")?.addEventListener("click", () => {
  setTimeout(syncBuyerDashboardLanguage, 0);
});

document.getElementById("mobileLangToggle")?.addEventListener("click", () => {
  setTimeout(syncBuyerDashboardLanguage, 0);
});

// 7 Sidebar toggle
document.getElementById("sidebarToggle")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.toggle("collapsed");
});

// 8 Init
document.addEventListener("DOMContentLoaded", () => {
  syncBuyerDashboardLanguage();
  document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);
});
