import { useState, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import api               from '@/lib/axios'
import { useAuthStore }  from '@/store/authStore'
import { cn }            from '@/lib/utils'

export default function AdminUsers() {
  const currentUser = useAuthStore((s) => s.user)

  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [toast,   setToast]   = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  async function fetchUsers() {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      const res = await api.get('/admin/users', { params })
      setUsers(res.data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [search])

  async function handleRoleChange(userId, newRole) {
    if (userId === currentUser?._id && newRole !== 'admin') {
      setToast({ type: 'error', message: 'You cannot remove your own admin access.' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    try {
      setUpdatingId(userId)
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data.user : u)))
      setToast({ type: 'success', message: 'Role updated' })
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to update role' })
    } finally {
      setUpdatingId(null)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-bold text-xl text-ghost mb-1">Users</h1>
        <p className="font-dm text-sm text-ghost-muted">{users.length} registered accounts</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ghost-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-9 pr-4 py-2.5 font-dm text-sm text-ghost placeholder:text-ghost-muted/40 focus:outline-none focus:border-violet/40"
        />
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-white/[0.03] animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <p className="font-dm text-sm text-ghost-muted text-center py-16">No users found</p>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1fr_1fr_120px_100px_140px] gap-4 px-5 py-3 border-b border-white/[0.06]">
              {['Name', 'Email', 'Phone', 'Joined', 'Role'].map((h) => (
                <span key={h} className="font-mono text-[10px] uppercase tracking-widest text-ghost/40">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-white/[0.05]">
              {users.map((u) => (
                <div key={u._id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_100px_140px] gap-2 md:gap-4 px-5 py-4 hover:bg-white/[0.015] transition-colors">
                  <div>
                    <p className="font-dm text-sm text-ghost">{u.name}</p>
                    {u._id === currentUser?._id && <span className="font-mono text-[9px] text-violet">(you)</span>}
                  </div>
                  <p className="font-dm text-xs text-ghost-muted truncate">{u.email}</p>
                  <p className="font-dm text-xs text-ghost-muted">{u.phone || '—'}</p>
                  <p className="font-mono text-[10px] text-ghost-muted/60">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="relative">
                    <select
                      value={u.role}
                      disabled={updatingId === u._id}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className={cn(
                        'w-full appearance-none cursor-pointer rounded-lg border px-3 py-1.5 pr-8 font-mono text-[10px] uppercase tracking-widest transition-colors',
                        u.role === 'admin' ? 'text-violet bg-violet/10 border-violet/25' : 'text-ghost-muted bg-white/[0.03] border-white/[0.08]'
                      )}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ghost-muted/50 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl border font-dm text-sm shadow-lg',
          toast.type === 'error' ? 'bg-red-400/10 border-red-400/25 text-red-300' : 'bg-teal/10 border-teal/25 text-teal'
        )}>
          {toast.message}
        </div>
      )}
    </div>
  )
}