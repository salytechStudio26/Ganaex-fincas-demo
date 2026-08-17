const CACHE_NAME = "ganaex-fincas-demo-v1";

const RUTAS_A_CACHEAR = [
    "/ganaex-fincas-demo/index.html",
    "/ganaex-fincas-demo/inicio/index.html",
    "/ganaex-fincas-demo/imagenes/logo.png",
    "/ganaex-fincas-demo/imagenes/principal.png",
    "/ganaex-fincas-demo/estilosUniversales/estiloMenuPrincipal.css",
    "/ganaex-fincas-demo/archivosUniversales/controladorEventos.js",
    "/ganaex-fincas-demo/archivosUniversales/fechaYhora.js",
    "/ganaex-fincas-demo/archivosUniversales/instaladorPWA.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(RUTAS_A_CACHEAR))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => key !== CACHE_NAME && caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(resp => resp || fetch(event.request))
    );
});
