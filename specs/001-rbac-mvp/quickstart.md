# Quickstart: RBAC MVP

This guide shows how to configure roles and permissions, protect routes, and use template helpers.

## 1) Define roles for users

- Assign a role string ("admin", "editor", or "viewer") to the authenticated user's profile metadata.
- During local E2E tests, use the provided test fixtures to simulate roles.

## 2) Route protection

- Maintain two route lists: `protectedRoutes[]` (Admin + Editor) and `adminOnlyRoutes[]` (Admin only).
- Middleware reads these lists and populates a `UserContext` on request locals, then enforces access.
- Unauthorized access results in a forbidden page.

## 3) Menu visibility

- Each menu item includes `permissions: string[]`.
- Items are visible if the user has any of the listed permissions (OR semantics), or if the list is empty.

## 4) Template helpers

- Use helpers in templates to conditionally render features:
  - `canWriteContent()`
  - `canEditContent()`
  - `canManageUser()`
- Helpers return `true` only if the current user has the required permission.

## 5) Types and contracts

- Reference the data model in `data-model.md` and JSON Schemas in `contracts/` for `UserContext` and `MenuItem`.

## 6) Testing

- Unit tests verify the helpers and mapping logic.
- E2E tests verify route access per role and menu visibility.
