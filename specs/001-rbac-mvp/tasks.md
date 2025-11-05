---

description: "Task list for RBAC MVP implementation"
---

# Tasks: RBAC MVP

**Input**: Design documents from `/specs/001-rbac-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per the Constitution. Include unit tests (Vitest) and E2E smoke tests (Playwright) for user journeys; write tests first where feasible.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm repo scaffolding and testing harness are ready to extend

- [ ] T001 Ensure feature branch checked out `001-rbac-mvp` (no-op if already on branch)
- [ ] T002 [P] Verify formatting and spelling configs exist (prettier, cspell) and run checks on current changes
- [ ] T003 [P] Verify test runners work by running unit and e2e smoke baselines (`vitest`, `playwright`) 

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core RBAC scaffolding and central configs required by all stories

- [ ] T004 Create `src/types/auth/index.ts` with Role, Permission, UserContext, MenuItem types
- [ ] T005 Create `src/lib/auth/index.ts` exporting permission constants, role→permission map, and helpers
- [ ] T006 [P] Create `src/lib/auth/utils.ts` with `canWriteContent`, `canEditContent`, `canManageUser` (reading from UserContext)
- [ ] T007 [P] Define central route lists in `src/lib/auth/routes.ts` (export `protectedRoutes`, `adminOnlyRoutes`)
- [ ] T008 Implement locals typing augmentation for request context in `src/types/index.ts` (extend with `user?: UserContext`)
- [ ] T009 Implement middleware population of `locals.user` and enforcement in `src/middleware/index.ts`
- [ ] T010 Update docs quickstart if needed at `specs/001-rbac-mvp/quickstart.md` to reflect final paths

### Foundational Tests (REQUIRED)

- [ ] T011 [P] Add unit tests for role→permission mapping and helpers in `tests/unit/auth.spec.ts`
- [ ] T012 [P] Extend e2e `tests/e2e/smoke.spec.ts` with role/route access checks (protected vs admin-only)

**Checkpoint**: Foundation ready — user stories can begin in parallel

---

## Phase 3: User Story 1 - Route protection and access control (Priority: P1) 🎯 MVP

**Goal**: Enforce protected vs admin-only access outcomes per role and unauthenticated state

**Independent Test**: Visiting representative routes with simulated roles yields access or 403 as specified

### Tests (REQUIRED)

- [ ] T013 [P] [US1] Add e2e tests for Admin access to protected and admin-only routes in `tests/e2e/smoke.spec.ts`
- [ ] T014 [P] [US1] Add e2e tests for Editor access (allowed on protected, blocked on admin-only) in `tests/e2e/smoke.spec.ts`
- [ ] T015 [P] [US1] Add e2e tests for Viewer/Unauthenticated access (blocked on protected/admin-only) in `tests/e2e/smoke.spec.ts`

### Implementation

- [ ] T016 [US1] Finalize route lists in `src/lib/auth/routes.ts` (protected/admin-only)
- [ ] T017 [US1] Ensure middleware redirects/renders 403 correctly in `src/middleware/index.ts`
- [ ] T018 [US1] Ensure `src/pages/403.astro` renders a clear forbidden page

**Checkpoint**: User Story 1 independently testable (e2e passing)

---

## Phase 4: User Story 2 - Menu visibility by permissions (Priority: P2)

**Goal**: Show/hide menu items based on user permissions (OR semantics; empty list visible to all)

**Independent Test**: Rendering header/menu with different roles shows correct items

### Tests (REQUIRED)

- [ ] T019 [P] [US2] Add unit tests for `MenuItem` visibility function in `tests/unit/auth.spec.ts`
- [ ] T020 [P] [US2] Add e2e checks asserting menu items render per permissions in `tests/e2e/smoke.spec.ts`

### Implementation

- [ ] T021 [US2] Add a visibility helper `isMenuItemVisible(user, item)` in `src/lib/auth/utils.ts`
- [ ] T022 [US2] Wire Header component `src/components/site/Header.astro` to filter `menu` by visibility helper
- [ ] T023 [US2] Provide example menu configuration with permissions in `src/lib/auth/menu.ts`

**Checkpoint**: User Story 2 independently testable (unit + e2e pass)

---

## Phase 5: User Story 3 - Template permission utilities (Priority: P3)

**Goal**: Enable templates to render conditionally using `canWriteContent`, `canEditContent`, `canManageUser`

**Independent Test**: Helpers return correct booleans for all roles and unauthenticated state

### Tests (REQUIRED)

- [ ] T024 [P] [US3] Unit tests for template helpers across all roles in `tests/unit/auth.spec.ts`
- [ ] T025 [P] [US3] Add sample template assertions using role fixtures in `tests/e2e/smoke.spec.ts`

### Implementation

- [ ] T026 [US3] Export helpers for template usage via `src/lib/auth/index.ts` and update docs
- [ ] T027 [US3] Demonstrate helpers in `src/pages/test/{admin,editor,viewer}.astro` without leaking protected content

**Checkpoint**: User Story 3 independently testable (unit + e2e pass)

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T028 [P] Documentation updates for roles, permissions, menus, and routes in `specs/001-rbac-mvp/quickstart.md`
- [ ] T029 Code cleanup and refactoring for auth modules `src/lib/auth/*.ts`
- [ ] T030 Performance tuning for middleware checks in `src/middleware/index.ts`
- [ ] T031 [P] Additional unit tests for edge cases in `tests/unit/auth.spec.ts`
- [ ] T032 Security hardening review of access logs and error paths (no sensitive leaks)

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies
- Foundational (Phase 2): Depends on Setup completion — BLOCKS all user stories
- User Stories (Phase 3+): Depend on Foundational completion
- Polish (Final Phase): Depends on desired stories being complete

### User Story Dependencies

- User Story 1 (P1): No dependency on other stories
- User Story 2 (P2): Depends on Foundational; ideally after US1 to reuse route enforcement
- User Story 3 (P3): Depends on Foundational; can run parallel with US2 after US1 completes

### Parallel Opportunities

- [P] tasks in Phase 2 can run concurrently (T006, T007, T011, T012)
- Within US1, e2e tests per role can be authored in parallel (T013–T015)
- US2 unit and e2e checks can run in parallel (T019, T020)
- US3 tests and demonstration updates can be parallelized (T024, T025)

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup
2. Complete Foundational
3. Complete US1 and validate e2e access control
4. Stop and validate — deploy/demo if ready

### Incremental Delivery
1. Add US2 (menu visibility) → test independently → deploy/demo
2. Add US3 (template helpers) → test independently → deploy/demo

