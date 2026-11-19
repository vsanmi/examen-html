// script para cargar el contenido del index desde el archivo JSON

const main = document.querySelector(".contenido-indice"); //Se selecciona el main del index con su clase

try {
    const contenido = await fetch("data/noticias.json");

    if (!contenido.ok) {
        throw new Error("Error al cargar el archivo JSON");
    }

    const noticias = await contenido.json();

    noticias.forEach((noticia, index) => { //Cargar cada noticia del JSON en el HTML, con un index para combinar una a la izquierda y otra a la derecha
        //Se crea un elemento de sección para cada noticia
        const seccion = document.createElement("section");

    //Se cargan las imagenes y textos de cada noticia
    const imagen = document.createElement("img");
    imagen.className = "imagen-indice";
    imagen.src = noticia.imagen;
    imagen.alt = noticia.alt;

    const texto = document.createElement("div"); // se crea un elemento de texto
    texto.className = "texto";

    if (index % 2 === 0) {
        seccion.append(imagen, texto); // a la izquierda
    } else {
        seccion.append(texto, imagen); // a la derecha
    }

    const nivel = Math.min(index + 1, 6);
    const titulo = document.createElement("h" + nivel); // se crea el titulo con su nivel (h1, h2, h3 y h4)
    titulo.textContent = noticia.titulo;

    const parrafo = document.createElement("p"); // se crea un parrafo
    parrafo.textContent = noticia.texto;
    texto.append(titulo, parrafo);

    main.append(seccion); // se agrega la sección al main
    })
} catch (error) {
    console.error("Error al cargar el contenido:", error);
    main.innerHTML = "<p>Error al cargar el contenido</p>";
}
