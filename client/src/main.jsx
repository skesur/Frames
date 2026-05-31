import { StrictMode }    from 'react'
import { createRoot }    from 'react-dom/client'
import '@/styles/globals.css'
import App               from './App'
import Lenis             from 'lenis'
import gsap              from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration:    1.2,
  easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)
window.lenis = lenis

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)