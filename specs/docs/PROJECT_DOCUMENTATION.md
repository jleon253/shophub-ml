# PROJECT_DOCUMENTATION.md - ShopHub

## Descripción
ShopHub es una aplicación SPA de comercio electrónico diseñada para ofrecer una experiencia de compra fluida con un frontend en React y un backend en Express.

## Stack Tecnológico
- **Frontend**: React 18, TypeScript 5.2.0 (ES6). Rutas manejadas vía `window.location`.
- **Backend**: Express 4.18.2, Node.js (ES6).
- **Testing**: Jest 29.7.0, Testing Library 14, Supertest.
- **Build**: esBuild 0.19.4.

## Estructura de Carpetas
- `/api`: Endpoints del backend (Auth, Products, Orders, Users).
- `/app`: Componentes de React, Contexto y Páginas.
- `/bin`: Script de inicio del servidor (`www`).
- `/mocks`: Datos estáticos en JSON.
- `/public`: Archivos estáticos y bundle final.
- `/tests`: Suites de pruebas unitarias e integración.

## Proceso de Desarrollo y Decisiones
1. **Estructura Monolítica**: Se optó por un monorepo simple para facilitar la integración.
2. **Estado en Memoria**: Para cumplir con los requisitos de simplicidad y velocidad, no se utiliza base de datos persistente.
3. **Rutas Custom**: En lugar de `react-router`, se implementó un sistema basado en `window.location` para minimizar dependencias.
4. **Estilos Inline**: Se priorizaron estilos inline en React para control total sin archivos CSS externos masivos, manteniendo la consistencia de la paleta.

## Disponibilidad de Scripts
- `npm run dev`: Inicia servidor de desarrollo y watch de esbuild.
- `npm run build`: Genera el bundle de producción.
- `npm test`: Ejecuta la suite completa de pruebas.

## Endpoints API
- `POST /api/auth/login`: Autenticación simulada.
- `GET /api/products`: Listado de productos.
- `GET /api/users/:id/orders`: Historial de pedidos por usuario.

## Consideraciones Clave
- Cumplimiento estricto de accesibilidad (sin tags ARIA).
- Diseño responsivo basado en grid de 1200px.

---
*Actualizado el: 2026-03-11 23:35*

## Mejora de Prioridad Alta - 2026-03-11 23:55
- Implementada validación estricta de Login (Regex) y persistencia en localStorage.
- Se habilitó grid de Best Sellers y filtro de Featured Products en HomePage.
- Modificado ProductsPage con búsqueda por precio y paginación de 8 ítems.
- Header actualizado con estados de sesión, logout ('Salir') y links activos resaltados.
- Implementado componente Modal para notificaciones amigables de carrito.
- Refactorizado AppContext para manejar sesiones persistentes y conteo total de ítems.
