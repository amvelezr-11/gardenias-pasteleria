
/* GARDENIAS — Galería de momentos especiales */

(() => {
  "use strict";

  function crearGaleria() {

    if (document.body.dataset.page !== "nosotros") return false;

    if (document.getElementById("gd-momentos")) return true;

    const historia = document
      .querySelector("#mainContent .story-pair.about-pair")
      ?.closest("section");

    // Esperamos a que app.js termine de construir la página.
    if (!historia) return false;

    const fotos = [
      ["momento-01.webp", "Celebración en Gardenias"],
      ["momento-02.webp", "Cumpleaños con una torta personalizada"],
      ["momento-03.webp", "Una celebración especial"],
      ["momento-04.webp", "Celebración familiar"],
      ["momento-05.webp", "Una pareja celebrando"]
    ];

    const seccion = document.createElement("section");

    seccion.className = "gd-momentos";
    seccion.id = "gd-momentos";

    seccion.setAttribute(
      "aria-labelledby",
      "gd-momentos-titulo"
    );

    seccion.innerHTML = `
      <div class="gd-momentos-inner">

        <div class="gd-momentos-heading">

          <span class="gd-momentos-eyebrow">
            HISTORIAS QUE FLORECEN
          </span>

          <h2 id="gd-momentos-titulo">
            Estamos para acompañarte en tus
            <em>momentos más especiales.</em>
          </h2>

          <p>
            Nos emociona formar parte de tus celebraciones.
            Cada fotografía guarda un recuerdo y nos recuerda
            por qué hacemos todo con tanto amor.
          </p>

        </div>

        <div class="gd-momentos-grid">

          ${fotos.map(([archivo, descripcion], i) => `
            <button
              class="gd-momentos-card"
              type="button"
              data-momento="${i}"
              aria-label="Ampliar fotografía ${i + 1}"
            >
              <img
                src="assets/img/momentos/${archivo}"
                alt="${descripcion}"
                loading="lazy"
                decoding="async"
              >
            </button>
          `).join("")}

        </div>

        <p class="gd-momentos-foot">
          Gracias por permitirnos ser parte de sus historias. ♡
        </p>

      </div>
    `;

    // Insertar después de nuestra historia.
    historia.insertAdjacentElement("afterend", seccion);

    // Ventana para ampliar fotografías.
    const dialogo = document.createElement("dialog");

    dialogo.className = "gd-momentos-dialog";

    dialogo.setAttribute(
      "aria-label",
      "Fotografía ampliada de nuestras celebraciones"
    );

    dialogo.innerHTML = `
      <button
        class="gd-momentos-close"
        type="button"
        aria-label="Cerrar fotografía"
      >×</button>

      <img alt="">
    `;

    document.body.appendChild(dialogo);

    const imagenGrande = dialogo.querySelector("img");
    const botonCerrar = dialogo.querySelector("button");

    seccion.querySelectorAll("[data-momento]").forEach(boton => {

      boton.addEventListener("click", () => {

        const foto = fotos[Number(boton.dataset.momento)];

        if (!foto) return;

        imagenGrande.src = `assets/img/momentos/${foto[0]}`;
        imagenGrande.alt = foto[1];

        dialogo.showModal();

      });

    });

    botonCerrar.addEventListener("click", () => {
      dialogo.close();
    });

    dialogo.addEventListener("click", evento => {
      if (evento.target === dialogo) {
        dialogo.close();
      }
    });

    return true;
  }

  function iniciarGaleria() {

    // Si la página ya está construida, agregamos la galería.
    if (crearGaleria()) return;

    // Si todavía está cargando, esperamos a que aparezca.
    const observador = new MutationObserver(() => {

      if (crearGaleria()) {
        observador.disconnect();
      }

    });

    observador.observe(
      document.getElementById("app") || document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      iniciarGaleria,
      { once: true }
    );

  } else {

    iniciarGaleria();

  }

})();
