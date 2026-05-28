import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function staggerText(parent, childSelector = '*', options = {}) {
  const {
    duration      = 0.7,
    stagger       = 0.08,
    y             = 40,
    opacity       = 0,
    ease          = 'power3.out',
    scrollTrigger = true,
    delay         = 0,
  } = options

  const children = gsap.utils.toArray(`${parent} ${childSelector}`)

  return gsap.fromTo(
    children,
    { opacity, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: scrollTrigger
        ? {
            trigger:       parent,
            start:         'top 80%',
            toggleActions: 'play none none none',
          }
        : undefined,
    }
  )
}