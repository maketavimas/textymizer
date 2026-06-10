const modal = document.getElementById("modal");
const downloadBtn = document.getElementById("downloadBtn");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

let turnstileToken = "";

/* =========================
   OPEN MODAL
========================= */
downloadBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

/* =========================
   CLOSE MODAL
========================= */
cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

/* =========================
   TURNSTILE CALLBACK
   (Cloudflare injects token here)
========================= */
window.onloadTurnstileCallback = function () {
    turnstile.render('.cf-turnstile', {
        sitekey: "TAVO_SITE_KEY",
        callback: function (token) {
            turnstileToken = token;
        }
    });
};

/* =========================
   CONFIRM BUTTON
========================= */
confirmBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Please enter email");
        return;
    }

    if (!turnstileToken) {
        alert("Please complete verification");
        return;
    }

    try {
        const res = await fetch("https://YOUR-WORKER.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                turnstileToken: turnstileToken
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Download blocked");
            return;
        }

        // CLOSE MODAL
        modal.style.display = "none";

        // START DOWNLOAD
        window.location.href = data.downloadUrl;

    } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
    }
});
