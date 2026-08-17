/* ============================================================
   BOTÓN SELECCIONAR — EXTRACCIÓN DIARIA (versión con data-id)
   ============================================================ */

import controllerExtraccion from "../extraccionDemo.js";

let modoSeleccionExtraccion = false;
let filasSeleccionadasExtraccion = new Set();

/* ============================================================
   ACTIVAR / DESACTIVAR MODO SELECCIÓN
   ============================================================ */

document.getElementById("btnSeleccionarEstado").onclick = () => {

    modoSeleccionExtraccion = !modoSeleccionExtraccion;

    if (modoSeleccionExtraccion) {
        activarSeleccionExtraccion();
        alert("Modo selección activado. Haz clic en las filas para seleccionarlas.");
    } else {
        desactivarSeleccionExtraccion();
        alert("Modo selección desactivado.");
    }
};

/* ============================================================
   ACTIVAR SELECCIÓN
   ============================================================ */

export function activarSeleccionExtraccion() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {

        fila.style.cursor = "pointer";

        fila.onclick = () => {

            const id = fila.dataset.id;

            if (!id) {
                console.warn("Fila sin data-id. Revisa la generación del tbody en Extracción.");
                return;
            }

            // ⭐ Guardar ID interno para Modificar y Guardar
            controllerExtraccion.idSeleccionado = Number(id);

            if (filasSeleccionadasExtraccion.has(id)) {
                filasSeleccionadasExtraccion.delete(id);
                fila.classList.remove("filaSeleccionada");
            } else {
                filasSeleccionadasExtraccion.add(id);
                fila.classList.add("filaSeleccionada");
            }

            console.log(`ID seleccionado (Extracción): ${controllerExtraccion.idSeleccionado}`);
        };
    });
}

/* ============================================================
   DESACTIVAR SELECCIÓN
   ============================================================ */

export function desactivarSeleccionExtraccion() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {
        fila.style.cursor = "default";
        fila.onclick = null;
        fila.classList.remove("filaSeleccionada");
    });

    filasSeleccionadasExtraccion.clear();
    controllerExtraccion.idSeleccionado = null;
}

/* ============================================================
   EXPORTAR SELECCIÓN PARA OTROS BOTONES
   ============================================================ */

export function obtenerFilasSeleccionadasExtraccion() {
    return Array.from(filasSeleccionadasExtraccion);
}
