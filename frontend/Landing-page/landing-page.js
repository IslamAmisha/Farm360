// ================================
// GLOBAL STATE
// ================================
let currentLanguage = "en";
let currentTheme = "light";
let charts = [];


// ================================
// TRANSLATION MAP (UNCHANGED)
// ================================
const translations = {
  en: {
    heroHeading: "Connecting Farmers & Buyers for Smart Agriculture",
    heroSubtitle: "Connecting Farmers & Buyers for Smart Agriculture",
    heroDescription:
      "A transparent platform enabling direct collaboration between farmers and buyers with secure agreements, fair pricing, and streamlined logistics.",
    heroRegister: "Register Now",
    heroLogin: "Login",
    // STATISTICS TEXT
totalFarmers: "Total Farmers",
totalBuyers: "Total Buyers",
totalCrops: "Total Crops",
activeProposals: "Active Proposals",
signedAgreements: "Agreements Signed",
completedContracts: "Completed Contracts",
trustScore: "Trust Score System",
farmingCycles: "Ongoing Farming Cycles",

aboutTitle: "About Farm360",
aboutDescription:
  "Farm360 is an innovative agricultural partnership platform designed specifically for farmers and buyers in West Bengal. Our platform bridges the gap between agricultural producers and market buyers, creating transparent, secure, and mutually beneficial relationships.",

missionTitle: "Our Mission",
missionText:
  "To empower farmers with direct market access and fair pricing while providing buyers with quality agricultural products through transparent and secure digital agreements.",

visionTitle: "Our Vision",
visionText:
  "Creating a sustainable agricultural ecosystem where technology ensures fairness, transparency, and prosperity for all stakeholders in the farming community.",

whyUsefulTitle: "Why Farm360?",
whyUsefulText:
  "Farm360 eliminates middlemen, reduces transaction costs, ensures fair pricing, provides secure escrow systems, and maintains complete transparency throughout the farming cycle.",

mfTitle: "Farm360 Platform Modules",
mfSubtitle: "Complete workflow from registration to delivery",

mf0title: "Registration",
mf0desc: "Create account as Farmer or Buyer",

mf1title: "Profile Setup",
mf1desc: "Complete your profile details",

mf2title: "Proposal",
mf2desc: "Submit or view farming proposals",

mf3title: "Problem / Negotiation",
mf3desc: "Discuss and negotiate terms",

mf4title: "Digital Agreement",
mf4desc: "Sign secure digital contract",

mf5title: "Resource Allocation",
mf5desc: "Initial funding (30%)",

mf6title: "Cultivation Progress",
mf6desc: "Mid-cycle payment (30%)",

mf7title: "Harvest & Payment",
mf7desc: "Final settlement (40%)",

rpTitle: "Create Farmer-Buyer Contract",
rpSubtitle: "Simple workflow to establish partnership",
rpCreateBtn: "Create New Contract",

rpStepFarmer: "Farmer",
rpStepProposal: "Proposal",
rpStepNegotiation: "Negotiation",
rpStepAgreement: "Agreement",
rpStepFarming: "Farming",
rpStepHarvest: "Harvest",
rpStepDelivery: "Delivery",

rpPay1: "Initial Resource Funding",
rpPay2: "Mid-Cultivation Payment",
rpPay3: "Final Harvest Settlement",

insightsTitle: "Data Insights",
insightsSubtitle: "Quick overview of platform usage",

insightFarmers: "Total Farmers",
insightBuyers: "Total Buyers",
insightDeals: "Active Deals",

boxCrops: "Supported Crops",
boxDistricts: "Top Districts",
boxContracts: "Contract Status",

footerDesc: "Connecting farmers and buyers for smart agriculture.",
footerQuick: "Quick Links",
footerHome: "Home",
footerModules: "Modules",
footerAbout: "About",
footerContact: "Contact",
footerTerms: "Terms of Service",
footerPrivacy: "Privacy Policy",
footerInfo: "Contact Info",
footerAddress: "Kolkata, West Bengal, India",
footerFollow: "Follow Us",
footerCopy: "© 2025 Farm360. All rights reserved.",

navHome: "Home",
navModules: "Modules",
navAbout: "About",
navInsights: "Insights",
navSupport: "Support",
brandName: "Farm360",

chartCropDistribution: "Crop Distribution",
chartFarmersGrowth: "Farmers Growth Over Time",
chartPopularCrops: "Most Popular Crops",
chartRegionalContribution: "Regional Contribution",


  },

  bn: {
    heroHeading: "স্মার্ট কৃষির জন্য কৃষক ও ক্রেতাদের সংযুক্ত করা",
    heroSubtitle: "চাষী ও ব্যবসায়ীদের জন্য একটি স্মার্ট প্ল্যাটফর্ম",
    heroDescription:
      "একটি স্বচ্ছ প্ল্যাটফর্ম যা কৃষক এবং ক্রেতাদের মধ্যে নিরাপদ চুক্তি, ন্যায্য মূল্য এবং সহজ লজিস্টিকসের মাধ্যমে সরাসরি সহযোগিতা করতে সক্ষম করে।",
    heroRegister: "এখন নিবন্ধন করুন",
    heroLogin: "লগইন",
    totalFarmers: "মোট কৃষক",
totalBuyers: "মোট ক্রেতা",
totalCrops: "মোট ফসল",
activeProposals: "সক্রিয় প্রস্তাব",
signedAgreements: "চুক্তি স্বাক্ষরিত",
completedContracts: "সমাপ্ত চুক্তি",
trustScore: "বিশ্বাস স্কোর সিস্টেম",
farmingCycles: "চলমান চাষ চক্র",
aboutTitle: "Farm360 সম্পর্কে",
aboutDescription:
  "Farm360 পশ্চিমবঙ্গের কৃষক এবং ক্রেতাদের জন্য বিশেষভাবে ডিজাইন করা একটি উদ্ভাবনী কৃষি অংশীদারিত্ব প্ল্যাটফর্ম। আমাদের প্ল্যাটফর্ম কৃষি উৎপাদক এবং বাজার ক্রেতাদের মধ্যে ব্যবধান দূর করে, স্বচ্ছ, নিরাপদ এবং পারস্পরিকভাবে উপকারী সম্পর্ক তৈরি করে।",

missionTitle: "আমাদের লক্ষ্য",
missionText:
  "কৃষকদের সরাসরি বাজার প্রবেশাধিকার এবং ন্যায্য মূল্যের মাধ্যমে ক্ষমতায়ন করা এবং ক্রেতাদের স্বচ্ছ এবং নিরাপদ ডিজিটাল চুক্তির মাধ্যমে মানসম্পন্ন কৃষি পণ্য সরবরাহ করা।",

visionTitle: "আমাদের দৃষ্টিভঙ্গি",
visionText:
  "একটি টেকসই কৃষি ইকোসিস্টেম তৈরি করা যেখানে প্রযুক্তি কৃষি সম্প্রদায়ের সমস্ত অংশীদারদের জন্য ন্যায্যতা, স্বচ্ছতা এবং সমৃদ্ধি নিশ্চিত করে।",

whyUsefulTitle: "কেন Farm360?",
whyUsefulText:
  "Farm360 মধ্যস্থতাকারীদের দূর করে, লেনদেন খরচ হ্রাস করে, ন্যায্য মূল্য নিশ্চিত করে, সুরক্ষিত এসক্রো সিস্টেম প্রদান করে এবং চাষ চক্র জুড়ে সম্পূর্ণ স্বচ্ছতা বজায় রাখে।",
mfTitle: "Farm360 প্ল্যাটফর্ম মডিউল",
mfSubtitle: "নিবন্ধন থেকে ডেলিভারি পর্যন্ত সম্পূর্ণ কর্মপ্রবাহ",

mf0title: "নিবন্ধন",
mf0desc: "কৃষক বা ক্রেতা হিসেবে অ্যাকাউন্ট তৈরি করুন",

mf1title: "প্রোফাইল সেটআপ",
mf1desc: "আপনার প্রোফাইল বিবরণ সম্পূর্ণ করুন",

mf2title: "প্রস্তাব",
mf2desc: "চাষের প্রস্তাব জমা দিন বা দেখুন",

mf3title: "সমস্যা/আলোচনা",
mf3desc: "শর্তাবলী আলোচনা এবং নিয়ে কথাবার্তা",

mf4title: "ডিজিটাল চুক্তি",
mf4desc: "সুরক্ষিত ডিজিটাল চুক্তিতে স্বাক্ষর করুন",

mf5title: "সম্পদ বরাদ্দ",
mf5desc: "প্রাথমিক অর্থায়ন (৩০%)",

mf6title: "চাষাবাদের অগ্রগতি",
mf6desc: "মধ্য-চক্র অর্থপ্রদান (৩০%)",

mf7title: "ফসল ও অর্থপ্রদান",
mf7desc: "চূড়ান্ত নিষ্পত্তি (৪০%)",

rpTitle: "কৃষক-ক্রেতা চুক্তি তৈরি করুন",
rpSubtitle: "অংশীদারিত্ব স্থাপনের জন্য সহজ কর্মপ্রবাহ",
rpCreateBtn: "নতুন চুক্তি তৈরি করুন",

rpStepFarmer: "কৃষক",
rpStepProposal: "প্রস্তাব",
rpStepNegotiation: "আলোচনা",
rpStepAgreement: "চুক্তি",
rpStepFarming: "চাষাবাদ",
rpStepHarvest: "ফসল",
rpStepDelivery: "ডেলিভারি",

rpPay1: "প্রাথমিক সম্পদ অর্থায়ন",
rpPay2: "মধ্য-চাষ অর্থপ্রদান",
rpPay3: "চূড়ান্ত ফসল নিষ্পত্তি",

insightsTitle: "ডেটা ইনসাইটস",
insightsSubtitle: "প্ল্যাটফর্ম ব্যবহারের দ্রুত সংক্ষিপ্তসার",

insightFarmers: "মোট কৃষক",
insightBuyers: "মোট ক্রেতা",
insightDeals: "সক্রিয় চুক্তি",

boxCrops: "সমর্থিত ফসল",
boxDistricts: "শীর্ষ জেলা",
boxContracts: "চুক্তির অবস্থা",

footerDesc: "স্মার্ট কৃষির জন্য কৃষক এবং ক্রেতাদের সংযুক্ত করা।",
footerQuick: "দ্রুত লিঙ্ক",
footerHome: "হোম",
footerModules: "মডিউল",
footerAbout: "সম্পর্কে",
footerContact: "যোগাযোগ",
footerTerms: "সেবার শর্তাবলী",
footerPrivacy: "গোপনীয়তা নীতি",
footerInfo: "যোগাযোগের তথ্য",
footerAddress: "কলকাতা, পশ্চিমবঙ্গ, ভারত",
footerFollow: "আমাদের অনুসরণ করুন",
footerCopy: "© ২০২৫ Farm360. সর্বস্বত্ব সংরক্ষিত।",

navHome: "হোম",
navModules: "মডিউল",
navAbout: "সম্পর্কে",
navInsights: "ডেটা ইনসাইটস",
navSupport: "যোগাযোগ",
brandName: "Farm360",

chartCropDistribution: "ফসলের বণ্টন",
chartFarmersGrowth: "সময়ের সাথে কৃষকের বৃদ্ধি",
chartPopularCrops: "সর্বাধিক জনপ্রিয় ফসল",
chartRegionalContribution: "আঞ্চলিক অবদান",


  },
};


// ================================
// APPLY THEME
// ================================
function applyTheme(theme) {
  const body = document.body;

  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");

  currentTheme = theme;

  // Update icons
  const sun = document.querySelector(".icon-sun");
  const moon = document.querySelector(".icon-moon");

  if (sun && moon) {
    sun.style.display = theme === "light" ? "block" : "none";
    moon.style.display = theme === "dark" ? "block" : "none";
  }

  // Also update chart colors when theme changes
  updateChartsTheme();
}



// ================================
// APPLY LANGUAGE
// ================================
function applyLanguage(lang) {
  const body = document.body;

  body.classList.remove("lang-en", "lang-bn");
  body.classList.add(lang === "bn" ? "lang-bn" : "lang-en");

  currentLanguage = lang;
}


// ================================
// TRANSLATION UPDATE FUNCTION
// ================================
function updateTranslatedText() {
  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.getAttribute("data-text");
    const text = translations[currentLanguage][key];

    if (text !== undefined) {
      el.textContent = text;
    }
  });
}


// ================================
// TOGGLE THEME
// ================================
function toggleTheme() {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
}


// ================================
// TOGGLE LANGUAGE
// ================================
function toggleLanguage() {
  const newLang = currentLanguage === "en" ? "bn" : "en";

  applyLanguage(newLang);
  updateTranslatedText();

  // Update all language toggle buttons
  const allLangBtns = document.querySelectorAll("#langToggle, #mobileLangToggle, #footerLangToggle");
  allLangBtns.forEach(btn => {
    btn.textContent = newLang === "en" ? "বাংলা" : "English";
  });
}


// ================================
// MOBILE MENU
// ================================
function toggleMobileMenu() {
  mobileMenu.style.display =
    mobileMenu.style.display === "flex" ? "none" : "flex";
}


// ================================
// EVENT LISTENERS
// ================================
const themeToggle = document.getElementById("themeToggle");
const mobileThemeToggle = document.getElementById("mobileThemeToggle");
const langToggle = document.getElementById("langToggle");
const mobileLangToggle = document.getElementById("mobileLangToggle");
const footerLangToggle = document.getElementById("footerLangToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

// Theme toggles
themeToggle?.addEventListener("click", toggleTheme);
mobileThemeToggle?.addEventListener("click", toggleTheme);

// Language toggles
langToggle?.addEventListener("click", toggleLanguage);
mobileLangToggle?.addEventListener("click", toggleLanguage);
footerLangToggle?.addEventListener("click", toggleLanguage);

// Mobile menu
mobileMenuBtn?.addEventListener("click", toggleMobileMenu);


// ================================
// INITIAL LOAD
// ================================
window.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  updateTranslatedText();
  initCharts();
});

// ================================
// CHART COLOR HELPERS
// ================================
function getChartColors() {
  const styles = getComputedStyle(document.body);
  const textColor =
    styles.getPropertyValue("--card-foreground").trim() ||
    styles.getPropertyValue("--foreground").trim() ||
    "#111827";

  const borderVar = styles.getPropertyValue("--border").trim();
  const gridColor =
    borderVar && borderVar !== "initial"
      ? borderVar
      : "rgba(148, 163, 184, 0.35)";

  return { textColor, gridColor };
}

function updateChartsTheme() {
  if (!charts || charts.length === 0) return;

  const styles = getComputedStyle(document.body);

  const textColor =
    styles.getPropertyValue("--foreground").trim() ||
    styles.getPropertyValue("--card-foreground").trim() ||
    "#ffffff";

  const gridColor =
    styles.getPropertyValue("--border").trim() ||
    "rgba(255, 255, 255, 0.15)";

  charts.forEach((chart) => {

    // AXIS COLORS
    if (chart.options.scales) {
      Object.keys(chart.options.scales).forEach((axisId) => {
        const axis = chart.options.scales[axisId];
        axis.ticks.color = textColor;
        axis.grid.color = gridColor;
      });
    }

    // LEGEND COLORS
    if (chart.options.plugins?.legend?.labels) {
      chart.options.plugins.legend.labels.color = textColor;
    }

    // TITLE COLORS
    if (chart.options.plugins?.title) {
      chart.options.plugins.title.color = textColor;
    }

    // TOOLTIP COLORS
    if (chart.options.plugins?.tooltip) {
      chart.options.plugins.tooltip.titleColor = textColor;
      chart.options.plugins.tooltip.bodyColor = textColor;
      chart.options.plugins.tooltip.footerColor = textColor;
      chart.options.plugins.tooltip.backgroundColor =
        styles.getPropertyValue("--card").trim() || "#0f172a";
    }

    chart.update();
  });
}


// ================================
// INIT CHARTS
// ================================
function initCharts() {
  const cropCanvas = document.getElementById("cropDistributionChart");
  if (!cropCanvas || typeof Chart === "undefined") return;

  const farmersCanvas = document.getElementById("farmersGrowthChart");
  const popularCanvas = document.getElementById("popularCropsChart");
  const regionalCanvas = document.getElementById("regionalContributionChart");

  const { textColor, gridColor } = getChartColors();

  // Clear previous instances if re-initialised
  charts.forEach((c) => c.destroy());
  charts = [];

  // 1) Crop Distribution - Pie
  const cropChart = new Chart(cropCanvas, {
    type: "pie",
    data: {
      labels: ["Rice 35%", "Wheat 20%", "Potato 18%", "Jute 15%", "Vegetables 12%"],
      datasets: [
        {
          data: [35, 20, 18, 15, 12],
          backgroundColor: ["#22c55e", "#facc15", "#fb923c", "#3b82f6", "#10b981"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "right",
          labels: { color: textColor },
        },
      },
    },
  });
  charts.push(cropChart);

  // 2) Farmers Growth - Line
  const farmersChart = new Chart(farmersCanvas, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Farmers",
          data: [9000, 9600, 10100, 10600, 11200, 12500],
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
      },
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
    },
  });
  charts.push(farmersChart);

  // 3) Popular Crops - Vertical Bar
  const popularChart = new Chart(popularCanvas, {
    type: "bar",
    data: {
      labels: ["Rice", "Wheat", "Jute", "Potato", "Vegetables"],
      datasets: [
        {
          label: "Production (tons)",
          data: [4300, 2600, 1800, 2100, 1500],
          backgroundColor: "#22c55e",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: "transparent" },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
      },
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
    },
  });
  charts.push(popularChart);

  // 4) Regional Contribution - Horizontal Bar
  const regionalChart = new Chart(regionalCanvas, {
    type: "bar",
    data: {
      labels: ["North Bengal", "South Bengal", "Coastal", "Central"],
      datasets: [
        {
          label: "Contribution (tons)",
          data: [4200, 5100, 2700, 3500],
          backgroundColor: "#3b82f6",
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: "transparent" },
        },
      },
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
    },
  });
  charts.push(regionalChart);
}
