// ==========================================================
// CONTROLADOR PRINCIPAL — TRANSPORTE (VERSIÓN DEMO)
// ==========================================================

// BD DEMO
import { obtenerTodosLosRegistros } from "./transporteDemoBD.js";

// Selección DEMO
import { activarSeleccionTransporte } from "./btnTransportes/seleccionarTransporte.js";

// Botones DEMO (los nombres y rutas ya están correctos según tu proyecto)
import "./btnTransportes/btnNuevoTransporte.js";
import "./btnTransportes/modificarTransporte.js";
import "./btnTransportes/guardarTransporte.js";
import "./btnTransportes/eliminarTransporte.js";

// ==========================================================
// VARIABLES
// ==========================================================

const tabla = document.getElementById("tablaTransporte");
const cuerpoTabla = tabla.querySelector(".listadoRegistrosTabla");

// ==========================================================
// SELECCIÓN DE FILAS
// ==========================================================

let filasSeleccionadas = new Set();

export function toggleSeleccion(id) {
    if (filasSeleccionadas.has(id)) {
        filasSeleccionadas.delete(id);
    } else {
        filasSeleccionadas.add(id);
    }
}

export function obtenerSeleccion() {
    return Array.from(filasSeleccionadas);
}

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

inicializarPantalla();

function inicializarPantalla() {
    bloquearTabla();
    recargarTabla();
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
// RECARGAR TABLA — VERSIÓN DEMO
// ==========================================================

export async function recargarTabla() {

    const registros = await obtenerTodosLosRegistros();

    cuerpoTabla.innerHTML = "";

    const columnas = Array.from(tabla.querySelectorAll("thead th"))
        .map(th => th.dataset.columna);

    registros.forEach(reg => {

        const fila = document.createElement("tr");
        fila.dataset.id = String(reg.id);

        columnas.forEach(col => {

            const td = document.createElement("td");
            td.dataset.columna = col;

            // ⭐ OCULTAR ID EN SALIDA (igual que en tu versión final)
            if (col === "id" && reg.tipoTransporte === "Salida") {
                td.textContent = "";
            } else {
                td.textContent = reg[col] ?? "";
            }

            fila.appendChild(td);
        });

        cuerpoTabla.appendChild(fila);
    });

    activarSeleccionTransporte();
}

// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

export default { 
    recargarTabla,
    bloquearTabla,
    desbloquearTabla,
    toggleSeleccion,
    obtenerSeleccion
};
