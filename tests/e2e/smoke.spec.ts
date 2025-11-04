import { test, expect } from '@playwright/test';

test.describe('Select pages load correctly', () => {
	const pages = [
		{
			url: '/',
		},
	];

	for (const page of pages) {
		test(`page ${page.url} loads ok`, async ({ page: pwPage }) => {
			await pwPage.goto(page.url);
			const content = await pwPage.textContent('body');
			expect(content).not.toBeNull();
		});
	}
});

test.describe('Mode toggle works', () => {
	test.beforeEach(async ({ page }) => {
		// Start from home page
		await page.goto('/');

		// Wait for navigation to complete
		await page.waitForLoadState('networkidle');
	});

	test('should switch to light mode', async ({ page }) => {
		const lightModeButton = page.locator('button#mode_light');
		await lightModeButton.click();

		const htmlElement = page.locator('html');
		const classAttribute = await htmlElement.getAttribute('class');
		expect(classAttribute).toBeFalsy();
	});

	test('should switch to dark mode', async ({ page }) => {
		const darkModeButton = page.locator('button#mode_dark');
		await darkModeButton.click();

		const htmlElement = page.locator('html');
		const classAttribute = await htmlElement.getAttribute('class');
		expect(classAttribute).toBe('dark');
	});
});
