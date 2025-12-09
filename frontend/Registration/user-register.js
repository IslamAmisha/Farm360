//LANGUAGE 
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
    btnNext: "Next",
    btnVerify: "Verify OTP",
    labelOtp: "OTP",
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
    btnNext: "পরবর্তী",
    btnVerify: "ওটিপি যাচাই",
    labelOtp: "ওটিপি",
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

//THEME SWITCH 
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("theme-dark");
};


const BASE_URL = "http://localhost:8080";  

//element
const form = document.getElementById("registerForm");
const phone = document.getElementById("phone");
const otp = document.getElementById("otp");
const role = document.getElementById("role");

const phoneErr = document.getElementById("phoneErr");
const otpErr = document.getElementById("otpErr");
const roleErr = document.getElementById("roleErr");

const verifyBtn = document.getElementById("verifyBtn");
const msg = document.getElementById("msg");

let sessionId = null;

//send otp
verifyBtn.addEventListener("click", async () => {
  phoneErr.textContent = "";
  msg.textContent = "";

  const phoneNumber = phone.value.trim();

  if (!/^\d{10}$/.test(phoneNumber)) {
    phoneErr.textContent = "Enter valid 10-digit phone number";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber })
    });

    const data = await res.json();

    if (data.status !== "Success") {
      msg.style.color = "red";
      msg.textContent = "OTP sending failed";
      return;
    }

    sessionId = data.sessionId;

    msg.style.color = "green";
    msg.textContent = "OTP sent successfully!";
    otp.focus();

  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Network error: " + err.message;
  }
});

//verify otp,role,register
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  phoneErr.textContent = "";
  otpErr.textContent = "";
  roleErr.textContent = "";
  msg.textContent = "";

  const phoneNumber = phone.value.trim();
  const otpValue = otp.value.trim();
  const roleValue = role.value.trim();

  // VALIDATION
  if (!/^\d{10}$/.test(phoneNumber)) {
    phoneErr.textContent = "Invalid phone number";
    return;
  }

  if (!sessionId) {
    otpErr.textContent = "Click VERIFY to get OTP first";
    return;
  }

  if (!otpValue) {
    otpErr.textContent = "Enter OTP";
    return;
  }

  if (!roleValue) {
    roleErr.textContent = "Select a role";
    return;
  }

  // CALL OTP VERIFY API
  try {
    const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phoneNumber,
        otp: otpValue,
        sessionId: sessionId
      })
    });

    const data = await res.json();

    if (!data.verified) {
      otpErr.textContent = "Incorrect OTP";
      return;
    }

    // OTP SUCCESS
    msg.style.color = "green";
    msg.textContent = "OTP verified successfully";

    // SAVE USER ID LOCALLY
    localStorage.setItem("userId", data.userId);

    // If existing user → save token + role
    if (data.alreadyRegistered === true) {
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("role", data.role);
    }

    // NEW user must save selected role via frontend
    localStorage.setItem("selectedRole", roleValue);

    // REDIRECT TO NEXT PAGE
    setTimeout(() => {
      if (roleValue === "farmer") {
        window.location.href = "../Farmer/Farmer-register/farmer-register.html";
      } else {
        window.location.href = "../Buyer/Buyer-register/buyer-register.html";
      }
    }, 900);

  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Network error: " + err.message;
  }
});

//clear button
document.getElementById("clearBtn").addEventListener("click", () => {
  form.reset();
  phoneErr.textContent = "";
  otpErr.textContent = "";
  roleErr.textContent = "";
  msg.textContent = "";
  sessionId = null;
});
