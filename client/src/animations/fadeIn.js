import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function fadeIn(target, options = {}) {
  const {
    duration     = 0.8,
    delay        = 0,
    y            = 30,
    opacity      = 0,
    ease         = 'power3.out',
    scrollTrigger = null,
  } = options

  return gsap.fromTo(
    target,
    { opacity, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: scrollTrigger
        ? {
            trigger:       scrollTrigger.trigger || target,
            start:         scrollTrigger.start   || 'top 85%',
            toggleActions: 'play none none none',
          }
        : undefined,
    }
  )
}