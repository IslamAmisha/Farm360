// buyer-wallet.js

// protect route
(function protectBuyerWallet() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token || !userId || role !== "buyer") {
    alert("User not found or unauthorized access!");
    localStorage.clear();
    window.location.href = "../../Login/login.html";
    return;
  }
})();

(function () {
  const pageTranslations = {
    en: {
      brandName: "Farm360",
      navHome: "Home",
      navModules: "Modules",
      navAbout: "About",
      navInsights: "Insights",
      navSupport: "Support",
      sidebarWallet: "Wallet",

      walletBalance: "Wallet Balance",
      supplierLocked: "Supplier Locked",
      farmerProfitLocked: "Farmer Profit Locked",
      depositTitle: "Add Money to Wallet",
      amountLabel: "Amount",
      btnAdd: "Add Money to Wallet",
      msgInvalidAmount: "Please enter a valid amount.",
      msgAmountPositive: "Amount must be greater than zero.",
      msgAmountLimit: "Amount cannot exceed ₹500,000.",
      msgDepositSuccess: "Money added successfully.",
      msgDepositFail: "Failed to add money. Please try again.",
    },
    bn: {
      brandName: "ফার্ম৩৬০",
      navHome: "হোম",
      navModules: "মডিউল",
      navAbout: "আমাদের সম্পর্কে",
      navInsights: "তথ্য ও বিশ্লেষণ",
      navSupport: "সহায়তা",
      sidebarWallet: "ওয়ালেট",

      walletBalance: "ওয়ালেট ব্যালেন্স",
      supplierLocked: "সরবরাহকারী লকড",
      farmerProfitLocked: "কৃষক লাভ লকড",
      depositTitle: "ওয়ালেটে টাকা যোগ করুন",
      amountLabel: "পরিমাণ",
      btnAdd: "ওয়ালেটে টাকা যোগ করুন",
      msgInvalidAmount: "একটি বৈধ পরিমাণ লিখুন।",
      msgAmountPositive: "পরিমাণ শূন্যের বেশি হতে হবে।",
      msgAmountLimit: "পরিমাণ ₹৫০০,০০০ এর বেশি হতে পারেনা।",
      msgDepositSuccess: "টাকা সফলভাবে যোগ হয়েছে।",
      msgDepositFail: "টাকা যোগ করতে ব্যর্থ। আবার চেষ্টা করুন।",
    },
  };

  // merge into global translations if present
  if (typeof translations !== "undefined") {
    Object.assign(translations.en, pageTranslations.en);
    Object.assign(translations.bn, pageTranslations.bn);
  }

  if (!window.currentTheme) window.currentTheme = "light";
  if (!window.currentLanguage) window.currentLanguage = "en";

  function applyTheme(theme) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
    window.currentTheme = theme;
  }

  function toggleTheme() {
    const next = window.currentTheme === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  function applyLanguage(lang) {
    window.currentLanguage = lang;
    const t = pageTranslations[lang] || pageTranslations.en;

    document.body.classList.toggle("lang-bn", lang === "bn");
    document.querySelectorAll("[data-text]").forEach((el) => {
      const key = el.getAttribute("data-text");
      if (t[key]) el.textContent = t[key];
    });

    const langBtn = document.getElementById("langToggle");
    const mobileLangBtn = document.getElementById("mobileLangToggle");
    if (langBtn) langBtn.textContent = lang === "en" ? "বাংলা" : "English";
    if (mobileLangBtn) mobileLangBtn.textContent = lang === "en" ? "বাংলা" : "English";
  }

  function toggleLanguage() {
    const next = window.currentLanguage === "en" ? "bn" : "en";
    applyLanguage(next);
  }

  function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.style.display = mobileMenu.style.display === "flex" ? "none" : "flex";
    }
  }

  // UI references
  const walletBalanceEl = document.getElementById("walletBalance");
  const supplierLockedEl = document.getElementById("supplierLocked");
  const farmerProfitLockedEl = document.getElementById("farmerProfitLocked");
  const amountInput = document.getElementById("amountInput");
  const amountErrorEl = document.getElementById("amountError");
  const amountSuccessEl = document.getElementById("amountSuccess");
  const addMoneyBtn = document.getElementById("addMoneyBtn");
  const backBtn = document.getElementById("backToDashboard");

  backBtn?.addEventListener("click", () => {
    window.location.href = "../../Buyer-Dashboard/buyer-dashboard.html";
  });

  addMoneyBtn?.addEventListener("click", deposit);

  function validateAmount(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return { valid: false, message: pageTranslations[window.currentLanguage].msgInvalidAmount };
    if (num <= 0) return { valid: false, message: pageTranslations[window.currentLanguage].msgAmountPositive };
    if (num > 500000) return { valid: false, message: pageTranslations[window.currentLanguage].msgAmountLimit };
    return { valid: true };
  }

  async function loadWallet() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/escrow/wallet", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("load-wallet-failed");
      const data = await res.json();
      walletBalanceEl.textContent = "₹ " + (data.balance ?? 0);
      supplierLockedEl.textContent = "₹ " + (data.supplierLocked ?? 0);
      farmerProfitLockedEl.textContent = "₹ " + (data.farmerProfitLocked ?? 0);
    } catch (err) {
      console.error(err);
      alert(pageTranslations[window.currentLanguage].msgDepositFail);
    }
  }

  async function deposit() {
    amountErrorEl.textContent = "";
    amountSuccessEl.textContent = "";

    const { valid, message } = validateAmount(amountInput.value.trim());
    if (!valid) {
      amountErrorEl.textContent = message;
      return;
    }

    const amt = parseFloat(amountInput.value.trim());
    addMoneyBtn.disabled = true;
    addMoneyBtn.textContent = "...";

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/escrow/deposit?amount=${amt}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("deposit-failed");
      amountSuccessEl.textContent = pageTranslations[window.currentLanguage].msgDepositSuccess;
      await loadWallet();
    } catch (err) {
      console.error(err);
      amountErrorEl.textContent = pageTranslations[window.currentLanguage].msgDepositFail;
    } finally {
      addMoneyBtn.disabled = false;
      addMoneyBtn.textContent = pageTranslations[window.currentLanguage].btnAdd;
    }
  }

  // initialization
  window.addEventListener("DOMContentLoaded", () => {
    applyTheme(window.currentTheme);
    applyLanguage(window.currentLanguage);
    loadWallet();
  });

  // theme/lang listeners
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("mobileThemeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
  document.getElementById("mobileLangToggle")?.addEventListener("click", toggleLanguage);
  document.getElementById("mobileMenuBtn")?.addEventListener("click", toggleMobileMenu);
})();
