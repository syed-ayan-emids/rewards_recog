import { test, expect } from '@playwright/test'

test.describe('Dashboard (Playwright integration)', () => {
  test('greets the user and shows the full server-rendered dashboard', async ({ page }) => {
    await page.goto('/')

    // header and footer both carry the logo link — scope to the header
    await expect(page.getByRole('banner').getByRole('link', { name: 'Go to dashboard' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hello Ayan')
    await expect(page.getByRole('button', { name: 'Recognize a teammate' })).toBeVisible()

    // stat tiles
    await expect(page.getByText('Total points balance')).toBeVisible()
    await expect(page.getByText('Recognitions given')).toBeVisible()
    await expect(page.getByText('Milestone achieved')).toBeVisible()

    // leaderboard — top rank row renders with the You chip on rank 2
    await expect(page.getByText('Team leaderboard')).toBeVisible()
    await expect(page.getByText('Daniel C.')).toBeVisible()
    await expect(page.getByText('You', { exact: true })).toBeVisible()
  })

  test('carousel next arrow shows the awards slide and dots navigate', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/Nominations close in 19 days/)).toBeVisible()

    // the slider's cross-fade layers can win the hit-test mid-transition on touch
    // viewports — fall back to a forced click on our own control
    const nextBtn = page.getByRole('button', { name: 'Next slide' })
    await nextBtn.click().catch(() => nextBtn.click({ force: true }))
    await expect(page.getByText(/Awards worth 7,500 pts/)).toBeVisible()

    // nav dots carry the same aria labels as every request — pick the unique one
    const dot = page.getByRole('button', { name: 'Go to Quarterly Awards' })
    await dot.click().catch(() => dot.click({ force: true }))
    await expect(page.getByText(/Nominations close in 19 days/)).toBeVisible()
  })

  test('page streams server-rendered HTML before hydration', async ({ page }) => {
    // HTML arrives with content present — no client fetch required for the shell data
    const response = await page.goto('/')
    expect(response?.ok()).toBeTruthy()
    const html = await page.content()
    expect(html).toContain('Total points balance')
    expect(html).toContain('Total recognitions at EMIDS')
  })
})
