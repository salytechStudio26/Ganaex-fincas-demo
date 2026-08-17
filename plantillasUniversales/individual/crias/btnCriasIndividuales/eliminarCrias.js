/* ============================================================
   ELIMINAR CRÍAS — VERSIÓN DEFINITIVA
   ============================================================ */

import { obtenerFilasSeleccionadasCrias } from "./seleccionarCrias.js";
import { eliminarRegistro, obtenerTodosLosRegistros } from "../criasIndividualesDemoBD.js";
import controllerCrias from "../controladorCriasIndividualesDemo.js";

/* ============================================================
   BOTÓN ELIMINAR
   ============================================================ */

// ⭐ PROTECCIÓN: evita error si el botón NO existe (como en SEPARACIÓN)
const btn = document.getElementById("btnEliminarAnimales");
if (!btn) {
    // Si el botón no existe, no hacemos nada y evitamos el error.
} else {

    btn.onclick = async () => {

        const seleccionadas = obtenerFilasSeleccionadasCrias();

        // ========================================================
        // 1. SI HAY FILAS SELECCIONADAS → ELIMINAR DIRECTAMENTE
        // ========================================================
        if (seleccionadas.length > 0) {

            const confirmar = confirm(
                `Se van a eliminar ${seleccionadas.length} registros seleccionados.\n\n¿Deseas continuar?`
            );

            if (!confirmar) return;

            for (const id of seleccionadas) {
                await eliminarRegistro(Number(id));
            }

            controllerCrias.recargarTabla();
            alert("Registros eliminados correctamente.");
            return;
        }

        // ========================================================
        // 2. SI NO HAY SELECCIÓN → ELIMINAR POR ID O IDENTIFICACIÓN
        // ========================================================

        const modo = prompt(
            "Eliminar por:\n\n1. ID\n2. Nº Identificación\n\nEscribe 1 o 2:"
        );

        if (modo === "1") {
            const id = prompt("Introduce el ID a eliminar:");
            if (!id) return;

            await eliminarRegistro(Number(id));
            controllerCrias.recargarTabla();
            alert("Registro eliminado.");
            return;
        }

        if (modo === "2") {
            const identificacion = prompt("Introduce el Nº Identificación:");
            if (!identificacion) return;

            const registros = await obtenerTodosLosRegistros();
            const encontrados = registros.filter(r => r.identificacion == identificacion);

            if (encontrados.length === 0) {
                alert("No existe ningún registro con esa identificación.");
                return;
            }

            const confirmar = confirm(
                `Se eliminarán ${encontrados.length} registros con identificación ${identificacion}.\n¿Continuar?`
            );

            if (!confirmar) return;

            for (const reg of encontrados) {
                await eliminarRegistro(reg.id);
            }

            controllerCrias.recargarTabla();
            alert("Registros eliminados.");
            return;
        }

        alert("Opción inválida.");
    };
}
