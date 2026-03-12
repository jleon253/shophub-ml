# high_priority.md - ShopHub High Priority Improvements Specifications

## Main Goal
- Implementar mejoras a problemas críticos que afectan la funcionalidad o la experiencia del usuario.

## Especificaciones y Problemas Detectados

### 1. Persistencia de Sesión y Logout (Crítico para la UX)
**Problema:**
Cuando el usuario inicia sesión y recarga la página, la sesión se pierde en el Frontend. Se requiere una solución basada en persistencia local.

**Especificaciones de Implementación:**
- **Frontend (`AppContext.tsx` / `LoginPage.tsx`):** 
  - Al iniciar sesión exitosamente, almacenar en `localStorage` un objeto con `email`, `password`, `id` y `name` de usuario (u objeto estructurado de sesión).
  - Al inicializar la aplicación, verificar si existe dicho objeto en `localStorage`. **Importante:** La recuperación del valor desde `localStorage` debe darse de forma **síncrona** en el valor inicial del `useState` (ej. `useState(() => localStorage.getItem('session'))`) y en entornos donde `typeof window !== 'undefined'`. Esto evitará parpadeos visuales al intentar ingresar inmediatamente a componentes protegidos como `ProfilePage`.
- **Frontend (`Header.tsx` & `styles.css`):**
  - Añadir un enlace o botón con el texto **"Exit"** (previamente "salir").
  - Identificar la ruta actual del sitio (por ej. `window.location.pathname`) e inyectar una clase `.active` al enlace correspondiente para resaltarlo.
  - Asegurarse de que el archivo global `styles.css` posee las pautas CSS `.active` asignando color explícito (`#007bff`) y un _text-decoration underline_ para cumplir el criterio visual esperado.
  - Al hacer clic en "Exit", se debe eliminar el objeto de sesión del `localStorage`, limpiar el estado global y redirigir al login.

### 2. Sistema de Notificaciones Global (Toast)
**Problema:**
Actualmente se usa `alert()` o estados locales para notificaciones, lo cual no es escalable ni ofrece una buena UX.

**Especificaciones de Implementación:**
- **Frontend (`AppContext.tsx`):**
  - Implementar un estado global para manejar mensajes de notificación (`toastMessage`).
  - Proveer una función global (ej: `showToast`) para disparar notificaciones desde cualquier componente.
- **Frontend (UI Global):**
  - El componente que renderiza el Toast debe estar ubicado a nivel global (disponible en toda la UI) y no dentro de componentes individuales como `ProductCard`.

### 3. Flujo de Carrito de Compras (Crítico para la UX)
**Problema:**
El botón "Add to Cart" en `ProductCard.tsx` permite añadir productos sin estar logueado. Además, usa la función nativa y bloqueante `alert()` para notificar al usuario. Finalmente, la cantidad de items no era acumulativa por fallas en el ciclo de adición asíncrona y el badge superior renderizaba el tamaño del arreglo y no el inventario real.

**Especificaciones de Implementación:**
- **Frontend (`ProductCard.tsx` / `AppContext.tsx`):**
  - Verificar si `user` existe desde el contexto (`useApp`) antes de llamar a `addToCart`. Si el usuario no está logueado, mostrar el recuadro global de *Toast*.
  - Eliminar el _for\_loop_ de `ProductCard`, actualizando la firma `addToCart` explícitamente a `addToCart(product, quantity)`.
  - Reestructurar el hook destellante de `setCart` a una actualización por estado de función dependiente: `setCart(prevCart => ...)`, así aseguramos acumulación asíncrona síncrona real si el usuario clickea distintas variaciones rápidamente.
- **Frontend (`Header.tsx`):**
  - Iterar la sumatoria cuantitativa en el carrito calculando dinámicamente: `cart.reduce((sum, item) => sum + item.quantity, 0)`.


### 4. Organización y Filtrado en HomePage
**Problema:**
La página de inicio muestra productos sin un criterio de filtrado claro en sus secciones.

**Especificaciones de Implementación:**
- **Frontend (`HomePage.tsx`):**
  - La sección **"Best Sellers"** debe mostrar únicamente los productos que tengan el flag `isBestSeller === true`.
  - La sección **"Featured Products"** debe mostrar productos que cumplan con dos condiciones:
    1. Tengan algún tipo de descuento (basado en lógica de precio).
    2. **No** sean "Best Sellers".
  - Ambas secciones deben presentar sus productos en un sistema de grid independiente.

### 5. Validaciones en el Login Page
**Problema:**
Falta de validación proactiva de datos.

**Especificaciones de Implementación:**
- **Frontend (`LoginPage.tsx`):**
  - Validar formato de email antes del envío.
  - Asegurar que la contraseña cumpla con criterios básicos de seguridad.

### 6. Renderizado Prematuro en Rutas Protegidas
**Problema:**
Parpadeo de contenido antes de la redirección.

**Especificaciones de Implementación:**
- **Frontend (`ProfilePage.tsx`):**
  - Integrar con el estado persistente para decidir si mostrar el contenido o redirigir inmediatamente sin cargar estados de carga innecesarios si no hay sesión.

### 7. Búsqueda por Precio en SearchBar
**Problema:**
El buscador de productos `SearchBar.tsx` únicamente evalúa las coincidencias de texto sobre el título y la descripción del producto, omitiendo buscar cantidades numéricas de precio (`price`) o el precio que el usuario observa en el Frontend luego de aplicado un descuento dinámico.

**Especificaciones de Implementación:**
- **Backend (`api/products/index.js`):**
  - Modificar el controlador de la ruta `GET /api/products` para que el parámetro de búsqueda `search` no solo compare `p.title` y `p.description` mediante la desestructuración del string, sino que incluya explícitamente `p.price.toString().includes(search)`.
  - Recrear la misma lógica de negocio del componente local que calcula el descuento (`finalPrice = hasDiscount ? price - 10% : price`) en el servidor e incluir iteraciones a la validación: `... || finalPrice.toFixed(2).includes(search) || finalPrice.toString().includes(search)`. Para que retorne coincidencias del precio rebajado si las hay.
  - Asegurar la misma funcionalidad de filtración para el endpoint anidado `GET /search/suggestions`.


------

## Cambios de código implementados

### 1. `AppContext.tsx` y `Header.tsx`
- **`AppContext`**: 
  - Se modificó la inicialización del estado `user` para que extraiga el valor directamente y de manera síncrona mediante `useState(() => ... localStorage.getItem('session'))`. Esto remueve el parpadeo en las rutas protegidas y previene redirecciones prematuras a `/login` que ocurrían por el retraso de estado al cargar desde `useEffect`. Se extrae el `id` original del usuario para posibilitar _fetch_ correctos a rutas exclusivas y de perfil como `ProfilePage`.
  - Se creó un sistema de notificaciones globales exportando el estado dinámico `toastMessage` y su disparador funcional `showToast(msg)`. El `div` de notificación renderiza a nivel `<AppContext.Provider>`.
- **`Header`**:
  - Se cambió la palabra de cierre de log-out a **"Exit"**. 
  - La función responsable del cierre adjunta `localStorage.removeItem('session')` para finalizar al usuario persistente con efectividad.
  - Se agregó la validación con `window.location.pathname` iterando una comparación ternaria en los `href`. Si coinciden, se invoca la clase estilizada `.active`.
  - Se modificó `public/styles.css` agregando la clase `nav a.active { color: #007bff; text-decoration: underline; }` que estipula el comportamiento visual de pestaña o sección activa.

### 2. `LoginPage.tsx`
- Tras autenticación vía endpoint OK en `handleSubmit`, se ejecuta `localStorage.setItem('session', JSON.stringify({ email, password, id: data.user.id, name: data.user.name }))` integrando credenciales e identificadores clave para la persistencia.

### 3. `ProductCard.tsx` y Shopping Cart Fixes
- Ya no implementa sus propias alertas temporales a nivel UI o con ventanas emegentes nativas. Ahora destruye del contexto nativo `showToast` enviándole variables correspondientes tales como: `showToast('Please login to add to cart.')`. 
- **Acumulación Corregida:** Se refactorizó la firma del contexto global `addToCart(product, quantity=1)` a lo largo de la app.
- Se implementó en el método `setCart(prevCart => ...)` la actualización síncrona real del estado dentro del AppContext, garantizando que añadir 3 ítems y luego 2 resultará efectivamente en 5 del mismo en vez de iterar sobre el cierre antiguo del scope.
- En `Header.tsx`, se renderiza `{totalCartItems}` resultante del método `.reduce` sobre las _quantities_ en vez de usar el tamaño estricto de _array_ subyacente (`.length`), reflejando la suma real total del carrito.

### 4. `HomePage.tsx`
- Se reemplazó al componente `<BestSeller>` entero para independizar las listas. 
- Sección "Best Sellers" mapea mediante grid usando: `products.filter((p: any) => p.isBestSeller)`.
- Sección "Featured Products" mapea usando: `products.filter((p: any) => !p.isBestSeller && p.price > 100)`.

### 5. `SearchBar` y Backend
- Se ajustaron los endpoints en `api/products/index.js` (incluido sugerencias) recreando la lógica de cálculo dinámico del Frontend en el Backend, generando variables de descuento `discountAmount` temporal y `finalPrice`, para comparar que su tipado con un `.includes()` retorne positivos tanto sobre su precio estándar estipulado `p.price` como en su valor rebajado real. De modo que, si se aplica el descuento a priori o no en el frontend, en el _SearchBar_ la vista simétrica coincidirá.

------

## Qué se ajusto y porque

- **Local Storage Session:** Permite que la UX de recargar la web no finalice las acciones (como ver perfil o sumar al carro) forzando re-logings. Al guardar internamente el identificador real del usuario, logramos que el `ProfilePage` haga requests con UUID veraces al backend simulado (`mocks/users.json`). El enlace "Exit" remueve del localstorage el token de rastro.
- **Global Toast Component:** Escalabilidad de UI visual, sacando responsabilidad de renderizado individual a cada target (producto) y moviéndolo a top-level hierarchy para evitar glitches de _z-index_ u ocupación innecesaria en el VDOM.
- **Grid Categories Filtering:** La UI inicial no establecía limites visuales (ambas iteraban misma API). Ahora hay claridad del producto visual, respetando isBestSeller para un row y decuentos/precios específicos para resto.
- **Header Active Menu Link:** Permite a los usuarios situarse espacialmente y ubicar qué página o sección de la aplicación están observando gracias a este feedback visual directo en la barra de navegación superior. Para esto, se programaron las clases activas en `styles.css` para cambiar el color a un azul característico y proveer de un subrayado notorio garantizando un contraste óptimo y accesibilidad.
- **Corrección de Cuantificación del Cesta:** Corregir el ciclo _for_ en ProductCard pasándolo a una delegación directa sobre el contexto del Cart (con Functional State Updates), resuelve el error de _batching_ de React al encolar estados de un ciclo continuo. Hacer un _.reduce()_ en el Header genera el calculo vivo y representativo de items en el carro.
- **Extensión del Buscador Analítico:** Implementar comparaciones directas en el endpoint backend asegura que la interfaz de `SearchBar.tsx` actúe como un cliente proxy pasivo, escalando la lógica de búsqueda en el lugar correcto (el controlador de la API) para ubicar productos por precio estandar *Y* precio descontado `finalPrice.toFixed(2)` sin cargar de responsabilidades ni ralentizar la vista Frontend o exponer toda la base de datos de productos en una solicitud única.