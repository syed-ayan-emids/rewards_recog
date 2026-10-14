import { describe, it, expect } from 'vitest'
import {
  PEOPLE, PEOPLE_LIST, person, initials,
  CORE_VALUES, VALUE_KEYS, VALUE_TEMPLATES,
  POSTS, PENDING_APPROVALS, AWARD_CATEGORIES, JURY_NOMINEES,
  TEAM_LEADERBOARD, TEAM_STATS, TEAMS, TOP_VALUES, ORG_TREE,
} from '../src/data'

const treeIds = (n: typeof ORG_TREE): string[] => [n.id, ...(n.children ?? []).flatMap(treeIds)]

describe('people', () => {
  it('has a "me" persona and unique ids', () => {
    expect(PEOPLE.me).toBeDefined()
    const ids = PEOPLE_LIST.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every person a name and title', () => {
    for (const p of PEOPLE_LIST) {
      expect(p.name.length).toBeGreaterThan(0)
      expect(p.title.length).toBeGreaterThan(0)
    }
  })

  it('keeps manager references valid', () => {
    for (const p of PEOPLE_LIST) {
      if (p.managerId) expect(PEOPLE[p.managerId]).toBeDefined()
    }
  })

  it('falls back to "me" for unknown ids', () => {
    expect(person('does-not-exist').id).toBe('me')
  })
})

describe('initials', () => {
  it('takes the first two initials, uppercased', () => {
    expect(initials('Ayan')).toBe('A')
    expect(initials('Priya Menon')).toBe('PM')
  })
})

describe('core values', () => {
  it('exposes the five emids values', () => {
    expect(VALUE_KEYS).toHaveLength(5)
    for (const k of VALUE_KEYS) expect(CORE_VALUES[k].label.length).toBeGreaterThan(0)
  })
})

describe('praise templates', () => {
  it('has at least one template for every value', () => {
    for (const k of VALUE_KEYS) expect(VALUE_TEMPLATES[k].length).toBeGreaterThan(0)
  })

  it('gives each template an id, name and emoji, with no live tokens left', () => {
    for (const list of Object.values(VALUE_TEMPLATES)) {
      for (const t of list) {
        expect(t.id.length).toBeGreaterThan(0)
        expect(t.name.length).toBeGreaterThan(0)
        expect(t.emoji.length).toBeGreaterThan(0)
        if (t.prefill) expect(t.prefill).not.toContain('{recipient}')
      }
    }
  })
})

describe('feed posts', () => {
  it('references real people', () => {
    for (const p of POSTS) {
      expect(PEOPLE[p.fromId]).toBeDefined()
      for (const id of p.toIds) expect(PEOPLE[id]).toBeDefined()
    }
  })

  it('never carries negative reaction counts', () => {
    for (const p of POSTS) {
      for (const n of Object.values(p.counts)) expect(n).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('leaderboard', () => {
  it('is sorted highest first with valid ids', () => {
    expect(TEAM_LEADERBOARD.length).toBeGreaterThan(0)
    for (const r of TEAM_LEADERBOARD) expect(PEOPLE[r.id]).toBeDefined()
    for (let i = 1; i < TEAM_LEADERBOARD.length; i++) {
      expect(TEAM_LEADERBOARD[i - 1].pts).toBeGreaterThanOrEqual(TEAM_LEADERBOARD[i].pts)
    }
  })
})

describe('team stats', () => {
  it('has entries for every declared team and real ids', () => {
    expect(TEAMS.length).toBeGreaterThan(1)
    for (const t of TEAMS) expect(TEAM_STATS[t.id]).toBeDefined()
    for (const rows of Object.values(TEAM_STATS)) {
      for (const row of rows) expect(PEOPLE[row.id]).toBeDefined()
    }
  })
})

describe('approvals', () => {
  it('has unique ids and a valid routing chain', () => {
    const ids = PENDING_APPROVALS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const a of PENDING_APPROVALS) {
      expect(a.route.length).toBeGreaterThan(0)
      expect(['pass', 'flag']).toContain(a.policy.verdict)
    }
  })
})

describe('jury nominations', () => {
  it('nominates real people into declared categories', () => {
    const names = AWARD_CATEGORIES.map((c) => c.name)
    for (const j of JURY_NOMINEES) {
      expect(PEOPLE[j.nomId]).toBeDefined()
      expect(names).toContain(j.categories)
    }
  })
})

describe('org tree', () => {
  it('only contains known people, without duplicates', () => {
    const ids = treeIds(ORG_TREE)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(PEOPLE[id]).toBeDefined()
  })
})

describe('top values', () => {
  it('is ranked and maps to real values', () => {
    for (let i = 1; i < TOP_VALUES.length; i++) {
      expect(TOP_VALUES[i - 1].count).toBeGreaterThanOrEqual(TOP_VALUES[i].count)
    }
    for (const tv of TOP_VALUES) expect(CORE_VALUES[tv.key]).toBeDefined()
  })
})
