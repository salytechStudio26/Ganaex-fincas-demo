/* ============================================================
   CONTROLADOR UNIVERSAL DE EVENTOS
   Ratón + Táctil + Teclado
   ============================================================ */

let ultimoEvento = 0;

function evitarDobleEjecucion() {
    const ahora = Date.now();
    if (ahora - ultimoEvento < 300) return true;
    ultimoEvento = ahora;
    return false;
}

function addUniversalListener(elemento, handler) {

    if (!elemento) return;

    elemento.addEventListener("click", (e) => {
        if (evitarDobleEjecucion()) return;
        handler(e);
    });

    elemento.addEventListener("touchstart", (e) => {
        if (evitarDobleEjecucion()) return;
        handler(e);
    });

    elemento.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handler(e);
        }
    });

    elemento.setAttribute("tabindex", "0");
    elemento.setAttribute("role", "button");
}

function activarNavegacionTabla(idTabla) {

    const tabla = document.getElementById(idTabla);
    if (!tabla) return;

    let filas = Array.from(tabla.querySelectorAll("tbody tr"));
    let indiceSeleccionado = -1;

    tabla.setAttribute("tabindex", "0");

    tabla.addEventListener("keydown", (e) => {

        if (e.key === "ArrowDown") {
            e.preventDefault();
            indiceSeleccionado = Math.min(indiceSeleccionado + 1, filas.length - 1);
            seleccionarFila(filas, indiceSeleccionado);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            indiceSeleccionado = Math.max(indiceSeleccionado - 1, 0);
            seleccionarFila(filas, indiceSeleccionado);
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            marcarFila(filas[indiceSeleccionado]);
        }

        if (e.key === "Escape") {
            e.preventDefault();
            limpiarSeleccion(filas);
            indiceSeleccionado = -1;
        }
    });
}

function seleccionarFila(filas, indice) {
    filas.forEach(f => f.classList.remove("fila-activa"));
    if (filas[indice]) {
        filas[indice].classList.add("fila-activa");
        filas[indice].scrollIntoView({ block: "nearest" });
    }
}

function marcarFila(fila) {
    if (!fila) return;
    fila.classList.toggle("fila-seleccionada");
}

function limpiarSeleccion(filas) {
    filas.forEach(f => f.classList.remove("fila-seleccionada", "fila-activa"));
}
