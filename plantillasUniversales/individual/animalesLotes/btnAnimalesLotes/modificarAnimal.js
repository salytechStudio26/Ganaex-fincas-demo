/* ============================================================
   BOTÓN MODIFICAR — LOTES DE ANIMALES
   ============================================================ */

import { obtenerFilasSeleccionadasLotes } from "./seleccionarAnimales.js";

/* ============================================================
   EVENTO DEL BOTÓN MODIFICAR
   ============================================================ */

document.getElementById("btnModificarAnimal").onclick = async () => {

    const filasSeleccionadas = obtenerFilasSeleccionadasLotes();
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
        if (celda.dataset.columna === "sexo") {
            celda.innerHTML = `
                <select>
                    <option value="Machos" ${valor === "Machos" ? "selected" : ""}>Machos</option>
                    <option value="Hembras" ${valor === "Hembras" ? "selected" : ""}>Hembras</option>
                    <option value="Mixtos" ${valor === "Mixtos" ? "selected" : ""}>Mixtos</option>
                </select>
            `;
            continue;
        }

        // Todas las demás columnas → input
        celda.innerHTML = `<input type="text" value="${valor}">`;
    }
}
