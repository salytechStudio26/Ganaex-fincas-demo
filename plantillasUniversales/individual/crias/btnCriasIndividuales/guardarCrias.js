/* ============================================================
   BOTÓN GUARDAR: CRÍAS INDIVIDUALES
   ============================================================ */

import { insertarRegistro, actualizarRegistro } from "../criasIndividualesDemoBD.js";
import controllerCrias from "../controladorCriasIndividualesDemo.js";

/* ============================================================
   PROTECCIÓN DEL BOTÓN
   ============================================================ */

const btn = document.getElementById("btnGuardarAnimales");
if (!btn) {
    // Si el botón no existe (como en SEPARACIÓN), no hacemos nada.
} else {

    btn.onclick = async () => {

        const tabla = document.querySelector(".tablaContenido");
        const thead = tabla.querySelector("thead tr");
        const tbody = tabla.querySelector("tbody");

        const columnasActuales = Array.from(thead.children).map(th => th.dataset.columna);

        const filas = Array.from(tbody.querySelectorAll(".filaEditableNueva, .filaEditableModificar"));

        if (filas.length === 0) {
            alert("No hay filas editables para guardar.");
            return;
        }

        /* ============================================================
           1. Recorrer filas editables
           ============================================================ */

        for (const tr of filas) {

            const celdas = Array.from(tr.children);

            const idCelda = celdas[0].innerText.trim();
            const esNuevo = (idCelda === "" || idCelda === "—");

            const registro = {};

            columnasActuales.forEach((columna, index) => {

                const td = celdas[index];

                if (columna === "id") {
                    if (!esNuevo) registro.id = Number(idCelda);
                    return;
                }

                if (columna === "sexo") {
                    const select = td.querySelector("select");
                    registro.sexo = select ? select.value : td.innerText.trim();
                    return;
                }

                const th = thead.children[index];
                const esObligatorio = th.innerText.includes("*");

                const input = td.querySelector("input");

                if (esObligatorio) {
                    if (!input || input.value.trim() === "") {
                        alert(`El campo obligatorio "${th.innerText}" está vacío.`);
                        throw new Error("Campo obligatorio vacío");
                    }
                    registro[columna] = input.value.trim();
                    return;
                }

                if (input) {
                    registro[columna] = input.value.trim();
                } else {
                    registro[columna] = td.innerText.trim();
                }
            });

            /* ============================================================
               2. Guardar en BD
               ============================================================ */

            if (esNuevo) {
                await insertarRegistro(registro);
            } else {
                await actualizarRegistro(Number(idCelda), registro);
            }
        }

        /* ============================================================
           3. Recargar tabla desde BD
           ============================================================ */

        await controllerCrias.recargarTabla();

        /* ============================================================
           4. Bloquear tabla
           ============================================================ */

        if (typeof controllerCrias.bloquearTabla === "function") {
            controllerCrias.bloquearTabla();
        }

        alert("Los cambios han sido guardados correctamente.");
    };
}
