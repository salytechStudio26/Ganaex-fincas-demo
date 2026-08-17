// misFincas.js — versión adaptada a 2 tipos de ganaderías

import {
    obtenerTodasLasFincas,
    obtenerGanaderiasPorFinca
} from "../nuevoRegistro/nuevaFincaDemoBD.js";

// Esperar a que la BD esté lista
document.addEventListener("bdLista", () => {
    cargarListado();
});

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================
async function cargarListado() {

    const contenedor = document.getElementById("listaFincas");
    contenedor.innerHTML = "";

    const fincas = await obtenerTodasLasFincas();

    if (fincas.length === 0) {
        contenedor.innerHTML = "<p>No hay fincas registradas.</p>";
        return;
    }

    for (const finca of fincas) {

        // Obtener ganaderías asociadas
        let ganaderias = await obtenerGanaderiasPorFinca(finca.idFinca);

        // Ordenar por idGanaderia
        ganaderias = ganaderias.sort((a, b) => a.idGanaderia - b.idGanaderia);

        // Si no tiene ganaderías → mostrar enlace simple
        if (ganaderias.length === 0) {
            crearEnlaceFinca(contenedor, finca, null);
        } else {
            // Crear un enlace por cada ganadería
            ganaderias.forEach(gan => {
                crearEnlaceFinca(contenedor, finca, gan);
            });
        }
    }
}

// ============================================================
// ICONOS SEGÚN TIPO DE GANADERÍA
// ============================================================
function iconoGanaderia(tipo) {
    switch (tipo) {
        case "individual": return "🐄";
        case "lote": return "🐑";
        default: return "🏡";
    }
}

// ============================================================
// CREAR ENLACE DINÁMICO
// ============================================================
function crearEnlaceFinca(contenedor, finca, ganaderia) {

    let plantilla = "#";

    if (ganaderia) {

        const tipo = ganaderia.tipoGanaderia.trim().toLowerCase();

        switch (tipo) {
            case "individual":
                plantilla = "../plantillasUniversales/individual/MenúPrincipal/menuPrincipalIndividual.html";
                break;
            case "lote":
                plantilla = "../plantillasUniversales/individual/MenúPrincipal/menuPrincipalIndividual.html";
                break;
        }
    }

    const enlace = document.createElement("a");
    enlace.classList.add("enlaceFinca");

    const icono = ganaderia
        ? iconoGanaderia(ganaderia.tipoGanaderia)
        : "🏡";

    const textoGanaderia = ganaderia
        ? ganaderia.nombreGanaderia
        : "Sin ganadería";

    const idGan = ganaderia ? ganaderia.idGanaderia : 0;

    enlace.textContent = `${icono}  ${finca.nombreFinca || "Finca sin nombre"} — Ganadería: ${textoGanaderia}`;
    enlace.href = `${plantilla}?idFinca=${finca.idFinca}&idGanaderia=${idGan}`;

    contenedor.appendChild(enlace);
}
