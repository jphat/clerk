const ROLES = (import.meta.env.ROLES?.split(',') as string[]) || [];
const PERMISSIONS_VIEWER =
	(import.meta.env.PERMISSIONS_VIEWER?.split(',') as string[]) || [];
const PERMISSIONS_EDITOR =
	(import.meta.env.PERMISSIONS_EDITOR?.split(',') as string[]) || [];
const PERMISSIONS_ADMIN =
	(import.meta.env.PERMISSIONS_ADMIN?.split(',') as string[]) || [];

/**
 * Core RBAC type definitions for role-based access control system
 */

/**
 * Available user roles in the system
 */
export type Role = (typeof ROLES)[number];

/**
 * Available permissions that can be granted to roles
 */
export type Permissions =
	| (typeof PERMISSIONS_VIEWER)[number]
	| (typeof PERMISSIONS_EDITOR)[number]
	| (typeof PERMISSIONS_ADMIN)[number];

/**
 * User context information stored in Astro locals
 */
export interface UserContext {
	id: string;
	email: string;
	firstName: string | null;
	imageUrl: string;
	lastName: string | null;
	permissions: Permissions[];
	role: Role;
	roles: Role[]; // TODO: testing multi-role support
}

// TODO: clean up
// export interface RouteConfig {
//     pattern: string;
//     permissions?: Permissions[];
//     adminOnly?: boolean;
// }
