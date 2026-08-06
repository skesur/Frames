import { useEffect, useState } from 'react'
import { Link }               from 'react-router-dom'
import { Lock, ShoppingBag }  from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice }  from '@/lib/utils'
import { cn }           from '@/lib/utils'

const BADGE_STYLES = {
  'Best Seller': 'bg-violet/15 text-violet border-violet/25',
  'Top Pick':    'bg-violet/15 text-violet border-violet/25',
  'New':         'bg-teal/15 text-teal border-teal/25',
  'Popular':     'bg-ember/15 text-ember border-ember/25',
  'Premium':     'bg-ember/15 text-ember border-ember/25',
  'Blue Light':  'bg-teal/15 text-teal border-teal/25',
  'Bold':        'bg-ember/15 text-ember border-ember/25',
  'UV400':       'bg-teal/15 text-teal border-teal/25',
  'Polarized':   'bg-violet/15 text-violet border-violet/25',
  'Sport':       'bg-ember/15 text-ember border-ember/25',
}

function getStockIndicator(product) {
  const stock = product.stock
  const isOutOfStock = product.inStock === false || stock === 0

  if (isOutOfStock) {
    return {
      text: 'Out of Stock',
      style: 'bg-red-500/20 text-red-300 border-red-500/30',
      isOut: true,
    }
  }

  if (stock === 1) {
    return {
      text: 'Only 1 left',
      style: 'bg-ember/20 text-ember border-ember/40 font-bold animate-pulse',
      isOut: false,
    }
  }

  if (stock > 1 && stock <= 5) {
    return {
      text: stock === 5 ? 'Only Five Frames left' : `Only ${stock} left`,
      style: 'bg-ember/15 text-ember border-ember/30',
      isOut: false,
    }
  }

  return null
}

export default function ProductCard({ product, className }) {
  const addItem = useCartStore((s) => s.addItem)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (!feedback) return undefined

    const timer = setTimeout(() => setFeedback(null), 2800)
    return () => clearTimeout(timer)
  }, [feedback])

  const stockInfo = getStockIndicator(product)

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || !token) {
      setFeedback({ type: 'auth', text: 'Login required to add frames to your cart.' })
      return
    }

    if (stockInfo?.isOut) {
      setFeedback({ type: 'error', text: 'This frame is currently out of stock.' })
      return
    }

    const res = addItem(product)
    if (res && res.success === false) {
      setFeedback({ type: 'error', text: res.message })
    } else {
      setFeedback({ type: 'success', text: 'Added to cart' })
    }
  }

  const badgeStyle = BADGE_STYLES[product.badge] || 'bg-ghost/10 text-ghost-muted border-ghost/20'
  const productPath = `/product/${product.slug || product._id}`

  return (
    <div
      className={cn(
        'group relative flex-shrink-0 w-[185px] md:w-64 rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-violet/25 hover:bg-white/[0.04] hover:-translate-y-1',
        className
      )}
    >
      {product.badge && (
        <span
          className={cn(
            'absolute top-2.5 left-2.5 z-10 font-mono text-[8px] md:text-[9px] uppercase tracking-widest px-1.5 md:px-2 py-0.5 rounded-full border',
            badgeStyle
          )}
        >
          {product.badge}
        </span>
      )}

      {stockInfo && (
        <span
          className={cn(
            'absolute top-2.5 right-2.5 z-10 font-mono text-[8px] md:text-[9px] uppercase tracking-widest px-1.5 md:px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-sm',
            stockInfo.style
          )}
        >
          {stockInfo.text}
        </span>
      )}

      <Link to={productPath} aria-label={`View ${product.name}`}>
        <div className="relative bg-[#0d0d0d] h-32 md:h-44 flex items-center justify-center overflow-hidden">
          <img
            src={product.images?.[0] || '/assets/image/hero_1.png'}
            alt={product.name}
            loading="lazy"
            className={cn(
              'h-24 md:h-36 w-auto rounded-xl object-contain transition-transform duration-500 group-hover:scale-110',
              stockInfo?.isOut && 'opacity-40 grayscale'
            )}
            style={{ filter: stockInfo?.isOut ? 'none' : 'drop-shadow(0 8px 20px rgba(155,92,246,0.15))' }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.08) 0%, transparent 70%)' }}
          />
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <Link to={productPath} aria-label={`View ${product.name}`}>
          <p className="font-mono text-[9px] text-ghost-muted uppercase tracking-widest mb-1.5">
            {product.category.replace(/-/g, ' ')}
          </p>
          <h3 className="font-syne font-semibold text-sm text-ghost leading-snug mb-3 line-clamp-2 group-hover:text-violet transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="font-syne font-bold text-base text-ghost">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAdd}
            disabled={Boolean(stockInfo?.isOut)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110',
              stockInfo?.isOut
                ? 'bg-white/[0.04] border border-white/[0.08] cursor-not-allowed text-ghost-muted/40'
                : isAuthenticated && token
                  ? 'bg-violet hover:bg-violet-dark hover:shadow-[0_0_12px_rgba(155,92,246,0.4)] text-white'
                  : 'bg-white/[0.06] border border-white/[0.1] hover:border-ember/60 hover:shadow-[0_0_12px_rgba(255,107,53,0.25)] text-ember'
            )}
            aria-label={
              stockInfo?.isOut
                ? 'Out of stock'
                : isAuthenticated && token
                  ? `Add ${product.name} to cart`
                  : 'Login required to add to cart'
            }
          >
            {stockInfo?.isOut ? (
              <Lock size={12} className="text-ghost-muted/50" />
            ) : isAuthenticated && token ? (
              <ShoppingBag size={13} strokeWidth={2} />
            ) : (
              <Lock size={13} strokeWidth={2} />
            )}
          </button>
        </div>

        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              'mt-3 rounded-lg border px-3 py-2 shadow-md font-dm text-xs leading-snug',
              feedback.type === 'auth' && 'border-ember/25 bg-ember/10 text-ghost',
              feedback.type === 'error' && 'border-red-400/30 bg-red-400/10 text-red-300',
              feedback.type === 'success' && 'border-teal/30 bg-teal/10 text-teal'
            )}
          >
            <p>{feedback.text}</p>
          </div>
        )}

        <div className="flex items-center gap-0.5 mt-2 md:mt-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i < (product.rating || 5)
                  ? 'var(--ember)'
                  : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
          <span className="font-mono text-[9px] text-ghost-muted ml-1.5">
            {product.rating || 5}.0
          </span>
        </div>
      </div>
    </div>
  )
}
