let deferredPrompt;

// Detecta si la PWA es instalable
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const btn = document.getElementById("btnInstalar");
    if (btn) {
        btn.style.display = "block"; // Muestra el botón
    }

    btn.addEventListener("click", async () => {
        btn.style.display = "none"; // Oculta el botón al pulsar

        deferredPrompt.prompt(); // Lanza el instalador

        const { outcome } = await deferredPrompt.userChoice;
        console.log("Resultado de instalación:", outcome);

        deferredPrompt = null;
    });
});
