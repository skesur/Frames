import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore }     from '@/store/cartStore'
import { useAuthStore }     from '@/store/authStore'
import { formatPrice, cn }  from '@/lib/utils'

export default function Wishlist() {
  const navigate = useNavigate()
  const { items: storeItems, removeItem, clearWishlist } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)
  const { isAuthenticated, token, user } = useAuthStore()
  const items = (isAuthenticated && token) ? storeItems : []

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const [notice, setNotice] = useState(null)

  function triggerNotice(text, type = 'info') {
    setNotice({ text, type })
    setTimeout(() => setNotice(null), 3000)
  }

  function handleOrderSingle(product) {
    if (!isAuthenticated || !token) {
      triggerNotice('Please login first to order frames.', 'warning')
      return
    }

    if (product.inStock === false || product.stock === 0) {
      triggerNotice(`"${product.name}" is currently out of stock.`, 'warning')
      return
    }

    const res = addItem(product)
    if (res && res.success === false) {
      triggerNotice(res.message, 'warning')
      return
    }

    navigate('/cart')
  }

  function handleMoveToCart(product) {
    if (!isAuthenticated || !token) {
      triggerNotice('Please login first to add frames to your cart.', 'warning')
      return
    }

    if (product.inStock === false || product.stock === 0) {
      triggerNotice(`"${product.name}" is currently out of stock.`, 'warning')
      return
    }

    const res = addItem(product)
    if (res && res.success === false) {
      triggerNotice(res.message, 'warning')
    } else {
      removeItem(product._id)
      triggerNotice(`Moved "${product.name}" to cart.`, 'success')
    }
  }

  function handleOrderFullWishlist() {
    if (!isAuthenticated || !token) {
      triggerNotice('Please login first to order frames.', 'warning')
      return
    }

    const availableItems = items.filter((i) => i.inStock !== false && (i.stock === undefined || i.stock > 0))
    if (availableItems.length === 0) {
      triggerNotice('None of the saved frames are currently in stock.', 'warning')
      return
    }

    let addedCount = 0
    availableItems.forEach((product) => {
      const res = addItem(product)
      if (!res || res.success !== false) {
        addedCount++
      }
    })

    if (addedCount > 0) {
      clearWishlist()
      navigate('/cart')
    } else {
      triggerNotice('Unable to add items to cart due to stock limits.', 'warning')
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-void min-h-screen flex items-center justify-center pt-20">
        <div className="frame-container text-center py-24">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.15)' }}
          >
            <Heart size={32} className="text-ember/70" strokeWidth={1.5} />
          </div>
          <h2 className="font-syne font-bold text-2xl md:text-3xl text-ghost mb-3">Your Wishlist is empty</h2>
          <p className="font-dm text-ghost-muted text-sm mb-8 max-w-sm mx-auto">
            Save your favorite cyberpunk frames here to order them anytime or buy your complete collection in one click.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]"
          >
            Explore Frames
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-void min-h-screen pt-24 md:pt-32 pb-24">
      <div className="frame-container">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart size={20} className="text-ember fill-ember" />
              <h1 className="font-syne font-extrabold text-2xl md:text-4xl text-ghost">
                Saved Frames
              </h1>
            </div>
            <p className="font-mono text-xs text-ghost-muted uppercase tracking-widest">
              {items.length} {items.length === 1 ? 'frame saved' : 'frames saved'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleOrderFullWishlist}
              className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.35)]"
            >
              <Sparkles size={16} />
              Order Full Wishlist
            </button>

            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 border border-white/[0.1] hover:border-red-400/40 text-ghost-muted hover:text-red-400 font-dm text-xs px-4 py-3 rounded-full transition-colors"
            >
              <Trash2 size={13} />
              Clear All
            </button>
          </div>
        </div>

        {/* Global Toast Notice */}
        {notice && (
          <div
            className={cn(
              'mb-6 rounded-xl border p-4 font-dm text-sm flex items-center gap-3 shadow-lg transition-all',
              notice.type === 'warning' && 'bg-amber-400/10 border-amber-400/25 text-amber-300',
              notice.type === 'success' && 'bg-teal/10 border-teal/25 text-teal',
              notice.type === 'info' && 'bg-violet/10 border-violet/25 text-violet'
            )}
          >
            <AlertCircle size={16} />
            <p>{notice.text}</p>
          </div>
        )}

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            const isOutOfStock = product.inStock === false || product.stock === 0
            const stockLabel = isOutOfStock
              ? 'Out of Stock'
              : product.stock === 1
              ? 'Only 1 left'
              : product.stock > 1 && product.stock <= 5
              ? `Only ${product.stock} left`
              : 'In Stock'

            return (
              <div
                key={product._id}
                className="group relative rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-violet/30 hover:bg-white/[0.04] p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden"
              >
                {/* Top Image + Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ghost-muted">
                      {product.category?.replace(/-/g, ' ')}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border',
                        isOutOfStock
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : product.stock <= 5
                          ? 'bg-ember/20 text-ember border-ember/30 font-semibold'
                          : 'bg-teal/10 text-teal border-teal/20'
                      )}
                    >
                      {stockLabel}
                    </span>
                  </div>

                  <Link to={`/product/${product.slug || product._id}`}>
                    <div className="relative h-44 bg-[#0c0c0c] rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden group-hover:bg-[#111] transition-colors">
                      <img
                        src={product.images?.[0] || '/assets/image/hero_1.png'}
                        alt={product.name}
                        className={cn(
                          'max-h-36 max-w-full object-contain transition-transform duration-500 group-hover:scale-110',
                          isOutOfStock && 'opacity-40 grayscale'
                        )}
                        style={{ filter: isOutOfStock ? 'none' : 'drop-shadow(0 10px 24px rgba(155,92,246,0.18))' }}
                      />
                    </div>
                  </Link>

                  <Link to={`/product/${product.slug || product._id}`}>
                    <h3 className="font-syne font-semibold text-base text-ghost leading-snug mb-2 group-hover:text-violet transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="font-syne font-bold text-lg text-ghost mb-4">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => handleOrderSingle(product)}
                    disabled={isOutOfStock}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 font-dm font-semibold text-sm py-3 rounded-xl transition-all duration-200',
                      isOutOfStock
                        ? 'bg-white/[0.04] text-ghost-muted cursor-not-allowed border border-white/[0.08]'
                        : 'bg-ember hover:bg-ember-dark text-void hover:shadow-[0_0_18px_rgba(255,107,53,0.3)]'
                    )}
                  >
                    <ShoppingBag size={15} />
                    {isOutOfStock ? 'Out of Stock' : 'Order Now'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(product)}
                      disabled={isOutOfStock}
                      className="flex-1 bg-white/[0.04] hover:bg-violet hover:text-void border border-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed text-ghost-muted font-dm text-xs py-2.5 rounded-lg transition-all"
                    >
                      Move to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(product._id)}
                      className="w-10 flex items-center justify-center bg-white/[0.04] hover:bg-red-500/20 hover:border-red-400/40 border border-white/[0.08] text-ghost-muted hover:text-red-400 rounded-lg transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
