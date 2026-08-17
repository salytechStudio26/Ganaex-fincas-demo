/* ============================================================
   BASE DE DATOS — ganaexDemoDB
   ============================================================ */

let db;

/* ============================================================
   APERTURA DE LA BASE DE DATOS
   ============================================================ */

const request = indexedDB.open("ganaexDemoDB", 1001);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    /* FINCAS */
    if (!db.objectStoreNames.contains("fincas")) {

        const storeFincas = db.createObjectStore("fincas", {
            keyPath: "idFinca",
            autoIncrement: true
        });

        storeFincas.createIndex("extension", "extension", { unique: true });
        storeFincas.createIndex("dni", "dni", { unique: false });
        storeFincas.createIndex("nombreFinca", "nombreFinca", { unique: false });
    }

    /* GANADERIAS */
    if (!db.objectStoreNames.contains("ganaderias")) {

        const storeGan = db.createObjectStore("ganaderias", {
            keyPath: "idGanaderia",
            autoIncrement: true
        });

        storeGan.createIndex("idFinca", "idFinca", { unique: false });
        storeGan.createIndex("tipoGanaderia", "tipoGanaderia", { unique: false });
        storeGan.createIndex("clase", "clase", { unique: false });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("BD cargada correctamente");
    document.dispatchEvent(new Event("bdLista"));
};

request.onerror = function () {
    console.error("Error al abrir la base de datos");
};

/* ============================================================
   CRUD
   ============================================================ */

/* CREAR FINCA */
export function guardarFinca(finca) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(["fincas"], "readwrite");
        const store = tx.objectStore("fincas");

        const req = store.add(finca);

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject("Error al guardar la finca");
    });
}

/* BUSCAR FINCA POR EXTENSIÓN */
export function buscarFincaPorExtension(extension) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(["fincas"], "readonly");
        const store = tx.objectStore("fincas");
        const index = store.index("extension");

        const req = index.get(extension);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject("Error al buscar finca por extensión");
    });
}

/* OBTENER TODAS LAS FINCAS */
export function obtenerTodasLasFincas() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(["fincas"], "readonly");
        const store = tx.objectStore("fincas");

        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject("Error al obtener fincas");
    });
}

/* CONTAR FINCAS */
export async function contarFincas() {
    const fincas = await obtenerTodasLasFincas();
    return fincas.length;
}

/* CREAR GANADERÍA */
export function guardarGanaderia(ganaderia) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(["ganaderias"], "readwrite");
        const store = tx.objectStore("ganaderias");

        const req = store.add(ganaderia);

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject("Error al guardar ganadería");
    });
}

/* OBTENER GANADERÍAS */
export function obtenerGanaderiasPorFinca(idFinca) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(["ganaderias"], "readonly");
        const store = tx.objectStore("ganaderias");
        const index = store.index("idFinca");

        const req = index.getAll(idFinca);

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject("Error al obtener ganaderías");
    });
}

/* CONTAR GANADERÍAS */
export async function contarGanaderias() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(["ganaderias"], "readonly");
        const store = tx.objectStore("ganaderias");

        const req = store.getAll();

        req.onsuccess = () => resolve(req.result.length);
        req.onerror = () => reject("Error al contar ganaderías");
    });
}

/* ============================================================
   BORRAR EXPLOTACIÓN COMPLETA
   ============================================================ */
export async function borrarExplotacionCompleta() {
    return new Promise(async (resolve, reject) => {
        try {
            const txF = db.transaction(["fincas"], "readwrite");
            txF.objectStore("fincas").clear();

            const txG = db.transaction(["ganaderias"], "readwrite");
            txG.objectStore("ganaderias").clear();

            resolve(true);

        } catch (error) {
            reject("Error al borrar la explotación completa");
        }
    });
}
