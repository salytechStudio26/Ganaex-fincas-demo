/* ============================================================
   BOTÓN ELIMINAR — TRANSPORTE
   ============================================================ */

import { eliminarRegistro } from "../transporteDemoBD.js";
import controllerTransporte from "../transporteDemo.js";
import { obtenerFilasSeleccionadasTransporte } from "./seleccionarTransporte.js";

/* ============================================================
   EVENTO DEL BOTÓN ELIMINAR
   ============================================================ */

document.getElementById("btnEliminarTransporte").onclick = async () => {

    const seleccionadas = obtenerFilasSeleccionadasTransporte();

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
    controllerTransporte.recargarTabla();

    // Vaciar selección global
    window.filasSeleccionadasTransporte = new Set();
};
