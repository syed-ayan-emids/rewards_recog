import { describe, it, expect } from 'vitest'
import { fmtNum } from '@/lib/format'
import { initials } from '@/lib/mock-data'

describe('fmtNum', () => {
  it('inserts thousands separators', () => {
    expect(fmtNum(1240)).toBe('1,240')
  })

  it('leaves small numbers alone', () => {
    expect(fmtNum(9)).toBe('9')
  })
})

describe('initials', () => {
  it('takes the first two given-name initials', () => {
    expect(initials('Kenji Watanabe')).toBe('KW')
  })

  it('falls back to a single initial for one-word names', () => {
    expect(initials('Ayan')).toBe('A')
  })
})
