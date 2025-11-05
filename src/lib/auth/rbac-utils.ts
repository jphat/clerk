/**
 * RBAC Utility Functions
 * 
 * Core utilities for role assignment, permission calculation, and access control.
 * These functions handle the business logic for the RBAC system.
 */

import type { User } from '@clerk/astro/server'
import type { Role, Permission } from '@/types/auth'
import { DEFAULT_ROLE, ROLE_PERMISSIONS, PROTECTED_ROUTES, PUBLIC_ROUTES, AUTHENTICATED_ROUTES } from './rbac-config'

/**
 * Extract user role from Clerk user metadata
 * 
 * @param user - Clerk user object
 * @returns The user's role, defaulting to DEFAULT_ROLE if not set
 */
export function getUserRole(user: User): Role {
    // Check user metadata for role assignment
    const metadataRole = user.publicMetadata?.role as Role

    // Validate that the role exists in our system
    if (metadataRole && (metadataRole === 'admin' || metadataRole === 'editor' || metadataRole === 'viewer')) {
        return metadataRole
    }

    // Fallback to default role
    return DEFAULT_ROLE
}

/**
 * Get permissions for a given role
 * 
 * @param role - User role
 * @returns Array of permissions granted to the role
 */
export function getUserPermissions(role: Role): Permission[] {
    return ROLE_PERMISSIONS[role] || []
}

/**
 * Check if user has a specific permission
 * 
 * @param userPermissions - Array of user's permissions
 * @param requiredPermission - Permission to check for
 * @returns True if user has the required permission
 */
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
    return userPermissions.includes(requiredPermission)
}

/**
 * Check if user has any of the specified permissions
 * 
 * @param userPermissions - Array of user's permissions
 * @param requiredPermissions - Array of permissions to check for
 * @returns True if user has at least one of the required permissions
 */
export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(permission => userPermissions.includes(permission))
}

/**
 * Route protection result interface
 */
export interface RouteProtectionResult {
    allowed: boolean
    reason?: string
}

/**
 * Check if a route pattern matches a given pathname
 * 
 * @param pattern - Route pattern (supports ** for wildcard matching)
 * @param pathname - URL pathname to check
 * @returns True if the pattern matches the pathname
 */
function matchesPattern(pattern: string, pathname: string): boolean {
    // Convert pattern to regex
    // Replace ** with .* for wildcard matching
    // Escape other regex special characters
    const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(pathname)
}

/**
 * Check if a route is explicitly public (never requires authentication)
 * 
 * @param pathname - URL pathname to check
 * @returns True if the route is public
 */
export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some(route => matchesPattern(route, pathname))
}

/**
 * Check if a route requires authentication but no specific permissions
 * 
 * @param pathname - URL pathname to check
 * @returns True if the route requires authentication only
 */
export function isAuthenticatedRoute(pathname: string): boolean {
    return AUTHENTICATED_ROUTES.some(route => matchesPattern(route.pattern, pathname))
}

/**
 * Check if a route is protected and if user has access
 * 
 * @param pathname - URL pathname to check
 * @param userPermissions - Array of user's permissions (empty array if not authenticated)
 * @param userRole - User's role (undefined if not authenticated)
 * @returns RouteProtectionResult indicating if access is allowed
 */
export function isRouteProtected(
    pathname: string,
    userPermissions: Permission[],
    userRole?: Role
): RouteProtectionResult {
    // Determine if user is authenticated based on whether they have a role
    const isAuthenticated = !!userRole
    // Check if route is explicitly public
    if (isPublicRoute(pathname)) {
        return { allowed: true }
    }

    // Check if route requires authentication only
    if (isAuthenticatedRoute(pathname)) {
        if (isAuthenticated) {
            return { allowed: true }
        } else {
            return {
                allowed: false,
                reason: 'Authentication required'
            }
        }
    }

    // Find matching protected route
    const matchingRoute = PROTECTED_ROUTES.find(route =>
        matchesPattern(route.pattern, pathname)
    )

    // If no matching protected route and user is authenticated, allow access
    // This handles routes that aren't explicitly configured
    if (!matchingRoute) {
        return { allowed: true }
    }

    // All protected routes require authentication
    if (!isAuthenticated) {
        return {
            allowed: false,
            reason: 'Authentication required'
        }
    }

    // Check admin-only routes
    if (matchingRoute.adminOnly) {
        if (userRole === 'admin') {
            return { allowed: true }
        } else {
            return {
                allowed: false,
                reason: 'Admin access required'
            }
        }
    }

    // Check permission-based routes
    if (matchingRoute.permissions && matchingRoute.permissions.length > 0) {
        if (hasAnyPermission(userPermissions, matchingRoute.permissions)) {
            return { allowed: true }
        } else {
            return {
                allowed: false,
                reason: `Required permissions: ${matchingRoute.permissions.join(', ')}`
            }
        }
    }

    // If route is protected but no specific requirements, allow authenticated users
    if (isAuthenticated) {
        return { allowed: true }
    }

    // Default deny
    return {
        allowed: false,
        reason: 'Access denied to protected route'
    }
}