document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("map");

    const plazaCervantes = [40.4821, -3.3637];

    //Que el mapa y el marcador se vean siempre
    const mapa = L.map(contenedor).setView(plazaCervantes, 17);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    }).addTo(mapa);

    L.marker(plazaCervantes).addTo(mapa).bindPopup("Clara Di Carlo").openPopup();

    // Se pregunta por la ubicación; el mapa ya es visible mientras tanto
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
        (posicion) => {
            const origen = L.latLng(posicion.coords.latitude, posicion.coords.longitude);

            if (!L.Routing) {
                // Routing Machine no cargó: al menos se muestra al usuario
                L.marker(origen).addTo(mapa).bindPopup("Tu ubicación");
                mapa.fitBounds(L.latLngBounds([origen, plazaCervantes]).pad(0.2));
                console.warn("Leaflet Routing Machine no se ha cargado");
                return;
            }

            L.Routing.control({
                waypoints: [origen, L.latLng(plazaCervantes)],
                language: "es",
                show: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                lineOptions: { styles: [{ color: "#3e7ca6", weight: 5 }] },
                createMarker: (indice, waypoint) =>
                    indice === 0
                        ? L.marker(waypoint.latLng).bindPopup("Tu ubicación")
                        : null
            })
                .on("routingerror", (e) => console.warn("No se pudo calcular la ruta:", e.error))
                .addTo(mapa);
        },
        (error) => {
            // Rechazó o falló: se queda solo el marcador de la plaza
            console.info("Ubicación no disponible:", error.message);
        },
        { timeout: 10000 }
    );
}); 