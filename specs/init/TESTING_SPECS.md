# TESTING_SPECS.md - ShopHub Testing Specifications

## Main goal
- Crear los tests para el Frontend y Backend de ShopHub.

## General Rules
- **Extensiones**: `.tsx` para pruebas de componentes, páginas y hooks; `.js` para las demás pruebas.

## Frontend Testing
- Solo crear tests para: AppContext, BestSeller, Pagination y SearchBar.
- **Ubicación**: Carpeta `/tests`; no subcarpetas; diferentes archivos.
- **jest.config.js**: usar setupFilesAfterEnv para setup.js.
- **setup.js**: contiene utilidades y mocks
  - TextDecoder y TextEncoder (util)
  - window.location y fetch globalmente (mocks)

## Backend Testing
- **Herramientas**: Jest + Supertest .
- **Ubicación Obligatoria**: Existe un **único archivo** para todo el backend ubicado en `/tests/api.test.js` . No crear subcarpetas de testing.
