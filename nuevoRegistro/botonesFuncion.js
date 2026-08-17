/* ============================================================
   GANAEX FINCAS — Versión FINAL
   botonesFuncion.js
   ============================================================ */

import {
    guardarFinca,
    buscarFincaPorExtension,
    guardarGanaderia,
    borrarExplotacionCompleta
} from "./nuevaFincaDemoBD.js";

/* ============================================================
   1. CREAR NUEVA FINCA
   ============================================================ */

export async function crearNuevaFinca() {

    // Datos del usuario
    const dni = document.getElementById("dni").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();

    // Datos de la finca
    const extension = document.getElementById("extension").value.trim();
    const nombreFinca = document.getElementById("nombreFinca").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    // Datos de la ganadería
    const tipoGanaderia = document.getElementById("tipoGanaderia").value.trim();
    const claseGanaderia = document.getElementById("clase").value.trim();

    if (!dni || !nombre || !extension || !tipoGanaderia || !claseGanaderia) {
        alert("Debes completar todos los campos obligatorios (*)");
        return;
    }

    // Evitar duplicados por extensión
    const fincaExistente = await buscarFincaPorExtension(extension);
    if (fincaExistente) {
        alert("Error: la extensión ya existe.");
        return;
    }

    const finca = {
        dni,
        nombre,
        telefono,
        correo,
        extension,
        nombreFinca,
        direccion
    };

    try {
        const idFinca = await guardarFinca(finca);

        const ganaderia = {
            idFinca,
            tipoGanaderia,
            clase: claseGanaderia,
            nombreGanaderia: claseGanaderia
        };

        await guardarGanaderia(ganaderia);

        alert("Explotación creada correctamente.");
        window.location.href = "../misFincas/misFincas.html";

    } catch (error) {
        alert("Error al guardar la explotación.");
    }
}

/* ============================================================
   2. ELIMINAR EXPLOTACIÓN COMPLETA
   ============================================================ */

export async function eliminarExplotacionCompleta() {

    const confirmar = confirm("¿Seguro que quieres eliminar la explotación completa?");
    if (!confirmar) return;

    await borrarExplotacionCompleta();

    alert("Explotación eliminada correctamente.");
    window.location.href = "../misFincas/misFincas.html";
}
