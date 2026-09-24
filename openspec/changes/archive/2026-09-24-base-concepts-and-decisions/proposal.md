# Proposal

## Why

To establish the foundational architecture, domain model, and product vision for the Sellervate QA review platform in alignment with the technical assessment requirements. Creating clear bilingual documentation (`DECISIONS.md` in English and Spanish, and `project-base-concepts.md`) and defining baseline capability specifications ensures alignment across product scope, server-enforced multi-brand authorization, metrics, and agentic development workflows before code implementation.

## What Changes

- Create `docs/general-prompts/project-base-concepts.md` formalizing the "Qué quiero, Qué tengo, Cómo lo hago" methodology and core system concepts.
- Create `docs/en/DECISIONS.md` and `docs/es/DECISIONS.md` structured into the four mandatory sections: Product, Architecture, AI, and Status.
- Define the foundational specification for core QA capabilities: Brand isolation, Specialist response evaluation, Supervisor feedback/comment loops, and performance metric tracking.
- Establish architectural boundaries ensuring server-side authorization enforcement and domain data modeling for Postgres/Supabase.

## Capabilities

### New Capabilities
- `project-documentation`: Establishes the project decision log (`DECISIONS.md` in EN/ES) and base conceptual framework for the Sellervate QA tool.
- `core-qa-domain`: Defines the domain model, role-based access rules (Team Lead vs. Specialist), review/scoring mechanism, feedback exchange, and KPI calculation logic.

### Modified Capabilities
None.

## Impact

- Documentation added under `docs/` (`docs/en/DECISIONS.md`, `docs/es/DECISIONS.md`, `docs/general-prompts/project-base-concepts.md`).
- Sets architectural contracts for future database schemas, server actions, and UI components without altering runtime code during this planning phase.

