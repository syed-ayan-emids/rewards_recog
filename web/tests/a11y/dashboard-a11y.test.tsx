import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import axe from 'axe-core'
import Leaderboard from '@/components/organisms/Leaderboard'
import { Card } from '@/components/atoms'

const rows = [
  { id: 'p2', name: 'Daniel Cho', pts: 420 },
  { id: 'me', name: 'Ayan', pts: 380 },
  { id: 'p1', name: 'Aarav Sharma', pts: 275 },
  { id: 'p3', name: 'Priya Menon', pts: 250 },
  { id: 'p6', name: 'Kenji Watanabe', pts: 220 },
]

async function scan(element: HTMLElement) {
  const results = await axe.run(element)
  return results.violations
}

describe('accessibility (axe-core)', () => {
  it('leaderboard has no automatic a11y violations', async () => {
    const { container } = render(<Leaderboard rows={rows} />)
    expect(await scan(container)).toHaveLength(0)
  })

  it('a plain card has no automatic a11y violations', async () => {
    const { container } = render(
      <Card>
        <h2 id="s">Team highlights</h2>
        <button aria-labelledby="s">Open</button>
      </Card>,
    )
    expect(await scan(container)).toHaveLength(0)
  })
})
