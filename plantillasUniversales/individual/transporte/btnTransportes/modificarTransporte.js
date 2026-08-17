/* ============================================================
   BOTÓN MODIFICAR — TRANSPORTE (CORREGIDO DEFINITIVO)
   ============================================================ */

import { desactivarSeleccionTransporte } from "./seleccionarTransporte.js";

document.getElementById("btnModificarTransporte").onclick = () => {

    desactivarSeleccionTransporte();

    const filas = document.querySelectorAll(".listadoRegistrosTabla tr");

    filas.forEach(fila => {
        fila.classList.add("filaEditableModificar");   // ⭐ NECESARIO
        habilitarFilaParaEdicion(fila);
    });

    alert("Modo edición activado. Modifica los datos y pulsa Guardar.");
};

function habilitarFilaParaEdicion(fila) {

    const celdas = fila.querySelectorAll("td");

    celdas.forEach(celda => {

        const valorActual = celda.textContent.trim();

        const input = document.createElement("input");
        input.type = "text";
        input.value = valorActual;
        input.classList.add("input-edicion");

        celda.textContent = "";
        celda.appendChild(input);
    });
}
