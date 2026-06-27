import { create } from 'zustand'

export const useUIStore = create((set) => ({
  introAnimationDone: false,
  setIntroAnimationDone: (val) => set({ introAnimationDone: val }),
}))
