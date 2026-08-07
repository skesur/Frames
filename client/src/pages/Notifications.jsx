import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Check, Inbox, Package, Sparkles, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

export default function Notifications() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore()

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  // Fetch notifications once on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function getNotifIcon(type) {
    switch (type) {
      case 'in-stock':
        return <Package size={16} className="text-ember" />
      case 'new-product':
        return <Sparkles size={16} className="text-teal" />
      default:
        return <Bell size={16} className="text-violet" />
    }
  }

  return (
    <div className="min-h-screen bg-void pt-24 md:pt-28 pb-20">
      <div className="frame-container max-w-3xl">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 font-dm text-sm text-ghost-muted hover:text-ghost hover:border-white/20 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6 mb-8">
          <div>
            <h1 className="font-syne font-bold text-ghost text-3xl md:text-4xl leading-tight flex items-center gap-3">
              Notification Hub
              {unreadCount > 0 && (
                <span className="rounded-full bg-ember/15 border border-ember/30 px-2.5 py-0.5 font-mono text-xs text-ember font-bold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="font-dm text-sm text-ghost-muted mt-1">
              Stay updated on restocks, new arrivals, and system alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchNotifications()}
              disabled={loading}
              className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-ghost-muted hover:text-ghost transition-colors hover:bg-white/[0.02]"
              title="Refresh notifications"
            >
              <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-2 font-dm text-xs font-semibold text-violet hover:bg-violet hover:text-void hover:shadow-[0_0_15px_rgba(155,92,246,0.3)] transition-all duration-200"
              >
                <Check size={14} strokeWidth={2.5} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && notifications.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-10 h-10 rounded-full border border-violet/20 border-t-violet animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-ghost-muted animate-pulse">
              Retrieving updates...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-ghost-muted/30 mb-4">
              <Inbox size={20} />
            </div>
            <h3 className="font-syne font-bold text-ghost text-lg mb-1">Inbox Clean</h3>
            <p className="font-dm text-sm text-ghost-muted max-w-sm">
              You are all caught up! When products you subscribe to are restocked, they will appear here.
            </p>
          </div>
        ) : (
          /* Notification List */
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={cn(
                  'relative rounded-xl border p-5 transition-all duration-300 flex items-start gap-4',
                  notif.isRead
                    ? 'border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]'
                    : 'border-violet/25 bg-violet/[0.02] hover:bg-violet/[0.03]'
                )}
              >
                {/* Visual indicator bar on the left for unread */}
                {!notif.isRead && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-violet" />
                )}

                {/* Type Icon */}
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  {getNotifIcon(notif.type)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className={cn(
                      'font-syne font-semibold text-sm truncate',
                      notif.isRead ? 'text-ghost/85' : 'text-ghost font-bold'
                    )}>
                      {notif.title}
                    </h3>
                    <span className="font-mono text-[9px] text-ghost-muted/50 flex-shrink-0">
                      {new Date(notif.createdAt).toLocaleTimeString('en-IN', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  
                  <p className="font-dm text-sm text-ghost-muted leading-relaxed mb-3">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3">
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-violet hover:text-violet-light transition-colors"
                      >
                        Check Product <ExternalLink size={10} />
                      </Link>
                    )}

                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="inline-flex items-center gap-1 font-dm text-[11px] text-ghost-muted hover:text-ghost transition-colors"
                      >
                        <Check size={12} className="text-teal" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
