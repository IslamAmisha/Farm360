//global state
let currentLanguage = "en";
let currentTheme = "light";

//translation library
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

//popup
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
  populateDistricts();
  populateCrops();
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

//district&block
async function populateDistricts() {
  try {
    const res = await fetch("http://localhost:8080/master/districts");
    const districts = await res.json();

    const select = document.getElementById("district");
    select.innerHTML = `<option value="">Select district</option>`;

    districts.forEach(d =>
      select.innerHTML += `<option value="${d.id}">${d.name}</option>`
    );
  } catch {
    showPopup("error", "Failed to load districts.");
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
  } catch {
    showPopup("error", "Failed to load blocks.");
  }
}

//crop and its category
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

  } catch {
    showPopup("error", "Failed to load crops.");
  }
}

function getSelectedCrops() {
  return Array.from(
    document.getElementById("cropsSelect").selectedOptions
  ).map(o => parseInt(o.value));
}

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

      subs.forEach(s => !subsMap.has(s.id) && subsMap.set(s.id, s));
    }

    Array.from(subsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(sub => {
        subSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
      });

  } catch {
    showPopup("error", "Failed to load subcategories.");
  }
}

//handle photo
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

//validation
function validateForm() {
  const val = id => document.getElementById(id).value.trim();

  if (!val("farmerName")) return showPopup("error", "Enter farmer name."), false;
  if (!val("district")) return showPopup("error", "Select district."), false;
  if (!val("block")) return showPopup("error", "Select block."), false;
  if (!val("village")) return showPopup("error", "Enter village."), false;
  if (!/^\d{6}$/.test(val("pin"))) return showPopup("error", "Invalid PIN."), false;
  if (!(parseFloat(val("landSize")) > 0)) return showPopup("error", "Invalid land size."), false;
  if (!val("croppingPattern")) return showPopup("error", "Select cropping pattern."), false;
  if (getSelectedCrops().length === 0) return showPopup("error", "Select at least one crop."), false;

  return true;
}

//submit
async function handleSubmit() {
  if (!validateForm()) return;

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
    showPopup("error", "User not logged in.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/farmer/register/${userId}`, {
      method: "POST",
      body: fd
    });

    if (!res.ok) {
      showPopup("error", "Registration failed. Try again.");
      return;
    }

    showPopup("success", "Your Farmer profile has been created!");

  } catch {
    showPopup("error", "Something went wrong.");
  }
}

//event
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
