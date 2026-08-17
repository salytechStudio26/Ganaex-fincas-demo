/* ============================================================
   BOTÓN GUARDAR — LOTES DE ANIMALES
   ============================================================ */

import { insertarRegistro, actualizarRegistro } from "../animalesLotesDemoBD.js";
import controllerLotes from "../controladorAnimalesLotesDemo.js";
import { obtenerIDGlobal } from "../../MenúPrincipal/idGlobal.js";

document.getElementById("btnGuardarAnimales").onclick = async () => {

    const tabla = document.querySelector(".tablaContenido");
    const thead = tabla.querySelector("thead tr");
    const tbody = tabla.querySelector("tbody");

    // Nombres REALES de columnas según dataset.columna
    const columnasActuales = Array.from(thead.children).map(th => th.dataset.columna);

    // SOLO filas editables
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

        /* ------------------------------------------------------------
           Detectar si es nuevo registro
           ------------------------------------------------------------ */
        const idTexto = celdas[0].innerText.trim();
        const esNuevo = (idTexto === "" || idTexto === "—");

        /* ------------------------------------------------------------
           Crear objeto registro
           ------------------------------------------------------------ */
        const registro = {};

        columnasActuales.forEach((columna) => {

            // Buscar la celda por data-columna (no por posición)
            const td = tr.querySelector(`[data-columna="${columna}"]`);

            if (!td) return;

            /* ------------------------------
               ID (siempre en la primera celda)
               ------------------------------ */
            if (columna === "id") {

                const idReal = tr.children[0].innerText.trim();

                registro.id = esNuevo ? null : Number(idReal);

                if (!esNuevo && (registro.id === null || isNaN(registro.id))) {
                    console.error("ID inválido detectado:", registro.id);
                    throw new Error("ID inválido al actualizar");
                }

                return;
            }

            /* ------------------------------
               SEXO (select)
               ------------------------------ */
            if (columna === "sexo") {

                const select = td.querySelector("select");
                const valorSexo = select ? select.value.trim() : td.innerText.trim();

                if (!valorSexo) {
                    alert("El campo SEXO es obligatorio.");
                    throw new Error("Campo obligatorio vacío");
                }

                registro.sexo = valorSexo;
                return;
            }

            /* ------------------------------
               Campos obligatorios (*)
               ------------------------------ */
            const th = tabla.querySelector(`thead th[data-columna="${columna}"]`);
            const esObligatorio = th.innerText.includes("*");

            let valor = "";

            const input = td.querySelector("input");
            const select = td.querySelector("select");

            if (input) valor = input.value.trim();
            else if (select) valor = select.value.trim();
            else valor = td.textContent.trim();

            if (esObligatorio && !valor) {
                alert(`El campo obligatorio "${th.innerText}" está vacío.`);
                throw new Error("Campo obligatorio vacío");
            }

            registro[columna] = valor;
        });

        /* ============================================================
           2. Guardar en BD
           ============================================================ */

        if (esNuevo) {
            registro.id = await obtenerSiguienteIDGlobal();
            await insertarRegistro(registro);
        } else {
            await actualizarRegistro(registro.id, registro);
        }
    }

    /* ============================================================
       3. Recargar tabla desde BD
       ============================================================ */

    await controllerLotes.recargarTabla();

    /* ============================================================
       4. Bloquear tabla
       ============================================================ */

    if (typeof controllerLotes.bloquearTabla === "function") {
        controllerLotes.bloquearTabla();
    }

    alert("Los cambios han sido guardados correctamente.");
};
