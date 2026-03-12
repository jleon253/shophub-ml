# low_priority.md - ShopHub low Priority Improvements Specifications

## Main goal

- Implementar mejoras y optimizaciones deseables.

## Especificaciones y Optimizaciones Detectadas

### 1. Implementación de Debounce en la Búsqueda
**Problema:**
En `SearchBar.tsx`, la función `onSearch` se dispara inmediatamente con cada pulsación de tecla (`onChange`). Esto puede provocar demasiadas peticiones innecesarias o *re-renders* si el usuario escribe rápido.

**Especificaciones de Implementación:**
- Implementar una función o custom hook de *Debounce* (ej. `useDebounce` con espera temporal de `300ms` a `500ms`).
- Refactorizar el input en `SearchBar.tsx` para que `onSearch` se dispare solo cuando el usuario haya dejado de escribir, optimizando la carga en `ProductsPage.tsx`.

### 2. Estados de Carga Mejorados (Skeleton Loaders)
**Problema:**
Actualmente, mientras el frontend hace *fetch* de datos, se muestra un texto simple `<div className="loading">Loading...</div>`. Esto genera saltos visuales bruscos (*Layout Shifts*) al completar la carga.

**Especificaciones de Implementación:**
- Crear un componente visual `<SkeletonCard />` usando CSS para imitar la forma y altura geométrica de un `ProductCard`.
- En `HomePage.tsx` y `ProductsPage.tsx`, mostrar un grid de estos *Skeletons* mientras `loading` sea `true` para mejorar la percepción de carga (UX).

### 3. Correcciones de React Hooks y Memoization en UI
**Problema:**
En componentes como `Pagination.tsx`, hay un mal uso evidente de los Hooks en la UI. Por ejemplo, la variable `PageDisplay` utiliza `useMemo` con un arreglo de dependencias vacío `[]`, lo que causa que el texto de la página no se actualice correctamente visualmente al cambiar de página.

**Especificaciones de Implementación:**
- Revisar y corregir los arreglos de dependencias (`deps`) en `useMemo` y `useEffect` (ej. en `Pagination.tsx`).
- Eliminar las optimizaciones prematuras o erróneas en renderizados simples (ej. quitar el `useMemo` estático del `PageDisplay` o agregarle `[page, totalPages]`).

### 4. Accesibilidad (a11y) y Atributos Básicos
**Problema:**
El proyecto presenta una dependencia excesiva de etiquetas `<div>` genéricas, carece de una estructura de HTML5 semántico robusta y no garantiza el cumplimiento de estándares internacionales de accesibilidad.

**Especificaciones de Implementación:**
- **Semántica HTML5:** Reemplazar `div` genéricos por etiquetas semánticas donde corresponda (`<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, etc.) para mejorar la interpretación por parte de lectores de pantalla y motores de búsqueda.
- **Cumplimiento WCAG 2.0 (Nivel AA):** 
  - Respetar jerarquia de encabezados.
  - Asegurar que todos los elementos interactivos tengan etiquetas descriptivas y estados de foco visibles.
  - Verificar y corregir ratios de contraste de color (mínimo 4.5:1 para texto normal).
  - Añadir dinámicamente el prop `alt` real a las imágenes (ej. `alt={product.title}`).
  - Garantizar que la navegación sea posible enteramente mediante teclado.
  - Asegurarse de que cualquier componente visual tipo botón tenga su `aria-label` correcto.

*(Nota: Una vez que un Agente procese este archivo, debe implementar estas optimizaciones y refactorizaciones menores en el código sin romper la funcionalidad core del e-commerce.)*

------

## Cambios de código implementados

### 1. Debounce en la Búsqueda (`useDebounce`)
Se creó el custom hook genérico `useDebounce<T>` y se refactorizó `SearchBar` para disparar `onSearch` solo tras 400 ms sin actividad del teclado.

```typescript
// app/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

```tsx
// app/components/SearchBar/SearchBar.tsx
const debouncedQuery = useDebounce(query, 400);
useEffect(() => { onSearch(debouncedQuery); }, [debouncedQuery]);
```

El test `SearchBar.test.tsx` fue actualizado para utilizar `jest.useFakeTimers()` y `jest.advanceTimersByTime(400)`, verificando que `onSearch` **no** se dispara inmediatamente y **sí** se dispara al cumplirse el delay.

### 2. Skeleton Loaders (`SkeletonCard`)
Se creó el componente `app/components/SkeletonCard/SkeletonCard.tsx` con su CSS animado (`shimmer`). `HomePage` y `ProductsPage` ahora renderizan un grid de `<SkeletonCard />` mientras `loading === true`, eliminando los `<div className="loading">` de texto plano.

```tsx
// app/components/SkeletonCard/SkeletonCard.tsx
const SkeletonCard: React.FC = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    {/* ... */}
  </div>
);
```

```css
/* SkeletonCard.css */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%);
  animation: shimmer 1.4s infinite linear;
}
```

### 3. Corrección de Hooks en `Pagination`
Se eliminó el `useMemo` con array de dependencias vacío `[]` que impedía que el display de página se actualizara. También se corrigió el `useEffect` para incluir `currentPage` en sus dependencias. El componente ahora renderiza el `<span>` de paginación directamente.

```tsx
// Antes (bug):
const PageDisplay = useMemo(() => <span>Page {page} of {totalPages}</span>, []);
useEffect(() => { setPage(currentPage); }, []);

// Después (correcto):
useEffect(() => { setPage(currentPage); }, [currentPage]);
// y el span se renderiza inline sin useMemo
```

Adicionalmente, el contenedor se cambió de `<div>` a `<nav aria-label="Pagination">` con `aria-label` descriptivos en cada botón.

### 4. Accesibilidad (a11y) y Semántica HTML5
Cambios aplicados en todos los componentes y páginas:

| Componente/Página | Cambio |
|---|---|
| Todas las páginas | Contenido principal envuelto en `<main>` |
| `HomePage`, `ProductsPage` | Secciones con `<section aria-labelledby>` |
| `ProfilePage` | Órdenes como `<article>`, items como `<ul><li>`, fechas como `<time>` |
| `LoginPage` | `<h1>` en lugar de `<h2>` (jerarquía correcta), `role="alert"` en errores, `role="status"` en éxito, `autoComplete` en inputs, `noValidate` en form |
| `Header` | `<nav aria-label="Main navigation">`, `aria-label` en logo, contador del carrito con `aria-label` descriptivo |
| `ProductCard` | Cambiado de `<div>` a `<article>`, `<img>` real con `alt={product.title}`, `aria-pressed` en favoritos, `aria-label` con título del producto, `aria-expanded` + `aria-controls` en botón de detalles |
| `AppContext` | Toast con `role="status"`, `aria-live="polite"`, `aria-atomic="true"` |
| `public/styles.css` | Añadido `:focus-visible` global con `outline: 3px solid #007bff` |

------

## Qué se ajusto y porque

### 1. Debounce (400 ms) en Búsqueda
*   **Ajuste**: En vez de llamar `onSearch` en cada keystroke, se aplica un delay de 400 ms mediante `useDebounce`.
*   **Por qué**: Con el comportamiento anterior, cada pulsación de tecla desencadenaba un nuevo `useFetch` en `ProductsPage`, lanzando una petición HTTP por carácter. Con debounce, la petición solo se realiza cuando el usuario hace una pausa natural al escribir, reduciendo la carga en el servidor y evitando *race conditions* entre respuestas de distintas queries que lleguen fuera de orden. El delay de 400 ms es un balance probado entre capacidad de respuesta y reducción de peticiones.

### 2. Skeleton Loaders en lugar de Texto de Carga
*   **Ajuste**: Reemplazo de `<div className="loading">Loading...</div>` por un grid de `<SkeletonCard />` animados en `HomePage` y `ProductsPage`.
*   **Por qué**: El texto "Loading..." genera un *Cumulative Layout Shift* (CLS) severo: el contenido aparece y desplaza todo el layout abruptamente. Los Skeleton Loaders reservan el espacio que ocuparán las tarjetas de producto, por lo que el layout es estable desde el primer render. La animación shimmer también da retroalimentación visual activa al usuario, reduciendo la percepción del tiempo de espera. El atributo `aria-hidden="true"` en el SkeletonCard evita que los lectores de pantalla anuncien contenido decorativo.

### 3. Corrección de `useMemo` y `useEffect` en `Pagination`
*   **Ajuste**: Se eliminó el `useMemo` estático (`deps: []`) y se corrigió el `useEffect` para sincronizar `page` cuando cambia `currentPage` desde el padre.
*   **Por qué**: El `useMemo` con `[]` calculaba la expresión `<span>Page {page} of {totalPages}</span>` **una sola vez** al montar el componente, de modo que aunque `page` cambiara internamente, la UI mostraba siempre "Page 1 of X". Es el antipatrón clásico de *stale closure*. Al eliminar el memo, React re-evalúa el span en cada render correctamente. El bug del `useEffect` con `[]` también impedía que el componente se sincronizara si `ProductsPage` reiniciaba `currentPage` a 1 al buscar; con `[currentPage]` en las dependencias, el estado interno de `Pagination` siempre refleja la fuente de verdad del padre.

### 4. Accesibilidad WCAG 2.0 AA y Semántica HTML5
*   **Ajuste**: Migración a elementos HTML5 semánticos y adición de atributos ARIA en toda la aplicación.
*   **Por qué**:
    - **`<main>`**: Sin este landmark, los lectores de pantalla no pueden saltar directamente al contenido principal, obligando al usuario a leer toda la cabecera en cada navegación.
    - **`<article>` en `ProductCard`**: Cada tarjeta es una pieza de contenido autocontenida y distribuible, exactamente la semántica de `<article>`. Esto permite que los AT anuncien cuántos "artículos" hay en el grid.
    - **`aria-pressed` en favoritos**: Comunica el estado del toggle (activo/inactivo) a los lectores de pantalla, que lo anuncian como "botón pulsado/no pulsado".
    - **`aria-expanded` / `aria-controls`** en "View Details": Informa al AT que el botón controla una región colapsable y en qué estado está.
    - **`aria-live="polite"` en el toast**: Sin `aria-live`, las notificaciones insertadas dinámicamente son invisibles para los lectores de pantalla. Con `polite`, el mensaje se anuncia al terminar la locución actual, sin interrumpir al usuario.
    - **`:focus-visible`**: Garantiza que la navegación por teclado siempre muestre un indicador de foco claro (outline azul de 3px), cumpliendo el criterio WCAG 2.4.7 (Focus Visible).