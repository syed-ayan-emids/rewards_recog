import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StatCards } from '@/components/organisms/StatCards'

describe('StatCards (integration)', () => {
  it('renders the wallet, recognitions and milestone tiles', async () => {
    render(<StatCards balance={1240} given={14} got={9} orgRecognitions={279} />)

    expect(screen.getByText('Total points balance')).toBeTruthy()
    expect(screen.getByText('Recognitions given')).toBeTruthy()
    expect(screen.getByText('Recognitions received')).toBeTruthy()
    expect(screen.getByText('Total recognitions at EMIDS')).toBeTruthy()
    expect(screen.getByText('Go to My Rewards')).toBeTruthy()

    // count-up settles on the exact values (animation runs 1.1s — allow headroom)
    await waitFor(
      () => {
        expect(screen.getByText('1,240')).toBeTruthy()
        expect(screen.getByText('279')).toBeTruthy()
      },
      { timeout: 3000 },
    )
  })
})
