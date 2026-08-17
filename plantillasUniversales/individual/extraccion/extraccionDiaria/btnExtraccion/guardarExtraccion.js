/* ============================================================
   BOTÓN GUARDAR — EXTRACCIÓN DIARIA
============================================================ */

import { insertarExtraccion, actualizarExtraccion } from "../extraccionDemoBD.js";
import controllerExtraccion from "../extraccionDemo.js";

document.getElementById("btnGuardarEstado").onclick = async () => {

    const tabla = document.querySelector(".tablaContenido");
    const thead = tabla.querySelector("thead tr");
    const tbody = tabla.querySelector("tbody");

    // Obtener columnas reales desde el thead
    const columnasActuales = Array.from(thead.children).map(th => th.dataset.columna);

    // Filas que están en modo edición
    const filas = Array.from(
        tbody.querySelectorAll(".filaEditableNueva, .filaEditableModificar")
    );

    if (filas.length === 0) {
        alert("No hay filas editables para guardar.");
        return;
    }

    for (const tr of filas) {

        const celdas = Array.from(tr.children);

        /* ============================================================
           OBTENER ID INTERNO CORRECTO
        ============================================================ */

        const idInterno = Number(tr.dataset.id);
        const esNuevo = isNaN(idInterno);

        const registro = {};

        columnasActuales.forEach((columna, index) => {

            const td = celdas[index];
            const input = td.querySelector("input");

            // El ID interno NO está en la tabla
            if (columna === "id") return;

            // Obtener valor del input o texto
            const valor = input ? input.value.trim() : td.innerText.trim();
            registro[columna] = valor;
        });

        /* ============================================================
           VALIDACIÓN — CAMPOS OBLIGATORIOS
        ============================================================ */

        const idHeredado = registro.idHeredado?.trim();
        const identificacion = registro.identificacion?.trim();
        const lote = registro.lote?.trim();

        // ⭐ ID heredado SIEMPRE obligatorio
        if (!idHeredado) {
            alert("El campo obligatorio 'ID Heredado' está vacío.");
            throw new Error("Campo obligatorio vacío");
        }

        // ⭐ Si identificación está rellena → lote opcional
        if (identificacion && identificacion !== "") {
            // OK
        }

        // ⭐ Si identificación está vacía → lote obligatorio
        if (!identificacion || identificacion === "") {
            if (!lote || lote === "") {
                alert("El campo obligatorio 'Nº Lote' está vacío porque no hay identificación.");
                throw new Error("Campo obligatorio vacío");
            }
        }

        /* ============================================================
           GUARDAR EN BD (insertar o actualizar)
        ============================================================ */

        if (esNuevo) {
            await insertarExtraccion(registro);
        } else {
            await actualizarExtraccion(idInterno, registro);
        }
    }

    /* ============================================================
       RECARGAR Y BLOQUEAR TABLA
    ============================================================ */

    await controllerExtraccion.recargarTabla();

    if (typeof controllerExtraccion.bloquearTabla === "function") {
        controllerExtraccion.bloquearTabla();
    }

    alert("Los cambios han sido guardados correctamente.");
};
