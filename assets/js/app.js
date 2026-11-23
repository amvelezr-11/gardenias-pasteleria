(()=>{
'use strict';
const G=window.GARDENIAS;
const page=document.body.dataset.page||'index';
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const escaped=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Rutas publicas desde la raiz del sitio (htdocs/gardenias/).
// Edita la carpeta de productos o videos aqui si la renombras.
const imagePath=name=>String(name||'').startsWith('assets/')?name:`assets/img/productos/${name}`;
const videoPath=name=>`assets/videos/${name}`;
const wa=text=>`https://wa.me/${G.whatsapp}?text=${encodeURIComponent(text)}`;
const byId=id=>G.products.find(p=>p.id===id);
const params=new URLSearchParams(location.search);
const storage={get(k,fallback){try{const x=localStorage.getItem(`gardenias_v6_${k}`);return x?JSON.parse(x):fallback}catch{return fallback}},put(k,data){try{localStorage.setItem(`gardenias_v6_${k}`,JSON.stringify(data))}catch{}}};
let cart=storage.get('carrito',[]);if(!Array.isArray(cart))cart=[];
let likes=new Set(storage.get('favoritos',[]));
let heroIndex=0,heroTimer=null;
const shipping=['Recogida en tienda en Ibagué','Otro acuerdo de entrega (consultar por WhatsApp)'];
function svg(name){const paths={search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',bag:'<path d="M5 9h14l-1 12H6L5 9Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',heart:'<path d="M20.5 4.8a5.4 5.4 0 0 0-7.7 0L12 5.7l-.8-.9a5.4 5.4 0 0 0-7.7 7.7L12 21l8.5-8.5a5.4 5.4 0 0 0 0-7.7Z"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',close:'<path d="M5 5l14 14M19 5 5 19"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',check:'<path d="m5 12 5 5L20 7"/>',chevron:'<path d="m6 9 6 6 6-6"/>'};return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`}
function shell(){return `<div class="top-notice"><span>Hecho con amor en Ibagué</span></div>
<header class="site-header" id="siteHeader">
 <div class="header-frame"><a class="header-logo" href="index.html" aria-label="Gardenias Pastelería, volver al inicio"><img src="assets/img/logos/logo-principal.svg" alt="Gardenias Pastelería de diseño"></a>
 <nav class="desktop-nav" aria-label="Navegación principal"><a class="${page==='index'?'active':''}" href="index.html">Inicio</a>
 <div class="shop-root" id="shopRoot"><button class="shop-trigger" id="shopTrigger" type="button" aria-expanded="false" aria-controls="shopPanel">Tienda ${svg('chevron')}</button><div class="shop-panel" id="shopPanel"><div class="shop-col"><span class="shop-label">CATEGORÍAS</span><a href="catalogo.html"><strong>Todos los productos</strong><small>Explora nuestro catálogo</small></a><a href="catalogo.html?categoria=tortas"><strong>Tortas personalizadas</strong><small>Diseños únicos para celebrar</small></a><a href="catalogo.html?categoria=mesario"><strong>Minis de mes</strong><small>Un pastelito por cada mes</small></a><a href="catalogo.html?categoria=candy"><strong>Postres / Candy Bar</strong><small>Mesas dulces para bodas y eventos</small></a></div><div class="shop-col"><span class="shop-label">DESCUBRE</span><a href="personaliza.html"><strong>Pedidos personalizados</strong><small>Cuéntanos los detalles de tu idea</small></a><a href="contacto.html#entregas"><strong>Domicilios y entregas</strong><small>Consulta las condiciones de tu pedido</small></a></div></div></div>
 <a class="${page==='nosotros'?'active':''}" href="nosotros.html">Nosotros</a><a class="${page==='contacto'?'active':''}" href="contacto.html">Contacto</a></nav>
 <div class="header-tools"><a class="header-order" href="personaliza.html">Haz tu pedido <span aria-hidden="true">↗</span></a><button class="icon-btn search-toggle" type="button" data-action="search" aria-label="Buscar productos">${svg('search')}</button><button class="icon-btn mobile-toggle" type="button" data-action="mobile" aria-label="Abrir menú" aria-controls="mobilePanel" aria-expanded="false">${svg('menu')}</button></div>
 </div><div class="cloud-edge" aria-hidden="true"></div><div class="cloud-sprinkles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
 <form id="searchForm" class="search-panel" hidden><label for="siteSearch">¿Qué estás buscando?</label><div><input id="siteSearch" placeholder="Tortas, cupcakes, postres..." autocomplete="off"><button class="btn small-btn" type="submit">Buscar ${svg('arrow')}</button></div></form>
 <nav class="mobile-panel" id="mobilePanel" aria-label="Navegación móvil" hidden><a href="index.html">Inicio</a><span>Categorías</span><a href="catalogo.html">Todos los productos</a><a href="catalogo.html?categoria=tortas">Tortas personalizadas</a><a href="catalogo.html?categoria=mesario">Minis de mes</a><a href="catalogo.html?categoria=candy">Postres / Candy Bar</a><span>Descubre</span><a href="personaliza.html">Pedidos personalizados</a><a href="contacto.html#entregas">Domicilios y entregas</a><a href="nosotros.html">Nosotros</a><a href="contacto.html">Contacto</a></nav>
</header>`}
function footer(){return `<footer class="footer"><div class="container footer-main"><div class="footer-brand"><a href="index.html"><img src="assets/img/logos/logo-gardenias-white.png" alt="Gardenias Pastelería de diseño"></a><p>Detalles dulces, diseños únicos y muchas razones para celebrar. Hecho con cariño en Ibagué.</p></div><div class="footer-links"><h3>Explora</h3><a href="catalogo.html">Productos</a><a href="personaliza.html">Personaliza</a><a href="nosotros.html">Nosotras</a><a href="nosotros.html#noticias">Noticias</a></div><div class="footer-links"><h3>Te ayudamos</h3><a href="contacto.html">Contacto</a><a href="contacto.html#entregas">Entregas</a><a href="catalogo.html">Catálogo de diseños</a><a href="index.html#preguntas">Preguntas frecuentes</a></div><div class="footer-contact"><h3>Hablemos</h3><p>WhatsApp exclusivo</p><a class="footer-wa" href="${wa('Hola, Gardenias. Quisiera información sobre un pedido.')}" target="_blank" rel="noopener">Escríbenos por WhatsApp ↗</a><p>Agenda con el 50 % de anticipo tras confirmar tu pedido.</p></div></div><div class="container footer-lower"><span>© ${new Date().getFullYear()} Gardenias Pastelería · Ibagué</span><span>Una celebración florece en cada detalle ✿</span></div></footer><a class="floating-wa" href="${wa('Hola, Gardenias. ¿Me ayudan a cotizar?')}" target="_blank" rel="noopener" aria-label="Hablar con Gardenias por WhatsApp"><span>✳</span><span>WhatsApp</span></a>`}
function img(p,cl='',opts={}){return `<img class="${cl}" src="${imagePath(p.img)}" alt="${escaped(p.name)}" loading="lazy" ${opts.style?`style="${opts.style}"`:''}>`}
function productHref(p){return `personaliza.html?modelo=${encodeURIComponent(p.id)}`}
function productCard(p){const href=productHref(p);return `<article class="product-card catalog-model-card">
<a class="photo-well" href="${href}" aria-label="Ver ${escaped(p.name)}" style="--photo:url('${imagePath(p.img)}')"><span class="photo-sharp"><img src="${imagePath(p.thumb||p.img)}" alt="${escaped(p.name)}, ${escaped(p.tag)}${p.reference?' (imagen de referencia)':' de Gardenias'}" loading="lazy" decoding="async"></span><span class="photo-tag">${escaped(p.tag)}</span>${p.reference?'<span class="reference-label">Imagen de referencia</span>':''}</a>
<div class="product-info"><span class="product-kicker">${escaped(p.tag)}</span><a class="product-title" href="${href}">${escaped(p.name)}</a><p>${escaped(p.desc)}</p><div class="product-bottom"><span>Código ${escaped(p.id)}</span><a href="${href}" class="round-arrow" aria-label="Elegir ${escaped(p.name)}">${svg('arrow')}</a></div></div>
</article>`}
function mediaSlide(m,i){return `<div class="hero-slide ${i===0?'active':''}" data-slide="${i}" aria-hidden="${i===0?'false':'true'}">${m.kind==='video'?`<video muted playsinline preload="metadata" poster="${imagePath(m.poster)}" aria-label="${escaped(m.alt)}"><source src="${videoPath(m.src)}" type="video/mp4"></video>`:`<picture>${m.mobile?`<source media="(max-width: 700px)" srcset="${imagePath(m.mobile)}">`:''}<img src="${imagePath(m.src)}" alt="${escaped(m.alt)}" ${i===0?'fetchpriority="high"':'loading="lazy"'}></picture>`}</div>`}
function hero(){return `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><div class="eyebrow with-line">GARDENIAS · PASTELERÍA DE DISEÑO</div><h1>Momentos<br>que <em>florecen.</em></h1><p>Tortas y postres únicos, hechos con amor y pensados para celebrar cada historia.</p><div class="hero-buttons"><a class="btn" href="catalogo.html">Explorar catálogo ${svg('arrow')}</a><a class="btn btn-outline" href="personaliza.html">Personaliza tu torta ↗</a></div><div class="hero-note"><img src="assets/img/logos/flor-gardenias.png" alt=""/><span>Hecho para celebrar · Ibagué</span></div></div><div class="hero-art"><span class="hero-halo"></span><div class="hero-blob" id="heroMedia">${G.hero.map(mediaSlide).join('')}</div><div class="hero-stamp">
  <img src="assets/img/logos/isotipo-ondulado.svg" alt="Isotipo de Gardenias">
</div><div class="hero-controls"><button type="button" data-hero="prev" aria-label="Fotografía anterior">‹</button><div id="heroDots">${G.hero.map((_,i)=>`<button data-hero="${i}" class="${i===0?'on':''}" type="button" aria-label="Ver elemento ${i+1}" aria-current="${i===0?'true':'false'}"></button>`).join('')}</div><button type="button" data-hero="next" aria-label="Fotografía siguiente">›</button></div></div></div></section>`}

// Colección destacada de Gardenias: edición de títulos y datos en un solo lugar.
// Ocasión y composición quedan vacías hasta conocer la información real.
const featuredCreations = [
  { id:'blanca-de-gala', archivo:'01-torta-blanca-de-evento.webp', nombre:'Blanca de gala', ocasion:'', composicion:'' },
  { id:'jardin-de-fantasia', archivo:'02-jardin-fantasia.webp', nombre:'Jardín de fantasía', ocasion:'', composicion:'' },
  { id:'orquideas-rosadas', archivo:'03-orquideas-rosadas.webp', nombre:'Orquídeas rosadas', ocasion:'', composicion:'' },
  { id:'elegancia-marfil', archivo:'04-torta-marfil.webp', nombre:'Elegancia marfil', ocasion:'', composicion:'' },
  { id:'frambuesas-y-lazos', archivo:'05-torta-frambuesas.webp', nombre:'Frambuesas y lazos', ocasion:'', composicion:'' },
  { id:'ramo-de-flores', archivo:'06-corazon-floral.webp', nombre:'Ramo de flores', ocasion:'', composicion:'' }
];
const featuredImage = c => `assets/img/creaciones/${c.archivo}`;
const featuredLink = c => `creaciones.html?creacion=${encodeURIComponent(c.id)}`;

function favorites() {
  return `<section class="section favorites" id="favoritas"><div class="container">
    <div class="section-heading"><div><div class="eyebrow">CREACIONES ESPECIALES</div>
      <h2>Nuestras <em>favoritas.</em></h2>
      <p>Seis creaciones que muestran el arte y los detalles de Gardenias.</p></div></div>
    <div class="slider-bar"><span>Una galería para inspirarte</span><div>
      <button type="button" data-scroll="left" aria-label="Ver creaciones anteriores">←</button>
      <button type="button" data-scroll="right" aria-label="Ver más creaciones">→</button>
    </div></div>
    <div class="favorite-track" id="favoriteTrack">
      ${featuredCreations.map(c=>`<article class="product-card showcase-card">
        <a class="showcase-photo" href="${featuredLink(c)}" aria-label="Conocer ${escaped(c.nombre)}">
          <img src="${featuredImage(c)}" alt="${escaped(c.nombre)}, torta de Gardenias" loading="lazy" decoding="async">
          <span class="showcase-caption"><strong>${escaped(c.nombre)}</strong><span>Ver más ↗</span></span>
        </a></article>`).join('')}
    </div>
    <p class="slide-hint">Desliza para descubrir las seis creaciones</p>
    <div class="creations-home-more"><a href="creaciones.html" class="btn">Explorar nuestras creaciones ${svg('arrow')}</a></div>
  </div></section>`;
}

function creationsPage() {
  const selectedId = params.get('creacion');
  const selected = featuredCreations.find(c=>c.id===selectedId);
  if (selected) {
    document.title = `${selected.nombre} | Creaciones Gardenias`;
    const pos=featuredCreations.indexOf(selected);
    const next=featuredCreations[(pos+1)%featuredCreations.length];
    return `<section class="creations-detail-intro"><div class="container">
      <a class="creations-back" href="creaciones.html">← Volver a la galería</a>
      <div class="eyebrow">GALERÍA DE CREACIONES · GARDENIAS</div>
    </div></section>
    <main class="container creations-detail-layout">
      <div class="creations-detail-media"><img src="${featuredImage(selected)}" alt="${escaped(selected.nombre)}, creación de Gardenias" fetchpriority="high"></div>
      <div class="creations-detail-copy">
        <span class="creations-edition">UN DISEÑO PARA RECORDAR</span>
        <h1>${escaped(selected.nombre)}</h1>
        <p>Una de nuestras creaciones favoritas. Cada torta refleja el cuidado y la dedicación que ponemos en los detalles de Gardenias.</p>
        <div class="creations-detail-facts">
          <div><span>La ocasión</span><p>${selected.ocasion?escaped(selected.ocasion):'Próximamente compartiremos la historia de esta creación.'}</p></div>
          <div><span>Su composición</span><p>${selected.composicion?escaped(selected.composicion):'Los sabores e ingredientes de esta torta están pendientes de confirmar.'}</p></div>
        </div>
        <a class="btn" href="${wa(`Hola, Gardenias. Vi su creación «${selected.nombre}» y quisiera consultar un diseño inspirado en ella.`)}" target="_blank" rel="noopener">Consultar un diseño similar ${svg('arrow')}</a>
        <a class="creations-next" href="${featuredLink(next)}">Ver otra creación: <strong>${escaped(next.nombre)}</strong> ↗</a>
      </div>
    </main>
    <section class="creations-detail-footer"><div class="container"><a class="underlink" href="creaciones.html">← Descubrir todas las creaciones</a></div></section>`;
  }
  document.title = 'Nuestras creaciones | Gardenias Pastelería';
  return `<section class="creations-gallery-intro"><div class="container creations-gallery-heading">
    <span class="eyebrow">GARDENIAS · PASTELERÍA DE DISEÑO</span>
    <h1>Creaciones que <em>florecen.</em></h1>
    <p>Una selección de seis tortas que nos encanta recordar. Descubre cada diseño y déjate inspirar por sus detalles.</p>
    <a class="creations-back" href="index.html#favoritas">← Volver al inicio</a>
  </div></section>
  <main class="section creations-gallery-section"><div class="container">
    <div class="creations-gallery-grid">
      ${featuredCreations.map((c,i)=>`<a class="creations-gallery-card" href="${featuredLink(c)}" aria-label="Ver detalles de ${escaped(c.nombre)}">
        <img src="${featuredImage(c)}" alt="${escaped(c.nombre)}, creación de Gardenias" ${i<2?'fetchpriority="high"':'loading="lazy"'} decoding="async">
        <div class="creations-gallery-overlay"><strong>${escaped(c.nombre)}</strong><span>Ver más ↗</span></div>
      </a>`).join('')}
    </div>
    <div class="creations-gallery-closing"><span class="eyebrow">HECHO CON AMOR EN IBAGUÉ</span><h2>Cada celebración merece <em>su propio diseño.</em></h2>
      <a href="personaliza.html" class="btn">Cuéntanos tu idea ${svg('arrow')}</a></div>
  </div></main>`;
}

function categoryCards(){return `<section class="section categories patterned baking" id="categorias"><div class="container"><div class="section-heading"><div><div class="eyebrow">HECHO A TU MANERA</div><h2>Hay algo dulce <em>para cada ocasión.</em></h2><p>Explora todas las categorías reales de Gardenias.</p></div></div><div class="category-grid">${G.categories.map(p=>`<a class="category-card" href="catalogo.html?categoria=${p.id}"><div class="cat-photo"><img src="${imagePath(p.img)}" alt="${escaped(p.label)}" loading="lazy"></div><div class="cat-text"><strong>${escaped(p.label)}</strong><span>${escaped(p.desc)} ↗</span></div></a>`).join('')}</div></div></section>`}
function candyFeature(){return `<section class="section candy-feature"><div class="container"><div class="section-heading"><div><div class="eyebrow">CANDY BAR · BODAS Y EVENTOS</div><h2>Una mesa dulce que <em>enamora.</em></h2><p>Postres en vasito, chunk cakes, mousse de chocolate y cheesecake de frutos rojos para bodas y celebraciones.</p></div><a class="underlink" href="${wa('Hola, Gardenias. Quiero cotizar un Candy Bar para boda o evento.')}" target="_blank" rel="noopener">Cotizar mi evento ↗</a></div><div class="dessert-grid">${G.events.map(x=>`<article class="dessert-card"><div class="dessert-photo"><img src="${imagePath(x.img)}" alt="${escaped(x.name)}" loading="lazy"><span>Imagen de referencia</span></div><div class="dessert-text"><h3>${escaped(x.name)}</h3><p>${escaped(x.text)}</p></div></article>`).join('')}</div></div></section>`}
function aboutTeaser(){return `<section class="section story-teaser"><div class="container story-pair"><div class="story-photo"><img src="assets/img/productos/nosotras_evento_duo.webp" alt="Equipo de Gardenias en su stand de Sinfonía de Ocobos" loading="lazy"></div><div class="story-copy"><div class="eyebrow with-line">CON AMOR, DESDE IBAGUÉ</div><h2>Diseñamos dulces <em>historias.</em></h2><p>En Gardenias creemos que una torta es mucho más que un postre. Detrás de cada creación estamos nosotras, escuchando ideas, imaginando detalles y preparando momentos inolvidables.</p><a href="nosotros.html" class="underlink">Conoce nuestra historia ↗</a></div></div></section>`}
function newsTeaser(){return `<section class="section news-teaser patterned sprinkles"><div class="container"><div class="section-heading"><div><div class="eyebrow">LO ÚLTIMO EN GARDENIAS</div><h2>Un logro que nos hizo <em>florecer.</em></h2><p>Ganamos el concurso de la torta del cumpleaños de Ibagué con “Sinfonía de Ocobos”.</p></div><a class="underlink" href="nosotros.html#noticias">Leer la noticia ↗</a></div><div class="news-hero"><div class="news-photo"><img src="assets/img/productos/premio_duo.webp" alt="Gardenias celebrando su reconocimiento por Sinfonía de Ocobos" loading="lazy"></div><div class="news-text"><span class="pill">NUESTRO RECONOCIMIENTO</span><h3>Una torta hecha para celebrar a Ibagué.</h3><p>Flores, creatividad y mucho cariño en una creación que representa una celebración muy especial para la ciudad.</p><a href="nosotros.html#noticias" class="btn btn-outline">Conoce el logro ${svg('arrow')}</a></div></div></div></section>`}
function videoFeature(){return `<section class="section video-section"><div class="container video-card"><div class="video-copy"><span class="eyebrow">GARDENIAS EN MOVIMIENTO</span><h2>Los detalles también <em>cuentan historias.</em></h2><p>Un vistazo a las flores, las texturas y la dedicación detrás de nuestras creaciones. Así se vive el diseño en Gardenias.</p><a class="underlink" href="nosotros.html">Conoce más de nosotras ↗</a></div><div class="video-well"><video autoplay muted loop playsinline preload="auto"><source src="assets/videos/gardenias_creaciones_nuevo.mp4" type="video/mp4">Tu navegador no admite video.</video></div></div></section>`}function questions(){return `<section class="section faq" id="preguntas"><div class="container slim"><div class="eyebrow">TE ACOMPAÑAMOS</div><h2>Preguntas <em>frecuentes.</em></h2><details><summary>¿Cuánto debo pagar para agendar mi pedido?</summary><p>Para agendar, el anticipo es del 50 % del valor confirmado por Gardenias. La fecha está sujeta a disponibilidad.</p></details><details><summary>¿Cambian los precios al elegir sabores o rellenos?</summary><p>No. Los sabores de bizcocho y los siete rellenos disponibles no modifican el valor de la torta.</p></details><details><summary>¿Puedo enviar una referencia para una torta personalizada?</summary><p>Sí. Envíanos tus ideas y fotografías por WhatsApp para que podamos confirmar el diseño y su cotización.</p></details><details><summary>¿Ofrecen postres para bodas y eventos?</summary><p>Sí. Contamos con propuestas de Candy Bar, postres en vasito, chunk cakes y otros detalles dulces.</p></details></div></section>`}
function contactCta(){return `<section class="section cta-section"><div class="container"><div class="cta-cloud"><img src="assets/img/logos/flor-gardenias.png" alt=""/><div><h2>¿No encuentras lo que buscas?</h2><p>Cuéntanos tu idea. Te ayudaremos a encontrar la mejor opción para tu celebración.</p></div><div class="cta-actions"><a class="btn" href="${wa('Hola, Gardenias. No encuentro exactamente lo que busco y quisiera una cotización personalizada.')}" target="_blank" rel="noopener">Escríbenos por WhatsApp ↗</a><a class="btn cta-instagram" href="https://www.instagram.com/gardenias_pasteleria/" target="_blank" rel="noopener">Síguenos en Instagram ↗</a></div></div></div></section>`}

function homePage() {
  return hero() + `
    <section class="values">
      <div>
        <img src="assets/img/iconos/01_tortas%201.svg" alt="">
        <b>Diseños personalizados</b>
        <span>Cada torta cuenta una historia</span>
      </div>
      <div>
        <img src="assets/img/iconos/02_cupcakes%201.svg" alt="">
        <b>Elaboración artesanal</b>
        <span>Cuidamos cada detalle</span>
      </div>
      <div>
        <img src="assets/img/iconos/06_sabores%201.svg" alt="">
        <b>Ingredientes seleccionados</b>
        <span>Sabor y calidad en cada celebración</span>
      </div>
      <div>
        <img src="assets/img/iconos/15_eventos_celebraciones%201.svg" alt="">
        <b>Momentos especiales</b>
        <span>Creaciones para celebrar a tu manera</span>
      </div>
    </section>
  ` + favorites() + aboutTeaser() + categoryCards()  + videoFeature() + questions() + contactCta();
}

const realCatalogFilters=[
  {id:'todos',label:'Todos'},
  {id:'tortas',label:'Tortas personalizadas'},
  {id:'mesario',label:'Minis de mes'},
  {id:'minis',label:'Mini tortas'},
  {id:'pequena',label:'Tortas pequeñas'},
  {id:'mediana',label:'Tortas medianas'},
  {id:'grande',label:'Tortas grandes'},
  {id:'alta',label:'Tortas altas'},
  {id:'cupcakes',label:'Cupcakes'},
  {id:'candy',label:'Postres / Candy Bar'},
  {id:'cuchareables',label:'Cuchareables'},
  {id:'chunk',label:'Chunk cakes'},
  {id:'postres',label:'Cheesecakes y mousse'}
];
const fixedModelIds='G-7078 G-7080 G-7536 G-7701 G-7719 G-7736 G-7754 G-7756 G-7631 G-7699 G-7708 G-7725 G-7731 G-7688 G-7700 G-7705 G-7706 G-7711 G-7728 G-7732 G-7743 G-7689 G-7697 G-7707 G-7710 G-7722 G-7724 G-7735 G-7737 G-7738 G-7739 G-7742 G-7746 G-7748 G-7575 G-7683 G-7686 G-7687 G-7690 G-7693 G-7703 G-7704 G-7727 G-7729 G-7744 G-7745 G-7749 G-7691 G-7692 G-7702 G-7709 G-7720 G-7733 G-7715 G-7716 G-7717'.split(' ');
const fixedModelNumbers=new Map(fixedModelIds.map((id,i)=>[id,i+1]));
let catalogLoadError='';
const modelGroup=row=>row.subcategoria==='mesario'?'mesario':row.subcategoria==='torta-mini'?'minis':row.subcategoria==='cupcakes'?'cupcakes':row.subcategoria==='postre'?'postres':'tortas';
const groupLabel=id=>({'mesario':'Minis de mes','minis':'Mini tortas','cupcakes':'Cupcakes','postres':'Postres','tortas':'Tortas personalizadas'})[id]||'Tortas personalizadas';
// Excepciones: los tres postres de autor mantienen sus nombres descriptivos.
// Los demás productos conservan la numeración fija Modelo 1, Modelo 2, etc.
const gardeniasPostresEspeciales={
  'G-7715':{
    name:'Cheesecake de frutos rojos',
    desc:'Base de miga de galleta, suave crema blanca y mermelada casera de frutos rojos.'
  },
  'G-7716':{
    name:'Cheesecake de limón',
    desc:'Base de miga de galleta, crema suave con zumo de limón y merengue italiano por encima.'
  },
  'G-7717':{
    name:'Mousse de chocolate',
    desc:'Crema de chocolate, bizcocho de chocolate y chips de chocolate en una mezcla deliciosa.'
  }
};
async function loadRealCatalog(){
 try{
  const r=await fetch('catalogo_productos.json');
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  const records=await r.json();
  if(!Array.isArray(records)||records.length===0)throw new Error('El archivo JSON está vacío o es inválido');
  const ids=new Set();
  G.products=records.map((row,i)=>{
    if(!row.id||!row.imagen||ids.has(row.id))throw new Error(`Registro ${i+1} incompleto o repetido`);
    ids.add(row.id);
    const category=modelGroup(row);
    const especial=gardeniasPostresEspeciales[row.id];
    return {id:row.id,name:especial?.name||`Modelo ${fixedModelNumbers.get(row.id)||i+1}`,number:fixedModelNumbers.get(row.id)||i+1,category,subcat:row.subcategoria,tag:groupLabel(category),desc:especial?.desc||'Elige este diseño y personaliza tu solicitud.',img:row.imagen,thumb:row.miniatura,reference:false};
  });
  // Recuperar los cuchareables y chunk cakes que ya estaban en la web.
  // Son fotos existentes en assets/img/productos, no requieren copiar imágenes nuevas.
  const complementosCandy=[
   {id:'G-CU01',name:'Modelo 57',number:57,category:'cuchareables',subcat:'cuchareables',tag:'Cuchareables',desc:'Cuchareable de Red Velvet con capas de bizcocho y crema.',img:'cuchareable_red_velvet_desktop.webp',thumb:'cuchareable_red_velvet_movil.webp',reference:false},
   {id:'G-CU02',name:'Modelo 58',number:58,category:'cuchareables',subcat:'cuchareables',tag:'Cuchareables',desc:'Cuchareable de chocolate para disfrutar a cucharadas.',img:'cuchareable_chocolate_desktop.webp',thumb:'cuchareable_chocolate_movil.webp',reference:false},
   {id:'G-CH01',name:'Modelo 59',number:59,category:'chunk',subcat:'chunk',tag:'Chunk cakes',desc:'Presentaciones de chunk cakes para compartir.',img:'chunkcakes_varios.webp',thumb:'chunkcakes_varios.webp',reference:true},
   {id:'G-CH02',name:'Modelo 60',number:60,category:'chunk',subcat:'chunk',tag:'Chunk cakes',desc:'Chunk cake de chocolate con decoración cremosa.',img:'chunkcake_oreo.webp',thumb:'chunkcake_oreo.webp',reference:true}
  ];
  G.products.push(...complementosCandy);
  // Fotografías aportadas para la línea de eventos. Se muestran como referencias,
  // no como fotografías originales de productos de Gardenias.
  const referenciasCandy=[
   {id:'G-CB01',name:'Modelo 61',number:61,category:'candy',subcat:'candy',tag:'Candy Bar',desc:'Referencia de mesa dulce con vasitos y postres variados.',img:'assets/img/catalogo/candy-bar/mesa-postres-variados.webp',thumb:'assets/img/catalogo/candy-bar/mesa-postres-variados.webp',reference:true},
   {id:'G-CB02',name:'Modelo 62',number:62,category:'candy',subcat:'candy',tag:'Candy Bar',desc:'Referencia de cupcakes decorados con frutos rojos.',img:'assets/img/catalogo/candy-bar/cupcakes-frutas.webp',thumb:'assets/img/catalogo/candy-bar/cupcakes-frutas.webp',reference:true},
   {id:'G-CB03',name:'Modelo 63',number:63,category:'candy',subcat:'candy',tag:'Candy Bar',desc:'Referencia de mini postres cítricos para celebraciones.',img:'assets/img/catalogo/candy-bar/mini-cheesecakes-citricos.webp',thumb:'assets/img/catalogo/candy-bar/mini-cheesecakes-citricos.webp',reference:true}
  ];
  G.products.push(...referenciasCandy);

  if(!G.categories.some(c=>c.id==='mesario')){
    const first=G.products.find(p=>p.category==='mesario');
    if(first)G.categories.splice(2,0,{id:'mesario',label:'Minis de mes',desc:'Celebremos cada mes de tu bebé',img:first.img});
  }
 }catch(error){
  console.error('No se pudo cargar el catálogo Gardenias:',error);
  catalogLoadError='No pudimos cargar las fotografías. Comprueba que catalogo_productos.json esté junto a index.html y que estés utilizando Live Server.';
  G.products=[];
 }
}
// El enlace directo a la imagen solo es público cuando la página está publicada.
function photoPublicUrl(p){
 if(['localhost','127.0.0.1','0.0.0.0'].includes(location.hostname)||location.protocol==='file:')return '';
 return new URL(imagePath(p.img),location.href).href;
}
function catalogExtraStyles(){return `<style>
.catalog-model-card .product-bottom{display:flex;align-items:center;justify-content:space-between;gap:8px}
.catalog-model-card .product-bottom span{font-size:13px;color:#626543}
.catalog-model-card .photo-well{background:#f6eee7}
.catalog-model-card .photo-sharp img{object-fit:contain}
.catalog-model-card .product-title{font-weight:700}
.catalog-model-card .reference-label{position:absolute;bottom:12px;left:12px;background:rgba(255,250,246,.94);padding:5px 9px;border-radius:999px;color:#626543;font-size:11px;font-weight:700;z-index:2}
.catalog-progress{text-align:center;margin-top:30px;display:grid;justify-items:center;gap:12px}
.catalog-more{cursor:pointer;border:1px solid #626543;border-radius:999px;padding:13px 24px;background:#626543;color:#fff;font:700 15px sans-serif}
.catalog-more:hover{filter:brightness(.92)}
.catalog-intro-note{margin-bottom:20px;font-size:15px;color:#626543}
.custom-photo-code{display:inline-block;margin-top:12px;padding:8px 14px;border-radius:999px;background:#f2ece5;font-size:13px;color:#626543;font-weight:700}
.customize-layout .preview-image{height:auto!important;aspect-ratio:auto!important;padding:0!important;display:block}
.customize-layout .preview-image::before{display:none!important}
.customize-layout .preview-image img{display:block;width:100%;height:auto!important;max-height:650px;object-fit:contain!important}
.customize-layout .custom-preview p{line-height:1.6}
.custom-required{color:#876a76;font-size:13px}
.customize-layout [hidden]{display:none!important}
.customize-layout .form-group input,.customize-layout .form-group select,.customize-layout .form-group textarea{max-width:100%}
.customize-layout .form-eyebrow{margin-bottom:18px}
.catalog-info-box{background:#f6f0e9;padding:17px;border-radius:18px;color:#555e43;font-size:14px;line-height:1.6}
.copy-design-notice{margin:22px 0 20px;padding:20px;background:#fff9f4;border:1.5px solid rgba(98,101,67,.44);border-radius:20px;box-shadow:0 9px 26px rgba(68,52,38,.12)}
.copy-design-notice strong{display:block;font-size:18px;line-height:1.4;color:#3f442e;margin-bottom:10px}
.copy-design-notice p{font-size:15px;line-height:1.6;color:#44483a;margin:0 0 15px}
.copy-design-notice .copy-design-btn{display:inline-flex;justify-content:center;align-items:center;max-width:100%;margin:0 0 14px;cursor:pointer}
.copy-design-notice .copy-design-status{font-size:13px;line-height:1.5;color:#626543;margin:0;font-weight:600}
.copy-design-notice .copy-design-status[data-error="true"]{color:#9a4e34}
@media(max-width:560px){.copy-design-notice{padding:17px}.copy-design-notice .copy-design-btn{width:100%;font-size:14px}}
@media(max-width:900px){.customize-layout .custom-preview{position:static}.catalog-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.catalog-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.catalog-model-card .product-info{padding:13px}.catalog-model-card .product-info p{font-size:12px}.catalog-model-card .photo-tag{font-size:10px}.catalog-model-card .product-bottom{align-items:flex-start}.catalog-model-card .product-bottom span{font-size:10px}.catalog-model-card .product-title{font-size:18px}}
/* Presentación editorial de mesas dulces */
.catalog-candy-spotlight{margin:22px 0 38px;padding:clamp(24px,4vw,46px);background:linear-gradient(125deg,#fffaf6 0%,#f6e9e5 100%);border:1px solid rgba(98,101,67,.28);border-radius:30px;box-shadow:0 16px 40px rgba(69,54,43,.10);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.06fr);gap:clamp(24px,3.5vw,48px);align-items:center}
.catalog-candy-spotlight[hidden]{display:none!important}
.catalog-candy-copy .eyebrow{color:#626543;font-weight:750;font-size:12px;letter-spacing:.14em}
.catalog-candy-copy h2{font-family:'Playfair Display',Georgia,serif;font-size:clamp(32px,3.2vw,52px);letter-spacing:-.027em;line-height:1.13;margin:16px 0 22px;color:#303a2b}
.catalog-candy-copy h2 em{color:#626543}
.catalog-candy-copy p{font-size:clamp(16px,1.45vw,19px);line-height:1.65;color:#626543;margin:0 0 25px}
.catalog-candy-photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:10px;height:360px}
.catalog-candy-photos a{min-width:0;overflow:hidden;border-radius:18px;border:1px solid rgba(98,101,67,.14);box-shadow:0 8px 22px rgba(50,44,32,.16)}
.catalog-candy-photos img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .35s ease}
.catalog-candy-photos a:hover img{transform:scale(1.035)}
@media(max-width:900px){.catalog-candy-spotlight{grid-template-columns:1fr}.catalog-candy-photos{height:300px}}
@media(max-width:600px){.catalog-candy-spotlight{padding:22px 16px;border-radius:23px}.catalog-candy-photos{gap:6px;height:230px}.catalog-candy-photos a{border-radius:12px}}
</style>`}

function candySpotlight(){return `<section class="catalog-candy-spotlight" id="catalogCandySpotlight" hidden aria-label="Mesas dulces Gardenias">
<div class="catalog-candy-copy"><span class="eyebrow">GARDENIAS · CANDY BAR</span>
<h2>¿Quieres hacer de tu celebración <em>algo memorable?</em></h2>
<p>Creamos mesas de postres pensadas para sorprender y enamorar. Cupcakes, cuchareables, cheesecakes y más detalles dulces para cumpleaños, bodas, grados y todo tipo de celebraciones.</p>
<a class="btn" href="${wa('¡Hola, Gardenias! 🌸 Quisiera cotizar una mesa de postres para mi celebración. ¿Me ayudan con las opciones de cupcakes, cuchareables, cheesecakes y otros postres?')}" target="_blank" rel="noopener">Cotiza tu mesa dulce ${svg('arrow')}</a></div>
<div class="catalog-candy-photos">
<a href="personaliza.html?modelo=G-CB01" aria-label="Ver referencia de mesa de postres variados"><img src="assets/img/catalogo/candy-bar/mesa-postres-variados.webp" alt="Referencia de mesa de postres variados" loading="lazy" decoding="async"></a>
<a href="personaliza.html?modelo=G-CB02" aria-label="Ver referencia de cupcakes con frutos rojos"><img src="assets/img/catalogo/candy-bar/cupcakes-frutas.webp" alt="Referencia de cupcakes con frutos rojos" loading="lazy" decoding="async"></a>
<a href="personaliza.html?modelo=G-CB03" aria-label="Ver referencia de mini postres cítricos"><img src="assets/img/catalogo/candy-bar/mini-cheesecakes-citricos.webp" alt="Referencia de mini postres cítricos" loading="lazy" decoding="async"></a>
</div></section>`}

function catalogPage(){
 const category=params.get('categoria')||'todos';
 return `<section class="page-intro patterned sprinkles"><div class="container"><span class="eyebrow">CREACIONES GARDENIAS</span><h1>Encuentra tu próximo <em>diseño favorito.</em></h1><p>Elige una fotografía, personaliza tu pedido y conversa con nosotras por WhatsApp. Sin precios ni pagos en línea.</p></div></section>
 <main class="container catalog-main"><div class="breadcrumbs"><a href="index.html">Inicio</a> <span>/</span> Catálogo</div>
 <div class="catalog-tools"><div class="catalog-filters" id="categoryFilters">${realCatalogFilters.map(c=>`<button type="button" data-filter="${c.id}" class="${category===c.id?'selected':''}">${escaped(c.label)}</button>`).join('')}</div></div>
 ${candySpotlight()}
 <div id="catalogCount" class="catalog-caption" aria-live="polite"></div><p class="catalog-intro-note">Explora diseños y presentaciones. Elige el modelo, tamaño, sabor y los detalles que correspondan; algunas fotos son referencias de presentación.</p>
 <div id="catalogGrid" class="catalog-grid"></div><div id="catalogProgress" class="catalog-progress"></div>
 <div class="catalog-notice"><div><h3>¿No encuentras exactamente lo que buscas?</h3><p>Cuéntanos tu idea y la diseñamos contigo.</p></div><a class="btn" href="${wa('Hola, Gardenias. Quisiera ayuda para encontrar un diseño personalizado.') }" target="_blank" rel="noopener">Consultar por WhatsApp ↗</a></div></main>${catalogExtraStyles()}`;
}
function personalizePage(){
 const id=params.get('modelo');
 const initial=byId(id)||G.products[0];
 if(!initial)return `<main class="container section"><h1>Catálogo no disponible</h1><p>${escaped(catalogLoadError||'No hay modelos cargados.')}</p><a class="btn" href="catalogo.html">Volver al catálogo</a></main>`;
 const cake= ['tortas','minis','mesario'].includes(initial.category);
 return `<section class="page-intro"><div class="container"><span class="eyebrow">PERSONALIZADO PARA TU CELEBRACIÓN</span><h1>Haz tuya esta <em>creación.</em></h1><p>Escoge un diseño real y cuéntanos cómo lo quieres. Recibirás asesoría y cotización por WhatsApp.</p></div></section>
 <main class="container customize-layout"><div class="custom-preview"><div class="preview-image" id="previewImage"><img id="designImage" src="${imagePath(initial.img)}" alt="${escaped(initial.name)}"></div><span id="modelCode" class="custom-photo-code">${escaped(initial.name)} · ${escaped(initial.id)}</span>
 <div class="copy-design-notice" id="copyDesignNotice" role="group" aria-label="Instrucciones para adjuntar el diseño por WhatsApp">
  <strong>📸 ¡No olvides enviarnos la fotografía!</strong>
  <p>Por favor, copia la imagen del diseño que elegiste y adjúntala en el chat de WhatsApp junto con tu solicitud. Así nuestro equipo sabrá exactamente qué torta te interesa.</p>
  <button type="button" class="btn copy-design-btn" id="copyDesignBtn">Copiar imagen del diseño ⧉</button>
  <p class="copy-design-status" id="copyDesignStatus" role="status" aria-live="polite">Primero copia la foto; luego completa el formulario y abre WhatsApp.</p>
 </div><a class="underlink" href="catalogo.html">← Ver otros modelos</a></div>
 <div class="custom-form"><div class="form-eyebrow">TU SOLICITUD PARA GARDENIAS</div><form id="customForm">
 <div class="form-group"><label for="design">1. Modelo</label><select id="design" name="design" required>${G.products.map(p=>`<option value="${escaped(p.id)}" ${p.id===initial.id?'selected':''}>${escaped(p.name)} · ${escaped(p.tag)} · ${escaped(p.id)}</option>`).join('')}</select></div>
 <div id="cakeOptions" ${cake?'':'hidden'}>
 <div id="cakeSizes" class="form-group"><label for="size">Tamaño de la torta</label><select id="size" name="size">${G.sizes.map(s=>`<option value="${s.id}">${escaped(s.label)} · ${escaped(s.servings)}</option>`).join('')}</select><small>Podemos confirmar si este diseño es posible en el tamaño elegido.</small></div>
 <div class="form-group"><label for="cakeFlavor">Sabor del bizcocho</label><select id="cakeFlavor" name="cakeFlavor"><option value="">Elige un sabor</option>${G.cakes.map(v=>`<option value="${escaped(v)}">${escaped(v)}</option>`).join('')}</select></div>
 <div class="form-group"><label for="filling">Relleno</label><select id="filling" name="filling"><option value="">Elige un relleno</option>${G.fillings.map(v=>`<option value="${escaped(v)}">${escaped(v)}</option>`).join('')}</select></div>
 </div>
 <div id="otherProductOptions" ${cake?'hidden':''}><div class="form-group"><label for="otherFlavor">Sabor o preferencias (opcional)</label><input id="otherFlavor" name="otherFlavor" placeholder="Cuéntanos qué sabor buscas"></div></div>
 <div class="form-row"><div class="form-group"><label for="date">Fecha deseada</label><input id="date" name="date" type="date" required></div><div class="form-group"><label for="quantity">Cantidad</label><input id="quantity" name="quantity" type="number" value="1" min="1" max="100" required></div></div>
 <div class="form-group"><label for="details">Observaciones (opcional)</label><textarea id="details" name="details" rows="4" placeholder="Nombre, mensaje, colores, edad o cambios que quieras hacer al diseño"></textarea></div>
 <p class="catalog-info-box"><strong>Antes de abrir WhatsApp:</strong> copia la fotografía del diseño. Cuando se abra el chat, envía el mensaje y pega la foto (o adjúntala desde tus archivos). No se realizan compras ni pagos en esta página.</p>
 <button type="submit" class="btn full-btn">Consultar por WhatsApp ${svg('arrow')}</button>
 </form></div></main>${catalogExtraStyles()}`;
}
function aboutPage(){return `<section class="page-intro patterned sprinkles"><div class="container"><span class="eyebrow">NUESTRA HISTORIA</span><h1>Celebrar también es una forma de <em>amar.</em></h1><p>Dos personas, muchas ideas y una pastelería que diseña momentos especiales.</p></div></section><main><section class="section"><div class="container story-pair about-pair"><div class="story-photo"><img src="assets/img/productos/nosotras_evento_duo.webp" alt="Las dos creadoras de Gardenias en su stand de Sinfonía de Ocobos"></div><div class="story-copy"><span class="eyebrow with-line">GARDENIAS · IBAGUÉ</span><h2>De nuestras manos a tus <em>recuerdos.</em></h2><p>En Gardenias compartimos la pasión por los detalles y las celebraciones. Cada pedido empieza escuchando una historia: una persona especial, una fecha importante o una idea que merece hacerse realidad.</p><p>Combinamos creatividad, diseño y repostería para crear tortas personalizadas y postres con identidad propia. Para nosotras, cada celebración es una oportunidad de hacer algo diferente y cercano.</p><p>Hoy también acompañamos bodas y eventos con mesas dulces, cupcakes, mini tortas, cuchareables y chunk cakes.</p><a href="personaliza.html" class="btn">Diseñemos tu celebración ${svg('arrow')}</a></div></div></section><section class="section news-about patterned sprinkles" id="noticias"><div class="container"><div class="section-heading"><div><span class="eyebrow">NOTICIAS · GARDENIAS</span><h2>Ganamos el concurso de la torta del <em>cumpleaños de Ibagué.</em></h2><p>“Sinfonía de Ocobos” fue nuestra propuesta ganadora, creada para celebrar a la ciudad.</p></div></div><div class="award-layout"><div class="award-photo"><img src="assets/img/productos/premio_duo.webp" alt="Gardenias con el reconocimiento del concurso en Ibagué"></div><div class="award-copy"><span class="pill">UN LOGRO INOLVIDABLE</span><h3>Sinfonía de Ocobos</h3><p>Este reconocimiento nos llenó de alegría: el trabajo, las flores y cada pequeño detalle de la torta se convirtieron en una manera de rendir homenaje a Ibagué.</p><p>Gracias a quienes han confiado en Gardenias y nos han acompañado en este camino.</p><a href="${wa('Hola, Gardenias. Vi su reconocimiento en Sinfonía de Ocobos y quiero conocer sus diseños.')}" target="_blank" rel="noopener" class="underlink">Conoce nuestros diseños ↗</a></div></div><div class="news-gallery"><figure><img src="assets/img/productos/sinfonia_torta_principal.webp" alt="Torta Sinfonía de Ocobos" loading="lazy"><figcaption>La torta “Sinfonía de Ocobos”</figcaption></figure><figure><img src="assets/img/productos/noticia_evento_collage.webp" alt="Fotografías del reconocimiento" loading="lazy"><figcaption>Momentos de la premiación</figcaption></figure><figure><img src="assets/img/productos/nosotras_evento_duo.webp" alt="Stand de Gardenias" loading="lazy"><figcaption>Nuestro espacio en la celebración</figcaption></figure></div></div></section><section class="section"><div class="container video-card"><div class="video-copy"><span class="eyebrow">UNA HISTORIA EN MOVIMIENTO</span><h2>Un poquito más de <em>Gardenias.</em></h2><p>Texturas, flores, decoración y los detalles que hacen especial cada pedido.</p></div><div class="video-well"><video controls playsinline preload="metadata" poster="assets/img/productos/torta_flor_blanca_desktop.webp"><source src="assets/videos/proceso_decoracion_desktop.mp4" type="video/mp4"></video></div></div></section></main>${contactCta()}`}
function contactPage(){return `<section class="page-intro"><div class="container"><span class="eyebrow">ESTAMOS AQUÍ PARA TI</span><h1>Tu celebración empieza con un <em>mensaje.</em></h1><p>Cuéntanos tus ideas, envía referencias y coordinemos juntas tu pedido.</p></div></section><main class="container contact-layout"><div class="contact-card"><img src="assets/img/logos/flor-gardenias.png" alt=""/><h2>Hablemos de tu idea.</h2><p>Te atendemos exclusivamente por WhatsApp. Puedes enviarnos fotografías de referencia, consultar disponibilidad y recibir orientación para tu pedido.</p><a class="btn" href="${wa('Hola, Gardenias. Quiero información para hacer un pedido personalizado.')}" target="_blank" rel="noopener">Escribir al WhatsApp ${svg('arrow')}</a><p class="mini-note">No recibimos llamadas telefónicas en este número.</p></div><div class="contact-card" id="entregas"><span class="eyebrow">ANTES DE PEDIR</span><h2>Información para tu pedido</h2><div class="fact-row"><strong>Ciudad</strong><span>Ibagué</span></div><div class="fact-row"><strong>Reserva</strong><span>50 % de anticipo al confirmar</span></div><div class="fact-row"><strong>Disponibilidad</strong><span>Se confirma por WhatsApp</span></div><div class="fact-row"><strong>Recogida</strong><span>En tienda, coordinada contigo</span></div><div class="fact-row"><strong>Domicilios y entregas</strong><span>Consulta la modalidad para tu pedido</span></div><div class="fact-row"><strong>Medio de atención</strong><span>Solo mensajes por WhatsApp</span></div><p>¿No encuentras exactamente el producto que quieres? Podemos revisar tu idea y ayudarte a cotizarla.</p><a href="${wa('Hola, Gardenias. Quisiera consultar las condiciones de domicilio o entrega de un pedido.')}" target="_blank" rel="noopener" class="underlink">Consultar entregas ↗</a></div>
<div class="contact-card">
  <h2>Contacto directo con administración</h2>
  <p>¿Tienes alguna solicitud o documento que quieras compartir con nosotros?</p>
  <a class="btn" href="formulario.html">
    Contactar con administración
  </a>
</div>
</main>`}
function cartPage(){return `<section class="page-intro"><div class="container"><span class="eyebrow">TU CELEBRACIÓN EN UN SOLO LUGAR</span><h1>Mi solicitud de <em>cotización.</em></h1><p>Revisa tus diseños y envía los detalles para que confirmemos precios y disponibilidad.</p></div></section><main class="container cart-layout"><section><div id="cartList"></div><a class="underlink" href="catalogo.html">← Seguir explorando</a></section><aside class="cart-checkout"><h2>Antes de celebrar...</h2><p>El precio se confirma con Gardenias según el modelo y su decoración.</p><div class="quote-summary"><div><span>Valor total</span><strong>Por confirmar</strong></div><div><span>Anticipo</span><strong>50 % del valor confirmado</strong></div></div><form id="checkoutForm"><label>Nombre completo<input name="customerName" required minlength="2" placeholder="Tu nombre"></label><label>Número de WhatsApp<input type="tel" name="customerPhone" required placeholder="Tu número de contacto"></label><button class="btn full-btn" type="submit">Enviar solicitud por WhatsApp ↗</button></form></aside></main>`}
function renderPage(){const sections={index:homePage,creaciones:creationsPage,catalogo:catalogPage,personaliza:personalizePage,nosotros:aboutPage,contacto:contactPage,carrito:cartPage};$('#app').innerHTML=shell()+`<div id="mainContent">${(sections[page]||homePage)()}</div>`+footer();}
function setupHeader(){const header=$('#siteHeader'),root=$('#shopRoot'),trigger=$('#shopTrigger'),panel=$('#shopPanel');let closer;
 const setOpen=v=>{root.classList.toggle('expanded',!!v);trigger.setAttribute('aria-expanded',String(!!v))};
 const updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>27);window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
 const cancel=()=>{clearTimeout(closer)};
 root.addEventListener('pointerenter',()=>{cancel();if(matchMedia('(hover: hover)').matches)setOpen(true)});
 root.addEventListener('pointerleave',()=>{cancel();closer=setTimeout(()=>setOpen(false),220)});
 panel.addEventListener('pointerenter',cancel);
 trigger.addEventListener('click',e=>{e.stopPropagation();cancel();if(matchMedia('(hover: hover) and (min-width: 901px)').matches)setOpen(true);else setOpen(!root.classList.contains('expanded'))});
 root.addEventListener('focusin',()=>setOpen(true));
 document.addEventListener('click',e=>{if(!root.contains(e.target))setOpen(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);$('#mobilePanel').hidden=true;$('#searchForm').hidden=true;trigger.focus();setOpen(false)}});
 document.addEventListener('focusin',e=>{if(!root.contains(e.target)&&!header.contains(e.target))setOpen(false)});
 $$('[data-action="search"]').forEach(b=>b.addEventListener('click',()=>{const el=$('#searchForm');el.hidden=!el.hidden;$('#mobilePanel').hidden=true;if(!el.hidden)$('#siteSearch').focus()}));
 $('[data-action="mobile"]').addEventListener('click',e=>{const el=$('#mobilePanel');el.hidden=!el.hidden;e.currentTarget.setAttribute('aria-expanded',String(!el.hidden));$('#searchForm').hidden=true});
 $('#searchForm').addEventListener('submit',e=>{e.preventDefault();location.href='catalogo.html?buscar='+encodeURIComponent($('#siteSearch').value.trim())});
}
function setupHero(){const wrap=$('#heroMedia');if(!wrap)return;const dots=$$('#heroDots button');const slides=$$('.hero-slide',wrap);let paused=false;
 function show(i){heroIndex=(i+slides.length)%slides.length;slides.forEach((el,j)=>{const active=j===heroIndex;el.classList.toggle('active',active);el.setAttribute('aria-hidden',String(!active));const video=el.querySelector('video');if(video){if(active){video.currentTime=0;video.muted=true;video.play().catch(()=>{})}else video.pause()}});dots.forEach((el,j)=>{el.classList.toggle('on',j===heroIndex);el.setAttribute('aria-current',String(j===heroIndex))});schedule()}
 function schedule(){clearTimeout(heroTimer);if(paused||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;heroTimer=setTimeout(()=>show(heroIndex+1),G.hero[heroIndex].kind==='video'?7200:5500)};
 $$('[data-hero]').forEach(btn=>btn.addEventListener('click',()=>{const v=btn.dataset.hero;show(v==='prev'?heroIndex-1:v==='next'?heroIndex+1:Number(v))}));
 wrap.addEventListener('pointerenter',()=>{paused=true;clearTimeout(heroTimer)});wrap.addEventListener('pointerleave',()=>{paused=false;schedule()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(heroTimer);else schedule()});
 let start=0;wrap.addEventListener('touchstart',e=>{start=e.touches[0].clientX},{passive:true});wrap.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-start;if(Math.abs(delta)>48)show(heroIndex+(delta<0?1:-1))},{passive:true});schedule();
}
function setupSlider(){const track=$('#favoriteTrack');if(!track)return;$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{const w=track.querySelector('.product-card')?.getBoundingClientRect().width||280;track.scrollBy({left:(w+24)*(b.dataset.scroll==='left'?-1:1),behavior:'smooth'})}));}
function setupCatalog(){
 const grid=$('#catalogGrid');if(!grid)return;
 let category=params.get('categoria')||'todos',count=12;
 // Postres / Candy Bar agrupa las tres líneas: cuchareables, chunk cakes y postres especiales.
 const matches=p=>category==='todos'||(category==='candy'&&['cuchareables','chunk','postres','cupcakes','candy'].includes(p.category))||p.category===category||p.subcat===category;
 const render=()=>{
  const spotlight=$('#catalogCandySpotlight');if(spotlight)spotlight.hidden=category!=='candy';
  const items=G.products.filter(matches);
  if(!G.products.length){grid.innerHTML=`<div class="empty-catalog"><h2>No se cargaron las fotografías.</h2><p>${escaped(catalogLoadError)}</p></div>`;$('#catalogCount').textContent='';return;}
  grid.innerHTML=items.slice(0,count).map(productCard).join('')||`<div class="empty-catalog"><h2>Aún no tenemos fotografías en esta categoría.</h2><p>Pregúntanos por WhatsApp, estaremos felices de ayudarte.</p><a class="btn" href="${wa('Hola, Gardenias. Quiero consultar por esta categoría de productos.') }" target="_blank" rel="noopener">Consultar por WhatsApp ↗</a></div>`;
  $('#catalogCount').textContent=`${items.length} modelos · ${Math.min(count,items.length)} visibles`;
  $$('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter===category));
  const progress=$('#catalogProgress');
  progress.innerHTML=items.length>count?`<p>Mostrando ${count} de ${items.length} modelos</p><button type="button" id="moreModels" class="catalog-more">Ver más modelos ↓</button>`:'';
  $('#moreModels')?.addEventListener('click',()=>{count+=12;render()});
 };
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;count=12;history.replaceState(null,'',`catalogo.html?categoria=${encodeURIComponent(category)}`);render()}));render();
}
// Copiar la imagen real del diseño. Si el navegador lo impide, descargar la foto.
async function prepareDesignPng(url){
 const response=await fetch(url,{cache:'force-cache'});
 if(!response.ok)throw new Error('No se encontró la fotografía del diseño');
 const source=await response.blob();
 const bmp=await createImageBitmap(source);
 try{
  const canvas=document.createElement('canvas');
  const scale=Math.min(1,1200/Math.max(bmp.width,bmp.height));
  canvas.width=Math.max(1,Math.round(bmp.width*scale));
  canvas.height=Math.max(1,Math.round(bmp.height*scale));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('No se puede preparar la imagen');
  ctx.drawImage(bmp,0,0,canvas.width,canvas.height);
  return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Error al preparar la imagen')),'image/png'));
 }finally{bmp.close?.()}
}
function downloadDesignImage(p){
 const link=document.createElement('a');
 link.href=imagePath(p.img);
 link.download=`Gardenias-${p.id}.webp`;
 document.body.appendChild(link);link.click();link.remove();
}
function setupCustomizer(){
 const form=$('#customForm');if(!form)return;
 let photoPrepared=false;
 const status=$('#copyDesignStatus'),copyBtn=$('#copyDesignBtn');
 const markStatus=(message,isError=false)=>{status.textContent=message;status.dataset.error=String(isError)};
 copyBtn.addEventListener('click',async()=>{
  const p=byId($('#design').value);if(!p)return;
  const selectedId=p.id;
  copyBtn.disabled=true;markStatus('Preparando la fotografía...');
  try{
   if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem==='undefined')throw new Error('El navegador no permite copiar imágenes');
   // La escritura comienza directamente desde el clic: importante para los permisos del navegador.
   const imagePromise=prepareDesignPng(imagePath(p.img));
   await navigator.clipboard.write([new ClipboardItem({'image/png':imagePromise})]);
   if($('#design').value===selectedId){photoPrepared=true;markStatus('¡Imagen copiada! Al abrir WhatsApp, envía el resumen y pega la fotografía en el chat.');}
  }catch(err){
   if($('#design').value===selectedId){
    downloadDesignImage(p);
    photoPrepared=true;
    markStatus('Tu navegador no permitió copiarla. Descargamos la foto: adjúntala desde tu galería o archivos al abrir WhatsApp.');
   }
  }finally{copyBtn.disabled=false}
 });
 const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());$('#date').min=today.toISOString().slice(0,10);
 const update=()=>{
  const p=byId($('#design').value);if(!p)return;
  const isCake=['tortas','minis','mesario'].includes(p.category);
  $('#designImage').src=imagePath(p.img);$('#designImage').alt=`${p.name} de Gardenias`;
  $('#modelCode').textContent=`${p.name} · ${p.id}`;
  photoPrepared=false;
  markStatus('Primero copia la foto; luego completa el formulario y abre WhatsApp.');
  $('#cakeOptions').hidden=!isCake;
  $('#cakeSizes').hidden=!isCake;
  $('#otherProductOptions').hidden=isCake;
  const suggestedSize=({'torta-mini':'mini','mesario':'mini','pequena':'pequena','mediana':'mediana','grande':'grande','alta':'pequena'})[p.subcat]||'pequena';
  $('#size').value=suggestedSize;
  $('#cakeSizes').hidden=['mesario','minis'].includes(p.category);
 };
 $('#design').addEventListener('change',update);update();
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!photoPrepared){
   markStatus('Antes de continuar, presiona «Copiar imagen del diseño». Debes pegarla o adjuntarla en WhatsApp para identificar el modelo.',true);
   $('#copyDesignNotice').scrollIntoView({behavior:'smooth',block:'center'});
   copyBtn.focus({preventScroll:true});
   return;
  }
  const fd=new FormData(form),p=byId(fd.get('design'));if(!p)return;
  const isCake=['tortas','minis','mesario'].includes(p.category);
  const size=['mesario','minis'].includes(p.category)?'Mini':G.sizes.find(s=>s.id===fd.get('size'))?.label||'Por confirmar';
  const observations=String(fd.get('details')||'').trim();
  const message=[
   'Hola, Gardenias. Me interesa este diseño:',
   '',
   `*Diseño:* ${p.name} (${p.id})`,
   ...(isCake?[`*Tamaño:* ${size}`,`*Sabor:* ${fd.get('cakeFlavor')||'Por definir'}`,`*Relleno:* ${fd.get('filling')||'Por definir'}`]:[`*Sabor o preferencias:* ${fd.get('otherFlavor')||'Por definir'}`]),
   `*Fecha:* ${fd.get('date')}`,
   `*Cantidad:* ${fd.get('quantity')}`,
   ...(observations?[`*Observaciones:* ${observations}`]:[]),
   '',
   'Adjunto la fotografía del diseño para que puedan identificarlo.',
   '¿Me ayudan con la disponibilidad y la cotización, por favor?'
  ].join('\n');
  window.open(wa(message),'_blank','noopener,noreferrer');
 });
}
function setupCart(){const list=$('#cartList');if(!list)return;function render(){if(!cart.length){list.innerHTML=`<div class="empty-cart"><img src="assets/img/logos/flor-gardenias.png" alt=""><h2>Tu solicitud está vacía.</h2><p>Explora el catálogo para escoger una torta que te encante.</p><a class="btn" href="catalogo.html">Ver catálogo ↗</a></div>`;$('#checkoutForm').closest('.cart-checkout').style.display='none';return;}list.innerHTML=cart.map(x=>`<article class="cart-item"><img src="${imagePath(x.img)}" alt="${escaped(x.name)}"><div><h3>${escaped(x.name)}</h3><p>${escaped(G.sizes.find(s=>s.id===x.size)?.label||'')} · ${escaped(x.flavor)} · ${escaped(x.filling)}</p><p>Fecha solicitada: ${escaped(x.date)} · Cantidad: ${x.qty}</p><button type="button" data-remove="${x.id}">Quitar de la solicitud</button></div><strong>Por confirmar</strong></article>`).join('');$$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart=cart.filter(x=>x.id!==b.dataset.remove);storage.put('carrito',cart);updateCartBadge();render()}))};
 render();$('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const name=String(f.get('customerName')||'').trim(),phone=String(f.get('customerPhone')||'').trim();if(name.length<2||phone.length<7)return;let message=`Hola, Gardenias 🌸. Soy ${name} y quiero solicitar una cotización.\nMi WhatsApp: ${phone}\n\n`;
 cart.forEach((x,i)=>message+=`${i+1}. ${x.name}\nTamaño: ${G.sizes.find(s=>s.id===x.size)?.label||''}\nBizcocho: ${x.flavor}\nRelleno: ${x.filling}\nCantidad: ${x.qty}\nFecha deseada: ${x.date}\nObservaciones: ${x.details||'Ninguna'}\n\n`);
 message+='Entiendo que el precio, los detalles y la disponibilidad deben ser confirmados por Gardenias y que la reserva requiere un anticipo del 50 % del valor confirmado.';window.open(wa(message),'_blank','noopener,noreferrer')});}
function updateCartBadge(){$('#cartCounter').textContent=String(cart.length)}
async function init(){await loadRealCatalog();if(page==='carrito'){location.replace('catalogo.html');return;}renderPage();setupHeader();setupHero();setupSlider();setupCatalog();setupCustomizer();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* GARDENIAS — Keki interactivo */
(function () {
  function iniciarKeki() {
    if (document.getElementById("keki-widget")) return;

    const estilos = document.createElement("style");
    estilos.textContent = `
      #keki-widget {
        position: fixed;
        bottom: 18px;
        left: 18px;
        z-index: 1200;
        font-family: Montserrat, sans-serif;
      }

      .keki-button {
        display: block;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
      }

      .keki-button img {
        display: block;
        width: 95px;
        height: auto;
        animation: keki-flotar 3.5s ease-in-out infinite;
        filter: drop-shadow(0 6px 7px rgba(0,0,0,.18));
      }

      .keki-button.keki-salto {
        animation: keki-saltar .6s ease;
      }

      .keki-burbuja {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 10px;
        width: 245px;
        padding: 17px;
        background: #fffaf7;
        border: 2px solid #626543;
        border-radius: 20px;
        box-shadow: 0 12px 28px rgba(55,45,35,.2);
        color: #453d35;
        font-size: 13px;
        line-height: 1.6;
      }

      .keki-burbuja[hidden] {
        display: none !important;
      }

      .keki-burbuja strong {
        display: block;
        color: #626543;
        font-size: 15px;
        margin-bottom: 5px;
      }

      @keyframes keki-flotar {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-7px); }
      }

      @keyframes keki-saltar {
        0%, 100% { transform: translateY(0) rotate(0); }
        40% { transform: translateY(-20px) rotate(-8deg); }
        70% { transform: translateY(-5px) rotate(6deg); }
      }

      @media (max-width: 600px) {
        #keki-widget {
          bottom: 12px;
          left: 10px;
        }
        .keki-button img { width: 66px; }
        .keki-burbuja { width: 205px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .keki-button img,
        .keki-button.keki-salto {
          animation: none;
        }
      }
    `;
    document.head.appendChild(estilos);

    const widget = document.createElement("div");
    widget.id = "keki-widget";
    widget.innerHTML = `
      <div class="keki-burbuja" id="keki-saludo" hidden>
        <strong>¡Holaaa! Soy Keki &#128151;</strong>
        ¡Bienvenido a Gardenias!
        Qué alegría tenerte por aquí.
      </div>
      <button
        class="keki-button"
        type="button"
        aria-label="Saludar a Keki"
        aria-controls="keki-saludo"
        aria-expanded="false"
      >
        <img src="assets/img/logos/keki-gardenias-web.webp" alt="Keki">
      </button>
    `;

    document.body.appendChild(widget);

    const boton = widget.querySelector(".keki-button");
    const burbuja = widget.querySelector(".keki-burbuja");

    
const mensajesKeki = [
  `<strong>¡Holaaa! Soy Keki 💗</strong>
   Bienvenido a Gardenias. ¡Qué alegría tenerte por aquí!`,

  `<strong>¡Cada mes merece una celebración! 🎂</strong>
   ¿Ya conoces nuestras minis de mes? Son perfectas para celebrar a los más pequeños.`,

  `<strong>¡Hay algo dulce esperándote! 🌸</strong>
   Explora nuestro catálogo y encuentra tu diseño favorito.`,

  `<strong>¡Hagamos florecer tu idea! 💚</strong>
   Cuéntanos qué tienes en mente y te ayudamos por WhatsApp.`
];

let mensajeActual = 0;

boton.addEventListener("click", () => {
  const abrir = burbuja.hidden;

  if (abrir) {
    burbuja.innerHTML = mensajesKeki[mensajeActual];
    mensajeActual = (mensajeActual + 1) % mensajesKeki.length;
  }

  burbuja.hidden = !abrir;
  boton.setAttribute("aria-expanded", String(abrir));

  boton.classList.remove("keki-salto");
  void boton.offsetWidth;
  boton.classList.add("keki-salto");
});
    boton.addEventListener("animationend", () => {
      boton.classList.remove("keki-salto");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarKeki);
  } else {
    iniciarKeki();
  }
})();
