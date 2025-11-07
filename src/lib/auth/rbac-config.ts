/**
 * RBAC Configuration
 *
 * This module defines the core configuration for the role-based access control system,
 * including role-permission mappings and protected route definitions.
 */

import type { Role, Permission, RoleConfig, RouteConfig } from '@/types/auth';

/**
 * Default role assigned to new users
 */
export const DEFAULT_ROLE: Role = 'viewer';

/**
 * Role-permission mapping configuration
 *
 * Defines which permissions are granted to each role:
 * - admin: Full access to all permissions
 * - editor: Content creation and editing permissions
 * - viewer: No special permissions (read-only access)
 */
export const ROLE_PERMISSIONS: RoleConfig = {
	admin: ['write_content', 'edit_content', 'manage_user'],
	editor: ['write_content', 'edit_content'],
	viewer: [],
};

/**
 * Protected routes configuration
 *
 * Defines routes that require specific permissions or admin access.
 * Routes are matched using pattern matching where ** indicates wildcard matching.
 *
 * Route Protection Patterns:
 *
 * 1. Admin-only routes: Use `adminOnly: true` for routes that require admin role
 *    Example: { pattern: '/a/**', adminOnly: true }
 *
 * 2. Permission-based routes: Use `permissions: [...]` for routes requiring specific permissions
 *    Example: { pattern: '/content/create', permissions: ['write_content'] }
 *
 * 3. Multiple permissions: User needs ANY of the listed permissions (OR logic)
 *    Example: { pattern: '/content/**', permissions: ['write_content', 'edit_content'] }
 *
 * 4. Pattern matching rules:
 *    - Use ** for wildcard matching (matches any path segment)
 *    - Use * for single segment matching
 *    - Exact paths match only that specific route
 *    - Patterns are case-sensitive
 *
 * 5. Route precedence: More specific patterns should be listed before general ones
 *    Example: '/a/users/create' should come before '/a/**'
 */
export const PROTECTED_ROUTES: RouteConfig[] = [
	// Admin-only routes (require admin role)
	{ pattern: '/a', adminOnly: true }, // Exact /a route
	{ pattern: '/a/**', adminOnly: true }, // All /a/* routes

	// Test pages for different roles (used for development/testing)
	{ pattern: '/test/admin', adminOnly: true },
	{ pattern: '/test/editor', permissions: ['write_content', 'edit_content'] },
	{ pattern: '/test/viewer', permissions: [] }, // Authenticated users only

	// Content management routes
	{ pattern: '/content/create', permissions: ['write_content'] },
	{ pattern: '/content/edit/**', permissions: ['edit_content'] },
	{
		pattern: '/content/publish/**',
		permissions: ['write_content', 'edit_content'],
	},
	{ pattern: '/content/delete/**', permissions: ['edit_content'] },

	// User management routes
	{ pattern: '/a/users/**', permissions: ['manage_user'] },
	{ pattern: '/a/users/profile/edit', permissions: ['manage_user'] },
	{ pattern: '/a/users/roles/**', adminOnly: true },

	// API routes (if needed for future API endpoints)
	{ pattern: '/api/a/**', adminOnly: true },
	{
		pattern: '/api/content/**',
		permissions: ['write_content', 'edit_content'],
	},
	{ pattern: '/api/users/**', permissions: ['manage_user'] },

	// Settings and configuration
	{ pattern: '/settings/system/**', adminOnly: true },
	{ pattern: '/settings/user/**', permissions: [] }, // Any authenticated user
];

/**
 * Public routes that should never be protected
 * These routes are explicitly excluded from protection checks
 */
export const PUBLIC_ROUTES: string[] = [
	'/',
	'/sign-in',
	'/sign-up',
	'/404',
	'/403',
	'/500',
	'/about',
	'/contact',
	'/privacy',
	'/terms',
	'/api/public/**',
];

/**
 * Routes that require authentication but no specific permissions
 * Users just need to be logged in to access these routes
 */
export const AUTHENTICATED_ROUTES: RouteConfig[] = [
	{ pattern: '/u', permissions: [] },
	{ pattern: '/profile', permissions: [] },
	{ pattern: '/settings/account', permissions: [] },

	// User area routes - require authentication only
	{ pattern: '/u', permissions: [] },
	{ pattern: '/u/**', permissions: [] },

	// Note: /a/** routes are admin-only and configured in PROTECTED_ROUTES
];

/**
 * All available permissions in the system
 */
export const ALL_PERMISSIONS: Permission[] = [
	'write_content',
	'edit_content',
	'manage_user',
];

/**
 * All available roles in the system
 */
export const ALL_ROLES: Role[] = ['admin', 'editor', 'viewer'];
