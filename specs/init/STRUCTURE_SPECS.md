# STRUCTURE_SPECS.md - ShopHub Structure Specifications

Este documento describe la estructura de carpetas y archivos del proyecto ShopHub E-commerce.

## Estructura del Proyecto & Reglas de Archivos
El proyecto sigue una estructura monolítica estricta. Te guiarás por las siguientes reglas al crear o modificar archivos:

- `/`: En la raíz solo deben ir los archivos de configuración (`package.json`, `esbuild.js`, `tsconfig.json`). **NO crear archivos `.env` ni configuraciones de babel**.
- `/api/`: Contiene los endpoints del backend. **Debes crear un archivo `index.js` por cada endpoint dentro de su carpeta correspondiente**.
- `/app/`: Contiene las páginas (`[name]Page.tsx`) y los componentes de React. **NO crear subcarpetas para assets ni imágenes**.
- `/bin/`: Contiene el archivo raíz (www) de express para crear el servidor.
- `/mocks/`: Contiene los mocks de datos para el frontend y backend.
- `/tests/`: Contiene TODOS los tests (FrontEnd y BackEnd). **ESTRICTAMENTE PROHIBIDO crear subcarpetas aquí**. Solo puedes crear `/tests/__mocks__` para `fileMock` y `styleMock`.
- `/public/`: Contiene los archivos públicos (index.html, style.css, bundle.js, bundle.js.map).

```
/
|-- api/ (backend)
|   |-- auth/
|   |-- orders/
|   |-- products/
|   |-- users/
|   |-- index.js (Implementación y definicion: Express & Express Session)
|-- app/ (frontend)
|   |-- components/
|   |-- context/
|   |-- pages/
|   |-- index.tsx (Definición: Rutas y provider)
|-- bin/ (express)
|   |-- www (Archivo raíz de express para crear servidor)
|-- mocks/
|-- public/
|   |-- index.html
|   |-- style.css (estilos globales)
|   |-- bundle.js
|   |-- bundle.js.map
|-- tests/
|   |-- __mocks__/
|   |-- api.test.js
|   |-- setup.js (Implementación testing-library y utilidades)
|-- package.json
|-- tsconfig.json
|-- jest.config.json
|-- esbuild.js
|-- README.md
|-- .gitignore (Recomendaciones por defecto & S.O MacOs & Node)
```