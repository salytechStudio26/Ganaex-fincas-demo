/* ============================================================
   BASE DE DATOS animalesLotes — VERSIÓN DEMO
   ============================================================ */

import { obtenerIDGlobal } from "../MenúPrincipal/idGlobal.js";

const DB_NAME = "animalesLotesDemoDB";               // ← BD DEMO
const STORE_NAME = "animalesLotesDemo";              // ← STORE DEMO
const STORE_ESTRUCTURA = "estructuraAnimalesLotesDemo"; // ← STORE ESTRUCTURA DEMO
const DB_VERSION = 1000;                             // ← VERSIÓN DEMO

let db;

/* ============================================================
   APERTURA DE LA BASE DE DATOS DEMO
   ============================================================ */
function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            /* STORE PRINCIPAL DEMO */
            if (!db.objectStoreNames.contains(STORE_NAME)) {

                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });

                store.createIndex("lote", "lote", { unique: false });
                store.createIndex("cantidad", "cantidad", { unique: false });
                store.createIndex("sexo", "sexo", { unique: false });
                store.createIndex("zona", "zona", { unique: false });
                store.createIndex("observaciones", "observaciones", { unique: false });
            }

            /* STORE ESTRUCTURA DEMO */
            if (!db.objectStoreNames.contains(STORE_ESTRUCTURA)) {

                const estructuraStore = db.createObjectStore(STORE_ESTRUCTURA, {
                    keyPath: "id"
                });

                estructuraStore.put({
                    id: 1,
                    columnas: ["id", "lote", "cantidad", "sexo", "zona", "observaciones"]
                });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   ESTRUCTURA DE COLUMNAS DEMO
   ============================================================ */

export async function obtenerEstructuraColumnas() {
    const db = await abrirDB();

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_ESTRUCTURA, "readonly");
        const store = tx.objectStore(STORE_ESTRUCTURA);
        const req = store.get(1);

        req.onsuccess = () => resolve(req.result.columnas);
    });
}

export async function guardarEstructuraColumnas(columnas) {
    const db = await abrirDB();

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_ESTRUCTURA, "readwrite");
        const store = tx.objectStore(STORE_ESTRUCTURA);

        store.put({ id: 1, columnas });

        tx.oncomplete = resolve;
    });
}

export async function actualizarRegistrosConNuevaColumna(columnaNueva) {
    const db = await abrirDB();

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const req = store.getAll();

        req.onsuccess = () => {
            const registros = req.result;

            registros.forEach(reg => {
                if (!(columnaNueva in reg)) {
                    reg[columnaNueva] = "";
                    store.put(reg);
                }
            });
        };

        tx.oncomplete = resolve;
    });
}

/* ============================================================
   CRUD DEMO
   ============================================================ */

export async function insertarRegistro(data) {
    const db = await abrirDB();

    const nuevoID = await obtenerIDGlobal();  // ← ID GLOBAL DEMO
    data.id = nuevoID;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const request = store.add(data);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

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
   OBTENER LOTE POR ID — DEMO
   ============================================================ */

export async function obtenerLotePorID(id) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const request = store.get(Number(id));

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   ACTUALIZAR REGISTRO — DEMO
   ============================================================ */

export async function actualizarRegistro(id, datosActualizados) {
    const db = await abrirDB();

    const registroFinal = { ...datosActualizados, id };

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
