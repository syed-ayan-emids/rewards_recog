import React, { useState } from 'react'
import { MessageCircle, Send, Heart, Sparkles, Trophy } from 'lucide-react'
import { Avatar, AvatarStack, Card } from '../ui'
import { CORE_VALUES, REACTIONS, person, type Post, type ReactionKey } from '../data'
import { useStore } from '../store'

export function PraiseCard({ post, index }: { post: Post; index: number }) {
  const { react, addComment } = useStore()
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const from = person(post.fromId)
  const tos = post.toIds.map(person)
  const value = post.valueKey ? CORE_VALUES[post.valueKey] : null
  const isAward = post.kind === 'award'
  const isMilestone = post.kind === 'milestone'
  const isWelcome = post.kind === 'welcome'
  const stamp = isAward
    ? { icon: <Trophy size={15} />, label: post.awardLabel ?? 'Award', tint: 'bg-gold-soft text-gold-ink' }
    : isMilestone
      ? { icon: <Heart size={15} />, label: 'Milestone', tint: 'bg-coral-soft text-coral' }
      : isWelcome
        ? { icon: <Sparkles size={15} />, label: 'Welcome aboard', tint: 'bg-violet-soft text-violet' }
        : null

  return (
    <Card
      className="overflow-hidden transition-shadow duration-200 hover:shadow-lift"
      style={{ animation: `rise .45s cubic-bezier(.22,1,.36,1) ${Math.min(index * 45, 300)}ms both` }}
    >
      {isAward && (
        <div className="hero-room dotgrid relative h-24">
          <span className="absolute right-4 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3d2b00]">
            {post.awardLabel}
          </span>
        </div>
      )}
      <div className={isAward ? 'px-5 pb-4' : 'px-5 pb-2 pt-4'}>
        <div className="flex items-start gap-3">
          <Avatar id={post.fromId} size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">
              <button onClick={(e) => e.preventDefault()} className="font-bold text-navy hover:underline">{from.name}</button>
              {' '}{isAward ? 'announced' : isMilestone ? 'celebrates' : isWelcome ? 'welcomes' : 'praised'}{' '}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <AvatarStack ids={post.toIds} size={26} />
              <span className="text-sm font-bold text-navy">{tos.map((t) => t.name).join(', ')}</span>
              {stamp && (
                <span className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${stamp.tint}`}>
                  {stamp.icon} {stamp.label}
                </span>
              )}
              {value && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${value.soft} ${value.ink}`}>{value.label}</span>}
            </div>
          </div>
          {post.points ? (
            <span className="tnum shrink-0 rounded-full bg-gold px-2.5 py-1 text-xs font-extrabold text-[#3d2b00]">+{post.points} pts</span>
          ) : null}
        </div>

        <p className="mt-3.5 text-[15px] leading-relaxed text-ink">{post.message}</p>

        <div className="mt-4 flex flex-wrap items-center gap-1">
          {REACTIONS.map((r) => {
            const n = post.counts[r.key] ?? 0
            const mine = post.myReaction === r.key
            return (
              <button
                key={r.key}
                aria-label={mine ? `${r.label} — you reacted` : `React with ${r.label}`}
                onClick={() => react(post.id, mine ? 'none' : r.key)}
                className={`tnum flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12.5px] font-bold transition active:scale-95 ${
                  mine ? 'bg-gold text-[#3d2b00]' : n === 0 ? 'text-muted hover:bg-slate-50' : 'border border-line bg-white text-ink hover:border-gold/50'
                }`}
              >
                <span aria-hidden>{r.icon}</span>
                {n > 0 ? n : ''}
              </button>
            )
          })}
          {post.comments.length > 0 && (
            <button onClick={() => setShowComments(!showComments)} className="ml-1 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12.5px] font-bold text-muted transition hover:bg-slate-50">
              <MessageCircle size={14} /> {post.comments.length} comments
            </button>
          )}
          <button onClick={() => setShowComments(!showComments)} className="ml-auto flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12.5px] font-bold text-brand transition hover:bg-brand/5">
            Reply
          </button>
        </div>

        {showComments && (
          <div className="mt-3 space-y-2.5 border-t border-line pt-3">
            {post.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <Avatar id={c.fromId} size={28} />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-slate-50 px-3 py-2">
                  <p className="text-[13px]"><span className="font-bold text-navy">{person(c.fromId).name}</span> <span className="text-muted">· {c.when}</span></p>
                  <p className="text-[13.5px] text-ink">{c.text}</p>
                </div>
              </div>
            ))}
            <form
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { addComment(post.id, draft.trim()); setDraft('') } }}
              className="flex items-center gap-2"
            >
              <Avatar id="me" size={28} />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a comment…"
                aria-label="Add a comment"
                className="h-9 flex-1 rounded-full border border-line bg-slate-50 px-4 text-sm outline-none placeholder:text-muted focus:border-brand/40 focus:bg-white"
              />
              {draft.trim() && (
                <button type="submit" aria-label="Post comment" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                  <Send size={15} />
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </Card>
  )
}
