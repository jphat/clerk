import { clerkMiddleware, clerkClient } from '@clerk/astro/server';
import type { MiddlewareHandler } from 'astro';
import {
	setUserPermissions,
	setUserRole,
	setUserRoles,
	isAllowedRoute,
	// isProtectedRoute,
} from '@/lib';

export const onRequest: MiddlewareHandler = clerkMiddleware(
	async (auth, context, next) => {
		const { userId } = auth();

		// If user is authenticated, set up RBAC context
		if (userId) {
			try {
				// Get user object from Clerk client
				const user = await clerkClient(context).users.getUser(userId);

				// Determine user role from Clerk metadata or use default
				const role = setUserRole(user);

				// TODO: testing multi-role support
				const roles = setUserRoles(user);

				// Calculate permissions based on role
				const permissions = setUserPermissions(user, role);

				// Store user context in Astro locals for use throughout the application
				context.locals.user = {
					id: userId,
					email: user.emailAddresses[0]?.emailAddress,
					firstName: user.firstName,
					imageUrl: user.imageUrl,
					lastName: user.lastName,
					permissions,
					role,
					roles, // TODO: testing multi-role support
				};

				const routeCheck = isAllowedRoute(
					context.url.pathname,
					roles,
					permissions,
				);

				// console.log(routeCheck)

				if (!routeCheck.allowed) {
					return context.redirect('/403');
				}
			} catch (error) {
				// If there's an error fetching user data, treat as unauthenticated
				console.error('Error fetching user data:', error);

				// Check if route requires authentication (no role = unauthenticated)
				// const routeCheck = isRouteProtected(context.url.pathname, []);

				// if (!routeCheck.allowed) {
				//     return context.redirect('/sign-in');
				// }
			}
		} else {
			// Log that no user ID was found
			console.log('No user ID found in auth context.');

			// For unauthenticated users, check if route requires authentication (no role = unauthenticated)
			// const routeCheck = isRouteProtected(context.url.pathname, []);

			// If route is protected and user is not authenticated, redirect to sign-in
			// if (!routeCheck.allowed) {
			//     return context.redirect('/sign-in');
			// }
		}

		return next();
	},
);
