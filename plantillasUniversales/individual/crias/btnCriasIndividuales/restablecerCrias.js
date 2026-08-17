/* ============================================================
   BOTÓN RESTABLECER — CRÍAS INDIVIDUALES
   ============================================================ */

import controllerCrias from "../controladorCriasIndividualesDemo.js";
import { activarSeleccionCrias } from "./seleccionarCrias.js";

// ⭐ PROTECCIÓN: evita error si el botón NO existe (como en SEPARACIÓN)
const btn = document.getElementById("btnRestablecerAnimales");
if (!btn) {
    // Si el botón no existe, no hacemos nada.
} else {

    btn.onclick = async () => {

        /* ============================================================
           1. Recargar tabla completa desde IndexedDB
           ============================================================ */
        await controllerCrias.recargarTabla();

        /* ============================================================
           2. Bloquear tabla (evita que quede editable)
           ============================================================ */
        controllerCrias.bloquearTabla();

        /* ============================================================
           3. Limpiar selección
           ============================================================ */
        window.filasSeleccionadasCrias = new Set();
        activarSeleccionCrias(); // vuelve a activar selección limpia

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
}
