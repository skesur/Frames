import { useState }          from 'react'
import { Link }              from 'react-router-dom'
import {
  ShoppingBag, Trash2, Plus, Minus,
  ShoppingCart, X, Truck, CreditCard,
  ClipboardCheck, Send, ChevronDown,
  Glasses, ShieldCheck,
} from 'lucide-react'
import { useCartStore }  from '@/store/cartStore'
import { useAuthStore }  from '@/store/authStore'
import { formatPrice, cn } from '@/lib/utils'
import api               from '@/lib/axios'

const TAX_RATE       = 0.18
const COATING_PRICES = { standard: 0, 'anti-glare': 500, 'blue-light': 800, photochromic: 1500 }
const DELIVERY_PRICES = { standard: 600, express: 1300, overnight: 2500 }

/* ── Order Modal ───────────────────────── */
function OrderModal({ onClose, onSuccess }) {
  const { items, clearCart }    = useCartStore()
  const { isAuthenticated, user } = useAuthStore()

  const [form, setForm] = useState({
    lensType:       'zero-power',
    leftPower:      '',
    rightPower:     '',
    leftCylinder:   '',
    rightCylinder:  '',
    lensCoating:    '',
    address:        '',
    pincode:        '',
    phone:          '',
    deliveryMethod: '',
    paymentMethod:  '',
  })
  const [placing,  setPlacing]  = useState(false)
  const [error,    setError]    = useState('')

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const subtotal      = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const coatingPrice  = COATING_PRICES[form.lensCoating]  ?? 0
  const deliveryPrice = DELIVERY_PRICES[form.deliveryMethod] ?? 0
  const tax           = Math.round(subtotal * TAX_RATE)
  const total         = subtotal + coatingPrice + deliveryPrice + tax

  async function handlePlaceOrder() {
    setError('')
    if (!form.lensCoating)    return setError('Please select a lens coating.')
    if (!form.address.trim()) return setError('Please enter a delivery address.')
    if (!form.pincode.trim()) return setError('Please enter your pincode.')
    if (!form.phone.trim())   return setError('Please enter your phone number.')
    if (!form.deliveryMethod) return setError('Please select a delivery method.')
    if (!form.paymentMethod)  return setError('Please select a payment method.')

    try {
      setPlacing(true)
      const payload = {
        items: items.map((i) => ({
          product:  i._id,
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          image:    i.images?.[0] || '',
        })),
        prescription: {
          lensType:      form.lensType,
          leftPower:     form.leftPower  || 'N/A',
          rightPower:    form.rightPower || 'N/A',
          leftCylinder:  form.leftCylinder  || 'N/A',
          rightCylinder: form.rightCylinder || 'N/A',
        },
        lensCoating:   form.lensCoating,
        delivery: {
          method:  form.deliveryMethod,
          address: form.address,
          pincode: form.pincode,
          phone:   form.phone,
        },
        pricing: { subtotal, coatingPrice, deliveryPrice, tax, total },
        paymentMethod: form.paymentMethod,
        paymentStatus: 'paid', // simulated
      }

      await api.post('/orders', payload)
      clearCart()
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#0c0c0c]">

        {/* Modal header */}
        <div className="sticky top-0 bg-[#0c0c0c] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <ClipboardCheck size={18} className="text-ember" strokeWidth={1.75} />
            <h2 className="font-syne font-bold text-ghost text-lg">Complete Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-ghost-muted hover:text-ghost transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Order items summary */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.05]">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.images?.[0] || '/assets/images/placeholder.png'}
                    alt={item.name}
                    className="w-12 h-12 object-contain"
                  />
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

          {/* Lens type */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Glasses size={16} className="text-ember" strokeWidth={1.75} />
              <h4 className="font-syne font-semibold text-sm text-ghost">Lens Type</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'zero-power', label: 'Powerless', sub: 'Normal lenses' },
                { val: 'power',      label: 'Power',     sub: 'Prescription'  },
              ].map(({ val, label, sub }) => (
                <button
                  key={val}
                  onClick={() => set('lensType', val)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all duration-200',
                    form.lensType === val
                      ? 'border-violet bg-violet/10'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                  )}
                >
                  <p className={cn('font-syne font-semibold text-sm', form.lensType === val ? 'text-violet' : 'text-ghost')}>
                    {label}
                  </p>
                  <p className="font-dm text-xs text-ghost-muted mt-0.5">{sub}</p>
                </button>
              ))}
            </div>

            {/* Prescription fields */}
            {form.lensType === 'power' && (
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
                <p className="font-mono text-[10px] text-violet uppercase tracking-widest">
                  Prescription Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'leftPower',  label: 'Left Eye Power (SPH)',  ph: 'e.g. -2.50' },
                    { key: 'rightPower', label: 'Right Eye Power (SPH)', ph: 'e.g. -2.00' },
                  ].map(({ key, label, ph }) => (
                    <div key={key}>
                      <label className="block font-dm text-xs text-ghost-muted mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={form[key]}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder={ph}
                        className="field text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'leftCylinder',  label: 'Left Cylinder (Optional)',  ph: 'e.g. -0.50' },
                    { key: 'rightCylinder', label: 'Right Cylinder (Optional)', ph: 'e.g. -0.75' },
                  ].map(({ key, label, ph }) => (
                    <div key={key}>
                      <label className="block font-dm text-xs text-ghost-muted mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={form[key]}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder={ph}
                        className="field text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lens coating */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-ember" strokeWidth={1.75} />
              <h4 className="font-syne font-semibold text-sm text-ghost">Lens Coating</h4>
            </div>
            <div className="relative">
              <select
                value={form.lensCoating}
                onChange={(e) => set('lensCoating', e.target.value)}
                className="field appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>Choose coating type</option>
                <option value="standard">Standard — Free</option>
                <option value="anti-glare">Anti-Glare — +{formatPrice(500)}</option>
                <option value="blue-light">Blue Light Filter — +{formatPrice(800)}</option>
                <option value="photochromic">Photochromic — +{formatPrice(1500)}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" />
            </div>
          </div>

          {/* Delivery info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-ember" strokeWidth={1.75} />
              <h4 className="font-syne font-semibold text-sm text-ghost">Delivery Information</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block font-dm text-xs text-ghost-muted mb-1.5">
                  Delivery Address <span className="text-ember">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  rows={2}
                  placeholder="Enter full delivery address"
                  className="field resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-dm text-xs text-ghost-muted mb-1.5">
                    Pincode <span className="text-ember">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => set('pincode', e.target.value)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="field"
                  />
                </div>
                <div>
                  <label className="block font-dm text-xs text-ghost-muted mb-1.5">
                    Phone <span className="text-ember">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="10-digit number"
                    maxLength={10}
                    className="field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery method */}
          <div>
            <div className="relative">
              <label className="block font-dm text-xs text-ghost-muted mb-1.5">
                Delivery Method <span className="text-ember">*</span>
              </label>
              <select
                value={form.deliveryMethod}
                onChange={(e) => set('deliveryMethod', e.target.value)}
                className="field appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>Choose delivery method</option>
                <option value="standard">Standard (5-7 days) — {formatPrice(600)}</option>
                <option value="express">Express (2-3 days) — {formatPrice(1300)}</option>
                <option value="overnight">Overnight (1 day) — {formatPrice(2500)}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 bottom-3.5 text-ghost-muted pointer-events-none" />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-ember" strokeWidth={1.75} />
              <h4 className="font-syne font-semibold text-sm text-ghost">Payment Method</h4>
            </div>
            <div className="relative">
              <select
                value={form.paymentMethod}
                onChange={(e) => set('paymentMethod', e.target.value)}
                className="field appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>Choose payment method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI Payment</option>
                <option value="netbanking">Net Banking</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" />
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            {[
              { label: 'Subtotal',        value: formatPrice(subtotal)      },
              { label: 'Lens Coating',    value: coatingPrice > 0 ? `+${formatPrice(coatingPrice)}` : 'Free' },
              { label: 'Delivery',        value: deliveryPrice > 0 ? formatPrice(deliveryPrice) : '—'       },
              { label: 'GST (18%)',       value: formatPrice(tax)           },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="font-dm text-sm text-ghost-muted">{label}</span>
                <span className="font-mono text-sm text-ghost">{value}</span>
              </div>
            ))}
            <div
              className="flex items-center justify-between pt-3 border-t border-white/[0.08]"
            >
              <span className="font-syne font-bold text-ghost">Total</span>
              <span className="font-syne font-bold text-lg text-ember">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Auth warning */}
          {!isAuthenticated && (
            <p className="font-dm text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-3">
              You need to{' '}
              <Link to="/login" className="underline text-amber-300">log in</Link>
              {' '}to place an order.
            </p>
          )}

          {/* Place order button */}
          <button
            onClick={handlePlaceOrder}
            disabled={placing || !isAuthenticated}
            className="w-full flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark disabled:opacity-50 disabled:cursor-not-allowed text-void font-dm font-semibold text-sm py-4 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]"
          >
            {placing ? (
              <span className="animate-pulse">Placing Order...</span>
            ) : (
              <>
                <Send size={15} strokeWidth={2.5} />
                Place Order
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}

/* ── Cart Item Card ─────────────────────── */
function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCartStore()

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 md:p-5 flex gap-4 transition-all duration-200 hover:border-white/[0.12]">

      {/* Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-[#0d0d0d] flex items-center justify-center flex-shrink-0">
        <img
          src={item.images?.[0] || '/assets/images/placeholder.png'}
          alt={item.name}
          className="w-16 h-16 object-contain"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(155,92,246,0.2))' }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[9px] text-ghost-muted uppercase tracking-widest mb-1">
          {item.category?.replace(/-/g, ' ')}
        </p>
        <h3 className="font-syne font-semibold text-sm md:text-base text-ghost leading-snug mb-3 line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="w-7 h-7 rounded-full border border-white/[0.1] flex items-center justify-center text-ghost-muted hover:text-ghost hover:border-white/30 transition-all"
            >
              <Minus size={12} />
            </button>
            <span className="font-mono text-sm text-ghost w-5 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="w-7 h-7 rounded-full border border-white/[0.1] flex items-center justify-center text-ghost-muted hover:text-ghost hover:border-white/30 transition-all"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-syne font-bold text-base text-ghost">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item._id)}
              className="text-ghost-muted hover:text-red-400 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Cart Page ─────────────────────── */
export default function Cart() {
  const { items, clearCart, getTotalItems, getTotalPrice } = useCartStore()
  const [showModal,   setShowModal]   = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax        = Math.round(subtotal * TAX_RATE)
  const total      = subtotal + tax

  function handleOrderSuccess() {
    setShowModal(false)
    setOrderPlaced(true)
  }

  // ── Order success screen ──
  if (orderPlaced) {
    return (
      <div className="bg-void min-h-screen flex items-center justify-center">
        <div className="frame-container text-center py-24">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(0,245,196,0.1)', border: '1px solid rgba(0,245,196,0.2)' }}
          >
            <Send size={32} className="text-teal" strokeWidth={1.5} />
          </div>
          <h2 className="font-syne font-bold text-3xl text-ghost mb-3">Order Placed!</h2>
          <p className="font-dm text-ghost-muted mb-8 max-w-sm mx-auto">
            Your order has been received. You can track it in your profile.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-7 py-3 rounded-full transition-all"
            >
              View Order
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-white/20 text-ghost-muted hover:text-ghost font-dm text-sm px-7 py-3 rounded-full transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div className="bg-void min-h-screen flex items-center justify-center">
        <div className="frame-container text-center py-24">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <ShoppingCart size={32} className="text-ghost-muted" strokeWidth={1.5} />
          </div>
          <h2 className="font-syne font-bold text-2xl text-ghost mb-2">Your cart is empty</h2>
          <p className="font-dm text-ghost-muted text-sm mb-8">
            Browse our collection and add some frames to your cart.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-7 py-3 rounded-full transition-all"
          >
            <ShoppingBag size={15} strokeWidth={2.5} />
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  // ── Cart with items ──
  return (
    <div className="bg-void min-h-screen">

      {/* Header */}
      <section className="pt-32 pb-8">
        <div className="frame-container flex items-center justify-between">
          <div>
            <h1 className="font-syne font-extrabold text-2xl md:text-3xl text-ghost mb-1">
              Your Cart
            </h1>
            <p className="font-mono text-[11px] text-ghost-muted uppercase tracking-widest">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="font-dm text-xs text-ghost-muted hover:text-red-400 flex items-center gap-1.5 transition-colors border border-white/[0.08] hover:border-red-400/30 px-3 py-2 rounded-full"
          >
            <Trash2 size={12} />
            Clear All
          </button>
        </div>
      </section>

      {/* Main layout */}
      <section className="pb-24">
        <div className="frame-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

            {/* Cart items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-28 self-start">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
                <h3 className="font-syne font-bold text-ghost text-lg mb-6">Cart Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-dm text-sm text-ghost-muted">Subtotal</span>
                    <span className="font-mono text-sm text-ghost">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-dm text-sm text-ghost-muted">GST (18%)</span>
                    <span className="font-mono text-sm text-ghost">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-ghost-muted">
                    <span className="font-dm text-xs">Delivery charges applied at checkout</span>
                  </div>
                </div>

                <div
                  className="flex justify-between items-center py-4 mb-6 border-t border-b border-white/[0.06]"
                >
                  <span className="font-syne font-bold text-ghost">Estimated Total</span>
                  <span className="font-syne font-bold text-xl text-ember">{formatPrice(total)}</span>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold py-4 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]"
                >
                  <ClipboardCheck size={16} strokeWidth={2.5} />
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="block text-center font-dm text-sm text-ghost-muted hover:text-ghost mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {showModal && (
        <OrderModal
          onClose={() => setShowModal(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

    </div>
  )
}