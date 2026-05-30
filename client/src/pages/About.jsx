import { useRef, useEffect } from 'react'
import SectionLabel          from '@/components/ui/SectionLabel'
import Button                from '@/components/ui/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const VALUES = [
  { num: '01', label: 'Precision',  body: 'Every lens ground to exact optical specification. We don\'t approximate.' },
  { num: '02', label: 'Aesthetic',  body: 'Design living at the edge where luxury fashion meets the future.' },
  { num: '03', label: 'Durability', body: 'Materials chosen to outlast the trend. Built for the long run.' },
  { num: '04', label: 'Inclusion',  body: 'Every power, every face shape, every budget. Vision for all.' },
]

const PROOF = [
  { value: '2019',  label: 'Founded'       },
  { value: '500+',  label: 'Frame Styles'  },
  { value: '10K+',  label: 'Customers'     },
  { value: '4.9★',  label: 'Avg Rating'    },
]

export default function About() {
  const heroRef    = useRef(null)
  const proofRef   = useRef(null)
  const storyRef   = useRef(null)
  const valuesRef  = useRef(null)
  const { fade, reveal, stagger } = useScrollAnimation()

  useEffect(() => {
    fade(heroRef,   { y: 40, duration: 0.9 })
    reveal(proofRef,  { y: 30, duration: 0.8 })
    reveal(storyRef,  { y: 30, duration: 0.8 })
    stagger(valuesRef, '.value-card', { stagger: 0.1, y: 30, duration: 0.7 })
  }, [])

  return (
    <div className="bg-void text-ghost">

      {/* ── Hero ── */}
      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(155,92,246,0.07) 0%, transparent 60%)' }} />

        <div ref={heroRef} className="frame-container relative z-10">
          <SectionLabel color="violet" className="mb-7">Our Story</SectionLabel>
          <h1
            className="font-syne font-extrabold text-ghost uppercase leading-[1.0] mb-7"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 5rem)', letterSpacing: '-0.03em' }}
          >
            Vision Meets<br />
            <span className="text-gradient">Style.</span>
          </h1>
          <p className="font-dm text-ghost-muted text-base md:text-lg leading-relaxed max-w-xl">
            Frames was born from a simple belief: eyewear shouldn't be an afterthought.
            It should be the statement. We design for those who see the world through a
            different lens — literally and figuratively.
          </p>
        </div>
      </section>

      {/* ── Proof numbers ── */}
      <section className="border-t border-b border-white/[0.05]">
        <div ref={proofRef} className="frame-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.05]">
            {PROOF.map(({ value, label }) => (
              <div key={label} className="py-10 px-6 text-center">
                <div className="font-syne font-bold text-3xl text-ghost mb-1">{value}</div>
                <div className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story section ── */}
      <section className="py-28">
        <div ref={storyRef} className="frame-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <div>
              <SectionLabel color="ember" className="mb-7">The Philosophy</SectionLabel>
              <h2
                className="font-syne font-bold text-ghost leading-tight mb-6"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
              >
                Cyberpunk Luxury,<br />Redefined
              </h2>
              <div className="space-y-4">
                <p className="font-dm text-sm text-ghost-muted leading-relaxed">
                  We took the raw energy of cyberpunk aesthetics and filtered it through luxury
                  craftsmanship. The result is eyewear that feels both futuristic and timeless.
                </p>
                <p className="font-dm text-sm text-ghost-muted leading-relaxed">
                  Every frame starts as a concept sketch. Material testing, ergonomic refinement,
                  optical validation — each step obsessed over before a frame reaches you.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Image container with styled border */}
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d0d' }}
              >
                <img
                  src="/assets/images/hero_1.png"
                  alt="Frames craftsmanship"
                  className="w-full h-auto p-12 object-contain"
                />
              </div>
              {/* Subtle violet glow behind */}
              <div className="absolute -inset-4 rounded-xl pointer-events-none -z-10"
                style={{ background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.12) 0%, transparent 70%)' }} />
            </div>

          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="frame-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div>
              <SectionLabel color="teal" className="mb-5">What We Stand For</SectionLabel>
              <h2
                className="font-syne font-bold text-ghost"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
              >
                Core Values
              </h2>
            </div>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04] rounded-lg overflow-hidden border border-white/[0.04]">
            {VALUES.map(({ num, label, body }) => (
              <div
                key={label}
                className="value-card bg-void p-8 hover:bg-[#0d0d0d] transition-colors duration-300 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="font-mono text-[10px] text-ghost-muted/50">{num}</span>
                  <div className="w-4 h-px mt-2"
                    style={{ background: 'rgba(155,92,246,0.4)' }} />
                </div>
                <h3 className="font-syne font-semibold text-lg text-ghost mb-2">{label}</h3>
                <p className="font-dm text-sm text-ghost-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="frame-container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-syne font-bold text-2xl md:text-3xl text-ghost mb-2">
              Ready to find yours?
            </h2>
            <p className="font-dm text-ghost-muted text-sm">
              Browse 500+ frames crafted for every vision.
            </p>
          </div>
          <Button href="/shop" size="lg" variant="primary">
            Shop Collection
          </Button>
        </div>
      </section>

    </div>
  )
}