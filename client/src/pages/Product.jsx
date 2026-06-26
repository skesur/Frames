import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag, Star } from 'lucide-react'
import api from '@/lib/axios'
import { fallbackProducts } from '@/data/products'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [notice, setNotice] = useState('')

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

  function handleAddToCart() {
    if (!isAuthenticated || !token) {
      setNotice('Login required to add frames to your cart.')
      return
    }

    addItem(product)
    setNotice('Added to cart.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void pt-28 pb-20">
        <div className="frame-container grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[420px] rounded-xl bg-white/[0.03] animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-white/[0.04] animate-pulse" />
            <div className="h-4 w-full rounded bg-white/[0.03] animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-void pt-28 pb-20">
        <div className="frame-container">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-ghost-muted hover:text-ghost font-dm text-sm mb-8">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-8 text-center">
            <p className="font-syne font-bold text-xl text-ghost mb-2">Product not found</p>
            <p className="font-dm text-sm text-red-200/80">{error || 'This frame is unavailable.'}</p>
          </div>
        </div>
      </div>
    )
  }

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
                className="relative z-10 max-h-[78%] max-w-[88%] object-contain rounded-xl"
                style={{ filter: 'drop-shadow(0 22px 55px rgba(155,92,246,0.22))' }}
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
              <DetailPill>{product.inStock === false ? 'Out of stock' : 'In stock'}</DetailPill>
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

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={cn(
                'inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-8 py-3.5 font-dm text-sm font-semibold transition-all duration-200',
                product.inStock === false
                  ? 'bg-white/[0.06] text-ghost-muted cursor-not-allowed'
                  : isAuthenticated && token
                    ? 'bg-violet hover:bg-violet-dark text-void hover:shadow-[0_0_24px_rgba(155,92,246,0.32)]'
                    : 'bg-ember hover:bg-ember-dark text-void hover:shadow-[0_0_24px_rgba(255,107,53,0.28)]'
              )}
            >
              {isAuthenticated && token ? <ShoppingBag size={17} /> : <Lock size={17} />}
              Add To Cart
            </button>

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
