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
