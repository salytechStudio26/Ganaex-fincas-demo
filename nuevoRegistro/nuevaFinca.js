// CONTROLADOR DE NUEVA FINCA — Versión DEMO

console.log("nuevaFinca.js DEMO cargado");

import {
    crearNuevaFinca,
    eliminarUnaGanaderia
} from "./botonesFuncion.js";

import {
    obtenerGanaderiasPorFinca,
    obtenerTodasLasFincas
} from "./nuevaFincaDemoBD.js";

/* ============================================================
   FUNCIÓN DEMO: COMPROBAR LÍMITE DE EXPLOTACIONES
   ============================================================ */

async function limiteExplotacionesSuperado() {

    const fincas = await obtenerTodasLasFincas();
    let totalGanaderias = 0;

    for (const finca of fincas) {
        const gan = await obtenerGanaderiasPorFinca(finca.idFinca);
        totalGanaderias += gan.length;
    }

    return totalGanaderias >= 2;   // ← LÍMITE DEMO
}

/* ============================================================
   CUANDO EL DOM ESTÉ CARGADO
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado, conectando botones DEMO...");

    const btnCrear = document.querySelector(".crear");
    const btnEliminarGanaderia = document.querySelector(".eliminarGanaderia");

    console.log("Botones encontrados:", {
        btnCrear,
        btnEliminarGanaderia
    });

    /* ============================================================
       BOTÓN: CREAR NUEVA FINCA (DEMO)
       ============================================================ */

    btnCrear.addEventListener("click", async (e) => {
        e.preventDefault();

        const limite = await limiteExplotacionesSuperado();

        if (limite) {
            alert("Límite DEMO alcanzado: solo se permiten 2 explotaciones.");
            return;
        }

        console.log("Click en Crear nueva finca (DEMO)");
        crearNuevaFinca();
    });

    /* ============================================================
       BOTÓN: ELIMINAR GANADERÍA (DEMO)
       ============================================================ */

    btnEliminarGanaderia.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Click en Eliminar ganadería (DEMO)");
        eliminarUnaGanaderia();
    });
});
