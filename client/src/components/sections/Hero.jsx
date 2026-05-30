import { useState, useEffect, useRef } from 'react'
import gsap                             from 'gsap'
import Button                           from '@/components/ui/Button'
import { mapRange }                     from '@/lib/utils'
import { ArrowRight }                   from 'lucide-react'

const STATS = [
  { value: '500+', label: 'Styles'     },
  { value: '10K+', label: 'Customers'  },
  { value: '4.9★', label: 'Rating'     },
  { value: '48hr', label: 'Delivery'   },
]

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const sectionRef  = useRef(null)
  const labelRef    = useRef(null)
  const headlineRef = useRef(null)
  const subRef      = useRef(null)
  const btnsRef     = useRef(null)
  const statsRef    = useRef(null)
  const mainImgRef  = useRef(null)
  const card1Ref    = useRef(null)
  const card2Ref    = useRef(null)
  const glowRef     = useRef(null)

  /* ── Mouse parallax ── */
  function handleMouseMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: mapRange(e.clientX, rect.left, rect.right, -1, 1),
      y: mapRange(e.clientY, rect.top, rect.bottom, -1, 1),
    })
  }

  useEffect(() => {
    gsap.to(mainImgRef.current, {
      x: mouse.x * 12,
      y: mouse.y * 8,
      duration: 1.2,
      ease: 'power2.out',
    })
    gsap.to(card1Ref.current, {
      x: mouse.x * 20,
      y: mouse.y * 14,
      duration: 1.0,
      ease: 'power2.out',
    })
    gsap.to(card2Ref.current, {
      x: mouse.x * -16,
      y: mouse.y * -10,
      duration: 1.4,
      ease: 'power2.out',
    })
  }, [mouse])

  /* ── Entrance animation ── */
  useEffect(() => {
    const els = [
      labelRef.current,
      headlineRef.current,
      subRef.current,
      btnsRef.current,
      statsRef.current,
    ]
    gsap.set(els, { opacity: 0, y: 32 })
    gsap.set([mainImgRef.current, card1Ref.current, card2Ref.current], {
      opacity: 0,
      y: 40,
    })

    const tl = gsap.timeline({ delay: 0.2 })

    tl.to(labelRef.current,    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
      .to(subRef.current,      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .to(btnsRef.current,     { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(mainImgRef.current,  { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.8')
      .to(card1Ref.current,    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to(card2Ref.current,    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to(statsRef.current,    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    return () => tl.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-void overflow-hidden flex items-center"
    >

      {/* Video background */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
      >
        <source src="/assets/videos/frames-product.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/20 to-void pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent pointer-events-none" />

      {/* Main two-column layout */}
      <div className="frame-container relative z-10 w-full pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

          {/* ── Left column: content ── */}
          <div className="flex flex-col justify-center">

            {/* Label */}
            <div ref={labelRef} className="mb-8">
              <span className="inline-flex items-center gap-2 border border-violet/30 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
                <span className="font-mono text-[10px] text-violet uppercase tracking-[0.2em]">
                  New Collection 2026
                </span>
              </span>
            </div>

            {/* Headline — keep it tight and controlled */}
            <h1
              ref={headlineRef}
              className="font-syne font-extrabold uppercase leading-[1.0] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 5.2rem)', letterSpacing: '-0.03em' }}
            >
              <span className="block text-ghost">See The</span>
              <span className="block text-ghost">World</span>
              <span className="block text-gradient">Differently.</span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subRef}
              className="font-dm text-ghost-muted text-base md:text-lg leading-relaxed mb-10 max-w-sm"
            >
              Premium cyberpunk eyewear for those who refuse to see the world in ordinary.
            </p>

            {/* Buttons */}
            <div ref={btnsRef} className="flex items-center gap-4 mb-14 flex-wrap">
              <Button href="/shop" size="lg" variant="primary">
                Shop Collection
              </Button>
              <Button href="/about" size="lg" variant="ghost">
                Our Story <ArrowRight size={16} />
              </Button>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-4 gap-0 border border-white/[0.06] rounded-md overflow-hidden"
            >
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`py-4 px-3 text-center ${i < 3 ? 'border-r border-white/[0.06]' : ''}`}
                >
                  <div className="font-syne font-bold text-lg text-ghost leading-none mb-1">
                    {value}
                  </div>
                  <div className="font-mono text-[9px] text-ghost-muted uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: visual ── */}
          <div className="relative h-[520px] lg:h-[640px] hidden lg:block">

            {/* Background glow */}
            <div
              ref={glowRef}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.18) 0%, transparent 68%)',
                transform: 'scale(1.2)',
              }}
            />

            {/* Main product image */}
            <div
              ref={mainImgRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src="/assets/images/hero_1.png"
                alt="Featured Frame"
                className="w-[78%] max-w-[380px] drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 20px 60px rgba(155,92,246,0.3))' }}
              />
            </div>

            {/* Floating card 1 — top right */}
            <div
              ref={card1Ref}
              className="absolute top-8 right-4 w-44 glass rounded-xl overflow-hidden"
              style={{ transform: 'rotate(4deg)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <img src="/assets/images/hero_2.png" alt="Frame style" className="w-full h-auto" />
              <div className="px-3 py-2.5 bg-void/60">
                <p className="font-syne text-xs font-semibold text-ghost">Aviator Pro</p>
                <p className="font-mono text-[10px] text-violet">₹2,499</p>
              </div>
            </div>

            {/* Floating card 2 — bottom left */}
            <div
              ref={card2Ref}
              className="absolute bottom-12 left-4 w-40 glass rounded-xl overflow-hidden"
              style={{ transform: 'rotate(-3deg)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <img src="/assets/images/hero_3.png" alt="Frame style" className="w-full h-auto" />
              <div className="px-3 py-2.5 bg-void/60">
                <p className="font-syne text-xs font-semibold text-ghost">Round Elite</p>
                <p className="font-mono text-[10px] text-ember">₹3,199</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-violet to-transparent" />
      </div>

    </section>
  )
}