/* ============================================================
   NUEVO REGISTRO — TRANSPORTE (versión corregida)
   ============================================================ */

import controllerTransporte from "../transporteDemo.js";
import { insertarRegistro } from "../transporteDemoBD.js";

// ⭐ IMPORTACIÓN CORRECTA DEL ID GLOBAL
import { obtenerIDGlobal } from "../../MenúPrincipal/idGlobal.js";

/* ============================================================
   IMPORTACIONES DE LAS BDs REALES
   ============================================================ */

import { obtenerTodosLosRegistros as obtenerAnimalesIndividuales } 
    from "../../animales/animalesIndividualesDemoBD.js";

import { obtenerTodosLosRegistros as obtenerCriasIndividuales } 
    from "../../crias/criasIndividualesDemoBD.js";

import { obtenerTodosLosRegistros as obtenerAnimalesLotes } 
    from "../../animalesLotes/animalesLotesDemoBD.js";


/* ============================================================
   EVENTO PRINCIPAL
   ============================================================ */

document.getElementById("btnNuevoTransporte").onclick = async () => {

    controllerTransporte.desbloquearTabla();

    let tipo = prompt(
        "Tipo de transporte:\n" +
        "- Entrada\n" +
        "- Salida\n\n" +
        "Escribe exactamente 'Entrada' o 'Salida':"
    );

    if (!tipo || !["Entrada", "Salida"].includes(tipo.trim())) {
        alert("Tipo de transporte no válido. Registro cancelado.");
        return;
    }

    tipo = tipo.trim();

    let id = undefined;      
    let idHeredado = "";

    /* ============================================================
       ENTRADA → ID GLOBAL
       ============================================================ */
    if (tipo === "Entrada") {
        id = await obtenerIDGlobal();   // ⭐ AHORA FUNCIONA
        idHeredado = "";
    }

    /* ============================================================
       SALIDA → ID HEREDADO
       ============================================================ */
    let identificacion = "";
    let lote = "";
    let cantidad = "";

    if (tipo === "Salida") {

        identificacion = prompt("Introduce Nº identificación (crotal) si es individual:");
        identificacion = identificacion ? identificacion.trim() : "";

        lote = prompt("Introduce Nº lote si es un grupo de animales:");
        lote = lote ? lote.trim() : "";

        cantidad = prompt("Introduce cantidad total de animales (si es lote):");
        cantidad = cantidad ? cantidad.trim() : "";

        const esIndividual = identificacion !== "";
        const esLote = lote !== "" || cantidad !== "";

        if (!esIndividual && !esLote) {
            alert("Debe indicar un Nº identificación o un Nº lote + cantidad.");
            return;
        }

        if (esLote && (lote === "" || cantidad === "")) {
            alert("Para lotes, Nº lote y cantidad son obligatorios.");
            return;
        }

        const idEncontrado = await buscarIDEnTablas(identificacion, lote);

        if (!idEncontrado) {
            alert("No existe ningún registro con ese crotal o lote. Registro cancelado.");
            return;
        }

        idHeredado = idEncontrado;

        id = undefined;   // ⭐ IndexedDB generará el ID
    }

    let fechaTransporte = prompt("Introduce la fecha del transporte (dd/mm/aaaa):");

    if (!fechaTransporte || fechaTransporte.trim() === "") {
        alert("La fecha del transporte es obligatoria.");
        return;
    }

    fechaTransporte = fechaTransporte.trim();

    let descripcion = prompt("Descripción del transporte:");
    descripcion = descripcion ? descripcion.trim() : "";

    let observaciones = prompt("Observaciones:");
    observaciones = observaciones ? observaciones.trim() : "";

    const nuevoRegistro = {
        tipoTransporte: tipo,
        id,
        idHeredado,
        fechaTransporte,
        identificacion,
        lote,
        cantidad,
        descripcion,
        observaciones
    };

    await insertarRegistro(nuevoRegistro);

    await controllerTransporte.recargarTabla();
    controllerTransporte.bloquearTabla();

    alert(`Registro creado correctamente.`);
};

/* ============================================================
   FUNCIÓN PARA NORMALIZAR VALORES
   ============================================================ */

function normalizar(valor) {
    return String(valor || "").trim().toLowerCase();
}

/* ============================================================
   FUNCIÓN PARA BUSCAR ID HEREDADO EN TODAS LAS TABLAS
   ============================================================ */

async function buscarIDEnTablas(identificacion, lote) {

    const idNorm = normalizar(identificacion);
    const loteNorm = normalizar(lote);

    if (idNorm !== "") {

        const animales = await obtenerAnimalesIndividuales();
        const encontrado1 = animales.find(a =>
            normalizar(a.identificacion) === idNorm
        );
        if (encontrado1) return encontrado1.id;

        const crias = await obtenerCriasIndividuales();
        const encontrado2 = crias.find(c =>
            normalizar(c.identificacion) === idNorm
        );
        if (encontrado2) return encontrado2.id;

        const animalesLotes = await obtenerAnimalesLotes();
        const encontrado3 = animalesLotes.find(l =>
            normalizar(l.identificacion) === idNorm
        );
        if (encontrado3) return encontrado3.id;
    }

    if (loteNorm !== "") {

        const animalesLotes = await obtenerAnimalesLotes();
        const encontrado4 = animalesLotes.find(l =>
            normalizar(l.lote) === loteNorm
        );
        if (encontrado4) return encontrado4.id;

        const lotes = await obtenerLotes();
        const encontrado5 = lotes.find(l =>
            normalizar(l.numeroLote) === loteNorm
        );
        if (encontrado5) return encontrado5.id;
    }

    return null;
}
