/* ============================================================
   BOTÓN RESTABLECER — ANIMALES INDIVIDUALES
   ============================================================ */

import controllerAnimales from "../controladorAnimalesIndividualesDemo.js";
import { activarSeleccionAnimales } from "./seleccionarAnimales.js";

document.getElementById("btnRestablecerAnimales").onclick = async () => {

    /* ============================================================
       1. Recargar tabla completa desde IndexedDB
       ============================================================ */
    await controllerAnimales.recargarTabla();

    /* ============================================================
       2. Bloquear tabla (evita que quede editable)
       ============================================================ */
    controllerAnimales.bloquearTabla();

    /* ============================================================
       3. Limpiar selección
       ============================================================ */
    window.filasSeleccionadasAnimales = new Set();
    activarSeleccionAnimales(); // vuelve a activar selección limpia

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
