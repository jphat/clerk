import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { test, expect } from '@playwright/test';

const VIEWER_TEST_EMAIL = process.env.CLERK_TEST_EMAIL;
const VIEWER_TEST_PASSWORD = process.env.CLERK_TEST_PASSWORD;

const EDITOR_TEST_EMAIL = process.env.CLERK_TEST_EMAIL_EDITOR;
const EDITOR_TEST_PASSWORD = process.env.CLERK_TEST_PASSWORD_EDITOR;

// Tests for viewer role permissions
test.describe('RBAC: Test Viewer Permissions', () => {
	test.beforeEach(async ({ page }) => {
		// Throw error if environment variables are not set
		if (!VIEWER_TEST_EMAIL || !VIEWER_TEST_PASSWORD) {
			throw new Error(
				'Missing CLERK_TEST_EMAIL or CLERK_TEST_PASSWORD environment variable.',
			);
		}
		// Set up Clerk testing token to bypass bot detection
		await setupClerkTestingToken({ page });

		// Start from sign-in page
		await page.goto('/sign-in');

		// Wait for navigation to complete
		await page.waitForLoadState('networkidle');

		// Wait for Clerk to load and the form to be ready
		await page.waitForSelector('input[name="identifier"]');

		// Sign in as viewer user
		await page.fill('input[name="identifier"]', VIEWER_TEST_EMAIL);
		await page.click('.cl-formButtonPrimary');
		await page.waitForLoadState('networkidle');
		await page.fill('input[name="password"]', VIEWER_TEST_PASSWORD);
		await page.click('.cl-formButtonPrimary');
		// Go to Components test page and wait for network to be idle
		await page.waitForTimeout(2000);
		await page.goto('/test/components');
	});

	test('should not show admin or editor components to viewer user', async ({
		page,
	}) => {
		await expect(page.locator('#canContentDelete')).toContainText('false');
		await expect(page.locator('#canContentRead')).toContainText('true');
		await expect(page.locator('#canContentWrite')).toContainText('false');
		await expect(page.locator('#canUsersManage')).toContainText('false');
	});
});

test.describe('RBAC: Test Editor Permissions', () => {
	test.beforeEach(async ({ page }) => {
		// Throw error if environment variables are not set
		if (!EDITOR_TEST_EMAIL || !EDITOR_TEST_PASSWORD) {
			throw new Error(
				'Missing CLERK_TEST_EMAIL_EDITOR or CLERK_TEST_PASSWORD_EDITOR environment variable.',
			);
		}
		// Set up Clerk testing token to bypass bot detection
		await setupClerkTestingToken({ page });

		// Start from sign-in page
		await page.goto('/sign-in');

		// Wait for navigation to complete
		await page.waitForLoadState('networkidle');

		// Wait for Clerk to load and the form to be ready
		await page.waitForSelector('input[name="identifier"]');

		// Sign in as editor user
		await page.fill('input[name="identifier"]', EDITOR_TEST_EMAIL);
		await page.click('.cl-formButtonPrimary');
		await page.waitForLoadState('networkidle');
		await page.fill('input[name="password"]', EDITOR_TEST_PASSWORD);
		await page.click('.cl-formButtonPrimary');
		// Go to Components test page and wait for network to be idle
		await page.waitForTimeout(2000);
		await page.goto('/test/components');
	});

	test('should show editor components but not admin components to editor user', async ({
		page,
	}) => {
		await expect(page.locator('#canContentDelete')).toContainText('false');
		await expect(page.locator('#canContentRead')).toContainText('true');
		await expect(page.locator('#canContentWrite')).toContainText('true');
		await expect(page.locator('#canUsersManage')).toContainText('false');
	});
});
