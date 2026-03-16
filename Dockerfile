# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# 1. Directorio raíz para toda la APP
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# --- Etapa de construcción (Build) ---
FROM base AS build

# Instalar herramientas necesarias para compilar node modules si hicieran falta
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Instalar dependencias completas (incluyendo devDependencies como esbuild)
COPY package*.json ./
RUN npm install --include=dev


# Copiar el código fuente
COPY . .

# Compilar los bundles (React -> bundle.js) DENTRO de la imagen
RUN npm run build

# Limpiar dependencias de desarrollo para aligerar la imagen
RUN npm prune --omit=dev


# --- Etapa Final (Runtime) ---
FROM base

# 2. Copiar todo el contenido ya procesado desde la etapa de build
COPY --from=build /app /app

# Fly lee process.env.PORT, bin/www usa 3000 por defecto
EXPOSE 3000

# 3. ARRANCAR EL SERVIDOR DIRECTAMENTE (Sin compilar de nuevo)
CMD [ "node", "bin/www" ]
