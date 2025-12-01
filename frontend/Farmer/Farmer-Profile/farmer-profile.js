/* -------------------------------------------------- */
/* FARMER PROFILE JS — FINAL MERGED CLEAN VERSION     */
/* -------------------------------------------------- */

(function () {

    /* -------------------------------------------------- */
    /* GLOBAL THEME + LANGUAGE SHARED ACROSS PAGES        */
    /* -------------------------------------------------- */
    window.currentTheme = localStorage.getItem("theme") || "light";
    window.currentLanguage = localStorage.getItem("language") || "en";

    /* -------------------------------------------------- */
    /* DISTRICT & BLOCK DATA                              */
    /* -------------------------------------------------- */
    const districtBlockData = {
        "North 24 Parganas": ["Barasat I", "Barasat II", "Bongaon", "Habra"],
        "South 24 Parganas": ["Alipore Sadar", "Canning", "Baruipur", "Diamond Harbour"],
        "Murshidabad": ["Berhampore", "Domkal", "Jangipur"]
    };

    /* -------------------------------------------------- */
    /* CROPS + SUBCATEGORIES                              */
    /* -------------------------------------------------- */
    const cropsData = {
        "Rice": { bn: "ধান", subs: ["Aman", "Boro", "Aus"] },
        "Potato": { bn: "আলু", subs: ["Kufri Jyoti", "Kufri Sindhuri"] },
        "Jute": { bn: "পাট", subs: ["Capsularis", "Olitorius"] },
        "Vegetables": { bn: "শাকসবজি", subs: ["Brinjal", "Tomato", "Okra"] },
        "Pulses": { bn: "ডাল", subs: ["Moong", "Masoor", "Urad"] }
    };

    /* -------------------------------------------------- */
    /* PROFILE STATE (Temporary Local Storage)            */
    /* -------------------------------------------------- */
    const profileState = {
        name: "",
        phone: "+91 9XXXXXXXXX",
        district: "",
        block: "",
        village: "",
        pincode: "",
        landSize: "",
        croppingPattern: "",
        crops: [],
        photo: null
    };

    /* -------------------------------------------------- */
    /* DOM ELEMENTS                                        */
    /* -------------------------------------------------- */
    const districtSelect = document.getElementById('districtSelect');
    const blockSelect = document.getElementById('blockSelect');
    const cropsChecklist = document.getElementById('cropsChecklist');
    const cropSubcategories = document.getElementById('cropSubcategories');

    const totalReceivable = document.getElementById('totalReceivable');
    const totalReleased = document.getElementById('totalReleased');
    const totalPending = document.getElementById('totalPending');
    const lastTransaction = document.getElementById('lastTransaction');

    const photoInput = document.getElementById('photoInput');
    const photoImg = document.getElementById('photoImg');
    const photoEmpty = document.getElementById('photoEmpty');
    const btnUpload = document.getElementById('btnUpload');
    const btnReplace = document.getElementById('btnReplace');
    const btnDelete = document.getElementById('btnDelete');

    const infoName = document.getElementById('infoName');
    const infoPhone = document.getElementById('infoPhone');
    const infoLocation = document.getElementById('infoLocation');

    const langToggle = document.getElementById("langToggle");
    const mobileLangToggle = document.getElementById("mobileLangToggle");
    const themeToggle = document.getElementById("themeToggle");
    const mobileThemeToggle = document.getElementById("mobileThemeToggle");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    /* -------------------------------------------------- */
    /* EDIT MODE / SAVE / RESTORE                         */
    /* -------------------------------------------------- */
    function toggleEdit(section, editing, revert = false) {
        const form = document.querySelector(`.form-${section}`);
        if (!form) return;

        form.dataset.editing = editing ? "true" : "false";

        form.querySelectorAll("input, select").forEach(inp => {
            if (inp.classList.contains("input-locked")) return;
            inp.disabled = !editing;
        });

        const actions = form.querySelector(".form-actions");
        if (actions) actions.hidden = !editing;

        const editBtn = document.querySelector(`.btn-edit[data-section="${section}"]`);
        if (editBtn) editBtn.style.display = editing ? "none" : "inline-flex";

        if (revert) restoreSection(section);
    }

    function restoreSection(section) {
        if (section === "basic") {
            document.getElementById('farmerName').value = profileState.name || "";
            document.getElementById('village').value = profileState.village || "";
            document.getElementById('pincode').value = profileState.pincode || "";

            districtSelect.value = profileState.district || "";
            districtSelect.dispatchEvent(new Event("change"));
            blockSelect.value = profileState.block || "";
        }

        if (section === "land") {
            document.getElementById('landSize').value = profileState.landSize || "";
            document.getElementById('croppingPattern').value = profileState.croppingPattern || "";

            Object.keys(cropsData).forEach(crop => {
                const c = document.getElementById("crop_" + crop.replace(/\s+/g, "_"));
                if (c) c.checked = (profileState.crops || []).includes(crop);
            });

            renderSubcategories();
        }
    }

    function saveSection(section) {
        if (section === "basic") {
            profileState.name = document.getElementById('farmerName').value;
            profileState.village = document.getElementById('village').value;
            profileState.pincode = document.getElementById('pincode').value;
            profileState.district = districtSelect.value;
            profileState.block = blockSelect.value;
        }

        if (section === "land") {
            profileState.landSize = document.getElementById('landSize').value;
            profileState.croppingPattern = document.getElementById('croppingPattern').value;
            profileState.crops = Array.from(cropsChecklist.querySelectorAll("input:checked"))
                .map(i => i.value);
        }

        infoName.textContent = profileState.name || "—";
        infoPhone.textContent = profileState.phone;
        infoLocation.textContent = `${profileState.district || "—"} ${profileState.block || ""}`;

        toggleEdit(section, false);
    }

    /* -------------------------------------------------- */
    /* DISTRICT + BLOCK POPULATION                        */
    /* -------------------------------------------------- */
    function populateDistricts() {
        districtSelect.innerHTML =
            `<option value="">Select district</option>` +
            Object.keys(districtBlockData)
                .map(d => `<option value="${d}">${d}</option>`)
                .join("");
    }

    districtSelect.addEventListener("change", () => {
        const dist = districtSelect.value;
        blockSelect.innerHTML =
            `<option value="">Select block</option>` +
            (districtBlockData[dist] || [])
                .map(b => `<option value="${b}">${b}</option>`)
                .join("");
    });

    /* -------------------------------------------------- */
    /* CROPS + SUBCATEGORY RENDERING                      */
    /* -------------------------------------------------- */
    function populateCrops() {
        cropsChecklist.innerHTML = "";

        Object.keys(cropsData).forEach(crop => {
            const id = "crop_" + crop.replace(/\s+/g, "_");

            const label = document.createElement("label");
            label.innerHTML = `
                <input type="checkbox" id="${id}" value="${crop}" />
                <span>${crop}</span>
            `;

            cropsChecklist.appendChild(label);

            document.getElementById(id).addEventListener("change", renderSubcategories);
        });
    }

    function renderSubcategories() {
        const selected = Array.from(cropsChecklist.querySelectorAll("input:checked"))
            .map(i => i.value);

        if (selected.length === 0) {
            cropSubcategories.innerHTML =
                `<div class="subcategory-empty">Select crops to see subcategories</div>`;
            return;
        }

        cropSubcategories.innerHTML = "";

        selected.forEach(crop => {
            const group = document.createElement("div");
            group.className = "subcategory-group";

            const title = document.createElement("div");
            title.style.fontWeight = "600";
            title.textContent = crop + " — " + (cropsData[crop].bn || "");

            group.appendChild(title);

            cropsData[crop].subs.forEach(sub => {
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
        const file = e.target.files?.[0];
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

        delete profileState.photo;
    }

    /* -------------------------------------------------- */
    /* WALLET SUMMARY                                      */
    /* -------------------------------------------------- */
    function initWallet() {
        totalReceivable.textContent = "₹ 12,450";
        totalReleased.textContent = "₹ 9,000";
        totalPending.textContent = "₹ 3,450";
        lastTransaction.textContent = "2025-11-25";
    }

    /* -------------------------------------------------- */
    /* BUTTON EVENTS                                       */
    /* -------------------------------------------------- */
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => toggleEdit(btn.dataset.section, true));
    });

    document.querySelectorAll(".btn-cancel").forEach(btn => {
        btn.addEventListener("click", () => toggleEdit(btn.dataset.section, false, true));
    });

    document.querySelectorAll(".btn-save").forEach(btn => {
        btn.addEventListener("click", () => saveSection(btn.dataset.section));
    });

    btnUpload.addEventListener("click", () => photoInput.click());
    btnReplace.addEventListener("click", () => photoInput.click());
    btnDelete.addEventListener("click", onDeletePhoto);
    photoInput.addEventListener("change", onPhotoSelected);

    /* -------------------------------------------------- */
    /* THEME + LANGUAGE SYNC WITH LANDING PAGE            */
    /* -------------------------------------------------- */
    function syncTheme() {
        if (window.applyTheme) window.applyTheme(currentTheme);
    }

    function syncLanguage() {
        if (window.applyLanguage) window.applyLanguage(currentLanguage);
        if (window.updateTranslatedText) window.updateTranslatedText();
    }

    themeToggle?.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", currentTheme);
        syncTheme();
    });

    mobileThemeToggle?.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", currentTheme);
        syncTheme();
    });

    langToggle?.addEventListener("click", () => {
        currentLanguage = currentLanguage === "en" ? "bn" : "en";
        localStorage.setItem("language", currentLanguage);
        syncLanguage();
        langToggle.textContent = currentLanguage === "en" ? "বাংলা" : "English";
        mobileLangToggle.textContent = langToggle.textContent;
    });

    mobileLangToggle?.addEventListener("click", () => {
        currentLanguage = currentLanguage === "en" ? "bn" : "en";
        localStorage.setItem("language", currentLanguage);
        syncLanguage();
        mobileLangToggle.textContent = currentLanguage === "en" ? "বাংলা" : "English";
        langToggle.textContent = mobileLangToggle.textContent;
    });

    /* -------------------------------------------------- */
    /* MOBILE MENU                                         */
    /* -------------------------------------------------- */
    mobileMenuBtn?.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });

    /* -------------------------------------------------- */
    /* MAIN INITIALIZER                                    */
    /* -------------------------------------------------- */
    function initProfile() {
        populateDistricts();
        populateCrops();
        renderSubcategories();
        initWallet();

        infoName.textContent = profileState.name || "—";
        infoPhone.textContent = profileState.phone;
        infoLocation.textContent = "—";

        syncTheme();
        syncLanguage();
    }

    document.addEventListener("DOMContentLoaded", initProfile);

})();
