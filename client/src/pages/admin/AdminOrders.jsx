import { useState, useEffect } from 'react'
import { Search, X, ClipboardList, ChevronDown } from 'lucide-react'
import api from '@/lib/axios'
import { formatPrice, cn } from '@/lib/utils'
import { useModalLock } from '@/hooks/useModalLock'

const STATUSES = [
  { id: 'all', label: 'All' }, { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' }, { id: 'delivered', label: 'Delivered' },
]

const STATUS_STYLES = {
  processing: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  shipped:    { color: 'text-violet',    bg: 'bg-violet/10',    border: 'border-violet/20'    },
  delivered:  { color: 'text-teal',      bg: 'bg-teal/10',      border: 'border-teal/20'      },
}

function OrderDetailModal({ order, onClose, onStatusUpdated }) {
  useModalLock()
  const [status, setStatus] = useState(order.orderStatus)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  async function handleStatusChange(newStatus) {
    setStatus(newStatus)
    setError('')
    try {
      setSaving(true)
      const res = await api.put(`/admin/orders/${order._id}/status`, { orderStatus: newStatus })
      onStatusUpdated(res.data.order)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
      setStatus(order.orderStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="modal-scroll w-full sm:max-w-lg max-h-[90dvh] min-h-0 overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#0c0c0c]"
      >

        <div className="sticky top-0 bg-[#0c0c0c] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <ClipboardList size={16} className="text-ember" strokeWidth={1.75} />
            <div>
              <h2 className="font-syne font-bold text-ghost text-base">Order Details</h2>
              <p className="font-mono text-[10px] text-ghost-muted">{order.orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-ghost-muted hover:text-ghost transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          <div>
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Order Status</p>
            <div className="relative">
              <select value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={saving} className="field appearance-none pr-10 cursor-pointer">
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" />
            </div>
            {error && <p className="font-dm text-xs text-red-400 mt-2">{error}</p>}
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Customer</p>
            <p className="font-dm text-sm text-ghost">{order.user?.name || '—'}</p>
            <p className="font-dm text-xs text-ghost-muted">{order.user?.email || '—'}</p>
            <p className="font-dm text-xs text-ghost-muted">{order.user?.phone || '—'}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-3">Items</p>
            <div className="space-y-2.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="w-11 h-11 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-9 h-9 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-semibold text-sm text-ghost truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-ghost-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-syne font-bold text-sm text-ghost flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.prescription?.lensType === 'power' && (
            <div className="rounded-lg border border-violet/20 bg-violet/5 p-4">
              <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-2">Prescription</p>
              <div className="grid grid-cols-2 gap-1.5 font-dm text-sm text-ghost-muted">
                <span>Left: {order.prescription.leftPower}</span>
                <span>Right: {order.prescription.rightPower}</span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Delivery</p>
            <div className="space-y-1 font-dm text-sm text-ghost-muted">
              <p>{order.delivery?.address}</p>
              <p>Pincode: {order.delivery?.pincode}</p>
              <p>Phone: {order.delivery?.phone}</p>
              <p className="capitalize">Method: {order.delivery?.method}</p>
              <p>Coating: {order.lensCoating}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Pricing</p>
            {[
              { label: 'Subtotal', value: formatPrice(order.pricing?.subtotal || 0) },
              { label: 'Coating',  value: formatPrice(order.pricing?.coatingPrice || 0) },
              { label: 'Delivery', value: formatPrice(order.pricing?.deliveryPrice || 0) },
              { label: 'GST',      value: formatPrice(order.pricing?.tax || 0) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="font-dm text-ghost-muted">{label}</span>
                <span className="font-mono text-ghost">{value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-white/[0.08]">
              <span className="font-syne font-bold text-ghost">Total</span>
              <span className="font-syne font-bold text-ember">{formatPrice(order.pricing?.total || 0)}</span>
            </div>
          </div>

          <p className="font-dm text-xs text-ghost-muted">
            Payment: <span className="text-ghost">{order.paymentMethod}</span> · {order.paymentStatus}
          </p>
          <p className="font-mono text-[10px] text-ghost/30 text-right">
            {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('all')
  const [active,  setActive]  = useState(null)

  async function fetchOrders() {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (status !== 'all') params.status = status
      const res = await api.get('/admin/orders', { params })
      setOrders(res.data.orders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300)
    return () => clearTimeout(t)
  }, [search, status])

  function handleStatusUpdated(updated) {
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o)))
    setActive((prev) => prev && { ...prev, ...updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-bold text-xl text-ghost mb-1">Orders</h1>
        <p className="font-dm text-sm text-ghost-muted">{orders.length} orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ghost-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, phone, customer..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-9 pr-4 py-2.5 font-dm text-sm text-ghost placeholder:text-ghost-muted/40 focus:outline-none focus:border-violet/40"
          />
        </div>
        <div className="flex gap-2">
          {STATUSES.map(({ id, label }) => (
            <button
              key={id}
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

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <p className="font-dm text-sm text-ghost-muted text-center py-16">No orders found</p>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {orders.map((order) => {
              const st = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.processing
              return (
                <button key={order._id} onClick={() => setActive(order)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.015] transition-colors text-left">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-ghost mb-1">{order.orderId}</p>
                    <p className="font-dm text-xs text-ghost-muted truncate">{order.user?.name || order.user?.email || 'Unknown'}</p>
                  </div>
                  <span className="font-syne font-bold text-sm text-ghost hidden sm:block">{formatPrice(order.pricing?.total || 0)}</span>
                  <span className={cn('font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border capitalize flex-shrink-0', st.color, st.bg, st.border)}>
                    {order.orderStatus}
                  </span>
                  <span className="font-mono text-[10px] text-ghost-muted/50 hidden md:block flex-shrink-0">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {active && <OrderDetailModal order={active} onClose={() => setActive(null)} onStatusUpdated={handleStatusUpdated} />}
    </div>
  )
}
