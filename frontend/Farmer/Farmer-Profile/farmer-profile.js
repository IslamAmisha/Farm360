/* -------------------------------------------------- */
/* FARMER PROFILE JS (API-CONNECTED VERSION)          */
/* -------------------------------------------------- */

(function () {
  /* 0) TRANSLATIONS --------------------------------- */
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
    },
  };

  /* 1) GLOBAL STATE --------------------------------- */
  let currentLanguage = window.currentLanguage || "en";
  let currentTheme = window.currentTheme || "light";

  let profileData = null; // backend profile data

  /* 2) THEME + LANGUAGE ----------------------------- */
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
    const t = translations[lang];

    document.querySelectorAll("[data-text]").forEach((el) => {
      const key = el.getAttribute("data-text");
      if (t[key]) el.textContent = t[key];
    });

    const langBtn = document.getElementById("langToggle");
    const mobileLangBtn = document.getElementById("mobileLangToggle");

    langBtn.textContent = lang === "en" ? "বাংলা" : "English";
    mobileLangBtn.textContent = lang === "en" ? "বাংলা" : "English";
  }

  function toggleLanguage() {
    applyLanguage(currentLanguage === "en" ? "bn" : "en");
  }

  /* 3) DOM REFS ------------------------------- */
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

  /* 4) EDIT / SAVE BASIC ---------------------------- */
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

  /* 5) LOAD PROFILE ---------------------------- */
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

  /* 6) RENDER LAND CARDS ---------------------------- */
  function renderLands(lands) {
    landsListEl.innerHTML = "";

    if (lands.length === 0) {
      landsListEl.innerHTML =
        `<p class="empty-text">${translations[currentLanguage].noLands}</p>`;
      return;
    }

    lands.forEach((land, i) => {
      const card = document.createElement("div");
      card.className = "land-item";

      card.innerHTML = `
        <div class="land-header">
          <span class="land-title">Land #${i + 1}</span>
          <span class="land-size">${land.size} acres</span>
        </div>
        <div class="land-row">
          <span class="land-label">Pattern:</span>
          <span class="land-value">${land.croppingPattern ?? "-"}</span>
        </div>
        <div class="land-row">
          <span class="land-label">Crops:</span>
          <span class="land-value">${(land.crops || []).join(", ")}</span>
        </div>
      `;

      landsListEl.appendChild(card);
    });
  }

  /* 7) PHOTO (frontend only for now) ---------------- */
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

  /* 8) INIT ----------------------------------------- */
  function initPage() {
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    loadFarmerProfile();
  }

  /* 9) EVENT LISTENERS ------------------------------ */
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("mobileThemeToggle")?.addEventListener("click", toggleTheme);

  document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
  document.getElementById("mobileLangToggle")?.addEventListener("click", toggleLanguage);

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("open");
  });

  document.querySelector('.btn-edit[data-section="basic"]')
    ?.addEventListener("click", () => toggleEditBasic(true));

  document.querySelector('.btn-cancel[data-section="basic"]')
    ?.addEventListener("click", () => toggleEditBasic(false, true));

  document.querySelector('.btn-save[data-section="basic"]')
    ?.addEventListener("click", saveBasicProfile);

  photoInput?.addEventListener("change", onPhotoSelected);
  btnUpload?.addEventListener("click", () => photoInput.click());
  btnReplace?.addEventListener("click", () => photoInput.click());
  btnDelete?.addEventListener("click", onDeletePhoto);

  document.addEventListener("DOMContentLoaded", initPage);
})();
