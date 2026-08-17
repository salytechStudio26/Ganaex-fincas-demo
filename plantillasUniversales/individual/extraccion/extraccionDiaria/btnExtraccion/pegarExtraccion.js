/* ============================================================
   BOTÓN PEGAR — EXTRACCIÓN DIARIA (CORREGIDO)
   ============================================================ */

import { insertarExtraccion } from "../extraccionDemoBD.js";
import controllerExtraccion from "../extraccionDemo.js";

/* ============================================================
   EVENTO PRINCIPAL — BOTÓN PEGAR
   ============================================================ */

document.getElementById("btnPegar").onclick = async () => {

    /* ============================================================
       1. Comprobar si hay datos copiados
       ============================================================ */

    if (!window.copiaExtraccion || window.copiaExtraccion.length === 0) {
        alert("No hay datos copiados. Use primero el botón Copiar.");
        return;
    }

    /* ============================================================
       2. Preguntar dónde pegar
       ============================================================ */

    let opcion = prompt(
        "¿Dónde deseas pegar los registros?\n" +
        "1 → Al principio de la tabla\n" +
        "2 → Al final de la tabla"
    );

    if (!opcion || !["1", "2"].includes(opcion.trim())) {
        alert("Opción no válida. Pegado cancelado.");
        return;
    }

    opcion = opcion.trim();

    /* ============================================================
       3. Insertar registros en IndexedDB
       ============================================================ */

    // Guardamos los ID heredados de los registros pegados
    const idsPegados = [];

    for (let registro of window.copiaExtraccion) {

        const nuevoRegistro = {
            idHeredado: registro.idHeredado,
            identificacion: registro.identificacion,
            lote: registro.lote,
            fecha: registro.fecha,
            tipo: registro.tipo,
            cantidadRecogida: registro.cantidadRecogida,
            zona: registro.zona,
            observaciones: registro.observaciones
        };

        const idInsertado = await insertarExtraccion(nuevoRegistro);

        // Guardamos el ID interno generado por IndexedDB
        idsPegados.push(idInsertado);
    }

    /* ============================================================
       4. Recargar tabla
       ============================================================ */

    await controllerExtraccion.recargarTabla();

    /* ============================================================
       5. Reordenar según la opción elegida
       ============================================================ */

    const tbody = document.querySelector(".listadoRegistrosTabla");

    if (!tbody) {
        alert("No se encontró el cuerpo de la tabla.");
        return;
    }

    const filas = [...tbody.querySelectorAll("tr")];

    // Filas recién pegadas
    const nuevasFilas = filas.filter(fila => idsPegados.includes(Number(fila.dataset.id)));

    if (opcion === "1") {
        // ⭐ Pegar al principio → mover las filas recién creadas arriba
        nuevasFilas.reverse().forEach(fila => tbody.prepend(fila));
    } else {
        // ⭐ Pegar al final → mover las filas recién creadas abajo
        nuevasFilas.forEach(fila => tbody.appendChild(fila));
    }

    controllerExtraccion.bloquearTabla();

    alert(`Se han pegado ${window.copiaExtraccion.length} registro(s).`);
};
