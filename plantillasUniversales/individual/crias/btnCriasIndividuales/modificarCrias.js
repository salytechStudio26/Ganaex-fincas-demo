/* ============================================================
   BOTÓN MODIFICAR — CRÍAS INDIVIDUALES
   ============================================================ */

import { obtenerFilasSeleccionadasCrias } from "./seleccionarCrias.js";
import { actualizarRegistro } from "../criasIndividualesDemoBD.js";
import controllerCrias from "../controladorCriasIndividualesDemo.js";

/* ============================================================
   EVENTO DEL BOTÓN MODIFICAR
   ============================================================ */

// ⭐ PROTECCIÓN: evita error si el botón NO existe (como en SEPARACIÓN)
const btnModificar = document.getElementById("btnModificarAnimal");
if (!btnModificar) {
    // Si el botón no existe, no hacemos nada.
} else {

    btnModificar.onclick = async () => {

        const filasSeleccionadas = obtenerFilasSeleccionadasCrias();
        const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

        if (filasSeleccionadas.length > 0) {
            filas.forEach(fila => {
                const id = fila.children[0].textContent;
                if (filasSeleccionadas.includes(id)) {
                    habilitarFilaParaEdicion(fila);
                }
            });
        } else {
            filas.forEach(fila => habilitarFilaParaEdicion(fila));
        }

        alert("Modo edición activado. Modifica los datos y pulsa Guardar.");
    };
}

/* ============================================================
   HABILITAR UNA FILA PARA EDICIÓN
   ============================================================ */

function habilitarFilaParaEdicion(fila) {

    fila.classList.add("filaEditableModificar");

    const celdas = fila.children;

    for (let i = 0; i < celdas.length; i++) {

        const celda = celdas[i];
        const valor = celda.textContent;

        const nombreColumna = obtenerNombreColumna(i);

        if (nombreColumna === "id") continue;

        if (nombreColumna === "sexo") {
            celda.innerHTML = `
                <select>
                    <option value="Macho" ${valor === "Macho" ? "selected" : ""}>Macho</option>
                    <option value="Hembra" ${valor === "Hembra" ? "selected" : ""}>Hembra</option>
                </select>
            `;
            continue;
        }

        if (nombreColumna === "tipoEntrada") {
            celda.innerHTML = `
                <select>
                    <option value="Nacido en finca" ${valor === "Nacido en finca" ? "selected" : ""}>Nacido en finca</option>
                    <option value="Entrada por transporte" ${valor === "Entrada por transporte" ? "selected" : ""}>Entrada por transporte</option>
                </select>
            `;
            continue;
        }

        celda.innerHTML = `<input type="text" value="${valor}">`;
    }
}

/* ============================================================
   GUARDAR CAMBIOS
   ============================================================ */

// ⭐ PROTECCIÓN: evita error si el botón NO existe (como en SEPARACIÓN)
const btnGuardar = document.getElementById("btnGuardarAnimales");
if (!btnGuardar) {
    // No existe en SEPARACIÓN → no hacemos nada
} else {

    btnGuardar.onclick = async () => {

        const filasEditadas = document.querySelectorAll(".filaEditableModificar");

        for (const fila of filasEditadas) {

            const id = Number(fila.children[0].textContent);

            const nuevoRegistro = {};
            const celdas = fila.children;

            for (let i = 0; i < celdas.length; i++) {

                const celda = celdas[i];
                const nombreColumna = obtenerNombreColumna(i);

                if (nombreColumna === "id") {
                    nuevoRegistro.id = id;
                    continue;
                }

                if (nombreColumna === "sexo") {
                    nuevoRegistro.sexo = celda.querySelector("select").value;
                    continue;
                }

                if (nombreColumna === "tipoEntrada") {
                    nuevoRegistro.tipoEntrada = celda.querySelector("select").value;
                    continue;
                }

                const valor = celda.querySelector("input")?.value ?? celda.textContent;

                nuevoRegistro[nombreColumna] = valor;
            }

            await actualizarRegistro(id, nuevoRegistro);
        }

        alert("Cambios guardados correctamente.");
        controllerCrias.recargarTabla();
    };
}

/* ============================================================
   OBTENER NOMBRE DE COLUMNA SEGÚN ÍNDICE
   ============================================================ */

function obtenerNombreColumna(indice) {

    const columnasFijas = [
        "id",
        "identificacion",
        "fechaNacimiento",
        "tipoEntrada",
        "crotalMadre",
        "raza",
        "sexo",
        "zona",
        "observaciones"
    ];

    if (indice < columnasFijas.length) {
        return columnasFijas[indice];
    }

    const primeraFila = document.querySelector(".listadoRegistrosTabla tr");
    const ths = primeraFila.children;

    return ths[indice].textContent;
}
