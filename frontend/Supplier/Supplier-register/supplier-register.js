// ===== LANGUAGE TRANSLATION FUNCTION =====
function translatePage(lang) {
    const elements = document.querySelectorAll('[data-en][data-bn]');
    elements.forEach(element => {
        if (lang === 'bn') {
            element.textContent = element.getAttribute('data-bn');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
}

// ===== LOAD ALL MASTER DATA FROM BACKEND =====
document.addEventListener('DOMContentLoaded', function() {
    loadDistricts();
    setupLocationListeners();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('theme-dark');
    }
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'bn') {
        document.body.classList.add('lang-bn');
        document.getElementById('langToggle').textContent = 'English';
        translatePage('bn');
    } else {
        document.getElementById('langToggle').textContent = 'বাংলা';
        translatePage('en');
    }

    // Debug: Check what tokens are in localStorage
    console.log('Available localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key + ':', localStorage.getItem(key));
    }
});

function loadDistricts() {
    fetch('http://localhost:8080/master/districts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch districts');
            }
            return response.json();
        })
        .then(districts => {
            const districtSelect = document.getElementById('districtId');
            districtSelect.innerHTML = '<option value="">Select District</option>';
            
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.id;
                option.textContent = district.name;
                option.setAttribute('data-en', district.name);
                option.setAttribute('data-bn', district.name);
                districtSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading districts:', error);
            document.getElementById('message').innerText = 'Error loading districts';
            document.getElementById('message').className = 'error';
        });
}

function loadBlocks(districtId) {
    if (!districtId) {
        document.getElementById('blockId').innerHTML = '<option value="">Select Block</option>';
        document.getElementById('cityId').innerHTML = '<option value="">Select City</option>';
        return;
    }

    fetch(`http://localhost:8080/master/blocks/${districtId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch blocks');
            }
            return response.json();
        })
        .then(blocks => {
            const blockSelect = document.getElementById('blockId');
            blockSelect.innerHTML = '<option value="">Select Block</option>';
            
            blocks.forEach(block => {
                const option = document.createElement('option');
                option.value = block.id;
                option.textContent = block.name;
                option.setAttribute('data-en', block.name);
                option.setAttribute('data-bn', block.name);
                blockSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading blocks:', error);
        });
}

function loadCities(blockId) {
    if (!blockId) {
        document.getElementById('cityId').innerHTML = '<option value="">Select City</option>';
        return;
    }

    fetch(`http://localhost:8080/master/cities/${blockId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }
            return response.json();
        })
        .then(cities => {
            const citySelect = document.getElementById('cityId');
            citySelect.innerHTML = '<option value="">Select City</option>';
            
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.id;
                option.textContent = city.name;
                option.setAttribute('data-en', city.name);
                option.setAttribute('data-bn', city.name);
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading cities:', error);
        });
}

function setupLocationListeners() {
    document.getElementById('districtId').addEventListener('change', function(e) {
        loadBlocks(e.target.value);
    });

    document.getElementById('blockId').addEventListener('change', function(e) {
        loadCities(e.target.value);
    });
}

// ===== FORM SUBMISSION WITH AUTHENTICATION =====
document.getElementById("supplierRegisterForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const userId = localStorage.getItem("userId");
        if (!userId) {
            showMessage("User not found. Please login again.", "error");
            return;
        }

        // Get token from localStorage (try different common key names)
        const token = localStorage.getItem("token") || 
                     localStorage.getItem("jwt") || 
                     localStorage.getItem("accessToken") ||
                     localStorage.getItem("authToken");
        
        if (!token) {
            showMessage("No authentication token found. Please login again.", "error");
            console.error('No token found in localStorage. Available keys:', Object.keys(localStorage));
            return;
        }

        // Get and validate form values
        const supplierName = document.getElementById("supplierName").value.trim();
        if (!supplierName) {
            showMessage("Please enter supplier name", "error");
            return;
        }

        const businessName = document.getElementById("businessName").value.trim();
        if (!businessName) {
            showMessage("Please enter business name", "error");
            return;
        }

        const districtId = parseInt(document.getElementById("districtId").value);
        if (!districtId) {
            showMessage("Please select a district", "error");
            return;
        }

        const blockId = parseInt(document.getElementById("blockId").value);
        if (!blockId) {
            showMessage("Please select a block", "error");
            return;
        }

        const cityId = parseInt(document.getElementById("cityId").value);
        if (!cityId) {
            showMessage("Please select a city", "error");
            return;
        }

        const village = document.getElementById("village").value.trim();
        if (!village) {
            showMessage("Please enter village", "error");
            return;
        }

        const pinCode = document.getElementById("pinCode").value.trim();
        if (!pinCode) {
            showMessage("Please enter pin code", "error");
            return;
        }

        const supplierType = document.getElementById("supplierType").value;
        if (!supplierType) {
            showMessage("Please select supplier type", "error");
            return;
        }

        const panNumber = document.getElementById("panNumber").value.trim().toUpperCase();
        if (!panNumber) {
            showMessage("Please enter PAN number", "error");
            return;
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
            showMessage("Please enter a valid PAN number (e.g., ABCDE1234F)", "error");
            return;
        }

        let gstNumber = document.getElementById("gstNumber").value.trim().toUpperCase();
        if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
            showMessage("Please enter a valid GST number or leave empty", "error");
            return;
        }
        gstNumber = gstNumber || null;

        const bankAccountNo = document.getElementById("bankAccountNo").value.trim();
        if (!bankAccountNo) {
            showMessage("Please enter bank account number", "error");
            return;
        }
        if (bankAccountNo.length < 9) {
            showMessage("Bank account number must be at least 9 characters", "error");
            return;
        }

        // Prepare data for backend
        const supplierData = {
            supplierName: supplierName,
            businessName: businessName,
            districtId: districtId,
            blockId: blockId,
            cityId: cityId,
            village: village,
            pinCode: pinCode,
            supplierType: supplierType,
            panNumber: panNumber,
            gstNumber: gstNumber,
            bankAccountNo: bankAccountNo
        };

        console.log('Sending data:', supplierData);
        console.log('Using token:', token.substring(0, 20) + '...');

        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;

        fetch(`http://localhost:8080/supplier/register/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(supplierData)
        })
        .then(async response => {
            const responseText = await response.text();
            console.log('Response status:', response.status);
            console.log('Response body:', responseText);
            
            if (!response.ok) {
                let errorMessage = `Registration failed (${response.status})`;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch(e) {
                    errorMessage = responseText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            try {
                return JSON.parse(responseText);
            } catch(e) {
                return { message: responseText };
            }
        })
        .then(data => {
            console.log('Success:', data);
            showMessage("Supplier registered successfully. Awaiting verification.", "success");
            
            // Show success popup
            const popupOverlay = document.getElementById('popupOverlay');
            if (popupOverlay) {
                document.getElementById('popupIcon').textContent = '✅';
                document.getElementById('popupIcon').className = 'popup-icon popup-success';
                document.getElementById('popupMessage').innerText = 'Registration Successful!';
                popupOverlay.classList.remove('hidden');
            }
            
            // Reset form after success
            document.getElementById("supplierRegisterForm").reset();
            document.getElementById('blockId').innerHTML = '<option value="">Select Block</option>';
            document.getElementById('cityId').innerHTML = '<option value="">Select City</option>';
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(error.message, "error");
            
            // Show error popup
            const popupOverlay = document.getElementById('popupOverlay');
            if (popupOverlay) {
                document.getElementById('popupIcon').textContent = '❌';
                document.getElementById('popupIcon').className = 'popup-icon popup-error';
                document.getElementById('popupMessage').innerText = error.message;
                popupOverlay.classList.remove('hidden');
            }
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

// Helper function to show messages
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.innerText = text;
    messageEl.className = type;
    messageEl.classList.remove('hidden');
}

// ===== THEME + LANGUAGE TOGGLE =====
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('theme-dark');
    localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
});

document.getElementById('langToggle').addEventListener('click', function() {
    document.body.classList.toggle('lang-bn');
    const isBengali = document.body.classList.contains('lang-bn');
    this.textContent = isBengali ? 'English' : 'বাংলা';
    translatePage(isBengali ? 'bn' : 'en');
    localStorage.setItem('language', isBengali ? 'bn' : 'en');
});

// Modal popup close functionality
document.getElementById('popupClose')?.addEventListener('click', function() {
    document.getElementById('popupOverlay').classList.add('hidden');
});

document.getElementById('popupOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});