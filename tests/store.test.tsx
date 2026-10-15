import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { StoreProvider, useStore } from '../src/store'
import type { Screen } from '../src/store'

let s: ReturnType<typeof useStore>

function Probe({ capture }: { capture? }) {
  s = useStore()
  if (capture) capture(s)
  return null
}

const renderProbe = (capture?) => render(<StoreProvider><Probe capture={capture} /></StoreProvider>)

describe('StoreProvider', () => {
  it('starts at home with the opening balance', () => {
    const { unmount } = renderProbe()
    expect(s.balance).toBe(1240)
    expect(s.screen).toBe('home')
    unmount()
  })

  it('postGesture adjusts the balance', () => {
    const { unmount } = renderProbe()
    act(() => s.postGesture(10))
    expect(s.balance).toBe(1250)
    act(() => s.postGesture(-10))
    expect(s.balance).toBe(1240)
    unmount()
  })

  it('sendPraise prepends a post, deducts points, and notifies', () => {
    const { unmount } = renderProbe()
    const before = s.posts.length
    act(() => s.sendPraise({ toIds: ['p1'], valueKey: 'ownership', message: 'Great save on the pipeline.', points: 50 }))
    expect(s.posts.length).toBe(before + 1)
    expect(s.posts[0].toIds).toEqual(['p1'])
    expect(s.posts[0].points).toBe(50)
    expect(s.balance).toBe(1240 - 50)
    expect(s.notifications[0].group).toBe('praise')
    unmount()
  })

  it('react toggles myReaction on and off', () => {
    const { unmount } = renderProbe()
    const pid = s.posts[0].id
    const base = s.posts[0].counts.clap ?? 0
    act(() => s.react(pid, 'clap'))
    expect(s.posts[0].myReaction).toBe('clap')
    expect(s.posts[0].counts.clap).toBe(base + 1)
    act(() => s.react(pid, 'none'))
    expect(s.posts[0].myReaction).toBeUndefined()
    expect(s.posts[0].counts.clap).toBe(base)
    unmount()
  })

  it('addComment appends to the post', () => {
    const { unmount } = renderProbe()
    const pid = s.posts[0].id
    const before = s.posts[0].comments.length
    act(() => s.addComment(pid, 'Well deserved'))
    expect(s.posts[0].comments.length).toBe(before + 1)
    expect(s.posts[0].comments.at(-1)?.text).toBe('Well deserved')
    unmount()
  })

  it('markAllRead clears unread notifications', () => {
    const { unmount } = renderProbe()
    expect(s.notifications.some((n) => n.unread)).toBe(true)
    act(() => s.markAllRead())
    expect(s.notifications.every((n) => !n.unread)).toBe(true)
    unmount()
  })

  it('redeem never drops the balance below zero', () => {
    const { unmount } = renderProbe()
    act(() => s.redeem(199999))
    expect(s.balance).toBe(0)
    unmount()
  })

  it('opening the composer routes to a compose screen and closing restores it', () => {
    const { unmount } = renderProbe()
    act(() => s.setScreen('rewards'))
    expect(s.screen).toBe('rewards')
    act(() => s.setComposer({ open: true, preset: { toId: 'p3' } }))
    expect(s.screen).toBe('compose')
    expect(s.openComposer.open).toBe(true)
    expect(s.openComposer.preset?.toId).toBe('p3')
    act(() => s.closeComposer())
    expect(s.openComposer.open).toBe(false)
    expect(s.screen).toBe('rewards')
    unmount()
  })

  it('navigating away from the compose screen closes the composer', () => {
    const { unmount } = renderProbe()
    act(() => s.setComposer({ open: true }))
    expect(s.screen).toBe('compose')
    act(() => s.setScreen('home'))
    expect(s.screen).toBe('home')
    expect(s.openComposer.open).toBe(false)
    unmount()
  })

  it('routes praises with points into the manager approval inbox and records the decision', () => {
    const { unmount } = renderProbe()
    const before = s.approvals.length
    act(() => s.sendPraise({ toIds: ['p1'], valueKey: 'ownership', message: 'Great save on the pipeline.', points: 50 }))
    expect(s.approvals.length).toBe(before + 1)
    expect(s.approvals[0].title).toBe('Ayan wants to award +50 pts to Aarav Sharma')
    expect(s.approvals[0].points).toBe(50)
    expect(s.decided[s.approvals[0].id]).toBeUndefined()
    act(() => s.resolveApproval(s.approvals[0].id, 'approved'))
    expect(s.decided[s.approvals[0].id]).toBe('approved')
    unmount()
  })

  it('zero-point praisess never enter the approval inbox', () => {
    const { unmount } = renderProbe()
    const before = s.approvals.length
    act(() => s.sendPraise({ toIds: ['p3'], valueKey: 'collaboration', message: 'Cross-team glue as always.', points: 0 }))
    expect(s.approvals.length).toBe(before)
    unmount()
  })

  it('toasts are queued and expire', () => {
    vi.useFakeTimers()
    const { unmount } = renderProbe()
    act(() => { s.toast('Hello') })
    expect(s.toasts).toHaveLength(1)
    act(() => { vi.advanceTimersByTime(3600) })
    expect(s.toasts).toHaveLength(0)
    vi.useRealTimers()
    unmount()
  })
})
