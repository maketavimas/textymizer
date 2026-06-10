const modal = document.getElementById("modal");
const downloadBtn = document.getElementById("downloadBtn");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const emailInput = document.getElementById("email");

let turnstileToken = "";

// ─── OPEN MODAL ───────────────────────────────────────────────────────────────
downloadBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// ─── CLOSE MODAL ─────────────────────────────────────────────────────────────
cancelBtn.addEventListener("click", () => {
  closeModal();
});

function closeModal() {
  modal.style.display = "none";
  emailInput.value = "";
  clearError();
  resetTurnstile();
}

// ─── TURNSTILE (implicit render via data-sitekey HTML attribute) ──────────────
// Widget is rendered by Turnstile script using data-sitekey on the div element.
// JS only receives the callback token and handles reset when needed.
window.onTurnstileSuccess = function (token) {
  console.log("TURNSTILE OK:", token);
  turnstileToken = token;
};

// ─── Turnstile reset ──────────────────────────────────────────────────────────
function resetTurnstile() {
  turnstileToken = "";
  try {
    if (typeof turnstile !== "undefined") {
      turnstile.reset();
    }
  } catch (e) {
    console.warn("Turnstile reset failed:", e);
  }
}

// ─── Frontend email validation (UX only) ─────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Error helpers ────────────────────────────────────────────────────────────
function showError(message) {
  clearError();
  const err = document.createElement("p");
  err.id = "error-msg";
  err.style.cssText = "color:#c0392b; margin: 8px 0 0; font-size: 14px;";
  err.textContent = message;
  confirmBtn.insertAdjacentElement("beforebegin", err);
  setTimeout(() => err.remove(), 5000);
}

function clearError() {
  const existing = document.getElementById("error-msg");
  if (existing) existing.remove();
}

// ─── Double-submit protection ─────────────────────────────────────────────────
function setLoading(isLoading) {
  confirmBtn.disabled = isLoading;
  confirmBtn.textContent = isLoading ? "Checking..." : "Confirm";
}

// ─── CONFIRM FLOW ─────────────────────────────────────────────────────────────
confirmBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  // Frontend validation
  if (!email) {
    showError("Please enter your email address.");
    return;
  }
  if (!isValidEmail(email)) {
    showError("Invalid email format.");
    return;
  }
  if (!turnstileToken) {
    showError("Please complete the verification.");
    return;
  }

  // Disable button while request is in flight
  setLoading(true);
  clearError();

  try {
    const res = await fetch("https://download-gate.maketavimas.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, turnstileToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Reset Turnstile after failed request
      resetTurnstile();
      showError(data.error || "Request blocked.");
      return;
    }

    closeModal();
    window.location.href = data.downloadUrl;

  } catch (err) {
    console.error(err);
    resetTurnstile();
    showError("Server error. Please try again later.");
  } finally {
    setLoading(false);
  }
});
