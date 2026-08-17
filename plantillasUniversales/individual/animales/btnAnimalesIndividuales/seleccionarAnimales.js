/* ============================================================
   BOTÓN SELECCIONAR — ANIMALES INDIVIDUALES
   ============================================================ */

let modoSeleccionAnimales = false;

// VARIABLE GLOBAL REAL
window.filasSeleccionadasAnimales = new Set();

/* ============================================================
   ACTIVAR / DESACTIVAR MODO SELECCIÓN
   ============================================================ */

document.getElementById("btnSeleccionarAnimales").onclick = () => {

    modoSeleccionAnimales = !modoSeleccionAnimales;

    if (modoSeleccionAnimales) {
        activarSeleccionAnimales();
        alert("Modo selección activado. Haz clic en las filas para seleccionarlas.");
    } else {
        desactivarSeleccionAnimales();
        alert("Modo selección desactivado.");
    }
};

/* ============================================================
   ACTIVAR SELECCIÓN
   ============================================================ */

export function activarSeleccionAnimales() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {

        fila.style.cursor = "pointer";

        fila.onclick = () => {

            const id = fila.children[0].textContent; // ID de la fila

            if (window.filasSeleccionadasAnimales.has(id)) {
                window.filasSeleccionadasAnimales.delete(id);
                fila.classList.remove("filaSeleccionada");
            } else {
                window.filasSeleccionadasAnimales.add(id);
                fila.classList.add("filaSeleccionada");
            }
        };
    });
}

/* ============================================================
   DESACTIVAR SELECCIÓN
   ============================================================ */

export function desactivarSeleccionAnimales() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {
        fila.style.cursor = "default";
        fila.onclick = null;
        fila.classList.remove("filaSeleccionada");
    });

    window.filasSeleccionadasAnimales.clear();
}

/* ============================================================
   EXPORTAR SELECCIÓN PARA OTROS BOTONES
   ============================================================ */

export function obtenerFilasSeleccionadasAnimales() {
    return Array.from(window.filasSeleccionadasAnimales);
}
