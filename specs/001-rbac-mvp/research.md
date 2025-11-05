# Research: RBAC MVP

## Decisions and Rationale

### Role Source
- Decision: Use the authenticated user's profile metadata to obtain a role string: one of "admin", "editor", or "viewer".
- Rationale: Simple and explicit; avoids coupling to provider-specific claims beyond a single field.
- Alternatives considered:
  - Custom JWT claims: Tighter coupling to token issuance; adds complexity for MVP.
  - Server-side store: Out of scope for MVP; adds persistence and admin UI requirements.

### Permission Mapping
- Decision: Derive permissions from role via a static mapping constant.
  - admin → [write_content, edit_content, manage_user]
  - editor → [write_content, edit_content]
  - viewer → []
- Rationale: Fixed mapping satisfies MVP; easy to extend later.
- Alternatives considered: Dynamic grant tables or policy engine (overkill for MVP).

### Route Protection Configuration
- Decision: Centralize protected and admin-only route lists in a single module consumed by middleware.
- Rationale: Single source of truth enables testing and avoids drift.
- Alternatives considered: Per-page flags (error-prone), path regex scattered in code (hard to audit).

### Request-scoped User Context
- Decision: Populate a normalized `UserContext` on request locals with: `isAuthenticated`, `role`, `permissions`.
- Rationale: Enables consistent access throughout middleware and templates.
- Alternatives considered: Global singleton (incorrect across requests) or repeated lookups (duplicated logic).

### Menu Visibility Logic
- Decision: Each `MenuItem` has a `permissions: string[]`. Visibility uses OR semantics: visible if user has any listed permission, or if list is empty.
- Rationale: Matches spec and common UX expectations.
- Alternatives considered: AND semantics (too restrictive for MVP), role-based lists (less flexible).

### Template Utilities
- Decision: Provide boolean helpers `canWriteContent`, `canEditContent`, `canManageUser` that read from `UserContext`.
- Rationale: Readable, reduces duplication in templates.
- Alternatives considered: Generic `hasPermission()` only (less ergonomic for templates).

### Logging
- Decision: Log access decisions at an info/debug granularity suitable for troubleshooting without exposing sensitive data to users.
- Rationale: Aids debugging while respecting UX and security.

## Open Questions (resolved)
- None; MVP assumptions are established above and consistent with specification.
