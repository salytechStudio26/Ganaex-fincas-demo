function actualizarFechaYHora() {
    const contenedor = document.querySelector('.fechaYhora');
    const ahora = new Date();

    const opcionesFecha = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
    const hora = ahora.toLocaleTimeString('es-ES', opcionesHora);

    contenedor.textContent = `${fecha} — ${hora}`;
}

// Actualiza cada segundo
setInterval(actualizarFechaYHora, 1000);

// Ejecuta al cargar la página
actualizarFechaYHora();
