/**
 * Unit tests for template utility functions
 * 
 * Tests all permission checking functions with various user contexts
 * including edge cases with undefined user data.
 */

import { describe, it, expect, vi } from 'vitest';
import type { UserContext, Role, Permission } from '@/types/auth';
import {
    canWriteContent,
    canEditContent,
    canManageUser,
    hasRole,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    isAuthenticated,
    getUserRole,
    getUserPermissions,
} from '@/lib/auth/template-utils';

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

describe('Template Utility Functions', () => {
    describe('canWriteContent', () => {
        it('should return true when user has write_content permission', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            expect(canWriteContent(locals)).toBe(true);
        });

        it('should return false when user lacks write_content permission', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            expect(canWriteContent(locals)).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(canWriteContent(locals)).toBe(false);
        });

        it('should return false when user permissions are undefined', () => {
            const user = { ...createMockUser('viewer', []), permissions: undefined as any };
            const locals = createMockLocals(user);

            expect(canWriteContent(locals)).toBe(false);
        });
    });

    describe('canEditContent', () => {
        it('should return true when user has edit_content permission', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            expect(canEditContent(locals)).toBe(true);
        });

        it('should return false when user lacks edit_content permission', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            expect(canEditContent(locals)).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(canEditContent(locals)).toBe(false);
        });
    });

    describe('canManageUser', () => {
        it('should return true when user has manage_user permission', () => {
            const user = createMockUser('admin', ['write_content', 'edit_content', 'manage_user']);
            const locals = createMockLocals(user);

            expect(canManageUser(locals)).toBe(true);
        });

        it('should return false when user lacks manage_user permission', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            expect(canManageUser(locals)).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(canManageUser(locals)).toBe(false);
        });
    });

    describe('hasRole', () => {
        it('should return true when user has the specified role', () => {
            const user = createMockUser('admin', []);
            const locals = createMockLocals(user);

            expect(hasRole(locals, 'admin')).toBe(true);
        });

        it('should return false when user has a different role', () => {
            const user = createMockUser('editor', []);
            const locals = createMockLocals(user);

            expect(hasRole(locals, 'admin')).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(hasRole(locals, 'admin')).toBe(false);
        });

        it('should work with all role types', () => {
            const adminUser = createMockUser('admin', []);
            const editorUser = createMockUser('editor', []);
            const viewerUser = createMockUser('viewer', []);

            expect(hasRole(createMockLocals(adminUser), 'admin')).toBe(true);
            expect(hasRole(createMockLocals(editorUser), 'editor')).toBe(true);
            expect(hasRole(createMockLocals(viewerUser), 'viewer')).toBe(true);
        });
    });

    describe('isAdmin', () => {
        it('should return true when user is admin', () => {
            const user = createMockUser('admin', []);
            const locals = createMockLocals(user);

            expect(isAdmin(locals)).toBe(true);
        });

        it('should return false when user is not admin', () => {
            const user = createMockUser('editor', []);
            const locals = createMockLocals(user);

            expect(isAdmin(locals)).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(isAdmin(locals)).toBe(false);
        });
    });

    describe('hasPermission', () => {
        it('should return true when user has the specified permission', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            expect(hasPermission(locals, 'write_content')).toBe(true);
            expect(hasPermission(locals, 'edit_content')).toBe(true);
        });

        it('should return false when user lacks the specified permission', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            expect(hasPermission(locals, 'write_content')).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(hasPermission(locals, 'write_content')).toBe(false);
        });

        it('should work with all permission types', () => {
            const user = createMockUser('admin', ['write_content', 'edit_content', 'manage_user']);
            const locals = createMockLocals(user);

            expect(hasPermission(locals, 'write_content')).toBe(true);
            expect(hasPermission(locals, 'edit_content')).toBe(true);
            expect(hasPermission(locals, 'manage_user')).toBe(true);
        });
    });

    describe('hasAnyPermission', () => {
        it('should return true when user has at least one of the specified permissions', () => {
            const user = createMockUser('editor', ['write_content', 'edit_content']);
            const locals = createMockLocals(user);

            expect(hasAnyPermission(locals, ['write_content', 'manage_user'])).toBe(true);
            expect(hasAnyPermission(locals, ['edit_content', 'manage_user'])).toBe(true);
        });

        it('should return false when user has none of the specified permissions', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            expect(hasAnyPermission(locals, ['write_content', 'manage_user'])).toBe(false);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(hasAnyPermission(locals, ['write_content', 'manage_user'])).toBe(false);
        });

        it('should return false when user permissions are undefined', () => {
            const user = { ...createMockUser('viewer', []), permissions: undefined as any };
            const locals = createMockLocals(user);

            expect(hasAnyPermission(locals, ['write_content'])).toBe(false);
        });

        it('should return false when permissions array is empty', () => {
            const user = createMockUser('admin', ['write_content', 'edit_content', 'manage_user']);
            const locals = createMockLocals(user);

            expect(hasAnyPermission(locals, [])).toBe(false);
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when user exists', () => {
            const user = createMockUser('viewer', []);
            const locals = createMockLocals(user);

            expect(isAuthenticated(locals)).toBe(true);
        });

        it('should return false when user is undefined', () => {
            const locals = createMockLocals();

            expect(isAuthenticated(locals)).toBe(false);
        });

        it('should return false when user is null', () => {
            const locals = createMockLocals(null as any);

            expect(isAuthenticated(locals)).toBe(false);
        });
    });

    describe('getUserRole', () => {
        it('should return user role when user exists', () => {
            const user = createMockUser('admin', []);
            const locals = createMockLocals(user);

            expect(getUserRole(locals)).toBe('admin');
        });

        it('should return viewer when user is undefined', () => {
            const locals = createMockLocals();

            expect(getUserRole(locals)).toBe('viewer');
        });

        it('should work with all role types', () => {
            const roles: Role[] = ['admin', 'editor', 'viewer'];

            roles.forEach(role => {
                const user = createMockUser(role, []);
                const locals = createMockLocals(user);
                expect(getUserRole(locals)).toBe(role);
            });
        });
    });

    describe('getUserPermissions', () => {
        it('should return user permissions when user exists', () => {
            const permissions: Permission[] = ['write_content', 'edit_content'];
            const user = createMockUser('editor', permissions);
            const locals = createMockLocals(user);

            expect(getUserPermissions(locals)).toEqual(permissions);
        });

        it('should return empty array when user is undefined', () => {
            const locals = createMockLocals();

            expect(getUserPermissions(locals)).toEqual([]);
        });

        it('should return empty array when user permissions are undefined', () => {
            const user = { ...createMockUser('viewer', []), permissions: undefined as any };
            const locals = createMockLocals(user);

            expect(getUserPermissions(locals)).toEqual([]);
        });
    });
});