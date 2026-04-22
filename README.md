# Demo

[Ver demo](https://silknova-frontend.vercel.app/)

# 🛍️ SilkNova — Proyecto Final Rolling Code

**Autor:** Alvaro Agustin Roldan Alderete  
**Institución:** Rolling Code School  
**Stack:** React 19 + Vite + Bootstrap 5

---

## ¿Qué es SilkNova?

SilkNova es un e-commerce completo desarrollado como proyecto final del curso de Rolling Code. Permite a los usuarios explorar productos, agregarlos a favoritos o al carrito, buscar por categorías y completar una compra simulada con integración de pago.

---

## Funcionalidades principales

### Autenticación
- Login y Registro mediante modales (sin redirección de página)
- Recuperación de contraseña en página aparte (`/forgot-password`)
- Restablecimiento de contraseña (`/reset-password`)

### Header
- Logo + íconos de redes sociales
- Buscador desplegable: al hacer clic aparece el input; al completar la búsqueda redirige a la página de resultados con un término por defecto
- En mobile: logo + menú hamburguesa con buscador integrado

### Navegación (Sticky)
- Home, Destacados, Contacto
- Favoritos con badge (contador dinámico)
- Carrito con badge (contador dinámico)
- Ícono de ayuda

### Página de inicio (Home)
- **Slider de productos destacados** (keen-slider)
- **Grilla de productos con paginación:**
  - Desktop: 3 filas × 5 productos
  - Tablet: 4 filas × 3 productos
  - Mobile: 5 filas × 2 productos
- Cada producto tiene botón de comprar (con tilde al agregar) y botón de favorito
- **Banner publicitario** a ancho completo del contenedor
- **Filtro por categorías** con botones en bloque + collapse, y publicidad en panel lateral (oculta en mobile)

### Páginas
| Ruta | Descripción |
|---|---|
| `/` | Home con slider, grilla, publicidad y categorías |
| `/products` | Listado completo de productos |
| `/cart` | Carrito: listado, ingreso de tarjeta, envío (MercadoLibre), link de pago |
| `/favorites` | Listado de productos marcados como favoritos |
| `/search` | Resultados de búsqueda desde el header |
| `/forgot-password` | Formulario de recuperación de contraseña |
| `/reset-password` | Formulario de restablecimiento de contraseña |
| `*` | Página 404 personalizada |

Todas las páginas heredan el Header, Footer y Nav.

### Footer
- Desktop: logo a la izquierda, 2 columnas de links, 1 columna con redes sociales + contacto + QR Data Fiscal, fila de copyright
- Mobile: íconos de redes sociales centrados + logo centrado

---

## Tecnologías utilizadas

| Paquete | Uso |
|---|---|
| React 19 | UI principal |
| React Router DOM v7 | Ruteo SPA |
| Bootstrap 5 + React-Bootstrap | Estilos y componentes |
| Axios | Peticiones HTTP |
| React Hook Form | Manejo de formularios |
| Keen Slider | Slider de destacados |
| React Icons | Íconos |
| React Hot Toast | Notificaciones |
| React Loading Skeleton | Estados de carga |
| AOS | Animaciones al hacer scroll |

---

## Instalación y uso

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd silknova-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build
```

---

## Variables de entorno

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Estructura del proyecto

```
src/
├── components/       # Header, Footer, ProductCard, Slider, etc.
│   └── auth/         # Modales de Login y Registro
├── pages/            # Home, Cart, Favorites, Products, etc.
├── context/          # Context API (carrito, favoritos, auth)
├── utils/            # Helpers de auth, carrito y favoritos
├── services/         # Llamadas a la API
├── router/           # AppRouter con rutas protegidas
├── config/           # Configuración de Axios
└── styles/           # Tema global CSS
```

---

> Proyecto final Rolling Code School.
