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

// 1) Extend translations
const buyerDashboardTranslations = {
  en: { /* ...existing translations... */ },
  bn: { /* ...existing translations... */ }
};

// merge into global system
if (typeof translations !== "undefined") {
  Object.assign(translations.en, buyerDashboardTranslations.en);
  Object.assign(translations.bn, buyerDashboardTranslations.bn);
}

// 2) FARMERS DATA
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

// 4) Render farmers
function renderFarmers(list) {
  const lang = window.currentLanguage || "en";
  const t = (window.translations && window.translations[lang]) || buyerDashboardTranslations[lang];
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
      <div class="farmer-card buyer-card" data-farmer-id="${f.id}">
        <h3>${lang === "bn" ? f.bnName : f.name}</h3>
        <div class="buyer-rating">${getThumbRating(f)}</div>
        <p class="buyer-company">${f.village}</p>
        <p class="buyer-location">📍 ${lang === "bn" ? f.bnLocation : f.location}</p>
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
}

// 7) Load farmers dynamically from backend
async function loadFarmers() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const container = document.getElementById("farmersGrid");
  const { t } = (window.translations && window.translations[window.currentLanguage || "en"]) || buyerDashboardTranslations.en;

  if (!token || !userId) return alert(t.msgLoginRequired);

  container.innerHTML = `<div class="farmer-card loading-card"><div class="loader"></div></div>`;

  try {
    const resp = await fetch(`http://localhost:8080/dashboard/farmers?buyerUserId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!resp.ok) {
      console.error("Load error:", resp.status);
      return renderFarmers([]);
    }

    const data = await resp.json();
    renderFarmers(data.users || []);
  } catch (e) {
    console.error("Load error:", e);
    renderFarmers([]);
  }
}

// Event listeners
document.getElementById("langToggle")?.addEventListener("click", () => setTimeout(syncBuyerDashboardLanguage, 0));
document.getElementById("mobileLangToggle")?.addEventListener("click", () => setTimeout(syncBuyerDashboardLanguage, 0));
document.getElementById("sidebarToggle")?.addEventListener("click", () => document.querySelector(".sidebar")?.classList.toggle("collapsed"));

// 8) Init
document.addEventListener("DOMContentLoaded", () => {
  syncBuyerDashboardLanguage();
  document.getElementById("applyFiltersBtn")?.addEventListener("click", () => {
    applyFilters();
    loadFarmers();
  });
  document.querySelector(".logout")?.addEventListener("click", logoutUser);

  // load farmers on page load
  loadFarmers();
});
