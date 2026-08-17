/* ============================================================
   BASE DE DATOS CRÍAS INDIVIDUALES — VERSIÓN DEMO
   ============================================================ */

import { obtenerIDGlobal } from "../MenúPrincipal/idGlobal.js";

/* ============================================================
   CONFIGURACIÓN DEMO
   ============================================================ */

const DB_NAME = "criasIndividualesDemoDB";              // ← BD DEMO
const STORE_NAME = "criasIndividualesDemo";             // ← STORE DEMO
const STORE_ESTRUCTURA = "estructuraCriasDemo";         // ← STORE DEMO
const DB_VERSION = 1000;                                // ← VERSIÓN DEMO

/* ============================================================
   APERTURA DE LA BASE DE DATOS DEMO
   ============================================================ */

function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            /* ============================================================
               STORE PRINCIPAL DEMO
               ============================================================ */
            if (!db.objectStoreNames.contains(STORE_NAME)) {

                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });

                store.createIndex("identificacion", "identificacion", { unique: false });
                store.createIndex("fechaNacimiento", "fechaNacimiento", { unique: false });
                store.createIndex("tipoEntrada", "tipoEntrada", { unique: false });
                store.createIndex("crotalMadre", "crotalMadre", { unique: false });
                store.createIndex("raza", "raza", { unique: false });
                store.createIndex("sexo", "sexo", { unique: false });
                store.createIndex("zona", "zona", { unique: false });
                store.createIndex("observaciones", "observaciones", { unique: false });
            }

            /* ============================================================
               STORE DE ESTRUCTURA DEMO
               ============================================================ */
            if (!db.objectStoreNames.contains(STORE_ESTRUCTURA)) {

                const estructuraStore = db.createObjectStore(STORE_ESTRUCTURA, {
                    keyPath: "id"
                });

                estructuraStore.put({
                    id: 1,
                    columnas: [
                        "id",
                        "identificacion",
                        "fechaNacimiento",
                        "tipoEntrada",
                        "crotalMadre",
                        "raza",
                        "sexo",
                        "zona",
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
   FUNCIONES DE ESTRUCTURA DEMO
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

/* ============================================================
   CRUD DEMO
   ============================================================ */

export async function insertarRegistro(data) {
    const db = await abrirDB();

    // El ID YA VIENE desde btnNuevaCriaDemo.js
    // NO se vuelve a generar aquí.

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

export async function actualizarRegistro(id, dataActualizada) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const registroFinal = { ...dataActualizada, id };

        const request = store.put(registroFinal);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

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
   OBTENER CRÍA POR ID — DEMO
   ============================================================ */

export async function obtenerCriaPorID(id) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const req = store.get(Number(id));

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject("Error al obtener cría por ID (DEMO)");
    });
}
