/* ============================================================
   GANAEX FINCAS — Versión DEMO
   botonesFuncion.js
   ============================================================ */

import {
    guardarFinca,
    buscarFincaPorExtension,
    guardarGanaderia,
    obtenerGanaderiasPorFinca,
    eliminarGanaderia
} from "./nuevaFincaDemoBD.js";

/* ============================================================
   1. CREAR NUEVA FINCA (DEMO)
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

        alert("Finca y ganadería creadas correctamente.");
        window.location.href = "../misFincas/misFincas.html";

    } catch (error) {
        alert("Error al guardar la finca.");
    }
}

/* ============================================================
   2. ELIMINAR UNA GANADERÍA (DEMO)
   ============================================================ */

export async function eliminarUnaGanaderia() {

    const idFinca = Number(prompt("Introduce el ID de la finca donde está la ganadería:"));
    if (!idFinca) return;

    const ganaderias = await obtenerGanaderiasPorFinca(idFinca);

    if (!ganaderias.length) {
        alert("Esta finca no tiene ganaderías.");
        return;
    }

    let mensaje = "GANADERÍAS DE LA FINCA:\n\n";
    ganaderias.forEach(g => {
        mensaje += `ID: ${g.idGanaderia} — Clase: ${g.clase}\n`;
    });

    alert(mensaje);

    const idGanaderia = Number(prompt("Introduce el ID de la ganadería a eliminar:"));
    if (!idGanaderia) return;

    const confirmar = confirm("¿Seguro que quieres eliminar esta ganadería?");
    if (!confirmar) return;

    await eliminarGanaderia(idGanaderia);

    alert("Ganadería eliminada correctamente.");
    window.location.href = "../misFincas/misFincas.html";
}
