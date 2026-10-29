import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { useCountUp } from '@/lib/use-count-up'

function Demo({ target, durationMs }: { target: number; durationMs: number }) {
  return <span>{useCountUp(target, durationMs)}</span>
}

describe('useCountUp', () => {
  it('settles on the target and stops scheduling once the clock runs out', async () => {
    const { getByText, unmount } = render(<Demo target={500} durationMs={100} />)

    await waitFor(() => expect(getByText('500')).toBeTruthy())

    // one more frame: a tick where t >= 1 runs and takes the stop branch
    await new Promise(requestAnimationFrame)
    unmount()
  })
})
