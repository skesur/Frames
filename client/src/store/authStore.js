import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/axios'
import { resetCartStorage, useCartStore } from '@/store/cartStore'

export const useAuthStore = create(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('frames_token', token)
        useCartStore.getState().loadCartFromServer()
        set({ user, token, isAuthenticated: true })
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch {
          // Local logout should still complete if the server is unreachable.
        }
        localStorage.removeItem('frames_token')
        resetCartStorage()
        useCartStore.setState({ items: [] })
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }))
      },
    }),
    {
      name:       'frames-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        isAuthenticated: Boolean(persistedState?.token),
      }),
    }
  )
)
