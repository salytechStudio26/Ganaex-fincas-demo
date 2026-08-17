/* ============================================================
   BOTÓN MODIFICAR — ANIMALES INDIVIDUALES
   ============================================================ */

import { obtenerFilasSeleccionadasAnimales } from "./seleccionarAnimales.js";
import { obtenerTodosLosRegistros, actualizarRegistro } from "../animalesIndividualesDemoBD.js";
import controllerAnimales from "../controladorAnimalesIndividualesDemo.js";

/* ============================================================
   EVENTO DEL BOTÓN MODIFICAR
   ============================================================ */

document.getElementById("btnModificarAnimal").onclick = async () => {

    const filasSeleccionadas = obtenerFilasSeleccionadasAnimales();
    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    // Si hay filas seleccionadas → solo esas se editan
    if (filasSeleccionadas.length > 0) {
        filas.forEach(fila => {
            const id = fila.children[0].textContent;
            if (filasSeleccionadas.includes(id)) {
                habilitarFilaParaEdicion(fila);
            }
        });
    } else {
        // Si no hay selección → toda la tabla editable
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

        // ID no editable
        if (i === 0) continue;

        // SEXO → select
        if (celda.cellIndex === 4) {
            celda.innerHTML = `
                <select>
                    <option value="Macho" ${valor === "Macho" ? "selected" : ""}>Macho</option>
                    <option value="Hembra" ${valor === "Hembra" ? "selected" : ""}>Hembra</option>
                </select>
            `;
            continue;
        }

        // Todas las demás columnas → input
        celda.innerHTML = `<input type="text" value="${valor}">`;
    }
}


/* ============================================================
   GUARDAR CAMBIOS
   ============================================================ */

document.getElementById("btnGuardarAnimales").onclick = async () => {

    const filasEditadas = document.querySelectorAll(".filaEditableModificar");

    for (const fila of filasEditadas) {

        const id = Number(fila.children[0].textContent);

        const nuevoRegistro = {};
        const celdas = fila.children;

        for (let i = 0; i < celdas.length; i++) {

            const celda = celdas[i];

            // ID
            if (i === 0) {
                nuevoRegistro.id = id;
                continue;
            }

            // SEXO
            if (i === 4) {
                nuevoRegistro.sexo = celda.querySelector("select").value;
                continue;
            }

            // INPUTS normales
            const valor = celda.querySelector("input")?.value ?? celda.textContent;

            // Nombre de la columna según cabecera fija + columnas nuevas
            const nombreColumna = obtenerNombreColumna(i);

            nuevoRegistro[nombreColumna] = valor;
        }

        await actualizarRegistro(id, nuevoRegistro);
    }

    alert("Cambios guardados correctamente.");

    controllerAnimales.recargarTabla();
};


/* ============================================================
   OBTENER NOMBRE DE COLUMNA SEGÚN ÍNDICE
   ============================================================ */

function obtenerNombreColumna(indice) {

    const columnasFijas = [
        "id",
        "identificacion",
        "fechaNacimiento",
        "raza",
        "sexo",
        "zona",
        "observaciones"
    ];

    // Si es una columna fija
    if (indice < columnasFijas.length) {
        return columnasFijas[indice];
    }

    // Si es una columna nueva
    const primeraFila = document.querySelector(".listadoRegistrosTabla tr");
    const ths = primeraFila.children;

    return ths[indice].textContent;
}
