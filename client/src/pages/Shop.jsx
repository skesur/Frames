import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams }                           from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, X }      from 'lucide-react'
import ProductCard                                   from '@/components/product/ProductCard'
import api                                           from '@/lib/axios'
import { cn }                                        from '@/lib/utils'
import { fallbackProducts }                          from '@/data/products'
import FrameColorCarousel from "../components/three/FrameColorCarousel"

const CATEGORIES = [
  { id: 'all',           label: 'All Frames'    },
  { id: 'top-sellers',   label: 'Top Sellers'   },
  { id: 'new-arrivals',  label: 'New Arrivals'  },
  { id: 'round-frames',  label: 'Round Frames'  },
  { id: 'square-frames', label: 'Square Frames' },
  { id: 'sunglasses',    label: 'Sunglasses'    },
]

const SECTIONS = [
  { id: 'top-sellers',   title: 'Top Sellers',   subtitle: 'Our most popular frames loved by thousands'   },
  { id: 'new-arrivals',  title: 'New Arrivals',  subtitle: 'Fresh styles just landed this season'         },
  { id: 'round-frames',  title: 'Round Frames',  subtitle: 'Timeless circular designs for every face'     },
  { id: 'square-frames', title: 'Square Frames', subtitle: 'Sharp angles and modern sophistication'       },
  { id: 'sunglasses',    title: 'Sunglasses',    subtitle: 'Premium protection with unmatched style'      },
]

const HERO_SLIDES = [
  { img: '/assets/image/hero_1.png', label: 'Silver Gold Vintage'  },
  { img: '/assets/image/hero_2.png', label: 'Premium Clubmaster'   },
  { img: '/assets/image/hero_3.png', label: 'Vibrant Green'        },
  { img: '/assets/image/hero_4.png', label: 'Classic Browline'     },
  { img: '/assets/image/hero_5.png', label: 'Crystal Clear'        },
]

/* Horizontal scroll section */
function ProductRow({ title, subtitle, products, loading }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="pb-14 md:pb-20">

      {/* Section header */}
      <div className="frame-container mb-6">
        <div className="flex items-end justify-between">
          <div>
            <div
              className="h-[2px] w-8 mb-3 rounded-full"
              style={{ background: 'var(--ember)' }}
            />
            <h2 className="font-syne font-bold text-ghost text-2xl md:text-3xl leading-tight">
              {title}
            </h2>
            <p className="font-dm text-sm text-ghost-muted mt-1">{subtitle}</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-ghost/50 hover:text-ghost hover:border-white/20 transition-all duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-ghost/50 hover:text-ghost hover:border-white/20 transition-all duration-200"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Mobile scroll buttons */}
        <button
          onClick={() => scroll(-1)}
          className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full glass flex items-center justify-center text-ghost/60"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full glass flex items-center justify-center text-ghost/60"
        >
          <ChevronRight size={14} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-56 md:w-64 h-64 rounded-xl bg-white/[0.03] animate-pulse"
                />
              ))
            : products.map((p) => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </div>
    </section>
  )
}

/* Main page */
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allProducts,     setAllProducts]     = useState([])
  const [loading,         setLoading]         = useState(true)
  const [search,          setSearch]          = useState('')
  const [activeCategory,  setActiveCategory]  = useState('all')
  const [searchFocused,   setSearchFocused]   = useState(false)

  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const validCategory = CATEGORIES.some(({ id }) => id === category)

    setActiveCategory(validCategory ? category : 'all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [searchParams])

  // Fetch all products once on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const res = await api.get('/products')
        const products = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
            ? res.data.products
            : []

        setAllProducts(products.length > 0 ? products : fallbackProducts)
      } catch (err) {
        console.error('Failed to fetch products:', err.message)
        setAllProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Client-side filter
  const filtered = allProducts.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || p.category === activeCategory

    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  // Group by category for section display
  const byCategory = useCallback(
    (categoryId) => filtered.filter((p) => p.category === categoryId),
    [filtered]
  )

  const isSearching = search.trim().length > 0 || activeCategory !== 'all'

  function handleCategoryChange(categoryId) {
    setActiveCategory(categoryId)

    if (categoryId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: categoryId })
    }
  }

  return (
    <div className="bg-void min-h-screen">

      {/* Search + filter bar */}
      <div className="pt-16">
        <div className="sticky top-16 z-40 bg-void/95 backdrop-blur-md border-b border-white/[0.05]">
          <div className="frame-container py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">

              {/* Search input */}
              <div className={cn(
                'relative flex-1 max-w-md transition-all duration-200',
                searchFocused && 'max-w-lg'
              )}>
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search frames..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-9 pr-9 py-2.5 font-dm text-sm text-ghost placeholder:text-ghost-muted/40 focus:outline-none focus:border-violet/40 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost-muted hover:text-ghost"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
                {CATEGORIES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleCategoryChange(id)}
                    className={cn(
                      'flex-shrink-0 font-dm text-xs px-4 py-2 rounded-full border transition-all duration-200',
                      activeCategory === id
                        ? 'bg-violet border-violet text-void font-semibold'
                        : 'border-white/[0.1] text-ghost-muted hover:border-white/25 hover:text-ghost'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero carousel */}
      {!isSearching && <FrameColorCarousel />}

      {/* Search results view */}
      {isSearching ? (
        <div className="pt-10 pb-20">
          <div className="frame-container mb-8">
            <p className="font-dm text-sm text-ghost-muted">
              {filtered.length === 0
                ? 'No frames found'
                : `${filtered.length} frame${filtered.length === 1 ? '' : 's'} found`}
              {search && <span className="text-violet"> for &ldquo;{search}&rdquo;</span>}
            </p>
          </div>
          <div className="frame-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-white/[0.03] animate-pulse" />
                ))
              : filtered.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    className="w-full md:w-full"
                  />
                ))
            }
          </div>
        </div>
      ) : (
        /* Category sections view */
        <div className="pt-12">
          {SECTIONS.map(({ id, title, subtitle }) => (
            <ProductRow
              key={id}
              title={title}
              subtitle={subtitle}
              products={byCategory(id)}
              loading={loading}
            />
          ))}
        </div>
      )}

    </div>
  )
}
