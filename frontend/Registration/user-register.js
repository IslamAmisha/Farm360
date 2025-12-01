/* LANGUAGE ------------------------------ */
let currentLanguage = "en";

const text = {
  en: {
    regTitle: "Create Your Account",
    regSubtitle: "Register to buy or sell agricultural products.",
    labelPhone: "Phone Number",
    labelRole: "Role",
    roleSelect: "Select your role",
    roleFarmer: "Farmer",
    roleBuyer: "Buyer",
    btnRegister: "Register",
    btnClear: "Clear",
    termsHint: "By registering you agree to our terms.",
    backBtn: "‹ Back",

  },
  bn: {
    regTitle: "আপনার অ্যাকাউন্ট তৈরি করুন",
    regSubtitle: "কেনা-বেচার জন্য নিবন্ধন করুন।",
    labelPhone: "ফোন নম্বর",
    labelRole: "ভূমিকা",
    roleSelect: "ভূমিকা নির্বাচন করুন",
    roleFarmer: "কৃষক",
    roleBuyer: "ক্রেতা",
    btnRegister: "নিবন্ধন",
    btnClear: "মুছে ফেলুন",
    termsHint: "নিবন্ধন করে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।",
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

/* THEME SWITCH ------------------------------ */
let theme = "light";

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("theme-dark");

  theme = theme === "light" ? "dark" : "light";
};

/* FORM VALIDATION ------------------------------ */
const form = document.getElementById("registerForm");
const phone = document.getElementById("phone");
const role = document.getElementById("role");
const phoneErr = document.getElementById("phoneErr");
const roleErr = document.getElementById("roleErr");
const msg = document.getElementById("msg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  phoneErr.textContent = "";
  roleErr.textContent = "";
  msg.textContent = "";

  let valid = true;

  if (!/^\+?\d{7,15}$/.test(phone.value.trim())) {
    phoneErr.textContent = currentLanguage === "en"
      ? "Enter a valid phone number."
      : "সঠিক ফোন নম্বর দিন।";
    valid = false;
  }

  if (!role.value) {
    roleErr.textContent = currentLanguage === "en"
      ? "Select a role."
      : "ভূমিকা নির্বাচন করুন।";
    valid = false;
  }

  if (!valid) return;

  msg.style.color = "green";
  msg.textContent =
    currentLanguage === "en"
      ? "Registration successful!"
      : "নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!";

  form.reset();
});

// inside user-register.js after successful basic registration
const selectedRole = role.value;

setTimeout(function () {
  if (selectedRole === "farmer") {
    window.location.href = "../Farmer-register/farmer-register.html";
  } else if (selectedRole === "buyer") {
    window.location.href = "../Buyer-register/buyer-register.html";
  }
}, 1500);
