import { useRef, useEffect } from 'react'
import Button                from '@/components/ui/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function CTA() {
  const contentRef = useRef(null)
  const { fade }   = useScrollAnimation()

  useEffect(() => {
    fade(contentRef, { y: 40, duration: 0.9 })
  }, [])

  return (
    <section className="py-32 md:py-40 bg-void relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(155,92,246,0.1) 0%, transparent 60%)' }} />

      {/* Top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(155,92,246,0.4), transparent)' }} />

      <div ref={contentRef} className="frame-container text-center">
        <span className="font-mono text-[10px] text-violet uppercase tracking-[0.25em] mb-5 block">
          The Collection
        </span>

        <h2
          className="font-syne font-extrabold text-ghost uppercase leading-[1.0] mb-5"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em' }}
        >
          Find Your<br />
          <span className="text-gradient">Perfect Frame.</span>
        </h2>

        <p className="font-dm text-ghost-muted text-base max-w-sm mx-auto mb-10">
          500+ styles. Every prescription. One obsession.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button href="/shop" size="lg" variant="primary">
            Shop All Frames
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Need Help?
          </Button>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)' }} />
    </section>
  )
}