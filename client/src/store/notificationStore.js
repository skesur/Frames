import { create } from 'zustand'
import api from '@/lib/axios'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount:   0,
  loading:       false,
  newToast:      null, // Stores the most recent notification to display as a popup
  hasLoadedOnce: false,

  fetchNotifications: async (silent = false) => {
    try {
      if (!silent) set({ loading: true })
      const res = await api.get('/notifications')
      const fetched = res.data.notifications || []

      // Calculate unread count
      const unread = fetched.filter((n) => !n.isRead).length

      // Detect if there are any new unread notifications that we didn't have before to trigger a popup
      const state = get()
      if (state.hasLoadedOnce) {
        const prevIds = new Set(state.notifications.map((p) => p._id))
        const brandNew = fetched.filter((f) => !f.isRead && !prevIds.has(f._id))
        
        if (brandNew.length > 0) {
          // Set the latest brand new notification as a popup toast
          set({ newToast: brandNew[0] })
        }
      }

      set({ notifications: fetched, unreadCount: unread, hasLoadedOnce: true })
    } catch (err) {
      console.error('[Notification Store] Fetch failed:', err.message)
    } finally {
      if (!silent) set({ loading: false })
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      
      // Update local state
      set((state) => {
        const updated = state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
        const unread = updated.filter((n) => !n.isRead).length
        return { notifications: updated, unreadCount: unread }
      })
    } catch (err) {
      console.error('[Notification Store] Mark as read failed:', err.message)
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/read-all')
      
      // Update local state
      set((state) => {
        const updated = state.notifications.map((n) => ({ ...n, isRead: true }))
        return { notifications: updated, unreadCount: 0 }
      })
    } catch (err) {
      console.error('[Notification Store] Mark all as read failed:', err.message)
    }
  },

  subscribeToRestock: async (productId) => {
    try {
      const res = await api.post('/notifications/notify-me', { productId })
      
      // Refetch notifications to include the subscription confirmation
      await get().fetchNotifications(true)
      
      return { success: true, message: res.data.message }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to subscribe to restock alerts',
      }
    }
  },

  clearToast: () => set({ newToast: null }),

  reset: () => set({ notifications: [], unreadCount: 0, newToast: null, hasLoadedOnce: false, loading: false }),
}))
