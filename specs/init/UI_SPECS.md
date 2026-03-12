# UI_SPECS.md - ShopHub Frontend Specifications

Este documento contiene las reglas estrictas de diseño, comportamiento y maquetación para la interfaz gráfica del e-commerce.

## Main goal
- Crear los componentes y páginas de la interfaz gráfica para ShopHub.

## Global styles and layout
- **Idioma UI**: Mostrar exclusivamente textos en inglés norteamericano.
- **Reglas Base**: Las propiedades CSS deben escribirse directamente en el JSX como object literal inline para los estilos y aplicar diseño responsivo . NO usar modo oscuro ni temas personalizados.
- **Tipografía**: `-apple-system, 'Segoe UI', sans-serif` . Está estrictamente prohibido usar CDN de Google Fonts .
- **Root Principal**: full width; Fondo de páginas `gris-claro` .
- **Contenedor**: Para `Header container` y `main container` Ancho máximo `1200px`.
- **Paleta de Colores Exacta** :
  - **Blanco**: `#FFF` (Usado para el fondo del Header ).
  - **Gris-claro**: `#F5F5F5` (Fondo de páginas).
  - **Gris-oscuro**: `#6C757D` (Botones secundarios ).
  - **Gris-descuento**: `#999999` (Texto de descuento tachado ).
  - **Azul**: `#2B7BFF` (Precios destacados, botones primarios, logo header ).
  - **Cian**: `#E7F3FF` (Banda info).
  - **Amarillo**: `#F9C10B` (Pill de "Best Seller", estrellas de rating ).
  - **Verde**: `#3BA745` (Ahorro en precio, texto "In stock" ).
  - **Verde-claro**: `#D1E7DD` (Banda éxito ).
  - **Rojo-claro**: `#F8D7DA` (Banda error ).
- **Botones**: `primary` color azul; `secondary` color gris-oscuro; no usar bordes.

## Main components
### Header
- **Caracteristicas:** Ubicación superior; Fondo `blanco`; Full width; **no debe colapsar en versión móvil**.
- **Estilo:** Links con `:hover` color azul; sin underline.
- **Logo**: Debe ser el texto de la marca .
- **Navegación**: Ítems por defecto "Home" y "Products" . 
- **Estado de sesión**: Mostrar el ítem "Login" si el usuario no está autenticado. Mostrar `Cart (${length})` si está logueado .
- **Implementación**: Usado en todas las páginas. Son links, no botones.

### ProductCard
- **Contenedor Visual**: Padding interno de `1rem` . Debe mostrar sombra y desplazamiento (translate) en el estado `:hover` .
- **Etiquetas e Iconos**: 
  - Pill "Best Seller": Color amarillo, tamaño pequeño; ubicación izquierda; **intersecta top: 10px, left: 0px** con la **imagen del producto**.
  - Boton con Icono Favorito: Intercambiar entre ❤️ y 🤍, Botón cuadrado, fondo blanco, padding `5px`, radius `50%`, sin borde, ubicado a la derecha .
- Imagen: 
  - Si **no hay imagen** del producto definida, **estrictamente mostrar un fallback con el texto "No image"** .
  - Si **hay imagen** del producto definida, **estrictamente mostrar la imagen del producto** .
- **Descuento producto:** Se calcula en memoría; Si `precio > 100`, entonces tiene descuento igual a `precio * 0.1`.
- **Información del Producto**: 
  - Nombre del producto en subtítulo `H3` . 
  - Estrellas de rating en color amarillo; No se muestra rating; Reviews `(# reviews)`; Estrellas y Reviews en mismo renglon.
  - Descuento tachado en gris-descuento; Precio normal destacado con fuente mayor en azul ; Usar USD antes del precio ; Desucento y Precio normal se muestran juntos ; Ahorro con fuente menor en verde; Ahorro se muestra en nuevo renglón .
  - Banda informativa: Muestra cantidad de producto `[num] in cart` agregado a carrito; Texto alineado izquierda; Fondo color `cian`; Oculta por defecto.
  - Estado: Texto "In stock" en verde y con formato negrilla .
- **Interacción y Botones**: 
  - `select` de cantidad para elegir un máximo de **5 ítems** por producto; Ancho `40px`; Anteponer label: `Qty:`.
  - Botones dispuestos verticalmente ("Add to Cart" primario azul y "View Details" secundario gris-oscuro) .
  - Al agregar al carrito: Disparar la alerta nativa del navegador mostrando nombre de producto agregado.
  - Al agregar al carrito: Se muestra "Banda informativa".
  - Al ver detalles: Abrir un panel colapsable (al final de la card) que muestre verticalmente: Descripción, Categoría, Stock restante y Revisiones; Tamaño fuente de 13px.

### Pagination
- Implementación: Usado en la página de productos .
- **Métodos internos**: handlePrevious y handleNext  
- **Formato**: "Previous | Page 1 of 5 | Next" .
- **Estilo:** Boton `primary` si activo; `secondary` si inactivo.

### SearchBar
- Implementación: Usado en la página de productos .
- **Métodos internos**: handleSearch  

### BestSeller
- Implementación: Usado en el componente ProductCard.

## Pages specifications
- **Home Page (`/`)**: 
  - Sección "Welcome to ShopHub": Debe contener el texto `<p>Discover amazing products at great prices</p>` sin estilos adicionales; Titulo y Texto alineado a la izquierda.
  - Sección "Best Seller": Estrictamente vacía .
  - Sección "Featured Products": Grid responsivo 4*2; **máximo de 8 tarjetas**; sin paginador .
- **Products Page (`/products`)**: 
  - Título: `All Products`; Tag `H1`; Alineado a la izquierda.
  - Caja de texto para búsqueda (sin botón, sin icono, centrado, filtra al tipear solo por el nombre del producto) . 
  - Grid responsivo de **máximo 12 productos** por página . Si la búsqueda no arroja resultados, mostrar el texto "No products found" .
  - Paginador siempre visible y activo.
- **Login Page (`/login`)**: 
  - Contenedor centrado . Subtítulo: "Login to [Marca]" y alineado a la izquierda . 
  - Campos: Input de texto para email y password (campo oculto); Usar labels; No admitir campos vacios.
  - Banda informativa: Ubicar exactamente debajo del input de password.
    - **Error:** Si campos no coinciden, mostrar texto "Email not found" o "Incorrect password" según corresponda; Tonos en color `rojo-claro`.
    - **Satisfactorío:** Si campos coinciden, mostrar texto "Login successfull! Redirecting..."; Tonos en color `verde-claro`.
  - Botón primario: "Login". **Debe redireccionar a `/` exactamente 1 segundo después del clic** (no almacena sesión real) .
- **Profile Page (`/profile`)**: 
  - Mostrar solo si el usuario está logueado .
  - Subtítulo: "Personal Information" acompañado de nombre, email, teléfono y dirección .
  - Subtítulo: "Order History". Mostrar la lista (vía fetch) con el formato: `#Order, Status, Items, Total: $`. Si no hay historial, mostrar el texto `"No orders yet"` .

## Frontend strict rules
- **Sintaxis**: Evitar cuando sea posible la invocación de `React.[...]`; Miembros de React deben importarse desde la dependencia `react`.
- **Login**: Aunque el código existe, no se debe implementar ningún tipo de autenticación real .
- **Enrutamiento**: Utilizar obligatoriamente `window.location`. **Estrictamente prohibido usar react-router** . En el archivo `/app/index.tsx` solo se debe retornar el componente de la página destino sin envolverlo en otros componentes .
- **Accesibilidad**: Está **estrictamente prohibido** aplicar etiquetas ARIA (`ARIA tags`) en el proyecto .
- **Archivos**: NO se deben crear subcarpetas para assets . NO se deben crear imágenes adicionales ni archivos ajenos a las páginas y componentes indicados .

## MetaTags
- **Título**: `[Marca] - [Slogan]`

