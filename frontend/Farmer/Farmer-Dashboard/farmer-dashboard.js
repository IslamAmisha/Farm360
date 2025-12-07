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

  container.innerHTML = list
    .map((b) => {
      const cropBadges = (b.crops || [])
        .map((c) => {
          const key = "crop_" + String(c).toLowerCase();
          const label = t[key] || c;
          return `<span class="crop-badge">${label}</span>`;
        })
        .join("");

      let requestLabel = t.btnRequest;
      let disabled = false;

      if (!b.canSendRequest) {
        if (b.requestStatus === "PENDING") requestLabel = t.btnRequested;
        else if (b.requestStatus === "ACCEPTED") requestLabel = t.btnConnected;
        disabled = true;
      }

      const location = [b.villageOrCity, b.district]
        .filter(Boolean)
        .join(", ");

      return `
        <div class="buyer-card" data-receiver-id="${b.userId}">
          <h3>${b.name}</h3>

          <div class="buyer-rating">${getThumbRating(
            b.ratingUp,
            b.ratingDown
          )}</div>

          <p class="buyer-company">${b.businessName || ""}</p>
          <p class="buyer-location">📍 ${location}</p>

          <div class="buyer-crops">${cropBadges}</div>

          <div class="buyer-buttons">
            <button class="btn-request" ${disabled ? "disabled" : ""}>
              ${requestLabel}
            </button>
            <button class="btn-details">${t.btnDetails}</button>
          </div>
        </div>
      `;
    })
    .join("");

  if (typeof updateTranslatedText === "function") updateTranslatedText();

  attachRequestButtonHandlers();
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

async function sendRequestToBuyer(receiverUserId, btn) {
  const { token, userId } = getAuthInfo();
  const { t } = getDashText();

  if (!token || !userId) return alert(t.msgLoginRequired);

  btn.disabled = true;

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
      btn.textContent = t.btnRequested;
      btn.disabled = true;
    } else {
      alert(t.msgRequestFailed);
      btn.disabled = false;
    }
  } catch (e) {
    alert(t.msgRequestFailed);
    btn.disabled = false;
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  const { t } = getDashText();
  const search = document.getElementById("buyerSearch");
  if (search) search.placeholder = t.searchPlaceholder;

  document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);

  document.querySelector(".logout")?.addEventListener("click", logoutUser);
  
  loadBuyers();
});
