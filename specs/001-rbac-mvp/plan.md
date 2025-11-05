# Implementation Plan: RBAC MVP

**Branch**: `001-rbac-mvp` | **Date**: 2025-11-05 | **Spec**: specs/001-rbac-mvp/spec.md
**Input**: Feature specification from `/specs/001-rbac-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Introduce a minimal, maintainable role-based access control (RBAC) layer with:
- Route protection (protected vs admin-only) enforced in middleware using a central route list and request-scoped user context.
- Menu visibility driven by each item's permissions array (visible if user has any listed permission).
- Template helpers (canWriteContent, canEditContent, canManageUser) to simplify conditional rendering.

Technical approach (Phase 0 research decisions):
- Source role from authenticated user's profile metadata; derive effective permissions via a static mapping.
- Populate Astro locals with a normalized UserContext (auth state, role, permissions) in middleware.
- Declare protected/admin routes centrally to avoid drift and enable testing.
- Provide types in `src/types/auth/` and utilities in `src/lib/auth/`.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (ESNext), Astro 5  
**Primary Dependencies**: Clerk (auth), Astro core, Vue 3 (islands), Tailwind CSS  
**Storage**: N/A (no new persistence for MVP)  
**Testing**: Unit: Vitest; E2E: Playwright (smoke + role/route checks)  
**Target Platform**: Web (SSR + islands)
**Project Type**: single project  
**Performance Goals**: Maintain Lighthouse Performance ≥ 90 on key pages  
**Constraints**: Middleware authorization p95 < 10ms in local dev; minimize client JS  
**Scale/Scope**: MVP scope (3 roles, 3 permissions, route/menu gating)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Planned adherence to gates:
- Build passes (`astro build`).
- Type-check passes (`astro check`).
- Formatting passes (Prettier) and spelling passes (cspell).
- Tests: Vitest unit tests for auth utils; Playwright e2e for protected/admin routes and menu visibility.

Violations: None expected. If any gate fails, the PR MUST be blocked until addressed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── lib/
│   └── auth/
│       ├── index.ts            # RBAC utilities export (helpers, mapping)
│       └── utils.ts            # canWriteContent/canEditContent/canManageUser
├── middleware/
│   └── index.ts                # Populate locals.user, enforce route protection
├── types/
│   └── auth/
│       └── index.ts            # Role, Permission, UserContext, MenuItem types
└── pages/
  ├── 403.astro               # Forbidden page
  └── test/                   # Role test pages (admin/editor/viewer)

tests/
├── e2e/
│   └── smoke.spec.ts           # Expand with role/route/menu checks
└── unit/
  └── auth.spec.ts            # Unit tests for RBAC utilities
```

**Structure Decision**: Single-project structure using existing `src/` and `tests/` directories. Auth types in `src/types/auth`, helpers in `src/lib/auth`, and route enforcement in `src/middleware/index.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

Re-check after Phase 1 design: No new violations introduced.
