// CONTROLADOR DE NUEVA FINCA — Versión FINAL

console.log("nuevaFinca.js cargado");

import {
    crearNuevaFinca,
    eliminarExplotacionCompleta
} from "./botonesFuncion.js";

import {
    contarFincas,
    contarGanaderias
} from "./nuevaFincaDemoBD.js";

/* ============================================================
   CUANDO EL DOM ESTÉ CARGADO
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const btnCrear = document.querySelector(".crear");
    const btnEliminar = document.querySelector(".eliminarGanaderia");

    /* ============================================================
       BOTÓN: CREAR NUEVA FINCA
       ============================================================ */

    btnCrear.addEventListener("click", async (e) => {
        e.preventDefault();

        const totalFincas = await contarFincas();
        const totalGanaderias = await contarGanaderias();

        if (totalFincas >= 1 || totalGanaderias >= 1) {
            alert("Ya existe una explotación. Debe eliminarla para crear otra.");
            return;
        }

        crearNuevaFinca();
    });

    /* ============================================================
       BOTÓN: ELIMINAR EXPLOTACIÓN COMPLETA
       ============================================================ */

    btnEliminar.addEventListener("click", async (e) => {
        e.preventDefault();
        eliminarExplotacionCompleta();
    });
});
