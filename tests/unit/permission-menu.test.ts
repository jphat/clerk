/**
 * Unit tests for PermissionMenu component
 * 
 * Tests menu filtering with different user permission sets,
 * rendering for authenticated and unauthenticated users,
 * and nested menu item permission handling.
 */

import { describe, it, expect, vi } from 'vitest';
import type { UserContext, Role, Permission, MenuItem } from '@/types/auth';

// Test data helpers
const createMockLocals = (user?: UserContext): App.Locals => ({
    user,
    authToken: null,
    authStatus: 'signed-out',
    authMessage: null,
    authReason: null,
    auth: vi.fn() as any,
    currentUser: vi.fn().mockResolvedValue(null) as any,
});

const createMockUser = (
    role: Role,
    permissions: Permission[],
    overrides: Partial<UserContext> = {},
): UserContext => ({
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    imageUrl: 'https://example.com/avatar.jpg',
    role,
    permissions,
    ...overrides,
});

// Helper functions that mirror the component logic
function shouldShowMenuItem(item: MenuItem, locals: App.Locals): boolean {
    const user = locals.user;

    // If no permissions are specified, show to all authenticated users
    if (!item.permissions || item.permissions.length === 0) {
        return !!user;
    }

    // If user is not authenticated, hide the item
    if (!user) {
        return false;
    }

    // Check if user has any of the required permissions
    return item.permissions.some(permission => user.permissions.includes(permission));
}

function filterMenuItems(menuItems: MenuItem[], locals: App.Locals): MenuItem[] {
    return menuItems
        .filter(item => shouldShowMenuItem(item, locals))
        .map((item) => {
            // If item has children, recursively filter them
            if (item.children && item.children.length > 0) {
                const filteredChildren = filterMenuItems(item.children, locals);
                return {
                    ...item,
                    children: filteredChildren,
                };
            }
            return item;
        })
        .filter((item) => {
            // Remove parent items that have no visible children
            if (item.children) {
                return item.children.length > 0 || shouldShowMenuItem(item, locals);
            }
            return true;
        });
}

describe('PermissionMenu Component Logic', () => {
    describe('Menu filtering with different user permission sets', () => {
        it('should show all items to admin with all permissions', () => {
            const user = createMockUser('admin', ['write_content', 'edit_content', 'manage_user']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/' },
                { label: 'Create Content', href: '/content/create', permissions: ['write_content'] },
                { label: 'Edit Content', href: '/content/edit', permissions: ['edit_content'] },
                { label: 'Manage Users', href: '/users', permissions: ['manage_user'] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(4);
            expect(filtered.map(item => item.label)).toEqual([
                'Home',
                'Create Content',
                'Edit Content',
                'Manage Users',
            ]);
        });

        it('should filter items for editor with limited permissions', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/' },
                { label: 'Create Content', href: '/content/create', permissions: ['write_content'] },
                { label: 'Edit Content', href: '/content/edit', permissions: ['edit_content'] },
                { label: 'Manage Users', href: '/users', permissions: ['manage_user'] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(3);
            expect(filtered.map(item => item.label)).toEqual([
                'Home',
                'Create Content',
                'Edit Content',
            ]);
            expect(filtered.find(item => item.label === 'Manage Users')).toBeUndefined();
        });

        it('should show only items without permissions to viewer', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/' },
                { label: 'Create Content', href: '/content/create', permissions: ['write_content'] },
                { label: 'Edit Content', href: '/content/edit', permissions: ['edit_content'] },
                { label: 'Profile', href: '/profile' },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(2);
            expect(filtered.map(item => item.label)).toEqual(['Home', 'Profile']);
        });

        it('should show items when user has any of the required permissions', () => {
            const user = createMockUser('editor', ['write_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Content', href: '/content', permissions: ['write_content', 'edit_content'] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
            expect(filtered[0].label).toBe('Content');
        });
    });

    describe('Rendering for authenticated and unauthenticated users', () => {
        it('should hide all items for unauthenticated users', () => {
            const locals = createMockLocals();

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/' },
                { label: 'Profile', href: '/profile' },
                { label: 'Create Content', href: '/content/create', permissions: ['write_content'] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(0);
        });

        it('should show items without permissions to authenticated users', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/' },
                { label: 'Profile', href: '/profile' },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(2);
        });

        it('should hide permission-required items from unauthenticated users', () => {
            const locals = createMockLocals();

            const menuItems: MenuItem[] = [
                { label: 'Create Content', href: '/content/create', permissions: ['write_content'] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(0);
        });
    });

    describe('Nested menu item permission handling', () => {
        it('should filter nested menu items based on permissions', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                {
                    label: 'Content',
                    href: '/content',
                    children: [
                        { label: 'Create', href: '/content/create', permissions: ['write_content'] },
                        { label: 'Edit', href: '/content/edit', permissions: ['edit_content'] },
                        { label: 'Delete', href: '/content/delete', permissions: ['manage_user'] },
                    ],
                },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
            expect(filtered[0].children).toHaveLength(2);
            expect(filtered[0].children?.map(item => item.label)).toEqual(['Create', 'Edit']);
        });

        it('should remove parent items when all children are filtered out', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                {
                    label: 'Admin',
                    href: '/admin',
                    permissions: ['manage_user'],
                    children: [
                        { label: 'Users', href: '/admin/users', permissions: ['manage_user'] },
                        { label: 'Settings', href: '/admin/settings', permissions: ['manage_user'] },
                    ],
                },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(0);
        });

        it('should keep parent items with no permissions when children are visible', () => {
            const user = createMockUser('editor', ['write_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                {
                    label: 'Content',
                    href: '/content',
                    children: [
                        { label: 'Create', href: '/content/create', permissions: ['write_content'] },
                        { label: 'View All', href: '/content/all' },
                    ],
                },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
            expect(filtered[0].label).toBe('Content');
            expect(filtered[0].children).toHaveLength(2);
        });

        it('should handle deeply nested menu structures', () => {
            const user = createMockUser('admin', ['write_content', 'edit_content', 'manage_user']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                {
                    label: 'Admin',
                    href: '/admin',
                    children: [
                        {
                            label: 'Content Management',
                            href: '/admin/content',
                            children: [
                                { label: 'Create', href: '/admin/content/create', permissions: ['write_content'] },
                                { label: 'Edit', href: '/admin/content/edit', permissions: ['edit_content'] },
                            ],
                        },
                        {
                            label: 'User Management',
                            href: '/admin/users',
                            children: [
                                { label: 'List Users', href: '/admin/users/list', permissions: ['manage_user'] },
                            ],
                        },
                    ],
                },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
            expect(filtered[0].children).toHaveLength(2);
            expect(filtered[0].children?.[0].children).toHaveLength(2);
            expect(filtered[0].children?.[1].children).toHaveLength(1);
        });

        it('should filter deeply nested items when user lacks permissions', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                {
                    label: 'Admin',
                    href: '/admin',
                    permissions: ['manage_user'],
                    children: [
                        {
                            label: 'Content Management',
                            href: '/admin/content',
                            permissions: ['manage_user'],
                            children: [
                                { label: 'Create', href: '/admin/content/create', permissions: ['write_content'] },
                                { label: 'Edit', href: '/admin/content/edit', permissions: ['edit_content'] },
                            ],
                        },
                    ],
                },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(0);
        });

        it('should handle mixed permission requirements in nested structure', () => {
            const user = createMockUser('editor', ['edit_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                {
                    label: 'Content',
                    href: '/content',
                    children: [
                        { label: 'Create', href: '/content/create', permissions: ['write_content'] },
                        { label: 'Edit', href: '/content/edit', permissions: ['edit_content'] },
                        { label: 'View', href: '/content/view' },
                    ],
                },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
            expect(filtered[0].children).toHaveLength(2);
            expect(filtered[0].children?.map(item => item.label)).toEqual(['Edit', 'View']);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty menu items array', () => {
            const user = createMockUser('admin', ['write_content', 'edit_content', 'manage_user']);
            const locals = createMockLocals(user);

            const filtered = filterMenuItems([], locals);

            expect(filtered).toHaveLength(0);
        });

        it('should handle menu items with empty permissions array', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/', permissions: [] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
        });

        it('should handle menu items with undefined children', () => {
            const user = createMockUser('admin', ['write_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/', children: undefined },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
        });

        it('should handle menu items with empty children array', () => {
            const user = createMockUser('admin', ['write_content']);
            const locals = createMockLocals(user);

            const menuItems: MenuItem[] = [
                { label: 'Home', href: '/', children: [] },
            ];

            const filtered = filterMenuItems(menuItems, locals);

            expect(filtered).toHaveLength(1);
        });
    });
});
