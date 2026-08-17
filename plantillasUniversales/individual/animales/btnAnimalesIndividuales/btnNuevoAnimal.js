/* ============================================================
   NUEVO REGISTRO — ANIMALES (ID GLOBAL)
   ============================================================ */

import controllerAnimales from "../controladorAnimalesIndividualesDemo.js";
import { insertarRegistro } from "../animalesIndividualesDemoBD.js";
import { obtenerIDGlobal } from "../../MenúPrincipal/idGlobal.js";   // ⭐ CORRECTO

/* ============================================================
   EVENTO PRINCIPAL
   ============================================================ */

document.getElementById("btnNuevoAnimal").onclick = async () => {

    /* ============================================================
       1. Generar ID global automáticamente
       ============================================================ */
    const nuevoID = await obtenerIDGlobal();   // ⭐ CORRECTO

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

        let valor = prompt(`Introduce el valor para "${col}":`);

        // Validar obligatorios
        const esObligatorio =
            col === "identificacion" ||
            col === "raza" ||
            col === "sexo";

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
    await controllerAnimales.recargarTabla();

    alert(`Registro creado correctamente con ID global ${nuevoID}.`);
};
