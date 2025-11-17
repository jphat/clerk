import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.CLERK_TEST_EMAIL
const TEST_PASSWORD = process.env.CLERK_TEST_PASSWORD

test.describe('sign in: email + password', () => {
    test.beforeEach(async ({ page }) => {
        // Set up Clerk testing token to bypass bot detection
        await setupClerkTestingToken({ page })

        // Start from sign-in page
        await page.goto('/sign-in')

        // Wait for navigation to complete
        await page.waitForLoadState('networkidle')

        // Wait for Clerk to load and the form to be ready
        await page.waitForSelector('input[name="identifier"]')
        // await page.waitForSelector('input[name="emailAddress"]', { timeout: 10000 })
    })

    test('should show error for non-existent email', async ({ page }) => {
        await page.fill('input[name="identifier"]', 'nonexistent@example.com')

        await page.click('.cl-formButtonPrimary')

        // Should show error message for non-existent email
        await expect(page.locator('.cl-formFieldErrorText__identifier')).toBeVisible()
    })

    test('should show error for incorrect password', async ({ page }) => {
        if (!TEST_EMAIL) {
            throw new Error("Missing CLERK_TEST_EMAIL environment variable.")
            // test.skip()
            // return
        }

        await page.fill('input[name="identifier"]', TEST_EMAIL)

        await page.click('.cl-formButtonPrimary')

        await page.waitForLoadState('networkidle')

        await page.fill('input[name="password"]', 'wrongpassword')

        await page.click('.cl-formButtonPrimary')

        // Should show error message for incorrect password
        await expect(page.locator('.cl-formFieldErrorText__password')).toBeVisible()
    })

    test('should successfully sign in an existing user', async ({ page }) => {
        // Skip test if environment variables are not set
        if (!TEST_EMAIL || !TEST_PASSWORD) {
            throw new Error("Missing CLERK_TEST_EMAIL or CLERK_TEST_PASSWORD environment variable.")
            // test.skip()
            // return
        }

        await page.fill('input[name="identifier"]', TEST_EMAIL)

        await page.click('.cl-formButtonPrimary')

        await page.waitForLoadState('networkidle')

        await page.fill('input[name="password"]', TEST_PASSWORD)

        await page.click('.cl-formButtonPrimary')

        await page.waitForLoadState('networkidle')

        // await page.goto('/u')

        // await page.waitForLoadState('networkidle')

        // Check for h1 with "Roxie's Dashboard"
        await page.waitForSelector("h1:has-text('Welcome')");
        // await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    })
})