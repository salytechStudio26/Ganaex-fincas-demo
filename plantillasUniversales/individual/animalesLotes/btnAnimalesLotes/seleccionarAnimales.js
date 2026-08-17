/* ============================================================
   BOTÓN SELECCIONAR — LOTES DE ANIMALES
   ============================================================ */

let modoSeleccionLotes = false;

// ⭐ Usar SIEMPRE el Set global
window.filasSeleccionadasLotes = window.filasSeleccionadasLotes || new Set();
let filasSeleccionadasLotes = window.filasSeleccionadasLotes;

/* ============================================================
   ACTIVAR / DESACTIVAR MODO SELECCIÓN
   ============================================================ */

document.getElementById("btnSeleccionarAnimales").onclick = () => {

    modoSeleccionLotes = !modoSeleccionLotes;

    if (modoSeleccionLotes) {
        activarSeleccionLotes();
        alert("Modo selección activado. Haz clic en las filas para seleccionarlas.");
    } else {
        desactivarSeleccionLotes();
        alert("Modo selección desactivado.");
    }
};

/* ============================================================
   ACTIVAR SELECCIÓN
   ============================================================ */

export function activarSeleccionLotes() {

    if (!modoSeleccionLotes) return;

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {

        fila.style.cursor = "pointer";

        fila.onclick = () => {

            const id = fila.children[0].textContent;

            if (filasSeleccionadasLotes.has(id)) {
                filasSeleccionadasLotes.delete(id);
                fila.classList.remove("filaSeleccionada");
            } else {
                filasSeleccionadasLotes.add(id);
                fila.classList.add("filaSeleccionada");
            }

            // ⭐ Actualizar Set global
            window.filasSeleccionadasLotes = filasSeleccionadasLotes;
        };
    });
}

/* ============================================================
   DESACTIVAR SELECCIÓN
   ============================================================ */

export function desactivarSeleccionLotes() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {
        fila.style.cursor = "default";
        fila.onclick = null;
        fila.classList.remove("filaSeleccionada");
    });

    filasSeleccionadasLotes.clear();
    window.filasSeleccionadasLotes = filasSeleccionadasLotes;
}

/* ============================================================
   EXPORTAR SELECCIÓN PARA OTROS BOTONES
   ============================================================ */

export function obtenerFilasSeleccionadasLotes() {
    return Array.from(window.filasSeleccionadasLotes);
}
