// -------------------------------------------
// 0) PROTECT PAGE (farmer only)
// -------------------------------------------
(function protectFarmerLandPage() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token || !userId || role !== "farmer") {
    alert("User not found or unauthorized access!");
    localStorage.clear();
    window.location.href = "../../Login/login.html";
  }
})();

(function () {
  const API_BASE = "http://localhost:8080";

  // -----------------------------------------
  // 1) TRANSLATIONS
  // -----------------------------------------
  const tAll = {
    en: {
      brandName: "Farm360",

      navHome: "Home",
      navModules: "Modules",
      navAbout: "About",
      navInsights: "Insights",
      navSupport: "Support",

      landsTitle: "Manage Lands",
      landsSubtitle:
        "Add or update your cultivated lands, cropping pattern, crops and subcategories.",

      landsListTitle: "Existing Lands",
      landsListSubtitle: "Lands already registered under your profile.",
      noLands: "No lands added yet. Click “Add New Land” to create one.",

      formTitleNew: "Add New Land",
      formSubtitleNew:
        "Enter land size, cropping pattern, crops and subcategories.",
      formTitleEdit: "Edit Land",
      formSubtitleEdit:
        "Change land size or crop subcategories. Cropping pattern is fixed.",

      landSizeLabel: "Land Size (acres)",

      patternLabel: "Cropping Pattern",
      patternSelect: "Select pattern",
      patternSingle: "SINGLE (1 crop)",
      patternDouble: "DOUBLE (2 crops)",
      patternTriple: "TRIPLE (3 crops)",
      patternHelp:
        "Cropping pattern is decided when you add the land and cannot be edited later.",

      cropsLabel: "Crops",
      cropsEmpty: "Loading crops...",
      cropsHelp:
        "You can select up to 1, 2 or 3 different crops depending on the chosen pattern.",
      subcategoriesLabel: "Crop Subcategories",
      subcategoriesEmpty: "Select at least one crop to see its subcategories.",
      subcategoriesHelp:
        "Choose one or more specific subcategories (varieties) from the selected crops.",

      btnAddLand: "Add New Land",
      btnEdit: "Edit",
      btnDelete: "Delete",
      btnCancel: "Cancel",
      btnSave: "Save",

      msgPatternRequired: "Please select a cropping pattern.",
      msgSizeRequired: "Please enter a valid land size.",
      msgCropLimit:
        "You can select at most {n} different crops for this pattern.",
      msgNeedCrop: "Please choose at least one crop.",
      msgNeedSubcategories: "Please choose at least one subcategory.",
      msgSaveOk: "Land saved successfully.",
      msgSaveFail:
        "Failed to save. Please check the details and try again.",
      msgDeleteConfirm: "Delete this land? This action cannot be undone.",
      msgDeleteFail: "Failed to delete land. Please try again.",
      msgCannotDeleteLastLand: "At least one land must remain in your profile.",

    },

    bn: {
      brandName: "ফার্ম৩৬০",

      navHome: "হোম",
      navModules: "মডিউল",
      navAbout: "সম্পর্কিত",
      navInsights: "ইনসাইটস",
      navSupport: "সহায়তা",

      landsTitle: "জমি ম্যানেজ করুন",
      landsSubtitle:
        "আপনার চাষ হওয়া জমি, ক্রপ রোটেশন, ফসল ও সাবক্যাটাগরি আপডেট করুন।",

      landsListTitle: "বিদ্যমান জমি",
      landsListSubtitle: "আপনার প্রোফাইলে আগে থেকে যুক্ত জমিগুলো।",
      noLands: "কোনো জমি নেই। “নতুন জমি যোগ করুন” বাটনে ক্লিক করুন।",

      formTitleNew: "নতুন জমি যোগ করুন",
      formSubtitleNew:
        "জমির আকার, ক্রপ রোটেশন, ফসল ও সাবক্যাটাগরি নির্বাচন করুন।",
      formTitleEdit: "জমি আপডেট করুন",
      formSubtitleEdit:
        "জমির আকার বা সাবক্যাটাগরি পরিবর্তন করতে পারেন। ক্রপ রোটেশন বদলানো যাবে না।",

      landSizeLabel: "জমির আকার (একর)",

      patternLabel: "ক্রপিং প্যাটার্ন",
      patternSelect: "প্যাটার্ন নির্বাচন করুন",
      patternSingle: "সিঙ্গেল (১ ফসল)",
      patternDouble: "ডাবল (২ ফসল)",
      patternTriple: "ট্রিপল (৩ ফসল)",
      patternHelp:
        "ক্রপিং প্যাটার্ন জমি যোগ করার সময় ঠিক হয়, পরে বদলানো যাবে না।",

      cropsLabel: "ফসল",
      cropsEmpty: "ফসলের তালিকা লোড হচ্ছে...",
      cropsHelp:
        "নির্বাচিত প্যাটার্ন অনুযায়ী সর্বোচ্চ ১, ২ বা ৩টি ভিন্ন ফসল বেছে নিতে পারবেন।",
      subcategoriesLabel: "ফসলের সাবক্যাটাগরি",
      subcategoriesEmpty:
        "সাবক্যাটাগরি দেখতে আগে কমপক্ষে একটি ফসল নির্বাচন করুন।",
      subcategoriesHelp:
        "নির্বাচিত ফসলের এক বা একাধিক নির্দিষ্ট সাবক্যাটাগরি (জাত) নির্বাচন করুন।",

      btnAddLand: "নতুন জমি যোগ করুন",
      btnEdit: "এডিট",
      btnDelete: "ডিলিট",
      btnCancel: "বাতিল",
      btnSave: "সেভ",

      msgPatternRequired: "ক্রপিং প্যাটার্ন নির্বাচন করুন।",
      msgSizeRequired: "বৈধ জমির আকার লিখুন।",
      msgCropLimit:
        "এই প্যাটার্নে সর্বোচ্চ {n}টি ভিন্ন ফসল নির্বাচন করা যাবে।",
      msgNeedCrop: "কমপক্ষে একটি ফসল নির্বাচন করুন।",
      msgNeedSubcategories: "কমপক্ষে একটি সাবক্যাটাগরি নির্বাচন করুন।",
      msgSaveOk: "জমি সফলভাবে সেভ হয়েছে।",
      msgSaveFail: "সেভ করতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
      msgDeleteConfirm: "এই জমি ডিলিট করবেন? এটি ফিরিয়ে আনা যাবে না।",
      msgDeleteFail: "জমি ডিলিট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      msgCannotDeleteLastLand: "প্রোফাইলে অন্তত একটি জমি থাকা বাধ্যতামূলক।",

    },
  };

  let lang = window.currentLanguage || "en";
  let theme = window.currentTheme || "light";

  function applyLanguage(newLang) {
    lang = newLang;
    window.currentLanguage = newLang;
    const t = tAll[lang];

    document.body.classList.toggle("lang-bn", lang === "bn");

    document.querySelectorAll("[data-text]").forEach((el) => {
      const key = el.getAttribute("data-text");
      if (t[key]) el.textContent = t[key];
    });

    const langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
  }

  function applyTheme(newTheme) {
    theme = newTheme;
    window.currentTheme = newTheme;
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme === "light");
  }

  // -----------------------------------------
  // 2) DOM REFS
  // -----------------------------------------
  const landsListEl = document.getElementById("landsList");
  const landsEmptyEl = document.getElementById("landsEmpty");

  const formTitleEl = document.getElementById("formTitle");
  const formSubtitleEl = document.getElementById("formSubtitle");
  const landForm = document.getElementById("landForm");
  const landSizeInput = document.getElementById("landSize");
  const patternSelect = document.getElementById("croppingPattern");
  const cropsChecklist = document.getElementById("cropsChecklist");
  const subsChecklist = document.getElementById("subcategoriesChecklist");
  const btnNewLand = document.getElementById("btnNewLand");
  const btnCancelForm = document.getElementById("btnCancelForm");

  // -----------------------------------------
  // 3) STATE
  // -----------------------------------------
  let farmerId = null;
  let lands = []; // { landId, size, croppingPattern, crops[] } (from profile)
  let cropsMaster = []; // [{id, name}]
  const subsByCropId = {}; // cropId -> [{id,name}]
  let formMode = "NEW"; // "NEW" or "EDIT"
  let editingLandId = null;

  function t() {
    return tAll[lang];
  }

  // -----------------------------------------
  // 4) LOAD DATA
  // -----------------------------------------
  async function loadProfileAndLands() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/profile/farmer`, {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) {
      console.error("Failed to load farmer profile");
      return;
    }

    const data = await res.json();
    farmerId = data.farmerId;
    lands = (data.lands || []).map((l) => ({
      landId: l.landId,
      size: l.size,
      croppingPattern: l.croppingPattern, // SINGLE / DOUBLE / TRIPLE
      crops: l.crops || [], // these are subcategory names
    }));

    renderLands();
  }

  async function loadMasterCrops() {
    const res = await fetch(`${API_BASE}/master/crops`);
    if (!res.ok) {
      console.error("Failed to load crops");
      return;
    }
    cropsMaster = await res.json(); // [{id,name}]
    renderCropsChecklist();
  }

  async function loadSubcategoriesForCrop(cropId) {
    if (subsByCropId[cropId]) return subsByCropId[cropId];

    const res = await fetch(`${API_BASE}/master/subcategories/${cropId}`);
    if (!res.ok) {
      console.error("Failed to load subcategories for crop", cropId);
      subsByCropId[cropId] = [];
      return [];
    }
    const arr = await res.json(); // [{id,name}]
    subsByCropId[cropId] = arr;
    return arr;
  }

  // -----------------------------------------
  // 5) RENDER LANDS LIST
  // -----------------------------------------
  function renderLands() {
    landsListEl.innerHTML = "";
    if (!lands || lands.length === 0) {
      landsEmptyEl.style.display = "block";
      return;
    }
    landsEmptyEl.style.display = "none";

    lands.forEach((land) => {
      const row = document.createElement("div");
      row.className = "land-row";

      const main = document.createElement("div");
      main.className = "land-main";
      main.textContent = `${land.size} acres`;

      const meta = document.createElement("div");
      meta.className = "land-meta";
      const patternLabel = land.croppingPattern
        ? land.croppingPattern
        : "-";
      meta.innerHTML = `
        <span class="badge-pattern">${patternLabel}</span>
        &nbsp;|&nbsp;
        ${ (land.crops || []).join(", ") }
      `;

      const actions = document.createElement("div");
      actions.className = "land-actions";
      const btnEdit = document.createElement("button");
      btnEdit.className = "btn-sm";
      btnEdit.setAttribute("data-text", "btnEdit");
      btnEdit.textContent = t().btnEdit;
      btnEdit.addEventListener("click", () => openEditForm(land.landId));

      const btnDel = document.createElement("button");
      btnDel.className = "btn-sm btn-sm-danger";
      btnDel.setAttribute("data-text", "btnDelete");
      btnDel.textContent = t().btnDelete;
      btnDel.addEventListener("click", () => deleteLand(land.landId));

      actions.appendChild(btnEdit);
      actions.appendChild(btnDel);

      row.appendChild(main);
      row.appendChild(meta);
      row.appendChild(actions);

      landsListEl.appendChild(row);
    });
  }

  // -----------------------------------------
  // 6) RENDER CROPS + SUBCATEGORIES
  // -----------------------------------------
  function renderCropsChecklist(selectedCropIds = []) {
    const tObj = t();
    cropsChecklist.innerHTML = "";

    if (!cropsMaster || cropsMaster.length === 0) {
      cropsChecklist.innerHTML = `<span>${tObj.cropsEmpty}</span>`;
      return;
    }

    cropsMaster.forEach((crop) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = crop.id;
      input.dataset.cropId = crop.id;

      if (selectedCropIds.includes(crop.id)) {
        input.checked = true;
      }

      input.addEventListener("change", onCropToggle);

      label.appendChild(input);
      label.appendChild(document.createTextNode(crop.name));
      cropsChecklist.appendChild(label);
    });
  }

  async function renderSubcategoriesChecklist(
    selectedNames = [] /* existing subcategory names when editing */
  ) {
    const tObj = t();
    subsChecklist.innerHTML = "";

    const selectedCropIds = getSelectedCropIds();
    if (selectedCropIds.length === 0) {
      subsChecklist.innerHTML = `<span>${tObj.subcategoriesEmpty}</span>`;
      return;
    }

    const allSubs = [];

    // load subs for all selected crops
    for (const cropId of selectedCropIds) {
      const subs = await loadSubcategoriesForCrop(cropId);
      const cropName =
        (cropsMaster.find((c) => c.id === cropId) || {}).name || "";

      subs.forEach((sc) => {
        allSubs.push({
          cropId,
          cropName,
          id: sc.id,
          name: sc.name,
        });
      });
    }

    if (allSubs.length === 0) {
      subsChecklist.innerHTML = `<span>${tObj.subcategoriesEmpty}</span>`;
      return;
    }

    allSubs.forEach((item) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = item.id;

      // preselect by name when editing
      if (selectedNames.includes(item.name)) {
        input.checked = true;
      }

      label.appendChild(input);
      label.appendChild(
        document.createTextNode(`${item.cropName} — ${item.name}`)
      );
      subsChecklist.appendChild(label);
    });
  }

  function getSelectedCropIds() {
    return Array.from(
      cropsChecklist.querySelectorAll("input[type='checkbox']")
    )
      .filter((el) => el.checked)
      .map((el) => Number(el.value));
  }

  function getSelectedSubcategoryIds() {
    return Array.from(
      subsChecklist.querySelectorAll("input[type='checkbox']")
    )
      .filter((el) => el.checked)
      .map((el) => Number(el.value));
  }

  // -----------------------------------------
  // 7) FORM MODES
  // -----------------------------------------
  function resetForm() {
    landSizeInput.value = "";
    patternSelect.disabled = false;
    patternSelect.value = "";
    Array.from(
      cropsChecklist.querySelectorAll("input[type='checkbox']")
    ).forEach((c) => (c.checked = false));
    subsChecklist.innerHTML = `<span>${t().subcategoriesEmpty}</span>`;
  }

  function openNewForm() {
    formMode = "NEW";
    editingLandId = null;

    formTitleEl.dataset.text = "formTitleNew";
    formSubtitleEl.dataset.text = "formSubtitleNew";
    formTitleEl.textContent = t().formTitleNew;
    formSubtitleEl.textContent = t().formSubtitleNew;

    resetForm();
  }

  async function openEditForm(landId) {
    const land = lands.find((l) => l.landId === landId);
    if (!land) return;

    formMode = "EDIT";
    editingLandId = landId;

    formTitleEl.dataset.text = "formTitleEdit";
    formSubtitleEl.dataset.text = "formSubtitleEdit";
    formTitleEl.textContent = t().formTitleEdit;
    formSubtitleEl.textContent = t().formSubtitleEdit;

    // size
    landSizeInput.value = land.size;

    // cropping pattern CANNOT be changed
    patternSelect.value = land.croppingPattern || "";
    patternSelect.disabled = true;

    // figure out which crops were used: any crop that contains a
    // subcategory whose name appears in land.crops
    const selectedNames = land.crops || [];
    const selectedCropIds = [];

    for (const crop of cropsMaster) {
      await loadSubcategoriesForCrop(crop.id);
      const anyUsed = (subsByCropId[crop.id] || []).some((sc) =>
        selectedNames.includes(sc.name)
      );
      if (anyUsed) selectedCropIds.push(crop.id);
    }

    renderCropsChecklist(selectedCropIds);
    await renderSubcategoriesChecklist(selectedNames);
  }

  // -----------------------------------------
  // 8) EVENT HANDLERS
  // -----------------------------------------
  function onCropToggle(e) {
    // enforce pattern limit
    const pattern = patternSelect.value;
    let maxCrops = 1;
    if (pattern === "DOUBLE") maxCrops = 2;
    if (pattern === "TRIPLE") maxCrops = 3;

    const checked = getSelectedCropIds();
    if (checked.length > maxCrops) {
      e.target.checked = false;
      const msg = t()
        .msgCropLimit.replace("{n}", String(maxCrops));
      alert(msg);
      return;
    }

    // whenever crops change, rebuild subcategories (no preselect in NEW)
    renderSubcategoriesChecklist(
      formMode === "EDIT"
        ? (lands.find((l) => l.landId === editingLandId) || {}).crops ||
            []
        : []
    );
  }

  async function handleSaveForm(ev) {
    ev.preventDefault();
    const tObj = t();
    const size = parseFloat(landSizeInput.value);
    const pattern = patternSelect.value;
    const selectedCropIds = getSelectedCropIds();
    const selectedSubIds = getSelectedSubcategoryIds();

    if (!size || size <= 0) {
      alert(tObj.msgSizeRequired);
      return;
    }

    if (formMode === "NEW") {
      if (!pattern) {
        alert(tObj.msgPatternRequired);
        return;
      }
      if (selectedCropIds.length === 0) {
        alert(tObj.msgNeedCrop);
        return;
      }
      if (selectedSubIds.length === 0) {
        alert(tObj.msgNeedSubcategories);
        return;
      }

      await createLand(size, pattern, selectedSubIds);
    } else {
      // EDIT: pattern is fixed, only size & subcategories allowed
      if (selectedSubIds.length === 0) {
        alert(tObj.msgNeedSubcategories);
        return;
      }
      await updateLand(editingLandId, size, selectedSubIds);
    }
  }

  // -----------------------------------------
  // 9) API CALLS
  // -----------------------------------------
  async function createLand(size, pattern, subIds) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/farmers/${farmerId}/lands`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            size,
            croppingPattern: pattern,
            subCategoryIds: subIds,
          }),
        }
      );

      if (!res.ok) throw new Error("Create failed");
      const rs = await res.json(); // LandRS: {landId,size,crops[]}

      // push into state with known pattern
      lands.push({
        landId: rs.landId,
        size: rs.size,
        croppingPattern: pattern,
        crops: rs.crops || [],
      });

      renderLands();
      alert(t().msgSaveOk);
      openNewForm();
    } catch (err) {
      console.error(err);
      alert(t().msgSaveFail);
    }
  }

  async function updateLand(landId, size, subIds) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/farmers/${farmerId}/lands/${landId}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            size,
            subCategoryIds: subIds,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      const rs = await res.json(); // LandRS

      const idx = lands.findIndex((l) => l.landId === landId);
      if (idx !== -1) {
        lands[idx].size = rs.size;
        lands[idx].crops = rs.crops || [];
      }

      renderLands();
      alert(t().msgSaveOk);
      openNewForm();
    } catch (err) {
      console.error(err);
      alert(t().msgSaveFail);
    }
  }

 async function deleteLand(landId) {
  const tObj = t();

  // ❌ Block delete if only 1 land exists
  if (lands.length <= 1) {
    alert(tObj.msgCannotDeleteLastLand);
    return;
  }

  if (!confirm(tObj.msgDeleteConfirm)) return;

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${API_BASE}/api/farmers/${farmerId}/lands/${landId}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );

    if (!res.ok) throw new Error("Delete failed");

    // Remove from local state
    lands = lands.filter((l) => l.landId !== landId);
    renderLands();

  } catch (err) {
    console.error(err);
    alert(tObj.msgDeleteFail);
  }
}


  // -----------------------------------------
  // 🔧 IMPORTANT BACKEND FIX FOR PATTERN
  // -----------------------------------------
  // In LandServiceImpl.updateLand, BEFORE clearing land.getLandCrops(), keep
  // the old croppingPattern and set it on the new LandCropEntity objects:
  //
  // CroppingPattern pattern = land.getLandCrops().isEmpty()
  //      ? null
  //      : land.getLandCrops().get(0).getCroppingPattern();
  //
  // land.getLandCrops().clear();
  // for (CropSubCategoriesEntity sub : subs) {
  //     LandCropEntity lc = LandCropEntity.builder()
  //           .land(land)
  //           .cropSubCategory(sub)
  //           .croppingPattern(pattern)   // <--- keep old pattern
  //           .build();
  //     land.getLandCrops().add(lc);
  // }

  // -----------------------------------------
  // 10) INIT + EVENTS
  // -----------------------------------------
  function init() {
    applyTheme(theme);
    applyLanguage(lang);

    document
      .getElementById("themeToggle")
      ?.addEventListener("click", () =>
        applyTheme(theme === "light" ? "dark" : "light")
      );

    document
      .getElementById("langToggle")
      ?.addEventListener("click", () =>
        applyLanguage(lang === "en" ? "bn" : "en")
      );

    patternSelect.addEventListener("change", () => {
      // when pattern changes, reset crop selection
      Array.from(
        cropsChecklist.querySelectorAll("input[type='checkbox']")
      ).forEach((c) => (c.checked = false));
      renderSubcategoriesChecklist([]);
    });

    btnNewLand.addEventListener("click", openNewForm);
    btnCancelForm.addEventListener("click", openNewForm);
    landForm.addEventListener("submit", handleSaveForm);

    // initial load
    loadMasterCrops();
    loadProfileAndLands();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

