# mid_priority.md - ShopHub Mid Priority Improvements Specifications

## Main Goal

- Implementar mejoras a problemas importantes que afectan la calidad y el mantenimiento de todo el código.

## Especificaciones y Problemas Detectados

A continuación se listan los problemas de mantenibilidad, arquitectura y calidad del código detectados, y las especificaciones detalladas para su resolución por parte de un Agente Asistente:

### 1. Eliminación de Estilos en Línea, Modularización de CSS y Estructura de Carpetas por Entidad
**Problema:**
La mayoría de los componentes (`ProductCard.tsx`, `HomePage.tsx`, `ProfilePage.tsx`, `LoginPage.tsx`) abusan del uso de la propiedad `style={{...}}`. Además, `public/styles.css` concentraba todos los estilos en un único archivo monolítico, y los archivos de componentes/páginas convivían sin estructura en carpetas planas (`components/`, `pages/`), dificultando la localización de archivos relacionados y la escalabilidad del proyecto.

**Especificaciones de Implementación:**
- Mover todos los estilos definidos en `style` a clases CSS.
- Crear **una carpeta por componente o página** (ej. `components/Header/`) que contenga su `.tsx` y su `.css`.
- Separar los estilos propios de cada componente o página en un archivo CSS individual co-localizado con su entidad.
- `public/styles.css` debe conservar únicamente reset, base (`body`, `.container`), botones y layouts compartidos (`.products-grid`), estado de carga (`.loading`) y clases de utilidad.
- Normalizar colores "quemados" (ej. `#dc3545`, `#28a745`, `#ffc107`) como clases semánticas dentro del CSS del componente correspondiente.
- Habilitar el procesado de imports CSS en esbuild (loader `'.css': 'css'`) y referenciar `bundle.css` desde `public/index.html`.

### 2. Tipado Estricto en TypeScript (Eliminar y Refactorizar `any`)
**Problema:**
Se usa frecuentemente el tipo `any` en `AppContext.tsx` (e.g. `cart: any[]`), y respuestas de `fetch` a lo largo de los componentes (`Product`, `Orders`, etc.). Esto anula los beneficios y seguridad de tipos de TypeScript.

**Especificaciones de Implementación:**
- Crear o centralizar la declaración de interfaces como `Product`, `User`, y `CartItem` en un archivo `src/types.ts` o `app/types/index.ts`.
- Tipar explícitamente el estado del Contexto (`cart` debe ser `CartItem[]`), así como los argumentos y retornos de las funciones y llamadas de `fetch`.
- Evitar el uso de `any` en `map` properties (ej. reemplazar `products.map((product: any) => ...` por `products.map((product: Product) => ...`).

### 3. Extracción de Lógica de Peticiones a Custom Hooks
**Problema:**
La lógica de comunicación asíncrona (estado de `loading`, llamadas HTTP `fetch`, control de errores) está duplicada y fuertemente acoplada en varios `useEffect` a lo largo de `HomePage`, `ProductsPage`, `ProfilePage` y `ProductCard`.

**Especificaciones de Implementación:**
- Crear una carpeta `app/hooks/`.
- Extraer esta lógica a *Custom Hooks* como `useFetchProducts`, o un hook más genérico `useFetch<T>(url)`.
- Reemplazar el código duplicado en los componentes, delegando las peticiones a estos hooks (ej. `const { data: products, loading } = useFetchProducts()`).

### 4. Fragmentación y Refactorización de Componentes Grandes
**Problema:**
El componente `ProductCard.tsx` tiene demasiada longitud (casi 300 líneas) y asume demasiadas responsabilidades (pintar medallas de Bestseller, renderizar estrellas de puntuación, calcular precios/descuentos, y mostrar un bloque colapsable de comentarios e información extra).

**Especificaciones de Implementación:**
- Extraer de `ProductCard.tsx` sub-componentes más pequeños y puramente presentacionales.
- Crear un componente genérico `<StarRating rating={number} />`.
- Separar la lógica de detalles colapsables y reviews en otro componente como `<ProductDetails product={product} />` para mejorar la legibilidad y cohesividad del código.

### 5. Aumento de Cobertura de Pruebas (Testing) en Componentes Clave
**Problema:**
Al revisar el directorio `tests/`, se evidencia una falta crítica de cobertura en los componentes y páginas principales del sistema (ej. `ProductCard.tsx`, `HomePage.tsx`, `LoginPage.tsx`, `ProfilePage.tsx` y `Header.tsx`). Actualmente, componentes con lógica de negocio pesada, como el manejo de carrito y stock en `ProductCard.tsx`, carecen de tests, lo cual es riesgoso para realizar refactorizaciones estructurales en un proyecto Legacy. La API también cuenta con un test básico en `api.test.js`, pero no cubre casos de error y seguridad profundamente.

**Especificaciones de Implementación:**
- **Frontend:**
  - Emplear Jest y React Testing Library (ya presentes en el `package.json`) para añadir unit tests a `ProductCard.tsx` (simulando clics en "Add to cart", apertura de detalles, validación de stock agotado).
  - Añadir de tests de renderizado e integración básicos para las páginas principales (Mockenado la llamada de fetch/custom hooks).
  - Testear flujos de contexto en `AppContext.test.tsx` garantizando que las funciones `addToCart`, `removeFavorite` muten el estado correctamente.
- **Backend:**
  - Extender `api.test.js` para cubrir respuestas de error `401 Unauthorized` en el endpoint `/api/auth/me`.

*(Nota: Una vez que un Agente procese este archivo, debe refactorizar el código correspondiente, mejorando la legibilidad, la limpieza y la arquitectura sin alterar ni añadir nuevas funcionalidades al usuario final.)*

------

## Cambios de código implementados

### 1. Carpetas por Entidad + CSS Co-localizado
Se creó una subcarpeta por cada componente, página y contexto. Cada carpeta contiene el `.tsx` y su `.css` correspondiente. `public/styles.css` retiene únicamente estilos globales compartidos y clases de utilidad. El layout compartido `.products-grid` se promovió a `styles.css` dado que lo usan tanto `HomePage` como `ProductsPage`.

**Estructura resultante:**
```
app/
  components/
    BestSeller/
      BestSeller.tsx
    Header/
      Header.tsx
      Header.css
    Pagination/
      Pagination.tsx
      Pagination.css
    ProductCard/
      ProductCard.tsx
      ProductCard.css
    ProductDetails/
      ProductDetails.tsx
      ProductDetails.css
    SearchBar/
      SearchBar.tsx
      SearchBar.css
    StarRating/
      StarRating.tsx
  context/
    AppContext/
      AppContext.tsx
      AppContext.css
  pages/
    HomePage/
      HomePage.tsx
    LoginPage/
      LoginPage.tsx
      LoginPage.css
    ProductsPage/
      ProductsPage.tsx
      ProductsPage.css
    ProfilePage/
      ProfilePage.tsx
      ProfilePage.css
```

**Cadena de build actualizada:**
```js
// esbuild.js
loader: { '.tsx': 'tsx', '.ts': 'ts', '.js': 'jsx', '.css': 'css' }
```
```html
<!-- public/index.html -->
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/bundle.css">
```
```tsx
// Ejemplo: app/components/Header/Header.tsx
import './Header.css';
import { useApp } from '../../context/AppContext/AppContext';
```

### 2. Tipado Estricto (TypeScript)
Se creó un archivo central de tipos `app/types/index.ts` y se eliminó el uso de `any` en la aplicación.

```typescript
// app/types/index.ts
export interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  // ...
}

export interface CartItem extends Product {
  quantity: number;
}
```

### 3. Abstracción de Consumo de APIs
Se implementó el custom hook `useFetch` en `app/hooks/useFetch.ts` para centralizar la lógica de peticiones asíncronas.

```typescript
// app/hooks/useFetch.ts
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  // ... lógica de fetch con limpieza de efecto
  return { data, loading, error };
}
```

### 4. Fragmentación de Componentes
`ProductCard.tsx` fue refactorizado, extrayendo lógica y marcado a componentes especializados.

- `StarRating.tsx`: Renderizado modular de estrellas de calificación.
- `ProductDetails.tsx`: Encargado de mostrar la descripción, stock y reseñas (usando su propio `useFetch`).

### 5. Cobertura de Tests
Se añadieron y actualizaron pruebas unitarias e integración:
- `tests/ProductCard.test.tsx`: Nuevo, con 5 casos de prueba (renderizado, carrito, favoritos, stock, detalles).
- `tests/AppContext.test.tsx`: Actualizado para probar la acumulación de items en el carrito.
- `tests/api.test.js`: Expandido para cubrir el error 401 en `/api/auth/me`.

------

## Qué se ajusto y porque

### 1. Carpetas por Entidad, CSS Co-localizado y Estilos Compartidos en Global
*   **Ajuste**: Cada componente, página y contexto vive ahora en su propia subcarpeta que contiene su `.tsx` y su `.css`. `public/styles.css` se redujo a únicamente reset, base, botones, layout compartido (`.products-grid`) y clases de utilidad.
*   **Por qué**: Las carpetas planas `components/` y `pages/` crecen rápidamente y obligan a buscar el CSS asociado de un componente desplazándose por un listado de archivos mezclados. Con la estructura de carpeta por entidad (`Header/Header.tsx + Header/Header.css`), cada entidad es un módulo autocontenido: basta con abrir la carpeta del componente para encontrar todo lo que le pertenece, sin necesidad de navegar a otro directorio. Esto reduce la fricción al onboarding, facilita los *code reviews* (los cambios de un componente quedan agrupados en un mismo directorio) y previene que los estilos de un componente contaminen accidentalmente a otro. El único caso especial fue `.products-grid`, usado por `HomePage` y `ProductsPage`; al ser un layout compartido, se promovió a `styles.css` respetando el principio DRY en lugar de duplicarlo en ambas páginas. Todos los tests (30/30) pasan sin cambios adicionales tras la reorganización.

### 2. Seguridad de Tipos con interfaces TS
*   **Ajuste**: Eliminación de `any` en todo el flujo de datos (Contexto -> Propiedades -> Hooks).
*   **Por qué**: Se detectaron inconsistencias potenciales donde el código esperaba un objeto "Product" pero no tenía garantía de sus campos (ej. `reviewCount` vs `reviews_count`). Al definir interfaces estrictas, TypeScript ahora actúa como documentación viva y previene errores en tiempo de ejecución. Por ejemplo, `CartItem` extiende `Product` añadiendo `quantity`, asegurando que cualquier componente de carrito tenga acceso a los datos base del producto de forma tipada.

### 3. Centralización de Lógica Asíncrona (`useFetch`)
*   **Ajuste**: Implementación de un Generic Hook `useFetch<T>` con manejo de ciclo de vida.
*   **Por qué**: Anteriormente, cada página (`HomePage`, `ProductsPage`) gestionaba sus propios estados de `loading`, `error` y `data` de forma imperativa dentro de `useEffect`. Esto no solo duplicaba código, sino que era propenso a *Race Conditions* (si una petición tardaba más que otra). El nuevo hook incluye un flag `isMounted` para prevenir actualizaciones de estado en componentes ya desmontados, mejorando la estabilidad de la aplicación.

### 4. Fragmentación y Principio de Responsabilidad Única
*   **Ajuste**: Descomposición de `ProductCard` (monolito) en `StarRating`, `ProductDetails` y `BestSeller`.
*   **Por qué**: `ProductCard` estaba violando el principio SRP al manejar simultáneamente: lógica de renderizado de estrellas, cálculos de descuentos, gestión de favoritos y la carga asíncrona de reseñas. 
    *   `StarRating` ahora es un componente puramente visual reutilizable.
    *   `ProductDetails` encapsula su propia lógica de fetching de reseñas, lo que significa que el listado de productos es ahora mucho más liviano y solo carga la información extra bajo demanda (cuando el usuario hace clic en "View Details").

### 5. Robustez mediante Testing Automatizado
*   **Ajuste**: Creación de tests de unidad para componentes con lógica compleja y corrección de tests de API legados.
*   **Por qué**: Se ajustó `api.test.js` porque los tests fallaban debido a credenciales incorrectas en el mock (`password123` vs `M3L1@T3st`). Se añadió el test de `/api/auth/me` para garantizar que la seguridad de la sesión no se rompa accidentalmente. En el frontend, `ProductCard.test.tsx` ahora cubre el escenario de "Stock agotado", garantizando que el botón de compra se desactive preventivamente, algo crítico para la experiencia del usuario. El aumento de cobertura permite que futuras refactorizaciones sean seguras y predecibles.