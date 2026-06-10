const modal = document.getElementById("modal");
const downloadBtn = document.getElementById("downloadBtn");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

downloadBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

confirmBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    // 🔥 SAFE TURNSTILE TOKEN READ
    const token = document.querySelector(
        'textarea[name="cf-turnstile-response"]'
    )?.value;

    if (!email) {
        alert("Enter email");
        return;
    }

    if (!token) {
        alert("Please complete verification");
        return;
    }

    const res = await fetch("download-gate.maketavimas.workers.dev", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            turnstileToken: token
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || "Blocked");
        return;
    }

    modal.style.display = "none";
    window.location.href = data.downloadUrl;
});
