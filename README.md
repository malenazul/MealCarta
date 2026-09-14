Aplicación en desarrollo

# 🌌 MealCarta — Atlas Culinario Mundial & Enciclopedia Gastronómica

Ingresar aquí para ver la aplicación: https://mealcarta.netlify.app/


> **Edición Multimedia Encarta Neo**: Inspirada en la legendaria **Microsoft Encarta**, reimaginada con una estética **retro-futurista minimalista y elegante** con acentos en violeta eléctrico (`#8B5CF6`) y turquesa neón (`#06B6D4`).

MealCarta es una aplicación web de última generación, responsiva y lista como **PWA (Progressive Web App)** para celulares y tabletas, centrada en un **Atlas Mundial Culinario Interactivo** donde cada ciudad y país alberga crónicas históricas, recetas autóctonas, curiosidades culturales, una calculadora bioquímica nutricional y un generador inteligente de listas de compras.

---

## ✨ Características Principales

### 🗺️ 1. Atlas Culinario Interactivo (El Núcleo)
- Mapa cartográfico mundial interactivo impulsado por **Leaflet** con pines luminosos para ciudades y países del orbe.
- Al hacer clic en un pin, el mapa vuela suavemente a la ubicación y despliega los artículos gastronómicos de esa latitud.
- Búsqueda en tiempo real por plato tradicional, país, ciudad o ingrediente.
- Filtros rápidos por regiones del mundo (América Latina, Europa, Asia, África, etc.).

### 📖 2. Fichas Enciclopédicas de Recetas
- **Crónica Histórica y Origen**: Ensayos documentados sobre la génesis del plato, sus raíces indígenas, coloniales o de inmigración.
- **Ritual Social y Costumbres**: Tradiciones familiares y ritos de mesa (ej. el asado de domingo, el Kaedama en Fukuoka, el corte de moussaka).
- **Archivo "¿Sabías que...?"**: Curiosidades científicas y anécdotas insólitas con insignia luminosa neón.
- **Preparación interactiva**: Seguimiento de pasos marcables para cocinar cómodamente desde el teléfono móvil.
- **Galería de fotos en alta resolución**.

### ⚖️ 3. Calculadora de Comensales y Laboratorio Nutricional
- **Escalado matemático exacto**: Cambia de 1 a 20 comensales y los ingredientes se recalculan al instante con sus respectivas unidades.
- **Desglose de Macronutrientes**: Calorías (kcal), Proteínas (g), Carbohidratos (g), Grasas (g) y Fibra (g).
- **Desglose de Micronutrientes y Vitaminas**: Vitamina A, Vitamina C, Vitamina D, Vitamina B12, Hierro, Calcio, Potasio y Sodio.
- **Banquete Nutricional (Sumador de Múltiples Platos)**: Suma una entrada, plato principal y postre, ajusta las porciones individuales y observa la sumatoria total frente a la Ingesta Diaria Recomendada (% IDR de la OMS/FDA).

### 🛒 4. Lista de Compras Inteligente y Consolidada
- Agrega múltiples platos con diferentes comensales.
- **Consolidación automática**: El motor matemático detecta ingredientes repetidos entre platos y los suma en una sola cantidad consolidada (ej. 2 cebollas + 1 cebolla = 3 cebollas), indicando en qué recetas se utiliza.
- **Organización por pasillos comerciales**: Verdulería, Carnicería & Pescados, Lácteos, Almacén & Granos, Especias & Condimentos, Frutas.
- **Checklist para el supermercado**: Toca los ingredientes para tacharlos mientras compras con tu celular.
- **Botón "Copiar para WhatsApp"**: Exporta la lista con formato ordenado y emojis lista para compartir por chat.
- **Imprimir / Guardar en PDF**.

### 🔒 5. Seguridad Robusta, Autenticación y Comunidad
- **Backend seguro**: Hasheo de contraseñas con `bcryptjs`, autenticación por tokens JWT seguros, cabeceras HTTP de protección (`helmet`), CORS configurado, limitador de tasa contra ataques de fuerza bruta (`express-rate-limit`) y esquemas validados con `Zod`.
- **Blindaje SQL**: Consultas parametrizadas en SQLite (`better-sqlite3`) a prueba de inyección SQL.
- **Mi Cuaderno Encarta**: Guarda y organiza tus platos favoritos.
- **Calificaciones y Reseñas**: Sistema de 1 a 5 estrellas con consejos culinarios de la comunidad.
- **Pedidos a la Comunidad**: ¿Buscas un plato tradicional que aún no está documentado? Publica un pedido para que otros investigadores lo incorporen.

### 📱 6. Mobile-First y PWA
- Totalmente adaptable a celulares, tablets y escritorios.
- Manifiesto Web PWA (`manifest.json`) para "Instalar en Pantalla de Inicio" en iOS y Android.
- Audio enciclopédico opcional sintetizado nativamente en el navegador (Web Audio API) con botón de encendido/apagado.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet, React-Leaflet, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, SQLite (`better-sqlite3`), `bcryptjs`, `jsonwebtoken`, `helmet`, `cors`, `zod`, `express-rate-limit`.
- **Arquitectura**: Monorepo con scripts concurrentes para cliente y servidor.

---

## 🚀 Cómo Ejecutar la Aplicación

### Requisitos
- Node.js 18+ instalado.
- npm 9+ instalado.

### 1. Iniciar en Modo Desarrollo (Servidor + Cliente juntos)
Desde la raíz del proyecto:
```bash
npm run dev
```
Esto levantará concurrentemente:
- **Backend API**: `http://localhost:3001`
- **Frontend Web**: `http://localhost:3000`

### 2. Acceder a la App
Abre tu navegador en:
👉 **`http://localhost:3000`**

Para probar funciones de usuario de inmediato, puedes usar el botón de **"⚡ Usar cuenta demo de Curador (1-Click)"** en el modal de inicio de sesión:
- **Email**: `curador@mealcarta.org`
- **Contraseña**: `mealcarta123`
*(O registrar una cuenta nueva y única si lo prefieres)*.

---

## 🏛️ Estructura del Código

```
MealCarta/
├── client/
│   ├── public/                 # Manifest PWA, favicon SVG
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Modal de Login / Registro
│   │   │   ├── community/      # Foro de pedidos de recetas
│   │   │   ├── encarta/        # Navbar retro-futurista con audio
│   │   │   ├── favorites/      # Mi Cuaderno de Recetas
│   │   │   ├── map/            # Atlas Culinario con Leaflet
│   │   │   ├── nutrition/      # Calculadora y Banquete Nutricional
│   │   │   ├── recipe/         # Fichas enciclopédicas y catálogo
│   │   │   └── shopping/       # Lista de compras consolidada
│   │   ├── services/           # Cliente API
│   │   ├── store/              # AppContext y estado global
│   │   ├── types/              # Modelos TypeScript
│   │   └── utils/              # Sintetizador Web Audio Encarta
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── db/                 # Conexión y tablas SQLite
│   │   ├── middleware/         # Auth JWT y rate limiters
│   │   ├── routes/             # Endpoints /api/*
│   │   ├── seeds/              # 13 recetas históricas documentadas
│   │   ├── utils/              # Motores de nutrición y consolidación
│   │   └── index.ts            # Servidor Express
│   └── tsconfig.json
└── package.json
```
