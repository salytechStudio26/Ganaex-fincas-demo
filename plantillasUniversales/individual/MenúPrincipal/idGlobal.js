/* ============================================================
   ID GLOBAL — DEMO
   ============================================================ */

// ANIMALES DEMO
import { obtenerTodosLosRegistros as obtenerAnimalesDemo } 
    from "../animales/animalesIndividualesDemoBD.js";

// CRÍAS DEMO
import { obtenerTodosLosRegistros as obtenerCriasDemo } 
    from "../crias/criasIndividualesDemoBD.js";

// LOTES DEMO
import { obtenerTodosLosRegistros as obtenerAnimalesLotesDemo } 
    from "../animalesLotes/animalesLotesDemoBD.js";

// TRANSPORTE DEMO
import { obtenerTodosLosRegistros as obtenerTransportesDemo } 
    from "../transporte/transporteDemoBD.js";

/* ============================================================
   OBTENER SIGUIENTE ID GLOBAL — DEMO
   ============================================================ */

export async function obtenerIDGlobal() {

    const animales = await obtenerAnimalesDemo();
    const crias = await obtenerCriasDemo();
    const animalesLotes = await obtenerAnimalesLotesDemo();

    const idsAnimales = animales.map(a => a.id);
    const idsCrias = crias.map(c => c.id);
    const idsAnimalesLotes = animalesLotes.map(al => al.id);

    const todos = [
        ...idsAnimales,
        ...idsCrias,
        ...idsAnimalesLotes
    ];

    if (todos.length === 0) return 1;

    return Math.max(...todos) + 1;
}
