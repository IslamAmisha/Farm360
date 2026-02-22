(function protectSupplierProfile() {
	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("userId");
	const role = (localStorage.getItem("role") || "").toLowerCase();

	if (!token || !userId || role !== "supplier") {
		alert("User not found or unauthorized access!");
		localStorage.clear();
		window.location.href = "../../Login/login.html";
		return;
	}
})();

(function () {
	const translations = {
		en: {
			brandName: "Farm360",
			navHome: "Home",
			navModules: "Modules",
			navAbout: "About",
			navInsights: "Insights",
			navSupport: "Support",

			walletAvailable: "Available Balance",
			completedJobs: "Completed Jobs",

			basicDetails: "Basic Details",
			phone: "Phone Number",
			role: "Role",
			supplierName: "Supplier Name",
			businessName: "Business Name",
			supplierType: "Supplier Type",
			bankAccount: "Bank Account Number",
			district: "District",
			block: "Block",
			city: "City",
			village: "Village / City",
			pincode: "PIN Code",

			pan: "PAN Number",
			gst: "GST Number",

			btnUpload: "Upload",
			btnReplace: "Replace",
			btnDelete: "Delete",
			btnEdit: "Edit",
			btnSave: "Save",
			btnCancel: "Cancel",

			accountTitle: "Account",
			supplierNameLabel: "Name:",
			phoneLabel: "Phone:",
			supplierTypeLabel: "Supplier Type:",
			locationLabel: "Location:",

			businessPhoto: "Business Photo",

			msgProfileLoadFailed: "Failed to load profile.",
			msgProfileSaveFailed: "Failed to save profile.",
			msgProfileSaved: "Profile updated successfully.",
			msgLoginRequired: "Please login again. User info not found.",
		},

		bn: {
			brandName: "ফার্ম৩৬০",
			navHome: "হোম",
			navModules: "মডিউল",
			navAbout: "আমাদের সম্পর্কে",
			navInsights: "তথ্য ও বিশ্লেষণ",
			navSupport: "সহায়তা",

			walletAvailable: "উপলব্ধ ব্যালেন্স",
			completedJobs: "সম্পূর্ণ কাজ",

			basicDetails: "মৌলিক তথ্য",
			phone: "ফোন নম্বর",
			role: "ভূমিকা",
			supplierName: "সাপ্লায়ার নাম",
			businessName: "ব্যবসার নাম",
			supplierType: "সাপ্লায়ার টাইপ",
			bankAccount: "ব্যাংক অ্যাকাউন্ট নম্বর",
			district: "জেলা",
			block: "ব্লক",
			city: "শহর",
			village: "গ্রাম / শহর",
			pincode: "পিন কোড",

			pan: "PAN নম্বর",
			gst: "GST নম্বর",

			btnUpload: "আপলোড",
			btnReplace: "পরিবর্তন",
			btnDelete: "মুছুন",
			btnEdit: "এডিট",
			btnSave: "সেভ",
			btnCancel: "বাতিল",

			accountTitle: "অ্যাকাউন্ট",
			supplierNameLabel: "নাম:",
			phoneLabel: "ফোন:",
			supplierTypeLabel: "সাপ্লায়ার টাইপ:",
			locationLabel: "অবস্থান:",

			businessPhoto: "ব্যবসার ছবি",

			msgProfileLoadFailed: "প্রোফাইল লোড ব্যর্থ হয়েছে।",
			msgProfileSaveFailed: "প্রোফাইল সেভ ব্যর্থ হয়েছে।",
			msgProfileSaved: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে।",
			msgLoginRequired: "অনুগ্রহ করে আবার লগইন করুন।",
		},
	};

	// state
	let currentLanguage = window.currentLanguage || "en";
	let currentTheme = window.currentTheme || "light";
	let profileData = null;

	function t() {
		return translations[currentLanguage] || translations.en;
	}

	// THEME / LANGUAGE helpers (same pattern as farmer-profile.js)
	function applyTheme(theme) {
		document.body.classList.toggle("theme-dark", theme === "dark");
		currentTheme = theme;
		window.currentTheme = theme;
	}

	function toggleTheme() {
		applyTheme(currentTheme === "light" ? "dark" : "light");
	}

	function applyLanguage(lang) {
		currentLanguage = lang;
		window.currentLanguage = lang;

		document.body.classList.toggle("lang-bn", lang === "bn");
		const tr = t();

		document.querySelectorAll("[data-text]").forEach((el) => {
			const key = el.getAttribute("data-text");
			if (tr[key]) el.textContent = tr[key];
		});

		const langBtn = document.getElementById("langToggle");
		const mobileLangBtn = document.getElementById("mobileLangToggle");
		if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
		if (mobileLangBtn) mobileLangBtn.textContent = lang === "en" ? "বাংলা" : "English";
	}

	function toggleLanguage() {
		applyLanguage(currentLanguage === "en" ? "bn" : "en");
	}

	// DOM refs
	const phoneInput = document.getElementById("phone");
	const roleInput = document.getElementById("role");
	const supplierNameInput = document.getElementById("supplierName");
	const businessNameInput = document.getElementById("businessName");
	const supplierTypeSelect = document.getElementById("supplierType");
	const bankAccountInput = document.getElementById("bankAccount");
	const districtInput = document.getElementById("district");
	const blockInput = document.getElementById("block");
	const cityInput = document.getElementById("city");
	const villageInput = document.getElementById("village");
	const pinInput = document.getElementById("pinCode");
	const panInput = document.getElementById("panNumber");
	const gstInput = document.getElementById("gstNumber");

	const walletAvailableEl = document.getElementById("walletAvailable");
	const completedJobsEl = document.getElementById("completedJobs");
	const walletAvailableRightEl = document.getElementById("walletAvailableRight");

	const infoName = document.getElementById("infoName");
	const infoPhone = document.getElementById("infoPhone");
	const infoSupplierType = document.getElementById("infoSupplierType");
	const infoLocation = document.getElementById("infoLocation");

	const photoInput = document.getElementById("photoInput");
	const photoImg = document.getElementById("photoImg");
	const photoEmpty = document.getElementById("photoEmpty");
	const btnUpload = document.getElementById("btnUpload");
	const btnReplace = document.getElementById("btnReplace");
	const btnDelete = document.getElementById("btnDelete");

	const verificationBadgeEl = document.getElementById("verificationBadge");

	// Back to dashboard
	const backBtn = document.getElementById("backToDashboard");
	backBtn?.addEventListener("click", () => {
		window.location.href = "../Supplier-Dashboard/supplier-dashboard.html";
	});

	// Edit / Save behaviour (enable only allowed fields)
	function toggleEditBasic(editing, revert = false) {
		const form = document.querySelector(".form-basic");
		form.dataset.editing = editing ? "true" : "false";

		// editable fields per spec
		supplierNameInput.disabled = !editing;
		businessNameInput.disabled = !editing;
		villageInput.disabled = !editing;
		pinInput.disabled = !editing;
		bankAccountInput.disabled = !editing;

		// supplierType must remain disabled after registration
		supplierTypeSelect.disabled = true;

		const actions = form.querySelector(".form-actions");
		actions.hidden = !editing;

		const editBtn = document.querySelector('.btn-edit[data-section="basic"]');
		editBtn.style.display = editing ? "none" : "inline-flex";

		if (revert && profileData) {
			populateProfile(profileData);
		}
	}

	async function saveBasicProfile() {
    const token = localStorage.getItem("token");

    const payload = {
        supplierName: supplierNameInput.value.trim(),
        businessName: businessNameInput.value.trim(),
        village: villageInput.value.trim(),
        pinCode: pinInput.value.trim(),
        bankAccountNo: bankAccountInput.value.trim(), // IMPORTANT FIX
    };

    try {
        const res = await fetch("http://localhost:8080/api/supplier/update", {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("update-failed");

        alert(t().msgProfileSaved);
        await loadSupplierProfile();
        toggleEditBasic(false);
    } catch (err) {
        console.error(err);
        alert(t().msgProfileSaveFailed);
    }
}

	// Load profile + dashboard (wallet)
	async function loadSupplierProfile() {
    try {
        const token = localStorage.getItem("token");

        const [profileResp, dashResp] = await Promise.all([
            fetch("http://localhost:8080/api/supplier/getProfile", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }),
            fetch("http://localhost:8080/dashboard/supplier/overview", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }),
        ]);

        if (!profileResp.ok) throw new Error("profile-load-failed");

        const profile = await profileResp.json();
        profileData = profile;
        populateProfile(profile);

        if (dashResp.ok) {
            const dash = await dashResp.json();
            walletAvailableEl.textContent = "₹ " + (dash.walletBalance ?? 0);
            walletAvailableRightEl.textContent = "₹ " + (dash.walletBalance ?? 0);
            completedJobsEl.textContent = dash.completedJobs ?? 0;
        }
    } catch (err) {
        console.error(err);
        alert(t().msgProfileLoadFailed);
    }
}

	function populateProfile(data) {
		phoneInput.value = data.phoneNumber || "";
		roleInput.value = data.role || "Supplier";
		supplierNameInput.value = data.supplierName || data.name || "";
		businessNameInput.value = data.businessName || "";
		supplierTypeSelect.value = data.supplierType || "OTHERS";
		bankAccountInput.value = data.bankAccountNo || "";
		districtInput.value = data.districtName || "";
		blockInput.value = data.blockName || "";
		cityInput.value = data.cityName || "";
		villageInput.value = data.village || "";
		pinInput.value = data.pinCode || "";
		panInput.value = data.panNumber || "";
		gstInput.value = data.gstNumber || "";

		infoName.textContent = supplierNameInput.value || "—";
		infoPhone.textContent = phoneInput.value || "—";
		infoSupplierType.textContent = supplierTypeSelect.options[supplierTypeSelect.selectedIndex]?.text || "—";
		infoLocation.textContent = `${districtInput.value || '-'}, ${blockInput.value || '-'}, ${villageInput.value || '-'}`;

		// verification badge
		const status = (data.verificationStatus || "").toUpperCase();
		if (status === "VERIFIED") {
			verificationBadgeEl.innerHTML = `<span class="verification-badge good">🟢 Verified Supplier</span>`;
		} else if (status === "PENDING") {
			verificationBadgeEl.innerHTML = `<span class="verification-badge pending">⚠️ Verification Pending</span>`;
		} else if (status === "REJECTED") {
			verificationBadgeEl.innerHTML = `<span class="verification-badge rejected">⛔ Rejected</span>`;
		} else {
			verificationBadgeEl.innerHTML = "";
		}

		// photo
		if (data.businessPhotoUrl) {
			photoImg.src = data.businessPhotoUrl;
			photoImg.hidden = false;
			photoEmpty.hidden = true;
			btnUpload.hidden = true;
			btnReplace.hidden = false;
			btnDelete.hidden = false;
		} else {
			photoImg.hidden = true;
			photoEmpty.hidden = false;
			btnUpload.hidden = false;
			btnReplace.hidden = true;
			btnDelete.hidden = true;
		}
	}

	// Photo handlers (frontend-only behaviour)
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
	}

	function onDeletePhoto() {
		photoImg.hidden = true;
		photoEmpty.hidden = false;
		btnUpload.hidden = false;
		btnReplace.hidden = true;
		btnDelete.hidden = true;
	}

	function initPage() {
		applyTheme(currentTheme);
		applyLanguage(currentLanguage);
		loadSupplierProfile();
	}

	// EVENT LISTENERS
	document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
	document.getElementById("mobileThemeToggle")?.addEventListener("click", toggleTheme);

	document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
	document.getElementById("mobileLangToggle")?.addEventListener("click", toggleLanguage);

	document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
		document.getElementById("mobileMenu").classList.toggle("open");
	});

	document.querySelector('.btn-edit[data-section="basic"]')?.addEventListener("click", () => toggleEditBasic(true));
	document.querySelector('.btn-cancel[data-section="basic"]')?.addEventListener("click", () => toggleEditBasic(false, true));
	document.querySelector('.btn-save[data-section="basic"]')?.addEventListener("click", saveBasicProfile);

	photoInput?.addEventListener("change", onPhotoSelected);
	btnUpload?.addEventListener("click", () => photoInput.click());
	btnReplace?.addEventListener("click", () => photoInput.click());
	btnDelete?.addEventListener("click", onDeletePhoto);

	document.addEventListener("DOMContentLoaded", initPage);
})();

