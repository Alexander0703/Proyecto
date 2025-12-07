🛒 Tienda Demo - E-Commerce Web Completo
Una aplicación web de comercio electrónico completa con carrito de compras, sistema de usuarios, historial de compras y diseño moderno. Este proyecto demuestra habilidades avanzadas en desarrollo web frontend con funcionalidades completas de tienda online.

📁 Estructura del Proyecto
text
📂 tienda-demo/

├── index.html          # Página principal de la tienda

├── styles.css          # Estilos CSS con diseño moderno y oscuro

├── script.js           # Lógica JavaScript completa

├── products.json       # Catálogo de productos (25 productos)

├── README.md           # Este archivo

└── imagenes/           # Carpeta con imágenes de productos

🎯 Características Principales
🛍️ Gestión de Productos
Catálogo de 25 productos organizados por categorías

Filtrado por categorías (Tecnología, Ropa, Celulares, Todo)

Búsqueda en tiempo real

Diseño responsivo de tarjetas de productos

Imágenes con carga optimizada y placeholders

🛒 Carrito de Compras Avanzado
Agregar/eliminar productos

Modificar cantidades

Calcular subtotal automáticamente

Persistencia en localStorage

Sidebar interactivo

Vaciar carrito con confirmación

👤 Sistema de Usuarios Completo
Registro de usuarios: Formulario con validación

Inicio de sesión: Autenticación con localStorage

Modo demo: Registro automático si no existe usuario

Avatar personalizado: Inicial del nombre

Cerrar sesión con confirmación

📋 Historial de Compras
Registro detallado de cada compra

Visualización de compras anteriores

Detalles completos por compra

Filtrado por usuario

💳 Proceso de Compra
Confirmación antes de pagar

Resumen de compra con total

Procesamiento simulado de pago

Almacenamiento en historial

Notificaciones de éxito/error

🚀 Cómo Usar
Instalación Local
Descarga o clona el proyecto

Asegúrate de tener la estructura completa:

text
tienda-demo/

├── index.html

├── styles.css

├── script.js

├── products.json

└── imagenes/ (con todas las imágenes mencionadas en products.json)

Abre index.html en un navegador moderno

Requisitos de Servidor
Debido al uso de fetch para cargar products.json, se recomienda usar un servidor local:

bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
Luego abre: http://localhost:8000

🎨 Diseño y UI/UX
Tema Visual
Paleta oscura con acentos rojos

Gradientes dinámicos en elementos interactivos

Efectos de sombra y profundidad

Animaciones suaves en transiciones

Diseño responsive para móviles y escritorio

Componentes UI
Header: Logo, categorías, búsqueda, usuario, carrito

Product Grid: Tarjetas responsivas con imágenes

Sidebar Cart: Panel deslizante para el carrito

Modales: Login/registro, confirmaciones, historial

Notificaciones: Toast messages para feedback

🔧 Funcionalidades Técnicas
Almacenamiento de Datos
javascript
// LocalStorage para persistencia
localStorage.setItem('cart', JSON.stringify(cart));
localStorage.setItem('currentUser', JSON.stringify(currentUser));
localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
localStorage.setItem('usuarios_demo', JSON.stringify({ usuarios }));
Sistema de Archivos JSON
products.json: Catálogo de productos estructurado

Usuarios almacenados en JSON dentro de localStorage

Gestión de Estado
javascript
// Variables globales de estado
let cart = [];           // Carrito actual
let currentUser = null;  // Usuario logueado
let currentCategory = 'all'; // Categoría activa
let searchTerm = '';     // Término de búsqueda
let products = [];       // Productos cargados
let purchaseHistory = []; // Historial de compras
let usuarios = [];       // Usuarios registrados
📱 Funcionalidades por Sección
1. Explorar Productos
javascript
// Filtrado por categoría
const filteredProducts = products.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
});
2. Carrito de Compras
Agregar productos con addToCart(productId)

Modificar cantidades con updateQuantity(productId, change)

Remover productos con removeFromCart(productId)

Vaciar completamente con emptyCart()

3. Proceso de Pago
Verificar carrito no vacío

Confirmar inicio de sesión

Mostrar confirmación con resumen

Procesar compra

Guardar en historial

Vaciar carrito

Mostrar notificación de éxito

4. Sistema de Usuarios
javascript
// Registro con validación
if (password !== confirmPassword) {
    showMessage('Contraseñas No Coinciden', 'error');
}
if (password.length < 3) {
    showMessage('Contraseña Muy Corta', 'warning');
}
5. Historial de Compras
Accesible solo para usuarios logueados

Visualización por usuario

Detalles expandibles por compra

Información completa: fecha, productos, total

🎮 Interacción del Usuario
Flujo Principal
Explorar → Ver productos por categoría o búsqueda

Agregar → Click en "Agregar al carrito"

Revisar → Click en icono de carrito

Pagar → Click en "Pagar" (requiere login)

Confirmar → Revisar y confirmar compra

Historial → Ver compras anteriores desde perfil

Acceso Rápido
Click en avatar: Login/registro

Click en carrito: Ver/editar carrito

Click en categorías: Filtrar productos

Click en historial: Ver compras anteriores

Click en cerrar sesión: Salir de la cuenta

🔒 Seguridad y Validación
Validaciones Implementadas
Campos requeridos en formularios

Contraseñas coincidentes en registro

Longitud mínima de contraseña

Usuario único en registro

Email único en registro

Carrito no vacío para pagar

Usuario logueado para compras e historial

Manejo de Errores
Mensajes descriptivos al usuario

Try-catch para operaciones asíncronas

Fallbacks para imágenes no encontradas

Validación de respuestas fetch

📊 Estructura de Datos
Producto
json
{
  "id": 1,
  "name": "Laptop Gamer ROG Strix G16",
  "price": 35999.99,
  "category": "tecnologia",
  "image": "imagenes/laptop.jpg"
}
Usuario
javascript
{
  id: Date.now(),
  username: "usuario123",
  email: "usuario@demo.com",
  name: "Usuario Demo",
  password: "contraseña123",
  fechaRegistro: "2024-01-15T10:30:00Z",
  compras: []
}
Compra
javascript
{
  id: Date.now(),
  date: "2024-01-15T10:35:00Z",
  items: [...cart],
  total: 35999.99,
  user: "usuario123"
}
🛠️ Desarrollo y Extensión
Para Desarrolladores
Agregar Nuevo Producto:

Añadir objeto en products.json

Agregar imagen en carpeta imagenes/

La aplicación la cargará automáticamente

Agregar Nueva Categoría:

Añadir botón en HTML

Actualizar filtros en script.js

Asignar categoría a productos

Modificar Estilos:

css
:root {
    --primary-color: #1a1a1a;    /* Color principal */
    --secondary-color: #b30000;  /* Color secundario */
    --accent-color: #ff3333;     /* Color de acento */
    --dark-bg: #0d0d0d;          /* Fondo oscuro */
    --card-bg: #262626;          /* Fondo de tarjetas */
}
Funciones de Depuración
javascript
viewAllUsers();     // Ver usuarios registrados
clearAllData();     // Eliminar todos los datos
📱 Responsive Design
Breakpoints
Móvil (< 768px): Una columna, navegación vertical

Tablet (769px-1024px): Dos columnas, diseño optimizado

Escritorio (> 1024px): Tres+ columnas, diseño completo

Adaptaciones
Menú de categorías flexible

Grid de productos adaptable

Sidebar full-width en móvil

Formularios optimizados

Tamaños de texto ajustables

🔄 Flujo de Trabajo Recomendado
Setup inicial

bash
git clone [repositorio]
cd tienda-demo
python -m http.server 8000
Modificación de productos

Editar products.json

Agregar imágenes a imagenes/

Recargar navegador

Personalización

Modificar colores en styles.css

Ajustar textos en index.html

Agregar funcionalidades en script.js

🧪 Testing y Validación
Casos de Prueba
Usuario nuevo: Registro → Compra → Historial

Usuario existente: Login → Compra → Logout

Carrito: Agregar → Modificar → Vaciar

Búsqueda: Términos exactos y parciales

Categorías: Filtrado por cada categoría

Responsive: Probar en diferentes tamaños

Validaciones Automáticas
JSON válido en products.json

Imágenes existentes en imagenes/

Funciones JavaScript sin errores

CSS sin errores de sintaxis

📈 Posibles Mejoras
Prioridad Alta
Backend real: API con Node.js/Express

Base de datos: MongoDB o MySQL

Pagos reales: Integración con Stripe/MercadoPago

Admin panel: Gestión de productos y usuarios

Prioridad Media
Reviews: Comentarios y calificaciones

Wishlist: Lista de deseos

Ofertas: Sistema de descuentos

Carrito persistente: Entre sesiones

Prioridad Baja
Multiidioma: Soporte para inglés/español

Temas: Claro/oscuro intercambiable

Animaciones avanzadas: GSAP o similares

PWA: Instalación como app móvil

🐛 Solución de Problemas
Problemas Comunes
"Error cargando productos"

Verificar que products.json exista

Usar servidor local (no file://)

Revisar consola del navegador (F12)

"Imágenes no cargan"

Verificar nombres de archivo en products.json

Asegurar que imágenes estén en carpeta imagenes/

Revisar mayúsculas/minúsculas

"LocalStorage no persiste"

Verificar que navegador acepte localStorage

No usar modo incógnito para desarrollo

Limpiar datos del sitio si hay corrupción

"Diseño no responsivo"

Verificar metatag viewport en HTML

Recargar CSS limpiando cache (Ctrl+F5)

Probar en diferentes navegadores

Herramientas de Depuración
Consola del navegador: F12 → Console

Network tab: Ver peticiones fetch

Application tab: Ver localStorage

Elements tab: Inspeccionar HTML/CSS

📝 Notas del Proyecto
Características Destacadas
100% frontend: Sin dependencias externas

Código comentado: Fácil de entender y modificar

Arquitectura modular: Funciones organizadas por responsabilidad

Manejo de errores: Robustez en operaciones críticas

UX cuidadosa: Feedback visual en cada acción

Tecnologías Utilizadas
HTML5: Estructura semántica

CSS3: Grid, Flexbox, Variables CSS, Animaciones

JavaScript ES6+: Clases, async/await, fetch, Array methods

JSON: Almacenamiento y estructura de datos

LocalStorage: Persistencia del lado del cliente

Consideraciones de Performance
Lazy loading: Imágenes cargan bajo demanda

Debouncing implícito: Búsqueda en tiempo real

Minimal DOM updates: Actualizaciones eficientes

Optimized images: Placeholders SVG para fallos

Efficient rendering: Virtual DOM pattern manual

Autor: Alexander Ivanov Ruiz Clemente
Tecnologías: HTML5, CSS3, JavaScript (ES6+), JSON
Nivel: Avanzado - Aplicación web completa
Propósito: Demostración de e-commerce funcional
Licencia: Uso educativo y demostración técnica

Nota: Este proyecto es una demostración técnica y no debe usarse para comercio real sin implementar seguridad adecuada, backend y sistema de pagos real.

