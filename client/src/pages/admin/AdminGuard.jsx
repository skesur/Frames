import { useEffect, useState } from 'react'
import { Navigate, Link }      from 'react-router-dom'
import { ShieldAlert }         from 'lucide-react'
import api                     from '@/lib/axios'
import { useAuthStore }        from '@/store/authStore'

function AccessDenied() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-10">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}
        >
          <ShieldAlert size={24} className="text-ember" strokeWidth={1.5} />
        </div>
        <h1 className="font-syne font-bold text-xl text-ghost mb-2">Access Denied</h1>
        <p className="font-dm text-sm text-ghost-muted mb-8 leading-relaxed">
          Admin access required. This area is restricted to Frames operations staff.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-violet hover:bg-violet-dark text-void font-dm font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function AdminGuard({ children }) {
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const [checkingRole, setCheckingRole] = useState(Boolean(isAuthenticated && user?.role !== 'admin'))

  useEffect(() => {
    if (!isAuthenticated || user?.role === 'admin') {
      setCheckingRole(false)
      return
    }

    let active = true

    async function refreshUserRole() {
      try {
        const res = await api.get('/auth/me')
        if (active) updateUser(res.data.user)
      } catch {
        // The normal guard below will keep non-admin or expired sessions out.
      } finally {
        if (active) setCheckingRole(false)
      }
    }

    refreshUserRole()

    return () => {
      active = false
    }
  }, [isAuthenticated, updateUser, user?.role])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (checkingRole) return null
  if (user?.role !== 'admin') return <AccessDenied />

  return children
}
