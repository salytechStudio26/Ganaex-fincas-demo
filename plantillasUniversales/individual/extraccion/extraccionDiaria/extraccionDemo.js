// ==========================================================
// CONTROLADOR PRINCIPAL — EXTRACCIÓN DIARIA (VERSIÓN CORREGIDA)
// ==========================================================

// BD
import { obtenerTodasExtracciones } from "./extraccionDemoBD.js";

// Selección
import { activarSeleccionExtraccion, desactivarSeleccionExtraccion } 
    from "./btnExtraccion/seleccionarExtraccion.js";

// Botones
import "./btnExtraccion/nuevaExtraccion.js";
import "./btnExtraccion/copiarExtraccion.js";
import "./btnExtraccion/pegarExtraccion.js";
import "./btnExtraccion/modificarExtraccion.js";
import "./btnExtraccion/guardarExtraccion.js";
import "./btnExtraccion/eliminarExtraccion.js";

// ==========================================================
// VARIABLES
// ==========================================================

const tabla = document.getElementById("tablaExtraccion");
const cuerpoTabla = document.querySelector(".listadoRegistrosTabla");

// ⭐ Filtro de ordenación (valor por defecto)
window.filtroOrdenExtraccion = "idAsc";

// ==========================================================
// SELECCIÓN DE FILAS
// ==========================================================

let filasSeleccionadasExtraccion = new Set();

export function toggleSeleccionExtraccion(id) {
    if (filasSeleccionadasExtraccion.has(id)) {
        filasSeleccionadasExtraccion.delete(id);
    } else {
        filasSeleccionadasExtraccion.add(id);
    }
}

export function obtenerFilasSeleccionadasExtraccion() {
    return Array.from(filasSeleccionadasExtraccion);
}

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
// BLOQUEAR / DESBLOQUEAR TABLA
// ==========================================================

export function bloquearTabla() {
    tabla.classList.add("tablaBloqueada");
}

export function desbloquearTabla() {
    tabla.classList.remove("tablaBloqueada");
}

// ==========================================================
// RECARGAR TABLA — CON FILTRO DE ORDENACIÓN
// ==========================================================

export async function recargarTabla(modo = "normal") {

    let registros = await obtenerTodasExtracciones();

    /* ============================================================
       ORDEN SEGÚN FILTRO SELECCIONADO
       ============================================================ */

    switch (window.filtroOrdenExtraccion) {

        case "idAsc":
            registros.sort((a, b) => a.id - b.id);
            break;

        case "idDesc":
            registros.sort((a, b) => b.id - a.id);
            break;

        case "fechaAsc":
            registros.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
            break;

        case "fechaDesc":
            registros.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
            break;

        case "identAsc":
            registros.sort((a, b) => (a.identificacion || "").localeCompare(b.identificacion || ""));
            break;

        case "identDesc":
            registros.sort((a, b) => (b.identificacion || "").localeCompare(a.identificacion || ""));
            break;

        case "loteAsc":
            registros.sort((a, b) => (a.lote || "").localeCompare(b.lote || ""));
            break;

        case "loteDesc":
            registros.sort((a, b) => (b.lote || "").localeCompare(a.lote || ""));
            break;
    }

    /* ============================================================
       PINTAR TABLA
       ============================================================ */

    cuerpoTabla.innerHTML = "";

    const columnas = Array.from(tabla.querySelectorAll("thead th"))
        .map(th => th.dataset.columna);

    registros.forEach(reg => {

        const fila = document.createElement("tr");
        fila.dataset.id = String(reg.id);

        columnas.forEach(col => {
            const td = document.createElement("td");
            td.dataset.columna = col;
            td.textContent = reg[col] ?? "";
            fila.appendChild(td);
        });

        cuerpoTabla.appendChild(fila);
    });

    /* ============================================================
       ACTIVAR SELECCIÓN SOLO SI NO ESTAMOS EN MODO MODIFICAR
       ============================================================ */

    if (modo !== "modificar") {
        activarSeleccionExtraccion();
    }
}

// ==========================================================
// EVENTOS
// ==========================================================

function asignarEventos() {

    // ⭐ Evento del filtro de ordenación
    const filtro = document.getElementById("filtroOrdenExtraccion");

    if (filtro) {
        filtro.onchange = () => {
            window.filtroOrdenExtraccion = filtro.value;
            recargarTabla();
        };
    }

    // Los demás botones se conectan solos
}

// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

export default { 
    recargarTabla,
    bloquearTabla,
    desbloquearTabla,
    toggleSeleccionExtraccion,
    obtenerFilasSeleccionadasExtraccion
};
