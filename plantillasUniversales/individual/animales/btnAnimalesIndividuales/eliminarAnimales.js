/* ============================================================
   BOTÓN ELIMINAR — ANIMALES
   ============================================================ */

import { eliminarAnimal } from "../animalesIndividualesDemoBD.js";
import controladorAnimales from "../controladorAnimalesIndividualesDemo.js";

/* ============================================================
   EVENTO DEL BOTÓN ELIMINAR
   ============================================================ */

document.getElementById("btnEliminarAnimales").onclick = async () => {

    // Obtener IDs seleccionados (igual que en engorde)
    const seleccionadas = [...window.filasSeleccionadasAnimales];

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
        await eliminarAnimal(Number(id));
    }

    alert("Registros eliminados correctamente.");

    // Recargar tabla
    controladorAnimales.recargarTabla();

    // Vaciar selección global
    window.filasSeleccionadasAnimales = new Set();
};
