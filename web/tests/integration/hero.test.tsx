import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import Hero from '@/components/organisms/Hero'

describe('Hero (integration)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('greets the logged-in person and offers the recognize action', () => {
    vi.useFakeTimers()
    render(<Hero name="Ayan" />)

    // the visible cycle text is styled uppercase by CSS — assert the accessible name
    expect(screen.getByText(/Hello Ayan/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Recognize a teammate' })).toBeTruthy()
  })

  it('rotates to the second headline after 4.2s', async () => {
    vi.useFakeTimers()
    render(<Hero name="Ayan" />)

    expect(screen.getByText(/celebrate the progress./)).toBeTruthy()
    await act(async () => {
      vi.advanceTimersByTime(4300)
    })
    expect(screen.getByText(/someone had a great week./)).toBeTruthy()
  })

  it('rotates the recognize button phrasing on its own timer', async () => {
    vi.useFakeTimers()
    render(<Hero name="Ayan" />)

    expect(screen.getByRole('button', { name: 'Recognize a teammate' })).toBeTruthy()
    await act(async () => {
      vi.advanceTimersByTime(3300)
    })
    // the cycle text changes inside the button; the aria-label stays stable on purpose
    expect(screen.getByText('Say Thanks')).toBeTruthy()
  })

  it('falls back to the poster image when the hero video fails', async () => {
    vi.useFakeTimers()
    render(<Hero name="Ayan" />)

    const video = document.querySelector('video')
    expect(video).toBeTruthy()
    await act(async () => {
      fireEvent.error(video!)
    })
    // next/image rewrites src — match on the file name instead of the exact attribute
    expect(document.querySelector('img[src*="emids-hero.webp"]')).toBeTruthy()
    expect(document.querySelector('video')).toBeNull()
  })
})
