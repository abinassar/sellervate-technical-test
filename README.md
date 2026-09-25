![Sellervate Technical Test](public/assets/01-sign-in.png)

# Sellervate Technical Test

Proyecto base desarrollado con Next.js (App Router), TypeScript, Tailwind CSS, daisyUI y PostgreSQL.

---

## 1. Requisitos Previos

- **Node.js**: v18.18+ o v20+
- **npm**: v9+
- **Docker** y **Docker Compose**

---

## 2. Puesta en Marcha de la Base de Datos

Levanta el contenedor de PostgreSQL 16 Alpine:

```bash
docker compose up -d
```

Para detener el servicio:

```bash
docker compose down
```

---

## 3. Instalación de Dependencias

Instala los paquetes del proyecto:

```bash
npm install
```

---

## 4. Ejecución en Desarrollo

Inicia el servidor local de Next.js:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador para ver la aplicación y el indicador de conexión a PostgreSQL.

---

## 5. Variables de Entorno

El archivo `.env.local` viene configurado por defecto con las siguientes variables:

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/sellervate_db` | Cadena de conexión completa para PostgreSQL |
| `POSTGRES_USER` | `postgres` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Contraseña de PostgreSQL |
| `POSTGRES_DB` | `sellervate_db` | Nombre de la base de datos |
| `POSTGRES_HOST` | `localhost` | Host de la base de datos |
| `POSTGRES_PORT` | `5432` | Puerto expuesto |
| `NEXT_PUBLIC_SUPABASE_URL` | `http://localhost:54321` | URL del cliente Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `mock-anon-key` | Llave anónima pública de Supabase |

---

## 6. Capturas del Sistema / Vistas de la Aplicación

A continuación se presentan las vistas principales del sistema implementadas para los diferentes roles:

### 6.1 Inicio de Sesión y Selección de Rol
Permite autenticarse seleccionando cualquiera de los usuarios semilla del sistema (Administrador, Team Lead o Especialista).

![01 - Inicio de Sesión](public/assets/01-sign-in.png)

---

### 6.2 Panel Principal y Listado de Conversaciones
Vista consolidada con tarjetas interactivas de conversación, badges de estado/calidad, productos asociados y participantes.

![02 - Panel Principal y Conversaciones](public/assets/02-home-conversations.png)

---

### 6.3 Métricas de Calidad y Rendimiento de Especialistas
Panel de control para supervisores con gráfico de dona de distribución global de calidad y tabla comparativa de desempeño por especialista.

![03 - Gráficos y Estadísticas](public/assets/03-home-statistics.png)

---

### 6.4 Detalle de Conversación y Cronología de Mensajes
Vista interactiva de soporte con historial de mensajes diferenciados por emisor (cliente vs especialista) y breadcrumbs de navegación.

![04 - Detalle de Conversación](public/assets/04-conversation-details.png)

---

### 6.5 Ponderación de Respuestas y Feedback de Calidad
Modal de evaluación para supervisores que permite asignar niveles de calidad (0 a 100 pts) y retroalimentación individual a las respuestas del especialista.

![05 - Calificación de Mensajes](public/assets/05-message-rating.png)

---

## 7. Estructura y Esquema de Base de Datos

El modelo relacional fue implementado en PostgreSQL utilizando un patrón **BaseEntity** para auditoría y soft delete (`created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) en todas las entidades principales.

### 7.1 Diagrama Entidad-Relación (ERD)

```mermaid
erDiagram
    ROLES ||--o{ USERS : "has"
    BRANDS ||--o{ PRODUCT_CATEGORIES : "contains"
    PRODUCT_CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCTS ||--o{ CONVERSATIONS : "referenced_in"
    USERS ||--o{ CONVERSATIONS : "specialist (user_id)"
    USERS ||--o{ CONVERSATIONS : "customer (customer_id)"
    USERS ||--o{ CONVERSATIONS : "evaluator (rating_user_id)"
    QUALITY_LEVELS ||--o{ CONVERSATIONS : "rated_with (quality_level_id)"
    CONVERSATIONS ||--o{ MESSAGES : "contains"
    USERS ||--o{ MESSAGES : "author (user_author_id)"
    USERS ||--o{ MESSAGES : "evaluator (rating_user_id)"
    QUALITY_LEVELS ||--o{ MESSAGES : "rated_with (quality_level_id)"

    ROLES {
        uuid id PK
        varchar code UK
        varchar name
        text description
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    USERS {
        uuid id PK
        varchar name
        varchar lastname
        uuid role_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    BRANDS {
        uuid id PK
        varchar code UK
        varchar name
        text description
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    PRODUCT_CATEGORIES {
        uuid id PK
        varchar code
        varchar name
        text description
        uuid brand_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    PRODUCTS {
        uuid id PK
        varchar code
        varchar name
        text description
        uuid category_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    QUALITY_LEVELS {
        uuid id PK
        varchar name
        text description
        integer level
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    CONVERSATIONS {
        uuid id PK
        varchar code UK
        varchar name
        text description
        varchar title
        uuid product_id FK
        uuid user_id FK
        uuid customer_id FK
        uuid quality_level_id FK
        uuid rating_user_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    MESSAGES {
        uuid id PK
        varchar name
        text message
        uuid conversation_id FK
        uuid user_author_id FK
        uuid quality_level_id FK
        uuid rating_user_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
```

### 7.2 Entidades del Sistema

- **`roles`**: Catálogo canónico de perfiles de acceso (`ADMIN`, `TEAM_LEAD`, `SPECIALIST`, `CUSTOMER`).
- **`users`**: Usuarios del sistema vinculados a su respectivo rol de autorización.
- **`brands`**: Marcas globales de productos (ej. Nike, Samsung, IKEA).
- **`product_categories`**: Categorías agrupadas por marca (ej. Running Shoes, Smartphones, Living Room).
- **`products`**: Artículos individuales sujetos a consultas y soporte al cliente.
- **`quality_levels`**: Escala de evaluación cualitativa y cuantitativa (0, 25, 50, 75, 100 pts).
- **`conversations`**: Hilos de interacción entre un especialista y un cliente sobre un producto específico.
- **`messages`**: Mensajes individuales dentro de cada conversación con soporte de calificación supervisada.

---

## 8. Datos Semilla del Sistema (Seed Data)

### 8.1 Roles de Usuario (`roles`)

| ID | Código | Nombre | Descripción |
| :--- | :--- | :--- | :--- |
| `00000000-0000-0000-0000-000000000001` | `ADMIN` | Administrator | Full system access and configuration administration |
| `00000000-0000-0000-0000-000000000002` | `TEAM_LEAD` | Team Lead | Quality assurance evaluator reviewing conversations and guiding specialists |
| `00000000-0000-0000-0000-000000000003` | `SPECIALIST` | Quality Specialist | Frontline specialist reviewing evaluations and tracking performance trends |
| `00000000-0000-0000-0000-000000000004` | `CUSTOMER` | Customer | End customer interacting in support conversations and reviewing service satisfaction |

---

### 8.2 Usuarios Semilla (`users`)

| ID | Nombre | Apellido | Rol | Rol ID |
| :--- | :--- | :--- | :--- | :--- |
| `00000000-0000-0000-0001-000000000001` | Alfonso | Gutierrez | `ADMIN` | `...0001` |
| `00000000-0000-0000-0001-000000000002` | Gianfranco | Abinassar | `SPECIALIST` | `...0003` |
| `00000000-0000-0000-0001-000000000006` | Jorge | Escobar | `SPECIALIST` | `...0003` |
| `00000000-0000-0000-0001-000000000003` | María | Alastre | `CUSTOMER` | `...0004` |
| `00000000-0000-0000-0001-000000000004` | Alejandra | Rodriguez | `CUSTOMER` | `...0004` |
| `00000000-0000-0000-0001-000000000005` | José | Abinassar | `CUSTOMER` | `...0004` |

---

### 8.3 Marcas del Catálogo (`brands`)

| ID | Código | Nombre | Descripción |
| :--- | :--- | :--- | :--- |
| `00000000-0000-0000-0002-000000000001` | `NIKE` | Nike | Marca global de calzado, indumentaria y equipamiento deportivo |
| `00000000-0000-0000-0002-000000000002` | `SAMSUNG` | Samsung | Corporación multinacional líder en tecnología, electrónica y telefonía móvil |
| `00000000-0000-0000-0002-000000000003` | `IKEA` | IKEA | Cadena internacional de muebles, diseño de interiores y accesorios para el hogar |

---

### 8.4 Categorías de Producto (`product_categories`)

| ID | Código | Nombre | Marca Asociada |
| :--- | :--- | :--- | :--- |
| `00000000-0000-0003-000000000001` | `RUNNING-SHOES` | Calzado de Running | Nike |
| `00000000-0000-0003-000000000002` | `SMARTPHONES` | Teléfonos Inteligentes | Samsung |
| `00000000-0000-0003-000000000003` | `LIVING-ROOM` | Muebles de Sala | IKEA |

---

### 8.5 Productos del Catálogo (`products`)

| ID | Código | Nombre | Categoría |
| :--- | :--- | :--- | :--- |
| `00000000-0000-0004-000000000001` | `AIR-MAX-90` | Nike Air Max 90 | Calzado de Running |
| `00000000-0000-0004-000000000002` | `PEGASUS-41` | Nike Pegasus 41 | Calzado de Running |
| `00000000-0000-0004-000000000003` | `GALAXY-S25` | Samsung Galaxy S25 | Teléfonos Inteligentes |
| `00000000-0000-0004-000000000004` | `GALAXY-A16` | Samsung Galaxy A16 | Teléfonos Inteligentes |
| `00000000-0000-0004-000000000005` | `KALLAX-SHELF` | Estantería IKEA KALLAX | Muebles de Sala |

---

### 8.6 Niveles de Calidad (`quality_levels`)

| ID | Nivel / Puntos | Nombre | Criterio de Evaluación |
| :--- | :---: | :--- | :--- |
| `00000000-0000-0007-000000000001` | **0** | **Pésimo** | Mensaje sin sentido o fuera de lugar, no ajustado al estándar técnico y profesional de trabajo. |
| `00000000-0000-0007-000000000002` | **25** | **Medianamente Deficiente** | Contenido vago, reflejando carencia de conocimiento técnico sobre el producto en cuestión. |
| `00000000-0000-0007-000000000003` | **50** | **Bueno** | Responde a la inquietud pero deja puntos abiertos o no expresa explícitamente toda la idea para solventar la duda. |
| `00000000-0000-0007-000000000004` | **75** | **Bastante Bueno** | Solventa la duda de forma clara sin generar dudas posteriores; carece únicamente de ejemplos o recursos de apoyo estructurados. |
| `00000000-0000-0007-000000000005` | **100** | **Excelente** | Solventa por completo la inquietud con explicación digerible, ejemplos prácticos, pasos estructurados y recursos de apoyo. |

---

### 8.7 Conversaciones Semilla (`conversations`)

| Código | Título | Producto | Especialista | Cliente | Calificación Global | Evaluador |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `CONV-001` | ¿Qué talla debería elegir para las Air Max 90? | Nike Air Max 90 | Gianfranco Abinassar | María Alastre | **Excelente (100 pts)** | Alfonso Gutierrez |
| `CONV-002` | Política de devolución para Pegasus 41 | Nike Pegasus 41 | Jorge Escobar | Alejandra Rodríguez | **Excelente (100 pts)** | Alfonso Gutierrez |
| `CONV-003` | La batería del Galaxy S25 apenas dura medio día | Samsung Galaxy S25 | Gianfranco Abinassar | José Abinassar | **Medianamente Deficiente (25 pts)** | Alfonso Gutierrez |
| `CONV-004` | ¿El puerto de carga de mi Galaxy A16 está cubierto por la garantía? | Samsung Galaxy A16 | Jorge Escobar | María Alastre | **Bueno (50 pts)** | Alfonso Gutierrez |
| `CONV-005` | Ayuda con el armado de estantería KALLAX — instrucciones poco claras | Estantería IKEA KALLAX | Jorge Escobar | Alejandra Rodríguez | **Pésimo (0 pts)** | Alfonso Gutierrez |

---

### 8.8 Resumen de Mensajes y Evaluaciones Semilla (`messages`)

El sistema incluye **52 mensajes semilla** distribuidos a lo largo de las 5 conversaciones, con las siguientes ponderaciones clave otorgadas por el evaluador Alfonso Gutierrez:

| Conversación | Mensaje | Especialista Autor | Nivel Asignado | Puntos |
| :--- | :--- | :--- | :--- | :---: |
| `CONV-001` | `MSG-004` | Gianfranco Abinassar | Bastante Bueno | 75 |
| `CONV-001` | `MSG-008` | Gianfranco Abinassar | Excelente | 100 |
| `CONV-002` | `MSG-014` | Jorge Escobar | Bastante Bueno | 75 |
| `CONV-002` | `MSG-016` | Jorge Escobar | Excelente | 100 |
| `CONV-002` | `MSG-018` | Jorge Escobar | Excelente | 100 |
| `CONV-003` | `MSG-023` | Gianfranco Abinassar | Medianamente Deficiente | 25 |
| `CONV-003` | `MSG-027` | Gianfranco Abinassar | Bueno | 50 |
| `CONV-003` | `MSG-031` | Gianfranco Abinassar | Medianamente Deficiente | 25 |
| `CONV-004` | `MSG-035` | Jorge Escobar | Medianamente Deficiente | 25 |
| `CONV-004` | `MSG-039` | Jorge Escobar | Bueno | 50 |
| `CONV-005` | `MSG-043` | Jorge Escobar | Medianamente Deficiente | 25 |
| `CONV-005` | `MSG-047` | Jorge Escobar | Pésimo | 0 |
| `CONV-005` | `MSG-051` | Jorge Escobar | Pésimo | 0 |
