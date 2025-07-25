import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // Check that the page has the expected title
    await expect(page).toHaveTitle(/evBlog/)

    // Check that the main heading is visible
    await expect(
      page.getByRole('heading', { name: /Welcome to evBlog/ })
    ).toBeVisible()

    // Check that feature sections are visible
    await expect(page.getByText('Authentication')).toBeVisible()
    await expect(page.getByText('Content Management')).toBeVisible()
    await expect(page.getByText('Modern Stack')).toBeVisible()

    // Check development status indicator
    await expect(page.getByText('Under Development - Wave 1')).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')

    // Check meta description
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(metaDescription).toContain('modern blog platform')

    // Check Open Graph tags
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content')
    expect(ogTitle).toContain('evBlog')
  })

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')
    await expect(page.getByText('Welcome to evBlog')).toBeVisible()

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('Welcome to evBlog')).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Welcome to evBlog')).toBeVisible()
  })
})

test.describe('Error Pages', () => {
  test('should show 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page')

    await expect(
      page.getByRole('heading', { name: /Page Not Found/ })
    ).toBeVisible()
    await expect(page.getByText('Go home')).toBeVisible()
    await expect(page.getByText('Browse blog')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/')

    // Check for proper heading hierarchy
    const h1 = await page.locator('h1').count()
    expect(h1).toBe(1)

    // Check for alt text on images (when we add them)
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Test tab navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check that focus is visible
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})
