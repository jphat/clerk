# Feature Specification: RBAC MVP

**Feature Branch**: `[001-rbac-mvp]`  
**Created**: 2025-11-05  
**Status**: Draft  
**Input**: User description: "add mvp rbac functionality. use miniminal, well-documented code to promote maintenability. clerk authenticated users will have one role either, admin, editor, or viewer. flexible permissions, start with three: write_content, edit_content, manage_user. include utiliies to allow in-template conditional rendering, e.g.: canWriteContent, canEditContent, canManageUser. middleware should include list of proteced and admin routes. menu items have a permissions array that will render based on the user's permissions. use Astro locals in middleware to store user data so they are accessible app wide."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Route protection and access control (Priority: P1)

Authenticated users with different roles encounter appropriate access outcomes on protected and admin-only routes.

**Why this priority**: Prevents unauthorized access and is foundational for all other role-based behavior.

**Independent Test**: Visiting representative protected/admin routes with simulated user roles results in access or a forbidden page, independently verifiable without other stories.

**Acceptance Scenarios**:

1. Given an authenticated Admin, when visiting a protected route, then the page loads successfully.
2. Given an authenticated Admin, when visiting an admin-only route, then the page loads successfully.
3. Given an authenticated Editor, when visiting a protected route, then the page loads successfully.
4. Given an authenticated Editor, when visiting an admin-only route, then the user is redirected to a 403 page.
5. Given an authenticated Viewer, when visiting a protected route, then the user is redirected to a 403 page.
6. Given an unauthenticated user, when visiting a protected or admin-only route, then the user is redirected to a 403 page.

---

### User Story 2 - Menu visibility by permissions (Priority: P2)

Users only see navigation/menu items that match their granted permissions.

**Why this priority**: Reduces confusion and prevents accidental access attempts by hiding unavailable actions.

**Independent Test**: Rendering the navigation with different user roles shows/hides items strictly based on each item's permission list.

**Acceptance Scenarios**:

1. Given an Admin, when viewing the menu, then all items with any of the defined permissions are visible.
2. Given an Editor, when viewing the menu, then items requiring write_content or edit_content are visible, and items requiring manage_user are hidden.
3. Given a Viewer, when viewing the menu, then items requiring write_content, edit_content, or manage_user are hidden.
4. Given a menu item with an empty permission list, when any user views the menu, then the item is visible to all users.

---

### User Story 3 - Template permission utilities (Priority: P3)

Templates can conditionally render content using simple permission checks.

**Why this priority**: Enables consistent, readable templates and avoids duplicating permission logic.

**Independent Test**: Calling boolean helpers in isolation with different roles returns expected results and controls rendering fragments accordingly.

**Acceptance Scenarios**:

1. Given an Admin context, when checking canWriteContent/canEditContent/canManageUser, then they all return true.
2. Given an Editor context, when checking canWriteContent and canEditContent, then both return true; and canManageUser returns false.
3. Given a Viewer context, when checking canWriteContent/canEditContent/canManageUser, then they all return false.
4. Given a missing or unknown role, when checking any helper, then all helpers return false.

### Edge Cases

- Unauthenticated user attempts to access any protected/admin route → forbidden page is shown.
- Unknown role or corrupted user context → treat as least-privileged (no permissions).
- Menu items with multiple required permissions → visible if the user has at least one listed permission (OR logic).
- Permission list typos in menu configuration → item treated as not visible to non-admins.

## Requirements *(mandatory)*

### Functional Requirements

- FR-001: The system MUST support exactly three roles: Admin, Editor, Viewer. Each authenticated user has exactly one role at a time.
- FR-002: The system MUST define three named permissions: write_content, edit_content, manage_user.
- FR-003: Role-to-permission mapping MUST be as follows: Admin → all permissions; Editor → write_content, edit_content; Viewer → no permissions.
- FR-004: There MUST be designated protected routes and admin-only routes. Admin-only routes are accessible only to Admin; protected routes are accessible to Admin and Editor.
- FR-005: Unauthorized access to protected/admin routes MUST result in a redirect or render of a forbidden page (403) without exposing protected content.
- FR-006: The system MUST expose a request-scoped user context accessible across middleware and templates for the current request, including authentication state, role, and effective permissions.
- FR-007: Menu items MUST declare a permissions list. A menu item is visible to a user if the user has at least one permission listed for that item or the list is empty.
- FR-008: The system MUST provide simple boolean utilities for use in templates: canWriteContent, canEditContent, canManageUser, which return true only if the current user has the corresponding permission.
- FR-009: When user context is missing or invalid, the system MUST treat the user as unauthenticated with no permissions.
- FR-010: The system MUST log access control decisions at an appropriate level for troubleshooting without leaking sensitive information to end users.
- FR-011: Configuration for which routes are protected vs admin-only MUST be centrally declared to avoid drift and enable testing.
- FR-012: Documentation MUST describe the roles, permissions, and how to configure menu visibility and protected routes.

### Key Entities *(include if feature involves data)*

- Role: A named classification for a user (Admin, Editor, Viewer). Determines baseline permissions.
- Permission: A named capability (write_content, edit_content, manage_user). May be granted via role.
- UserContext: Per-request data containing authentication status, role, and derived permissions for the current user.
- MenuItem: A navigational entry with label, destination, and a list of required permissions controlling visibility.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- SC-001: For each role and unauthenticated state, protected/admin routes produce the expected outcome (access or forbidden) in 100% of tested cases.
- SC-002: Menu visibility matches the role-permission mapping in 100% of tested cases across the navigation set.
- SC-003: Template utilities return correct results for all roles and unauthenticated state in 100% of tested combinations.
- SC-004: Unauthorized users reach a forbidden page within 1 second of request initiation under normal test conditions.
