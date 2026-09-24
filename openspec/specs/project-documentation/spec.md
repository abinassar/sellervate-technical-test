# Capability: project-documentation

## Purpose

Defines the structure and requirements for the project decisions record (DECISIONS.md in EN/ES) and base conceptual documentation.

## Requirements

### Requirement: Bilingual Architectural and Product Decisions Record
The system documentation SHALL provide a comprehensive decisions record in both English (`docs/en/DECISIONS.md`) and Spanish (`docs/es/DECISIONS.md`) structured into four distinct sections: Product, Architecture, AI, and Status.

#### Scenario: Verify English and Spanish decision files exist
- **WHEN** a reviewer examines the repository documentation structure
- **THEN** `docs/en/DECISIONS.md` and `docs/es/DECISIONS.md` exist and contain Product, Architecture, AI, and Status sections.

#### Scenario: Verification of the three-question methodology in documentation
- **WHEN** reading the decisions document
- **THEN** the Product and Architecture sections clearly reflect the "Qué quiero", "Qué tengo", and "Cómo lo hago" analysis derived from the technical test brief.

### Requirement: Base Project Concepts Document
The repository SHALL contain a centralized conceptual document (`docs/general-prompts/project-base-concepts.md`) detailing the role responsibilities, conversation flows, evaluation criteria, and system constraints.

#### Scenario: Accessing base concepts document
- **WHEN** an engineer or agent consults `docs/general-prompts/project-base-concepts.md`
- **THEN** it provides complete operational context on brand-specific voice, specialist isolation, team lead review loops, and metrics.

