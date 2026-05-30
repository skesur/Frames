import { useRef, useEffect }  from 'react'
import { Shield, Zap, Eye }   from 'lucide-react'
import SectionLabel           from '@/components/ui/SectionLabel'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const FEATURES = [
  {
    Icon:  Shield,
    title: 'Premium Materials',
    body:  'Titanium frames, premium acetate, surgical-grade steel. Every piece built to outlast trends and withstand daily wear.',
    color: '#9B5CF6',
  },
  {
    Icon:  Eye,
    title: 'All Prescriptions',
    body:  'From zero-power to high cylinder — our lens lab handles every prescription with certified optical precision.',
    color: '#00F5C4',
  },
  {
    Icon:  Zap,
    title: 'Cinematic Style',
    body:  'Designed at the intersection of luxury fashion and cyberpunk aesthetic. Frames that don\'t just sit on your face.',
    color: '#FF6B35',
  },
]

export default function Features() {
  const headingRef = useRef(null)
  const cardsRef   = useRef(null)
  const { reveal, stagger } = useScrollAnimation()

  useEffect(() => {
    reveal(headingRef, { y: 30, duration: 0.8 })
    stagger(cardsRef, '.feat-card', { stagger: 0.12, y: 40, duration: 0.8 })
  }, [])

  return (
    <section className="py-28 md:py-36 bg-void relative overflow-hidden">

      {/* Top subtle gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(155,92,246,0.3), transparent)' }}
      />
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(155,92,246,0.06) 0%, transparent 70%)' }} />

      <div className="frame-container">

        {/* Section header */}
        <div ref={headingRef} className="mb-16">
          <SectionLabel color="violet" className="mb-5">Why Frames</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-syne font-bold text-ghost leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Crafted for the<br />
              <span className="text-gradient">Visionary</span>
            </h2>
            <p className="font-dm text-ghost-muted text-sm max-w-xs leading-relaxed md:text-right">
              Every detail obsessed over. Every lens precision-ground.<br />Every frame a statement.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-12"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

        {/* Feature cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] rounded-lg overflow-hidden border border-white/[0.04]">
          {FEATURES.map(({ Icon, title, body, color }, i) => (
            <div
              key={title}
              className="feat-card bg-void p-8 md:p-10 group hover:bg-[#0d0d0d] transition-colors duration-300"
            >
              <div className="mb-6">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center mb-5"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon size={20} style={{ color }} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ghost-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-syne font-semibold text-xl text-ghost mb-3">{title}</h3>
              <p className="font-dm text-sm text-ghost-muted leading-relaxed">{body}</p>
              <div
                className="mt-8 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}