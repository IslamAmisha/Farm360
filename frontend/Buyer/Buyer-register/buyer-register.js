//global state
let currentLanguage = "en";
let currentTheme = "light";
let selectedBuyerCrops = [];
let aadhaarBase64 = null;

//translations library
const translations = {
  en: {
    pageTitle: "Buyer Registration",
    pageSubtitle: "Provide your details to complete your Farm360 buyer profile.",
    basicTitle: "Basic Details",
    businessTitle: "Business Details",
    cropsTitle: "Crops Dealt With",

    fullNameLabel: "Full Name",
    aadharLabel: "Aadhaar No",
    aadharPhotoLabel: "Aadhaar Photo",
    districtLabel: "District",
    blockLabel: "Block",
    cityLabel: "City",
    villageLabel: "Village",
    pinLabel: "PIN Code",

    businessNameLabel: "Business Name",
    businessTypeLabel: "Business Type",
    businessScaleLabel: "Business Scale",
    govtApprovalLabel: "Government Approvals",
    businessAgeLabel: "Business Age",
    warehouseNameLabel: "Warehouse Name",
    warehouseLocationLabel: "Warehouse Location",
    annualPurchaseLabel: "Annual Purchase",
    contractModelLabel: "Contract Model",

    // ⭐ NEW SEASON TRANSLATIONS (ENGLISH)
    seasonLabel: "Select Season(s)",
    seasonKharif: "Kharif",
    seasonRabi: "Rabi",
    seasonZaid: "Zaid",

    buyerCropsLabel: "Crops",
    buyerCropSubLabel: "Crop Subcategories",
    submitBtn: "Submit Profile",
    backBtn: "‹ Back",
  },

  bn: {
    pageTitle: "ক্রেতা নিবন্ধন",
    pageSubtitle: "আপনার Farm360 ক্রেতা প্রোফাইল সম্পূর্ণ করতে তথ্য দিন।",
    basicTitle: "মৌলিক বিবরণ",
    businessTitle: "ব্যবসার বিবরণ",
    cropsTitle: "ফসল",

    fullNameLabel: "পূর্ণ নাম",
    aadharLabel: "আধার নম্বর",
    aadharPhotoLabel: "আধারের ছবি",
    districtLabel: "জেলা",
    blockLabel: "ব্লক",
    cityLabel: "শহর",
    villageLabel: "গ্রাম",
    pinLabel: "পিন কোড",

    businessNameLabel: "ব্যবসার নাম",
    businessTypeLabel: "ব্যবসার ধরন",
    businessScaleLabel: "ব্যবসার পরিধি",
    govtApprovalLabel: "সরকারি অনুমোদন",
    businessAgeLabel: "ব্যবসার সময়কাল",
    warehouseNameLabel: "গুদামের নাম",
    warehouseLocationLabel: "গুদামের অবস্থান",
    annualPurchaseLabel: "বার্ষিক ক্রয়",
    contractModelLabel: "চুক্তির ধরন",

    // ⭐ NEW SEASON TRANSLATIONS (BENGALI)
    seasonLabel: "মৌসুম নির্বাচন করুন",
    seasonKharif: "খরিফ",
    seasonRabi: "রবি",
    seasonZaid: "জাইড",

    buyerCropsLabel: "ফসল",
    buyerCropSubLabel: "ফসলের উপবিভাগ",
    submitBtn: "প্রোফাইল জমা দিন",
    backBtn: "‹ ফিরে যান",
  }
};

//pop-up
function showPopup(type, message) {
  const overlay = document.getElementById("resultPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const text = document.getElementById("popupText");

  if (type === "success") {
    icon.innerHTML = "✔️";
    icon.className = "popup-icon popup-success";
    title.textContent = "Registration Successful!";
    text.textContent = message;
  } else {
    icon.innerHTML = "❌";
    icon.className = "popup-icon popup-error";
    title.textContent = "Registration Failed";
    text.textContent = message;
  }

  overlay.classList.add("show");

  if (type === "success") {
    setTimeout(() => {
      overlay.classList.remove("show");
      window.location.href = "../../Login/login.html";
    }, 2000);
  }
}

//init
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  loadDistricts();
  loadCrops();
  attachEvents();
});

//theme
function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  currentTheme = theme;
}
function toggleTheme() {
  applyTheme(currentTheme === "light" ? "dark" : "light");
}

//language
function applyLanguage(lang) {
  currentLanguage = lang;
  document.body.classList.toggle("lang-bn", lang === "bn");

  const t = translations[lang];
  document.querySelectorAll("[data-text]").forEach((el) => {
    if (t[el.dataset.text]) el.textContent = t[el.dataset.text];
  });

  document.getElementById("langToggle").textContent =
    lang === "en" ? "বাংলা" : "English";
}
function toggleLanguage() {
  applyLanguage(currentLanguage === "en" ? "bn" : "en");
}


   //DISTRICT → BLOCK → CITY

async function loadDistricts() {
  const sel = document.getElementById("district");
  sel.innerHTML = `<option value="">Select district</option>`;

  const res = await fetch("http://localhost:8080/master/districts");
  const data = await res.json();

  data.forEach((d) => {
    sel.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
}

async function updateBlocks() {
  const districtId = document.getElementById("district").value;
  const sel = document.getElementById("block");

  sel.innerHTML = `<option value="">Select block</option>`;
  sel.disabled = true;

  if (!districtId) return;

  const res = await fetch(`http://localhost:8080/master/blocks/${districtId}`);
  const blocks = await res.json();

  blocks.forEach((b) => {
    sel.innerHTML += `<option value="${b.id}">${b.name}</option>`;
  });

  sel.disabled = false;
}

async function updateCities() {
  const blockId = document.getElementById("block").value;
  const sel = document.getElementById("city");

  sel.innerHTML = `<option value="">Select city</option>`;
  sel.disabled = true;

  if (!blockId) return;

  const res = await fetch(`http://localhost:8080/master/cities/${blockId}`);
  const cities = await res.json();

  cities.forEach((c) => {
    sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });

  sel.disabled = false;
}

//crop and its category
async function loadCrops() {
  const sel = document.getElementById("buyerCropsSelect");
  sel.innerHTML = "";

  const res = await fetch("http://localhost:8080/master/crops");
  const crops = await res.json();

  crops.forEach((c) => {
    sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });

  sel.addEventListener("change", onCropsSelect);
}

function onCropsSelect() {
  selectedBuyerCrops = Array.from(
    document.getElementById("buyerCropsSelect").selectedOptions
  ).map(o => parseInt(o.value));

  renderSelectedCrops();
  updateSubcategories();
}

function renderSelectedCrops() {
  const wrap = document.getElementById("buyerSelectedCrops");
  wrap.innerHTML = "";

  selectedBuyerCrops.forEach(id => {
    const label = document.querySelector(
      `#buyerCropsSelect option[value="${id}"]`
    ).textContent;

    const chip = document.createElement("div");
    chip.className = "tag-chip";
    chip.innerHTML = `<span>${label}</span><button type="button">×</button>`;

    chip.querySelector("button").addEventListener("click", () => {
      const opt = document.querySelector(
        `#buyerCropsSelect option[value="${id}"]`
      );
      opt.selected = false;
      onCropsSelect();
    });

    wrap.appendChild(chip);
  });
}

async function updateSubcategories() {
  const sel = document.getElementById("buyerCropSub");
  sel.innerHTML = "";
  sel.disabled = selectedBuyerCrops.length === 0;

  const subMap = new Map();

  for (const cropId of selectedBuyerCrops) {
    const res = await fetch(`http://localhost:8080/master/subcategories/${cropId}`);
    const subs = await res.json();

    subs.forEach(s => subMap.set(s.id, s));
  }

  Array.from(subMap.values()).forEach(s => {
    sel.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });
}

//aadhar handling
function onAadharPhoto(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("aadharPreview");

  if (!file) {
    aadhaarBase64 = null;
    preview.classList.add("hidden");
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    aadhaarBase64 = ev.target.result;
    preview.src = aadhaarBase64;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

//contract modal 
function toggleSeasonField() {
  const model = document.getElementById("contractModel").value;
  const seasonGroup = document.getElementById("seasonGroup");

  if (model === "SEASONAL" || model === "BOTH") {
    seasonGroup.style.display = "block";
  } else {
    seasonGroup.style.display = "none";
    document.getElementById("seasonSelect").selectedIndex = -1;
  }
}

//VALIDATION
function validateForm() {
  let ok = true;

  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  const fullName = document.getElementById("fullName").value.trim();
  const district = document.getElementById("district").value;
  const block = document.getElementById("block").value;

  if (!fullName) {
    document.getElementById("fullNameErr").textContent = "Enter full name.";
    ok = false;
  }
  if (!district) {
    document.getElementById("districtErr").textContent = "Select district.";
    ok = false;
  }
  if (!block) {
    document.getElementById("blockErr").textContent = "Select block.";
    ok = false;
  }

  const contractModel = document.getElementById("contractModel").value;

  if (contractModel === "SEASONAL" || contractModel === "BOTH") {
    const selectedSeasons = Array.from(
      document.getElementById("seasonSelect").selectedOptions
    ).map(o => o.value);

    if (selectedSeasons.length === 0) {
      document.getElementById("seasonErr").textContent =
        "Select at least one season.";
      ok = false;
    }
  }

  return ok;
}

//submit
async function handleBuyerSubmit() {

  if (!validateForm()) return;

  const approvals = Array.from(
    document.querySelectorAll(".gov-approval:checked")
  ).map(cb => cb.value);

  // ⭐ COLLECT SEASONS
  const selectedSeasons = Array.from(
    document.getElementById("seasonSelect").selectedOptions
  ).map(o => o.value);

  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    aadhaarNo: document.getElementById("aadhar").value.trim(),
    aadhaarPhotoUrl: aadhaarBase64,

    districtId: parseInt(document.getElementById("district").value),
    blockId: parseInt(document.getElementById("block").value),
    cityId: parseInt(document.getElementById("city").value),

    village: document.getElementById("village").value.trim(),
    pinCode: document.getElementById("pin").value.trim(),
    businessName: document.getElementById("businessName").value.trim(),
    businessType: document.getElementById("businessType").value,
    businessScale: document.getElementById("businessScale").value,

    paysTax: approvals.includes("Pay_Tax"),
    gstRegistered: approvals.includes("GST_Registered"),
    hasLicence: approvals.includes("Has_Licence"),

    businessAge: document.getElementById("businessAge").value,
    warehouseName: document.getElementById("wareName").value.trim(),
    warehouseLocation: document.getElementById("wareLocation").value.trim(),

    annualPurchase: document.getElementById("annualPurchase").value,
    contractModel: document.getElementById("contractModel").value,

    seasons: selectedSeasons,   

    cropIds: selectedBuyerCrops,
    subcategoryIds: Array.from(
      document.getElementById("buyerCropSub").selectedOptions
    ).map(o => parseInt(o.value)),
  };

  const userId = localStorage.getItem("userId");
  if (!userId) {
    showPopup("error", "User not logged in.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/buyer/register/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      showPopup("error", "Registration failed. Please try again.");
      return;
    }

    showPopup("success", "Your buyer profile has been created successfully.");

  } catch (err) {
    showPopup("error", "Something went wrong. Try again.");
  }
}

//event
function attachEvents() {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("langToggle").addEventListener("click", toggleLanguage);

  document.getElementById("district").addEventListener("change", updateBlocks);
  document.getElementById("block").addEventListener("change", updateCities);

  document.getElementById("aadharPhoto").addEventListener("change", onAadharPhoto);

  document.getElementById("contractModel").addEventListener("change", toggleSeasonField);

  document.getElementById("buyerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleBuyerSubmit();
  });
}
