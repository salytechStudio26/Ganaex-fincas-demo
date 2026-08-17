/* ============================================================
   MÓDULO PUENTE — ACCESO UNIFICADO A TODAS LAS BD DEMO
   ============================================================ */

/* ============================================================
   IMPORTACIONES — LECTURA (EXPORTAR COPIA)
   ============================================================ */

export { obtenerTodosLosRegistros as obtenerAnimales }
    from "../plantillasUniversales/individual/animales/animalesIndividualesDemoBD.js";

export { obtenerTodosLosRegistros as obtenerCrias }
    from "../plantillasUniversales/individual/crias/criasIndividualesDemoBD.js";

export { obtenerTodosLosRegistros as obtenerAnimalesLotes }
    from "../plantillasUniversales/individual/animalesLotes/animalesLotesDemoBD.js";

export { obtenerTodasExtracciones as obtenerExtraccion }
    from "../plantillasUniversales/individual/extraccion/extraccionDiaria/extraccionDemoBD.js";

export { obtenerTodosLosRegistros as obtenerTransporte }
    from "../plantillasUniversales/individual/transporte/transporteDemoBD.js";

/* ============================================================
   IMPORTACIONES — ESCRITURA (IMPORTAR COPIA)
   ============================================================ */

import { insertarRegistro as insertarAnimalIndividual }
    from "../plantillasUniversales/individual/animales/animalesIndividualesDemoBD.js";

import { insertarRegistro as insertarCriaIndividual }
    from "../plantillasUniversales/individual/crias/criasIndividualesDemoBD.js";

import { insertarRegistro as insertarAnimalLote }
    from "../plantillasUniversales/individual/animalesLotes/animalesLotesDemoBD.js";

import { insertarExtraccion }
    from "../plantillasUniversales/individual/extraccion/extraccionDiaria/extraccionDemoBD.js";

import { insertarRegistro as insertarTransporte }
    from "../plantillasUniversales/individual/transporte/transporteDemoBD.js";

/* ============================================================
   FUNCIONES PUENTE — GUARDAR (IMPORTAR COPIA)
   ============================================================ */

export async function guardarAnimal(r) {
    await insertarAnimalIndividual(r);
}

export async function guardarCria(r) {
    await insertarCriaIndividual(r);
}

export async function guardarAnimalLote(r) {
    await insertarAnimalLote(r);
}

export async function guardarEventoExtraccion(r) {
    await insertarExtraccion(r);
}

export async function guardarEventoTransporte(r) {
    await insertarTransporte(r);
}
