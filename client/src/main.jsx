import { StrictMode }  from 'react'
import { createRoot }  from 'react-dom/client'
import './styles/globals.css'
import App             from './App'
import Lenis           from '@studio-freight/lenis'
import gsap            from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins once here — never again in any component
gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis smooth scroll globally
const lenis = new Lenis({
  duration:    1.2,
  easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

// Sync Lenis RAF with GSAP ticker — required for ScrollTrigger accuracy
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Expose lenis globally for programmatic scrollTo calls
window.lenis = lenis

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)