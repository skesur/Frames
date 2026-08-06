import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag, Star, Heart } from 'lucide-react'
import api from '@/lib/axios'
import { fallbackProducts } from '@/data/products'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { cn, formatPrice } from '@/lib/utils'

function isObjectId(value = '') {
  return /^[a-f\d]{24}$/i.test(value)
}

function DetailPill({ children }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ghost-muted">
      {children}
    </span>
  )
}

export default function Product() {
  const { identifier } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [notice, setNotice] = useState('')

  const isWishlisted = product ? isInWishlist(product._id) : false

  function handleToggleWishlist() {
    if (!product) return
    const res = toggleWishlist(product)
    setNotice(res.message)
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError('')
        const endpoint = isObjectId(identifier)
          ? `/products/${identifier}`
          : `/products/slug/${identifier}`
        const res = await api.get(endpoint)
        setProduct(res.data.product)
      } catch (err) {
        const fallback = fallbackProducts.find((p) => p.slug === identifier || p._id === identifier)
        if (fallback) {
          setProduct(fallback)
        } else {
          setError(err.response?.data?.message || 'Product not found')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [identifier])

  const images = useMemo(() => {
    if (!product?.images?.length) return ['/assets/image/hero_1.png']
    return product.images
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-void pt-24 md:pt-28 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-violet/20 border-t-violet animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-ghost-muted animate-pulse">Scanning Database...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-void pt-24 md:pt-28 pb-20 flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="font-syne font-bold text-ghost text-2xl md:text-3xl leading-tight">
          {error || 'Frame Not Found'}
        </h1>
        <p className="font-dm text-sm text-ghost-muted max-w-md">
          We couldn't locate the cybernetic frame you requested. It may have been decommissioned or the address is incorrect.
        </p>
        <Link
          to="/shop"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-2.5 font-dm text-sm text-ghost-muted hover:text-ghost hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Eyewear Store
        </Link>
      </div>
    )
  }


  function handleAddToCart() {
    if (!isAuthenticated || !token) {
      setNotice('Login required to add frames to your cart.')
      return
    }

    if (product.inStock === false || product.stock === 0) {
      setNotice('This frame is currently out of stock.')
      return
    }

    const res = addItem(product)
    if (res && res.success === false) {
      setNotice(res.message)
    } else {
      setNotice('Added to cart.')
    }
  }

  const isOutOfStock = product.inStock === false || product.stock === 0
  const stockPill = isOutOfStock
    ? { label: 'Out of stock', cls: 'border-red-400/30 bg-red-400/10 text-red-300' }
    : product.stock === 1
    ? { label: 'Only 1 left', cls: 'border-ember/40 bg-ember/15 text-ember animate-pulse' }
    : product.stock > 1 && product.stock <= 5
    ? { label: product.stock === 5 ? 'Only Five Frames left' : `Only ${product.stock} left`, cls: 'border-ember/30 bg-ember/10 text-ember' }
    : { label: `In stock (${product.stock ?? 10} available)`, cls: 'border-teal/20 bg-teal/10 text-teal' }

  return (
    <div className="min-h-screen bg-void pt-24 md:pt-28 pb-20">
      <div className="frame-container">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 font-dm text-sm text-ghost-muted hover:text-ghost hover:border-white/20 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] gap-8 lg:gap-12 items-start">
          <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="relative h-[240px] sm:h-[460px] bg-[#090909] flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.13), transparent 62%)' }}
              />
              <img
                src={images[activeImage]}
                alt={product.name}
                className={cn(
                  'relative z-10 max-h-[78%] max-w-[88%] object-contain rounded-xl',
                  isOutOfStock && 'opacity-40 grayscale'
                )}
                style={{ filter: isOutOfStock ? 'none' : 'drop-shadow(0 22px 55px rgba(155,92,246,0.22))' }}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto p-4 border-t border-white/[0.05]" style={{ scrollbarWidth: 'none' }}>
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      'h-20 w-24 flex-shrink-0 rounded-lg border bg-[#101010] flex items-center justify-center transition-colors',
                      index === activeImage ? 'border-violet' : 'border-white/[0.08] hover:border-white/20'
                    )}
                  >
                    <img src={image} alt="" className="max-h-16 max-w-20 object-contain" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="lg:pt-2">
            <div className="flex flex-wrap gap-2 mb-5">
              <DetailPill>{product.category?.replace(/-/g, ' ')}</DetailPill>
              {product.badge && <DetailPill>{product.badge}</DetailPill>}
              <span className={cn('rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest', stockPill.cls)}>
                {stockPill.label}
              </span>
            </div>

            <h1 className="font-syne font-bold text-ghost text-3xl md:text-5xl leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 text-ember">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill={i < (product.rating || 5) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="font-mono text-xs text-ghost-muted">{product.rating || 5}.0 rating</span>
            </div>

            <p className="font-syne font-bold text-ghost text-3xl mb-6">
              {formatPrice(product.price)}
            </p>

            <p className="font-dm text-base text-ghost-muted leading-relaxed mb-8 max-w-xl">
              {product.description || 'A premium frame designed for everyday comfort, sharp presence, and a clean fit across styles.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                'Lightweight daily fit',
                'Premium frame finish',
                'Prescription ready',
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-4">
                  <CheckCircle2 size={16} className="text-teal mb-3" />
                  <p className="font-dm text-sm text-ghost-muted leading-snug">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  'inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full px-8 py-3.5 font-dm text-sm font-semibold transition-all duration-200',
                  isOutOfStock
                    ? 'bg-white/[0.06] text-ghost-muted cursor-not-allowed border border-white/[0.08]'
                    : isAuthenticated && token
                      ? 'bg-violet hover:bg-violet-dark text-void hover:shadow-[0_0_24px_rgba(155,92,246,0.32)]'
                      : 'bg-ember hover:bg-ember-dark text-void hover:shadow-[0_0_24px_rgba(255,107,53,0.28)]'
                )}
              >
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    {isAuthenticated && token ? <ShoppingBag size={17} /> : <Lock size={17} />}
                    Add To Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-dm text-sm font-semibold transition-all duration-200 border',
                  isWishlisted
                    ? 'bg-ember/15 border-ember/40 text-ember'
                    : 'bg-white/[0.03] border-white/[0.1] text-ghost-muted hover:text-ghost hover:border-white/20'
                )}
              >
                <Heart size={16} className={cn(isWishlisted && 'fill-ember')} />
                {isWishlisted ? 'Saved to Wishlist' : 'Wishlist'}
              </button>
            </div>

            {notice && (
              <p className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-dm text-sm text-ghost-muted">
                {notice}
                {!isAuthenticated && (
                  <Link to="/login" className="ml-2 text-violet hover:text-violet-light">Login</Link>
                )}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
