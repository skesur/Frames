import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Slide-up entrance — never forces opacity to 0 (avoids black screen if animation is interrupted). */
export function fadeIn(target, options = {}) {
  const {
    duration      = 0.8,
    delay         = 0,
    y             = 30,
    ease          = 'power3.out',
    scrollTrigger = null,
  } = options

  return gsap.from(target, {
    y,
    duration,
    delay,
    ease,
    immediateRender: false,
    scrollTrigger: scrollTrigger
      ? {
          trigger:       scrollTrigger.trigger || target,
          start:         scrollTrigger.start || 'top 85%',
          toggleActions: 'play none none none',
          once:          true,
        }
      : undefined,
  })
}
