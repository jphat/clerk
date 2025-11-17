import type { Role, Permissions } from '@/types';
import type { User } from '@clerk/astro/server';

const PERMISSIONS_VIEWER =
	(import.meta.env.PERMISSIONS_VIEWER?.split(',') as string[]) || [];
const PERMISSIONS_EDITOR =
	(import.meta.env.PERMISSIONS_EDITOR?.split(',') as string[]) || [];
const PERMISSIONS_ADMIN =
	(import.meta.env.PERMISSIONS_ADMIN?.split(',') as string[]) || [];

/**
 * Default role assigned to new users
 */
export const DEFAULT_ROLE: Role = 'viewer';
export const DEFAULT_PERMISSIONS: Permissions[] = PERMISSIONS_VIEWER;

export function setUserRole(user: User): Role {
	// Check user metadata for role assignment
	const metadataRole = user.publicMetadata?.role as Role;

	// Validate that the role exists in our system
	if (
		metadataRole &&
		(metadataRole === 'admin' ||
			metadataRole === 'editor' ||
			metadataRole === 'viewer')
	) {
		return metadataRole;
	}

	// Fallback to default role
	return DEFAULT_ROLE;
}

export function setUserRoles(user: User): Role[] {
	// Check user metadata for roles assignment
	const metadataRole = user.publicMetadata?.role as Role;

	if (!metadataRole) {
		return [DEFAULT_ROLE];
	}

	if (metadataRole === 'admin') {
		return ['admin', 'editor', 'viewer'];
	}

	if (metadataRole === 'editor') {
		return ['editor', 'viewer'];
	}

	return [DEFAULT_ROLE];
}

export function setUserPermissions(user: User, role: Role): Permissions[] {
	// If there's no role, return default permissions
	if (!role) {
		return DEFAULT_PERMISSIONS;
	}

	let localPermissions: Permissions[];

	if (role === 'admin') {
		localPermissions = [
			...PERMISSIONS_ADMIN,
			...PERMISSIONS_EDITOR,
			...PERMISSIONS_VIEWER,
		];
	} else if (role === 'editor') {
		localPermissions = [...PERMISSIONS_EDITOR, ...PERMISSIONS_VIEWER];
	} else {
		localPermissions = PERMISSIONS_VIEWER;
	}

	const remotePermisions =
		(user.publicMetadata.permissions as Permissions[]) || [];

	return Array.from(new Set([...localPermissions, ...remotePermisions]));
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
 * Get user role from Clerk User object. If user has no role, return 'viewer'.
 * If no user, return null.
 *
 * @param user - The Clerk User object
 * @returns The user's role or null if not found
 */
// export function getUserRole(user: User | UserContext | null): Role | null {
export function getUserRole(locals: App.Locals): Role {
	return locals.user?.role || 'viewer';
}

/**
 * Get user permissions from Clerk User object and merged with
 * additional from .env file based on role.
 * @param user
 */
export function getUserPermissions(locals: App.Locals): Permissions[] {
	return locals.user?.permissions || [];
	// const role = getUserRole(user);

	// const additionalPermissionsEnv = import.meta.env[`PERMISSIONS_${role?.toUpperCase()}`]?.split(',') as string[] || [];
	// const additionalPermissions = additionalPermissionsEnv as Permissions[];
	// // const additionalPermissions = [] as Permissions[];

	// const userPermissions = user.permissions as Permissions[] || [];

	// const mergedPermissions = Array.from(new Set([...userPermissions, ...additionalPermissions]));

	// return mergedPermissions;
}

/**
 * Checks if the given user has admin privileges.
 *
 * @param user - The user object to check, or null if no user is provided
 * @returns True if the user has admin role, false otherwise
 */
export function isAdmin(locals: App.Locals): boolean {
	return locals.user?.role === 'admin';
}

/**
 * Checks if the given user has editor permissions or higher.
 *
 * @param user - The user object to check, or null if no user is provided
 * @returns True if the user has 'editor' or 'admin' role, false otherwise
 */
export function isEditor(locals: App.Locals): boolean {
	return locals.user?.role === 'editor';
}

/**
 * Checks if the user has viewer role or higher permissions.
 *
 * @param user - The user object to check permissions for, or null if no user is provided
 * @returns True if the user has viewer, editor, or admin role; false otherwise
 */
export function isViewer(locals: App.Locals): boolean {
	return locals.user?.role === 'viewer';
}

// export function canEditContent(locals: App.Locals): boolean {
//     const role = getUserRole(locals);
//     return role === 'editor' || role === 'admin';
// }

export function userCanContentDelete(locals: App.Locals): boolean {
	return getUserPermissions(locals).includes('content:delete');
}

export function userCanContentRead(locals: App.Locals): boolean {
	return getUserPermissions(locals).includes('content:read');
}

export function userCanContentWrite(locals: App.Locals): boolean {
	return getUserPermissions(locals).includes('content:write');
}

export function userCanUsersManage(locals: App.Locals): boolean {
	return getUserPermissions(locals).includes('users:manage');
}
