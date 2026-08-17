/* ============================================================
   BASE DE DATOS — EXTRACCIÓN DIARIA (versión final corregida)
   ============================================================ */

import { obtenerTodosLosRegistros as obtenerAnimales } 
    from "../../animales/animalesIndividualesDemoBD.js";

import { obtenerTodosLosRegistros as obtenerCrias } 
    from "../../crias/criasIndividualesDemoBD.js";

import { obtenerTodosLosRegistros as obtenerAnimalesLotes } 
    from "../../animalesLotes/animalesLotesDemoBD.js";

/* ============================================================
   CONFIGURACIÓN DE LA BD
   ============================================================ */

const DB_NAME = "extraccionDemoDB";
const STORE_NAME = "extraccionDiariaDemo";
const DB_VERSION = 1000;

/* ============================================================
   APERTURA DE LA BASE DE DATOS
   ============================================================ */
function abrirDB() {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {

                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });

                store.createIndex("idHeredado", "idHeredado", { unique: false });
                store.createIndex("identificacion", "identificacion", { unique: false });
                store.createIndex("lote", "lote", { unique: false });
                store.createIndex("fecha", "fecha", { unique: false });
                store.createIndex("tipo", "tipo", { unique: false });
                store.createIndex("cantidadRecogida", "cantidadRecogida", { unique: false });
                store.createIndex("zona", "zona", { unique: false });
                store.createIndex("observaciones", "observaciones", { unique: false });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   VERIFICAR SI EL ANIMAL O LOTE EXISTE
   ============================================================ */

export async function existeAnimal(idGlobal) {

    const animales = await obtenerAnimales();
    const crias = await obtenerCrias();
    const animalesLotes = await obtenerAnimalesLotes();

    const existe =
        animales.some(a => a.id === idGlobal) ||
        crias.some(c => c.id === idGlobal) ||
        animalesLotes.some(al => al.id === idGlobal);

    return existe;
}

/* ============================================================
   INSERTAR REGISTRO
   ============================================================ */

export async function insertarExtraccion(data) {

    const db = await abrirDB();

    const idGlobal = Number(data.idHeredado);

    const existe = await existeAnimal(idGlobal);

    if (!existe) {
        throw new Error(`El animal o lote con ID ${idGlobal} no existe en ninguna tabla principal.`);
    }

    return new Promise((resolve, reject) => {

        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const registroFinal = { ...data };

        const request = store.add(registroFinal);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   OBTENER TODOS LOS REGISTROS
   ============================================================ */

export async function obtenerTodasExtracciones() {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   ACTUALIZAR REGISTRO
   ============================================================ */

export async function actualizarExtraccion(id, data) {

    const db = await abrirDB();

    const idGlobal = Number(data.idHeredado);

    const existe = await existeAnimal(idGlobal);

    if (!existe) {
        throw new Error(`El animal o lote con ID ${idGlobal} no existe en ninguna tabla principal.`);
    }

    return new Promise((resolve, reject) => {

        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const registroFinal = { id, ...data };

        const request = store.put(registroFinal);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   ELIMINAR REGISTRO
   ============================================================ */

export async function eliminarExtraccion(id) {

    const db = await abrirDB();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   OBTENER EVENTOS DE EXTRACCIÓN POR ID
   ============================================================ */

export async function obtenerEventosExtraccion(idGlobal) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
            const lista = request.result.filter(ev => Number(ev.idHeredado) === Number(idGlobal));
            resolve(lista);
        };

        request.onerror = (event) => reject(event.target.error);
    });
}
