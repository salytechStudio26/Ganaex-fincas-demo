/* ============================================================
   BASE DE DATOS transporte — VERSIÓN DEMO
   ============================================================ */

import { obtenerIDGlobal } from "../MenúPrincipal/idGlobal.js";

const DB_NAME = "transporteDemoDB";          // ← BD DEMO
const STORE_NAME = "transporteDemo";         // ← STORE DEMO
const STORE_ESTRUCTURA = "estructuraTransporteDemo"; // ← STORE ESTRUCTURA DEMO
const DB_VERSION = 1000;                     // ← VERSIÓN DEMO

/* ============================================================
   APERTURA DE LA BASE DE DATOS DEMO
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

                store.createIndex("tipoTransporte", "tipoTransporte", { unique: false });
                store.createIndex("idHeredado", "idHeredado", { unique: false });
                store.createIndex("fechaTransporte", "fechaTransporte", { unique: false });
                store.createIndex("identificacion", "identificacion", { unique: false });
                store.createIndex("lote", "lote", { unique: false });
                store.createIndex("cantidad", "cantidad", { unique: false });
                store.createIndex("descripcion", "descripcion", { unique: false });
                store.createIndex("observaciones", "observaciones", { unique: false });
            }

            if (!db.objectStoreNames.contains(STORE_ESTRUCTURA)) {

                const estructuraStore = db.createObjectStore(STORE_ESTRUCTURA, {
                    keyPath: "id"
                });

                estructuraStore.put({
                    id: 1,
                    columnas: [
                        "tipoTransporte",
                        "id",
                        "idHeredado",
                        "fechaTransporte",
                        "identificacion",
                        "lote",
                        "cantidad",
                        "descripcion",
                        "observaciones"
                    ]
                });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   INSERTAR REGISTRO — DEMO
   ============================================================ */
export async function insertarRegistro(data) {
    const db = await abrirDB();

    let registroFinal = { ...data };

    // ENTRADA → usa ID global DEMO
    if (registroFinal.tipoTransporte === "Entrada") {
        registroFinal.id = await obtenerIDGlobal();
    }

    // SALIDA → IndexedDB genera el ID automáticamente
    if (registroFinal.tipoTransporte === "Salida") {
        delete registroFinal.id;
    }

    return new Promise((resolve, reject) => {

        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const request = store.add(registroFinal);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   OBTENER TODOS LOS REGISTROS — DEMO
   ============================================================ */
export async function obtenerTodosLosRegistros() {
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
   ACTUALIZAR REGISTRO — DEMO
   ============================================================ */
export async function actualizarRegistro(id, datosActualizados) {
    const db = await abrirDB();

    const registroFinal = {
        id,
        ...datosActualizados
    };

    return new Promise((resolve, reject) => {

        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const request = store.put(registroFinal);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   ELIMINAR REGISTRO — DEMO
   ============================================================ */
export async function eliminarRegistro(id) {
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
   OBTENER EVENTOS DE TRANSPORTE POR ID — DEMO
   ============================================================ */
export async function obtenerEventosTransporte(idGlobal) {
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
