/* ============================
   GLOBAL STATE
============================ */
let currentLanguage = "en";
let serverCaptcha = "";

/* ============================
   TRANSLATIONS
============================ */
const text = {
  en: {
    loginTitle: "Login",
    loginSubtitle: "Access your Farm360 account.",
    labelPhone: "Phone Number",
    labelCaptcha: "Captcha",
    btnLogin: "Login",
    btnClear: "Clear",
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
    goRegisterText: "অ্যাকাউন্ট নেই?",
    backBtn: "‹ ফিরে যান",
  }
};

function updateText() {
  document.querySelectorAll("[data-text]").forEach(el => {
    el.textContent = text[currentLanguage][el.dataset.text];
  });
}
updateText();

/* ============================
   LANGUAGE TOGGLE
============================ */
document.getElementById("langToggle").onclick = () => {
  currentLanguage = currentLanguage === "en" ? "bn" : "en";
  document.body.classList.toggle("lang-bn");

  document.getElementById("langToggle").textContent =
    currentLanguage === "en" ? "বাংলা" : "English";

  updateText();
};

/* ============================
   THEME TOGGLE
============================ */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("theme-dark");
};

/* ============================
   CAPTCHA FROM BACKEND
============================ */
async function loadCaptcha() {
  const phone = document.getElementById("phone").value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    serverCaptcha = "";
    document.getElementById("captchaText").textContent = "-----";
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/auth/captcha/${phone}`);
    serverCaptcha = await res.text();
    document.getElementById("captchaText").textContent = serverCaptcha;
  } catch (err) {
    document.getElementById("captchaText").textContent = "Error";
  }
}

/* Load captcha when phone becomes 10 digits */
document.getElementById("phone").addEventListener("input", () => {
  const phone = document.getElementById("phone").value.trim();
  if (phone.length === 10) loadCaptcha();
  else document.getElementById("captchaText").textContent = "-----";
});

/* Refresh button reloads captcha */
document.getElementById("refreshCaptcha").onclick = loadCaptcha;

/* ============================
   LOGIN HANDLING
============================ */
const form = document.getElementById("loginForm");
const phoneErr = document.getElementById("phoneErr");
const captchaErr = document.getElementById("captchaErr");
const captchaInput = document.getElementById("captchaInput");
const msg = document.getElementById("msg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  phoneErr.textContent = "";
  captchaErr.textContent = "";
  msg.textContent = "";

  const phone = document.getElementById("phone").value.trim();
  const captcha = captchaInput.value.trim().toUpperCase();

  // Phone validation
  if (!/^[0-9]{10}$/.test(phone)) {
    phoneErr.textContent =
      currentLanguage === "en" ? "Enter valid phone number" : "সঠিক ফোন নম্বর দিন";
    return;
  }

  // Captcha validation (match backend captcha)
  if (captcha !== serverCaptcha) {
    captchaErr.textContent =
      currentLanguage === "en" ? "Incorrect captcha" : "ক্যাপচা ভুল";
    return;
  }

  // SEND LOGIN REQUEST TO BACKEND
  try {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, captcha })
    });

    if (!res.ok) {
      msg.style.color = "red";
      msg.textContent =
        currentLanguage === "en" ? "Login failed" : "লগইন ব্যর্থ হয়েছে";
      return;
    }

    const data = await res.json();

    // SAVE LOGIN SESSION
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("role", data.role);

    msg.style.color = "green";
    msg.textContent =
      currentLanguage === "en" ? "Login Successful!" : "লগইন সফল হয়েছে!";

    // REDIRECT BASED ON USER ROLE
    setTimeout(() => {

      const role = data.role?.toLowerCase(); 

      if (role === "pending") {
        window.location.href = "../Registration/user-register.html";
      } else if (role === "farmer") {
        window.location.href = "../Farmer/Farmer-Dashboard/farmer-dashboard.html";
      } else if (role === "buyer") {
        window.location.href = "../Buyer/Buyer-Dashboard/buyer-dashboard.html";
      }
    }, 1000);
  } catch (err) {
    msg.style.color = "red";
    msg.textContent =
      currentLanguage === "en" ? "Server error" : "সার্ভার ত্রুটি";
  }
});

/* ============================
   CLEAR BUTTON
============================ */
document.getElementById("clearBtn").onclick = () => {
  form.reset();
  phoneErr.textContent = "";
  captchaErr.textContent = "";
  msg.textContent = "";
  document.getElementById("captchaText").textContent = "-----";
  serverCaptcha = "";
};
