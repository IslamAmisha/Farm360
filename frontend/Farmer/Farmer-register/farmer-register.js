// =========================
// GLOBAL STATE
// =========================
let currentLanguage = "en";
let currentTheme = "light";
let selectedCrops = [];

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
    districtLabel: "District (West Bengal)",
    blockLabel: "Block",
    villageLabel: "Village",
    pinLabel: "PIN Code",
    landSizeLabel: "Land Size (in acres)",
    croppingLabel: "Cropping Pattern",
    subcategoryLabel: "Crop Subcategories",
    submitBtn: "Submit Profile",
    backBtn: "‹ Back",
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
    districtLabel: "জেলা (পশ্চিমবঙ্গ)",
    blockLabel: "ব্লক",
    villageLabel: "গ্রাম",
    pinLabel: "পিন কোড",
    landSizeLabel: "জমির আকার (একর)",
    croppingLabel: "ফসল কাটার ধরন",
    subcategoryLabel: "ফসলের উপবিভাগ",
    submitBtn: "প্রোফাইল জমা দিন",
    backBtn: "‹ ফিরে যান",
  }
};

// =========================
// DISTRICT → BLOCK DATA
// =========================
const districtBlockData = {
  "Alipurduar": ["Alipurduar I", "Alipurduar II"],
  "Bankura": ["Bankura I", "Bankura II", "Bishnupur", "Khatra"],
  "Bardhaman": ["Bardhaman I", "Bardhaman II", "Asansol", "Durgapur"],
  "Darjeeling": ["Darjeeling", "Kalimpong", "Kurseong"],
  "East Medinipur": ["Egra", "Haldia", "Tamluk"],
  "Hooghly": ["Arambagh", "Chandannagar", "Serampore"],
  "Howrah": ["Howrah", "Uluberia", "Shyampur"],
  "Jalpaiguri": ["Jalpaiguri", "Maynaguri", "Nagrakata"],
  "Jhargram": ["Jhargram", "Nayagram"],
  "Kolkata": ["Alipore", "Ballygunge", "Shyambazar"],
  "Malda": ["Malda", "Kaliachak"],
  "Murshidabad": ["Berhampur", "Lalgola"],
  "Nadia": ["Krishnanagar", "Chakdaha", "Nabadwip"],
  "North 24 Parganas": ["Barasat", "Basirhat", "Bidhannagar"],
  "South 24 Parganas": ["Baruipur", "Canning", "Diamond Harbour"],
  "Purba Bardhaman": ["Kalna", "Katwa"],
  "Paschim Medinipur": ["Kharagpur", "Medinipur"],
  "Birbhum": ["Bolpur", "Suri", "Rampurhat"]
};

// =========================
// CROPS → SUBCATEGORIES
// =========================
const cropsData = {
  "Rice / ধান": [
    "Swarna — স্বর্ণা",
    "IR-64 — আইআর-৬৪",
    "Basmati — বাসমতী",
    "Hyb-Local — হাইব্রিড স্থানীয়"
  ],
  "Wheat / গম": [
    "HD-2733 — এইচডি-২৭৩৩",
    "Sonalika — সোনালিকা"
  ],
  "Potato / আলু": [
    "Kufri Pukhraj — কুফরি পুখরাজ",
    "Local Red — স্থানীয় লাল"
  ],
  "Jute / পাট": [
    "Tossa — টোসা পাট",
    "White Jute — সাদা পাট"
  ],
  "Vegetables / সবজি": [
    "Tomato — টমেটো",
    "Brinjal — বেগুন",
    "Cauliflower — ফুলকপি",
    "Cabbage — বাঁধাকপি"
  ],
  "Pulses / ডাল": [
    "Masur — মসুর",
    "Moong — মুগ",
    "Gram — ছোলা"
  ]
};

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
  const body = document.body;
  if (theme === "dark") {
    body.classList.add("theme-dark");
  } else {
    body.classList.remove("theme-dark");
  }
  currentTheme = theme;
}

function toggleTheme() {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
}

// =========================
// LANGUAGE
// =========================
function applyLanguage(lang) {
  const body = document.body;
  body.classList.toggle("lang-bn", lang === "bn");

  currentLanguage = lang;

  const t = translations[lang];

  document.querySelectorAll("[data-text]").forEach(el => {
    const key = el.getAttribute("data-text");
    if (t[key]) el.textContent = t[key];
  });

  // Update button label
  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.textContent = lang === "en" ? "বাংলা" : "English";
  }
}

function toggleLanguage() {
  const newLang = currentLanguage === "en" ? "bn" : "en";
  applyLanguage(newLang);
}

// =========================
// POPULATE SELECTS
// =========================
function populateDistricts() {
  const districtSelect = document.getElementById("district");
  if (!districtSelect) return;

  districtSelect.innerHTML = `<option value="">Select district</option>`;
  Object.keys(districtBlockData)
    .sort()
    .forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      districtSelect.appendChild(opt);
    });
}

function updateBlocks() {
  const district = document.getElementById("district").value;
  const blockSelect = document.getElementById("block");

  blockSelect.innerHTML = `<option value="">Select block</option>`;
  blockSelect.disabled = true;

  if (!district || !districtBlockData[district]) return;

  districtBlockData[district].forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    blockSelect.appendChild(opt);
  });
  blockSelect.disabled = false;
}

// =========================
// CROPS
// =========================
function populateCrops() {
  const container = document.getElementById("cropsContainer");
  if (!container) return;

  container.innerHTML = "";

  Object.keys(cropsData)
    .sort()
    .forEach(crop => {
      const wrap = document.createElement("div");
      wrap.className = "multi-select-item";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = crop;
      cb.id = `crop_${crop}`;

      cb.addEventListener("change", handleCropChange);

      const label = document.createElement("label");
      label.setAttribute("for", cb.id);
      label.textContent = crop;

      wrap.appendChild(cb);
      wrap.appendChild(label);
      container.appendChild(wrap);
    });
}

function handleCropChange() {
  selectedCrops = [];
  document.querySelectorAll("#cropsContainer input[type='checkbox']:checked")
    .forEach(cb => selectedCrops.push(cb.value));

  renderSelectedCrops();
  updateSubcategories();
}

function renderSelectedCrops() {
  const wrap = document.getElementById("selectedCrops");
  wrap.innerHTML = "";

  selectedCrops.forEach(crop => {
    const chip = document.createElement("div");
    chip.className = "tag-chip";
    chip.innerHTML = `
      <span>${crop}</span>
      <button type="button" aria-label="Remove">×</button>
    `;
    chip.querySelector("button").addEventListener("click", () => {
      const cb = document.getElementById(`crop_${crop}`);
      if (cb) cb.checked = false;
      handleCropChange();
    });
    wrap.appendChild(chip);
  });
}

function updateSubcategories() {
  const select = document.getElementById("cropSubcategory");
  select.innerHTML = "";
  select.disabled = selectedCrops.length === 0;

  if (selectedCrops.length === 0) return;

  const allSubs = new Set();
  selectedCrops.forEach(crop => {
    if (cropsData[crop]) {
      cropsData[crop].forEach(sub => allSubs.add(sub));
    }
  });

  Array.from(allSubs)
    .sort()
    .forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
}

// =========================
// PHOTO
// =========================
function handlePhotoInput(e) {
  const file = e.target.files[0];
  const wrap = document.getElementById("photoPreviewWrap");
  const img = document.getElementById("photoPreview");

  if (!file) {
    wrap.classList.add("hidden");
    img.src = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert(currentLanguage === "en"
      ? "Please upload an image file."
      : "অনুগ্রহ করে একটি ইমেজ ফাইল আপলোড করুন।");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = evt => {
    img.src = evt.target.result;
    wrap.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  const input = document.getElementById("landPhoto");
  const wrap = document.getElementById("photoPreviewWrap");
  const img = document.getElementById("photoPreview");
  input.value = "";
  img.src = "";
  wrap.classList.add("hidden");
}

// =========================
// VALIDATION & SUBMIT
// =========================
function clearErrors() {
  document.querySelectorAll(".error").forEach(el => {
    el.textContent = "";
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function validateForm() {
  clearErrors();
  let ok = true;

  const name = document.getElementById("farmerName").value.trim();
  const district = document.getElementById("district").value;
  const block = document.getElementById("block").value;
  const village = document.getElementById("village").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const landSize = parseFloat(document.getElementById("landSize").value);
  const cropping = document.getElementById("croppingPattern").value;
  const subcategories = Array.from(
    document.getElementById("cropSubcategory").selectedOptions
  ).map(o => o.value);

  if (!name) {
    showError("nameErr",
      currentLanguage === "en"
        ? "Please enter farmer name."
        : "কৃষকের নাম লিখুন।");
    ok = false;
  }

  if (!district) {
    showError("districtErr",
      currentLanguage === "en"
        ? "Please select district."
        : "জেলা নির্বাচন করুন।");
    ok = false;
  }

  if (!block) {
    showError("blockErr",
      currentLanguage === "en"
        ? "Please select block."
        : "ব্লক নির্বাচন করুন।");
    ok = false;
  }

  if (!village) {
    showError("villageErr",
      currentLanguage === "en"
        ? "Please enter village."
        : "গ্রামের নাম লিখুন।");
    ok = false;
  }

  if (!/^\d{6}$/.test(pin)) {
    showError("pinErr",
      currentLanguage === "en"
        ? "Enter a valid 6-digit PIN."
        : "সঠিক ৬-অঙ্কের পিন লিখুন।");
    ok = false;
  }

  if (!(landSize > 0)) {
    showError("landSizeErr",
      currentLanguage === "en"
        ? "Enter valid land size."
        : "বৈধ জমির আকার দিন।");
    ok = false;
  }

  if (!cropping) {
    showError("croppingErr",
      currentLanguage === "en"
        ? "Select cropping pattern."
        : "ফসল কাটার ধরন বেছে নিন।");
    ok = false;
  }

  if (selectedCrops.length === 0) {
    showError("cropsErr",
      currentLanguage === "en"
        ? "Select at least one crop."
        : "কমপক্ষে একটি ফসল নির্বাচন করুন।");
    ok = false;
  }

  if (subcategories.length === 0) {
    showError("subcategoryErr",
      currentLanguage === "en"
        ? "Select at least one subcategory."
        : "কমপক্ষে একটি উপবিভাগ নির্বাচন করুন।");
    ok = false;
  }

  return ok;
}

function handleSubmit() {
  if (!validateForm()) return;

  const msg = document.getElementById("successMsg");
  msg.textContent = currentLanguage === "en"
    ? "Farmer profile saved successfully! (Demo)"
    : "কৃষক প্রোফাইল সফলভাবে সেভ হয়েছে! (ডেমো)";
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
}

// =========================
// EVENTS
// =========================
function attachEvents() {
  const themeToggle = document.getElementById("themeToggle");
  const langToggleBtn = document.getElementById("langToggle");
  const districtSelect = document.getElementById("district");
  const photoInput = document.getElementById("landPhoto");
  const submitBtn = document.getElementById("submitBtn");

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (langToggleBtn) langToggleBtn.addEventListener("click", toggleLanguage);
  if (districtSelect) districtSelect.addEventListener("change", updateBlocks);
  if (photoInput) photoInput.addEventListener("change", handlePhotoInput);
  if (submitBtn) submitBtn.addEventListener("click", handleSubmit);
}