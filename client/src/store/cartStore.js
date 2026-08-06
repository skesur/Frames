import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/axios'

const activeCartKey = 'frames-cart'

export function resetCartStorage() {
  localStorage.removeItem(activeCartKey)
}

function hasToken() {
  return Boolean(localStorage.getItem('frames_token'))
}

async function syncItems(items) {
  if (!hasToken()) return
  try {
    await api.put('/cart', {
      items: items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
    })
  } catch (err) {
    console.error('Failed to sync cart:', err.response?.data?.message || err.message)
  }
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const availableStock = product.stock !== undefined ? product.stock : (product.inStock === false ? 0 : 99)
        if (availableStock <= 0) {
          return { success: false, message: 'Frame is currently out of stock.' }
        }

        const existing = get().items.find((i) => i._id === product._id)
        let items
        let notice = ''

        if (existing) {
          const newQty = existing.quantity + 1
          if (newQty > availableStock) {
            return {
              success: false,
              message: `Cannot add more. Only ${availableStock} frame${availableStock === 1 ? '' : 's'} available in stock.`,
            }
          }
          items = get().items.map((i) =>
            i._id === product._id ? { ...i, quantity: newQty, stock: availableStock } : i
          )
        } else {
          items = [...get().items, { ...product, stock: availableStock, quantity: 1 }]
        }

        set({ items })
        syncItems(items)
        return { success: true }
      },

      removeItem: (id) => {
        const items = get().items.filter((i) => i._id !== id)
        set({ items })
        syncItems(items)
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        const item = get().items.find((i) => i._id === id)
        const availableStock = item?.stock !== undefined ? item.stock : 99
        const targetQty = Math.min(quantity, availableStock)

        const items = get().items.map((i) =>
          i._id === id ? { ...i, quantity: targetQty } : i
        )
        set({ items })
        syncItems(items)
      },

      clearCart: () => {
        set({ items: [] })
        syncItems([])
      },

      loadCartFromServer: async () => {
        if (!hasToken()) {
          set({ items: [] })
          return
        }

        try {
          const res = await api.get('/cart')
          set({ items: res.data.cart?.items || [] })
        } catch (err) {
          console.error('Failed to load cart:', err.response?.data?.message || err.message)
        }
      },

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: activeCartKey }
  )
)
