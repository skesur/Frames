import { Link }         from 'react-router-dom'
import { ShoppingBag }  from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
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

export default function ProductCard({ product, className }) {
  const addItem = useCartStore((s) => s.addItem)

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const badgeStyle = BADGE_STYLES[product.badge] || 'bg-ghost/10 text-ghost-muted border-ghost/20'

  return (
    <Link
      to={`/product/${product._id}`}
      className={cn(
        'group relative flex-shrink-0 w-56 md:w-64 rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-violet/25 hover:bg-white/[0.04] hover:-translate-y-1',
        className
      )}
      style={{ textDecoration: 'none' }}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className={cn(
            'absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border',
            badgeStyle
          )}
        >
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="relative bg-[#0d0d0d] h-44 flex items-center justify-center overflow-hidden">
        <img
          src={product.images?.[0] || '/assets/image/hero_1.png'}
          alt={product.name}
          className="h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(155,92,246,0.15))' }}
        />
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.08) 0%, transparent 70%)' }}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-mono text-[9px] text-ghost-muted uppercase tracking-widest mb-1.5">
          {product.category.replace(/-/g, ' ')}
        </p>
        <h3 className="font-syne font-semibold text-sm text-ghost leading-snug mb-3 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-syne font-bold text-base text-ghost">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAdd}
            className="w-8 h-8 rounded-full bg-violet hover:bg-violet-dark flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_12px_rgba(155,92,246,0.4)]"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={13} strokeWidth={2} className="text-white" />
          </button>
        </div>

        {/* Rating dots */}
        <div className="flex items-center gap-0.5 mt-2.5">
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
    </Link>
  )
}
