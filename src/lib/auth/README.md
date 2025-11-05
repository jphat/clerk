# RBAC System Documentation

## Overview

This RBAC (Role-Based Access Control) system provides flexible permission management for the Astro application with Clerk authentication. It supports role-based permissions, route protection, and template utilities for conditional rendering.

## Quick Start

### 1. Basic Setup

The RBAC system is already integrated with your Astro application. To get started:

1. Users are automatically assigned the `viewer` role by default
2. Roles can be assigned via Clerk user metadata: `user.publicMetadata.role`
3. All routes are protected by default unless explicitly configured as public

### 2. Assigning Roles to Users

In your Clerk dashboard or via API, set user metadata:

```javascript
// Via Clerk API
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: 'admin' // or 'editor', 'viewer'
  }
})
```

### 3. Using in Templates

```astro
---
import { canWriteContent, isAdmin } from '@/lib/auth/template-utils'
---

{canWriteContent(Astro.locals) && (
  <button>Create New Post</button>
)}

{isAdmin(Astro.locals) && (
  <a href="/admin">Admin Dashboard</a>
)}
```

## Core Concepts

### Roles

The system defines three primary roles:

- **admin**: Full system access with all permissions
- **editor**: Content creation and editing capabilities
- **viewer**: Read-only access (default role for new users)

### Permissions

Three core permissions control access to different functionality:

- **write_content**: Create new content
- **edit_content**: Modify existing content  
- **manage_user**: User management operations

### Route Protection Types

1. **Public Routes**: No authentication required
2. **Authenticated Routes**: Require login but no specific permissions
3. **Permission-based Routes**: Require specific permissions
4. **Admin-only Routes**: Require admin role

## Configuration

### Role and Permission Configuration

The system uses a centralized configuration in `src/lib/auth/rbac-config.ts`:

```typescript
// Default role-permission mappings
export const ROLE_PERMISSIONS: RoleConfig = {
  admin: ['write_content', 'edit_content', 'manage_user'],
  editor: ['write_content', 'edit_content'],
  viewer: []
}

// Default role for new users
export const DEFAULT_ROLE: Role = 'viewer'
```

### Customizing Role Permissions

To modify what permissions each role has:

```typescript
// Example: Give editors user management capabilities
export const ROLE_PERMISSIONS: RoleConfig = {
  admin: ['write_content', 'edit_content', 'manage_user'],
  editor: ['write_content', 'edit_content', 'manage_user'], // Added manage_user
  viewer: ['write_content'] // Give viewers write access
}
```

### Adding Protected Routes

Edit `src/lib/auth/rbac-config.ts` to add new protected routes:

```typescript
export const PROTECTED_ROUTES: RouteConfig[] = [
    // Admin-only route
    { pattern: '/admin/settings', adminOnly: true },
    
    // Permission-based route (user needs ANY of the listed permissions)
    { pattern: '/content/create', permissions: ['write_content'] },
    
    // Multiple permissions (OR logic)
    { pattern: '/content/manage', permissions: ['write_content', 'edit_content'] },
    
    // Wildcard patterns
    { pattern: '/admin/**', adminOnly: true },
    { pattern: '/api/content/**', permissions: ['write_content', 'edit_content'] }
]
```

### Route Pattern Matching

- `**` - Matches any number of path segments (wildcard)
- `*` - Matches a single path segment
- Exact paths match only that specific route
- Patterns are case-sensitive
- More specific patterns should be listed before general ones

### Public Routes

Routes that should never require authentication:

```typescript
export const PUBLIC_ROUTES: string[] = [
    '/',
    '/sign-in',
    '/sign-up',
    '/about',
    '/api/public/**'
]
```

### Authenticated Routes

Routes that require login but no specific permissions:

```typescript
export const AUTHENTICATED_ROUTES: RouteConfig[] = [
    { pattern: '/dashboard', permissions: [] },
    { pattern: '/profile', permissions: [] }
]
```

## Usage in Templates

### Available Template Utilities

The system provides several utility functions for checking permissions in templates:

| Function | Purpose | Returns |
|----------|---------|---------|
| `canWriteContent(locals)` | Check write permission | boolean |
| `canEditContent(locals)` | Check edit permission | boolean |
| `canManageUser(locals)` | Check user management permission | boolean |
| `hasRole(locals, role)` | Check specific role | boolean |
| `isAdmin(locals)` | Check if user is admin | boolean |

### Permission Checking Functions

Use these functions in Astro components to conditionally render content:

```astro
---
import { canWriteContent, canEditContent, canManageUser, hasRole, isAdmin } from '@/lib/auth/template-utils'

const user = Astro.locals.user
---

{canWriteContent(Astro.locals) && (
    <a href="/content/create">Create Content</a>
)}

{canEditContent(Astro.locals) && (
    <a href="/content/edit">Edit Content</a>
)}

{canManageUser(Astro.locals) && (
    <a href="/users">Manage Users</a>
)}

{hasRole(Astro.locals, 'admin') && (
    <a href="/admin">Admin Panel</a>
)}

{isAdmin(Astro.locals) && (
    <button>Admin Action</button>
)}
```

### Advanced Template Examples

#### Conditional Content Blocks

```astro
---
import { canWriteContent, canEditContent, hasRole } from '@/lib/auth/template-utils'
---

<!-- Show different content based on permissions -->
{canWriteContent(Astro.locals) ? (
  <div class="content-creator-dashboard">
    <h2>Content Creator Dashboard</h2>
    <button>Create New Article</button>
    <button>Manage Drafts</button>
  </div>
) : (
  <div class="viewer-dashboard">
    <h2>Welcome, Viewer!</h2>
    <p>Browse our content library</p>
  </div>
)}

<!-- Nested permission checks -->
{canEditContent(Astro.locals) && (
  <div class="editor-tools">
    <button>Edit Mode</button>
    {hasRole(Astro.locals, 'admin') && (
      <button class="danger">Delete Content</button>
    )}
  </div>
)}
```

#### Form Field Permissions

```astro
---
import { canManageUser, isAdmin } from '@/lib/auth/template-utils'
---

<form>
  <input type="text" name="title" placeholder="Title" />
  <textarea name="content" placeholder="Content"></textarea>
  
  {canManageUser(Astro.locals) && (
    <select name="author">
      <option>Select Author</option>
      <!-- Author options -->
    </select>
  )}
  
  {isAdmin(Astro.locals) && (
    <div class="admin-controls">
      <label>
        <input type="checkbox" name="featured" />
        Feature this content
      </label>
      <label>
        <input type="checkbox" name="published" />
        Publish immediately
      </label>
    </div>
  )}
</form>
```

### Menu Component

Use the `PermissionMenu` component for permission-aware navigation:

```astro
---
import PermissionMenu from '@/components/auth/PermissionMenu.astro'

const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Create Content', href: '/content/create', permissions: ['write_content'] },
    { label: 'Edit Content', href: '/content/edit', permissions: ['edit_content'] },
    { label: 'Admin Panel', href: '/admin', permissions: ['manage_user'] }
]
---

<PermissionMenu items={menuItems} />
```

#### Advanced Menu Configuration

```astro
---
import PermissionMenu from '@/components/auth/PermissionMenu.astro'

const menuItems = [
    { 
      label: 'Dashboard', 
      href: '/dashboard' 
      // No permissions = visible to all authenticated users
    },
    { 
      label: 'Content', 
      href: '/content',
      permissions: ['write_content', 'edit_content'], // OR logic - user needs ANY of these
      children: [
        { label: 'Create', href: '/content/create', permissions: ['write_content'] },
        { label: 'Edit', href: '/content/edit', permissions: ['edit_content'] },
        { label: 'Publish', href: '/content/publish', permissions: ['edit_content'] }
      ]
    },
    { 
      label: 'Administration', 
      href: '/admin',
      permissions: ['manage_user'] // Only users with manage_user permission
    }
]
---

<PermissionMenu items={menuItems} />
```

## Middleware Integration

The middleware automatically:

1. Extracts user role from Clerk metadata
2. Calculates user permissions based on role
3. Stores user context in `Astro.locals.user`
4. Checks route protection and redirects to 403 if unauthorized

### User Context Structure

```typescript
interface UserContext {
    id: string
    email: string
    role: Role
    permissions: Permission[]
}
```

Access in components via `Astro.locals.user`.

## Error Handling

### 403 Forbidden Page

The system includes a comprehensive 403 error page that:

- Shows user's current role and permissions
- Provides contextual help messages
- Offers navigation options (Home, Sign In, Go Back)
- Displays troubleshooting tips

### Route Protection Flow

1. Check if route is public → Allow access
2. Check if route requires authentication only → Verify login
3. Check if route is protected → Verify permissions/role
4. Redirect to 403 if unauthorized
5. Redirect to sign-in if not authenticated

## Development Patterns

### Adding New Permissions

Follow these steps to add a new permission (e.g., `delete_content`):

1. **Update Type Definition** in `src/types/auth/index.ts`:
```typescript
export type Permission = 'write_content' | 'edit_content' | 'manage_user' | 'delete_content'
```

2. **Assign to Roles** in `src/lib/auth/rbac-config.ts`:
```typescript
export const ROLE_PERMISSIONS: RoleConfig = {
  admin: ['write_content', 'edit_content', 'manage_user', 'delete_content'],
  editor: ['write_content', 'edit_content'], // No delete for editors
  viewer: []
}
```

3. **Create Template Utility** in `src/lib/auth/template-utils.ts`:
```typescript
export function canDeleteContent(locals: App.Locals): boolean {
  return locals.user?.permissions.includes('delete_content') || false
}
```

4. **Add Route Protection** (if needed):
```typescript
export const PROTECTED_ROUTES: RouteConfig[] = [
  // ... existing routes
  { pattern: '/content/delete/**', permissions: ['delete_content'] }
]
```

5. **Use in Templates**:
```astro
{canDeleteContent(Astro.locals) && (
  <button class="danger">Delete Content</button>
)}
```

### Adding New Roles

Follow these steps to add a new role (e.g., `moderator`):

1. **Update Type Definition** in `src/types/auth/index.ts`:
```typescript
export type Role = 'admin' | 'editor' | 'viewer' | 'moderator'
```

2. **Define Role Permissions** in `src/lib/auth/rbac-config.ts`:
```typescript
export const ROLE_PERMISSIONS: RoleConfig = {
  admin: ['write_content', 'edit_content', 'manage_user'],
  editor: ['write_content', 'edit_content'],
  moderator: ['edit_content'], // Can edit but not create
  viewer: []
}
```

3. **Update Role Assignment Logic** (if using custom logic):
```typescript
export function getUserRole(user: User): Role {
  const role = user.publicMetadata?.role as Role
  const validRoles: Role[] = ['admin', 'editor', 'moderator', 'viewer']
  return validRoles.includes(role) ? role : DEFAULT_ROLE
}
```

### Creating Custom Permission Utilities

For complex permission logic, create custom utilities:

```typescript
// src/lib/auth/custom-utils.ts
import type { App } from 'astro'
import { hasRole, canEditContent } from './template-utils'

export function canModerateContent(locals: App.Locals): boolean {
  return hasRole(locals, 'admin') || 
         hasRole(locals, 'moderator') || 
         canEditContent(locals)
}

export function canAccessAnalytics(locals: App.Locals): boolean {
  return hasRole(locals, 'admin') || hasRole(locals, 'editor')
}

export function canManageOwnContent(locals: App.Locals, contentAuthorId: string): boolean {
  const user = locals.user
  if (!user) return false
  
  // Admins can manage any content
  if (user.role === 'admin') return true
  
  // Users can manage their own content if they have edit permissions
  return user.id === contentAuthorId && canEditContent(locals)
}
```

### Testing Route Protection

Use the test pages to verify role-based access:

- `/test/admin` - Admin only
- `/test/editor` - Editor permissions required
- `/test/viewer` - Any authenticated user

## Security Considerations

1. **Server-side Validation**: All permission checks occur server-side
2. **Template Utilities**: Client-side helpers are for UX only, not security
3. **Role Storage**: Roles stored in Clerk metadata are tamper-resistant
4. **Default Deny**: Unknown routes default to most restrictive access
5. **Route Enumeration**: Use 404 responses to prevent route discovery

## API Reference

### Core Functions

#### `getUserRole(user: User): Role`
Extracts role from Clerk user metadata with fallback to default role.

#### `getUserPermissions(role: Role): Permission[]`
Returns array of permissions for a given role.

#### `hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean`
Checks if user has a specific permission.

#### `hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean`
Checks if user has any of the required permissions (OR logic).

#### `isRouteProtected(pathname: string, userPermissions: Permission[], userRole: Role): { allowed: boolean, reason?: string }`
Determines if user can access a specific route.

### Template Utilities

All template utilities accept `App.Locals` and return `boolean`:

- `canWriteContent(locals)` - Check write_content permission
- `canEditContent(locals)` - Check edit_content permission  
- `canManageUser(locals)` - Check manage_user permission
- `hasRole(locals, role)` - Check specific role
- `isAdmin(locals)` - Check if user has admin role

## Troubleshooting

### Common Issues

1. **Route not protected**: 
   - Check pattern matching in `PROTECTED_ROUTES`
   - Verify route patterns are in correct order (specific before general)
   - Ensure middleware is running on the route

2. **Permission denied**: 
   - Verify user role assignment in Clerk metadata
   - Check role-permission mappings in `ROLE_PERMISSIONS`
   - Confirm user is authenticated

3. **Template functions not working**: 
   - Ensure user context is available in `Astro.locals`
   - Check that middleware is properly configured
   - Verify imports are correct

4. **Middleware not running**: 
   - Verify `src/middleware/index.ts` is properly configured
   - Check that Clerk middleware is set up correctly
   - Ensure route is not excluded from middleware

### Debug Information

The 403 error page shows current user role and permissions for debugging.

### Testing Permissions

1. **Use Test Pages**: Visit `/test/admin`, `/test/editor`, `/test/viewer` to test role access
2. **Browser DevTools**: Inspect `Astro.locals.user` in server-side context
3. **Console Logging**: Add temporary logging in middleware or components:

```typescript
// In middleware or component
console.log('User context:', Astro.locals.user)
console.log('Current route:', Astro.url.pathname)
```

### Performance Debugging

Monitor middleware performance:

```typescript
// Add to middleware for performance monitoring
const start = Date.now()
// ... RBAC logic
console.log(`RBAC check took ${Date.now() - start}ms`)
```

## Migration Guide

### From Basic Auth to RBAC

If migrating from a simpler authentication system:

1. **Update User Metadata**: Add roles to existing users in Clerk
2. **Replace Auth Checks**: Replace simple `user` checks with permission checks
3. **Update Routes**: Configure route protection in `PROTECTED_ROUTES`
4. **Update Components**: Replace auth checks with permission utilities

### Breaking Changes

When updating the RBAC system:

1. **Type Changes**: Update imports if types are modified
2. **Permission Changes**: Audit existing permission checks
3. **Route Changes**: Test all protected routes after configuration changes
4. **Component Updates**: Update components using deprecated utilities