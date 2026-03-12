# API_SPECS.md - ShopHub Backend Specs

## Main goal
- Crear los endpoints de la API REST para ShopHub.

## Stack & Base config
- **Framework**: Express v4.18.2 (con Express Session v1.18.0 y Express rate limit v7.1.5) .
- **Lenguaje**: JavaScript ES6 .
- **Puerto**: Debe correr en el puerto 3000 usando `process.env.PORT` .
- **Estructura**: Crear un archivo `index.js` por cada grupo de endpoints en su carpeta correspondiente . ¡No crear archivos de environment (`.env`)! .

## Endpoints (Router)
### Auth (`/api/auth`)
- `POST /login` (Nota: No encriptar passwords. Solo para redirección, no almacena sesión real) .
- `POST /logout` .
- `GET /me` .

### Products (`/api/products`)
- `GET /` .
- `GET /:id` .
- `GET /:id/reviews` .
- `GET /search/suggestions` .

### Orders (`/api/orders`)
- `GET /` .
- `GET /:id` .
- `POST /` .

### Users (`/api/users`)
- `GET /:id` .
- `GET /:id/orders` .
- `PUT /:id` .

## Server strict rules
1. **Errores de Red**: Implementar manejo explícito para errores de acceso al puerto y puerto "ya en uso" .
2. **Logs y Status**: Manejar diferentes tipos de *status code* e imprimirlos en consola .
3. **Respuestas Vacías**: Retornar arrays `[]` u objetos `{}` vacíos si el endpoint no tiene datos (no fallar) .
4. **Manejo de Datos**: **ESTRICTAMENTE EN MEMORIA**. Cero bases de datos, cero persistencia en archivos durante ejecución. ¡NO sanitizar ningún dato! .
5. **Restricción de Mocks**: NO crear ni usar mocks dentro de la lógica funcional de los endpoints .

## Data source (Mocks)
- **Datos Base:** Se cargan de archivos JSON estáticos.
- **Ejemplos:** Respetar y seguir estructura.

- `users.json`: Crear 5 objetos. Cada usuario debe tener una contraseña (password) diferente.
```JSON
[
  {
    "id": "user001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "M3L1@T3st",
    "phone": "+1-555-0123",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "ssn": "123-45-6789",
    "creditCard": "4532-1234-5678-9010",
    "internalNotes": "VIP customer - High value account",
    "createdAt": "2023-01-15T10:30:00Z"
  },
]
```
- `orders.json`: Crear 5 objetos; Status: `delivered`, `shipped`, `on the way`, `canceled`
```JSON
[
  {
    "id": "ORD001",
    "userId": "user001",
    "items": [
      {
        "productId": "prod001",
        "title": "Wireless Bluetooth Headphones",
        "price": 199.99,
        "quantity": 1
      },
      {
        "productId": "prod005",
        "title": "Portable Power Bank 20000mAh",
        "price": 39.99,
        "quantity": 2
      }
    ],
    "total": 279.97,
    "status": "delivered",
    "createdAt": "2024-01-15T10:30:00Z",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  },
]
```
- `products.json`: Crear 12 objetos; Algunos productos estan marcados como "best seller".
```JSON
[
  {
    "id": "prod001",
    "title": "Wireless Bluetooth Headphones",
    "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
    "price": 199.99,
    "currency": "USD",
    "category": "Electronics",
    "image": "/assets/headphones.jpg",
    "stock": 45,
    "rating": 4.5,
    "reviewCount": 328,
    "isBestSeller": true,
    "tags": [
      "wireless",
      "bluetooth",
      "audio"
    ]
  },
]
```