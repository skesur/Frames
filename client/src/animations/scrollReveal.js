import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function scrollReveal(target, options = {}) {
  const {
    duration = 1,
    y        = 50,
    opacity  = 0,
    ease     = 'power3.out',
    start    = 'top 80%',
    markers  = false,
  } = options

  return gsap.fromTo(
    target,
    { opacity, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      scrollTrigger: {
        trigger:       target,
        start,
        toggleActions: 'play none none reverse',
        markers,
      },
    }
  )
}