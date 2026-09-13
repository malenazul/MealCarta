export interface SeedRecipe {
  title: string;
  original_name: string;
  country: string;
  country_code: string;
  city: string;
  lat: number;
  lng: number;
  story_history: string;
  cultural_notes: string;
  fun_facts: string;
  prep_time: number;
  cook_time: number;
  servings_base: number;
  difficulty: 'Fácil' | 'Media' | 'Experto';
  image_url: string;
  category: string;
  ingredients: {
    name: string;
    amount_base: number;
    unit: string;
    category: string;
  }[];
  instructions: string[];
  nutrition_facts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vit_a: number; // mcg
    vit_c: number; // mg
    vit_d: number; // mcg
    vit_b12: number; // mcg
    iron: number; // mg
    calcium: number; // mg
    potassium: number; // mg
    sodium: number; // mg
  };
}

export const SEED_RECIPES: SeedRecipe[] = [
  {
    title: 'Asado Tradicional y Chimichurri Campero',
    original_name: 'Asado Criollo Rioplatense',
    country: 'Argentina',
    country_code: 'AR',
    city: 'Buenos Aires',
    lat: -34.6037,
    lng: -58.3816,
    story_history: 'El asado no es meramente un método de cocción cárnica, sino el rito social por excelencia del Cono Sur. Surgido en las vastas llanuras pampeanas en el siglo XVIII con los gauchos nómadas, quienes faenaban ganado cimarrón y lo asaban a la estaca ("al asador") utilizando leña de quebracho o espinillo. Con la llegada de los frigoríficos y la urbanización en el siglo XX, el corte transversal de costilla ("tira de asado") y el vacío se consagraron como los reyes indiscutibles de las brasas familiares de los domingos.',
    cultural_notes: 'Existe una regla sagrada no escrita: jamás se apresura el fuego. El asador es el director de orquesta que controla la intensidad con brasas lentas para lograr un exterior caramelizado y un interior tierno y jugoso. El clásico aplauso para el asador sella el banquete.',
    fun_facts: '¿Sabías que el chimichurri tiene su origen etimológico disputado? La teoría popular más extendida lo atribuye a un inmigrante británico llamado Jimmy Curry, a quien los gauchos pedían su famosa salsa diciendo "dame el curry de Jimmy", derivando fonéticamente en chimichurri.',
    prep_time: 30,
    cook_time: 90,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Tira de asado de ternera', amount_base: 1200, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Vacío de novillo', amount_base: 800, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Sal gruesa parrillera', amount_base: 40, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Perejil fresco picado', amount_base: 50, unit: 'g', category: 'Verdulería' },
      { name: 'Orégano seco', amount_base: 15, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Ajo fresco triturado', amount_base: 4, unit: 'unidad', category: 'Verdulería' },
      { name: 'Ají molido suave', amount_base: 10, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Aceite de girasol u oliva', amount_base: 120, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Vinagre de vino tinto', amount_base: 50, unit: 'ml', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Encender el carbón o leña con suficiente anticipación hasta obtener brasas rojizas cubiertas de un velo ceniciento sin llama viva.',
      'Preparar el chimichurri emulsionando en un frasco el perejil, ajo, orégano, ají molido, sal gruesa disuelta en una cucharada de agua tibia, vinagre y aceite. Dejar reposar.',
      'Salar los cortes de carne con sal gruesa 15 minutos antes de llevar a la parrilla.',
      'Colocar la carne a fuego medio-bajo constante (debe poder aguantar la palma de la mano sobre la parrilla unos 8-9 segundos). Asar la tira primero del lado del hueso durante 50 minutos.',
      'Girar las piezas y dorar la otra cara durante 35-40 minutos hasta alcanzar el punto deseado.',
      'Cortar sobre tabla de madera rústica, salsear con chimichurri casero y servir de inmediato.'
    ],
    nutrition_facts: {
      calories: 680,
      protein: 52,
      carbs: 2,
      fat: 51,
      fiber: 1,
      vit_a: 42,
      vit_c: 12,
      vit_d: 0.6,
      vit_b12: 4.8,
      iron: 4.5,
      calcium: 38,
      potassium: 520,
      sodium: 680
    }
  },
  {
    title: 'Ceviche Clásico Limeño',
    original_name: 'Cebiche Tradicional del Callao',
    country: 'Perú',
    country_code: 'PE',
    city: 'Lima',
    lat: -12.0464,
    lng: -77.0428,
    story_history: 'Declarado Patrimonio Cultural de la Nación y Patrimonio Inmaterial de la Humanidad por la UNESCO. Su raíz prehispánica comenzó con la cultura Moche, quienes marinaban pescados frescos con jugo fermentado de tumbo. Con la llegada española se incorporó el limón sutil y la cebolla morada. En las últimas décadas, la influencia de la cocina Nikkei revolucionó el plato reduciendo el tiempo de macerado de horas a escasos minutos, preservando la frescura prístina del mar.',
    cultural_notes: 'El ceviche en Perú se degusta preferentemente al mediodía para aprovechar la frescura matutina de la pesca artesanal. El líquido restante, la emblemática "leche de tigre", es consumido en copa como reconstituyente y elixir afrodisíaco.',
    fun_facts: '¿Sabías que la palabra ceviche puede escribirse válidamente de cuatro formas reconocidas por la RAE: cebiche, ceviche, sebiche y seviche? El ácido del limón no "cocina" la carne en términos térmicos, sino que desnaturaliza las proteínas musculares del pescado provocando un cambio de color y textura similar al de la cocción.',
    prep_time: 20,
    cook_time: 0,
    servings_base: 4,
    difficulty: 'Fácil',
    image_url: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=1200&q=80',
    category: 'Entrada',
    ingredients: [
      { name: 'Filete fresco de corvina o lenguado', amount_base: 700, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Limones sutiles jugosos', amount_base: 12, unit: 'unidad', category: 'Verdulería' },
      { name: 'Cebolla morada cortada en pluma fina', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Ají limo finamente picado sin venas', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Cilantro fresco picado', amount_base: 20, unit: 'g', category: 'Verdulería' },
      { name: 'Camote dulce cocido en rodajas', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Choclo desgranado y cocido', amount_base: 1, unit: 'unidad', category: 'Verdulería' },
      { name: 'Sal marina fina', amount_base: 15, unit: 'g', category: 'Especias & Condimentos' }
    ],
    instructions: [
      'Cortar el pescado en dados uniformes de unos 2 cm de lado cuidando la cadena de frío manteniéndolo sobre un bol con hielo.',
      'Colocar el pescado en un recipiente frío, frotar con un toque de ají limo en los bordes y sazonar generosamente con sal marina fina.',
      'Exprimir los limones suavemente con la mano solo hasta la mitad para evitar que los aceites amargos de la cáscara contaminen el zumo.',
      'Verter el zumo sobre el pescado, mezclar con movimientos envolventes durante 60 segundos hasta que tome un tono blanco nacarado.',
      'Incorporar la cebolla morada lavada en agua helada, el ají limo y el cilantro picado.',
      'Servir al instante acompañado de rodajas de camote glaseado, choclo tierno y una copa de leche de tigre.'
    ],
    nutrition_facts: {
      calories: 220,
      protein: 34,
      carbs: 14,
      fat: 2.5,
      fiber: 2,
      vit_a: 180,
      vit_c: 45,
      vit_d: 2.1,
      vit_b12: 3.2,
      iron: 1.8,
      calcium: 45,
      potassium: 620,
      sodium: 480
    }
  },
  {
    title: 'Tacos al Pastor Tradicionales',
    original_name: 'Tacos de Trompo al Pastor',
    country: 'México',
    country_code: 'MX',
    city: 'Ciudad de México',
    lat: 19.4326,
    lng: -99.1332,
    story_history: 'Nacidos a mediados del siglo XX en el estado de Puebla con la llegada de inmigrantes libaneses que preparaban shawarma de cordero. Los taqueros mexicanos adaptaron la técnica del asador vertical ("trompo"), sustituyendo el cordero por lomo de cerdo marinado en una pasta celestial de achiote, chiles secos (guajillo y ancho), jugo de naranja agria y especias, coronando el trompo con una piña caramelizada que gotea sus jugos sobre la carne.',
    cultural_notes: 'La figura del taquero es casi circense: rebanar la carne finamente con un cuchillo veloz mientras vuela por el aire un trozo de piña que cae con precisión milimétrica dentro de la tortilla sostenida en la otra mano.',
    fun_facts: '¿Sabías que la enzima bromelina presente en la piña fresca actúa como ablandador natural rompiendo las fibras musculares de la carne de cerdo, volviéndola increíblemente suave y jugosa durante el marinado?',
    prep_time: 40,
    cook_time: 30,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Lomo o pierna de cerdo en filetes finos', amount_base: 800, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Pasta de achiote', amount_base: 60, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Chiles guajillo desvenados e hidratados', amount_base: 4, unit: 'unidad', category: 'Verdulería' },
      { name: 'Chiles ancho hidratados', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Jugo de naranja agria o naranja con limón', amount_base: 150, unit: 'ml', category: 'Frutas' },
      { name: 'Vinagre blanco', amount_base: 40, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Dientes de ajo', amount_base: 3, unit: 'unidad', category: 'Verdulería' },
      { name: 'Orégano mexicano y comino molido', amount_base: 8, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Piña madura en rebanadas', amount_base: 300, unit: 'g', category: 'Frutas' },
      { name: 'Tortillas de maíz nixtamalizado', amount_base: 16, unit: 'unidad', category: 'Almacén & Granos' },
      { name: 'Cebolla blanca y cilantro picados', amount_base: 100, unit: 'g', category: 'Verdulería' }
    ],
    instructions: [
      'Licuar el achiote con los chiles hidratados, jugo de naranja, vinagre, ajo, orégano, comino y 1 cucharadita de sal hasta lograr un adobo espeso y homogéneo.',
      'Untar cada filete de cerdo con el adobo asegurando que queden completamente cubiertos. Dejar marinar al menos 4 horas (idealmente toda la noche en frío).',
      'Asar las rebanadas de piña en comal caliente hasta que queden caramelizadas y ligeramente doradas. Picar finamente.',
      'En una plancha o sartén de hierro bien caliente con un toque de manteca o aceite, dorar los filetes de cerdo marinados hasta que los bordes queden crocantes y tostados.',
      'Picar la carne en trocitos pequeños en tabla de picar.',
      'Calentar las tortillas de maíz en el comal, rellenar con abundante carne al pastor, coronar con piña caramelizada, cebolla, cilantro fresco y salsa taquera al gusto.'
    ],
    nutrition_facts: {
      calories: 490,
      protein: 38,
      carbs: 42,
      fat: 18,
      fiber: 6,
      vit_a: 110,
      vit_c: 28,
      vit_d: 0.4,
      vit_b12: 1.6,
      iron: 3.2,
      calcium: 95,
      potassium: 580,
      sodium: 610
    }
  },
  {
    title: 'Tonkotsu Ramen Auténtico de Hakata',
    original_name: 'Hakata Tonkotsu Ramen (博多豚骨ラーメン)',
    country: 'Japón',
    country_code: 'JP',
    city: 'Fukuoka',
    lat: 33.5902,
    lng: 130.4017,
    story_history: 'Originario de la región de Hakata en Fukuoka, Kyushu, en la década de 1930. Los puestos callejeros ("yatai") buscaban un caldo nutritivo y denso para alimentar a los trabajadores del puerto y mercaderes. Hirviendo huesos de cerdo a fuego vivo durante horas ininterrumpidas, el colágeno y la médula ósea se emulsionan en agua, creando un caldo lechoso, blanco y aterciopelado que se ha convertido en objeto de culto gastronómico mundial.',
    cultural_notes: 'Sorber los fideos con fuerza ("slurping") es una señal de aprecio y una técnica sensorial práctica: introduce aire en el paladar para enfriar el bocado ardiente y volatilizar los aromas del caldo.',
    fun_facts: '¿Sabías que en Fukuoka los fideos tonkotsu se sirven tradicionalmente ultrafinos y firmes (al dente o "katame")? Como los fideos finos se ablandan rápido en el caldo hirviendo, se inventó el sistema "kaedama": pedir una segunda porción de fideos frescos para sumergirlos en el caldo restante.',
    prep_time: 40,
    cook_time: 240,
    servings_base: 4,
    difficulty: 'Experto',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    category: 'Sopa/Guiso',
    ingredients: [
      { name: 'Huesos de caña de cerdo y manitas troceadas', amount_base: 1500, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Panceta de cerdo para chashu', amount_base: 500, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Fideos frescos para ramen alcalinos', amount_base: 400, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Jengibre fresco en láminas', amount_base: 40, unit: 'g', category: 'Verdulería' },
      { name: 'Cebolleta japonesa (negi) o puerro', amount_base: 3, unit: 'unidad', category: 'Verdulería' },
      { name: 'Salsa de soja japonesa (shoyu)', amount_base: 100, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Mirin (vino de arroz dulce)', amount_base: 60, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Alga kombu seca', amount_base: 15, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Huevos de corral para ajitsuke tamago', amount_base: 4, unit: 'unidad', category: 'Lácteos' },
      { name: 'Aceite de sésamo tostado y ajo negro', amount_base: 30, unit: 'ml', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Blanquear los huesos de cerdo en agua hirviendo durante 10 minutos para purgar impurezas; enjuagar con agua fría y raspar restos oscuros con esmero.',
      'Colocar los huesos limpios en una olla grande con agua fresca, jengibre y cebolleta. Mantener un hervor borbotónico vigoroso durante al menos 4 a 6 horas, reponiendo agua, hasta que el caldo adquiera su emulsión blanca y consistencia densa.',
      'Elaborar el chashu: atar la panceta, dorarla y cocinarla a fuego lento en shoyu, mirin y un toque de azúcar hasta que esté tierna. Reservar el líquido para el "tare" (base de sazón).',
      'Cocinar los huevos en agua hirviendo durante exactamente 6 minutos y medio; enfriar en agua con hielo, pelar y marinar en la mezcla de shoyu y mirin.',
      'Cocer los fideos en agua hirviendo solo 45-60 segundos para dejarlos firmes.',
      'Armar el cuenco: colocar en la base 30 ml de tare de shoyu, verter el caldo tonkotsu hirviendo y batir para integrar. Disponer los fideos, coronar con láminas de chashu, medio huevo marinado, negi picado y un toque de aceite de sésamo.'
    ],
    nutrition_facts: {
      calories: 740,
      protein: 46,
      carbs: 62,
      fat: 36,
      fiber: 3,
      vit_a: 95,
      vit_c: 4,
      vit_d: 1.2,
      vit_b12: 2.8,
      iron: 4.1,
      calcium: 72,
      potassium: 690,
      sodium: 980
    }
  },
  {
    title: 'Pizza Margherita Auténtica Napolitana',
    original_name: 'Pizza Margherita Tradizionale S.T.G.',
    country: 'Italia',
    country_code: 'IT',
    city: 'Nápoles',
    lat: 40.8518,
    lng: 14.2681,
    story_history: 'En junio de 1889, el maestro pizzaiolo Raffaele Esposito de la Pizzería Brandi en Nápoles fue convocado al Palacio Real de Capodimonte para cocinar para la reina Margarita de Saboya. Creó una pizza patriótica con los colores de la bandera italiana recién unificada: rojo del tomate San Marzano, blanco de la mozzarella fior di latte y verde de la albahaca fresca. Declarada por la UNESCO Patrimonio Cultural Inmaterial de la Humanidad.',
    cultural_notes: 'La verdadera pizza napolitana se rige por un estricto decálogo: masa fermentada de 24 a 48 horas sin grasas añadidas, estirada a mano ("a schiaffo") sin tocar el rodillo para preservar las burbujas de aire en el borde ("cornicione"), y horneada a 450°C durante solo 60-90 segundos.',
    fun_facts: '¿Sabías que antes del siglo XVIII los italianos consideraban el tomate una planta venenosa y ornamental? Fue la plebe napolitana la que comenzó a ponerlo sobre el pan plano plano campesino, creando así la revolución de la pizza moderna.',
    prep_time: 45,
    cook_time: 15,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Harina de trigo de fuerza Tipo 00', amount_base: 500, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Agua mineral a temperatura ambiente', amount_base: 320, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Levadura fresca de panadero', amount_base: 2, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Sal marina fina', amount_base: 12, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Tomates pelados San Marzano D.O.P.', amount_base: 400, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Mozzarella di bufala o fior di latte', amount_base: 300, unit: 'g', category: 'Lácteos' },
      { name: 'Hojas de albahaca fresca', amount_base: 15, unit: 'unidad', category: 'Verdulería' },
      { name: 'Aceite de oliva virgen extra', amount_base: 30, unit: 'ml', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Disolver la levadura en el agua y agregar gradualmente la harina tamizada con la sal. Amasar durante 15 minutos hasta lograr una masa lisa, elástica y suave.',
      'Dejar levar en bloque 2 horas, formar 4 bollos de unos 210 g cada uno y dejar madurar en frío durante 24 horas para un sabor y digestibilidad sublimes.',
      'Triturar los tomates San Marzano a mano con una pizca de sal, sin cocinar.',
      'Precalentar el horno al máximo posible con piedra refractaria o sartén de hierro fundido.',
      'Extender el bollo empujando el aire desde el centro hacia los bordes para inflar el cornicione.',
      'Distribuir el tomate, la mozzarella cortada en tiras y escurrida, un chorrito de aceite de oliva y hojas de albahaca.',
      'Hornear hasta que el borde esté hinchado, aireado y con pintas oscuras características ("makulet"), unos minutos según el horno.'
    ],
    nutrition_facts: {
      calories: 540,
      protein: 22,
      carbs: 76,
      fat: 16,
      fiber: 4,
      vit_a: 140,
      vit_c: 18,
      vit_d: 0.2,
      vit_b12: 0.9,
      iron: 2.8,
      calcium: 210,
      potassium: 340,
      sodium: 720
    }
  },
  {
    title: 'Paella Valenciana Tradicional de la Huerta',
    original_name: 'Auténtica Paella Valenciana',
    country: 'España',
    country_code: 'ES',
    city: 'Valencia',
    lat: 39.4699,
    lng: -0.3763,
    story_history: 'La cuna de la paella es el humedal de la Albufera de Valencia, donde los campesinos de los siglos XVIII y XIX cocinaban el arroz de sus campos al aire libre con lo que la tierra y los corrales ofrecían: pollo de granja, conejo de campo, judías autóctonas (ferraura y garrofó), azafrán en hebra y ramas de naranjo para el fuego.',
    cultural_notes: 'En Valencia, la paella es un ritual comunitario: se come directamente del recipiente metálico ("el caldero paella") con cuchara de madera, respetando el turno y el sector de cada comensal.',
    fun_facts: '¿Sabías que el codiciado "socarrat" no es arroz quemado, sino la caramelización perfecta de los almidones y grasas en el fondo del caldero, lograda con un golpe final de fuego vivo que produce un crepitar inconfundible?',
    prep_time: 30,
    cook_time: 50,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Arroz bomba o Senia de Valencia', amount_base: 400, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Pollo de campo troceado', amount_base: 500, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Conejo de campo troceado', amount_base: 400, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Bajoqueta o judía verde plana', amount_base: 200, unit: 'g', category: 'Verdulería' },
      { name: 'Garrofó valenciano (alubia gigante)', amount_base: 100, unit: 'g', category: 'Verdulería' },
      { name: 'Tomate maduro rallado', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Azafrán en hebras de primera calidad', amount_base: 0.5, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Pimentón dulce de la Vera', amount_base: 8, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Rama de romero fresco', amount_base: 1, unit: 'unidad', category: 'Verdulería' },
      { name: 'Aceite de oliva virgen extra', amount_base: 80, unit: 'ml', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Nivelar la paella sobre el fuego, añadir el aceite con sal alrededor del perímetro y dorar la carne de pollo y conejo a fuego medio hasta que quede bien sellada y tostada.',
      'Apartar la carne hacia los bordes y en el centro sofreír las judías verdes y el garrofó.',
      'Añadir el tomate rallado y sofreír hasta que pierda el agua; agregar el pimentón dulce e inmediatamente verter agua hasta los remaches de las asas para evitar que se queme.',
      'Cocinar el caldo durante 20 minutos para que absorba la esencia de la carne y las verduras; infusionar el azafrán tostado.',
      'Agregar el arroz repartiéndolo en diagonal formando una cruz ("caballón") y luego distribuirlo uniformemente por toda la superficie. A partir de este momento, ¡no se vuelve a remover el arroz jamás!',
      'Cocer 8 minutos a fuego vivo y 10 minutos a fuego suave. Colocar una ramita de romero los últimos 5 minutos. Dar un minuto final de fuego fuerte para lograr el crujiente socarrat.'
    ],
    nutrition_facts: {
      calories: 590,
      protein: 42,
      carbs: 68,
      fat: 16,
      fiber: 5,
      vit_a: 85,
      vit_c: 22,
      vit_d: 0.3,
      vit_b12: 1.4,
      iron: 3.8,
      calcium: 58,
      potassium: 640,
      sodium: 590
    }
  },
  {
    title: 'Pad Thai Kung Boran Tradicional',
    original_name: 'Phat Thai Kung Sot (ผัดไทยกุ้งสด)',
    country: 'Tailandia',
    country_code: 'TH',
    city: 'Bangkok',
    lat: 13.7563,
    lng: 100.5018,
    story_history: 'A finales de la década de 1930, el primer ministro Plaek Phibunsongkhram promovió el Pad Thai como símbolo de modernización e identidad nacional ante la escasez de arroz ocasionada por la Segunda Guerra Mundial, incentivando el consumo de fideos de arroz en lugar del grano entero y consolidando un equilibrio perfecto entre los cinco sabores esenciales tailandeses: dulce, salado, ácido, picante y umami.',
    cultural_notes: 'El Pad Thai original se sirve con una rodaja de lima fresca, cacahuates tostados triturados, copos de chile seco (prik pon) y azúcar de palma al costado del plato para que cada comensal ajuste el balance exacto a su paladar.',
    fun_facts: '¿Sabías que el ingrediente insustituible que define el sabor ácido del Pad Thai no es el limón ni el vinagre, sino la pulpa natural de tamarindo maduro disuelta en agua tibia?',
    prep_time: 25,
    cook_time: 15,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Fideos de arroz planos tailandeses', amount_base: 300, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Langostinos o camarones frescos limpios', amount_base: 400, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Tofu firme prensado en cubitos', amount_base: 150, unit: 'g', category: 'Lácteos' },
      { name: 'Huevos batidos', amount_base: 2, unit: 'unidad', category: 'Lácteos' },
      { name: 'Pasta de tamarindo natural concentrada', amount_base: 45, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Salsa de pescado tailandesa (Nam Pla)', amount_base: 40, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Azúcar de palma o moreno', amount_base: 35, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Brotes de soja frescos', amount_base: 150, unit: 'g', category: 'Verdulería' },
      { name: 'Cebollino chino o ajo verde cortado', amount_base: 60, unit: 'g', category: 'Verdulería' },
      { name: 'Cacahuates tostados triturados', amount_base: 50, unit: 'g', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Remojar los fideos de arroz en agua a temperatura ambiente durante 45 minutos hasta que estén flexibles pero firmes al morder.',
      'Preparar la salsa Pad Thai mezclando la pulpa de tamarindo, salsa de pescado y azúcar de palma en un cazo pequeño a fuego bajo hasta disolver.',
      'En un wok muy caliente con aceite vegetal, saltear los langostinos durante 2 minutos hasta que cambien de color y retirar.',
      'En el mismo wok dorar el tofu firme. Añadir los fideos remojados y verter la salsa de tamarindo, salteando enérgicamente hasta que los fideos absorban el líquido y se vuelvan traslúcidos.',
      'Empujar los fideos a un lateral del wok, cascar los huevos en el espacio libre, remover para cuajar y mezclar con los fideos.',
      'Incorporar los langostinos, los brotes de soja y el cebollino chino durante 30 segundos. Servir de inmediato con cacahuates tostados y rodajas de lima fresca.'
    ],
    nutrition_facts: {
      calories: 460,
      protein: 28,
      carbs: 58,
      fat: 14,
      fiber: 4,
      vit_a: 65,
      vit_c: 24,
      vit_d: 0.8,
      vit_b12: 1.5,
      iron: 3.1,
      calcium: 120,
      potassium: 410,
      sodium: 790
    }
  },
  {
    title: 'Tagine de Cordero con Ciruelas y Almendras',
    original_name: 'Tajine Mrouzia de Marrakech',
    country: 'Marruecos',
    country_code: 'MA',
    city: 'Marrakech',
    lat: 31.6295,
    lng: -7.9811,
    story_history: 'La cocina bereber milenaria perfeccionó el recipiente cónico de barro cocido ("tajín"), diseñado para cocinar alimentos en climas desérticos utilizando una cantidad mínima de agua. El vapor condensado asciende por la chimenea cónica, se enfría y desciende continuamente en forma de rocío sobre los alimentos, macerando cortes duros de carne con la prodigiosa mezcla de especias "Ras el Hanout", miel silvestre y frutos secos.',
    cultural_notes: 'En los hogares marroquíes, el tajín preside la mesa baja familiar sobre esteras bordadas. Se acompaña de pan plano tradicional "khobz", el cual se utiliza con la mano derecha como cuchara comestible.',
    fun_facts: '¿Sabías que "Ras el Hanout" se traduce literalmente del árabe como "la cabeza de la tienda", haciendo referencia a la mezcla más fina y exclusiva que el boticario o mercader de especias reserva en su mostrador, pudiendo contener hasta 30 botánicos distintos?',
    prep_time: 30,
    cook_time: 110,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Paletilla o pierna de cordero troceada', amount_base: 900, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Ciruelas pasas negras sin hueso', amount_base: 200, unit: 'g', category: 'Frutas' },
      { name: 'Almendras enteras peladas y fritas', amount_base: 80, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Cebollas dulces finamente picadas', amount_base: 3, unit: 'unidad', category: 'Verdulería' },
      { name: 'Mezcla Ras el Hanout marroquí', amount_base: 15, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Canela en rama y molida', amount_base: 6, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Jengibre molido y cúrcuma', amount_base: 8, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Miel de flores natural', amount_base: 40, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Aceite de oliva virgen', amount_base: 50, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Semillas de sésamo tostadas', amount_base: 15, unit: 'g', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Marinar los trozos de cordero en un bol con el aceite de oliva, Ras el Hanout, jengibre, cúrcuma, sal y un chorrito de agua para que las especias penetren.',
      'En la base del tajín o cazuela pesada de hierro, dorar la carne con las cebollas picadas a fuego suave.',
      'Añadir la rama de canela y agua tibia apenas hasta cubrir la base de la carne. Tapar y dejar cocer a fuego lentísimo durante 1 hora y media hasta que la carne se despegue del hueso.',
      'En un cazo aparte, pochar las ciruelas pasas con un poco del caldo del cordero, la canela molida y la miel hasta que queden glaseadas y brillantes.',
      'Disponer las ciruelas glaseadas sobre el cordero, salsear con el jugo reducido y espesar 10 minutos más.',
      'Decorar antes de servir con las almendras fritas crujientes y una lluvia de sésamo dorado.'
    ],
    nutrition_facts: {
      calories: 630,
      protein: 48,
      carbs: 45,
      fat: 32,
      fiber: 6,
      vit_a: 70,
      vit_c: 8,
      vit_d: 0.5,
      vit_b12: 3.5,
      iron: 4.8,
      calcium: 85,
      potassium: 760,
      sodium: 490
    }
  },
  {
    title: 'Ratatouille Tradicional Niçoise',
    original_name: 'Ratatouille Provençale au Four',
    country: 'Francia',
    country_code: 'FR',
    city: 'Niza / París',
    lat: 43.7102,
    lng: 7.2620,
    story_history: 'Originaria de la región de Provenza y de la campiña de Niza en el siglo XVIII. Nació como un guiso humilde de agricultores que celebraba la abundancia de las cosechas veraniegas del sur de Francia: calabacines, berenjenas, tomates y pimientos perfumados con hierbas provenzales y aceite de oliva. Su nombre proviene de la voz occitana "ratatolha" (revolver o mezclar comida).',
    cultural_notes: 'Aunque popularizada globalmente en su versión con láminas concéntricas (estilo Confit Byaldi), la versión tradicional campestre guisa cada verdura de forma escalonada para que cada una conserve su textura y personalidad propia.',
    fun_facts: '¿Sabías que para lograr un ratatouille perfecto las berenjenas deben desamargarse previamente con sal para extraer el exceso de agua y evitar que absorban demasiado aceite durante la cocción?',
    prep_time: 30,
    cook_time: 45,
    servings_base: 4,
    difficulty: 'Fácil',
    image_url: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Berenjenas firmes medianas', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Calabacines verdes medianos', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Pimientos rojos y amarillos', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Tomates maduros tipo pera', amount_base: 4, unit: 'unidad', category: 'Verdulería' },
      { name: 'Cebollas dulces', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Dientes de ajo laminados', amount_base: 4, unit: 'unidad', category: 'Verdulería' },
      { name: 'Hierbas de Provenza (tomillo, romero, mejorana)', amount_base: 15, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Aceite de oliva virgen extra', amount_base: 60, unit: 'ml', category: 'Almacén & Granos' }
    ],
    instructions: [
      'Cortar las berenjenas y calabacines en rodajas finas uniformes de 3 milímetros.',
      'Elaborar una base aromática ("piperade"): sofreír la cebolla picada con los pimientos cortados finos, ajo y tomate triturado con hierbas hasta que quede dulce y meloso.',
      'Disponer la salsa piperade en el fondo de una fuente para horno redonda u ovalada.',
      'Colocar alternadamente las rodajas de berenjena, calabacín y tomate en espiral concéntrica desde el exterior hacia el centro.',
      'Rociar con hilo generoso de aceite de oliva, tomillo fresco, sal marina y pimienta negra molida.',
      'Cubrir con papel vegetal y hornear a 180°C durante 35 minutos; retirar el papel y hornear 10 minutos más para dorar suavemente las puntas.'
    ],
    nutrition_facts: {
      calories: 180,
      protein: 4,
      carbs: 18,
      fat: 12,
      fiber: 7,
      vit_a: 160,
      vit_c: 65,
      vit_d: 0,
      vit_b12: 0,
      iron: 1.4,
      calcium: 55,
      potassium: 540,
      sodium: 190
    }
  },
  {
    title: 'Murgh Makhani (Butter Chicken) del Punjab',
    original_name: 'Classic Butter Chicken Delhi',
    country: 'India',
    country_code: 'IN',
    city: 'Nueva Delhi',
    lat: 28.6139,
    lng: 77.2090,
    story_history: 'Creado en la década de 1950 en el legendario restaurante Moti Mahal de Daryaganj, Delhi, por Kundan Lal Gujral. Para evitar desperdiciar las piezas de pollo cocinadas en el horno tandoor que se resecaban al final del día, los cocineros idearon sumergirlas en una salsa aterciopelada y suntuosa a base de tomates maduros, mantequilla clarificada (ghee), nata espesa y aromáticas como el fenogreco tostado (kasuri methi).',
    cultural_notes: 'El plato representa la apoteosis de la cocina mogol fusionada con la hospitalidad punjabi. Tradicionalmente se come con pan naan esponjoso o arroz basmati perfumado con cardamomo y comino entero.',
    fun_facts: '¿Sabías que el secreto inconfundible que diferencia al auténtico Butter Chicken de cualquier otro curry de tomate es el "Kasuri Methi" (hojas secas de fenogreco), frotadas entre las palmas de las manos justo antes de servir?',
    prep_time: 35,
    cook_time: 40,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Pechuga o contramuslos de pollo en trozos', amount_base: 800, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Yogur natural griego', amount_base: 150, unit: 'g', category: 'Lácteos' },
      { name: 'Mantequilla o Ghee indio', amount_base: 60, unit: 'g', category: 'Lácteos' },
      { name: 'Puré de tomate concentrado natural', amount_base: 400, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Nata espesa o crema de leche', amount_base: 120, unit: 'ml', category: 'Lácteos' },
      { name: 'Garam masala y cardamomo molido', amount_base: 12, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Jengibre fresco rallado y pasta de ajo', amount_base: 30, unit: 'g', category: 'Verdulería' },
      { name: 'Chile de Cachemira en polvo', amount_base: 10, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Hojas secas de fenogreco (Kasuri Methi)', amount_base: 5, unit: 'g', category: 'Especias & Condimentos' }
    ],
    instructions: [
      'Marinar el pollo con el yogur, pasta de jengibre y ajo, chile de Cachemira, garam masala y sal durante 2 horas.',
      'Asar el pollo en sartén muy caliente o bajo el grill del horno hasta obtener marcas de tostado ahumado.',
      'En una cacerola, derretir la mitad de la mantequilla, añadir los tomates triturados con las especias y cocinar hasta que la salsa reduzca y el aceite comience a separarse.',
      'Triturar la salsa para obtener una textura perfectamente sedosa.',
      'Incorporar el pollo asado a la salsa, verter la nata espesa y el resto de la mantequilla, cocinando a fuego lento durante 10 minutos.',
      'Finalizar espolvoreando hojas de fenogreco frotadas y servir caliente con pan naan o arroz basmati.'
    ],
    nutrition_facts: {
      calories: 580,
      protein: 44,
      carbs: 16,
      fat: 38,
      fiber: 3,
      vit_a: 110,
      vit_c: 16,
      vit_d: 0.7,
      vit_b12: 1.8,
      iron: 2.9,
      calcium: 130,
      potassium: 590,
      sodium: 620
    }
  },
  {
    title: 'Feijoada Completa Tradicional Carioca',
    original_name: 'Feijoada Tradicional Brasileira',
    country: 'Brasil',
    country_code: 'BR',
    city: 'Río de Janeiro',
    lat: -22.9068,
    lng: -43.1729,
    story_history: 'Considerado el plato nacional de Brasil. Aunque una leyenda romántica afirmaba que fue creada por esclavos con las sobras de los señores coloniales, historiadores gastronómicos han documentado que es una sublime evolución luso-brasileña inspirada en los cocidos del norte de Portugal y de la cuenca mediterránea, combinados con los frijoles negros autóctonos americanos ("feijão preto"), embutidos curados y tocineta ahumada.',
    cultural_notes: 'La feijoada es la comida festiva de los sábados en Río de Janeiro, acompañada invariablemente de música samba, caipirinhas, arroz blanco, rodajas de naranja fresca (para cortar la grasa), col rizada salteada ("couve a mineira") y harina de mandioca tostada ("farofa").',
    fun_facts: '¿Sabías que las rodajas de naranja que acompañan la feijoada no son mero adorno? El ácido cítrico y la vitamina C de la naranja no solo refrescan el paladar, sino que facilitan químicamente la absorción del hierro vegetal de los frijoles negros.',
    prep_time: 40,
    cook_time: 150,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1200&q=80',
    category: 'Sopa/Guiso',
    ingredients: [
      { name: 'Frijoles negros secos (feijão preto)', amount_base: 500, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Costillas de cerdo ahumadas', amount_base: 400, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Carne seca salada (carne de sol o cecina)', amount_base: 300, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Chorizo tipo calabresa o ahumado', amount_base: 250, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Tocineta o panceta ahumada', amount_base: 150, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Hojas de laurel seco', amount_base: 3, unit: 'unidad', category: 'Especias & Condimentos' },
      { name: 'Dientes de ajo machacados', amount_base: 6, unit: 'unidad', category: 'Verdulería' },
      { name: 'Cebolla picada', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Naranjas en rodajas para servir', amount_base: 2, unit: 'unidad', category: 'Frutas' }
    ],
    instructions: [
      'Desalar las carnes saladas sumergiéndolas en agua fría durante 12 horas en nevera, cambiando el agua varias veces.',
      'Poner los frijoles negros en remojo previo durante 8 horas.',
      'Cocinar los frijoles con las hojas de laurel y las carnes más duras en una olla grande con agua abundante.',
      'Añadir las costillas ahumadas, el chorizo en rodajas y la tocineta a media cocción; mantener hervor suave hasta que los frijoles estén mantecosos y la carne tierna.',
      'Para espesar el caldo: aplastar dos cazos de frijoles con tenedor en una sartén con sofrito de abundante ajo y cebolla; reincorporar a la olla principal.',
      'Servir en cazuela de barro humeante con farofa, arroz blanco, col salteada y rodajas de naranja fresca.'
    ],
    nutrition_facts: {
      calories: 690,
      protein: 50,
      carbs: 48,
      fat: 35,
      fiber: 14,
      vit_a: 40,
      vit_c: 26,
      vit_d: 0.6,
      vit_b12: 2.1,
      iron: 6.8,
      calcium: 110,
      potassium: 920,
      sodium: 840
    }
  },
  {
    title: 'Moussaka Tradicional Griega',
    original_name: 'Mousakas Tradizionale Athina (Μουσακάς)',
    country: 'Grecia',
    country_code: 'GR',
    city: 'Atenas',
    lat: 37.9838,
    lng: 23.7275,
    story_history: 'Aunque con antecedentes en los pasteles de carne levantinos y otomanos, la moussaka griega moderna fue refinada en la década de 1920 por el chef Nikolaos Tselementes, formado en Viena y París, quien introdujo la opulenta capa superior de salsa bechamel enriquecida con huevo y queso Kefalotyri, creando el clásico plato horneado por capas que define a la gastronomía helena.',
    cultural_notes: 'La moussaka es el plato principal por excelencia de las tabernas de Atenas e islas del Egeo durante festividades y reuniones familiares de verano.',
    fun_facts: '¿Sabías que la moussaka nunca debe cortarse recién salida del horno? Es fundamental dejarla reposar entre 20 y 30 minutos para que la bechamel y los jugos se asienten y las porciones salgan perfectas y cuadradas.',
    prep_time: 40,
    cook_time: 60,
    servings_base: 4,
    difficulty: 'Media',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Berenjenas grandes en rodajas', amount_base: 3, unit: 'unidad', category: 'Verdulería' },
      { name: 'Carne picada de cordero o ternera', amount_base: 600, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Patatas medianas en rodajas finas', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Cebolla finamente picada', amount_base: 1, unit: 'unidad', category: 'Verdulería' },
      { name: 'Tomates triturados', amount_base: 300, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Canela molida y nuez moscada', amount_base: 5, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Mantequilla para la bechamel', amount_base: 50, unit: 'g', category: 'Lácteos' },
      { name: 'Harina de trigo común', amount_base: 50, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Leche entera', amount_base: 500, unit: 'ml', category: 'Lácteos' },
      { name: 'Queso rallado curado (Kefalotyri o Parmesano)', amount_base: 80, unit: 'g', category: 'Lácteos' },
      { name: 'Yema de huevo', amount_base: 1, unit: 'unidad', category: 'Lácteos' }
    ],
    instructions: [
      'Saltear o asar las rodajas de patata y berenjena pinceladas con aceite de oliva hasta que estén tiernas y doradas.',
      'Cocinar la carne picada con la cebolla, el tomate triturado, canela, nuez moscada, sal y pimienta a fuego suave hasta que espese y no quede líquido suelto.',
      'Elaborar la bechamel: derretir la mantequilla, tostar la harina un minuto y verter la leche tibia batiendo sin grumos. Fuera del fuego, añadir la yema de huevo y la mitad del queso rallado.',
      'Montar en fuente de horno: una capa base de patatas, una capa de berenjenas, la salsa de carne especiada, otra capa de berenjenas y cubrir con la bechamel espesa.',
      'Espolvorear con el resto del queso y hornear a 190°C durante 45 minutos hasta que la superficie esté dorada y gratinada.',
      'Dejar reposar 25 minutos antes de cortar y servir.'
    ],
    nutrition_facts: {
      calories: 560,
      protein: 36,
      carbs: 34,
      fat: 32,
      fiber: 6,
      vit_a: 120,
      vit_c: 19,
      vit_d: 0.5,
      vit_b12: 1.9,
      iron: 3.5,
      calcium: 220,
      potassium: 680,
      sodium: 570
    }
  },
  {
    title: 'Arepas Reina Pepiada Tradicional',
    original_name: 'Reina Pepiada de Caracas',
    country: 'Venezuela',
    country_code: 'VE',
    city: 'Caracas',
    lat: 10.4806,
    lng: -66.9036,
    story_history: 'Creada en Caracas en 1955 por los hermanos Álvarez en su famosa arepera "Los Hermanos Álvarez". Fue nombrada en homenaje a Susana Duijm, quien acababa de ser coronada como la primera Miss Mundo hispanoamericana ese mismo año. Para honrar a su "Reina", crearon una mezcla exquisita de pechuga de pollo desmechada con aguacate maduro, mayonesa casera, cebolla y cilantro ("pepiada" significaba de curvas o figura hermosa en el argot popular de la época).',
    cultural_notes: 'La arepa es el alma culinaria de Venezuela: un disco de masa de maíz precocido tostado por fuera y suave por dentro, que se abre como un libro y se rellena sin timidez con guisos copiosos.',
    fun_facts: '¿Sabías que la propia Susana Duijm visitó la arepera de los Álvarez cuando se enteró del homenaje? Fue atendida personalmente por la madre de los hermanos y desde entonces la Reina Pepiada se convirtió en la reina absoluta de las areperas del mundo.',
    prep_time: 20,
    cook_time: 20,
    servings_base: 4,
    difficulty: 'Fácil',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
    category: 'Plato Principal',
    ingredients: [
      { name: 'Harina de maíz blanco precocida (Harina P.A.N.)', amount_base: 320, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Agua tibia', amount_base: 500, unit: 'ml', category: 'Almacén & Granos' },
      { name: 'Sal marina', amount_base: 8, unit: 'g', category: 'Especias & Condimentos' },
      { name: 'Pechuga de pollo hervida y desmechada', amount_base: 500, unit: 'g', category: 'Carnicería & Pescados' },
      { name: 'Aguacates maduros (palta)', amount_base: 2, unit: 'unidad', category: 'Verdulería' },
      { name: 'Mayonesa de buena calidad', amount_base: 60, unit: 'g', category: 'Almacén & Granos' },
      { name: 'Cebolla morada finamente picada', amount_base: 0.5, unit: 'unidad', category: 'Verdulería' },
      { name: 'Cilantro fresco picado', amount_base: 15, unit: 'g', category: 'Verdulería' },
      { name: 'Zumo de lima o limón', amount_base: 15, unit: 'ml', category: 'Verdulería' }
    ],
    instructions: [
      'En un bol mezclar el agua con la sal; añadir la harina de maíz en lluvia mientras se mezcla con la mano hasta obtener una masa elástica y sin grumos. Dejar reposar 5 minutos.',
      'Formar 4 bolas, aplanar con las palmas creando discos de 1.5 cm de grosor.',
      'Cocinar en budare o sartén caliente ligeramente engrasada durante 5 minutos por lado hasta formar una costra crujiente; pasar al horno a 200°C por 10 minutos hasta que al golpearlas suenen huecas.',
      'Para el relleno: en un bol triturar uno de los aguacates con tenedor junto con la mayonesa, zumo de lima, sal y pimienta. Cortar el otro aguacate en dados pequeños.',
      'Mezclar la crema de aguacate con el pollo desmechado, la cebolla, el cilantro y los dados de aguacate.',
      'Abrir las arepas calientes, untar con una nuez de mantequilla al gusto y rellenar copiosamente con la Reina Pepiada.'
    ],
    nutrition_facts: {
      calories: 490,
      protein: 35,
      carbs: 46,
      fat: 19,
      fiber: 7,
      vit_a: 50,
      vit_c: 18,
      vit_d: 0.3,
      vit_b12: 0.7,
      iron: 2.6,
      calcium: 40,
      potassium: 620,
      sodium: 490
    }
  }
];
