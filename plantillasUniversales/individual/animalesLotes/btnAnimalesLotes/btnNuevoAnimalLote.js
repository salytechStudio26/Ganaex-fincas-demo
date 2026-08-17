//NUEVO REGISTRO DE ANIMALES LOTES

import controllerLotes from "../controladorAnimalesLotesDemo.js";
import { insertarRegistro } from "../animalesLotesDemoBD.js";
import { obtenerIDGlobal } from "../../MenúPrincipal/idGlobal.js";

/* ============================================================
   EVENTO PRINCIPAL
   ============================================================ */

document.getElementById("btnNuevoAnimal").onclick = async () => {

    /* ============================================================
       1. Generar ID global automáticamente
       ============================================================ */
    const nuevoID = await obtenerIDGlobal();

    /* ============================================================
       2. Detectar columnas reales de la tabla
       ============================================================ */
    const columnas = Array.from(
        document.querySelectorAll(".tablaContenido thead th")
    ).map(th => th.dataset.columna);

    /* ============================================================
       3. Crear objeto del nuevo registro
       ============================================================ */
    const nuevoRegistro = { id: nuevoID };

    /* ============================================================
       4. Pedir datos campo por campo
       ============================================================ */
    for (const col of columnas) {

        if (col === "id") continue; // ya generado

        let valor = "";

        /* ============================================================
           4A. Campo SEXO → SELECT con 3 opciones
           ============================================================ */
        if (col === "sexo") {

            valor = prompt(
                'Selecciona el sexo del lote:\n\n' +
                '1. Machos\n' +
                '2. Hembras\n' +
                '3. Mixtos\n\n' +
                'Escribe el número de la opción:'
            );

            if (!valor) {
                alert("El campo sexo es obligatorio.");
                return;
            }

            if (valor === "1") valor = "Machos";
            else if (valor === "2") valor = "Hembras";
            else if (valor === "3") valor = "Mixtos";
            else {
                alert("Opción inválida. Registro cancelado.");
                return;
            }

            nuevoRegistro[col] = valor;
            continue;
        }

        /* ============================================================
           4B. Otros campos → prompt normal
           ============================================================ */
        valor = prompt(`Introduce el valor para "${col}":`);

        const esObligatorio =
            col === "lote" ||
            col === "cantidad";

        if (esObligatorio && (!valor || valor.trim() === "")) {
            alert(`El campo "${col}" es obligatorio. Registro cancelado.`);
            return;
        }

        nuevoRegistro[col] = valor ? valor.trim() : "";
    }

    /* ============================================================
       5. Insertar registro en IndexedDB
       ============================================================ */
    await insertarRegistro(nuevoRegistro);

    /* ============================================================
       6. Recargar tabla
       ============================================================ */
    await controllerLotes.recargarTabla();

    alert(`Registro creado correctamente con ID global ${nuevoID}.`);
};
