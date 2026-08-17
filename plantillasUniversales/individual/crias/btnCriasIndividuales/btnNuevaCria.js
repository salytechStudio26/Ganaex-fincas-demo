/* ============================================================
   NUEVO REGISTRO CON FORMULARIO POR ALERT — CRÍAS (ID GLOBAL)
   ============================================================ */

import controllerCrias from "../controladorCriasIndividualesDemo.js";
import { insertarRegistro } from "../criasIndividualesDemoBD.js";

/* ============================================================
   EVENTO PRINCIPAL
   ============================================================ */

const btn = document.getElementById("btnNuevoAnimal");
if (!btn) {
    // Si el botón no existe (como en SEPARACIÓN), no hacemos nada
} else {

    btn.onclick = async () => {

        // ⚠️ IMPORTANTE:
        // Ya NO generamos el ID aquí.
        // El ID se generará automáticamente dentro de insertarRegistro().

        const columnas = Array.from(
            document.querySelectorAll(".tablaContenido thead th")
        ).map(th => th.dataset.columna);

        const nuevoRegistro = {};

        for (const col of columnas) {

            if (col === "id") continue;   // El ID se asignará al guardar

            let valor = "";

            if (col === "tipoEntrada") {

                valor = prompt(
                    `Selecciona el tipo de entrada:\n\n` +
                    `1. Nacido en finca\n` +
                    `2. Entrada por transporte\n\n` +
                    `Escribe 1 o 2:`
                );

                if (valor === "1") valor = "Nacido en finca";
                else if (valor === "2") valor = "Entrada por transporte";
                else {
                    alert("Opción no válida. Registro cancelado.");
                    return;
                }

            } else {

                valor = prompt(`Introduce el valor para "${col}":`);

                const esObligatorio =
                    col === "identificacion" ||
                    col === "raza" ||
                    col === "sexo";

                if (esObligatorio && (!valor || valor.trim() === "")) {
                    alert(`El campo "${col}" es obligatorio. Registro cancelado.`);
                    return;
                }
            }

            nuevoRegistro[col] = valor ? valor.trim() : "";
        }

        // ⚠️ Aquí se genera el ID global automáticamente dentro del CRUD
        const idAsignado = await insertarRegistro(nuevoRegistro);

        await controllerCrias.recargarTabla();

        alert(`Cría creada correctamente con ID global ${idAsignado}.`);
    };
}
