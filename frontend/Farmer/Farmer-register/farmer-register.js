// =========================
// GLOBAL STATE
// =========================
let currentLanguage = "en";
let currentTheme = "light";

// =========================
// TRANSLATIONS
// =========================
const translations = {
  en: {
    pageTitle: "Farmer Registration",
    pageSubtitle: "Provide your farming details to complete your Farm360 profile.",
    basicTitle: "Basic Details",
    landTitle: "Land Details",
    cropsTitle: "Crops",
    photoTitle: "Land Photo",
    walletTitle: "Escrow Wallet (Auto-Created)",
    nameLabel: "Farmer Name",
    districtLabel: "District",
    blockLabel: "Block",
    villageLabel: "Village",
    pinLabel: "PIN Code",
    landSizeLabel: "Land Size (in acres)",
    croppingLabel: "Cropping Pattern",
    subcategoryLabel: "Crop Subcategories",
    submitBtn: "Submit Profile",
    backBtn: "‹ Back"
  },
  bn: {
    pageTitle: "কৃষক নিবন্ধন",
    pageSubtitle: "আপনার Farm360 প্রোফাইল সম্পূর্ণ করতে চাষাবাদের বিবরণ দিন।",
    basicTitle: "মৌলিক তথ্য",
    landTitle: "জমির বিবরণ",
    cropsTitle: "ফসল",
    photoTitle: "জমির ছবি",
    walletTitle: "এসক্রো ওয়ালেট (স্বয়ংক্রিয়ভাবে তৈরি)",
    nameLabel: "কৃষকের নাম",
    districtLabel: "জেলা",
    blockLabel: "ব্লক",
    villageLabel: "গ্রাম",
    pinLabel: "পিন কোড",
    landSizeLabel: "জমির আকার (একর)",
    croppingLabel: "ফসল কাটার ধরন",
    subcategoryLabel: "ফসলের উপবিভাগ",
    submitBtn: "প্রোফাইল জমা দিন",
    backBtn: "‹ ফিরে যান"
  }
};

// =========================
// TOAST
// =========================
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  populateDistricts();
  populateCrops();
  attachEvents();
});

// =========================
// THEME
// =========================
function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  currentTheme = theme;
}

function toggleTheme() {
  applyTheme(currentTheme === "light" ? "dark" : "light");
}

// =========================
// LANGUAGE
// =========================
function applyLanguage(lang) {
  document.body.classList.toggle("lang-bn", lang === "bn");
  currentLanguage = lang;

  const t = translations[lang];

  document.querySelectorAll("[data-text]").forEach(el => {
    const key = el.getAttribute("data-text");
    if (t[key]) el.textContent = t[key];
  });

  document.getElementById("langToggle").textContent =
    lang === "en" ? "বাংলা" : "English";
}

function toggleLanguage() {
  applyLanguage(currentLanguage === "en" ? "bn" : "en");
}

// =========================
// DISTRICTS → BLOCKS
// =========================
async function populateDistricts() {
  try {
    const res = await fetch("http://localhost:8080/master/districts");
    const districts = await res.json();

    const select = document.getElementById("district");
    select.innerHTML = `<option value="">Select district</option>`;

    districts.forEach(d =>
      select.innerHTML += `<option value="${d.id}">${d.name}</option>`
    );
  } catch (e) {
    showToast("Failed to load districts.", "error");
  }
}

async function updateBlocks() {
  const districtId = document.getElementById("district").value;
  const blockSelect = document.getElementById("block");

  blockSelect.innerHTML = `<option value="">Select block</option>`;
  blockSelect.disabled = true;

  if (!districtId) return;

  try {
    const res = await fetch(`http://localhost:8080/master/blocks/${districtId}`);
    const blocks = await res.json();

    blocks.forEach(b =>
      blockSelect.innerHTML += `<option value="${b.id}">${b.name}</option>`
    );

    blockSelect.disabled = false;
  } catch (e) {
    showToast("Failed to load blocks.", "error");
  }
}

// =========================
// CROPS (MULTI-DROPDOWN)
// =========================
async function populateCrops() {
  const select = document.getElementById("cropsSelect");
  select.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8080/master/crops");
    const crops = await res.json();

    crops
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(crop => {
        const opt = document.createElement("option");
        opt.value = crop.id;
        opt.textContent = crop.name;
        select.appendChild(opt);
      });

    select.addEventListener("change", updateSubcategories);

  } catch (e) {
    console.error("Failed to load crops", e);
  }
}

function getSelectedCrops() {
  return Array.from(
    document.getElementById("cropsSelect").selectedOptions
  ).map(o => parseInt(o.value));
}

// =========================
// SUBCATEGORIES
// =========================
async function updateSubcategories() {
  const cropIds = getSelectedCrops();
  const subSelect = document.getElementById("cropSubcategory");

  subSelect.innerHTML = "";
  subSelect.disabled = cropIds.length === 0;

  if (cropIds.length === 0) return;

  const subsMap = new Map();

  try {
    for (const id of cropIds) {
      const res = await fetch(`http://localhost:8080/master/subcategories/${id}`);
      const subs = await res.json();

      subs.forEach(s => {
        if (!subsMap.has(s.id)) subsMap.set(s.id, s);
      });
    }

    Array.from(subsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(sub => {
        subSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
      });

  } catch (e) {
    showToast("Failed to load subcategories.", "error");
  }
}

// =========================
// PHOTO HANDLING
// =========================
function handlePhotoInput(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("photoPreview");
  const wrap = document.getElementById("photoPreviewWrap");

  if (!file) {
    wrap.classList.add("hidden");
    preview.src = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    preview.src = ev.target.result;
    wrap.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  const input = document.getElementById("landPhoto");
  input.value = "";
  document.getElementById("photoPreviewWrap").classList.add("hidden");
}


function validateForm() {
  let ok = true;
  const f = id => document.getElementById(id).value.trim();

  if (!f("farmerName")) return showToast("Enter farmer name.", "error"), false;
  if (!f("district")) return showToast("Select district.", "error"), false;
  if (!f("block")) return showToast("Select block.", "error"), false;
  if (!f("village")) return showToast("Enter village.", "error"), false;
  if (!/^\d{6}$/.test(f("pin"))) return showToast("Enter valid PIN.", "error"), false;
  if (!(parseFloat(f("landSize")) > 0))
    return showToast("Enter valid land size.", "error"), false;
  if (!f("croppingPattern"))
    return showToast("Select cropping pattern.", "error"), false;

  if (getSelectedCrops().length === 0)
    return showToast("Select at least one crop.", "error"), false;

  if (document.getElementById("cropSubcategory").selectedOptions.length === 0)
    return showToast("Select at least one subcategory.", "error"), false;

  return ok;
}

// =========================
// SUBMIT
// =========================
async function handleSubmit() {

  // SHOW LOADING POPUP
  const popup = document.getElementById("submitPopup");
  const popupContent = document.getElementById("popupContent");
  const popupMessage = document.getElementById("popupMessage");
  const loader = document.getElementById("popupLoader");

  popupContent.className = "popup-content"; // reset
  loader.classList.remove("hidden");
  popupMessage.textContent = "Submitting your profile...";
  popup.classList.remove("hidden");

  if (!validateForm()) {
    popup.classList.add("hidden");
    return;
  }

  const payload = {
    farmerName: document.getElementById("farmerName").value.trim(),
    districtId: parseInt(document.getElementById("district").value),
    blockId: parseInt(document.getElementById("block").value),
    village: document.getElementById("village").value.trim(),
    pinCode: document.getElementById("pin").value.trim(),
    landSize: parseFloat(document.getElementById("landSize").value),
    croppingPattern: document.getElementById("croppingPattern").value,
    cropIds: getSelectedCrops(),
    subCategoryIds: Array.from(
      document.getElementById("cropSubcategory").selectedOptions
    ).map(o => parseInt(o.value))
  };

  const fd = new FormData();
  fd.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

  const photo = document.getElementById("landPhoto").files[0];
  if (photo) fd.append("landPhoto", photo);

  const userId = localStorage.getItem("userId");
  if (!userId) {
    popupError("User not logged in.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/farmer/register/${userId}`, {
      method: "POST",
      body: fd
    });

    loader.classList.add("hidden");

    if (!res.ok) {
      popupError("Registration Failed !");
      return;
    }

    popupSuccess("Registration Successful!");

  } catch (err) {
    loader.classList.add("hidden");
    popupError("Something went wrong.");
  }
}

// SUCCESS POPUP
function popupSuccess(msg) {
  const popup = document.getElementById("submitPopup");
  const popupContent = document.getElementById("popupContent");
  const popupMessage = document.getElementById("popupMessage");
  popupContent.className = "popup-content popup-success";
  popupMessage.textContent = msg;
}

// ERROR POPUP
function popupError(msg) {
  const popup = document.getElementById("submitPopup");
  const popupContent = document.getElementById("popupContent");
  const popupMessage = document.getElementById("popupMessage");
  popupContent.className = "popup-content popup-error";
  popupMessage.textContent = msg;
}



// =========================
// EVENT BINDINGS
// =========================
function attachEvents() {
  document.getElementById("themeToggle").onclick = toggleTheme;
  document.getElementById("langToggle").onclick = toggleLanguage;
  document.getElementById("district").onchange = updateBlocks;
  document.getElementById("landPhoto").onchange = handlePhotoInput;
  document.getElementById("submitBtn").onclick = e => {
    e.preventDefault();
    handleSubmit();
  };
}
