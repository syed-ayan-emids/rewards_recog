import { describe, it, expect } from 'vitest'
import { getMe, getDashboardStats, getLeaderboard, getShowcaseSlides } from '@/lib/data-api'
import { TEAM_LEADERBOARD, ORG_STATS, DASH_STATS, SHOWCASE_SLIDES } from '@/lib/mock-data'

describe('data-api façade', () => {
  it('returns the signed-in user', async () => {
    await expect(getMe()).resolves.toEqual({ name: 'Ayan' })
  })

  it('serves dashboard stats that never drift from mock data', async () => {
    await expect(getDashboardStats()).resolves.toEqual({
      balance: 1240,
      given: DASH_STATS.given,
      got: DASH_STATS.got,
      orgRecognitions: ORG_STATS.recognitions,
    })
  })

  it('serves the leaderboard and slides verbatim', async () => {
    await expect(getLeaderboard()).resolves.toBe(TEAM_LEADERBOARD)
    await expect(getShowcaseSlides()).resolves.toBe(SHOWCASE_SLIDES)
  })
})
