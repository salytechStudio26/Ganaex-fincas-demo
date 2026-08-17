// ==========================================================
// CONTROLADOR PRINCIPAL DE ANIMALES INDIVIDUALES
// ==========================================================

// BD
import { obtenerTodosLosRegistros } from "./animalesIndividualesDemoBD.js";

// Selección
import { activarSeleccionAnimales } from "./btnAnimalesIndividuales/seleccionarAnimales.js";

// Botones

import "./btnAnimalesIndividuales/btnNuevoAnimal.js";
import "./btnAnimalesIndividuales/eliminarAnimales.js";
import "./btnAnimalesIndividuales/modificarAnimal.js";
import "./btnAnimalesIndividuales/guardarAnimales.js";
import "./btnAnimalesIndividuales/buscarAnimales.js";
import "./btnAnimalesIndividuales/restablecerAnimales.js";
import "./btnAnimalesIndividuales/pdfAnimales.js";

// ==========================================================
// VARIABLES
// ==========================================================

const tabla = document.getElementById("tablaAnimalesIndividuales");
const cuerpoTabla = document.querySelector(".listadoRegistrosTabla");

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

inicializarPantalla();

function inicializarPantalla() {
    bloquearTabla();
    recargarTabla();
    asignarEventos();
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
// RECARGAR TABLA — BASADO EN EL THEAD REAL
// ==========================================================

export async function recargarTabla() {

    const registros = await obtenerTodosLosRegistros();

    // ⭐ 1. Obtener columnas reales desde el thead
    const ths = Array.from(document.querySelectorAll(".tablaContenido thead th"));
    const columnas = ths.map(th => th.dataset.columna);

    // ⭐ 2. Vaciar cuerpo de la tabla
    cuerpoTabla.innerHTML = "";

    // ⭐ 3. Pintar filas usando esas columnas
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

    activarSeleccionAnimales();
}

// ==========================================================
// EVENTOS
// ==========================================================

function asignarEventos() {
    // Los botones se conectan solos
}

// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

export default {
    recargarTabla,
    bloquearTabla,
    desbloquearTabla
};
