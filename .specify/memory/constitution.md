<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles: N/A (new document)
Added sections: Core Principles (4), Quality Gates & CI, Development Workflow & Reviews, Governance
Removed sections: Template placeholders for unused Principle 5
Templates requiring updates:
	- ✅ .specify/templates/tasks-template.md (tests now REQUIRED)
	- ✅ .specify/templates/spec-template.md (already aligned; no change)
	- ✅ .specify/templates/plan-template.md (Constitution Check remains generic; no change)
	- ✅ .specify/templates/agent-file-template.md (no conflicting guidance)
	- ✅ .specify/templates/checklist-template.md (no conflicting guidance)
Follow-up TODOs:
	- TODO(RATIFICATION_DATE): Original adoption date unknown; set when approved by maintainer.
-->

# Clerk Constitution

## Core Principles

### I. Code Quality Discipline (NON-NEGOTIABLE)
All code MUST be readable, consistent, and maintainable.
- Formatting: Prettier is mandatory (repo config enforced via `prettier` and `prettier-plugin-astro`).
- Types: Type-checks via `astro check` MUST pass; avoid `any` and prefer explicit types.
- Structure: Keep components small, single-purpose; avoid premature abstraction (YAGNI).
- Naming: Descriptive names; no abbreviations that obscure intent.
- Spelling: cspell MUST pass on changed files.
Rationale: Predictable, consistent code lowers defects and accelerates onboarding.

### II. Testing Standards (MANDATORY)
Every change MUST be covered by automated tests appropriate to its scope.
- Unit tests: Use Vitest for logic and utilities (`tests/unit`), aim for >80% coverage in critical modules.
- E2E smoke: Use Playwright for primary user journeys in `tests/e2e` (at minimum `smoke.spec.ts`).
- Middleware and auth: Add tests for role/permission gates (admin/editor/viewer) when behavior changes.
- Test-first encouraged: Write tests before implementation when feasible; at minimum ensure failing test precedes fix.
Rationale: Test safety nets enable refactoring and prevent regressions in auth/UX flows.

### III. User Experience Consistency
UX MUST remain coherent, accessible, and aligned with the design system.
- Components: Prefer shadcn-vue primitives and existing UI patterns for buttons, groups, and separators.
- Styling: Use Tailwind tokens/utilities consistently; avoid inline styles when class utilities exist.
- Accessibility: Semantic HTML, focus management, and ARIA where needed; color contrast respected.
- Layout/SEO: Keep shared wrappers (Layout.astro, SEOHead.astro) consistent across pages.
Rationale: Consistency reduces cognitive load and improves usability across routes.

### IV. Performance Requirements
Pages and interactions MUST meet baseline performance budgets.
- Rendering: Keep client-side JS minimal; leverage Astro islands and SSR by default.
- Assets: Use optimized images/assets; avoid unoptimized large bundles.
- Metrics: Target Lighthouse Performance ≥ 90 on key pages; avoid regressions in TTI/CLS.
- Middleware: Authorization checks should complete in p95 < 10ms in local dev; no blocking I/O on hot paths.
Rationale: Fast experiences improve retention and scale; Astro encourages lean delivery—preserve it.

## Quality Gates & CI
The following gates MUST pass before merge:
- Build: `astro build` succeeds with no errors.
- Type-check: `astro check` passes.
- Formatting: `prettier --check` passes; no style drift.
- Spelling: `cspell` passes on touched files.
- Tests: `vitest` unit tests pass and Playwright e2e smoke passes.
Enforcement: PRs failing any gate MUST NOT be merged; reviewers enforce compliance.

## Development Workflow & Reviews
- Branching: Feature branches named `[###-feature-name]` when part of a spec; otherwise `feat/*`, `fix/*`, `chore/*`.
- Specs & Plans: Use `/speckit.specify` and `/speckit.plan` for non-trivial work; ensure Constitution Check is satisfied.
- Reviews: At least one reviewer on all non-trivial changes; block on gate failures and unresolved comments.
- Documentation: Update README and in-code docs when behavior or contracts change.
- Change Scope: Prefer small, focused PRs that map to one user story or fix.

## Governance
This constitution supersedes ad-hoc conventions. Amendments require:
1) A PR describing the change and rationale, 2) Version bump per policy below, 3) Any migration/consistency updates.

Versioning Policy (governance document):
- MAJOR: Backward-incompatible changes to principles or governance.
- MINOR: New principle/section or material expansion of guidance.
- PATCH: Clarifications, wording, and non-semantic refinements.

Compliance Reviews:
- Reviewers MUST verify principles and gates are satisfied on each PR.
- Violations require explicit justification and follow-up tasks if accepted.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-11-05
