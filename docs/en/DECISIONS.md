# Decisions Document (Sellervate QA Platform)

---

## 1. Product

### The Real Problem
Sellervate sells customer experience under the guise of the client's brand. The actual product is the quality and tone of specialist replies. The operational bottleneck is not message delivery, but asynchronous quality assurance: team leads lack a systematic loop to review replies against brand-specific procedures, specialists lack visibility into their coaching feedback, and clients cannot be given empirical proof of quarter-over-quarter improvement.

### What Was Built First and Why
We prioritized the **Core Review & Coaching Loop**:
1. **Team Lead Review Stream**: Rapid inspection of sent conversations and individual specialist replies, enabling qualitative and quantitative scoring paired with actionable feedback.
2. **Specialist Performance & Coaching Hub**: A private view for specialists to inspect supervisor observations, review their own ratings, and track their performance trends.
3. **Brand Context & Procedure Reference**: Embedding brand tone guides and product-level FAQs directly alongside conversations so evaluations are grounded in concrete brand standards.

### What Was Left Out and Why
- **Live Helpdesk / Customer Messaging Inbox**: This tool is strictly post-hoc review. Integrating active customer ticketing would distract from QA judgement workflows.
- **In-App AI Auto-Scoring in V1**: As noted in the exercise guidelines, building an automated scoring model wrapper creates a brittle proxy for human judgement and burns precious time better spent on authorization and the core review loop.
- **Full OAuth/SSO Authentication Provider**: Replaced with an active User Switcher to allow instant role verification while enforcing server-side authorization boundaries.

### Where an AI Model Belongs (V2 Vision)
In a V2 environment, an LLM model would sit as an **asynchronous queue triage filter**:
- **Role**: Passively analyze outgoing specialist replies against brand procedure embeddings and customer sentiment to flag high-risk anomalies (e.g., offering immediate refunds without diagnosis, or missing order history checks) for priority human review.
- **Prerequisites for Trust**: High precision / low false-positive rate, confidence calibration, human-in-the-loop validation before applying any score, and zero automated disciplinary action.

### Questions for Stakeholders Before V2
1. What automated ingestion pipeline or webhook protocols will connect directly to Zendesk/Gorgias/Front helpdesks?
2. What custom SLA thresholds and weighted scoring rubrics exist across enterprise vs. commodity brand tiers?
3. Should specialists be able to dispute or open a feedback dialogue directly on specific supervisor reviews?

---

## 2. Architecture

### Why This Shape
We chose Next.js 16 (App Router) with TypeScript, Tailwind CSS, daisyUI, and Postgres via Supabase. Server Components and Server Actions provide an idiomatic, declarative architecture that eliminates unnecessary client-side state mutations while keeping database queries strictly on the server layer.

### Data Model Design
The relational schema separates tenancy and operational concerns:
- **`brands` & `brand_assignments`**: Defines brand configurations and binds team leads and specialists to authorized brands.
- **`products` & `procedures`**: Hierarchical product catalog with brand guidelines, resolution procedures, and FAQs.
- **`conversations` & `messages`**: Historic customer-specialist threads, recording response timestamps and message content.
- **`evaluations` & `evaluation_comments`**: Post-hoc reviews linked at both conversation and message levels, recording score values, categories, and supervisor critique.

### How Authorisation Is Enforced
- **Server-Side Enforcement**: The active user session (simulated via secure cookie in development) is resolved exclusively on the server.
- **Isolation Rules**:
  - Specialists querying the database receive strictly their own conversations, messages, and evaluations. Any direct API/action attempt to access cross-specialist or unauthorized brand data returns a 403 Forbidden.
  - Team Leads access all conversations and evaluations within their assigned brands.
- **Transition to Real Auth**: In production, the session resolver seamlessly maps to Supabase Auth JWT tokens (`auth.uid()`) without altering data layer authorization rules.

### What Breaks First as This Grows
- **Metrics Aggregation at Scale**: On-the-fly SQL aggregations for brand score trends will require indexed materialized views or periodic background rollup jobs once message volume exceeds hundreds of thousands of rows.
- **Multi-channel Ingestion Rate**: Direct webhooks from multiple external helpdesks will require an asynchronous message broker (e.g., Redis / BullMQ or Kafka) to buffer queue ingestion.

---

## 3. AI (Development Process)

### How We Worked with AI
Development followed an agentic pair-programming methodology using Google Antigravity and OpenSpec. Spec-driven planning artifacts defined exact acceptance criteria before any code generation took place.

### Where the Agent Excelled vs. Manual Overrides
- **Where AI Excelled**: Rapid scaffolding of relational domain models, declarative UI components, and generating realistic, voice-differentiated seed conversations across diverse brand personas (technical scooter vs. fast packaging).
- **Where We Overrode the Agent**: Restricting runtime scope (preventing premature AI scoring implementations), enforcing strict server-side authorization boundaries, and strictly adhering to declarative Next.js Server Component patterns.

### Selected Prompt Excerpt
```markdown
"Generate realistic seed data for 2 distinct brands: 'Apex Scooters' (demands technical diagnosis before returns) and 'Nova Packaging' (demands concise, 3-line turnaround). Include at least 6 conversations, 3 specialists, and 2 team leads, with deliberate procedural flaws (e.g. failing to check order history) to enable meaningful QA review."
```

---

## 4. Status

### Current Implementation State
- **Completed**:
  - Conceptual framework and "Qué quiero, Qué tengo, Cómo lo hago" methodology in `project-base-concepts.md`.
  - Bilingual Decisions documentation (`docs/en/DECISIONS.md` and `docs/es/DECISIONS.md`).
  - OpenSpec capability contracts for `project-documentation` and `core-qa-domain`.
  - Initial repository layout, Docker PostgreSQL container configuration, and tech stack setup.
- **Next in Priority Order**:
  1. Database schema migration scripts and Supabase RLS policies (`SLLVT-002`/`SLLVT-004`).
  2. Realistic multi-brand seed dataset insertion.
  3. Team Lead review loop UI & Specialist coaching dashboard.
  4. Brand quality metric trend charts using Recharts.

### Repository Flag / Trade-off
- **Flagged Item**: Cookie-based User Switcher in place of full JWT Supabase Auth.
- **Rationale**: Allowed 100% of available time to focus on domain data modeling, server authorization enforcement, and the QA user journey without getting bogged down in auth provider boilerplate.

