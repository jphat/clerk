/**
 * Auth module barrel exports
 *
 * Provides convenient access to all auth-related types and configurations
 */

// Export types
export type {
	Role,
	Permission,
	RoleConfig,
	UserContext,
	MenuItem,
	RouteConfig,
} from '@/types/auth';

// Export configuration
export {
	DEFAULT_ROLE,
	ROLE_PERMISSIONS,
	PROTECTED_ROUTES,
	ALL_PERMISSIONS,
	ALL_ROLES,
} from './rbac-config';

// Export utilities
export {
	getUserRole,
	getUserPermissions,
	hasPermission,
	hasAnyPermission,
	isRouteProtected,
	type RouteProtectionResult,
} from './rbac-utils';

// Export template utilities
export {
	canWriteContent,
	canEditContent,
	canManageUser,
	hasRole,
	isAdmin,
	hasPermission as hasPermissionTemplate,
	hasAnyPermission as hasAnyPermissionTemplate,
	isAuthenticated,
	getUserRole as getUserRoleTemplate,
	getUserPermissions as getUserPermissionsTemplate,
} from './template-utils';

// Export integration utilities (for development/testing)
export {
	runIntegrationCheck,
	verifyTypes,
	verifyConfiguration,
	verifyUtilities,
	verifyTemplateUtilities,
} from './integration-check';
