document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "../../Login/login.html";
    return;
  }



document.addEventListener("DOMContentLoaded", function () {
  const walletBalanceEl = document.getElementById("walletBalance");
  const transactionTableBody = document.getElementById("transactionTableBody");
  const noTransactionsEl = document.getElementById("noTransactions");
  const backBtn = document.getElementById("backToDashboard");

  const API_BASE = "http://localhost:8080";

  /* -------------------------------
     Utility Functions
  -------------------------------- */

  function formatCurrency(amount) {
    return "₹ " + Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatDate(timestamp) {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function showError(message) {
    console.error(message);
    walletBalanceEl.innerText = "Error loading data";
  }

  /* -------------------------------
     Load Wallet Balance
  -------------------------------- */

  async function loadWalletBalance() {
    try {
      const response = await fetch(`${API_BASE}/api/escrow/wallet`, {
        method: "GET",
        headers: {
    "Authorization": "Bearer " + localStorage.getItem("token")
  },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }

      const data = await response.json();

      walletBalanceEl.textContent = formatCurrency(data.balance ?? 0);

    } catch (error) {
      showError(error.message);
    }
  }

  /* -------------------------------
     Load Transactions
  -------------------------------- */

  async function loadTransactions() {
    try {
      const response = await fetch(`${API_BASE}/api/escrow/transactions`, {
        method: "GET",
        headers: {
    "Authorization": "Bearer " + localStorage.getItem("token")
  },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = await response.json();

      transactionTableBody.innerHTML = "";

      if (!transactions || transactions.length === 0) {
        noTransactionsEl.style.display = "block";
        return;
      }

      noTransactionsEl.style.display = "none";

      transactions.forEach(tx => {
        const row = document.createElement("tr");

        const amountCell = document.createElement("td");
        amountCell.textContent = formatCurrency(tx.amount);

        const purposeCell = document.createElement("td");
        purposeCell.textContent = tx.purpose || "-";

        const actionCell = document.createElement("td");
        actionCell.textContent = tx.action || "-";

        const referenceCell = document.createElement("td");
        referenceCell.textContent = tx.reference || "-";

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(tx.timestamp);

        row.appendChild(amountCell);
        row.appendChild(purposeCell);
        row.appendChild(actionCell);
        row.appendChild(referenceCell);
        row.appendChild(dateCell);

        transactionTableBody.appendChild(row);
      });

    } catch (error) {
      console.error(error);
      noTransactionsEl.style.display = "block";
      noTransactionsEl.innerText = "Unable to load transactions.";
    }
  }

  /* -------------------------------
     Navigation
  -------------------------------- */

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.history.back();
    });
  }

  /* -------------------------------
     Init
  -------------------------------- */

  loadWalletBalance();
  loadTransactions();
});
})