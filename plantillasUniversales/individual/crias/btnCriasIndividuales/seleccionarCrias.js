/* ============================================================
   SELECCIÓN DE CRÍAS — VERSIÓN DEFINITIVA
   ============================================================ */

export let filasSeleccionadasCrias = new Set();   // SET REAL EXPORTADO

let modoSeleccionCrias = false;

/* ============================================================
   ACTIVAR / DESACTIVAR MODO SELECCIÓN
   ============================================================ */

const btn = document.getElementById("btnSeleccionarAnimales");
if (btn) {   // ⭐ evita error en pantallas donde no existe el botón

    btn.onclick = () => {

        modoSeleccionCrias = !modoSeleccionCrias;

        if (modoSeleccionCrias) {
            activarSeleccionCrias();
            alert("Modo selección activado. Haz clic en las filas para seleccionarlas.");
        } else {
            desactivarSeleccionCrias();
            alert("Modo selección desactivado.");
        }
    };
}

/* ============================================================
   ACTIVAR SELECCIÓN INDIVIDUAL
   ============================================================ */

export function activarSeleccionCrias() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {

        fila.style.cursor = "pointer";

        fila.onclick = () => {

            const id = fila.children[0].textContent.trim();

            if (filasSeleccionadasCrias.has(id)) {
                filasSeleccionadasCrias.delete(id);
                fila.classList.remove("filaSeleccionada");
            } else {
                filasSeleccionadasCrias.add(id);
                fila.classList.add("filaSeleccionada");
            }
        };
    });
}

/* ============================================================
   DESACTIVAR SELECCIÓN
   ============================================================ */

export function desactivarSeleccionCrias() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {
        fila.style.cursor = "default";
        fila.onclick = null;
        fila.classList.remove("filaSeleccionada");
    });

    filasSeleccionadasCrias.clear();
}

/* ============================================================
   EXPORTAR SELECCIÓN PARA OTROS BOTONES
   ============================================================ */

export function obtenerFilasSeleccionadasCrias() {
    return Array.from(filasSeleccionadasCrias);
}
