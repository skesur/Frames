import { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2, X, Package } from 'lucide-react'
import api               from '@/lib/axios'
import { formatPrice, cn } from '@/lib/utils'
import { useModalLock }  from '@/hooks/useModalLock'

const CATEGORIES = [
  { id: 'all',           label: 'All'            },
  { id: 'top-sellers',   label: 'Top Sellers'    },
  { id: 'new-arrivals',  label: 'New Arrivals'   },
  { id: 'round-frames',  label: 'Round Frames'   },
  { id: 'square-frames', label: 'Square Frames'  },
  { id: 'sunglasses',    label: 'Sunglasses'     },
]

const EMPTY_FORM = {
  name: '', slug: '', price: '', description: '', category: '',
  badge: '', rating: '5', images: '', modelFile: '', inStock: true, featured: false,
}

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl border font-dm text-sm shadow-lg',
      type === 'error' ? 'bg-red-400/10 border-red-400/25 text-red-300' : 'bg-teal/10 border-teal/25 text-teal'
    )}>
      {message}
    </div>
  )
}

function ProductFormModal({ product, onClose, onSaved }) {
  useModalLock()
  const isEdit = Boolean(product)

  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name || '', slug: product.slug || '', price: String(product.price ?? ''),
          description: product.description || '', category: product.category || '',
          badge: product.badge || '', rating: String(product.rating ?? '5'),
          images: (product.images || []).join(', '), modelFile: product.modelFile || '',
          inStock: product.inStock ?? true, featured: product.featured ?? false,
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim())  return setError('Product name is required.')
    if (!form.slug.trim())  return setError('Slug is required.')
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0)
      return setError('Price must be a valid number.')
    if (!form.category) return setError('Category is required.')

    const imagesArr = form.images.split(',').map((s) => s.trim()).filter(Boolean)
    if (imagesArr.length === 0) return setError('At least one image path is required.')

    const rating = Number(form.rating)
    if (isNaN(rating) || rating < 1 || rating > 5) return setError('Rating must be between 1 and 5.')

    const payload = {
      name: form.name.trim(), slug: form.slug.trim(), price: Number(form.price),
      description: form.description.trim(), category: form.category,
      badge: form.badge.trim(), rating, images: imagesArr,
      modelFile: form.modelFile.trim(), inStock: form.inStock, featured: form.featured,
    }

    try {
      setSaving(true)
      if (isEdit) {
        const res = await api.put(`/admin/products/${product._id}`, payload)
        onSaved(res.data.product, 'Product updated')
      } else {
        const res = await api.post('/admin/products', payload)
        onSaved(res.data.product, 'Product created')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.')
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

        <div className="sticky top-0 bg-[#0c0c0c] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Package size={16} className="text-ember" strokeWidth={1.75} />
            <h2 className="font-syne font-bold text-ghost text-lg">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-ghost-muted hover:text-ghost transition-colors">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="field" placeholder="Premium Clubmaster" />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Slug *</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className="field" placeholder="premium-clubmaster" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Price (INR) *</label>
              <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className="field" placeholder="2499" />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Category *</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="field appearance-none cursor-pointer">
                <option value="" disabled>Select category</option>
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="field resize-none" placeholder="Short product description" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Badge</label>
              <input value={form.badge} onChange={(e) => set('badge', e.target.value)} className="field" placeholder="New / Top Pick / Premium" />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Rating (1–5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={(e) => set('rating', e.target.value)} className="field" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">Image Paths *</label>
            <textarea
              value={form.images}
              onChange={(e) => set('images', e.target.value)}
              rows={2}
              className="field resize-none"
              placeholder="/assets/image/t_s_2.png, /assets/image/t_s_2b.png"
            />
            <p className="font-dm text-[11px] text-ghost-muted/60 mt-1.5">Comma-separated, relative to client/public</p>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-ghost/40 uppercase tracking-widest mb-2">3D Model File (optional)</label>
            <input value={form.modelFile} onChange={(e) => set('modelFile', e.target.value)} className="field" placeholder="frame.glb" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} className="w-4 h-4 accent-violet" />
              <span className="font-dm text-sm text-ghost-muted">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-ember" />
              <span className="font-dm text-sm text-ghost-muted">Featured</span>
            </label>
          </div>

          {error && (
            <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-violet hover:bg-violet-dark disabled:opacity-50 text-void font-dm font-semibold text-sm py-3.5 rounded-xl transition-all duration-200"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ product, onClose, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-7 text-center">
        <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-5">
          <Trash2 size={22} className="text-red-400" strokeWidth={1.5} />
        </div>
        <h3 className="font-syne font-bold text-ghost text-xl mb-2">Delete Product?</h3>
        <p className="font-dm text-sm text-ghost-muted mb-7 leading-relaxed">
          "{product.name}" will be permanently removed from the catalog.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-white/[0.1] text-ghost-muted hover:text-ghost font-dm text-sm py-3 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-dm font-semibold text-sm py-3 rounded-xl transition-all"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('all')

  const [showForm,     setShowForm]     = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)
  const [toast,        setToast]        = useState(null)

  async function fetchProducts() {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (category !== 'all') params.category = category
      const res = await api.get('/admin/products', { params })
      setProducts(res.data.products)
    } catch {
      setToast({ type: 'error', message: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [search, category])

  function handleSaved(_p, message) {
    setShowForm(false)
    setEditTarget(null)
    setToast({ type: 'success', message })
    fetchProducts()
  }

  async function handleDelete() {
    try {
      setDeleting(true)
      await api.delete(`/admin/products/${deleteTarget._id}`)
      setToast({ type: 'success', message: 'Product deleted' })
      setDeleteTarget(null)
      fetchProducts()
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-syne font-bold text-xl text-ghost mb-1">Products</h1>
          <p className="font-dm text-sm text-ghost-muted">{products.length} products in catalog</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 bg-violet hover:bg-violet-dark text-void font-dm font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ghost-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-9 pr-4 py-2.5 font-dm text-sm text-ghost placeholder:text-ghost-muted/40 focus:outline-none focus:border-violet/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={cn(
                'flex-shrink-0 font-dm text-xs px-3.5 py-2 rounded-full border transition-all duration-200',
                category === id ? 'bg-violet border-violet text-void font-semibold' : 'border-white/[0.1] text-ghost-muted hover:border-white/25'
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
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-white/[0.03] animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <p className="font-dm text-sm text-ghost-muted text-center py-16">No products found</p>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {products.map((p) => (
              <div key={p._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.015] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0d0d0d] flex items-center justify-center flex-shrink-0">
                  <img src={p.images?.[0]} alt={p.name} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-syne font-semibold text-sm text-ghost truncate">{p.name}</p>
                  <p className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">{p.category.replace(/-/g, ' ')}</p>
                </div>
                <span className="font-syne font-bold text-sm text-ghost hidden sm:block">{formatPrice(p.price)}</span>
                <span className={cn(
                  'font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border hidden md:block',
                  p.inStock ? 'text-teal bg-teal/10 border-teal/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
                )}>
                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditTarget(p); setShowForm(true) }} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-ghost-muted hover:text-violet hover:border-violet/30 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-ghost-muted hover:text-red-400 hover:border-red-400/30 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProductFormModal product={editTarget} onClose={() => { setShowForm(false); setEditTarget(null) }} onSaved={handleSaved} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal product={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} deleting={deleting} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
