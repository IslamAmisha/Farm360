/* LANGUAGE ------------------------------ */
let currentLanguage = "en";

const text = {
  en: {
    loginTitle: "Login",
    loginSubtitle: "Access your Farm360 account.",
    labelPhone: "Phone Number",
    labelCaptcha: "Captcha",
    btnLogin: "Login",
    btnClear: "Clear",
    footerHint: "Don't have an account? Register first.",
    goRegisterText: "Don’t have an account?",
    backBtn: "‹ Back",

  },
  bn: {
    loginTitle: "লগইন",
    loginSubtitle: "আপনার Farm360 অ্যাকাউন্টে প্রবেশ করুন।",
    labelPhone: "ফোন নম্বর",
    labelCaptcha: "ক্যাপচা",
    btnLogin: "লগইন",
    btnClear: "মুছে ফেলুন",
    footerHint: "অ্যাকাউন্ট নেই? আগে রেজিস্টার করুন।",
    goRegisterText: "অ্যাকাউন্ট নেই?",
    backBtn: "‹ ফিরে যান",

  }
};

function updateText() {
  document.querySelectorAll("[data-text]").forEach(el => {
    el.textContent = text[currentLanguage][el.dataset.text];
  });
}

document.getElementById("langToggle").onclick = () => {
  currentLanguage = currentLanguage === "en" ? "bn" : "en";
  document.body.classList.toggle("lang-bn");

  document.getElementById("langToggle").textContent =
    currentLanguage === "en" ? "বাংলা" : "English";

  updateText();
};

updateText();

/* THEME ------------------------------ */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("theme-dark");
};

/* CAPTCHA ------------------------------ */
function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

let currentCaptcha = "";

function refreshCaptcha() {
  currentCaptcha = generateCaptcha();
  document.getElementById("captchaText").textContent = currentCaptcha;
}

document.getElementById("refreshCaptcha").onclick = refreshCaptcha;
refreshCaptcha();

/* FORM VALIDATION ------------------------------ */
const form = document.getElementById("loginForm");
const phone = document.getElementById("phone");
const captchaInput = document.getElementById("captchaInput");
const phoneErr = document.getElementById("phoneErr");
const captchaErr = document.getElementById("captchaErr");
const msg = document.getElementById("msg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  phoneErr.textContent = "";
  captchaErr.textContent = "";
  msg.textContent = "";

  let valid = true;

  if (!/^\+?\d{7,15}$/.test(phone.value.trim())) {
    phoneErr.textContent =
      currentLanguage === "en" ? "Enter a valid phone number." : "সঠিক ফোন নম্বর দিন।";
    valid = false;
  }

  if (captchaInput.value.trim().toUpperCase() !== currentCaptcha) {
    captchaErr.textContent =
      currentLanguage === "en" ? "Incorrect captcha." : "ক্যাপচা সঠিক নয়।";
    valid = false;
  }

  if (!valid) return;

  msg.style.color = "green";
  msg.textContent =
    currentLanguage === "en" ? "Login successful!" : "লগইন সফল হয়েছে!";

  form.reset();
  refreshCaptcha();

  setTimeout(() => {
    window.location.href = "../Dashboard/dashboard.html";
  }, 1500);
});
