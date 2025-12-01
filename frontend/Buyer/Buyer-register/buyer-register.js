// ========= GLOBAL =========
let currentLanguage = "en";
let currentTheme = "light";
let selectedBuyerCrops = [];

// ========= TRANSLATIONS =========
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
    multiSelectHint: "Hold Ctrl/Cmd to select multiple — Ctrl/Cmd ধরে একাধিক নির্বাচন করুন",

    walletText1: "After registration, a Farm360 Buyer Wallet will be created for you. You can add funds into this wallet to pay farmers securely.",
    walletText2: "Payments are released to farmers in 3 stages under the demo 30–30–40 escrow system:",
    walletStage1: "30% — Resource Stage (seed, fertilizer, etc.)",
    walletStage2: "30% — Cultivation Progress",
    walletStage3: "40% — Harvest Completion & delivery",
    walletNote: "This is a simulated wallet for project/demo purpose only — no real banking.",

    submitBtn: "Submit Profile",

    backBtn: "‹ Back",

  },
  bn: {
    pageTitle: "ক্রেতা নিবন্ধন",
    pageSubtitle: "আপনার Farm360 ক্রেতা প্রোফাইল সম্পূর্ণ করতে তথ্য দিন।",
    basicTitle: "মৌলিক বিবরণ",
    businessTitle: "ব্যবসার বিবরণ",
    cropsTitle: "যে ফসলগুলো আপনি ক্রয়/বিক্রয় করেন",
    walletTitle: "ক্রেতা ওয়ালেট ও এসক্রো (স্বয়ংক্রিয়ভাবে তৈরি)",

    fullNameLabel: "পূর্ণ নাম",
    aadharLabel: "আধার নম্বর",
    aadharPhotoLabel: "আধারের ছবি",
    aadharPhotoHint: "পরিষ্কার আধারের ছবি আপলোড করুন (ঐচ্ছিক)",
    verifyBtnText: "যাচাই",

    districtLabel: "জেলা (পশ্চিমবঙ্গ)",
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
    annualPurchaseLabel: "বার্ষিক ক্রয় (আনুমানিক)",


    payTaxLabel: "কর প্রদান করে",
    gstLabel: "জিএসটি নিবন্ধিত",
    licenceLabel: "লাইসেন্স আছে",


    buyerCropsLabel: "ফসল",
    buyerCropSubLabel: "ফসলের উপবিভাগ",
    multiSelectHint: "একাধিক নির্বাচন করতে Ctrl/Cmd ধরে রাখুন",

    walletText1: "নিবন্ধনের পর আপনার জন্য একটি Farm360 ক্রেতা ওয়ালেট তৈরি হবে। এই ওয়ালেটে টাকা যোগ করে নিরাপদভাবে কৃষকদের পরিশোধ করতে পারবেন।",
    walletText2: "ডেমো ৩০–৩০–৪০ এসক্রো সিস্টেমে কৃষকদের টাকা ৩ ধাপে ছাড় হবে:",
    walletStage1: "৩০% — রিসোর্স পর্যায় (বীজ, সার ইত্যাদি)",
    walletStage2: "৩০% — চাষাবাদের অগ্রগতি",
    walletStage3: "৪০% — ফসল কাটা ও ডেলিভারি সম্পন্ন",
    walletNote: "এটি শুধুমাত্র প্রজেক্ট/ডেমো উদ্দেশ্যে তৈরি সিমুলেটেড ওয়ালেট — কোনো বাস্তব ব্যাংকিং নয়।",

    submitBtn: "প্রোফাইল জমা দিন",
    backBtn: "‹ ফিরে যান",

  }
};

// ========= DISTRICT DATA =========
const districtBlockData = {
  Alipurduar: ["Alipurduar I", "Alipurduar II"],
  Bankura: ["Bankura I", "Bankura II", "Bishnupur", "Khatra", "Santiniketan"],
  Bardhaman: ["Bardhaman I", "Bardhaman II", "Asansol", "Durgapur"],
  Darjeeling: ["Darjeeling", "Kalimpong", "Kurseong"],
  "East Medinipur": ["Egra", "Haldia", "Medinipur", "Ramnagar", "Tamluk"],
  Hooghly: ["Arambagh", "Dhaniakhali", "Goghat", "Polba", "Serampore"],
  Howrah: ["Amta", "Howrah", "Jagatballavpur", "Panchla", "Shyampur"],
  Jalpaiguri: ["Jalpaiguri", "Maynaguri", "Nagrakata", "Rajganj"],
  Jhargram: ["Goaltore", "Jhargram", "Nayagram", "Porahat"],
  Kolkata: ["Alipore", "Ballygunge", "Shyam Bazaar"],
  Malda: ["Habibpur", "Kaliachak", "Malda", "Manigram"],
  Murshidabad: ["Berhampur", "Burwan", "Khagra", "Lalgola", "Raghunathganj"],
  Nadia: ["Chakdah", "Kaliganj", "Krishnanagar", "Nabadwip"],
  "North 24 Parganas": ["Barasat", "Basirhat", "Bidhannagar", "Rajarhat"],
  "North Dinajpur": ["Balurghat", "Gangarampur"],
  "Purba Bardhaman": ["Jamalpur", "Kalna", "Katwa", "Purba Bardhaman"],
  Purulia: ["Baghmundi", "Purulia", "Raghunathpur"],
  "South 24 Parganas": ["Baruipur", "Canning", "Sundarban"],
  "South Dinajpur": ["Gangarampur", "Kumarganj", "Tapan"],
  "West Medinipur": ["Debra", "Kharagpur", "Medinipur", "Moyna"],
  Birbhum: ["Bolpur", "Rampurhat", "Suri"]
};

// ========= CROPS DATA =========
// ========= CROPS DATA (Bilingual clean) =========
const cropsData = {
  en: {
    Rice: ["Swarna", "IR-64", "Sona Masuri", "Basmati"],
    Wheat: ["HD-2733", "PBW-343", "UP-2338"],
    Potato: ["Kufri Pukhraj", "Kufri Himalini", "Local Red"],
    Pulses: ["Masur", "Moong", "Arhar", "Gram"],
    Vegetables: ["Tomato", "Cabbage", "Brinjal"],
    Jute: ["White Jute", "Tossa Jute", "Red Jute"]
  },
  bn: {
    ধান: ["স্বর্ণা", "আইআর-৬৪", "সোনা মাসুরি", "বাসমতি"],
    গম: ["এইচডি-২৭৩৩", "পিবিডাবলিউ-৩৪৩", "ইউপি-২৩৩৮"],
    আলু: ["কুফরি পুখরাজ", "কুফরি হিমালিনী", "লাল আলু"],
    ডাল: ["মাসুর", "মুং", "অড়হর", "ছোলা"],
    সবজি: ["টমেটো", "বাঁধাকপি", "বেগুন"],
    পাট: ["সাদা পাট", "টোসা পাট", "লাল পাট"]
  }
};


// ========= INIT =========
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  populateDistricts();
  populateBuyerCrops();
  attachEvents();
});

// ========= THEME =========
function applyTheme(theme) {
  const body = document.body;
  if (theme === "dark") body.classList.add("theme-dark");
  else body.classList.remove("theme-dark");
  currentTheme = theme;
}

function toggleTheme() {
  applyTheme(currentTheme === "light" ? "dark" : "light");
}

// ========= LANGUAGE =========
function applyLanguage(lang) {
  const body = document.body;
  body.classList.toggle("lang-bn", lang === "bn");
  currentLanguage = lang;

  const t = translations[lang];
  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.getAttribute("data-text");
    if (t[key]) el.textContent = t[key];
  });

  const langBtn = document.getElementById("langToggle");
  if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
}

function toggleLanguage() {
  applyLanguage(currentLanguage === "en" ? "bn" : "en");
}

// ========= DISTRICTS =========
function populateDistricts() {
  const select = document.getElementById("district");
  Object.keys(districtBlockData)
    .sort()
    .forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
}

function updateBlocks() {
  const district = document.getElementById("district").value;
  const blockSel = document.getElementById("block");
  blockSel.innerHTML =
    '<option value="">Select block — ব্লক নির্বাচন করুন</option>';
  blockSel.disabled = true;
  if (!district || !districtBlockData[district]) return;
  districtBlockData[district].forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    blockSel.appendChild(opt);
  });
  blockSel.disabled = false;
}

// ========= CROPS =========
function populateBuyerCrops() {
  const cont = document.getElementById("buyerCropsContainer");
  cont.innerHTML = "";

  const langCrops = cropsData[currentLanguage];

  Object.keys(langCrops).forEach((crop) => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = crop;

    label.appendChild(cb);
    label.appendChild(document.createTextNode(crop));
    cont.appendChild(label);
  });
}

function onBuyerCropsChange() {
  selectedBuyerCrops = Array.from(
    document.querySelectorAll("#buyerCropsContainer input[type='checkbox']:checked")
  ).map(cb => cb.value);

  updateBuyerSubcategories();
}

function updateBuyerSubcategories() {
  const subSel = document.getElementById("buyerCropSub");
  subSel.innerHTML = "";

  if (selectedBuyerCrops.length === 0) {
    subSel.disabled = true;
    return;
  }

  const langCrops = cropsData[currentLanguage];
  const set = new Set();

  selectedBuyerCrops.forEach((c) => {
    (langCrops[c] || []).forEach((sub) => set.add(sub));
  });

  Array.from(set).forEach((sub) => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subSel.appendChild(opt);
  });

  subSel.disabled = false;
}


// ========= AADHAAR =========
function onAadhaarPhoto(e) {
  const file = e.target.files && e.target.files[0];
  const preview = document.getElementById("aadharPreview");
  const err = document.getElementById("aadharPhotoErr");
  err.textContent = "";

  if (!file) {
    preview.src = "";
    preview.classList.add("hidden");
    return;
  }
  if (!file.type.startsWith("image/")) {
    err.textContent =
      currentLanguage === "en"
        ? "Please upload an image file."
        : "অনুগ্রহ করে একটি ইমেজ ফাইল আপলোড করুন।";
    e.target.value = "";
    preview.src = "";
    preview.classList.add("hidden");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    err.textContent =
      currentLanguage === "en"
        ? "Image must be 5MB or smaller."
        : "ইমেজ সাইজ ৫MB বা তার কম হতে হবে।";
    e.target.value = "";
    preview.src = "";
    preview.classList.add("hidden");
    return;
  }
  const r = new FileReader();
  r.onload = (ev) => {
    preview.src = ev.target.result;
    preview.classList.remove("hidden");
  };
  r.readAsDataURL(file);
}

function verifyAadhaar() {
  const a = (document.getElementById("aadhar").value || "").trim();
  const status = document.getElementById("aadharStatus");
  if (/^\d{12}$/.test(a)) {
    status.textContent =
      currentLanguage === "en"
        ? "Verified ✓"
        : "যাচাই হয়েছে ✓";
    status.style.color = "#16a34a";
  } else {
    status.textContent =
      currentLanguage === "en"
        ? "Invalid Aadhaar (12 digits)."
        : "ভুল আধার নম্বর (১২ সংখ্যা দিন)।";
    status.style.color = "#dc2626";
  }
}

// ========= VALIDATION & SUBMIT =========
function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

function validateForm() {
  clearErrors();
  let ok = true;

  const fullName = document.getElementById("fullName").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const district = document.getElementById("district").value;
  const block = document.getElementById("block").value;
  const subs = Array.from(
    document.getElementById("buyerCropSub").selectedOptions
  ).map((o) => o.value);

  if (!fullName) {
    document.getElementById("fullNameErr").textContent =
      currentLanguage === "en"
        ? "Enter full name."
        : "পূর্ণ নাম লিখুন।";
    ok = false;
  }

  if (pin && !/^\d{6}$/.test(pin)) {
    document.getElementById("pinErr").textContent =
      currentLanguage === "en"
        ? "Enter valid 6-digit PIN."
        : "সঠিক ৬-অঙ্কের পিন লিখুন।";
    ok = false;
  }

  if (!district) {
    document.getElementById("districtErr").textContent =
      currentLanguage === "en"
        ? "Select district."
        : "জেলা নির্বাচন করুন।";
    ok = false;
  }

  if (!block) {
    document.getElementById("blockErr").textContent =
      currentLanguage === "en"
        ? "Select block."
        : "ব্লক নির্বাচন করুন।";
    ok = false;
  }

  if (selectedBuyerCrops.length === 0) {
    document.getElementById("buyerCropsErr").textContent =
      currentLanguage === "en"
        ? "Select at least one crop."
        : "কমপক্ষে একটি ফসল নির্বাচন করুন।";
    ok = false;
  } else if (subs.length === 0) {
    document.getElementById("buyerCropsErr").textContent =
      currentLanguage === "en"
        ? "Select at least one crop subcategory."
        : "কমপক্ষে একটি ফসলের উপবিভাগ নির্বাচন করুন।";
    ok = false;
  }

  return ok;
}

function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const msg = document.getElementById("formMsg");
  msg.textContent =
    currentLanguage === "en"
      ? "Buyer profile saved successfully! (Demo)"
      : "ক্রেতা প্রোফাইল সফলভাবে সেভ হয়েছে! (ডেমো)";
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ========= EVENTS =========
function attachEvents() {
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);

  document
    .getElementById("langToggle")
    ?.addEventListener("click", toggleLanguage);

  document
    .getElementById("district")
    ?.addEventListener("change", updateBlocks);

  document
    .getElementById("buyerCropsContainer")
    ?.addEventListener("change", onBuyerCropsChange);

  document
    .getElementById("aadharPhoto")
    ?.addEventListener("change", onAadhaarPhoto);

  document
    .getElementById("verifyAadhaarBtn")
    ?.addEventListener("click", verifyAadhaar);

  document
    .getElementById("buyerForm")
    ?.addEventListener("submit", handleSubmit);
}
