/* Gardenias: catálogo de referencia visual. Los precios no se inventan.
   Para habilitar cotizaciones numéricas, añadir precios aprobados POR DISEÑO Y TAMAÑO. */
window.GARDENIAS = {
  name:'Gardenias Pastelería', whatsapp:'573181172941', deposit:0.50,
  sizes:[{id:'mini',label:'Mini',servings:'2–3 porciones'},{id:'pequena',label:'Pequeña',servings:'8–10 porciones'},{id:'mediana',label:'Mediana',servings:'17–20 porciones'},{id:'grande',label:'Grande',servings:'30 porciones'}],
  cakes:['Vainilla','Chocolate','Red Velvet'],
  fillings:['Fresas con crema','Duraznos con crema','Doble chocolate','Queso crema','Arequipe','Frutos rojos','Cookies and cream'],
  hero:[
    {kind:'image',src:'pastelera_y_tortas_desktop.webp',mobile:'pastelera_y_tortas_movil.webp',alt:'Pastelera de Gardenias junto a tortas personalizadas'},
    {kind:'image',src:'torta_corazon_vintage_desktop.webp',mobile:'torta_corazon_vintage_movil.webp',alt:'Torta de corazón decorada en tonos rosados'},
    {kind:'video',src:'proceso_decoracion_desktop.mp4',mobile:'proceso_decoracion_movil.mp4',poster:'torta_flor_blanca_desktop.webp',alt:'Video de una torta floral de Gardenias'},
    {kind:'image',src:'torta_floral_amarilla_desktop.webp',mobile:'torta_floral_amarilla_movil.webp',alt:'Torta floral amarilla y lila'},
    {kind:'image',src:'pastelera_con_tortas_desktop.webp',mobile:'pastelera_con_tortas_movil.webp',alt:'Colección de tortas creadas por Gardenias'}
  ],
  products:[
    {id:'floral',name:'Torta floral',category:'tortas',tag:'Tortas personalizadas',desc:'Flores y detalles delicados para una celebración memorable.',img:'torta_floral_amarilla_desktop.webp',mobile:'torta_floral_amarilla_movil.webp'},
    {id:'corazon',name:'Torta corazón vintage',category:'tortas',tag:'Tortas personalizadas',desc:'Formas especiales y una decoración romántica.',img:'torta_corazon_vintage_desktop.webp',mobile:'torta_corazon_vintage_movil.webp'},
    {id:'blanca',name:'Torta con flor blanca',category:'tortas',tag:'Tortas personalizadas',desc:'Una propuesta de diseño artesanal, elegante y sutil.',img:'torta_flor_blanca_desktop.webp',mobile:'torta_flor_blanca_movil.webp'},
    {id:'mini_verde',name:'Mini torta verde',category:'minis',tag:'Mini tortas',desc:'Un detalle pequeño para una gran sonrisa.',img:'mini_torta_verde_desktop.webp',mobile:'mini_torta_verde_movil.webp'},
    {id:'mini_honguitos',name:'Mini torta temática',category:'minis',tag:'Mini tortas',desc:'Pequeña y totalmente llena de personalidad.',img:'mini_torta_honguitos_desktop.webp',mobile:'mini_torta_honguitos_movil.webp'},
    {id:'cupcakes_florales',name:'Cupcakes florales',category:'cupcakes',tag:'Cupcakes',desc:'Decoraciones suaves, creadas para compartir.',img:'cupcakes_florales_desktop.webp',mobile:'cupcakes_florales_movil.webp'},
    {id:'cupcakes_tematicos',name:'Cupcakes temáticos',category:'cupcakes',tag:'Cupcakes',desc:'Cupcakes con ideas y detalles que cuentan historias.',img:'cupcakes_tematicos_desktop.webp',mobile:'cupcakes_tematicos_movil.webp'},
    {id:'cuchareable_rv',name:'Cuchareable Red Velvet',category:'cuchareables',tag:'Cuchareables',desc:'Capas de bizcocho y crema, para disfrutar a cucharadas.',img:'cuchareable_red_velvet_desktop.webp',mobile:'cuchareable_red_velvet_movil.webp'},
    {id:'cuchareable_choco',name:'Cuchareable de chocolate',category:'cuchareables',tag:'Cuchareables',desc:'Chocolate en cada cucharada.',img:'cuchareable_chocolate_desktop.webp',mobile:'cuchareable_chocolate_movil.webp'},
    {id:'chunk_varios',name:'Chunk cakes',category:'chunk',tag:'Chunk cakes',desc:'Formatos para un antojo o una mesa dulce.',img:'chunkcakes_varios.webp',reference:true},
    {id:'chunk_oreo',name:'Chunk cake de chocolate',category:'chunk',tag:'Chunk cakes',desc:'Una idea de presentación para tu celebración.',img:'chunkcake_oreo.webp',reference:true},
    {id:'postres_frutos',name:'Postres de frutos rojos',category:'candy',tag:'Candy Bar',desc:'Vasitos elegantes para bodas y eventos.',img:'postre_frutos_rojos.webp',reference:true},
    {id:'mousse_choco',name:'Mousse de chocolate',category:'candy',tag:'Candy Bar',desc:'Postres en vasito para celebrar y compartir.',img:'mousse_chocolate_vasito.webp',reference:true},
    {id:'mini_cheese',name:'Cheesecake de frutos rojos',category:'candy',tag:'Candy Bar',desc:'Pequeños cheesecakes para mesas dulces especiales.',img:'mini_cheesecakes_frutos_rojos.webp',reference:true}
  ],
  favorites:['cuchareable_rv','cuchareable_choco','cupcakes_florales','mini_verde','mini_honguitos','floral','corazon','chunk_varios'],
  categories:[
    {id:'tortas',label:'Tortas personalizadas',desc:'Diseños para cada historia',img:'torta_corazon_vintage_desktop.webp'},
    {id:'minis',label:'Mini tortas',desc:'Pequeñas y especiales',img:'mini_torta_verde_desktop.webp'},
    {id:'cupcakes',label:'Cupcakes',desc:'Detalles para compartir',img:'cupcakes_florales_desktop.webp'},
    {id:'cuchareables',label:'Cuchareables',desc:'Dulces a cucharadas',img:'cuchareable_chocolate_desktop.webp'},
    {id:'chunk',label:'Chunk cakes',desc:'Capas llenas de sabor',img:'chunkcakes_varios.webp'},
    {id:'candy',label:'Postres / Candy Bar',desc:'Para bodas y eventos',img:'postre_frutos_rojos.webp'}
  ],
  events:[
    {img:'postre_frutos_rojos.webp',name:'Postres de frutos rojos',text:'Presentaciones individuales que decoran y endulzan mesas para bodas y eventos.'},
    {img:'mousse_chocolate_vasito.webp',name:'Mousse de chocolate',text:'Delicados vasitos para una celebración especial.'},
    {img:'mini_cheesecakes_frutos_rojos.webp',name:'Cheesecake de frutos rojos',text:'Formato mini para mesas dulces elegantes.'},
    {img:'chunkcakes_varios.webp',name:'Chunk cakes',text:'Postres para compartir y disfrutar.'}
  ],
  /* No agregar números aquí hasta confirmar precios por diseño, tamaño y decoración. */
  priceByDesign:{}
};
