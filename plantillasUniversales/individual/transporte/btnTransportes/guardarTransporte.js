/* ============================================================
   BOTÓN GUARDAR — TRANSPORTE (CORREGIDO)
   ============================================================ */

import { actualizarRegistro } from "../transporteDemoBD.js";
import controllerTransporte from "../transporteDemo.js";

document.getElementById("btnGuardarTransporte").onclick = async () => {

    const filasEditadas = document.querySelectorAll(".filaEditableModificar");

    for (const fila of filasEditadas) {

        // ⭐ ID REAL DEL REGISTRO
        const id = Number(fila.dataset.id);

        const nuevoRegistro = {};
        const celdas = fila.children;

        for (let i = 0; i < celdas.length; i++) {

            const celda = celdas[i];

            if (i === 1) {
                nuevoRegistro.id = id;
                continue;
            }

            const valor = celda.querySelector("input")?.value ?? celda.textContent;
            const nombreColumna = obtenerNombreColumna(i);

            nuevoRegistro[nombreColumna] = valor;
        }

        await actualizarRegistro(id, nuevoRegistro);
    }

    alert("Cambios guardados correctamente.");

    controllerTransporte.recargarTabla();
    controllerTransporte.bloquearTabla();
};

function obtenerNombreColumna(indice) {

    const columnas = [
        "tipoTransporte",
        "id",
        "idHeredado",
        "fechaTransporte",
        "identificacion",
        "lote",
        "cantidad",
        "descripcion",
        "observaciones"
    ];

    return columnas[indice];
}
