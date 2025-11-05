/**
 * Core RBAC type definitions for role-based access control system
 */

/**
 * Available user roles in the system
 */
export type Role = 'admin' | 'editor' | 'viewer'

/**
 * Available permissions that can be granted to roles
 */
export type Permission = 'write_content' | 'edit_content' | 'manage_user'

/**
 * Configuration mapping roles to their associated permissions
 */
export interface RoleConfig {
    admin: Permission[]
    editor: Permission[]
    viewer: Permission[]
}

/**
 * User context information stored in Astro locals
 */
export interface UserContext {
    id: string
    email: string
    firstName: string
    imageUrl: string
    lastName: string
    permissions: Permission[]
    role: Role
}

/**
 * Menu item configuration with optional permission requirements
 */
export interface MenuItem {
    label: string
    href: string
    permissions?: Permission[]
    children?: MenuItem[]
}

/**
 * Route configuration for protected routes
 */
export interface RouteConfig {
    pattern: string
    permissions?: Permission[]
    adminOnly?: boolean
}

/**
 * Extend Astro's App namespace to include user context in locals
 */
declare global {
    namespace App {
        interface Locals {
            user?: UserContext
        }
    }
}