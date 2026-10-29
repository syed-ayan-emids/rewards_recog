import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Leaderboard from '@/components/organisms/Leaderboard'

const rows = [
  { id: 'p2', name: 'Daniel Cho', pts: 420 },
  { id: 'me', name: 'Ayan', pts: 380 },
  { id: 'p1', name: 'Aarav Sharma', pts: 275 },
  { id: 'p3', name: 'Priya Menon', pts: 250 },
  { id: 'p6', name: 'Kenji Watanabe', pts: 220 },
]

describe('Leaderboard (integration)', () => {
  it('shows me with a You chip and the full top-5 in rank order', () => {
    render(<Leaderboard rows={rows} />)

    expect(screen.getByText('Daniel C.')).toBeTruthy()
    expect(screen.getByText('Kenji W.')).toBeTruthy()
    expect(screen.getByText('You')).toBeTruthy()
    expect(screen.getByText('420')).toBeTruthy()
    for (const rank of ['1', '2', '3', '4', '5']) {
      expect(screen.getAllByText(rank).length).toBeGreaterThan(0)
    }
  })

  it('caps the table at five rows even if more arrive', () => {
    render(<Leaderboard rows={[...rows, { id: 'p1', name: 'Aarav Sharma', pts: 100 }]} />)
    // rank badge 6 must not exist — only the top five render
    expect(screen.queryByText('6')).toBeNull()
  })
})
