(function protectFarmerProfile() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  // If not logged in OR wrong role → redirect
  if (!token || !userId || role !== "farmer") {
    alert("User not found or unauthorized access!");
    localStorage.clear();
    window.location.href = "../../Login/login.html"; // adjust path if needed
    return;
  }
})();

(function () {
  // TRANSLATIONS 
  const translations = {
    en: {
      brandName: "Farm360",

      navHome: "Home",
      navModules: "Modules",
      navAbout: "About",
      navInsights: "Insights",
      navSupport: "Support",

      walletTotalLimit: "Total Limit",
      walletAvailable: "Available Balance",
      walletLocked: "Locked Amount",

      basicDetails: "Basic Details",
      phone: "Phone Number",
      role: "Role",
      farmerName: "Full Name",
      district: "District",
      block: "Block",
      village: "Village / City",
      pincode: "PIN Code",

      landDetails: "My Lands",
      manageLands: "Manage Lands",
      noLands: "No lands added yet.",

      landPhoto: "Land Photo",
      btnUpload: "Upload",
      btnReplace: "Replace",
      btnDelete: "Delete",

      btnEdit: "Edit",
      btnSave: "Save",
      btnCancel: "Cancel",

      accountTitle: "Account",
      farmerNameLabel: "Name:",
      phoneLabel: "Phone:",
      locationLabel: "Location:",

      // new labels for land cards
      landTitlePrefix: "Land",
      landSizeUnit: "acres",
      landLabelPattern: "Cropping Pattern",
      landLabelCrops: "Crops / Subcategories",

      // OPTIONAL: if your enum names look like SINGLE, DOUBLE, TRIPLE, etc.
      cropping_SINGLE: "Single crop",
      cropping_DOUBLE: "Double crop",
      cropping_TRIPLE: "Triple crop",
    },

    bn: {
      brandName: "Farm360",

      navHome: "হোম",
      navModules: "মডিউল",
      navAbout: "সম্পর্কিত",
      navInsights: "ইনসাইটস",
      navSupport: "সহায়তা",

      walletTotalLimit: "মোট সীমা",
      walletAvailable: "উপলব্ধ ব্যালেন্স",
      walletLocked: "লকড টাকা",

      basicDetails: "মৌলিক তথ্য",
      phone: "ফোন নম্বর",
      role: "ভূমিকা",
      farmerName: "সম্পূর্ণ নাম",
      district: "জেলা",
      block: "ব্লক",
      village: "গ্রাম / শহর",
      pincode: "পিন কোড",

      landDetails: "জমির বিবরণ",
      manageLands: "জমি ম্যানেজ করুন",
      noLands: "এখনও কোনো জমি যোগ করা হয়নি।",

      landPhoto: "জমির ছবি",
      btnUpload: "আপলোড",
      btnReplace: "পরিবর্তন",
      btnDelete: "মুছুন",

      btnEdit: "এডিট",
      btnSave: "সেভ",
      btnCancel: "বাতিল",

      accountTitle: "অ্যাকাউন্ট",
      farmerNameLabel: "নাম:",
      phoneLabel: "ফোন:",
      locationLabel: "অবস্থান:",

      
      landTitlePrefix: "জমি",
      landSizeUnit: "একর",
      landLabelPattern: "ফসল চক্র / প্যাটার্ন",
      landLabelCrops: "ফসল / উপশ্রেণী",

      
      cropping_SINGLE: "এক ফসলি",
      cropping_DOUBLE: "দুই ফসলি",
      cropping_TRIPLE: "তিন ফসলি",
    },
  };

 // GLOBAL STATE 
  let currentLanguage = window.currentLanguage || "en";
  let currentTheme = window.currentTheme || "light";

  let profileData = null; // backend profile data

  function t() {
    return translations[currentLanguage] || translations.en;
  }

  //THEME &LANGUAGE 
  function applyTheme(theme) {
    document.body.classList.toggle("theme-dark", theme === "dark");
    currentTheme = theme;
    window.currentTheme = theme;
  }

  function toggleTheme() {
    applyTheme(currentTheme === "light" ? "dark" : "light");
  }

  function applyLanguage(lang) {
    currentLanguage = lang;
    window.currentLanguage = lang;

    document.body.classList.toggle("lang-bn", lang === "bn");
    const tr = t();

    document.querySelectorAll("[data-text]").forEach((el) => {
      const key = el.getAttribute("data-text");
      if (tr[key]) el.textContent = tr[key];
    });

    const langBtn = document.getElementById("langToggle");
    const mobileLangBtn = document.getElementById("mobileLangToggle");

    if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
    if (mobileLangBtn)
      mobileLangBtn.textContent = lang === "en" ? "বাংলা" : "English";
  }

  function toggleLanguage() {
    applyLanguage(currentLanguage === "en" ? "bn" : "en");
    //
    if (profileData) renderLands(profileData.lands || []);
  }

  // DOM REFS 
  const phoneInput = document.getElementById("phone");
  const roleInput = document.getElementById("role");
  const nameInput = document.getElementById("farmerName");
  const districtInput = document.getElementById("district");
  const blockInput = document.getElementById("block");
  const villageInput = document.getElementById("village");
  const pinInput = document.getElementById("pinCode");

  const walletTotalEl = document.getElementById("walletTotal");
  const walletAvailableEl = document.getElementById("walletAvailable");
  const walletLockedEl = document.getElementById("walletLocked");
  const landsListEl = document.getElementById("landsList");

  const photoInput = document.getElementById("photoInput");
  const photoImg = document.getElementById("photoImg");
  const photoEmpty = document.getElementById("photoEmpty");
  const btnUpload = document.getElementById("btnUpload");
  const btnReplace = document.getElementById("btnReplace");
  const btnDelete = document.getElementById("btnDelete");

  const infoName = document.getElementById("infoName");
  const infoPhone = document.getElementById("infoPhone");
  const infoLocation = document.getElementById("infoLocation");

  // BACK TO DASHBOARD
const backBtn = document.getElementById("backToDashboard");
backBtn?.addEventListener("click", () => {
  window.location.href = "../Farmer-Dashboard/farmer-dashboard.html";
});


  //EDIT / SAVE BASIC 
  function toggleEditBasic(editing, revert = false) {
    const form = document.querySelector(".form-basic");
    form.dataset.editing = editing ? "true" : "false";

    nameInput.disabled = !editing;

    const actions = form.querySelector(".form-actions");
    actions.hidden = !editing;

    const editBtn = document.querySelector('.btn-edit[data-section="basic"]');
    editBtn.style.display = editing ? "none" : "inline-flex";

    if (revert && profileData) {
      nameInput.value = profileData.farmerName;
    }
  }

  async function saveBasicProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired");
      window.location.href = "/login.html";
      return;
    }

    const payload = {
      farmerName: nameInput.value.trim(),
    };

    try {
      const res = await fetch("http://localhost:8080/api/profile/farmer", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      await loadFarmerProfile();
      toggleEditBasic(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  }

//LOAD PROFILE 
  async function loadFarmerProfile() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/profile/farmer", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      profileData = data;

      populateProfile(data);
    } catch (err) {
      console.error("Profile load failed", err);
    }
  }

  function populateProfile(data) {
    phoneInput.value = data.phone;
    roleInput.value = data.role;
    nameInput.value = data.farmerName;
    districtInput.value = data.districtName;
    blockInput.value = data.blockName;
    villageInput.value = data.village;
    pinInput.value = data.pinCode;

    infoName.textContent = data.farmerName;
    infoPhone.textContent = data.phone;
    infoLocation.textContent =
      `${data.village}, ${data.blockName}, ${data.districtName}`;

    walletTotalEl.textContent = "₹ " + (data.totalLimit ?? 0);
    walletAvailableEl.textContent = "₹ " + (data.availableBalance ?? 0);
    walletLockedEl.textContent = "₹ " + (data.lockedAmount ?? 0);

    renderLands(data.lands || []);

    if (data.landPhotoUrl) {
      photoImg.src = data.landPhotoUrl;
      photoImg.hidden = false;
      photoEmpty.hidden = true;

      btnUpload.hidden = true;
      btnReplace.hidden = false;
      btnDelete.hidden = false;
    } else {
      photoImg.hidden = true;
      photoEmpty.hidden = false;

      btnUpload.hidden = false;
      btnReplace.hidden = true;
      btnDelete.hidden = true;
    }
  }

   //CROPPING PATTERN LABEL 
  function formatCroppingPattern(enumValue) {
    if (!enumValue) return "-";
    const key = "cropping_" + enumValue; // e.g. cropping_SINGLE
    const tr = t();
    return tr[key] || enumValue; // fallback: show raw enum if no translation
  }

  // RENDER LAND CARDS 
 function renderLands(lands) {
  const tr = t();
  landsListEl.innerHTML = "";

  if (!lands || lands.length === 0) {
    landsListEl.innerHTML =
      `<p class="empty-text">${tr.noLands}</p>`;
    return;
  }

  lands.forEach((land) => {
    const card = document.createElement("div");
    card.className = "land-card";

    const cropsText = (land.crops || []).join(", ");

    card.innerHTML = `
      <div class="land-top">
        <span class="land-size">${land.size} ${tr.landSizeUnit}</span>
        <span class="land-pattern">${formatCroppingPattern(land.croppingPattern)}</span>
      </div>

      <div class="land-row">
        <span class="land-label">${tr.landLabelCrops}:</span>
        <span class="land-value">${cropsText || "-"}</span>
      </div>
    `;

    landsListEl.appendChild(card);
  });
}


  //PHOTO (frontend only for now) 
  function onPhotoSelected(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    photoImg.src = url;

    photoImg.hidden = false;
    photoEmpty.hidden = true;

    btnUpload.hidden = true;
    btnReplace.hidden = false;
    btnDelete.hidden = false;


  }

  function onDeletePhoto() {
    photoImg.hidden = true;
    photoEmpty.hidden = false;

    btnUpload.hidden = false;
    btnReplace.hidden = true;
    btnDelete.hidden = true;
  }

//INIT 
  function initPage() {
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    loadFarmerProfile();
  }

  // EVENT LISTENERS
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("mobileThemeToggle")?.addEventListener("click", toggleTheme);

  document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
  document.getElementById("mobileLangToggle")?.addEventListener("click", toggleLanguage);

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("open");
  });

  document
    .querySelector('.btn-edit[data-section="basic"]')
    ?.addEventListener("click", () => toggleEditBasic(true));

  document
    .querySelector('.btn-cancel[data-section="basic"]')
    ?.addEventListener("click", () => toggleEditBasic(false, true));

  document
    .querySelector('.btn-save[data-section="basic"]')
    ?.addEventListener("click", saveBasicProfile);

  photoInput?.addEventListener("change", onPhotoSelected);
  btnUpload?.addEventListener("click", () => photoInput.click());
  btnReplace?.addEventListener("click", () => photoInput.click());
  btnDelete?.addEventListener("click", onDeletePhoto);

  document.addEventListener("DOMContentLoaded", initPage);
})();
