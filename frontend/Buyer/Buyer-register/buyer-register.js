/* ============================================================
   GLOBAL STATE
============================================================ */
let currentLanguage = "en";
let currentTheme = "light";
let selectedBuyerCrops = [];
let aadhaarBase64 = null;

/* ============================================================
   TRANSLATIONS (UNCHANGED)
============================================================ */
const translations = {
  en: {
    pageTitle: "Buyer Registration",
    pageSubtitle: "Provide your details to complete your Farm360 buyer profile.",
    basicTitle: "Basic Details",
    businessTitle: "Business Details",
    cropsTitle: "Crops Dealt With",
    walletTitle: "Buyer Wallet & Escrow (Auto-Created)",

    fullNameLabel: "Full Name",
    aadharLabel: "Aadhaar No",
    aadharPhotoLabel: "Aadhaar Photo",
    aadharPhotoHint: "Upload a clear Aadhaar image (optional)",
    verifyBtnText: "Verify",

    districtLabel: "District (West Bengal)",
    blockLabel: "Block",
    cityLabel: "City / Town",
    villageLabel: "Village / Area",
    pinLabel: "PIN Code",

    businessNameLabel: "Business Name",
    businessTypeLabel: "Business Type",
    businessScaleLabel: "Business Scale",
    govtApprovalLabel: "Government Approvals",
    payTaxLabel: "Pay Tax",
    gstLabel: "GST Registered",
    licenceLabel: "Has Licence",
    businessAgeLabel: "Business Age",
    warehouseNameLabel: "Warehouse Name",
    warehouseLocationLabel: "Warehouse Location",
    annualPurchaseLabel: "Annual Purchase (approx.)",

    buyerCropsLabel: "Crops",
    buyerCropSubLabel: "Crop Subcategories",
    multiSelectHint: "Hold Ctrl/Cmd to select multiple",

    walletText1:
      "After registration, a Farm360 Buyer Wallet will be created for you.",
    walletText2: "Payments are released in 3 stages:",
    walletStage1: "30% — Resource Stage",
    walletStage2: "30% — Cultivation Progress",
    walletStage3: "40% — Harvest Completion",
    walletNote:
      "This is a demo wallet — no real banking.",

    submitBtn: "Submit Profile",
    backBtn: "‹ Back",
  },

  bn: {
    pageTitle: "ক্রেতা নিবন্ধন",
    pageSubtitle: "আপনার Farm360 ক্রেতা প্রোফাইল সম্পূর্ণ করতে তথ্য দিন।",
    basicTitle: "মৌলিক বিবরণ",
    businessTitle: "ব্যবসার বিবরণ",
    cropsTitle: "ফসল",
    walletTitle: "ক্রেতা ওয়ালেট ও এসক্রো (স্বয়ংক্রিয়)",

    fullNameLabel: "পূর্ণ নাম",
    aadharLabel: "আধার নম্বর",
    aadharPhotoLabel: "আধারের ছবি",
    aadharPhotoHint: "পরিষ্কার আধারের ছবি আপলোড করুন (ঐচ্ছিক)",
    verifyBtnText: "যাচাই",

    districtLabel: "জেলা",
    blockLabel: "ব্লক",
    cityLabel: "শহর / টাউন",
    villageLabel: "গ্রাম / এলাকা",
    pinLabel: "পিন কোড",

    businessNameLabel: "ব্যবসার নাম",
    businessTypeLabel: "ব্যবসার ধরন",
    businessScaleLabel: "ব্যবসার পরিধি",
    govtApprovalLabel: "সরকারি অনুমোদন",
    payTaxLabel: "কর প্রদান করে",
    gstLabel: "জিএসটি নিবন্ধিত",
    licenceLabel: "লাইসেন্স আছে",
    businessAgeLabel: "ব্যবসার সময়কাল",
    warehouseNameLabel: "গুদামের নাম",
    warehouseLocationLabel: "গুদামের অবস্থান",
    annualPurchaseLabel: "বার্ষিক ক্রয়",

    buyerCropsLabel: "ফসল",
    buyerCropSubLabel: "ফসলের উপবিভাগ",
    multiSelectHint: "Ctrl/Cmd ধরে একাধিক নির্বাচন করুন",

    walletText1: "নিবন্ধনের পর একটি ক্রেতা ওয়ালেট তৈরি হবে।",
    walletText2: "টাকা ৩ ধাপে ছাড় হবে:",
    walletStage1: "৩০% — রিসোর্স",
    walletStage2: "৩০% — অগ্রগতি",
    walletStage3: "৪০% — ফসল কাটা",
    walletNote: "এটি শুধুমাত্র ডেমো উদ্দেশ্যে।",

    submitBtn: "প্রোফাইল জমা দিন",
    backBtn: "‹ ফিরে যান",
  },
};

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  loadDistricts();
  loadCrops();
  attachEvents();
});

/* ============================================================
   THEME (UNCHANGED)
============================================================ */
function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  currentTheme = theme;
}

function toggleTheme() {
  applyTheme(currentTheme === "light" ? "dark" : "light");
}

/* ============================================================
   LANGUAGE (UNCHANGED)
============================================================ */
function applyLanguage(lang) {
  currentLanguage = lang;
  document.body.classList.toggle("lang-bn", lang === "bn");

  const t = translations[lang];
  document.querySelectorAll("[data-text]").forEach((el) => {
    let key = el.dataset.text;
    if (t[key]) el.textContent = t[key];
  });

  document.getElementById("langToggle").textContent =
    lang === "en" ? "বাংলা" : "English";
}

function toggleLanguage() {
  applyLanguage(currentLanguage === "en" ? "bn" : "en");
}

/* ============================================================
   DISTRICT → BLOCK → CITY  (BACKEND)
============================================================ */
async function loadDistricts() {
  const sel = document.getElementById("district");
  sel.innerHTML = `<option value="">Select district</option>`;

  const res = await fetch("http://localhost:8080/master/districts");
  const data = await res.json();

  data.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    sel.appendChild(opt);
  });
}

async function updateBlocks() {
  const districtId = document.getElementById("district").value;
  const sel = document.getElementById("block");
  sel.innerHTML = `<option value="">Select block</option>`;
  sel.disabled = true;

  if (!districtId) return;

  const res = await fetch(`http://localhost:8080/master/districts/${districtId}/blocks`);
  const data = await res.json();

  data.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = b.name;
    sel.appendChild(opt);
  });

  sel.disabled = false;
}

async function updateCities() {
  const blockId = document.getElementById("block").value;
  const sel = document.getElementById("city");
  sel.innerHTML = `<option value="">Select city</option>`;
  sel.disabled = true;

  if (!blockId) return;

  const res = await fetch(`http://localhost:8080/master/blocks/${blockId}/cities`);
  const data = await res.json();

  data.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });

  sel.disabled = false;
}

/* ============================================================
   CROPS + SUBCATEGORIES (BACKEND)
============================================================ */
async function loadCrops() {
  const cont = document.getElementById("buyerCropsContainer");
  cont.innerHTML = "";

  const res = await fetch("http://localhost:8080/master/crops");
  const crops = await res.json();

  crops.forEach((c) => {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = c.id;
    input.addEventListener("change", onBuyerCropsChange);

    label.appendChild(input);
    label.appendChild(document.createTextNode(c.name));

    cont.appendChild(label);
  });
}

async function onBuyerCropsChange() {
  selectedBuyerCrops = Array.from(
    document.querySelectorAll("#buyerCropsContainer input:checked")
  ).map((el) => parseInt(el.value));

  updateSubcategories();
}

async function updateSubcategories() {
  const sel = document.getElementById("buyerCropSub");
  sel.innerHTML = "";
  sel.disabled = true;

  if (selectedBuyerCrops.length === 0) return;

  const collected = new Map();

  for (const cropId of selectedBuyerCrops) {
    const res = await fetch(
      `http://localhost:8080/master/crops/${cropId}/subcategories`
    );
    const subs = await res.json();
    subs.forEach((s) => collected.set(s.id, s));
  }

  Array.from(collected.values()).forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    sel.appendChild(opt);
  });

  sel.disabled = false;
}

/* ============================================================
   AADHAAR IMAGE → BASE64
============================================================ */
function onAadhaarPhoto(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("aadharPreview");

  if (!file) {
    aadhaarBase64 = null;
    preview.classList.add("hidden");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    aadhaarBase64 = ev.target.result;
    preview.src = aadhaarBase64;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   VALIDATION
============================================================ */
function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

function validateForm() {
  clearErrors();
  let ok = true;

  const fullName = document.getElementById("fullName").value.trim();
  const district = document.getElementById("district").value;
  const block = document.getElementById("block").value;

  if (!fullName) {
    document.getElementById("fullNameErr").textContent =
      currentLanguage === "en" ? "Enter full name." : "পূর্ণ নাম লিখুন।";
    ok = false;
  }

  if (!district) {
    document.getElementById("districtErr").textContent =
      currentLanguage === "en" ? "Select district." : "জেলা নির্বাচন করুন।";
    ok = false;
  }

  if (!block) {
    document.getElementById("blockErr").textContent =
      currentLanguage === "en" ? "Select block." : "ব্লক নির্বাচন করুন।";
    ok = false;
  }

  return ok;
}

/* ============================================================
   SUBMIT FORM → BACKEND
============================================================ */
async function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in");
    return;
  }

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

    paysTax: document.getElementById("payTax").checked,
    gstRegistered: document.getElementById("gstRegistered").checked,
    hasLicence: document.getElementById("licence").checked,

    businessAge: document.getElementById("businessAge").value,
    warehouseName: document.getElementById("wareName").value.trim(),
    warehouseLocation: document.getElementById("wareLocation").value.trim(),

    annualPurchase: document.getElementById("annualPurchase").value,

    cropIds: selectedBuyerCrops,
    subcategoryIds: Array.from(
      document.getElementById("buyerCropSub").selectedOptions
    ).map((o) => parseInt(o.value)),
  };

  const res = await fetch(
    `http://localhost:8080/buyer/register/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    alert("Registration failed");
    return;
  }

  const msg = document.getElementById("formMsg");
  msg.textContent =
    currentLanguage === "en"
      ? "Buyer profile saved successfully!"
      : "ক্রেতা প্রোফাইল সফলভাবে সেভ হয়েছে!";
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ============================================================
   EVENTS
============================================================ */
function attachEvents() {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("langToggle").addEventListener("click", toggleLanguage);

  document.getElementById("district").addEventListener("change", updateBlocks);
  document.getElementById("block").addEventListener("change", updateCities);

  document
    .getElementById("buyerCropsContainer")
    .addEventListener("change", onBuyerCropsChange);

  document
    .getElementById("aadharPhoto")
    .addEventListener("change", onAadhaarPhoto);

  document
    .getElementById("buyerForm")
    .addEventListener("submit", handleSubmit);
}
