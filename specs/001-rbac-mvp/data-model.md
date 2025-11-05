# Data Model: RBAC MVP

## Entities

### Role
- Description: A named classification for a user.
- Values: "admin", "editor", "viewer"
- Validation: Must be one of the allowed values.

### Permission
- Description: A named capability granted to a role.
- Values: "write_content", "edit_content", "manage_user"
- Validation: Must be one of the allowed values.

### UserContext
- Description: Request-scoped data for the current user.
- Fields:
  - `isAuthenticated` (boolean) — true if the user is authenticated
  - `role` (Role | null) — null if unauthenticated or unknown
  - `permissions` (Permission[]) — derived from `role`, empty if unauthenticated/unknown
- Invariants:
  - If `role` is null → `permissions` MUST be an empty list
  - If `role` is "admin" → `permissions` MUST include all permissions

### MenuItem
- Description: A navigation entry conditionally visible based on permissions.
- Fields:
  - `label` (string)
  - `href` (string)
  - `permissions` (Permission[]) — empty list means visible to all authenticated users; OR semantics when non-empty
- Rules:
  - Visible if user has at least one permission from `permissions`, or if `permissions` is empty.

## Relationships
- Role → Permission: One-to-many via static mapping.
- UserContext → Role: One-to-one per request; may be null.
- MenuItem → Permission: Many-to-many via `permissions` array.

## State Transitions
- Authentication state changes from unauthenticated → authenticated assign a `role` and derived `permissions`.
- Changing a user's `role` (out of scope for MVP UI) changes derived `permissions` accordingly.
