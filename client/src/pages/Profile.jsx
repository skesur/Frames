import { useState, useEffect }  from 'react'
import { useNavigate, Link }    from 'react-router-dom'
import { useModalLock } from '@/hooks/useModalLock'
import {
  User, Mail, Phone, MapPin, Globe, Calendar,
  Pencil, Trash2, ShoppingBag, Package, X,
  ChevronDown, Eye, EyeOff, ClipboardList,
  CheckCircle, Clock, Truck,
} from 'lucide-react'
import api              from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import { formatPrice, cn } from '@/lib/utils'

/* ── helpers ── */
function Label({ children }) {
  return (
    <label className="block font-mono text-[10px] uppercase tracking-widest text-ghost/40 mb-2">
      {children}
    </label>
  )
}

function FieldInput({ label, value, onChange, type = 'text', placeholder, readOnly, maxLength, required, textarea, rows }) {
  if (textarea) {
    return (
      <div>
        <Label>{label}</Label>
        <textarea
          value={value}
          onChange={onChange}
          rows={rows || 2}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          className="field resize-none"
        />
      </div>
    )
  }
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        maxLength={maxLength}
        required={required}
        className={cn('field', readOnly && 'opacity-50 cursor-not-allowed')}
      />
    </div>
  )
}

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="field pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ghost-muted hover:text-ghost"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

const ORDER_STATUS_STYLES = {
  processing: { color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20', Icon: Clock         },
  shipped:    { color: 'text-violet',     bg: 'bg-violet/10',     border: 'border-violet/20',    Icon: Truck         },
  delivered:  { color: 'text-teal',       bg: 'bg-teal/10',       border: 'border-teal/20',      Icon: CheckCircle   },
}

/* ── Edit Profile Modal ── */
function EditModal({ user, onClose, onSaved }) {
  useModalLock()
  const [form, setForm] = useState({
    name:            user.name    || '',
    phone:           user.phone   || '',
    address:         user.address || '',
    pincode:         user.pincode || '',
    country:         user.country || '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSave() {
    setError('')

    if (form.currentPassword && form.newPassword !== form.confirmPassword) {
      return setError('New passwords do not match.')
    }

    try {
      setSaving(true)
      const payload = {
        name:    form.name,
        phone:   form.phone,
        address: form.address,
        pincode: form.pincode,
        country: form.country,
      }
      if (form.currentPassword) {
        payload.currentPassword = form.currentPassword
        payload.newPassword     = form.newPassword
        payload.confirmPassword = form.confirmPassword
      }

      const res = await api.put('/auth/me', payload)
      onSaved(res.data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.')
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
        className="modal-scroll w-full sm:max-w-xl max-h-[92dvh] min-h-0 overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#0c0c0c]"
      >

        {/* Header */}
        <div className="sticky top-0 bg-[#0c0c0c] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Pencil size={16} className="text-ember" strokeWidth={1.75} />
            <h2 className="font-syne font-bold text-ghost text-lg">Edit Profile</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-ghost-muted hover:text-ghost transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Basic info */}
          <div>
            <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-4">
              Basic Information
            </p>
            <div className="space-y-4">
              <FieldInput label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" required />
              <FieldInput label="Email" value={user.email} type="email" readOnly placeholder="Email cannot be changed" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-4">
              Contact Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="10-digit number" maxLength={10} />
              <FieldInput label="Country" value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Your country" />
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-4">
              Address Information
            </p>
            <div className="space-y-4">
              <FieldInput label="Address" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Full address" textarea />
              <FieldInput label="Pincode" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} placeholder="6-digit pincode" maxLength={6} />
            </div>
          </div>

          {/* Password change */}
          <div>
            <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-1">
              Change Password
            </p>
            <p className="font-dm text-xs text-ghost-muted mb-4">Leave blank to keep current password</p>
            <div className="space-y-4">
              <PasswordField label="Current Password" value={form.currentPassword} onChange={(e) => set('currentPassword', e.target.value)} placeholder="Enter current password" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField label="New Password" value={form.newPassword} onChange={(e) => set('newPassword', e.target.value)} placeholder="Min 8 characters" />
                <PasswordField label="Confirm New Password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} placeholder="Repeat new password" />
              </div>
            </div>
          </div>

          {error && (
            <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-ember hover:bg-ember-dark disabled:opacity-50 text-void font-dm font-semibold py-3.5 rounded-xl transition-all duration-200"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="px-6 border border-white/[0.1] text-ghost-muted hover:text-ghost rounded-xl font-dm text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Order Details Modal ── */
function OrderDetailsModal({ order, onClose }) {
  useModalLock()
  if (!order) return null

  const st = ORDER_STATUS_STYLES[order.orderStatus] || ORDER_STATUS_STYLES.processing

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

        {/* Header */}
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

          {/* Status */}
          <div className={cn('flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-dm', st.color, st.bg, st.border)}>
            <st.Icon size={15} strokeWidth={1.75} />
            <span className="capitalize">{order.orderStatus}</span>
          </div>

          {/* Items */}
          <div>
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-3">Items Ordered</p>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="w-12 h-12 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
                    <img src={item.image || '/assets/images/placeholder.png'} alt={item.name} className="w-10 h-10 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-semibold text-sm text-ghost truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-ghost-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-syne font-bold text-sm text-ghost flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription */}
          {order.prescription?.lensType === 'power' && (
            <div className="rounded-lg border border-violet/20 bg-violet/5 p-4">
              <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-3">Prescription</p>
              <div className="grid grid-cols-2 gap-2 font-dm text-sm text-ghost-muted">
                <span>Left Eye: {order.prescription.leftPower}</span>
                <span>Right Eye: {order.prescription.rightPower}</span>
                {order.prescription.leftCylinder !== 'N/A' && (
                  <span>Left Cyl: {order.prescription.leftCylinder}</span>
                )}
                {order.prescription.rightCylinder !== 'N/A' && (
                  <span>Right Cyl: {order.prescription.rightCylinder}</span>
                )}
              </div>
            </div>
          )}

          {/* Delivery */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-3">Delivery</p>
            <div className="space-y-1.5 font-dm text-sm text-ghost-muted">
              <p>{order.delivery?.address}</p>
              <p>Pincode: {order.delivery?.pincode}</p>
              <p>Phone: {order.delivery?.phone}</p>
              <p className="capitalize">Method: {order.delivery?.method}</p>
              <p>Coating: {order.lensCoating}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-2.5">
            <p className="font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-3">Pricing</p>
            {[
              { label: 'Subtotal',     value: formatPrice(order.pricing?.subtotal  || 0) },
              { label: 'Lens Coating', value: order.pricing?.coatingPrice > 0 ? `+${formatPrice(order.pricing.coatingPrice)}` : 'Free' },
              { label: 'Delivery',     value: formatPrice(order.pricing?.deliveryPrice || 0) },
              { label: 'GST (18%)',    value: formatPrice(order.pricing?.tax       || 0) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="font-dm text-ghost-muted">{label}</span>
                <span className="font-mono text-ghost">{value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2.5 border-t border-white/[0.08]">
              <span className="font-syne font-bold text-ghost">Total</span>
              <span className="font-syne font-bold text-ember">{formatPrice(order.pricing?.total || 0)}</span>
            </div>
          </div>

          {/* Date */}
          <p className="font-mono text-[10px] text-ghost/30 text-right">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function Profile() {
  const navigate      = useNavigate()
  const { user, isAuthenticated, updateUser, logout } = useAuthStore()

  const [orders,      setOrders]      = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [showEdit,    setShowEdit]    = useState(false)
  const [activeOrder, setActiveOrder] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  // Fetch order history
  useEffect(() => {
    if (!isAuthenticated) return
    async function fetchOrders() {
      try {
        setOrdersLoading(true)
        const res = await api.get('/orders/mine')
        setOrders(res.data.orders)
      } catch (err) {
        console.error('Failed to fetch orders:', err.message)
      } finally {
        setOrdersLoading(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  async function handleDelete() {
    try {
      await api.delete('/auth/me')
      logout()
      navigate('/')
    } catch (err) {
      console.error('Delete account failed:', err.message)
    }
  }

  function handleSaved(updatedUser) {
    updateUser(updatedUser)
    setShowEdit(false)
  }

  if (!user) return null

  // User initials for avatar
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="bg-void min-h-screen">

      {/* ── Profile Header ── */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(155,92,246,0.1) 0%, transparent 55%)' }}
        />
        <div className="frame-container relative text-center">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-violet/30"
            style={{ background: 'linear-gradient(135deg, rgba(155,92,246,0.3), rgba(255,107,53,0.2))' }}
          >
            <span className="font-syne font-bold text-2xl text-ghost">{initials}</span>
          </div>

          <h1 className="font-syne font-extrabold text-2xl md:text-3xl text-ghost mb-1">
            {user.name}
          </h1>
          <p className="font-mono text-xs text-ghost-muted">{user.email}</p>
        </div>
      </section>


      {/* ── Personal Information ── */}
      <section className="pb-12">
        <div className="frame-container">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">

            {/* Section title */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <User size={17} className="text-ember" strokeWidth={1.75} />
                <h2 className="font-syne font-bold text-ghost text-lg">Personal Information</h2>
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
              {[
                { Icon: User,     label: 'Full Name',    value: user.name      || '—' },
                { Icon: Mail,     label: 'Email',        value: user.email     || '—' },
                { Icon: Phone,    label: 'Phone',        value: user.phone     || '—' },
                { Icon: Globe,    label: 'Country',      value: user.country   || '—' },
                { Icon: MapPin,   label: 'Pincode',      value: user.pincode   || '—' },
                { Icon: Calendar, label: 'Member Since', value: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
                    : '—'
                },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={13} className="text-ghost-muted" strokeWidth={1.75} />
                    <span className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">{label}</span>
                  </div>
                  <p className="font-dm text-sm text-ghost">{value}</p>
                </div>
              ))}
            </div>

            {/* Address — full width */}
            {user.address && (
              <div className="border-t border-white/[0.06] px-6 py-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={13} className="text-ghost-muted" strokeWidth={1.75} />
                  <span className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">Address</span>
                </div>
                <p className="font-dm text-sm text-ghost">{user.address}</p>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-white/[0.06] px-6 py-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowEdit(true)}
                className="inline-flex items-center gap-2 bg-violet hover:bg-violet-dark text-void font-dm font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200"
              >
                <Pencil size={13} strokeWidth={2.5} />
                Edit Profile
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="inline-flex items-center gap-2 border border-red-400/30 text-red-400 hover:bg-red-400/10 font-dm text-sm px-5 py-2.5 rounded-full transition-all duration-200"
              >
                <Trash2 size={13} strokeWidth={2} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ── Order History ── */}
      <section className="pb-24">
        <div className="frame-container">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList size={18} className="text-ember" strokeWidth={1.75} />
            <h2 className="font-syne font-bold text-ghost text-2xl">Order History</h2>
          </div>

          {/* Loading */}
          {ordersLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!ordersLoading && orders.length === 0 && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
                <ShoppingBag size={24} className="text-ghost-muted" strokeWidth={1.5} />
              </div>
              <h3 className="font-syne font-semibold text-ghost text-lg mb-2">No orders yet</h3>
              <p className="font-dm text-sm text-ghost-muted mb-6">
                Start shopping and your orders will appear here.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-6 py-3 rounded-full transition-all"
              >
                <Package size={14} />
                Browse Collection
              </Link>
            </div>
          )}

          {/* Orders grid */}
          {!ordersLoading && orders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => {
                const st = ORDER_STATUS_STYLES[order.orderStatus] || ORDER_STATUS_STYLES.processing
                const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0

                return (
                  <button
                    key={order._id}
                    onClick={() => setActiveOrder(order)}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5 text-left transition-all duration-200 hover:border-violet/25 hover:bg-white/[0.04] hover:-translate-y-0.5"
                  >
                    {/* Order ID + date */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div>
                        <p className="font-mono text-[9px] sm:text-[10px] text-ghost-muted uppercase tracking-widest mb-0.5 sm:mb-1">
                          {order.orderId}
                        </p>
                        <p className="font-dm text-[11px] sm:text-xs text-ghost-muted">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={cn(
                        'font-mono text-[8px] sm:text-[9px] uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shrink-0',
                        st.color, st.bg, st.border
                      )}>
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="flex items-center gap-2 mb-3.5">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center">
                          <img
                            src={item.image || '/assets/images/placeholder.png'}
                            alt={item.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      ))}
                      {itemCount > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                          <span className="font-mono text-[10px] text-ghost-muted">+{itemCount - 3}</span>
                        </div>
                      )}
                    </div>

                    {/* Total + item count */}
                    <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 mt-1">
                      <span className="font-syne font-bold text-sm sm:text-base text-ember">
                        {formatPrice(order.pricing?.total || 0)}
                      </span>
                      <span className="font-mono text-[10px] text-ghost-muted">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>


      {/* ── Edit Modal ── */}
      {showEdit && (
        <EditModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}

      {/* ── Order Details Modal ── */}
      {activeOrder && (
        <OrderDetailsModal
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={22} className="text-red-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-syne font-bold text-ghost text-xl mb-2">Delete Account?</h3>
            <p className="font-dm text-sm text-ghost-muted mb-7 leading-relaxed">
              This will permanently delete your account and all order history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 border border-white/[0.1] text-ghost-muted hover:text-ghost font-dm text-sm py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-dm font-semibold text-sm py-3 rounded-xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
