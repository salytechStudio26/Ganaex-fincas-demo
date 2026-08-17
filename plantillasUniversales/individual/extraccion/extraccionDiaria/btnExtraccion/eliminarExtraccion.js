/* ============================================================
   BOTÓN ELIMINAR — EXTRACCIÓN DIARIA
   ============================================================ */

import { eliminarExtraccion } from "../extraccionDemoBD.js";
import controllerExtraccion from "../extraccionDemo.js";
import { obtenerFilasSeleccionadasExtraccion } from "./seleccionarExtraccion.js";

/* ============================================================
   EVENTO DEL BOTÓN ELIMINAR
   ============================================================ */

document.getElementById("btnEliminarEstado").onclick = async () => {

    const seleccionadas = obtenerFilasSeleccionadasExtraccion();

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
        await eliminarExtraccion(Number(id));
    }

    alert("Registros eliminados correctamente.");

    // Recargar tabla
    controllerExtraccion.recargarTabla();

    // Vaciar selección global
    window.filasSeleccionadasExtraccion = new Set();
};
