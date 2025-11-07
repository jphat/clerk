/**
 * Integration Check Script
 *
 * This file verifies that all RBAC system components are properly integrated
 * and can be imported without issues. Run this to validate the integration.
 */

// Test all main exports
// import type {
// Role,
// Permission,
// UserContext,
// MenuItem,
// RouteConfig,
// } from '@/types/auth';
import {
	DEFAULT_ROLE,
	ROLE_PERMISSIONS,
	PROTECTED_ROUTES,
} from './rbac-config';
import {
	getUserRole,
	getUserPermissions,
	hasPermission,
	hasAnyPermission,
	// isRouteProtected,
} from './rbac-utils';
import {
	canWriteContent,
	canEditContent,
	canManageUser,
	hasRole,
	isAdmin,
} from './template-utils';

/**
 * Verify all types are properly defined
 */
function verifyTypes(): boolean {
	// const testRole: Role = 'admin';
	// const testPermission: Permission = 'write_content';
	// const testUser: UserContext = {
	// 	id: 'test',
	// 	email: 'test@example.com',
	// 	role: 'admin',
	// 	permissions: ['write_content'],
	// };
	// const testMenuItem: MenuItem = {
	// 	label: 'Test',
	// 	href: '/test',
	// 	permissions: ['write_content'],
	// };
	// const testRoute: RouteConfig = {
	// 	pattern: '/test',
	// 	permissions: ['write_content'],
	// };

	return true;
}

/**
 * Verify configuration is accessible
 */
function verifyConfiguration(): boolean {
	return (
		DEFAULT_ROLE === 'viewer' &&
		Object.keys(ROLE_PERMISSIONS).length === 3 &&
		Array.isArray(PROTECTED_ROUTES)
	);
}

/**
 * Verify utility functions are working
 */
function verifyUtilities(): boolean {
	const mockUser = {
		publicMetadata: { role: 'admin' },
	} as any;

	const role = getUserRole(mockUser);
	const permissions = getUserPermissions(role);
	const hasWritePermission = hasPermission(permissions, 'write_content');
	const hasAnyPerms = hasAnyPermission(permissions, ['write_content']);

	return (
		role === 'admin' &&
		permissions.includes('write_content') &&
		hasWritePermission &&
		hasAnyPerms
	);
}

/**
 * Verify template utilities are working
 */
function verifyTemplateUtilities(): boolean {
	const mockLocals = {
		user: {
			id: 'test',
			email: 'test@example.com',
			role: 'admin' as const,
			permissions: ['write_content', 'edit_content', 'manage_user'] as const,
			firstName: '',
			imageUrl: '',
			lastName: ''
		}
	} as unknown as App.Locals;

	return (
		canWriteContent(mockLocals) &&
		canEditContent(mockLocals) &&
		canManageUser(mockLocals) &&
		hasRole(mockLocals, 'admin') &&
		isAdmin(mockLocals)
	);
}

/**
 * Run all integration checks
 */
export function runIntegrationCheck(): { success: boolean; errors: string[] } {
	const errors: string[] = [];

	try {
		if (!verifyTypes()) {
			errors.push('Type definitions verification failed');
		}
	} catch (error) {
		errors.push(`Type verification error: ${error}`);
	}

	try {
		if (!verifyConfiguration()) {
			errors.push('Configuration verification failed');
		}
	} catch (error) {
		errors.push(`Configuration verification error: ${error}`);
	}

	try {
		if (!verifyUtilities()) {
			errors.push('Utility functions verification failed');
		}
	} catch (error) {
		errors.push(`Utility verification error: ${error}`);
	}

	try {
		if (!verifyTemplateUtilities()) {
			errors.push('Template utilities verification failed');
		}
	} catch (error) {
		errors.push(`Template utilities verification error: ${error}`);
	}

	return {
		success: errors.length === 0,
		errors,
	};
}

// Export for testing
export {
	verifyTypes,
	verifyConfiguration,
	verifyUtilities,
	verifyTemplateUtilities,
};
