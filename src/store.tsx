import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { POSTS, NOTIFICATIONS, PEOPLE } from './data'
import type { Post, ReactionKey } from './data'

export type Screen = 'home' | 'team' | 'rewards' | 'awards' | 'jury' | 'profile' | 'compose'

export interface ComposerPreset {
  /** Person pre-selected in the "To" field of the composer. */
  toId?: string
}

export interface ComposerState {
  open: boolean
  preset?: ComposerPreset
}

export interface SendPraisePayload {
  toIds: string[]
  valueKey: string
  message: string
  points: number
  /** Optional template id that prefilled the message. */
  tpl?: string
}

export type Toast = { id: number; msg: string; kind?: 'gold' | 'mint' | 'navy' }

type Ctx = {
  balance: number
  postGesture: (n: number) => void
  posts: Post[]
  sendPraise: (p: SendPraisePayload) => void
  react: (postId: string, key: ReactionKey | 'none') => void
  addComment: (postId: string, text: string) => void
  notifications: typeof NOTIFICATIONS
  markAllRead: () => void
  redeem: (pts: number) => void
  openComposer: ComposerState
  setComposer: (o: ComposerState) => void
  composerFrom: Screen
  closeComposer: () => void
  openAi: boolean
  setAi: (b: boolean) => void
  toasts: Toast[]
  toast: (msg: string, kind?: Toast['kind']) => void
  screen: Screen
  setScreen: (s: Screen, param?: string) => void
  screenParam?: string
  profileId: string
  openProfile: (id: string) => void
}

const StoreCtx = createContext<Ctx>(null as unknown as Ctx)
export const useStore = () => useContext(StoreCtx)

export interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [balance, setBalance] = useState(1240)
  const [posts, setPosts] = useState<Post[]>(POSTS)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [composer, setComposerRaw] = useState<ComposerState>({ open: false })
  const [composerFrom, setComposerFrom] = useState<Screen>('home')
  const [ai, setAi] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [screen, setScreenRaw] = useState<Screen>('home')
  const [screenParam, setScreenParam] = useState<string | undefined>()
  const [profileId, setProfileId] = useState('me')

  const toastId = useRef(0)
  const toast = (msg: string, kind?: Toast['kind']) => {
    const id = ++toastId.current
    setToasts((t) => [...t.slice(-1), { id, msg, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }

  const postGesture = (n: number) => setBalance((b) => b + n)

  const sendPraise = ({ toIds, valueKey, message, points, tpl }: SendPraisePayload) => {
    const p: Post = {
      id: 'u' + Date.now(), kind: 'praise', fromId: 'me', toIds, valueKey: valueKey as Post['valueKey'],
      tpl, message, points, when: 'Just now', comments: [], counts: {},
    }
    setPosts((prev) => [p, ...prev])
    if (points > 0) setBalance((b) => b - points)
    setNotifications((n) => [
      { id: 'nt' + Date.now(), group: 'praise', title: `Your praise reached ${toIds.map((i) => PEOPLE[i]?.name ?? 'teammate').join(', ')}'s manager`, sub: points > 0 ? `${points} pts attached` : 'No points attached', when: 'Just now', unread: true, go: 'home' },
      ...n,
    ])
    toast('Sent! Their manager has been notified.', 'gold')
  }

  const react = (postId: string, key: ReactionKey | 'none') => {
    setPosts((prev) => prev.map((p): Post => {
      if (p.id !== postId) return p
      const counts: Partial<Record<ReactionKey, number>> = { ...p.counts }
      const mine = p.myReaction ?? null
      if (mine) counts[mine] = Math.max(0, (counts[mine] ?? 1) - 1)
      if (key !== 'none') counts[key] = (counts[key] ?? 0) + 1
      return { ...p, counts, myReaction: key === 'none' ? undefined : key }
    }))
  }

  const addComment = (postId: string, text: string) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: 'u' + Date.now(), fromId: 'me', text, when: 'Just now' }] } : p))
  }

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, unread: false })))

  const redeem = (pts: number) => setBalance((b) => Math.max(0, b - pts))

  const setScreen = (s: Screen, param?: string) => { setComposerRaw({ open: false }); setScreenRaw(s); setScreenParam(param); window.scrollTo({ top: 0 }) }
  const openProfile = (id: string) => { setComposerRaw({ open: false }); setProfileId(id); setScreenRaw('profile'); window.scrollTo({ top: 0 }) }
  const setComposer = (o: ComposerState) => {
    if (o.open && !composer.open) setComposerFrom(screen)
    setComposerRaw(o)
    if (o.open) setScreenRaw('compose')
  }
  const closeComposer = () => { setComposerRaw({ open: false }); setScreen(composerFrom) }

  const value: Ctx = { balance, postGesture, posts, sendPraise, react, addComment, notifications, markAllRead, redeem, openComposer: composer, setComposer, composerFrom, closeComposer, openAi: ai, setAi, toasts, toast, screen, setScreen, screenParam, profileId, openProfile }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useCountUp(target: number, ms = 900) {
  const [n, setN] = useState(0)
  const ref = useRef(0)
  useEffect(() => {
    const from = ref.current, to = target, t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      const eased = 1 - Math.pow(1 - k, 3)
      const cur = Math.round(from + (to - from) * eased)
      setN(cur); ref.current = cur
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return n
}

export function fmtNum(n: number) { return n.toLocaleString('en-IN') }
