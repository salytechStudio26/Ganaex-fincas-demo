/* ============================================================
   BOTÓN GUARDAR — ANIMALES INDIVIDUALES (versión final corregida)
   ============================================================ */

import { insertarRegistro, actualizarRegistro } from "../animalesIndividualesDemoBD.js";
import controllerAnimales from "../controladorAnimalesIndividualesDemo.js";

document.getElementById("btnGuardarAnimales").onclick = async () => {

    const tabla = document.querySelector(".tablaContenido");
    const thead = tabla.querySelector("thead tr");
    const tbody = tabla.querySelector("tbody");

    // Obtener columnas reales desde el thead
    const columnasActuales = Array.from(thead.children).map(th => th.dataset.columna);

    // Filas que están en modo edición (nuevo o modificar)
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
           DETECTAR SI ES NUEVO REGISTRO
           ============================================================ */

        const idCelda = celdas[0].innerText.trim();
        const esNuevo = (idCelda === "" || idCelda === "—");

        const registro = {};

        columnasActuales.forEach((columna, index) => {

            const td = celdas[index];
            const th = thead.children[index];
            const esObligatorio = th.innerText.includes("*");
            const input = td.querySelector("input");
            const select = td.querySelector("select");

            /* ------------------------------
               ID
               ------------------------------ */
            if (columna === "id") {
                if (!esNuevo) registro.id = Number(idCelda);
                return;
            }

            /* ------------------------------
               SEXO (select)
               ------------------------------ */
            if (columna === "sexo") {
                registro.sexo = select ? select.value : td.innerText.trim();
                return;
            }

            /* ============================================================
               VALIDACIÓN DE OBLIGATORIOS SOLO EN NUEVO REGISTRO
               ============================================================ */

            if (esObligatorio && esNuevo) {

                const valor = input ? input.value.trim() : td.innerText.trim();

                if (valor === "") {
                    alert(`El campo obligatorio "${th.innerText}" está vacío.`);
                    throw new Error("Campo obligatorio vacío");
                }

                registro[columna] = valor;
                return;
            }

            /* ============================================================
               CAMPOS NORMALES (MODIFICAR NO EXIGE NADA)
               ============================================================ */

            if (input) {
                registro[columna] = input.value.trim();
            } else {
                registro[columna] = td.innerText.trim();
            }
        });

        /* ============================================================
           GUARDAR EN BD (insertar o actualizar)
           ============================================================ */

        if (esNuevo) {
            await insertarRegistro(registro);
        } else {
            await actualizarRegistro(Number(idCelda), registro);
        }
    }

    /* ============================================================
       RECARGAR Y BLOQUEAR TABLA
       ============================================================ */

    await controllerAnimales.recargarTabla();

    if (typeof controllerAnimales.bloquearTabla === "function") {
        controllerAnimales.bloquearTabla();
    }

    alert("Los cambios han sido guardados correctamente.");
};
