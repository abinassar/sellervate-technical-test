# Proposal: 01-base-setup-db-connection

## Context
Initial project bootstrapping using Next.js App Router, TypeScript, Tailwind CSS, and daisyUI. Provides local PostgreSQL infrastructure via Docker Compose and live connection state validation on the root route.

## Requirements
- R1: Run PostgreSQL alpine container via Docker Compose on port 5432.
- R2: Connect securely through DATABASE_URL read from local environment variables.
- R3: Implement Server Component check (SELECT 1) on src/app/page.tsx.
- R4: Display daisyUI status badge (Connected / Disconnected).
- R5: No schema or table migrations at this stage.
