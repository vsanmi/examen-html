document.addEventListener("DOMContentLoaded", () => {
    const imagenes = Array.from(document.querySelectorAll(".galeria-grid img"));
    let indiceActual = 0; // Índice de la imagen que se está mostrando

    const visor = document.createElement("dialog");
    visor.className = "visor";
    visor.setAttribute("aria-label", "Visor de imágenes");

    const imagenGrande = document.createElement("img");
    imagenGrande.className = "visor-imagen";

    const botonCerrar = document.createElement("button");
    botonCerrar.className = "visor-cerrar";
    botonCerrar.type = "button";
    botonCerrar.textContent = "Cerrar";

    const botonAnterior = document.createElement("button");
    botonAnterior.className = "visor-flecha visor-anterior";
    botonAnterior.type = "button";
    botonAnterior.textContent = "←";
    botonAnterior.setAttribute("aria-label", "Imagen anterior");

    const botonSiguiente = document.createElement("button");
    botonSiguiente.className = "visor-flecha visor-siguiente";
    botonSiguiente.type = "button";
    botonSiguiente.textContent = "→";
    botonSiguiente.setAttribute("aria-label", "Imagen siguiente");

    visor.append(imagenGrande, botonCerrar, botonAnterior, botonSiguiente);
    document.body.append(visor);

    // Muestra la imagen con el índice indicado (circular: de la última pasa a la primera)
    function mostrarImagen(indice) {
        indiceActual = (indice + imagenes.length) % imagenes.length;
        const imagen = imagenes[indiceActual];
        imagenGrande.src = imagen.src;
        imagenGrande.alt = imagen.alt;
    }

    function abrirVisor(indice) {
        mostrarImagen(indice);
        visor.showModal();
    }

    imagenes.forEach((imagen, indice) => {
        imagen.tabIndex = 0;
        imagen.setAttribute("role", "button");
        imagen.setAttribute("aria-label", "Ampliar: " + imagen.alt);

        // Los eventos van en la imagen, no en document
        imagen.addEventListener("click", () => abrirVisor(indice));
        imagen.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirVisor(indice);
            }
        });
    });

    botonCerrar.addEventListener("click", () => visor.close());
    botonAnterior.addEventListener("click", () => mostrarImagen(indiceActual - 1));
    botonSiguiente.addEventListener("click", () => mostrarImagen(indiceActual + 1));

    // Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
    visor.addEventListener("click", (evento) => {
        if (evento.target === visor) {
            visor.close();
        }
    });

    // Navegar con el teclado mientras el visor está abierto
    visor.addEventListener("keydown", (evento) => {
        if (evento.key === "ArrowLeft") {
            mostrarImagen(indiceActual - 1);
        } else if (evento.key === "ArrowRight") {
            mostrarImagen(indiceActual + 1);
        }
    });
});