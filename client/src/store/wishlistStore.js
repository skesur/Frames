import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const activeWishlistKey = 'frames-wishlist'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const exists = get().items.some((i) => i._id === product._id)
        let items

        if (exists) {
          items = get().items.filter((i) => i._id !== product._id)
          set({ items })
          return { added: false, message: 'Removed from wishlist' }
        }

        items = [...get().items, product]
        set({ items })
        return { added: true, message: 'Saved to wishlist' }
      },

      removeItem: (id) => {
        const items = get().items.filter((i) => i._id !== id)
        set({ items })
      },

      isInWishlist: (id) => get().items.some((i) => i._id === id),

      clearWishlist: () => set({ items: [] }),

      getTotalItems: () => get().items.length,
    }),
    { name: activeWishlistKey }
  )
)
