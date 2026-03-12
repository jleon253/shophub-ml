# PROJECT_SPEC.md - ShopHub Project Specifications

## Main Goal
- Construir la aplicación SPA (funcional y testeable) según el contexto y las siguientes definiciones.

## Specifications

**Marca:** ShopHub
**Slogan:** Your online store

**Detalles completos de UI, estilos y componentes:** Leer `UI_SPECS.md` solo cuando se trabaje en el Frontend.
**Detalles de Endpoints y Mocks:** Leer `API_SPECS.md` solo cuando se trabaje en el Backend.
**Detalles de Testing:** Leer `TESTING_SPECS.md` solo cuando se trabaje en el Testing.
**Estructura del Proyecto:** Leer `STRUCTURE_SPECS.md` solo cuando se construya el proyecto.
**Documentación del proyecto:** Generar `PROJECT_DOCUMENTATION.md`, evidenciando el proceso de desarrollo, el estado del arte del proyecto y las decisiones tomadas; Despues de generar todos los archivos del proyecto; antes de correr comandos de terminal.

## Technology Stack
- **Frontend**: React 18, TypeScript 5.2.0 (ES6). No usar react-router, usar `window.location`.
- **Backend**: Express 4.18.2, JS ES6. Ambos (Front y Back) corren en el puerto 3000.
- **Testing**: Jest 29.7.0, Testing Library 14 (sin user-event).
- **Build**: esBuild 0.19.4, Babel 7.23.0 (core, preset-env, preset-react, preset-typescript, register).
- **Requisitos**: Usar ^ (caret) para versiones de dependencias. @types para tipos de dependencias.

## Commands
### Setup
- prestart, predev, pretest: `npm install`

### Dev
- dev: `NODE_ENV=development npm run watch & nodemon bin/www`
- build: `NODE_ENV=production node esbuild.js`
- watch: `NODE_ENV=development node esbuild.js --watch`

### Testing
- test: `jest --runInBand --colors`

## Core Rules & Constraints
- **Almacenamiento**: Estrictamente en memoria. NO usar bases de datos, NO localStorage, NO guardar en archivos locales.
- **Estructura de archivos**: NO crear subcarpetas para assets ni componentes. Tests en la raíz de `/tests`.
- **Achivos de configuración**: NO crear archivos de configuración para babel.
- **Datos**: Usar JSON mocks estáticos (`orders.json`, `products.json`, `users.json`) limitados a 5-12 registros máximo. 
- **Estilos**: Usar CSS inline global. Sin modo oscuro, sin librerías externas de UI..