import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Avatar, Card } from '../ui'
import { ORG_TREE, person } from '../data'
import type { TreeNode } from '../data'
import { useStore } from '../store'

export default function OrgTreeScreen() {
  const { openProfile } = useStore()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }))

  const findNode = (id: string): TreeNode | null => {
    const walk = (n: typeof ORG_TREE): typeof ORG_TREE | null => {
      if (n.id === id) return n
      for (const c of n.children ?? []) {
        const r = walk(c)
        if (r) return r
      }
      return null
    }
    return walk(ORG_TREE)
  }

  function Node({ id, depth = 0 }: { id: string; depth?: number }) {
    const node = findNode(id)
    const p = person(id)
    const kids = node?.children ?? []
    const isCollapsed = collapsed[id]
    const isRoot = depth === 0

    return (
      <div className="relative">
        {/* Person card */}
        <div
          className={`group flex w-fit items-center gap-3 rounded-xl border px-4 py-2.5 transition hover:shadow-lift ${
            isRoot
              ? 'dotgrid border-navy bg-navy text-white'
              : kids.length > 0
                ? 'border-brand/30 bg-white shadow-card'
                : 'border-line bg-white'
          }`}
        >
          <Avatar id={id} size={isRoot ? 42 : 34} ring={isRoot} />
          <div className="w-44 min-w-0">
            <button
              onClick={() => openProfile(id)}
              className={`block max-w-full truncate text-[13px] font-extrabold hover:underline ${isRoot ? 'text-white' : 'text-navy'}`}
            >
              {p.name}
            </button>
            <p className={`truncate text-[10.5px] ${isRoot ? 'text-white/60' : 'text-muted'}`}>{p.title}</p>
          </div>
          {kids.length > 0 && (
            <button
              onClick={() => toggle(id)}
              aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${p.name}'s reports`}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition ${isRoot ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-slate-100 text-muted hover:bg-slate-200'}`}
            >
              {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
        </div>

        {/* Children subtree with connector spine */}
        {kids.length > 0 && !isCollapsed && (
          <div className="relative ml-6 mt-2 space-y-2.5 border-l-2 border-[#c9d8ee] pl-7">
            {kids.map((k) => (
              <div key={k.id} className="relative">
                <span className="absolute -left-[29px] top-[26px] h-px w-7 bg-[#c9d8ee]" aria-hidden />
                <Node id={k.id} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="p-6">
      <Node id={ORG_TREE.id} depth={0} />
    </Card>
  )
}
