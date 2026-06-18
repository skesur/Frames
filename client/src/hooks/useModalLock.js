import { useEffect } from 'react'

export function useModalLock() {
  useEffect(() => {
    // Stop Lenis so it doesn't intercept wheel events
    window.lenis?.stop()

    // Lock body scroll as a fallback
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.lenis?.start()
      document.body.style.overflow = prev
    }
  }, [])
}