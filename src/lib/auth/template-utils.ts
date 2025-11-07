/**
 * Template Utility Functions
 *
 * Helper functions for use in Astro components and templates to check user permissions
 * and roles. These functions work with Astro locals context and provide a clean API
 * for conditional rendering based on user capabilities.
 */

import type { Role, Permission } from '@/types/auth';

/**
 * Check if the current user can write content
 *
 * @param locals - Astro locals object containing user context
 * @returns True if user has write_content permission
 */
export function canWriteContent(locals: App.Locals): boolean {
	return locals.user?.permissions?.includes('write_content') || false;
}

/**
 * Check if the current user can edit content
 *
 * @param locals - Astro locals object containing user context
 * @returns True if user has edit_content permission
 */
export function canEditContent(locals: App.Locals): boolean {
	return locals.user?.permissions?.includes('edit_content') || false;
}

/**
 * Check if the current user can manage users
 *
 * @param locals - Astro locals object containing user context
 * @returns True if user has manage_user permission
 */
export function canManageUser(locals: App.Locals): boolean {
	return locals.user?.permissions?.includes('manage_user') || false;
}

/**
 * Check if the current user has a specific role
 *
 * @param locals - Astro locals object containing user context
 * @param role - Role to check for
 * @returns True if user has the specified role
 */
export function hasRole(locals: App.Locals, role: Role): boolean {
	return locals.user?.role === role;
}

/**
 * Check if the current user is an admin
 *
 * @param locals - Astro locals object containing user context
 * @returns True if user has admin role
 */
export function isAdmin(locals: App.Locals): boolean {
	return locals.user?.role === 'admin';
}

/**
 * Check if the current user has a specific permission
 *
 * @param locals - Astro locals object containing user context
 * @param permission - Permission to check for
 * @returns True if user has the specified permission
 */
export function hasPermission(
	locals: App.Locals,
	permission: Permission,
): boolean {
	return locals.user?.permissions?.includes(permission) || false;
}

/**
 * Check if the current user has any of the specified permissions
 *
 * @param locals - Astro locals object containing user context
 * @param permissions - Array of permissions to check for
 * @returns True if user has at least one of the specified permissions
 */
export function hasAnyPermission(
	locals: App.Locals,
	permissions: Permission[],
): boolean {
	if (!locals.user?.permissions) {
		return false;
	}

	return permissions.some((permission) =>
		locals.user!.permissions.includes(permission),
	);
}

/**
 * Check if the current user is authenticated
 *
 * @param locals - Astro locals object containing user context
 * @returns True if user is authenticated (user context exists)
 */
export function isAuthenticated(locals: App.Locals): boolean {
	return !!locals.user;
}

/**
 * Get the current user's role, with fallback
 *
 * @param locals - Astro locals object containing user context
 * @returns User's role or 'viewer' if not authenticated
 */
export function getUserRole(locals: App.Locals): Role {
	return locals.user?.role || 'viewer';
}

/**
 * Get the current user's permissions
 *
 * @param locals - Astro locals object containing user context
 * @returns Array of user's permissions, empty array if not authenticated
 */
export function getUserPermissions(locals: App.Locals): Permission[] {
	return locals.user?.permissions || [];
}
