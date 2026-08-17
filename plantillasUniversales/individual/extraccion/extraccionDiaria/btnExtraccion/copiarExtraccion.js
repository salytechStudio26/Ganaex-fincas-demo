/* ============================================================
   BOTÓN COPIAR — EXTRACCIÓN DIARIA
   ============================================================ */

import { obtenerFilasSeleccionadasExtraccion } from "./seleccionarExtraccion.js";

/* ============================================================
   VARIABLE GLOBAL PARA GUARDAR LA COPIA
   ============================================================ */

window.copiaExtraccion = [];

/* ============================================================
   EVENTO PRINCIPAL — BOTÓN COPIAR
   ============================================================ */

document.getElementById("btnCopiar").onclick = () => {

    const seleccionados = obtenerFilasSeleccionadasExtraccion();

    if (!seleccionados || seleccionados.length === 0) {
        alert("Debe seleccionar al menos una fila antes de copiar.");
        return;
    }

    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    // Limpiar copia previa
    window.copiaExtraccion = [];

    seleccionados.forEach(id => {

        // Buscar la fila con ese ID
        const fila = [...filas].find(f => f.dataset.id === id);

        if (!fila) {
            console.warn(`No se encontró la fila con ID ${id} para copiar.`);
            return;
        }

        // Construir objeto con los datos de la fila
        const registro = {
            idHeredado: fila.querySelector("[data-columna='idHeredado']")?.textContent || "",
            identificacion: fila.querySelector("[data-columna='identificacion']")?.textContent || "",
            lote: fila.querySelector("[data-columna='lote']")?.textContent || "",
            fecha: fila.querySelector("[data-columna='fecha']")?.textContent || "",
            tipo: fila.querySelector("[data-columna='tipo']")?.textContent || "",
            cantidadRecogida: fila.querySelector("[data-columna='cantidadRecogida']")?.textContent || "",
            zona: fila.querySelector("[data-columna='zona']")?.textContent || "",
            observaciones: fila.querySelector("[data-columna='observaciones']")?.textContent || ""
        };

        // Guardar en la copia
        window.copiaExtraccion.push(registro);
    });

    alert(`Se han copiado ${window.copiaExtraccion.length} registro(s).`);
};
