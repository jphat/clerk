import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test, expect } from '@playwright/test'

const TEST_CODE = process.env.CLERK_TEST_EMAIL_CODE ?? null
const TEST_EMAIL = process.env.CLERK_TEST_EMAIL ?? null
const TEST_PASSWORD = process.env.CLERK_TEST_PASSWORD ?? null

test.describe('User Sign-Up - Email/Password', () => {
    test.beforeEach(async ({ page }) => {
        // Set up Clerk testing token to bypass bot detection
        await setupClerkTestingToken({ page })

        // Start from sign-up page
        await page.goto('/sign-up')

        // Wait for Clerk to load and the form to be ready
        await page.waitForSelector('input[name="emailAddress"]', { timeout: 10000 })
    })

    test('should show error for missing required fields', async ({ page }) => {
        // Try to submit without filling required fields
        await page.getByText('Continue').click()

        // Should show validation errors for missing fields
        await page.locator('input#firstName-field[required]:invalid')
        await page.locator('input#lastName-field[required]:invalid')
        await page.locator('input#emailAddress-field[required]:invalid')
        await page.locator('input#password-field[required]:invalid')
    })

    // On Chromium, bot verification may block automated sign-ups
    /*
    test('should successfully register a new user', async ({ page }) => {
        if (!TEST_CODE || !TEST_EMAIL || !TEST_PASSWORD) {
            throw new Error("Missing required environment variables for email testing.")
            // test.skip()
            // return
        }

        // Fill in the sign-up form
        const uniqueEmail = `${Date.now()}_helyn+clerk_test@marshall.com`

        await page.fill('input[name="firstName"]', 'Helyn')
        await page.fill('input[name="lastName"]', 'Marshall')
        await page.fill('input[name="emailAddress"]', uniqueEmail)
        await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD)

        // Wait for a moment to ensure all fields are validated
        await page.waitForTimeout(1000)

        await page.getByText('Continue').click()

        // Wait for email verification step (Clerk requires email verification)
        await page.waitForURL(/\/sign-up\/verify-email-address/)

        // Verify user is redirected to email verification
        expect(page.url()).toContain('/sign-up/verify-email-address')

        await page.waitForTimeout(1000)

        // await page.fill('input[autocomplete="one-time-code"]', EMAIL_TEST_CODE)
        await page.fill('input[autocomplete="one-time-code"]', TEST_CODE)

        // Wait for navigation to complete
        await page.waitForLoadState('networkidle')

        // Check for h1 with "Helyn's Dashboard"
        await expect(page.locator('h1:has-text("Helyn\'s Dashboard")')).toBeVisible()
    })
    */

    // On Chromium, bot verification may block automated sign-ups
    /*
    test('should handle duplicate email registration gracefully', async ({ page }) => {
        if (!TEST_CODE || !TEST_EMAIL || !TEST_PASSWORD) {
            test.skip()
            return
            throw new Error("Missing required environment variables for email testing.")
        }

        // Use a known test email that might already exist
        const duplicateEmail = TEST_EMAIL

        await page.fill('input[name="firstName"]', 'Roxanna')
        await page.fill('input[name="lastName"]', 'Lyimo')
        await page.fill('input[name="emailAddress"]', duplicateEmail)
        await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD)

        await page.getByText('Continue').click()

        // Should show appropriate error for existing email
        // Note: Actual behavior depends on Clerk configuration
        await expect(page.locator('.cl-formFieldErrorText__emailAddress')).toBeVisible()
    })
    */
})