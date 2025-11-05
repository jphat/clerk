import { clerkMiddleware, clerkClient } from '@clerk/astro/server'
import type { MiddlewareHandler } from 'astro'
import { getUserRole, getUserPermissions, isRouteProtected } from '@/lib/auth/rbac-utils'

/**
 * Enhanced Clerk middleware with RBAC integration
 * 
 * This middleware extends the base Clerk authentication with role-based access control:
 * 1. Determines user role from Clerk metadata
 * 2. Calculates user permissions based on role
 * 3. Stores user context in Astro locals
 * 4. Performs route protection checks
 * 5. Redirects unauthorized users to 403 page
 */
export const onRequest: MiddlewareHandler = clerkMiddleware(
    async (auth, context, next) => {
        const { userId } = auth()

        // If user is authenticated, set up RBAC context
        if (userId) {
            try {
                // Get user object from Clerk client
                const user = await clerkClient(context).users.getUser(userId)

                // Determine user role from Clerk metadata or use default
                const role = getUserRole(user)

                // Calculate permissions based on role
                const permissions = getUserPermissions(role)

                // Store user context in Astro locals for use throughout the application
                context.locals.user = {
                    id: userId,
                    email: user.emailAddresses[0]?.emailAddress || '',
                    role,
                    permissions
                }

                // Check if the current route is protected and if user has access
                const routeCheck = isRouteProtected(context.url.pathname, permissions, role)

                // If access is denied, redirect to 403 Forbidden page
                if (!routeCheck.allowed) {
                    return context.redirect('/403')
                }
            } catch (error) {
                // If there's an error fetching user data, treat as unauthenticated
                console.error('Error fetching user data:', error)

                // Check if route requires authentication
                const routeCheck = isRouteProtected(context.url.pathname, [], 'viewer')

                if (!routeCheck.allowed) {
                    return context.redirect('/sign-in')
                }
            }
        } else {
            // For unauthenticated users, check if route requires authentication
            const routeCheck = isRouteProtected(context.url.pathname, [], 'viewer')

            // If route is protected and user is not authenticated, redirect to sign-in
            if (!routeCheck.allowed) {
                return context.redirect('/sign-in')
            }
        }

        // Continue to the next middleware or page
        return next()
    }
)