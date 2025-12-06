(function protectBuyerProfile() {
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


(function () {
  const API_BASE = "http://localhost:8080/api/profile/buyer";

  /* ------------------------------ */
  /* TRANSLATIONS                   */
  /* ------------------------------ */

  const buyerTranslations = {
    en: {
      walletBalance: "Wallet Balance",
      walletEscrow: "Escrow Locked",
      basicDetails: "Basic Details",
      businessDetails: "Business Details",
      cropsDetails: "Crops Dealt With",
      buyerPhoto: "Buyer / Business Photo",
      phone: "Phone Number",
      role: "Role",
      fullName: "Full Name",
      aadhar: "Aadhaar Number",
      btnEdit: "Edit",
      btnSave: "Save",
      btnCancel: "Cancel",
      btnUpload: "Upload",
      btnReplace: "Replace",
      btnDelete: "Delete",
      accountTitle: "Account",
      buyerNameLabel: "Name:",
      phoneLabel: "Phone:",
      locationLabel: "Location:",
      businessTypeShort: "Business Type:",
    },
    bn: {
      walletBalance: "ওয়ালেট ব্যালেন্স",
      walletEscrow: "এসক্রো",
      basicDetails: "মৌলিক তথ্য",
      businessDetails: "ব্যবসার বিবরণ",
      cropsDetails: "ফসল",
      buyerPhoto: "ক্রেতা / ব্যবসার ছবি",
      phone: "ফোন নম্বর",
      role: "ভূমিকা",
      fullName: "সম্পূর্ণ নাম",
      aadhar: "আধার নম্বর",
      btnEdit: "এডিট",
      btnSave: "সেভ",
      btnCancel: "বাতিল",
      btnUpload: "আপলোড",
      btnReplace: "পরিবর্তন",
      btnDelete: "ডিলিট",
      accountTitle: "অ্যাকাউন্ট",
      buyerNameLabel: "নাম:",
      phoneLabel: "ফোন:",
      locationLabel: "অবস্থান:",
      businessTypeShort: "ব্যবসার ধরন:",
    },
  };

  if (!window.currentTheme) window.currentTheme = "light";
  if (!window.currentLanguage) window.currentLanguage = "en";

  /* ------------------------------ */
  /* APPLY LANGUAGE                 */
  /* ------------------------------ */

  function applyLanguage(lang) {
    const t = buyerTranslations[lang];
    document.querySelectorAll("[data-text]").forEach((el) => {
      const key = el.getAttribute("data-text");
      if (t[key]) el.textContent = t[key];
    });

    const langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
  }

  /* ------------------------------ */
  /* DOM ELEMENTS (loaded later)    */
  /* ------------------------------ */

  let phoneEl,
    roleEl,
    nameEl,
    aadharEl,
    districtEl,
    blockEl,
    cityEl,
    villageEl,
    pinEl;

  let businessNameEl,
    businessTypeEl,
    businessScaleEl,
    businessAgeEl,
    payTaxEl,
    gstEl,
    licEl,
    wareNameEl,
    wareLocationEl,
    annualPurchaseEl;

  let balEl,
    escEl,
    cropsChecklist,
    cropSubcategories,
    photoInput,
    photoImg,
    photoEmpty,
    btnUpload,
    btnReplace,
    btnDelete;

  let sidebarName, sidebarPhone, sidebarLocation, sidebarBusiness;

  /* ------------------------------ */
  /* LOAD PROFILE                   */
  /* ------------------------------ */

  async function loadProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired.");
        return;
      }

      const res = await fetch(API_BASE, {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();

      /* BASIC INFO */
      phoneEl.value = data.phone;
      roleEl.value = "Buyer";
      nameEl.value = data.fullName;
      aadharEl.value = data.aadhaarNo;

      districtEl.value = data.districtName;
      blockEl.value = data.blockName;
      cityEl.value = data.cityName || "";
      villageEl.value = data.village || "";
      pinEl.value = data.pinCode || "";

      /* BUSINESS */
      businessNameEl.value = data.businessName || "";
      businessTypeEl.value = data.businessType || "";
      businessScaleEl.value = data.businessScale || "";
      businessAgeEl.value = data.businessAge || "";
      wareNameEl.value = data.warehouseName || "";
      wareLocationEl.value = data.warehouseLocation || "";
      annualPurchaseEl.value = data.annualPurchase || "";

      payTaxEl.checked = data.paysTax;
      gstEl.checked = data.gstRegistered;
      licEl.checked = data.hasLicence;

      /* WALLET */
      balEl.textContent = "₹ " + (data.balance ?? 0);
      escEl.textContent = "₹ " + (data.lockedAmount ?? 0);

      /* SIDEBAR */
      sidebarName.textContent = data.fullName || "—";
      sidebarPhone.textContent = data.phone || "—";
      sidebarLocation.textContent =
        (data.cityName || "") + ", " + (data.districtName || "");
      sidebarBusiness.textContent = data.businessType || "—";

      /* PHOTO */
      if (data.aadhaarPhotoUrl) {
        photoImg.src = data.aadhaarPhotoUrl;
        photoImg.hidden = false;
        photoEmpty.hidden = true;
        btnUpload.hidden = true;
        btnReplace.hidden = false;
        btnDelete.hidden = false;
      } else {
        photoImg.hidden = true;
        photoEmpty.hidden = false;
        btnUpload.hidden = false;
      }

    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }

  /* ------------------------------ */
  /* SAVE SECTION                   */
  /* ------------------------------ */

  async function save(section) {
    const token = localStorage.getItem("token");
    let body = {};

    if (section === "basic") {
      body.fullName = nameEl.value.trim();
    }

    if (section === "business") {
      body.businessName = businessNameEl.value.trim();

      body.businessType = businessTypeEl.value
        ? businessTypeEl.value.toUpperCase()
        : null;

      body.businessScale = businessScaleEl.value
        ? businessScaleEl.value.toUpperCase()
        : null;

      body.businessAge = businessAgeEl.value
        ? businessAgeEl.value.toUpperCase()
        : null;

      body.annualPurchase = annualPurchaseEl.value
        ? annualPurchaseEl.value.toUpperCase()
        : null;

      body.warehouseName = wareNameEl.value.trim();
      body.warehouseLocation = wareLocationEl.value.trim();

      body.paysTax = payTaxEl.checked;
      body.gstRegistered = gstEl.checked;
      body.hasLicence = licEl.checked;
    }

    try {
      await fetch(API_BASE, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      await loadProfile();
      toggleEdit(section, false);

    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  /* ------------------------------ */
  /* PHOTO UPLOAD                   */
  /* ------------------------------ */

  photoInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(API_BASE + "/aadhaar", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData,
    });

    const url = await res.text();
    photoImg.src = url;
    photoImg.hidden = false;
    photoEmpty.hidden = true;

    btnUpload.hidden = true;
    btnReplace.hidden = false;
    btnDelete.hidden = false;
  });

  btnDelete?.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    await fetch(API_BASE + "/aadhaar", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    photoImg.hidden = true;
    photoEmpty.hidden = false;

    btnUpload.hidden = false;
    btnReplace.hidden = true;
    btnDelete.hidden = true;
  });

  /* ------------------------------ */
  /* TOGGLE EDIT                    */
  /* ------------------------------ */

  function toggleEdit(section, editing) {
    const form = document.querySelector(`.form-${section}`);
    const actions = form.querySelector(".form-actions");
    const editBtn = document.querySelector(`.btn-edit[data-section="${section}"]`);

    actions.hidden = !editing;
    editBtn.style.display = editing ? "none" : "inline-flex";

    form.querySelectorAll("input, select").forEach((inp) => {
      if (inp.classList.contains("input-locked")) return;
      inp.disabled = !editing;
    });
  }

  /* ------------------------------ */
  /* INIT PAGE                      */
  /* ------------------------------ */

  function initPage() {
    applyLanguage(window.currentLanguage);

    /* Get elements after page loads */
    phoneEl = document.getElementById("phone");
    roleEl = document.getElementById("role");
    nameEl = document.getElementById("fullName");
    aadharEl = document.getElementById("aadhar");
    districtEl = document.getElementById("district");
    blockEl = document.getElementById("block");
    cityEl = document.getElementById("city");
    villageEl = document.getElementById("village");
    pinEl = document.getElementById("pincode");

    businessNameEl = document.getElementById("businessName");
    businessTypeEl = document.getElementById("businessType");
    businessScaleEl = document.getElementById("businessScale");
    businessAgeEl = document.getElementById("businessAge");
    payTaxEl = document.getElementById("payTax");
    gstEl = document.getElementById("gstRegistered");
    licEl = document.getElementById("licence");
    wareNameEl = document.getElementById("wareName");
    wareLocationEl = document.getElementById("wareLocation");
    annualPurchaseEl = document.getElementById("annualPurchase");

    balEl = document.getElementById("walletBalance");
    escEl = document.getElementById("walletEscrow");

    cropsChecklist = document.getElementById("cropsChecklist");
    cropSubcategories = document.getElementById("cropSubcategories");

    sidebarName = document.getElementById("infoName");
    sidebarPhone = document.getElementById("infoPhone");
    sidebarLocation = document.getElementById("infoLocation");
    sidebarBusiness = document.getElementById("infoBusinessType");

    photoInput = document.getElementById("photoInput");
    photoImg = document.getElementById("photoImg");
    photoEmpty = document.getElementById("photoEmpty");
    btnUpload = document.getElementById("btnUpload");
    btnReplace = document.getElementById("btnReplace");
    btnDelete = document.getElementById("btnDelete");

    /* Edit buttons */
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () =>
        toggleEdit(btn.dataset.section, true)
      );
    });
    document.querySelectorAll(".btn-cancel").forEach((btn) => {
      btn.addEventListener("click", () =>
        toggleEdit(btn.dataset.section, false)
      );
    });
    document.querySelectorAll(".btn-save").forEach((btn) => {
      btn.addEventListener("click", () =>
        save(btn.dataset.section)
      );
    });

    loadProfile();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }

})();
