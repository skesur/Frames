import { useState, useEffect } from 'react'
import { Users, Package, ClipboardList, IndianRupee, Clock } from 'lucide-react'
import api from '@/lib/axios'
import { formatPrice, cn } from '@/lib/utils'

const STATUS_STYLES = {
  processing: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  shipped:    { color: 'text-violet',    bg: 'bg-violet/10',    border: 'border-violet/20'    },
  delivered:  { color: 'text-teal',      bg: 'bg-teal/10',      border: 'border-teal/20'      },
}

function StatCard({ Icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
        style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
      >
        <Icon size={16} style={{ color: accent }} strokeWidth={1.75} />
      </div>
      <p className="font-syne font-bold text-2xl text-ghost mb-1">{value}</p>
      <p className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">{label}</p>
    </div>
  )
}

export default function AdminOverview() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const res = await api.get('/admin/stats')
        setStats(res.data.stats)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
        {error}
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-syne font-bold text-xl text-ghost mb-1">Overview</h1>
        <p className="font-dm text-sm text-ghost-muted">Live snapshot of store operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard Icon={Users}         label="Users"      value={stats.totalUsers}                accent="#9B5CF6" />
        <StatCard Icon={Package}       label="Products"   value={stats.totalProducts}             accent="#00F5C4" />
        <StatCard Icon={ClipboardList} label="Orders"     value={stats.totalOrders}               accent="#FF6B35" />
        <StatCard Icon={IndianRupee}   label="Revenue"    value={formatPrice(stats.totalRevenue)} accent="#9B5CF6" />
        <StatCard Icon={Clock}         label="Processing" value={stats.processingOrders}          accent="#FF6B35" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Processing', value: stats.processingOrders, key: 'processing' },
          { label: 'Shipped',    value: stats.shippedOrders,    key: 'shipped'    },
          { label: 'Delivered',  value: stats.deliveredOrders,  key: 'delivered'  },
        ].map(({ label, value, key }) => {
          const st = STATUS_STYLES[key]
          return (
            <div key={key} className={cn('rounded-xl border p-4 text-center', st.bg, st.border)}>
              <p className={cn('font-syne font-bold text-xl mb-1', st.color)}>{value}</p>
              <p className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">{label}</p>
            </div>
          )
        })}
      </div>

      <div>
        <h2 className="font-syne font-semibold text-ghost text-base mb-4">Recent Orders</h2>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          {stats.recentOrders.length === 0 ? (
            <p className="font-dm text-sm text-ghost-muted text-center py-10">No orders yet</p>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {stats.recentOrders.map((order) => {
                const st = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.processing
                return (
                  <div key={order._id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
                    <div>
                      <p className="font-mono text-xs text-ghost mb-1">{order.orderId}</p>
                      <p className="font-dm text-xs text-ghost-muted">
                        {order.user?.name || order.user?.email || 'Unknown customer'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-syne font-semibold text-sm text-ghost">
                        {formatPrice(order.pricing?.total || 0)}
                      </span>
                      <span className={cn('font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border capitalize', st.color, st.bg, st.border)}>
                        {order.orderStatus}
                      </span>
                      <span className="font-mono text-[10px] text-ghost-muted/60 hidden sm:block">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}