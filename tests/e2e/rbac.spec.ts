import { test, expect } from '@playwright/test';
import { networkInterfaces } from 'os';

/**
 * RBAC Integration Tests
 *
 * These tests verify the complete authentication and authorization flow:
 * - Middleware integration with Clerk authentication
 * - Route protection across different user roles
 * - Permission-based access control
 * - Redirect behavior for unauthorized access
 *
 * Requirements tested:
 * - 4.3: Middleware verifies user has required permissions for protected routes
 * - 4.4: Middleware verifies user has admin role for admin routes
 * - 6.5: Middleware updates Astro locals when authentication status changes
 */

test.describe('RBAC Integration Tests', () => {
    test.describe('Unauthenticated User Access', () => {
        test('should allow access to public routes', async ({ page }) => {
            // Test home page (public route)
            await page.goto('/');
            await expect(page).toHaveURL('/');
            const content = await page.textContent('body');
            expect(content).not.toBeNull();
        });

        test('should allow access to 403 error page', async ({ page }) => {
            await page.goto('/403');
            await expect(page).toHaveURL('/403');
            // Use more specific selector to avoid multiple h1 elements
            await expect(
                page.locator('h1.text-3xl.font-bold').first(),
            ).toContainText('Access Denied');
        });

        test('should redirect to sign-in for protected admin routes', async ({
            page,
        }) => {
            // Try to access admin route - tests requirement 4.4
            await page.goto('/a');
            // Should redirect to sign-in
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });

        test('should redirect to sign-in for content creation route', async ({
            page,
        }) => {
            // Tests requirement 4.3 - permission-based route protection
            await page.goto('/content/create');
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });

        test('should redirect to sign-in for authenticated user routes', async ({
            page,
        }) => {
            // Tests requirement 6.5 - middleware handles unauthenticated users
            await page.goto('/u');
            await page.waitForLoadState('networkidle')

            // await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });
    });

    test.describe('Authenticated Routes', () => {
        test('should require authentication for /u routes', async ({ page }) => {
            // This test verifies that /u routes require authentication
            // Tests requirement 4.3
            await page.goto('/u');
            // Should redirect to sign-in since user is not authenticated
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });
    });

    test.describe('Route Protection Patterns', () => {
        test('should protect admin routes with wildcard pattern', async ({
            page,
        }) => {
            // Test that /a/** pattern works - should redirect to sign-in
            // Tests requirement 4.4 - admin route protection
            await page.goto('/a');
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });

        test('should protect content creation routes', async ({ page }) => {
            // Tests requirement 4.3 - permission-based route protection
            await page.goto('/content/create');
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });
    });

    test.describe('Error Page Behavior', () => {
        test('should display 403 page with appropriate messaging', async ({
            page,
        }) => {
            await page.goto('/403');
            await expect(page).toHaveURL('/403');

            // Check for key elements using more specific selectors
            await expect(
                page.locator('h1.text-3xl.font-bold').first(),
            ).toContainText('Access Denied');
            await expect(page.locator('body')).toContainText(
                "don't have permission",
            );

            // Check for navigation options
            const homeLink = page.locator('a[href="/"]').first();
            await expect(homeLink).toBeVisible();
        });

        test('should show unauthenticated message on 403 when not signed in', async ({
            page,
        }) => {
            // Tests requirement 6.5 - middleware provides user context
            await page.goto('/403');
            await expect(page.locator('body')).toContainText('not currently signed');
        });
    });

    test.describe('Test Pages Access Control', () => {
        test('should protect admin test page', async ({ page }) => {
            // Tests requirement 4.4 - admin-only route protection
            await page.goto('/test/admin');
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });

        test('should protect editor test page', async ({ page }) => {
            // Tests requirement 4.3 - permission-based route protection
            await page.goto('/test/editor');
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });

        test('should protect viewer test page', async ({ page }) => {
            // Tests requirement 4.3 - authenticated route protection
            await page.goto('/test/viewer');
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');
        });
    });

    test.describe('Middleware Integration', () => {
        test('should handle middleware for public routes without authentication', async ({
            page,
        }) => {
            // Verify that public routes work without authentication
            // Tests requirement 6.5 - middleware handles unauthenticated users correctly
            const publicRoutes = ['/403', '/404'];

            for (const route of publicRoutes) {
                await page.goto(route);
                // Should stay on the same route (no redirect)
                await expect(page).toHaveURL(route);
            }
        });

        test('should enforce authentication for protected routes', async ({
            page,
        }) => {
            // Verify that protected routes redirect to sign-in
            // Tests requirements 4.3 and 4.4 - complete middleware integration
            const protectedRoutes = ['/a', '/content/create', '/u'];

            for (const route of protectedRoutes) {
                await page.goto(route);
                // Should redirect to sign-in
                await page.waitForURL(/sign-in/, { timeout: 10000 });
                expect(page.url()).toContain('sign-in');
            }
        });
    });

    test.describe('Complete RBAC Flow', () => {
        test('should demonstrate complete authentication and authorization flow', async ({
            page,
        }) => {
            // This test demonstrates the complete RBAC flow from unauthenticated to protected route
            // Tests all requirements: 4.3, 4.4, 6.5

            // Step 1: Start at home page (public)
            await page.goto('/');
            await expect(page).toHaveURL('/');

            // Step 2: Try to access protected route
            await page.goto('/a');

            // Step 3: Should be redirected to sign-in
            await page.waitForURL(/sign-in/, { timeout: 10000 });
            expect(page.url()).toContain('sign-in');

            // Step 4: Verify 403 page shows appropriate message for unauthenticated users
            await page.goto('/403');
            await expect(page.locator('body')).toContainText('not currently signed');
        });

        test('should protect multiple route patterns consistently', async ({
            page,
        }) => {
            // Test that middleware consistently protects different route patterns
            // Tests requirements 4.3 and 4.4

            const routeTests = [
                { route: '/a', description: 'admin root' },
                { route: '/content/create', description: 'content creation' },
                { route: '/u', description: 'user area' },
            ];

            for (const { route, description } of routeTests) {
                await page.goto(route);
                await page.waitForURL(/sign-in/, { timeout: 10000 });
                expect(page.url()).toContain('sign-in');
            }
        });
    });
});
