/* ============================================================
   BOTÓN SELECCIONAR — TRANSPORTE (CORREGIDO)
   ============================================================ */

export let modoSeleccionTransporte = false;   // ⭐ AHORA SÍ EXPORTADO
let filasSeleccionadasTransporte = new Set();

document.getElementById("btnSeleccionarTransporte").onclick = () => {

    modoSeleccionTransporte = !modoSeleccionTransporte;

    if (modoSeleccionTransporte) {
        activarSeleccionTransporte();
        alert("Modo selección activado. Haz clic en las filas para seleccionarlas.");
    } else {
        desactivarSeleccionTransporte();
        alert("Modo selección desactivado.");
    }
};

export function activarSeleccionTransporte() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {

        fila.style.cursor = "pointer";

        fila.onclick = () => {

            const id = fila.dataset.id;  // ⭐ ID REAL

            if (filasSeleccionadasTransporte.has(id)) {
                filasSeleccionadasTransporte.delete(id);
                fila.classList.remove("filaSeleccionada");
            } else {
                filasSeleccionadasTransporte.add(id);
                fila.classList.add("filaSeleccionada");
            }

            console.log(`${filasSeleccionadasTransporte.size} fila(s) seleccionada(s)`);
        };
    });
}

export function desactivarSeleccionTransporte() {

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {
        fila.style.cursor = "default";
        fila.onclick = null;
        fila.classList.remove("filaSeleccionada");
    });

    filasSeleccionadasTransporte.clear();
}

export function obtenerFilasSeleccionadasTransporte() {
    return Array.from(filasSeleccionadasTransporte);
}
