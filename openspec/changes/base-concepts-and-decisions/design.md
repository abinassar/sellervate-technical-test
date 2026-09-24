# Design

## Context

The project is built on Next.js 16 (App Router), TypeScript, Tailwind CSS with daisyUI, and Postgres (via Supabase). The application acts as an internal quality assurance and review platform for multi-brand customer service teams (Team Leads and Specialists). See `proposal.md` for overall motivation.

## Goals / Non-Goals

**Goals:**
- Provide a clear, robust architecture and conceptual foundation via `docs/general-prompts/project-base-concepts.md`.
- Produce bilingual architectural decisions documentation in `docs/en/DECISIONS.md` and `docs/es/DECISIONS.md` covering the four mandatory areas: Product, Architecture, AI, and Status.
- Establish the data domain model and server-side authorization boundaries separating Team Lead oversight from Specialist self-review.
- Provide a concrete design for the User Switcher simulating authenticated sessions while strictly enforcing authorization on server queries.

**Non-Goals:**
- Building a live helpdesk, ticketing inbox, or live messaging tool between customers and agents (the tool is strictly post-hoc review).
- Implementing runtime AI auto-scoring models (AI is documented as a future architectural consideration in DECISIONS.md, not built as runtime code).
- Implementing heavy authentication providers (e.g., OAuth/SAML); a secure server-validated user switcher is used instead.

## Decisions

### 1. Structure of DECISIONS.md (EN & ES)
- **Choice**: Structure `docs/en/DECISIONS.md` and `docs/es/DECISIONS.md` into 4 concise, high-impact sections:
  1. **Product**: Real problem interpretation, prioritized features (reviewing loop & specialist coaching), cut features (customer ticketing, live chat), AI placement analysis, and V2 considerations.
  2. **Architecture**: Data model design (Brands, Users, Products, Conversations, Messages, Evaluations), server-side authorization enforcement, and scaling bottlenecks.
  3. **AI**: Development workflow with agentic pairing, prompts used, overrides made, and synthetic realistic seed generation with intentional flaws.
  4. **Status**: Completed milestones, pending items, tech debt/trade-offs, and critical review points.
- **Alternatives considered**: Single monolithic document in English only. Rejected because bilingual documentation enables seamless evaluation and matches project directives.

### 2. Methodological Framework: "Qué quiero, Qué tengo, Cómo lo hago"
- **Choice**: Standardize the methodology in `docs/general-prompts/project-base-concepts.md` and link it directly into the Product & Architecture decisions.
- **Rationale**: Provides clear traceability from user requirements (supervisor vs. specialist needs) to data structures and UI workflows.

### 3. Server-Enforced Authorization Architecture
- **Choice**: Session state holds the active switched user ID in an HTTP cookie. All Server Components and Server Actions resolve this user ID on the server and filter database records according to their role and brand assignments.
- **Rationale**: Meets the test constraint: "Authentication can be stubbed. Authorisation cannot be stubbed." Any direct API/query attempt to read another specialist's data or unassigned brand data will be rejected by the server.

### 4. AI Strategic Positioning (Future V2)
- **Choice**: Document the prospective role of AI in `DECISIONS.md` as an asynchronous triage assistant that scans outgoing queues to flag potential brand procedural violations or toxic sentiment, requiring human lead validation before any action.
- **Rationale**: Demonstrates product foresight without falling into the anti-pattern of building an unnecessary model wrapper during the 6-hour scope.

## Risks / Trade-offs

- [Documentation Drift] → Maintain parallel consistency between `docs/en/` and `docs/es/` versions.
- [Cookie-based User Switching Security in Production] → Document in `DECISIONS.md` that cookie-based switching is for local review/assessment; production would wrap the same server-side authorization resolver in Supabase Auth JWT verification.

