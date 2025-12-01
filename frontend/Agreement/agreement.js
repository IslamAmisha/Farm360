/* Agreement page JS: auto-id, mutual-field matching, problem detection, basic sign flow */

(function () {
	function el(id) { return document.getElementById(id); }

	function genAgreementId() {
		const d = new Date();
		const y = d.getFullYear();
		const t = String(d.getTime()).slice(-6);
		return `AGMT-${y}-${t}`;
	}

	function setMeta() {
		el('agreementId').textContent = genAgreementId();
		el('agreementDate').textContent = new Date().toLocaleString();
	}

	function getVal(id) { const i = el(id); if (!i) return ''; if (i.type === 'checkbox') return i.checked ? (i.value || 'on') : ''; return (i.value || '').toString().trim(); }

	// Generalized problem checker: any farmerX <-> buyerX pair will be compared.
	function checkProblems() {
		const problems = [];

		// Find all farmer-prefixed fields
		const farmerNodes = Array.from(document.querySelectorAll('[id^="farmer"]'));
		const handled = new Set();

		farmerNodes.forEach(fn => {
			const suffix = fn.id.slice('farmer'.length); // e.g. "Crop", "Escrow1"
			const buyerId = 'buyer' + suffix;
			const buyerNode = el(buyerId);
			if (!buyerNode) return; // not a mutual field

			handled.add(fn.id); handled.add(buyerId);

			const fv = getVal(fn.id);
			const bv = getVal(buyerId);

			// if both empty, skip
			if ((fv === '' || fv === null) && (bv === '' || bv === null)) return;

			// numeric compare when both are numbers
			const fNum = Number(fv);
			const bNum = Number(bv);
			const isNumeric = !isNaN(fNum) && !isNaN(bNum) && fv !== '' && bv !== '';

			if (isNumeric) {
				if (fNum !== bNum) problems.push({field: suffix, farmer: fv, buyer: bv, fId: fn.id, bId: buyerId});
			} else {
				if (String(fv) !== String(bv)) problems.push({field: suffix, farmer: fv, buyer: bv, fId: fn.id, bId: buyerId});
			}

			// visual locking for matched fields
			if (String(fv) !== '' && String(fv) === String(bv)) {
				fn.classList.add('locked'); buyerNode.classList.add('locked');
			} else {
				fn.classList.remove('locked'); buyerNode.classList.remove('locked');
			}
		});

		// Additional rule: escrow percentages must sum to 100 for each party
		function sumEscrow(prefix) {
			const a = Number(getVal(prefix + 'Escrow1') || 0);
			const b = Number(getVal(prefix + 'Escrow2') || 0);
			const c = Number(getVal(prefix + 'Escrow3') || 0);
			return a + b + c;
		}

		const farmerEscrowSum = sumEscrow('farmer');
		const buyerEscrowSum = sumEscrow('buyer');
		if (farmerEscrowSum !== 0 && farmerEscrowSum !== 100) {
			problems.push({field: 'Escrow (Farmer total)', farmer: farmerEscrowSum + '%', buyer: '—', fId: 'farmerEscrow1', bId: null});
		}
		if (buyerEscrowSum !== 0 && buyerEscrowSum !== 100) {
			problems.push({field: 'Escrow (Buyer total)', farmer: '—', buyer: buyerEscrowSum + '%', fId: null, bId: 'buyerEscrow1'});
		}

		// Render problems
		const list = el('problemsList');
		if (!list) return problems;

		if (problems.length === 0) {
			list.innerHTML = 'No problems detected. All mutual fields match.';
			list.classList.remove('has-problems');
		} else {
			const html = problems.map(p => `
				<div class="problem-item">
					<strong>${p.field}:</strong>
					<div class="problem-values">Farmer: <em>${p.farmer || '—'}</em> — Buyer: <em>${p.buyer || '—'}</em></div>
				</div>
			`).join('');
			list.innerHTML = html;
			list.classList.add('has-problems');
		}

		// toggle sign buttons based on their local confirmations (they still can sign even if there are problems, but finalization requires no problems)
		const farmerConfirm = el('farmerConfirmRequired')?.checked;
		const buyerConfirm = el('buyerConfirmRequired')?.checked;

		const farmerSign = el('farmerSign');
		const buyerSign = el('buyerSign');
		if (farmerSign) farmerSign.disabled = !farmerConfirm;
		if (buyerSign) buyerSign.disabled = !buyerConfirm;

		return problems;
	}

	function copyBuyerToFarmer() {
		const buyerNodes = Array.from(document.querySelectorAll('[id^="buyer"]'));
		buyerNodes.forEach(bn => {
			const suffix = bn.id.slice('buyer'.length);
			const farmerId = 'farmer' + suffix;
			const farmerNode = el(farmerId);
			if (!farmerNode) return;
			const bv = getVal(bn.id);
			if (bv !== '') {
				if (farmerNode.type === 'checkbox') farmerNode.checked = bn.checked;
				else farmerNode.value = bn.value;
			}
		});
		checkProblems();
	}

	function copyFarmerToBuyer() {
		const farmerNodes = Array.from(document.querySelectorAll('[id^="farmer"]'));
		farmerNodes.forEach(fn => {
			const suffix = fn.id.slice('farmer'.length);
			const buyerId = 'buyer' + suffix;
			const buyerNode = el(buyerId);
			if (!buyerNode) return;
			const fv = getVal(fn.id);
			if (fv !== '') {
				if (buyerNode.type === 'checkbox') buyerNode.checked = fn.checked;
				else buyerNode.value = fn.value;
			}
		});
		checkProblems();
	}

	function buildAuditTrail(signers) {
		const when = new Date().toLocaleString();
		return `Signed by: ${signers.join(' & ')} on ${when} (System-generated signature hash)`;
	}

	function finalizeIfReady() {
		const problems = checkProblems();
		const hasProblems = problems.length > 0;
		const farmerSigned = el('farmerSign')?.dataset.signed === 'true';
		const buyerSigned = el('buyerSign')?.dataset.signed === 'true';

		if (farmerSigned && buyerSigned && !hasProblems) {
			// lock UI
			document.querySelectorAll('input, select, button').forEach(node => {
				if (!node.classList.contains('mobile-theme-btn')) node.disabled = true;
			});
			el('finalizeArea').style.display = 'block';
			el('auditTrail').textContent = buildAuditTrail(['Farmer','Buyer']);
		}
	}

	function attachListeners() {

		// On input/change, re-evaluate
		function attachAll() {
			const all = document.querySelectorAll('input, select, textarea');
			all.forEach(n => {
				const ev = (n.tagName === 'SELECT' || n.type === 'checkbox' || n.type === 'radio') ? 'change' : 'input';
				n.removeEventListener(ev, checkProblems);
				n.addEventListener(ev, checkProblems);
			});
		}
		attachAll();

		document.getElementById('resolveToFarmer')?.addEventListener('click', () => { copyBuyerToFarmer(); });
		document.getElementById('resolveToBuyer')?.addEventListener('click', () => { copyFarmerToBuyer(); });

		// Toggle crop-specific modules (e.g., potato)
		function toggleModules() {
			const farmerCrop = getVal('farmerCrop') || getVal('farmercrop') || '';
			const buyerCrop = getVal('buyerCrop') || getVal('buyercrop') || '';
			const potatoModule = el('potatoModule');
			if (!potatoModule) return;
			if (farmerCrop.toLowerCase() === 'potato' || buyerCrop.toLowerCase() === 'potato') potatoModule.style.display = 'block';
			else potatoModule.style.display = 'none';
		}
		// Initial
		toggleModules();
		// Re-evaluate modules on crop change
		['farmerCrop','buyerCrop'].forEach(id => el(id)?.addEventListener('change', () => { toggleModules(); checkProblems(); }));

		// confirmations toggle sign button availability
		el('farmerConfirmRequired')?.addEventListener('change', () => checkProblems());
		el('buyerConfirmRequired')?.addEventListener('change', () => checkProblems());

		// Sign handlers: mark dataset.signed and then attempt finalize
		el('farmerSign')?.addEventListener('click', function () {
			if (this.disabled) return;
			this.dataset.signed = 'true';
			this.textContent = 'Farmer: Signed ✓';
			checkProblems(); finalizeIfReady();
		});

		el('buyerSign')?.addEventListener('click', function () {
			if (this.disabled) return;
			this.dataset.signed = 'true';
			this.textContent = 'Buyer: Signed ✓';
			checkProblems(); finalizeIfReady();
		});

		// Keep date/agreement id fresh when opening
		setMeta();

		// If landing-page provides translations helper, call it
		if (typeof updateTranslatedText === 'function') updateTranslatedText();
		// Ensure farmer dashboard language sync if present
		if (typeof syncDashboardLanguage === 'function') syncDashboardLanguage();
	}

	// Init on DOMContentLoaded
	document.addEventListener('DOMContentLoaded', () => {
		attachListeners();
		checkProblems();
	});

})();

