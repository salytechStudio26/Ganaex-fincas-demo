/* ============================================================
   BOTÓN BUSCAR — ANIMALES INDIVIDUALES (VERSIÓN FINAL)
   ============================================================ */

import { obtenerTodosLosRegistros } from "../animalesIndividualesDemoBD.js";
import controllerAnimales from "../controladorAnimalesIndividualesDemo.js";

/* ============================================================
   EVENTO PRINCIPAL
   ============================================================ */

document.getElementById("btnBuscarAnimales").onclick = async () => {

    const modo = prompt(
        "Elige el tipo de búsqueda:\n\n" +
        "1 - Búsqueda individual (ID o Nº identificación)\n" +
        "2 - Búsqueda avanzada (filtrar por campos)"
    );

    if (!modo) {
        alert("No se ha elegido ninguna opción.");
        return;
    }

    if (modo.trim() === "1") {
        await buscarIndividual();
        return;
    }

    if (modo.trim() === "2") {
        await mostrarPanelBusquedaAvanzada();
        return;
    }

    alert("Opción no válida. Debes elegir 1 o 2.");
};


/* ============================================================
   1. BÚSQUEDA INDIVIDUAL
   ============================================================ */

async function buscarIndividual() {

    const dato = prompt("Introduce el ID o Nº identificación:");

    if (!dato || dato.trim() === "") {
        alert("No se ha introducido ningún valor.");
        return;
    }

    const todos = await obtenerTodosLosRegistros();

    const resultado = todos.filter(animal =>
        String(animal.id) === dato.trim() ||
        String(animal.identificacion).toLowerCase() === dato.trim().toLowerCase()
    );

    if (resultado.length === 0) {
        alert("No se encontró ningún animal.");
        return;
    }

    pintarResultadosBusqueda(resultado);
}


/* ============================================================
   2. PANEL DE BÚSQUEDA AVANZADA
   ============================================================ */

async function mostrarPanelBusquedaAvanzada() {

    const registros = await obtenerTodosLosRegistros();
    const valoresUnicos = obtenerValoresUnicos(registros);

    const panel = document.createElement("div");
    panel.className = "panelBusquedaAvanzada";

    panel.innerHTML = `
        <h3>Búsqueda avanzada</h3>

        ${crearSelect("Año nacimiento", "fechaNacimiento", valoresUnicos.fechaNacimiento)}
        ${crearSelect("Sexo", "sexo", valoresUnicos.sexo)}
        ${crearSelect("Raza", "raza", valoresUnicos.raza)}
        ${crearSelect("Zona", "zona", valoresUnicos.zona)}
        ${crearSelect("Observaciones", "observaciones", valoresUnicos.observaciones)}

        ${crearSelectColumnasExtras(valoresUnicos.extras)}

        <button id="btnAplicarBusquedaAvanzada">Aplicar búsqueda</button>
        <button id="btnCerrarBusquedaAvanzada">Cerrar</button>
    `;

    document.body.appendChild(panel);

    document.getElementById("btnAplicarBusquedaAvanzada").onclick = () => {
        aplicarBusquedaAvanzada(registros);
        panel.remove();
    };

    document.getElementById("btnCerrarBusquedaAvanzada").onclick = () => {
        panel.remove();
    };
}


/* ============================================================
   OBTENER VALORES ÚNICOS
   ============================================================ */

function obtenerValoresUnicos(registros) {

    const extras = {};

    const fechaNacimiento = new Set();
    const sexo = new Set();
    const raza = new Set();
    const zona = new Set();
    const observaciones = new Set();

    registros.forEach(r => {

        // Año nacimiento
        if (r.fechaNacimiento) {
            const año = r.fechaNacimiento.split("-")[0];
            fechaNacimiento.add(año);
        }

        if (r.sexo) sexo.add(r.sexo);
        if (r.raza) raza.add(r.raza);
        if (r.zona) zona.add(r.zona);
        if (r.observaciones) observaciones.add(r.observaciones);

        // Columnas nuevas
        Object.keys(r).forEach(col => {
            if (!["id","identificacion","fechaNacimiento","raza","sexo","zona","observaciones"].includes(col)) {
                if (!extras[col]) extras[col] = new Set();
                extras[col].add(r[col]);
            }
        });
    });

    return {
        fechaNacimiento: [...fechaNacimiento],
        sexo: [...sexo],
        raza: [...raza],
        zona: [...zona],
        observaciones: [...observaciones],
        extras
    };
}


/* ============================================================
   CREAR SELECT
   ============================================================ */

function crearSelect(label, columna, valores) {

    if (!valores || valores.length === 0) return "";

    return `
        <label>${label}</label>
        <select class="filtroAvanzado" data-columna="${columna}">
            <option value="">(cualquiera)</option>
            ${valores.map(v => `<option value="${v}">${v}</option>`).join("")}
        </select>
    `;
}


/* ============================================================
   SELECT PARA COLUMNAS NUEVAS
   ============================================================ */

function crearSelectColumnasExtras(extras) {

    let html = "";

    Object.keys(extras).forEach(col => {
        html += crearSelect(col, col, [...extras[col]]);
    });

    return html;
}


/* ============================================================
   APLICAR BÚSQUEDA AVANZADA
   ============================================================ */

function aplicarBusquedaAvanzada(registros) {

    const filtros = {};
    const selects = document.querySelectorAll(".filtroAvanzado");

    selects.forEach(sel => {
        if (sel.value !== "") {
            filtros[sel.dataset.columna] = sel.value;
        }
    });

    const resultado = registros.filter(reg => {

        for (const col in filtros) {

            if (col === "fechaNacimiento") {
                const año = reg.fechaNacimiento?.split("-")[0];
                if (año !== filtros[col]) return false;
                continue;
            }

            if (String(reg[col]) !== filtros[col]) return false;
        }

        return true;
    });

    pintarResultadosBusqueda(resultado);
}


/* ============================================================
   PINTAR RESULTADOS
   ============================================================ */

function pintarResultadosBusqueda(lista) {

    const tbody = document.querySelector(".listadoRegistrosTabla");
    tbody.innerHTML = "";

    lista.forEach(reg => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${reg.id}</td>
            <td>${reg.identificacion ?? ""}</td>
            <td>${reg.fechaNacimiento ?? ""}</td>
            <td>${reg.raza ?? ""}</td>
            <td>${reg.sexo ?? ""}</td>
            <td>${reg.zona ?? ""}</td>
            <td>${reg.observaciones ?? ""}</td>
        `;

        const extras = Object.keys(reg).filter(
            c => !["id","identificacion","fechaNacimiento","raza","sexo","zona","observaciones"].includes(c)
        );

        extras.forEach(col => {
            const td = document.createElement("td");
            td.textContent = reg[col];
            fila.insertBefore(td, fila.lastElementChild);
        });

        tbody.appendChild(fila);
    });
}
