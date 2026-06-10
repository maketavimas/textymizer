const DOWNLOAD_URL =
"https://github.com/user-attachments/files/28760473/bandymui.txt";

const downloadBtn = document.getElementById("downloadBtn");
const modal = document.getElementById("modal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

downloadBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

confirmBtn.addEventListener("click", () => {

    const email = document.getElementById("email").value;

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    // Uždarom popup
    modal.style.display = "none";

    // Pradedam failo siuntimą
    window.location.href = DOWNLOAD_URL;

});
