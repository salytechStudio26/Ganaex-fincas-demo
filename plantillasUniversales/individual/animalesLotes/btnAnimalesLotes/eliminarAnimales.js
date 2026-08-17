/* ============================================================
   BOTÓN ELIMINAR — ANIMALES LOTES
   ============================================================ */

import { eliminarRegistro } from "../animalesLotesDemoBD.js";
import controllerLotes from "../controladorAnimalesLotesDemo.js";
import { obtenerFilasSeleccionadasLotes } from "./seleccionarAnimales.js";

/* ============================================================
   EVENTO DEL BOTÓN ELIMINAR
   ============================================================ */

document.getElementById("btnEliminarAnimales").onclick = async () => {

    const seleccionadas = obtenerFilasSeleccionadasLotes();

    // Si no hay filas seleccionadas → no se elimina nada
    if (seleccionadas.length === 0) {
        alert("No hay filas seleccionadas para eliminar.");
        return;
    }

    // Confirmación
    const confirmar = confirm(
        `¿Seguro que deseas eliminar ${seleccionadas.length} registro(s)?`
    );

    if (!confirmar) {
        return; // Cancelado por el usuario
    }

    // Eliminar cada registro seleccionado
    for (const id of seleccionadas) {
        await eliminarRegistro(Number(id));
    }

    alert("Registros eliminados correctamente.");

    // Recargar tabla
    controllerLotes.recargarTabla();

    // Vaciar selección global
    window.filasSeleccionadasLotes = new Set();
};
