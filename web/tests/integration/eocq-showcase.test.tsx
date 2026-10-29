import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EoQShowcase from '@/components/organisms/EoQShowcase'
import { SHOWCASE_SLIDES } from '@/lib/mock-data'

describe('EoQShowcase (integration)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the EoQ slide and advances on the next arrow', () => {
    vi.useFakeTimers()
    render(<EoQShowcase slides={SHOWCASE_SLIDES} />)

    expect(screen.getByText(/Nominations close in 19 days/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText(/Awards worth/)).toBeTruthy()
  })

  it('auto-advances every 5.5s', () => {
    vi.useFakeTimers()
    render(<EoQShowcase slides={SHOWCASE_SLIDES} />)

    expect(screen.getByText(/Nominations close in/)).toBeTruthy()
    vi.advanceTimersByTime(5600)
    expect(screen.getByText(/Awards worth/)).toBeTruthy()
  })

  it('previous arrow wraps back to the last slide', () => {
    vi.useFakeTimers()
    render(<EoQShowcase slides={SHOWCASE_SLIDES} />)

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByText(/jury ballot is half-cast/)).toBeTruthy()
  })

  it('dots jump straight to a slide', () => {
    vi.useFakeTimers()
    render(<EoQShowcase slides={SHOWCASE_SLIDES} />)

    fireEvent.click(screen.getByRole('button', { name: 'Go to Jury Dashboard' }))
    expect(screen.getByText(/jury ballot is half-cast/)).toBeTruthy()
  })

  it('renders Open as the default secondary CTA when cta2 is missing', () => {
    render(<EoQShowcase slides={[{ ...SHOWCASE_SLIDES[1] }]} />)
    expect(screen.getByRole('button', { name: 'Open' })).toBeTruthy()
  })

  it('is resilient to a single-slide deck', () => {
    vi.useFakeTimers()
    render(<EoQShowcase slides={[SHOWCASE_SLIDES[0]]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText(/Nominations close in 19 days/)).toBeTruthy()
  })
})
