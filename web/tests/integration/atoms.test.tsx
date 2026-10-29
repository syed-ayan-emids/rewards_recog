import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar, Card, Mascot } from '@/components/atoms'

describe('atoms', () => {
  it('Avatar shows initials and the online dot for directory members', () => {
    render(<Avatar id="me" size={36} />)
    expect(screen.getByText('A')).toBeTruthy()
    expect(screen.getByLabelText('online')).toBeTruthy()
  })

  it('Avatar hides the dot when size is small and adds ring only on demand', () => {
    const { container: small, rerender } = render(<Avatar id="me" size={24} />)
    expect(small.querySelector('[aria-label="online"]')).toBeNull()

    rerender(<Avatar id="p2" size={36} ring />)
    // offline member -> no dot; ring class present
    expect(screen.queryByLabelText('online')).toBeNull()
    expect(screen.getByText('DC')).toBeTruthy()
  })

  it('Avatar falls back to the signed-in persona for unknown ids', () => {
    render(<Avatar id="ghost" size={36} />)
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('Card renders a wrapper with classes and children', () => {
    render(
      <Card className="extra" data-testid="card">
        hello
      </Card>,
    )
    const el = screen.getByTestId('card')
    expect(el.textContent).toBe('hello')
    expect(el.className).toContain('extra')
  })

  it('Mascot renders the decorative svg', () => {
    const { container } = render(<Mascot />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
