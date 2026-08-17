// ==========================================================
// CONTROLADOR PRINCIPAL — LOTES DE ANIMALES (VERSIÓN DEMO)
// ==========================================================

// BD DEMO
import { obtenerTodosLosRegistros } from "./animalesLotesDemoBD.js";

// Selección DEMO
import { activarSeleccionLotes } from "./btnAnimalesLotes/seleccionarAnimales.js";

// Botones DEMO (solo los que existen)
import "./btnAnimalesLotes/btnNuevoAnimalLote.js";
import "./btnAnimalesLotes/buscarAnimales.js";
import "./btnAnimalesLotes/eliminarAnimales.js";
import "./btnAnimalesLotes/guardarAnimales.js";
import "./btnAnimalesLotes/modificarAnimal.js";
import "./btnAnimalesLotes/pdfAnimales.js";
import "./btnAnimalesLotes/restablecerAnimales.js";

// ==========================================================
// VARIABLES
// ==========================================================

const tabla = document.getElementById("tablaAnimalesLotes");
const cuerpoTabla = tabla.querySelector(".listadoRegistrosTabla");

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

inicializarPantalla();

function inicializarPantalla() {
    bloquearTabla();
    recargarTabla();
}

// ==========================================================
// BLOQUEAR / DESBLOQUEAR
// ==========================================================

export function bloquearTabla() {
    tabla.classList.add("tablaBloqueada");
}

export function desbloquearTabla() {
    tabla.classList.remove("tablaBloqueada");
}

// ==========================================================
// RECARGAR TABLA — DEMO
// ==========================================================

export async function recargarTabla() {

    const registros = await obtenerTodosLosRegistros();

    // ⭐ LEER COLUMNAS DESDE EL THEAD REAL
    const ths = Array.from(tabla.querySelectorAll("thead th"));
    const columnas = ths.map(th => th.dataset.columna);

    // ⭐ RECONSTRUIR EL CUERPO DE LA TABLA
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

    activarSeleccionLotes();
}

// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

export default {
    recargarTabla,
    bloquearTabla,
    desbloquearTabla
};
