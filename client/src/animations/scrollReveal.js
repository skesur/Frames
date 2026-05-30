import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Scroll-triggered slide-up — content stays visible (opacity never forced to 0). */
export function scrollReveal(target, options = {}) {
  const {
    duration = 1,
    y        = 50,
    ease     = 'power3.out',
    start    = 'top 85%',
    markers  = false,
  } = options

  return gsap.from(target, {
    y,
    duration,
    ease,
    immediateRender: false,
    scrollTrigger: {
      trigger:       target,
      start,
      toggleActions: 'play none none none',
      once:          true,
      markers,
    },
  })
}
