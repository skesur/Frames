import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function staggerText(parent, childSelector = '*', options = {}) {
  const {
    duration      = 0.7,
    stagger       = 0.08,
    y             = 40,
    ease          = 'power3.out',
    scrollTrigger = true,
    delay         = 0,
  } = options

  let children = []
  let trigger = parent

  if (parent instanceof Element) {
    children =
      childSelector === '*'
        ? gsap.utils.toArray(parent.children)
        : gsap.utils.toArray(parent.querySelectorAll(childSelector))
  } else if (typeof parent === 'string') {
    children = gsap.utils.toArray(`${parent} ${childSelector}`)
  }

  if (!children.length) return null

  return gsap.from(children, {
    y,
    duration,
    stagger,
    delay,
    ease,
    immediateRender: false,
    scrollTrigger: scrollTrigger
      ? {
          trigger,
          start:         'top 85%',
          toggleActions: 'play none none none',
          once:          true,
        }
      : undefined,
  })
}
