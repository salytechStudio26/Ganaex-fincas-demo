/* ============================================================
   BOTÓN MODIFICAR — EXTRACCIÓN DIARIA (versión con data-id)
   ============================================================ */

import { obtenerFilasSeleccionadasExtraccion } from "./seleccionarExtraccion.js";
import { actualizarExtraccion } from "../extraccionDemoBD.js";
import controllerExtraccion from "../extraccionDemo.js";

/* ============================================================
   EVENTO DEL BOTÓN MODIFICAR
   ============================================================ */

document.getElementById("btnModificarEstado").onclick = async () => {

    const filasSeleccionadas = obtenerFilasSeleccionadasExtraccion();
    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    if (filasSeleccionadas.length > 0) {

        filas.forEach(fila => {

            // ⭐ ID interno REAL desde data-id
            const id = Number(fila.dataset.id);

            if (filasSeleccionadas.includes(String(id))) {
                habilitarFilaParaEdicion(fila);
            }
        });

    } else {

        filas.forEach(fila => habilitarFilaParaEdicion(fila));
    }

    alert("Modo edición activado. Modifica los datos y pulsa Guardar.");
};


/* ============================================================
   HABILITAR UNA FILA PARA EDICIÓN
   ============================================================ */

function habilitarFilaParaEdicion(fila) {

    fila.classList.add("filaEditableModificar");

    const celdas = fila.children;

    for (let i = 0; i < celdas.length; i++) {

        const celda = celdas[i];
        const valor = celda.textContent;

        // ⭐ ID interno NO editable → está en data-id, no en la tabla
        // En Extracción, la primera columna es idHeredado → editable
        // Por tanto NO saltamos ninguna columna

        celda.innerHTML = `<input type="text" value="${valor}">`;
    }
}


/* ============================================================
   GUARDAR CAMBIOS
   ============================================================ */

document.getElementById("btnGuardarEstado").onclick = async () => {

    const filasEditadas = document.querySelectorAll(".filaEditableModificar");

    for (const fila of filasEditadas) {

        // ⭐ ID interno REAL desde data-id
        const id = Number(fila.dataset.id);

        const nuevoRegistro = {};
        const celdas = fila.children;

        for (let i = 0; i < celdas.length; i++) {

            const celda = celdas[i];

            const valor = celda.querySelector("input")?.value ?? celda.textContent;

            const nombreColumna = obtenerNombreColumnaExtraccion(i);

            nuevoRegistro[nombreColumna] = valor;
        }

        await actualizarExtraccion(id, nuevoRegistro);
    }

    alert("Cambios guardados correctamente.");

    controllerExtraccion.recargarTabla();
    controllerExtraccion.bloquearTabla();
};


/* ============================================================
   OBTENER NOMBRE DE COLUMNA SEGÚN ÍNDICE — EXTRACCIÓN
   ============================================================ */

function obtenerNombreColumnaExtraccion(indice) {

    const columnasExtraccion = [
        "idHeredado",        // 0
        "identificacion",    // 1
        "lote",              // 2
        "fecha",             // 3
        "tipo",              // 4
        "cantidadRecogida",  // 5
        "zona",              // 6
        "observaciones"      // 7
    ];

    return columnasExtraccion[indice];
}
