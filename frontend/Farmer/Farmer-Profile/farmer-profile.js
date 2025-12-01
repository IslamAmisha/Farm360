/* -------------------------------------------------- */
/* FARMER PROFILE JS — FINAL OPTIMIZED VERSION        */
/* -------------------------------------------------- */

(function () {

    /* -------------------------------------------------- */
    /* 0) TRANSLATIONS (LOCAL TO THIS PAGE)               */
    /* -------------------------------------------------- */
    window.translations = {
        en: {
            brandName: "Farm360",

            navHome: "Home",
            navModules: "Modules",
            navAbout: "About",
            navInsights: "Insights",
            navSupport: "Support",

            /* Wallet */
            totalReceivable: "Total Receivable",
            totalReleased: "Total Released",
            totalPending: "Total Pending",
            lastTransaction: "Last Transaction",

            /* Basic section */
            basicDetails: "Basic Details",
            phone: "Phone Number",
            role: "Role",
            farmerName: "Full Name",
            district: "District",
            block: "Block",
            village: "Village / City",
            pincode: "PIN Code",

            /* Land section */
            landDetails: "Land Details",
            landSize: "Land Size (acres)",
            croppingPattern: "Cropping Pattern",
            crops: "Crops",
            cropSubcategories: "Crop Subcategories",

            /* Photo */
            landPhoto: "Land Photo",
            btnUpload: "Upload",
            btnReplace: "Replace",
            btnDelete: "Delete",

            /* Buttons */
            btnEdit: "Edit",
            btnSave: "Save",
            btnCancel: "Cancel",

            /* Sidebar */
            accountTitle: "Account",
            farmerNameLabel: "Name:",
            phoneLabel: "Phone:",
            locationLabel: "Location:",
        },

        bn: {
            brandName: "Farm360",

            navHome: "হোম",
            navModules: "মডিউল",
            navAbout: "সম্পর্কিত",
            navInsights: "ইনসাইটস",
            navSupport: "সহায়তা",

            /* Wallet */
            totalReceivable: "মোট গ্রহণযোগ্য",
            totalReleased: "মোট রিলিজড",
            totalPending: "মোট বকেয়া",
            lastTransaction: "শেষ লেনদেন",

            /* Basic section */
            basicDetails: "মৌলিক তথ্য",
            phone: "ফোন নম্বর",
            role: "ভূমিকা",
            farmerName: "সম্পূর্ণ নাম",
            district: "জেলা",
            block: "ব্লক",
            village: "গ্রাম / শহর",
            pincode: "পিন কোড",

            /* Land section */
            landDetails: "জমির বিবরণ",
            landSize: "জমির আকার (একর)",
            croppingPattern: "চাষের ধরন",
            crops: "ফসল",
            cropSubcategories: "ফসলের উপশ্রেণী",

            /* Photo */
            landPhoto: "জমির ছবি",
            btnUpload: "আপলোড",
            btnReplace: "পরিবর্তন",
            btnDelete: "মুছুন",

            /* Buttons */
            btnEdit: "এডিট",
            btnSave: "সেভ",
            btnCancel: "বাতিল",

            /* Sidebar */
            accountTitle: "অ্যাকাউন্ট",
            farmerNameLabel: "নাম:",
            phoneLabel: "ফোন:",
            locationLabel: "অবস্থান:",
        }
    };


    /* -------------------------------------------------- */
    /* 1) GLOBAL STATE                                    */
    /* -------------------------------------------------- */
    if (!window.currentTheme) window.currentTheme = "light";
    if (!window.currentLanguage) window.currentLanguage = "en";


    /* -------------------------------------------------- */
    /* 2) CROPS + FULL TRANSLATION SUPPORT               */
    /* -------------------------------------------------- */
    const cropsData = {
        "Rice": {
            bn: "ধান",
            subs: {
                "Aman": "অমন",
                "Boro": "বোরো",
                "Aus": "আউস"
            }
        },
        "Potato": {
            bn: "আলু",
            subs: {
                "Kufri Jyoti": "কুফরি জ্যোতি",
                "Kufri Sindhuri": "কুফরি সিন্দুরি"
            }
        },
        "Jute": {
            bn: "পাট",
            subs: {
                "Capsularis": "ক্যাপসুলারিস",
                "Olitorius": "অলিটোরিয়াস"
            }
        },
        "Vegetables": {
            bn: "শাকসবজি",
            subs: {
                "Brinjal": "বেগুন",
                "Tomato": "টমেটো",
                "Okra": "ঢেঁড়স"
            }
        },
        "Pulses": {
            bn: "ডাল",
            subs: {
                "Moong": "মুগ",
                "Masoor": "মসুর",
                "Urad": "উড়দ"
            }
        }
    };


    /* -------------------------------------------------- */
    /* 3) THEME + LANGUAGE FUNCTIONS                      */
    /* -------------------------------------------------- */
    function applyTheme(theme) {
        document.body.classList.toggle("theme-dark", theme === "dark");
        window.currentTheme = theme;
    }

    function toggleTheme() {
        window.currentTheme =
            window.currentTheme === "light" ? "dark" : "light";
        applyTheme(window.currentTheme);
    }

    function applyLanguage(lang) {
        document.body.classList.toggle("lang-bn", lang === "bn");
        window.currentLanguage = lang;

        const t = window.translations?.[lang];

        if (t) {
            document.querySelectorAll("[data-text]").forEach(el => {
                const key = el.getAttribute("data-text");
                if (t[key]) el.textContent = t[key];
            });
        }

        const langBtn = document.getElementById("langToggle");
        const mobileBtn = document.getElementById("mobileLangToggle");

        if (langBtn) langBtn.textContent = (lang === "en" ? "বাংলা" : "English");
        if (mobileBtn) mobileBtn.textContent = (lang === "en" ? "বাংলা" : "English");

        /* Refresh crops after language is applied */
        populateCrops();
        renderSubcategories();
    }

    function toggleLanguage() {
        window.currentLanguage =
            window.currentLanguage === "en" ? "bn" : "en";
        applyLanguage(window.currentLanguage);
    }


    /* -------------------------------------------------- */
    /* 4) DOM ELEMENTS                                    */
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


    /* -------------------------------------------------- */
    /* 5) EDIT / SAVE SYSTEM                              */
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

    function toggleEdit(section, editing, revert = false) {
        const form = document.querySelector(`.form-${section}`);
        if (!form) return;

        form.dataset.editing = editing ? "true" : "false";

        form.querySelectorAll("input, select").forEach(inp => {
            if (!inp.classList.contains("input-locked"))
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
            document.getElementById('farmerName').value = profileState.name;
            document.getElementById('village').value = profileState.village;
            document.getElementById('pincode').value = profileState.pincode;

            districtSelect.value = profileState.district;
            districtSelect.dispatchEvent(new Event("change"));

            blockSelect.value = profileState.block;
        }

        if (section === "land") {
            document.getElementById('landSize').value = profileState.landSize;
            document.getElementById('croppingPattern').value = profileState.croppingPattern;

            Object.keys(cropsData).forEach(crop => {
                const box = document.getElementById("crop_" + crop.replace(/\s+/g, "_"));
                if (box) box.checked = profileState.crops.includes(crop);
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

            profileState.crops = Array.from(
                cropsChecklist.querySelectorAll("input:checked")
            ).map(el => el.value);
        }

        infoName.textContent = profileState.name || "—";
        infoPhone.textContent = profileState.phone;
        infoLocation.textContent = `${profileState.district} ${profileState.block}`;

        toggleEdit(section, false);
    }


    /* -------------------------------------------------- */
    /* 6) DISTRICT + BLOCK                                 */
    /* -------------------------------------------------- */
    const districtBlockData = {
        "North 24 Parganas": ["Barasat I", "Barasat II", "Bongaon", "Habra"],
        "South 24 Parganas": ["Alipore Sadar", "Canning", "Baruipur", "Diamond Harbour"],
        "Murshidabad": ["Berhampore", "Domkal", "Jangipur"]
    };

    function populateDistricts() {
        districtSelect.innerHTML =
            `<option value="">Select district</option>` +
            Object.keys(districtBlockData)
                .map(d => `<option value="${d}">${d}</option>`).join("");
    }

    districtSelect.addEventListener("change", () => {
        const d = districtSelect.value;

        blockSelect.innerHTML =
            `<option value="">Select block</option>` +
            (districtBlockData[d] || [])
                .map(b => `<option value="${b}">${b}</option>`).join("");
    });


    /* -------------------------------------------------- */
    /* 7) CROPS + SUBCATEGORY RENDERING                   */
    /* -------------------------------------------------- */
    function populateCrops() {
        cropsChecklist.innerHTML = "";

        Object.keys(cropsData).forEach(crop => {
            const id = "crop_" + crop.replace(/\s+/g, "_");

            const nameToShow =
                (window.currentLanguage === "bn")
                    ? `${cropsData[crop].bn} (${crop})`
                    : `${crop} (${cropsData[crop].bn})`;

            const label = document.createElement("label");
            label.innerHTML = `
                <input type="checkbox" id="${id}" value="${crop}">
                <span>${nameToShow}</span>
            `;

            cropsChecklist.appendChild(label);

            document.getElementById(id)
                .addEventListener("change", renderSubcategories);
        });
    }

    function renderSubcategories() {
        const selected = Array.from(
            cropsChecklist.querySelectorAll("input:checked")
        ).map(i => i.value);

        if (selected.length === 0) {
            cropSubcategories.innerHTML =
                `<div class="subcategory-empty">${
                    window.currentLanguage === "bn"
                        ? "উপবিভাগ দেখতে ফসল নির্বাচন করুন"
                        : "Select crops to see subcategories"
                }</div>`;
            return;
        }

        cropSubcategories.innerHTML = "";

        selected.forEach(crop => {
            const group = document.createElement("div");
            group.className = "subcategory-group";

            const titleText =
                window.currentLanguage === "bn"
                    ? `${cropsData[crop].bn} (${crop})`
                    : `${crop} (${cropsData[crop].bn})`;

            const title = document.createElement("div");
            title.style.fontWeight = "600";
            title.textContent = titleText;
            group.appendChild(title);

            Object.keys(cropsData[crop].subs).forEach(sub => {
                const subName =
                    window.currentLanguage === "bn"
                        ? `${cropsData[crop].subs[sub]} (${sub})`
                        : `${sub} (${cropsData[crop].subs[sub]})`;

                const el = document.createElement("label");
                el.innerHTML = `<input type="checkbox" value="${sub}"> ${subName}`;
                group.appendChild(el);
            });

            cropSubcategories.appendChild(group);
        });
    }


    /* -------------------------------------------------- */
    /* 8) PHOTO HANDLING                                  */
    /* -------------------------------------------------- */
    function onPhotoSelected(e) {
        const file = e.target.files[0];
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
    /* 9) WALLET                                          */
    /* -------------------------------------------------- */
    function initWallet() {
        totalReceivable.textContent = "₹ 12,450";
        totalReleased.textContent = "₹ 9,000";
        totalPending.textContent = "₹ 3,450";
        lastTransaction.textContent = "2025-11-25";
    }


    /* -------------------------------------------------- */
    /* 10) INIT                                           */
    /* -------------------------------------------------- */
    function initPage() {
        applyTheme(window.currentTheme);
        applyLanguage(window.currentLanguage);

        populateDistricts();
        populateCrops();
        renderSubcategories();
        initWallet();

        infoName.textContent = "—";
        infoPhone.textContent = profileState.phone;
        infoLocation.textContent = "—";
    }


    /* -------------------------------------------------- */
    /* 11) EVENT LISTENERS                                */
    /* -------------------------------------------------- */
    document.querySelectorAll(".btn-edit")
        .forEach(btn => btn.addEventListener("click",
            () => toggleEdit(btn.dataset.section, true)));

    document.querySelectorAll(".btn-cancel")
        .forEach(btn => btn.addEventListener("click",
            () => toggleEdit(btn.dataset.section, false, true)));

    document.querySelectorAll(".btn-save")
        .forEach(btn => btn.addEventListener("click",
            () => saveSection(btn.dataset.section)));

    photoInput.addEventListener("change", onPhotoSelected);

    btnUpload.addEventListener("click", () => photoInput.click());
    btnReplace.addEventListener("click", () => photoInput.click());
    btnDelete.addEventListener("click", onDeletePhoto);

    document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
    document.getElementById("mobileThemeToggle")?.addEventListener("click", toggleTheme);
    document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
    document.getElementById("mobileLangToggle")?.addEventListener("click", toggleLanguage);

    document.getElementById("mobileMenuBtn")
        ?.addEventListener("click", () => {
            document.getElementById("mobileMenu").classList.toggle("open");
        });

    document.addEventListener("DOMContentLoaded", initPage);

})();
