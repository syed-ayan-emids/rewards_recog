// The single data swap point. Today everything resolves from mock data;
// when the FastAPI backend lands, each function becomes one fetch call
// (e.g. `${API_BASE}/leaderboard`) and no component changes.

import {
  TEAM_LEADERBOARD,
  ORG_STATS,
  DASH_STATS,
  SHOWCASE_SLIDES,
  type LeaderRow,
  type Slide,
} from './mock-data'

export async function getMe(): Promise<{ name: string }> {
  return { name: 'Ayan' }
}

export async function getDashboardStats(): Promise<{
  balance: number
  given: number
  got: number
  orgRecognitions: number
}> {
  return {
    balance: 1240,
    given: DASH_STATS.given,
    got: DASH_STATS.got,
    orgRecognitions: ORG_STATS.recognitions,
  }
}

export async function getLeaderboard(): Promise<LeaderRow[]> {
  return TEAM_LEADERBOARD
}

export async function getShowcaseSlides(): Promise<Slide[]> {
  return SHOWCASE_SLIDES
}
