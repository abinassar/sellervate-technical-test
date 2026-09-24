# Agent Development Directives

You must strictly adhere to the following rules across the entire codebase before generating, modifying, or proposing any changes:

## 1. Declarative Code
- Write purely declarative, functional code.
- Prioritize immutability, pure functions, and idiomatic React/Next.js patterns over imperative loops or manual state mutations.

## 2. No Obvious Comments
- Do not write comments for functions, parameters, components, or logic that explain what the code already demonstrates.
- Rely on expressive, self-describing naming conventions. Keep the code clean and clutter-free.

## 3. DRY Principle and Logic Compression
- Eliminate duplicate or redundant logic.
- Extract recurring patterns into clean, reusable utility functions or custom hooks, provided the abstraction preserves clarity and readability.

## 4. Specifications and Architecture Compliance
- Strictly follow the guidelines defined in `.openspec/specs/` before creating or altering application architecture.
- Keep database operations restricted to server-side layers (Server Components or Server Actions).

## 5. Branch Naming Conventions
- Every implementation branch must use the prefix `SLLVT-` followed by a sequential three-digit zero-padded number (e.g., `SLLVT-001`, `SLLVT-002`, `SLLVT-003`, etc.).
- Append a brief descriptive slug to the identifier when applicable (e.g., `SLLVT-002-db-schema-and-rls`).