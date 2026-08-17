// ============================================================
// CONTROLADOR PRINCIPAL — CRÍAS INDIVIDUALES (VERSIÓN DEMO)
// ============================================================

// BD DEMO
import { obtenerTodosLosRegistros } from "./criasIndividualesDemoBD.js";

// Selección DEMO
import { activarSeleccionCrias } from "./btnCriasIndividuales/seleccionarCrias.js";

// Botones DEMO (solo los que existen)
import "./btnCriasIndividuales/btnNuevaCria.js";
import "./btnCriasIndividuales/buscarCrias.js";
import "./btnCriasIndividuales/eliminarCrias.js";
import "./btnCriasIndividuales/guardarCrias.js";
import "./btnCriasIndividuales/modificarCrias.js";
import "./btnCriasIndividuales/pdfCrias.js";
import "./btnCriasIndividuales/restablecerCrias.js";

// ============================================================
// VARIABLES
// ============================================================

const tabla = document.getElementById("tablaCriasIndividuales");
const cuerpoTabla = tabla.querySelector(".listadoRegistrosTabla");

// ============================================================
// INICIALIZACIÓN
// ============================================================

inicializarPantalla();

function inicializarPantalla() {
    bloquearTabla();
    recargarTabla();
}

// ============================================================
// BLOQUEAR / DESBLOQUEAR
// ============================================================

export function bloquearTabla() {
    tabla.classList.add("tablaBloqueada");
}

export function desbloquearTabla() {
    tabla.classList.remove("tablaBloqueada");
}

// ============================================================
// RECARGAR TABLA — DEMO
// ============================================================

export async function recargarTabla() {

    const registros = await obtenerTodosLosRegistros();

    // ⭐ LEER COLUMNAS DESDE EL THEAD REAL
    const ths = Array.from(tabla.querySelectorAll("thead th"));
    const columnas = ths.map(th => th.dataset.columna);

    // ⭐ RECONSTRUIR EL TBODY
    cuerpoTabla.innerHTML = "";

    registros.forEach(reg => {

        const fila = document.createElement("tr");

        columnas.forEach(col => {
            const td = document.createElement("td");
            td.dataset.columna = col;
            td.textContent = reg[col] ?? "";
            fila.appendChild(td);
        });

        cuerpoTabla.appendChild(fila);
    });

    activarSeleccionCrias();
}

// ============================================================
// EXPORTAR CONTROLADOR
// ============================================================

export default {
    recargarTabla,
    bloquearTabla,
    desbloquearTabla
};
