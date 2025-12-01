/* -------------------------------------------------- */
/* BUYER PROFILE JS — MIRROR OF FARMER PROFILE        */
/* -------------------------------------------------- */

(function () {
  /* -------------------------------------------------- */
  /* LOCAL TRANSLATIONS                                 */
  /* -------------------------------------------------- */
  const buyerTranslations = {
    en: {
      brandName: "Farm360",

      navHome: "Home",
      navModules: "Modules",
      navAbout: "About",
      navInsights: "Insights",
      navSupport: "Support",

      /* Wallet */
      walletBalance: "Wallet Balance",
      walletEscrow: "Escrow Locked",
      walletSpent: "Total Spent",
      lastTransaction: "Last Transaction",

      /* Sections */
      basicDetails: "Basic Details",
      businessDetails: "Business Details",
      cropsDetails: "Crops Dealt With",
      buyerPhoto: "Buyer / Business Photo",

      /* Basic fields */
      phone: "Phone Number",
      role: "Role",
      fullName: "Full Name",
      aadhar: "Aadhaar Number",
      district: "District",
      block: "Block",
      city: "City / Town",
      village: "Village / Area",
      pincode: "PIN Code",

      /* Business fields */
      businessName: "Business Name",
      businessType: "Business Type",
      businessScale: "Business Scale",
      govtApprovals: "Government Approvals",
      payTaxLabel: "Pays Tax",
      gstLabel: "GST Registered",
      licenceLabel: "Has Licence",
      businessAge: "Business Age",
      warehouseName: "Warehouse Name",
      warehouseLocation: "Warehouse Location",
      annualPurchase: "Annual Purchase (approx.)",

      /* Crops */
      cropsLabel: "Crops",
      cropSubLabel: "Crop Subcategories",

      /* Buttons */
      btnEdit: "Edit",
      btnSave: "Save",
      btnCancel: "Cancel",
      btnUpload: "Upload",
      btnReplace: "Replace",
      btnDelete: "Delete",

      /* Sidebar */
      accountTitle: "Account",
      buyerNameLabel: "Name:",
      phoneLabel: "Phone:",
      locationLabel: "Location:",
      businessTypeShort: "Business Type:",
    },

    bn: {
      brandName: "Farm360",

      navHome: "হোম",
      navModules: "মডিউল",
      navAbout: "সম্পর্কিত",
      navInsights: "ইনসাইটস",
      navSupport: "সহায়তা",

      /* Wallet */
      walletBalance: "ওয়ালেট ব্যালেন্স",
      walletEscrow: "এসক্রোতে লক",
      walletSpent: "মোট খরচ",
      lastTransaction: "শেষ লেনদেন",

      /* Sections */
      basicDetails: "মৌলিক তথ্য",
      businessDetails: "ব্যবসার তথ্য",
      cropsDetails: "যে ফসলের ব্যবসা করেন",
      buyerPhoto: "ক্রেতা / ব্যবসার ছবি",

      /* Basic fields */
      phone: "ফোন নম্বর",
      role: "ভূমিকা",
      fullName: "সম্পূর্ণ নাম",
      aadhar: "আধার নম্বর",
      district: "জেলা",
      block: "ব্লক",
      city: "শহর / টাউন",
      village: "গ্রাম / এলাকা",
      pincode: "পিন কোড",

      /* Business fields */
      businessName: "ব্যবসার নাম",
      businessType: "ব্যবসার ধরন",
      businessScale: "ব্যবসার পরিধি",
      govtApprovals: "সরকারি অনুমোদন",
      payTaxLabel: "কর প্রদান করে",
      gstLabel: "জিএসটি রেজিস্টার্ড",
      licenceLabel: "লাইসেন্স আছে",
      businessAge: "ব্যবসার বয়স",
      warehouseName: "গুদামের নাম",
      warehouseLocation: "গুদামের অবস্থান",
      annualPurchase: "বার্ষিক ক্রয় (আনুমানিক)",

      /* Crops */
      cropsLabel: "ফসল",
      cropSubLabel: "ফসলের উপবিভাগ",

      /* Buttons */
      btnEdit: "এডিট",
      btnSave: "সেভ",
      btnCancel: "বাতিল",
      btnUpload: "আপলোড",
      btnReplace: "পরিবর্তন",
      btnDelete: "মুছুন",

      /* Sidebar */
      accountTitle: "অ্যাকাউন্ট",
      buyerNameLabel: "নাম:",
      phoneLabel: "ফোন:",
      locationLabel: "অবস্থান:",
      businessTypeShort: "ব্যবসার ধরন:",
    },
  };

  /* -------------------------------------------------- */
  /* GLOBAL-ish STATE (shared with other pages if any)  */
  /* -------------------------------------------------- */
  if (!window.currentTheme) window.currentTheme = "light";
  if (!window.currentLanguage) window.currentLanguage = "en";

  /* -------------------------------------------------- */
  /* THEME HANDLING                                     */
  /* -------------------------------------------------- */
  function applyTheme(theme) {
    const body = document.body;
    body.classList.toggle("theme-dark", theme === "dark");
    window.currentTheme = theme;

    const sun = document.querySelector(".icon-sun");
    const moon = document.querySelector(".icon-moon");
    if (sun && moon) {
      if (theme === "dark") {
        sun.style.display = "none";
        moon.style.display = "inline";
      } else {
        sun.style.display = "inline";
        moon.style.display = "none";
      }
    }
  }

  function toggleTheme() {
    const next = window.currentTheme === "light" ? "dark" : "light";
    applyTheme(next);
  }

  /* -------------------------------------------------- */
  /* LANGUAGE HANDLING                                  */
  /* -------------------------------------------------- */
  function applyLanguage(lang) {
    const body = document.body;
    body.classList.toggle("lang-bn", lang === "bn");
    window.currentLanguage = lang;

    const t = buyerTranslations[lang];

    if (t) {
      document.querySelectorAll("[data-text]").forEach((el) => {
        const key = el.getAttribute("data-text");
        if (t[key]) {
          el.textContent = t[key];
        }
      });
    }

    const langBtn = document.getElementById("langToggle");
    const mobileBtn = document.getElementById("mobileLangToggle");

    if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
    if (mobileBtn)
      mobileBtn.textContent = lang === "en" ? "বাংলা" : "English";

    // Re-render crops in selected language
    if (cropsChecklist) {
      populateCrops();
      renderSubcategories();
    }
  }

  function toggleLanguage() {
    const next = window.currentLanguage === "en" ? "bn" : "en";
    applyLanguage(next);
  }

  /* -------------------------------------------------- */
  /* ELEMENTS                                           */
  /* -------------------------------------------------- */
  const districtSelect = document.getElementById("districtSelect");
  const blockSelect = document.getElementById("blockSelect");
  const cropsChecklist = document.getElementById("cropsChecklist");
  const cropSubcategories = document.getElementById("cropSubcategories");

  const walletBalance = document.getElementById("walletBalance");
  const walletEscrow = document.getElementById("walletEscrow");
  const walletSpent = document.getElementById("walletSpent");
  const lastTransaction = document.getElementById("lastTransaction");

  const photoInput = document.getElementById("photoInput");
  const photoImg = document.getElementById("photoImg");
  const photoEmpty = document.getElementById("photoEmpty");
  const btnUpload = document.getElementById("btnUpload");
  const btnReplace = document.getElementById("btnReplace");
  const btnDelete = document.getElementById("btnDelete");

  const infoName = document.getElementById("infoName");
  const infoPhone = document.getElementById("infoPhone");
  const infoLocation = document.getElementById("infoLocation");
  const infoBusinessType = document.getElementById("infoBusinessType");

  const themeBtn = document.getElementById("themeToggle");
  const mobileThemeBtn = document.getElementById("mobileThemeToggle");
  const langBtn = document.getElementById("langToggle");
  const mobileLangBtn = document.getElementById("mobileLangToggle");

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  /* -------------------------------------------------- */
  /* STATE                                              */
  /* -------------------------------------------------- */
  const profileState = {
    phone: "+91 9XXXXXXXXX",
    role: "Buyer",

    fullName: "",
    aadhar: "",
    district: "",
    block: "",
    city: "",
    village: "",
    pincode: "",

    businessName: "",
    businessType: "",
    businessScale: "",
    payTax: false,
    gstRegistered: false,
    licence: false,
    businessAge: "",
    wareName: "",
    wareLocation: "",
    annualPurchase: "",

    crops: [],
    cropSubs: [],
    photo: null,
  };

  /* -------------------------------------------------- */
  /* EDIT / SAVE / RESTORE                              */
  /* -------------------------------------------------- */
  function toggleEdit(section, editing, revert = false) {
    const form = document.querySelector(`.form-${section}`);
    if (!form) return;

    form.dataset.editing = editing ? "true" : "false";

    form.querySelectorAll("input, select").forEach((inp) => {
      if (inp.classList.contains("input-locked")) return;
      inp.disabled = !editing;
    });

    const actions = form.querySelector(".form-actions");
    if (actions) actions.hidden = !editing;

    const editBtn = document.querySelector(
      `.btn-edit[data-section="${section}"]`
    );
    if (editBtn) editBtn.style.display = editing ? "none" : "inline-flex";

    if (revert) restoreSection(section);
  }

  function restoreSection(section) {
    if (section === "basic") {
      document.getElementById("fullName").value = profileState.fullName || "";
      document.getElementById("aadhar").value = profileState.aadhar || "";
      districtSelect.value = profileState.district || "";
      districtSelect.dispatchEvent(new Event("change"));
      blockSelect.value = profileState.block || "";
      document.getElementById("city").value = profileState.city || "";
      document.getElementById("village").value = profileState.village || "";
      document.getElementById("pincode").value = profileState.pincode || "";
    }

    if (section === "business") {
      document.getElementById("businessName").value =
        profileState.businessName || "";
      document.getElementById("businessType").value =
        profileState.businessType || "";
      document.getElementById("businessScale").value =
        profileState.businessScale || "";
      document.getElementById("businessAge").value =
        profileState.businessAge || "";
      document.getElementById("wareName").value = profileState.wareName || "";
      document.getElementById("wareLocation").value =
        profileState.wareLocation || "";
      document.getElementById("annualPurchase").value =
        profileState.annualPurchase || "";

      document.getElementById("payTax").checked = !!profileState.payTax;
      document.getElementById("gstRegistered").checked =
        !!profileState.gstRegistered;
      document.getElementById("licence").checked = !!profileState.licence;
    }

    if (section === "crops") {
      Object.keys(cropsData).forEach((crop) => {
        const el = document.getElementById(
          "crop_" + crop.replace(/\s+/g, "_")
        );
        if (el) el.checked = (profileState.crops || []).includes(crop);
      });
      renderSubcategories();
    }
  }

  function saveSection(section) {
    if (section === "basic") {
      profileState.fullName = document
        .getElementById("fullName")
        .value.trim();
      profileState.aadhar = document.getElementById("aadhar").value.trim();
      profileState.district = districtSelect.value;
      profileState.block = blockSelect.value;
      profileState.city = document.getElementById("city").value.trim();
      profileState.village = document.getElementById("village").value.trim();
      profileState.pincode = document.getElementById("pincode").value.trim();
    }

    if (section === "business") {
      profileState.businessName = document
        .getElementById("businessName")
        .value.trim();
      profileState.businessType = document.getElementById("businessType").value;
      profileState.businessScale =
        document.getElementById("businessScale").value;
      profileState.businessAge = document.getElementById("businessAge").value;
      profileState.wareName = document.getElementById("wareName").value.trim();
      profileState.wareLocation = document
        .getElementById("wareLocation")
        .value.trim();
      profileState.annualPurchase =
        document.getElementById("annualPurchase").value;

      profileState.payTax = document.getElementById("payTax").checked;
      profileState.gstRegistered =
        document.getElementById("gstRegistered").checked;
      profileState.licence = document.getElementById("licence").checked;
    }

    if (section === "crops") {
      profileState.crops = Array.from(
        cropsChecklist.querySelectorAll("input:checked")
      ).map((el) => el.value);

      const subs = [];
      cropSubcategories
        .querySelectorAll('input[type="checkbox"]:checked')
        .forEach((el) => subs.push(el.value));
      profileState.cropSubs = subs;
    }

    // Sidebar update
    infoName.textContent = profileState.fullName || "—";
    infoPhone.textContent = profileState.phone;
    infoLocation.textContent =
      (profileState.city || profileState.village || "—") +
      (profileState.district ? ", " + profileState.district : "");
    infoBusinessType.textContent = profileState.businessType || "—";

    toggleEdit(section, false);
    console.log("Buyer profile section saved:", section, profileState);
  }

  /* -------------------------------------------------- */
  /* DISTRICT / BLOCK DATA                              */
  /* (Shortened version from your buyer register)       */
  /* -------------------------------------------------- */
  const districtBlockData = {
    "Kolkata": ["Alipore", "Ballygunge", "Shyambazar"],
    "Howrah": ["Howrah", "Uluberia", "Shyampur"],
    "North 24 Parganas": ["Barasat", "Basirhat", "Bidhannagar"],
    "South 24 Parganas": ["Baruipur", "Canning", "Diamond Harbour"],
    "Murshidabad": ["Berhampore", "Lalgola"],
  };

  function populateDistricts() {
    if (!districtSelect) return;
    districtSelect.innerHTML =
      '<option value="">Select district</option>' +
      Object.keys(districtBlockData)
        .sort()
        .map((d) => `<option value="${d}">${d}</option>`)
        .join("");
  }

  if (districtSelect) {
    districtSelect.addEventListener("change", () => {
      const dist = districtSelect.value;
      blockSelect.innerHTML =
        '<option value="">Select block</option>' +
        (districtBlockData[dist] || [])
          .map((b) => `<option value="${b}">${b}</option>`)
          .join("");
      blockSelect.disabled = !dist;
    });
  }

  /* -------------------------------------------------- */
  /* CROPS DATA + RENDER                                */
  /* -------------------------------------------------- */
  const cropsData = {
    "Rice / ধান": [
      "Swarna — স্বর্ণা",
      "IR-64 — আইআর-৬৪",
      "Basmati — বাসমতী",
      "Hyb-Local — হাইব্রিড স্থানীয়",
    ],
    "Wheat / গম": [
      "HD-2733 — এইচডি-২৭৩৩",
      "Sonalika — সোনালিকা",
    ],
    "Potato / আলু": [
      "Kufri Pukhraj — কুফরি পুখরাজ",
      "Local Red — স্থানীয় লাল",
    ],
    "Jute / পাট": [
      "Tossa — টোসা পাট",
      "White Jute — সাদা পাট",
    ],
    "Vegetables / সবজি": [
      "Tomato — টমেটো",
      "Brinjal — বেগুন",
      "Cauliflower — ফুলকপি",
      "Cabbage — বাঁধাকপি",
    ],
    "Pulses / ডাল": ["Masur — মসুর", "Moong — মুগ", "Gram — ছোলা"],
  };

  function labelForCrop(cropKey) {
    const [en, bn] = cropKey.split(" / ");
    if (window.currentLanguage === "bn") {
      return `${bn} (${en})`;
    }
    return `${en} (${bn})`;
  }

  function populateCrops() {
    if (!cropsChecklist) return;
    cropsChecklist.innerHTML = "";

    Object.keys(cropsData)
      .sort()
      .forEach((key) => {
        const id = "crop_" + key.replace(/\s+/g, "_");
        const labelText = labelForCrop(key);

        const label = document.createElement("label");
        label.innerHTML = `
          <input type="checkbox" id="${id}" value="${key}">
          <span>${labelText}</span>
        `;
        cropsChecklist.appendChild(label);

        document
          .getElementById(id)
          .addEventListener("change", renderSubcategories);
      });
  }

  function renderSubcategories() {
    if (!cropSubcategories) return;

    const selected = Array.from(
      cropsChecklist.querySelectorAll("input:checked")
    ).map((i) => i.value);

    if (selected.length === 0) {
      cropSubcategories.innerHTML = `<div class="subcategory-empty">${
        window.currentLanguage === "bn"
          ? "উপবিভাগ দেখতে ফসল নির্বাচন করুন"
          : "Select crops to see subcategories"
      }</div>`;
      return;
    }

    cropSubcategories.innerHTML = "";

    selected.forEach((key) => {
      const group = document.createElement("div");
      group.className = "subcategory-group";

      const [en, bn] = key.split(" / ");
      const titleText =
        window.currentLanguage === "bn"
          ? `${bn} (${en})`
          : `${en} (${bn})`;

      const title = document.createElement("div");
      title.style.fontWeight = "600";
      title.textContent = titleText;
      group.appendChild(title);

      const subs = cropsData[key] || [];
      subs.forEach((sub) => {
        const el = document.createElement("label");
        el.innerHTML = `<input type="checkbox" value="${sub}"> ${sub}`;
        group.appendChild(el);
      });

      cropSubcategories.appendChild(group);
    });
  }

  /* -------------------------------------------------- */
  /* PHOTO HANDLING                                     */
  /* -------------------------------------------------- */
  function onPhotoSelected(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    photoImg.src = url;
    photoImg.hidden = false;
    photoEmpty.hidden = true;

    btnUpload.hidden = true;
    btnReplace.hidden = false;
    btnDelete.hidden = false;

    profileState.photo = url;
  }

  function onDeletePhoto() {
    photoImg.src = "";
    photoImg.hidden = true;
    photoEmpty.hidden = false;

    btnReplace.hidden = true;
    btnDelete.hidden = true;
    btnUpload.hidden = false;

    profileState.photo = null;
  }

  /* -------------------------------------------------- */
  /* WALLET DEMO                                        */
  /* -------------------------------------------------- */
  function initWallet() {
    if (walletBalance) walletBalance.textContent = "₹ 2,50,000";
    if (walletEscrow) walletEscrow.textContent = "₹ 1,20,000";
    if (walletSpent) walletSpent.textContent = "₹ 95,000";
    if (lastTransaction) lastTransaction.textContent = "2025-11-26";
  }

  /* -------------------------------------------------- */
  /* INIT                                               */
  /* -------------------------------------------------- */
  function initPage() {
    applyTheme(window.currentTheme);
    applyLanguage(window.currentLanguage);

    populateDistricts();
    populateCrops();
    renderSubcategories();
    initWallet();

    infoName.textContent = "—";
    infoPhone.textContent = profileState.phone;
    infoLocation.textContent = "—";
    infoBusinessType.textContent = "—";

    // Edit buttons
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        toggleEdit(section, true);
      });
    });

    document.querySelectorAll(".btn-cancel").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        toggleEdit(section, false, true);
      });
    });

    document.querySelectorAll(".btn-save").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        saveSection(section);
      });
    });

    // Photo
    if (photoInput) {
      photoInput.addEventListener("change", onPhotoSelected);
      btnUpload?.addEventListener("click", () => photoInput.click());
      btnReplace?.addEventListener("click", () => photoInput.click());
      btnDelete?.addEventListener("click", onDeletePhoto);
    }

    // Theme + language
    themeBtn?.addEventListener("click", toggleTheme);
    mobileThemeBtn?.addEventListener("click", toggleTheme);
    langBtn?.addEventListener("click", toggleLanguage);
    mobileLangBtn?.addEventListener("click", toggleLanguage);

    // Mobile menu
    mobileMenuBtn?.addEventListener("click", () => {
      mobileMenu?.classList.toggle("open");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
})();
