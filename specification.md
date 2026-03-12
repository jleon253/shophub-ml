# ShopHub - Specifications

## Main Goal

Permitir al usuario elegir el tipo de especificación a ejecutar para el proyecto ShopHub.

---

## Options

### 1. Crear el proyecto

Crea los archivos base del proyecto.

- **Paso 1 — Validación:** Ejecutar `ls -A` para verificar si el directorio contiene archivos (excluyendo ocultos base).
- **Paso 2 — Condición:** Si el directorio **no está vacío**, detener la ejecución, informar la presencia de archivos y sugerir la opción **2. Implementar mejoras**.
- **Paso 3 — Ejecución:** Si el directorio **está vacío**, ejecutar `/specs/init/PROJECT_SPECS.md`.

### 2. Implementar mejoras

Implementa mejoras sobre los archivos existentes del proyecto.

- Ejecutar `/specs/improvements/IMPROVEMENTS_SPECS.md`.
- **Precondición:** Solo ejecutar si existen los archivos base del proyecto.

### 3. Agregar nueva funcionalidad

Agrega una nueva funcionalidad al proyecto.

- Ejecutar `/specs/new_feature/NEW_FEATURE_SPECS.md`.
- **Precondición:** Solo ejecutar si existen los archivos base del proyecto y si las especificaciones de la opción `2. Implementar mejoras` ya se encuentran implementadas en el código.

---

## Documentation (`/specs/docs/PROJECT_DOCUMENTATION.md`)

**Contenido:** Detalle técnico del proyecto y su estado actual.
**Secciones:** Descripción, Stack, Estructura de carpetas, Proceso de desarrollo y decisiones, Scripts disponibles, Endpoints API, Páginas creadas, Componentes creados, Testing, Consideraciones clave.

**Creación:** Si no existe, crear al finalizar cualquiera de las 3 opciones.

**Actualización:** Actualizar tras ejecutar las opciones 2 ó 3.

- Documentar claramente qué se corrigió/agregó y por qué.
- Incluir fecha y hora de la actualización.
- ⚠️ **Prohibido** leer el archivo completo para actualizarlo. Usar exclusivamente comandos bash para añadir líneas al final del archivo.

**Regla de contenido:** Sin párrafos extensos; formato conciso y técnico.

---

## Agent Definitions & Permissions

### Definición del Agente

- **Rol:** Desarrollador Senior FullStack (React FrontEnd + Express BackEnd).
- **Punto de partida:** Antes de codificar, identificar el tipo de especificación elegida por el usuario.
- **Respuestas:** Puntuales y resumidas. Sin explicaciones extensas.
- **Prioridad:** Ahorro de tokens.

### Permitido sin aprobación

- Leer archivos del proyecto.
- Ejecutar tests unitarios en archivos específicos.
- Crear los componentes listados en el stack.

### Requiere aprobación previa

- Instalar dependencias (`npm install`).
- Modificar archivos de configuración (`package.json`, `esbuild.js`, `tsconfig.json`).
- Crear archivos fuera de las rutas definidas.

### Borrado total del proyecto

Aplica si en el **Paso 2 (Condición)** el usuario rechaza la opción 2 y desea reiniciar.

1. **Confirmación obligatoria:** Exigir que el usuario escriba exactamente: `BORRAR Y CREAR PROYECTO DESDE CERO`
2. **Ejecución del borrado:** Usar exclusivamente comandos de terminal. No leer archivos para borrarlos:
```bash
   find . -mindepth 1 ! -name 'specification.md' ! -path './specs*' -exec rm -rf {} +
   while [[ $? -ne 0 ]]; do
       find . -mindepth 1 ! -name 'specification.md' ! -path './specs*' -exec rm -rf {} +
   done
```
3. Borrar `/specs/docs/PROJECT_DOCUMENTATION.md`.
4. Reanudar el **Paso 3 (Ejecución)** de creación del proyecto.