import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('frames_token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('frames_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }))
      },
    }),
    {
      name:       'frames-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)