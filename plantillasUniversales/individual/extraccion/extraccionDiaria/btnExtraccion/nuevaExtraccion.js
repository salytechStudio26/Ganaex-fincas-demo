/* ============================================================
   NUEVO REGISTRO — EXTRACCIÓN DIARIA (CORREGIDO)
   ============================================================ */

import { insertarExtraccion } from "../extraccionDemoBD.js";
import controllerExtraccion from "../extraccionDemo.js";

/* ============================================================
   IMPORTACIONES DE LAS BDs REALES
   ============================================================ */

import { obtenerTodosLosRegistros as obtenerAnimalesIndividuales } 
    from "../../../animales/animalesIndividualesDemoBD.js";

import { obtenerTodosLosRegistros as obtenerCriasIndividuales } 
    from "../../../crias/criasIndividualesDemoBD.js";

import { obtenerTodosLosRegistros as obtenerAnimalesLotes } 
    from "../../../animalesLotes/animalesLotesDemoBD.js";

/* ============================================================
   EVENTO PRINCIPAL — BOTÓN NUEVO REGISTRO
   ============================================================ */

document.getElementById("btnNuevoEstado").onclick = async () => {

    let tipo = prompt(
        "¿Qué quieres añadir?\n" +
        "1 → Animales individuales\n" +
        "2 → Lotes"
    );

    if (!tipo || !["1","2"].includes(tipo.trim())) {
        alert("Opción no válida.");
        return;
    }

    tipo = tipo.trim();

    /* ============================================================
       CARGAR DATOS SEGÚN TIPO
       ============================================================ */

    let datos = [];

    if (tipo === "1") {
        const animales = await obtenerAnimalesIndividuales();
        const crias = await obtenerCriasIndividuales();

        datos = [
            ...animales.map(a => ({
                id: a.id,
                identificacion: a.identificacion,
                lote: "",
                info: "Animal individual"
            })),
            ...crias.map(c => ({
                id: c.id,
                identificacion: c.identificacion,
                lote: "",
                info: "Cría individual"
            }))
        ];
    }

    if (tipo === "2") {

        // ⭐ CORREGIDO: ESTA ES LA ÚNICA BD REAL DE LOTES
        const animalesLotes = await obtenerAnimalesLotes();

        datos = animalesLotes.map(l => ({
            id: l.id,
            identificacion: "",
            lote: l.lote,
            info: "Animal dentro de lote"
        }));
    }

    /* ============================================================
       MODAL PROFESIONAL
       ============================================================ */

    const modal = document.createElement("div");
    modal.id = "modalExtraccion";
    modal.style = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.45);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(3px);
    `;

    const ventana = document.createElement("div");
    ventana.style = `
        background: #ffffff;
        padding: 20px;
        border-radius: 12px;
        width: 90%;
        max-width: 850px;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 0 25px rgba(0,0,0,0.25);
        border: 1px solid #dcdcdc;
        animation: fadeIn 0.2s ease-out;
    `;

    ventana.innerHTML = `
        <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
        }
        </style>
    `;

    const titulo = document.createElement("h3");
    titulo.textContent = "Seleccionar animales o lotes";
    titulo.style = `
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 22px;
        text-align: center;
        color: #333;
        font-weight: bold;
    `;
    ventana.appendChild(titulo);

    const tabla = document.createElement("table");
    tabla.style = `
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 15px;
    `;

    tabla.innerHTML = `
        <thead>
            <tr style="background:#f0f0f0;">
                <th style="padding:8px; border-bottom:1px solid #ccc;">✔</th>
                <th style="padding:8px; border-bottom:1px solid #ccc;">Identificación / Nº lote</th>
                <th style="padding:8px; border-bottom:1px solid #ccc;">ID interno</th>
                <th style="padding:8px; border-bottom:1px solid #ccc;">Información útil</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");

    datos.forEach(item => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td style="padding:6px; text-align:center;">
                <input type="checkbox" 
                    data-id="${item.id}" 
                    data-ident="${item.identificacion}" 
                    data-lote="${item.lote}">
            </td>
            <td style="padding:6px;">${item.identificacion || item.lote}</td>
            <td style="padding:6px;">${item.id}</td>
            <td style="padding:6px;">${item.info}</td>
        `;

        fila.style.borderBottom = "1px solid #e6e6e6";

        tbody.appendChild(fila);
    });

    ventana.appendChild(tabla);

    const contBotones = document.createElement("div");
    contBotones.style = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
    `;

    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent = "Confirmar selección";
    btnConfirmar.style = `
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 15px;
    `;

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.style = `
        padding: 10px 20px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 15px;
    `;

    contBotones.appendChild(btnConfirmar);
    contBotones.appendChild(btnCancelar);

    ventana.appendChild(contBotones);
    modal.appendChild(ventana);
    document.body.appendChild(modal);

    btnCancelar.onclick = () => {
        modal.remove();
    };

    btnConfirmar.onclick = async () => {

        const seleccionados = [...tbody.querySelectorAll("input[type='checkbox']:checked")];

        if (seleccionados.length === 0) {
            alert("Debe seleccionar al menos un registro.");
            return;
        }

        for (let chk of seleccionados) {

            const idHeredado = chk.dataset.id;
            const identificacion = chk.dataset.ident;
            const lote = chk.dataset.lote;

            const nuevoRegistro = {
                idHeredado,
                identificacion,
                lote,
                fecha: "",
                tipo: "",
                cantidadRecogida: "",
                zona: "",
                observaciones: ""
            };

            await insertarExtraccion(nuevoRegistro);
        }

        await controllerExtraccion.recargarTabla();
        controllerExtraccion.bloquearTabla();

        modal.remove();
        alert("Registros creados correctamente.");
    };
};
