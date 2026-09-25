# Decisions Document (Sellervate QA Platform)

---

## 1. Product

### The Real Problem
Sellervate manages customer experience operating under the identity of the client brand. The actual product is the quality and tone of responses delivered by specialists. The operational bottleneck does not lie in message delivery, but in asynchronous quality assurance: supervisors lack a systematic workflow to quickly audit responses against brand-specific procedures, as well as metrics that pinpoint areas of improvement where specialists need to focus.

On the other hand, specialists lack visibility into their improvement observations, and there is no quantitative evidence to demonstrate their progress to clients over time.

### What Was Built First and Why
We prioritized the **Core Review and Coaching Workflow**:
1. **Supervisor Audit Workflow**: Agile inspection of sent conversations and individual responses, allowing quantitative and qualitative ratings paired with feedback comments.
2. **Specialist Performance Dashboard**: Private view for each specialist to check their scores, supervisor feedback, and metric trends.

### What Was Left Out and Why

- **Heavy Authentication Provider (OAuth/SSO)**: Replaced by an accessible *User Switcher* for local testing that delegates strict permission validation to the server. Left out due to the required development time.

- **Procedural Reference**: Embedding tone guidelines and product FAQs alongside conversations so evaluations are grounded in real standards.

- **Documentation Reference**: Embedding documentation associated with specific products to guide specialists during communication. Left out due to time constraints and necessary data model modifications.

- **Live Chat Between Users**: Enabling real-time communication between system users to resolve doubts on how to handle conversations. Left out due to the required development time.

- **Report Generation**: Providing the ability to evaluate and export metrics from conversation and message weighting to better identify improvement points for each specialist. Left out due to the required development time.

- **Change Log Audit**: Leveraging system roles, a generic entity is proposed to track changes made across each entity in the system, maintaining control over system modifications and enabling auditability.

### Where an AI Model Belongs (V2 Vision)
In a V2 version, an AI model would serve in the following points:
- **Evaluate conversation flows**: Analyze outgoing replies against brand procedures to flag critical anomalies (e.g., offering refunds without prior diagnosis or ignoring order history) and prioritize them for human review.
- **Documentation Agent**: Based on the managed product, provide analysis against configured documentation to assist specialists when they have doubts regarding their message or procedure.

---

## 2. Architecture

### Why This Shape
The following points outline the methodology and principles implemented for the solution:

  - The conceptual framework and "What I want, What I have, How I do it" methodology in `project-base-concepts.md` details the foundational concept upon which the solution is built, simplifying and breaking down the implementation into sub-tasks.
  - The aforementioned point is also grounded in understanding both the problem and the business context; while starting from some ambiguous concepts, it allows identifying improvement points and framing the system's operating rules to obtain the accurate information needed to solve the presented problem.
  - Each OpenSpec specification within `/openspec/specs` serves as the foundation for future implementations.
  - Used a Docker container with PostgreSQL and dependency configuration, facilitating seed data insertion into the project.

### Data Model Design
The relational schema separates multi-tenant brand isolation and operations:
- **`BaseEntity` Foundation Structure**: All entity tables and models inherit canonical primary keys and audit metadata: `id` (UUID), `created_at` / `updated_at` / `deleted_at` (`TIMESTAMPTZ`), and `created_by` / `updated_by` / `deleted_by` (`UUID NULL`), simplifying the implementation of future entities.
  - Automated `BEFORE UPDATE` trigger in PostgreSQL guaranteeing `updated_at` accuracy.
  - Soft-delete strategy isolating active records (`WHERE deleted_at IS NULL`) while preserving historical audit trails.
  - Bidirectional mappers reconciling SQL `snake_case` with TypeScript `camelCase` domain properties.
- **`roles` and `users`**: Canonical Role-Based Access Control (RBAC) foundation inheriting from `BaseEntity`. `roles` defines unique system capability codes (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`); `users` defines identity data (`name`, `lastname`) bound to `idRole` (`role_id`) with declarative guard functions for server and UI discrimination.
- **`brands` and `brand_assignments`**: Brand configuration and binding of authorized supervisors/specialists.
- **`products` and `procedures`**: Hierarchical product catalog with tone guides, procedures, and FAQs.
- **`conversations` and `messages`**: Timestamped thread history between customer and specialist.
- **`evaluations` and `evaluation_comments`**: Reviews linked at conversation and message levels with qualitative notes.

### How Authorization Is Enforced
- **Server-Side Enforcement**: The active session (simulated via secure cookie) is resolved on the server.
- **Isolation Rules**:
  - Specialists can only query their own conversations, messages, and evaluations. Any attempt to access data from another specialist or unassigned brands is rejected by the server with an authorization error.
  - Supervisors only have access to brands assigned to them.
- **Evolution to Real Authentication**: In production, the session resolver connects directly to Supabase Auth JWT tokens (`auth.uid()`) without modifying the database authorization logic.

---

## 3. AI (Development Process)

### How We Worked with AI
Development followed an agentic pair-programming methodology using Google Antigravity and OpenSpec. Upfront specification definitions and behavioral contracts precisely guided each code artifact.

### Where AI Succeeded vs. Manual Adjustments
- **Benefit of starting with specifications**: Time invested in key specs—such as the core solution concept or the base project structure—prevented inconsistencies and errors in subsequent features.
- **AI Successes**: Rapid generation of relational models, declarative UI components, and creation of realistic seed data with distinct tones and deliberate procedural flaws.
- **Manual Adjustments**: Server authorization testing and strict enforcement of declarative Next.js Server Component patterns. Validation of each completed feature.

---

## 4. Status

### Current Implementation State
- **Completed**:
  - Messaging and conversation viewing.
  - Conversation and message scoring/evaluation services.
  - Role segregation across the system.
  - Base landing / home interface.
  - Base navigation with route-level role validation.
- **Next Priority Order**:
  1. Conversation scoring in UI.
  2. Report generation for metrics export.
  3. Add documentation and FAQ configuration.
