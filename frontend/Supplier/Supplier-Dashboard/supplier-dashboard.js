/* Supplier Dashboard logic — mirrors Farmer dashboard structure but replaces
	 the middle content with supplier-specific workflow (requests, deliveries, bills) */
(function protectSupplierDashboard() {
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

function logoutUser() {
	const token = localStorage.getItem("token");

	fetch("http://localhost:8080/auth/logout", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + token,
		},
	}).finally(() => {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = "../../Login/login.html";
	});
}

const dashboardTranslations = {
	en: {
		dashboardTitle: "Overview",
		dashboardSubtitle: "Manage incoming supply requests, deliveries and bills.",

		summaryActiveDeliveries: "Active Deliveries",
		summaryBillsSubmitted: "Bills Submitted",
		summaryCompletedJobs: "Completed Jobs",
		summaryTotalEarnings: "Total Earnings",

		incomingRequestsTitle: "Incoming Supply Requests",
		incomingRequestsSubtitle: "Requests broadcast to your supplier type.",
		activeDeliveriesTitle: "My Active Deliveries",
		activeDeliveriesSubtitle: "Track delivery, billing and payment status.",

		requestDetailsTitle: "Request Details",
		btnViewDetails: "View Details",
		btnAcceptRequest: "Accept Request",
		verificationPendingBadge: "Verification Pending",

		labelContractId: "Contract ID",
		labelBuyerName: "Buyer",
		labelFarmerName: "Farmer",
		labelCropName: "Crop",
		labelRequiredQty: "Required Quantity",
		labelPhase: "Phase",
		labelDeadline: "Delivery Deadline",
		labelLocation: "Delivery Location",
		labelPhaseAmount: "Phase Amount",

		btnUploadProof: "Upload Delivery Proof",
		btnSubmitBill: "Submit Bill",
		btnWaitingApproval: "Waiting for Approval",
		btnViewReceipt: "View Receipt",

		billModalTitle: "Submit Bill",
		labelAmount: "Amount (₹)",
		labelInvoice: "Upload Invoice / Bill",
		btnCancel: "Cancel",
		btnSubmitBill: "Submit Bill",

		msgNoRequests: "No supply requests at the moment.",
		msgNoDeliveries: "You have no active deliveries.",
		msgActionFailed: "Action failed. Please try again.",
		msgActionSuccess: "Action completed successfully.",
	},

	bn: {
		dashboardTitle: "ওভারভিউ",
		dashboardSubtitle: "সাপ্লাই অনুরোধ, ডেলিভারি এবং বিলগুলো এখানে পরিচালনা করুন।",

		summaryActiveDeliveries: "সক্রিয় ডেলিভারি",
		summaryBillsSubmitted: "জমা দেয়া বিল",
		summaryCompletedJobs: "সম্পূর্ণ কাজ",
		summaryTotalEarnings: "মোট আয়",

		incomingRequestsTitle: "আসন্ন সাপ্লাই অনুরোধ",
		incomingRequestsSubtitle: "আপনার প্রোফাইল টাইপ অনুযায়ী অনুরোধগুলো।",
		activeDeliveriesTitle: "আমার সক্রিয় ডেলিভারি",
		activeDeliveriesSubtitle: "ডেলিভারি, বিল ও পেমেন্ট ট্র্যাক করুন।",

		requestDetailsTitle: "অনুরোধের বিবরণ",
		btnViewDetails: "বিস্তারিত",
		btnAcceptRequest: "অনুরোধ গ্রহণ করুন",
		verificationPendingBadge: "ভেরিফিকেশন অপেক্ষাধীন",

		labelContractId: "চুক্তি আইডি",
		labelBuyerName: "ক্রেতা",
		labelFarmerName: "কৃষক",
		labelCropName: "ফসল",
		labelRequiredQty: "প্রয়োজনীয় পরিমাণ",
		labelPhase: "ফেজ",
		labelDeadline: "ডেলিভারি শেষ সময়",
		labelLocation: "ডেলিভারি অবস্থান",
		labelPhaseAmount: "ফেজ অর্থ",

		btnUploadProof: "ডেলিভারি প্রুফ আপলোড",
		btnSubmitBill: "বিল জমা দিন",
		btnWaitingApproval: "অনুমোদনের অপেক্ষায়",
		btnViewReceipt: "রসিদ দেখুন",

		billModalTitle: "বিল জমা দিন",
		labelAmount: "পরিমাণ (₹)",
		labelInvoice: "ইনভয়েস আপলোড করুন",
		btnCancel: "বাতিল",
		btnSubmitBill: "বিল জমা দিন",

		msgNoRequests: "কোনো অনুরোধ পাওয়া যায়নি।",
		msgNoDeliveries: "কোনো সক্রিয় ডেলিভারি নেই।",
		msgActionFailed: "ক্রিয়া ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
		msgActionSuccess: "ক্রিয়া সফল হয়েছে।",
	},
};

// Merge with global translations if present
if (typeof translations !== "undefined") {
	Object.assign(translations.en, dashboardTranslations.en);
	Object.assign(translations.bn, dashboardTranslations.bn);
}

const API_BASE_URL = "http://localhost:8080";

let requestDetailsModal, requestDetailsBody, requestModalCloseBtn;
let billModal, billModalCloseBtn, submitBillBtn, cancelBillBtn;
let supplierVerificationStatus = "VERIFIED"; // default until overview says otherwise
let currentBillDelivery = null;

function getDashText() {
	const lang = window.currentLanguage || "en";
	const t = (window.translations && window.translations[lang]) || dashboardTranslations[lang];
	return { lang, t };
}

function getAuthInfo() {
	return {
		token: localStorage.getItem("token"),
		userId: localStorage.getItem("userId"),
		role: localStorage.getItem("role"),
	};
}

function formatCurrency(n) {
	try {
		return "₹" + Number(n || 0).toLocaleString();
	} catch (e) {
		return "₹0";
	}
}

function renderSummary(overview = {}) {
	document.getElementById("summaryActiveDeliveriesValue").textContent = overview.activeDeliveries || 0;
	document.getElementById("summaryBillsSubmittedValue").textContent = overview.billsSubmitted || 0;
	document.getElementById("summaryCompletedJobsValue").textContent = overview.completedJobs || 0;
	document.getElementById("summaryTotalEarningsValue").textContent = formatCurrency(overview.totalEarnings || 0);

	supplierVerificationStatus = overview.verificationStatus || supplierVerificationStatus;
}

function renderIncomingRequests(list) {
	const { t } = getDashText();
	const container = document.getElementById("requestsGrid");
	if (!container) return;

	if (!list || list.length === 0) {
		container.innerHTML = `
			<div class="buyer-card empty-card">
				<p>${t.msgNoRequests}</p>
			</div>
		`;
		return;
	}

	container.innerHTML = "";

	list.forEach((r) => {
		const card = document.createElement("div");
		card.className = "buyer-card request-card";

		const verificationBadge = supplierVerificationStatus === "PENDING"
			? `<span class="warning-badge">${t.verificationPendingBadge}</span>`
			: "";

		card.innerHTML = `
			<div class="card-row">
				<div>
					<div class="detail-row"><div class="detail-label">${t.labelContractId}</div><div class="detail-value">${r.contractId || r.id || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelBuyerName}</div><div class="detail-value">${r.buyerName || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelFarmerName}</div><div class="detail-value">${r.farmerName || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelCropName}</div><div class="detail-value">${r.cropName || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelRequiredQty}</div><div class="detail-value">${r.requiredQuantity || '-'}</div></div>
				</div>

				<div style="min-width:200px;text-align:right;">
					<div class="detail-row"><div class="detail-label">${t.labelPhase}</div><div class="detail-value">${r.phase || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelDeadline}</div><div class="detail-value">${r.deadline || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelLocation}</div><div class="detail-value">${r.location || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelPhaseAmount}</div><div class="detail-value">${formatCurrency(r.phaseAmount || 0)}</div></div>
					<div style="margin-top:8px;">
						<button class="btn-details btn-view">${t.btnViewDetails}</button>
						<button class="btn-request btn-accept" ${supplierVerificationStatus === 'PENDING' ? 'disabled' : ''}>${t.btnAcceptRequest}</button>
						${verificationBadge}
					</div>
				</div>
			</div>
		`;

		const viewBtn = card.querySelector('.btn-view');
		const acceptBtn = card.querySelector('.btn-accept');

		viewBtn?.addEventListener('click', () => openRequestDetailsModal(r));

		acceptBtn?.addEventListener('click', async () => {
			acceptBtn.disabled = true;
			try {
				const { token, userId } = getAuthInfo();
				const resp = await fetch(`${API_BASE_URL}/supplier/requests/${encodeURIComponent(r.id || r.contractId)}/accept`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
					body: JSON.stringify({ supplierUserId: userId })
				});

				if (!resp.ok) throw new Error('accept-failed');
				alert(t.msgActionSuccess);
				loadSupplierData();
			} catch (err) {
				console.error(err);
				alert(t.msgActionFailed);
				acceptBtn.disabled = false;
			}
		});

		container.appendChild(card);
	});

	if (typeof updateTranslatedText === 'function') updateTranslatedText();
}

function openRequestDetailsModal(r) {
	if (!requestDetailsModal || !requestDetailsBody) return;
	const { t } = getDashText();

	requestDetailsBody.innerHTML = `
		<div class="section-header">${t.requestDetailsTitle}</div>
		<div class="info-card">
			<div class="details-grid">
				<div class="detail-row"><div class="detail-label">${t.labelContractId}</div><div class="detail-value">${r.contractId || r.id || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelBuyerName}</div><div class="detail-value">${r.buyerName || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelFarmerName}</div><div class="detail-value">${r.farmerName || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelCropName}</div><div class="detail-value">${r.cropName || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelRequiredQty}</div><div class="detail-value">${r.requiredQuantity || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelPhase}</div><div class="detail-value">${r.phase || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelDeadline}</div><div class="detail-value">${r.deadline || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelLocation}</div><div class="detail-value">${r.location || '-'}</div></div>
				<div class="detail-row"><div class="detail-label">${t.labelPhaseAmount}</div><div class="detail-value">${formatCurrency(r.phaseAmount || 0)}</div></div>
			</div>
		</div>
	`;

	requestDetailsModal.hidden = false;
}

function closeRequestDetailsModal() { if (requestDetailsModal) requestDetailsModal.hidden = true; }

function renderActiveDeliveries(list) {
	const { t } = getDashText();
	const container = document.getElementById('activeDeliveriesGrid');
	if (!container) return;

	if (!list || list.length === 0) {
		container.innerHTML = `<div class="buyer-card empty-card"><p>${t.msgNoDeliveries}</p></div>`;
		return;
	}

	container.innerHTML = '';

	list.forEach(d => {
		const card = document.createElement('div');
		card.className = 'buyer-card delivery-card';

		const deliveryStatus = d.deliveryStatus || d.status || 'N/A';
		const billStatus = d.billStatus || 'NONE';
		const paymentStatus = d.paymentStatus || 'PENDING';

		let actionBtn = '';
		if (deliveryStatus.toUpperCase() === 'ACCEPTED') {
			actionBtn = `<button class="btn-request btn-action upload-proof">${t.btnUploadProof}</button>`;
		} else if (deliveryStatus.toUpperCase() === 'DELIVERED') {
			actionBtn = `<button class="btn-request btn-action submit-bill">${t.btnSubmitBill}</button>`;
		} else if ((billStatus || '').toUpperCase() === 'SUBMITTED') {
			actionBtn = `<button class="btn-request" disabled>${t.btnWaitingApproval}</button>`;
		} else if ((paymentStatus || '').toUpperCase() === 'PAID') {
			actionBtn = `<button class="btn-details btn-action view-receipt">${t.btnViewReceipt}</button>`;
		}

		card.innerHTML = `
			<div class="card-row">
				<div>
					<div class="detail-row"><div class="detail-label">${t.labelContractId}</div><div class="detail-value">${d.contractId || d.id || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">${t.labelPhase}</div><div class="detail-value">${d.currentPhase || '-'}</div></div>
					<div class="detail-row"><div class="detail-label">Delivery Status</div><div class="detail-value">${deliveryStatus}</div></div>
				</div>

				<div style="min-width:220px;text-align:right;">
					<div class="detail-row"><div class="detail-label">Bill Status</div><div class="detail-value">${billStatus}</div></div>
					<div class="detail-row"><div class="detail-label">Payment Status</div><div class="detail-value">${paymentStatus}</div></div>
					<div class="detail-row"><div class="detail-label">Amount</div><div class="detail-value">${formatCurrency(d.amount || d.phaseAmount || 0)}</div></div>
					<div style="margin-top:8px;">${actionBtn}</div>
				</div>
			</div>
		`;

		// attach action handlers
		const uploadBtn = card.querySelector('.upload-proof');
		const submitBillBtnEl = card.querySelector('.submit-bill');
		const viewReceiptBtn = card.querySelector('.view-receipt');

		uploadBtn?.addEventListener('click', () => uploadDeliveryProof(d));
		submitBillBtnEl?.addEventListener('click', () => openBillModal(d));
		viewReceiptBtn?.addEventListener('click', () => viewReceipt(d));

		container.appendChild(card);
	});

	if (typeof updateTranslatedText === 'function') updateTranslatedText();
}

async function uploadDeliveryProof(delivery) {
	const { t } = getDashText();
	try {
		const input = document.createElement('input');
		input.type = 'file';
		input.onchange = async () => {
			const file = input.files[0];
			if (!file) return;

			const { token } = getAuthInfo();
			const fd = new FormData();
			fd.append('proof', file);

			const resp = await fetch(`${API_BASE_URL}/supplier/deliveries/${encodeURIComponent(delivery.contractId || delivery.id)}/proof`, {
				method: 'POST',
				headers: { Authorization: 'Bearer ' + token },
				body: fd
			});

			if (!resp.ok) throw new Error('upload-failed');
			alert(t.msgActionSuccess);
			loadSupplierData();
		};

		input.click();
	} catch (err) {
		console.error(err);
		alert(getDashText().t.msgActionFailed);
	}
}

function openBillModal(delivery) {
	currentBillDelivery = delivery;
	document.getElementById('billAmountInput').value = delivery.amount || delivery.phaseAmount || '';
	document.getElementById('billFileInput').value = '';
	billModal.hidden = false;
}

async function submitBillFromModal() {
	const { t } = getDashText();
	const amount = Number(document.getElementById('billAmountInput').value || 0);
	const fileEl = document.getElementById('billFileInput');
	const file = fileEl.files[0];

	if (!currentBillDelivery) return alert(t.msgActionFailed);
	if (!amount || amount <= 0) return alert('Please enter a valid amount');
	if (!file) return alert('Please attach bill/invoice file');

	try {
		const { token } = getAuthInfo();
		const fd = new FormData();
		fd.append('amount', amount);
		fd.append('file', file);

		const resp = await fetch(`${API_BASE_URL}/supplier/deliveries/${encodeURIComponent(currentBillDelivery.contractId || currentBillDelivery.id)}/bill`, {
			method: 'POST',
			headers: { Authorization: 'Bearer ' + token },
			body: fd
		});

		if (!resp.ok) throw new Error('bill-failed');
		alert(t.msgActionSuccess);
		billModal.hidden = true;
		loadSupplierData();
	} catch (err) {
		console.error(err);
		alert(t.msgActionFailed);
	}
}

function viewReceipt(delivery) {
	// Minimal viewer: if delivery.receiptUrl exists open it, otherwise show details
	if (delivery.receiptUrl) window.open(delivery.receiptUrl, '_blank');
	else alert('Receipt not available');
}

async function loadSupplierData() {
	const { token, userId } = getAuthInfo();
	const { t } = getDashText();

	if (!token || !userId) return alert(t.msgLoginRequired || 'Please login again.');

	// show loaders
	document.getElementById('requestsGrid').innerHTML = `<div class="buyer-card loading-card"><div class="loader"></div></div>`;
	document.getElementById('activeDeliveriesGrid').innerHTML = `<div class="buyer-card loading-card"><div class="loader"></div></div>`;

	try {
		const [ovrResp, reqResp, delResp] = await Promise.all([
		fetch(`${API_BASE_URL}/dashboard/supplier/overview`, {
    headers: { Authorization: 'Bearer ' + token }
}),
			fetch(`${API_BASE_URL}/dashboard/supplier/requests`,{
    headers: { Authorization: 'Bearer ' + token }
}),
			fetch(`${API_BASE_URL}/dashboard/supplier/deliveries`,{
    headers: { Authorization: 'Bearer ' + token }
})
		]);

		const overview = ovrResp.ok ? await ovrResp.json() : {};
		const requests = reqResp.ok ? await reqResp.json() : [];
		const deliveries = delResp.ok ? await delResp.json() : [];

		renderSummary(overview || {});
		renderIncomingRequests(requests || []);
		renderActiveDeliveries(deliveries || []);
	} catch (err) {
		console.error('Load supplier data failed', err);
		renderSummary({});
		renderIncomingRequests([]);
		renderActiveDeliveries([]);
	}
}

function syncDashboardLanguage() {
	const { t } = getDashText();
	// placeholder text already uses data-text attributes — dynamic sections re-render with t
	loadSupplierData();
}

// Navigation: wire sidebar menu links
document.getElementById('sidebarDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "../Supplier/supplier-dashboard.html";
});

document.getElementById('sidebarProfile')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "../Supplier-Profile/supplier-profile.html";
});

document.getElementById('sidebarSupplyRequests')?.addEventListener('click', (e) => {
    e.preventDefault();
   window.location.href = "/Supply/supplier-supply-order/supplier-supply-orders.html";
});

document.getElementById('sidebarActiveDeliveries')?.addEventListener('click', (e) => {
    e.preventDefault();
    // You might want to scroll to the active deliveries section
    window.location.href = "/Supply/supply-order/supply-orders.html";
});

document.getElementById('sidebarCompletedOrders')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Navigate to completed orders page if exists, or stay on dashboard
    window.location.href = "../Supplier-Completed/supplier-completed.html";
});

document.getElementById('sidebarWallet')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "../Supplier-Wallet/supplier-wallet.html";
});

document.getElementById('sidebarSettings')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "../Supplier-Settings/supplier-settings.html";
});

document.getElementById('sidebarLogout')?.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

// Remove or comment out the old navigation code
// document.getElementById('farmerProfileMenu')?.addEventListener('click', () => {
//     window.location.href = "../Supplier-Profile/supplier-profile.html";
// });
// document.getElementById('farmerRequestsMenu')?.addEventListener('click', () => {
//     window.location.href = "../Supplier-Request/supplier-request.html";
// });

document.getElementById('langToggle')?.addEventListener('click', () => setTimeout(syncDashboardLanguage, 0));
document.getElementById('mobileLangToggle')?.addEventListener('click', () => setTimeout(syncDashboardLanguage, 0));

document.getElementById('sidebarToggle')?.addEventListener('click', () => {
	document.querySelector('.sidebar')?.classList.toggle('collapsed');
});

document.addEventListener('DOMContentLoaded', async () => {
	const { t } = getDashText();

	requestDetailsModal = document.getElementById('requestDetailsModal');
	requestDetailsBody = document.getElementById('requestDetailsBody');
	requestModalCloseBtn = document.getElementById('requestModalCloseBtn');

	billModal = document.getElementById('billModal');
	billModalCloseBtn = document.getElementById('billModalCloseBtn');
	submitBillBtn = document.getElementById('submitBillBtn');
	cancelBillBtn = document.getElementById('cancelBillBtn');

	requestModalCloseBtn?.addEventListener('click', closeRequestDetailsModal);
	requestDetailsModal?.addEventListener('click', (e) => { if (e.target === requestDetailsModal) closeRequestDetailsModal(); });

	billModalCloseBtn?.addEventListener('click', () => (billModal.hidden = true));
	cancelBillBtn?.addEventListener('click', () => (billModal.hidden = true));
	submitBillBtn?.addEventListener('click', submitBillFromModal);

	document.querySelector('.logout')?.addEventListener('click', logoutUser);

	await loadSupplierData();
});

