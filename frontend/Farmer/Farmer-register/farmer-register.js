// =========================
// GLOBAL STATE
// =========================
let currentLanguage = "en";
let currentTheme = "light";
let selectedCrops = []; // now will store CROP IDs from backend

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
// DISTRICTS & BLOCKS
// =========================
async function populateDistricts() {
  const districtSelect = document.getElementById("district");
  if (!districtSelect) return;

  districtSelect.innerHTML = `<option value="">Select district</option>`;

  try {
    const res = await fetch("http://localhost:8080/master/districts");
    const districts = await res.json();

    districts.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      districtSelect.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
  }
}

async function updateBlocks() {
  const districtId = document.getElementById("district").value;
  const blockSelect = document.getElementById("block");

  blockSelect.innerHTML = `<option value="">Select block</option>`;
  blockSelect.disabled = true;

  if (!districtId) return;

  try {
    const res = await fetch(`http://localhost:8080/master/districts/${districtId}/blocks`);
    const blocks = await res.json();

    blocks.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = b.name;
      blockSelect.appendChild(opt);
    });
    blockSelect.disabled = false;
  } catch (e) {
    console.error(e);
  }
}

// =========================
// CROPS
// =========================
async function populateCrops() {
  const container = document.getElementById("cropsContainer");
  if (!container) return;

  container.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8080/master/crops");
    const crops = await res.json();

    crops
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(crop => {
        const wrap = document.createElement("div");
        wrap.className = "multi-select-item";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = crop.id;
        cb.id = `crop_${crop.id}`;
        cb.addEventListener("change", handleCropChange);

        const label = document.createElement("label");
        label.setAttribute("for", cb.id);
        label.textContent = crop.name;

        wrap.appendChild(cb);
        wrap.appendChild(label);
        container.appendChild(wrap);
      });
  } catch (e) {
    console.error(e);
  }
}

function handleCropChange() {
  selectedCrops = [];
  document
    .querySelectorAll("#cropsContainer input[type='checkbox']:checked")
    .forEach(cb => selectedCrops.push(parseInt(cb.value)));

  renderSelectedCrops();
  updateSubcategories();
}

function renderSelectedCrops() {
  const wrap = document.getElementById("selectedCrops");
  wrap.innerHTML = "";

  selectedCrops.forEach(cropId => {
    const labelEl = document.querySelector(`label[for='crop_${cropId}']`);
    const cropLabel = labelEl ? labelEl.textContent : cropId;

    const chip = document.createElement("div");
    chip.className = "tag-chip";
    chip.innerHTML = `
      <span>${cropLabel}</span>
      <button type="button" aria-label="Remove">×</button>
    `;
    chip.querySelector("button").addEventListener("click", () => {
      const cb = document.getElementById(`crop_${cropId}`);
      if (cb) cb.checked = false;
      handleCropChange();
    });
    wrap.appendChild(chip);
  });
}

// =========================
// SUBCATEGORIES
// =========================
async function updateSubcategories() {
  const select = document.getElementById("cropSubcategory");
  select.innerHTML = "";
  select.disabled = selectedCrops.length === 0;

  if (selectedCrops.length === 0) return;

  const allSubsMap = new Map();

  try {
    for (const cropId of selectedCrops) {
      const res = await fetch(`http://localhost:8080/master/crops/${cropId}/subcategories`);
      const subs = await res.json();

      subs.forEach(sub => {
        if (!allSubsMap.has(sub.id)) {
          allSubsMap.set(sub.id, sub);
        }
      });
    }

    Array.from(allSubsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub.id;
        opt.textContent = sub.name;
        select.appendChild(opt);
      });
  } catch (e) {
    console.error(e);
  }
}

// =========================
// PHOTO PREVIEW
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
    alert(
      currentLanguage === "en"
        ? "Please upload an image file."
        : "অনুগ্রহ করে একটি ইমেজ ফাইল আপলোড করুন।"
    );
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
// VALIDATION
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
    showError("nameErr", currentLanguage === "en" ? "Please enter farmer name." : "কৃষকের নাম লিখুন।");
    ok = false;
  }
  if (!district) {
    showError("districtErr", currentLanguage === "en" ? "Please select district." : "জেলা নির্বাচন করুন।");
    ok = false;
  }
  if (!block) {
    showError("blockErr", currentLanguage === "en" ? "Please select block." : "ব্লক নির্বাচন করুন।");
    ok = false;
  }
  if (!village) {
    showError("villageErr", currentLanguage === "en" ? "Please enter village." : "গ্রামের নাম লিখুন।");
    ok = false;
  }
  if (!/^\d{6}$/.test(pin)) {
    showError("pinErr", currentLanguage === "en" ? "Enter a valid 6-digit PIN." : "সঠিক ৬-অঙ্কের পিন লিখুন।");
    ok = false;
  }
  if (!(landSize > 0)) {
    showError("landSizeErr", currentLanguage === "en" ? "Enter valid land size." : "বৈধ জমির আকার দিন।");
    ok = false;
  }
  if (!cropping) {
    showError("croppingErr", currentLanguage === "en" ? "Select cropping pattern." : "ফসল কাটার ধরন বেছে নিন।");
    ok = false;
  }
  if (selectedCrops.length === 0) {
    showError("cropsErr", currentLanguage === "en" ? "Select at least one crop." : "কমপক্ষে একটি ফসল নির্বাচন করুন।");
    ok = false;
  }
  if (subcategories.length === 0) {
    showError("subcategoryErr", currentLanguage === "en" ? "Select at least one subcategory." : "কমপক্ষে একটি উপবিভাগ নির্বাচন করুন।");
    ok = false;
  }

  return ok;
}

// =========================
// SUBMIT (UPDATED!)
// =========================
async function handleSubmit() {
  if (!validateForm()) return;

  // Build payload WITHOUT landPhoto
  const payload = {
    farmerName: document.getElementById("farmerName").value.trim(),
    districtId: parseInt(document.getElementById("district").value),
    blockId: parseInt(document.getElementById("block").value),
    village: document.getElementById("village").value.trim(),
    pinCode: document.getElementById("pin").value.trim(),
    landSize: parseFloat(document.getElementById("landSize").value),
    croppingPattern: document.getElementById("croppingPattern").value,
    cropIds: selectedCrops,
    subCategoryIds: Array.from(
      document.getElementById("cropSubcategory").selectedOptions
    ).map(o => parseInt(o.value))
  };

  // Create multipart form-data
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );

  const photoInput = document.getElementById("landPhoto");
  if (photoInput.files[0]) {
    formData.append("landPhoto", photoInput.files[0]);
  }

  // User ID from storage
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert(
      currentLanguage === "en"
        ? "User not logged in. Set userId in localStorage."
        : "ইউজার লগইন নেই। localStorage এ userId সেট করুন।"
    );
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8080/farmer/register/${userId}`,
      {
        method: "POST",
        body: formData
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      console.error(txt);
      alert(currentLanguage === "en" ? "Registration failed." : "নিবন্ধন ব্যর্থ হয়েছে।");
      return;
    }

    const data = await res.json();
    console.log("Server Response:", data);

    const msg = document.getElementById("successMsg");
    msg.textContent =
      currentLanguage === "en"
        ? "Farmer profile saved successfully!"
        : "কৃষক প্রোফাইল সফলভাবে সেভ হয়েছে!";

    msg.scrollIntoView({ behavior: "smooth", block: "center" });

  } catch (e) {
    console.error(e);
    alert(currentLanguage === "en" ? "Something went wrong." : "কিছু সমস্যা হয়েছে।");
  }
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
  if (submitBtn) submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSubmit();
  });
}
