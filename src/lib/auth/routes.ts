import type { NavItem, Role, Permissions } from '@/types';
import { MENUS } from '@/consts';

/**
 * Helper function to recursively search through menu items to find a route
 * @param items - Array of NavItem to search through
 * @param route - The route to find
 * @returns The NavItem if found, null otherwise
 */
function findRouteInItems(items: NavItem[], route: string): NavItem | null {
	for (const item of items) {
		if (item.href === route) {
			return item;
		}
		if (item.children) {
			const found = findRouteInItems(item.children, route);
			if (found) return found;
		}
	}
	return null;
}

/**
 * Given a route, role, and permissions, match it to items in MENUS;
 * if matches, determine if access is allowed based the menu's permissions key.
 * If not found, return false
 *
 * @param route - The route to check access for
 * @param role - The user's role
 * @param permissions - The user's permissions
 * @returns Object indicating if access is allowed and reason if not
 */
export function isAllowedRoute(
	route: string,
	roles: Role[],
	permissions: Permissions[],
): { allowed: boolean; reason?: string } {
	// Allow access to system error pages (4xx and 5xx)
	if (/^\/[45]\d{2}$/.test(route)) {
		return { allowed: true };
	}

	// Search through all menu sections
	for (const menuKey of Object.keys(MENUS)) {
		const menuItems = MENUS[menuKey as keyof typeof MENUS];
		const foundItem = findRouteInItems(menuItems, route);

		if (foundItem) {
			// If no permissions specified on the menu item, allow access
			if (!foundItem.permissions || foundItem.permissions.length === 0) {
				return { allowed: true };
			}

			// Check if user has any of the required permissions
			const hasRequiredPermission = foundItem.permissions.some(
				(requiredPermission) => roles.includes(requiredPermission),
			);
			// const hasRequiredPermission = foundItem.permissions.some(
			//     (requiredPermission) => role.includes(requiredPermission)
			// );

			// const hasRequiredPerm = roles.some(item => foundItem.permissions.includes(item));

			if (hasRequiredPermission) {
				return { allowed: true };
			} else {
				return {
					allowed: false,
					reason: `Insufficient permissions. Required: ${foundItem.permissions.join(' or ')}, User has: ${permissions.join(', ')}`,
				};
			}
		}
	}

	// Route not found in any menu, deny access
	return {
		allowed: false,
		reason: `Route '${route}' not found in any menu configuration`,
	};
}

/**
 * Given a user's roles and menu, loop though and return only items whose
 * permissions key matches the user's roles, while preserving menu structure.
 *
 * @param roles - The user's roles
 * @param menu - The menu configuration
 * @returns Array of accessible route strings
 */
export function getAccessibleRoutes(
	// roles: Role[],
	locals: App.Locals,
	menu: NavItem[],
): NavItem[] {
	const accessibleRoutes: NavItem[] = [];
	const roles = locals.user ? locals.user.roles : [];

	// Helper function to filter menu items recursively
	function filterMenuItems(items: NavItem[]): NavItem[] {
		const filteredItems: NavItem[] = [];

		for (const item of items) {
			// Check if user has access to this item
			const hasAccess =
				!item.permissions ||
				item.permissions.length === 0 ||
				item.permissions.some((permission) => roles.includes(permission));

			if (hasAccess) {
				// If item has children, recursively filter them
				const filteredChildren = item.children
					? filterMenuItems(item.children)
					: null;

				// Create a new item with filtered children
				const accessibleItem: NavItem = {
					...item,
					children:
						filteredChildren && filteredChildren.length > 0
							? filteredChildren
							: null,
				};

				filteredItems.push(accessibleItem);
			} else if (item.children) {
				// Even if parent item is not accessible, check if any children are accessible
				const filteredChildren = filterMenuItems(item.children);

				// If there are accessible children, include the parent but mark it as accessible
				if (filteredChildren.length > 0) {
					const accessibleItem: NavItem = {
						...item,
						children: filteredChildren,
					};
					filteredItems.push(accessibleItem);
				}
			}
		}

		return filteredItems;
	}

	// Process menu items directly since menu is already an array
	const filteredItems = filterMenuItems(menu);
	accessibleRoutes.push(...filteredItems);

	return accessibleRoutes;
}
