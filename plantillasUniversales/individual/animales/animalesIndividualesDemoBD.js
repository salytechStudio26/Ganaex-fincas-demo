/* ============================================================
   BASE DE DATOS animalesIndividuales — VERSIÓN DEMO CORREGIDA
   ============================================================ */

import { obtenerIDGlobal } from "../MenúPrincipal/idGlobal.js";

/* ============================================================
   CONFIGURACIÓN DEMO
   ============================================================ */

const DB_NAME = "animalesIndividualesDemoDB";   
const STORE_NAME = "animalesIndividualesDemo";  
const STORE_ESTRUCTURA = "estructuraAnimalesIndividualesDemo"; 
const DB_VERSION = 1000;   

/* ============================================================
   APERTURA DE LA BD DEMO
   ============================================================ */
function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            /* STORE PRINCIPAL DEMO */
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id"     // ← autoIncrement ELIMINADO
                });

                store.createIndex("identificacion", "identificacion", { unique: false });
                store.createIndex("fechaNacimiento", "fechaNacimiento", { unique: false });
                store.createIndex("raza", "raza", { unique: false });
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
                    columnas: [
                        "id",
                        "identificacion",
                        "fechaNacimiento",
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
   CRUD DEMO
   ============================================================ */

export async function obtenerTodosLosRegistros() {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const req = store.getAll();

        req.onsuccess = () => resolve(req.result);
        req.onerror = (event) => reject(event.target.error);
    });
}

export async function insertarRegistro(data) {
    const db = await abrirDB();

    // ⭐ ID GLOBAL REAL
    const nuevoID = await obtenerIDGlobal();
    data.id = nuevoID;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const req = store.add(data);

        req.onsuccess = () => resolve(true);
        req.onerror = (event) => reject(event.target.error);
    });
}

export async function actualizarRegistro(id, datosActualizados) {
    const db = await abrirDB();

    const registroFinal = { ...datosActualizados, id };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const req = store.put(registroFinal);

        req.onsuccess = () => resolve(true);
        req.onerror = (event) => reject(event.target.error);
    });
}

export async function eliminarAnimal(id) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const req = store.delete(id);

        req.onsuccess = () => resolve(true);
        req.onerror = (event) => reject(event.target.error);
    });
}

/* ============================================================
   OBTENER ANIMAL POR ID — DEMO
   ============================================================ */

export async function obtenerAnimalPorID(id) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const req = store.get(Number(id));

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject("Error al obtener animal por ID (DEMO)");
    });
}
