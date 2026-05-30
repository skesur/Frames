import { useEffect, useRef } from 'react'
import gsap                  from 'gsap'
import { ScrollTrigger }     from 'gsap/ScrollTrigger'
import { fadeIn }            from '../animations/fadeIn'
import { scrollReveal }      from '../animations/scrollReveal'
import { staggerText }       from '../animations/staggerText'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation() {
  // Track all created tweens so we can kill them on cleanup
  const tweens = useRef([])

  useEffect(() => {
    return () => {
      tweens.current.forEach((tween) => {
        tween?.scrollTrigger?.kill()
        tween?.kill()
      })
      tweens.current = []
      ScrollTrigger.refresh()
    }
  }, [])

  function reveal(ref, options = {}) {
    if (!ref?.current) return
    const tween = scrollReveal(ref.current, options)
    if (tween) tweens.current.push(tween)
    return tween
  }

  function fade(ref, options = {}) {
    if (!ref?.current) return
    const tween = fadeIn(ref.current, options)
    if (tween) tweens.current.push(tween)
    return tween
  }

  function stagger(ref, selector, options = {}) {
    if (!ref?.current) return
    const tween = staggerText(ref.current, selector, options)
    if (tween) tweens.current.push(tween)
    return tween
  }

  return { reveal, fade, stagger }
}