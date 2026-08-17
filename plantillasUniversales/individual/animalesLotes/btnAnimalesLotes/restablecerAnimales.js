/* ============================================================
   BOTÓN RESTABLECER — LOTES DE ANIMALES
   ============================================================ */

import controllerLotes from "../controladorAnimalesLotesDemo.js";
import { activarSeleccionLotes } from "./seleccionarAnimales.js";

document.getElementById("btnRestablecerAnimales").onclick = async () => {

    /* ============================================================
       1. Recargar tabla completa desde IndexedDB
       ============================================================ */
    await controllerLotes.recargarTabla();

    /* ============================================================
       2. Bloquear tabla (evita que quede editable)
       ============================================================ */
    if (typeof controllerLotes.bloquearTabla === "function") {
        controllerLotes.bloquearTabla();
    }

    /* ============================================================
       3. Limpiar selección
       ============================================================ */
    window.filasSeleccionadasLotes = new Set();
    activarSeleccionLotes(); // vuelve a activar selección limpia

    /* ============================================================
       4. Quitar modo edición
       ============================================================ */
    const filasEditadas = document.querySelectorAll(
        ".filaEditableNueva, .filaEditableModificar"
    );

    filasEditadas.forEach(fila => {
        fila.classList.remove("filaEditableNueva");
        fila.classList.remove("filaEditableModificar");
    });

    /* ============================================================
       5. Mensaje final
       ============================================================ */
    alert("Tabla restablecida correctamente.");
};
