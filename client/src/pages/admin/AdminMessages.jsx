import { useEffect, useState } from 'react'
import { Mail, Search, CheckCircle2 } from 'lucide-react'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'read', label: 'Read' },
]

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [error, setError] = useState('')

  async function fetchMessages() {
    try {
      setLoading(true)
      setError('')
      const params = {}
      if (search) params.search = search
      if (status !== 'all') params.status = status
      const res = await api.get('/admin/messages', { params })
      setMessages(res.data.messages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchMessages, 300)
    return () => clearTimeout(t)
  }, [search, status])

  async function markRead(message) {
    if (message.status === 'read') return
    try {
      const res = await api.put(`/admin/messages/${message._id}/status`, { status: 'read' })
      setMessages((prev) => prev.map((m) => (m._id === message._id ? res.data.message : m)))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-bold text-xl text-ghost mb-1">Messages</h1>
        <p className="font-dm text-sm text-ghost-muted">Contact form submissions from customers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ghost-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-9 pr-4 py-2.5 font-dm text-sm text-ghost placeholder:text-ghost-muted/40 focus:outline-none focus:border-violet/40"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatus(id)}
              className={cn(
                'flex-shrink-0 font-dm text-xs px-3.5 py-2 rounded-full border transition-all duration-200',
                status === id ? 'bg-violet border-violet text-void font-semibold' : 'border-white/[0.1] text-ghost-muted hover:border-white/25'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-lg bg-white/[0.03] animate-pulse" />)}
          </div>
        ) : messages.length === 0 ? (
          <p className="font-dm text-sm text-ghost-muted text-center py-16">No messages found</p>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {messages.map((message) => (
              <article key={message._id} className="p-5 hover:bg-white/[0.015] transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Mail size={14} className="text-ember" />
                      <h2 className="font-syne font-semibold text-ghost text-base">{message.subject}</h2>
                      <span className={cn(
                        'font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border',
                        message.status === 'new'
                          ? 'text-ember bg-ember/10 border-ember/25'
                          : 'text-teal bg-teal/10 border-teal/25'
                      )}>
                        {message.status}
                      </span>
                    </div>
                    <p className="font-dm text-sm text-ghost-muted mb-3 leading-relaxed whitespace-pre-line">
                      {message.message}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-dm text-xs text-ghost-muted/70">
                      <span>{message.name}</span>
                      <a className="text-violet hover:text-violet-light" href={`mailto:${message.email}`}>{message.email}</a>
                      {message.phone && <span>{message.phone}</span>}
                      <span>{new Date(message.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {message.status !== 'read' && (
                    <button
                      type="button"
                      onClick={() => markRead(message)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 font-dm text-xs text-ghost-muted hover:text-teal hover:border-teal/30 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
