import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Eye, Target, Gem, Users,
  Star, Palette, Shield, Recycle, ArrowRight,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const VALUES = [
  {
    Icon: Star,
    title: 'Quality First',
    body:  'Premium materials and meticulous craftsmanship in every frame we create.',
  },
  {
    Icon: Palette,
    title: 'Design Excellence',
    body:  'Innovative designs that blend bold style with everyday functionality.',
  },
  {
    Icon: Shield,
    title: 'Sustainability',
    body:  'Committed to eco-friendly practices and responsible sourcing at every step.',
  },
  {
    Icon: Recycle,
    title: 'Customer Focus',
    body:  'Your satisfaction and vision clarity are at the heart of everything we do.',
  },
]

function SectionHeader({ Icon, title, className }) {
  return (
    <div className={cn('flex items-center gap-3 mb-4', className)}>
      <Icon size={22} strokeWidth={1.75} className="text-ember shrink-0" />
      <h2 className="font-syne font-bold text-2xl md:text-3xl text-gradient leading-tight">
        {title}
      </h2>
    </div>
  )
}

function SectionRule() {
  return (
    <div
      className="h-px w-full mb-10 md:mb-12"
      style={{ background: 'linear-gradient(to right, rgba(255,107,53,0.55), rgba(255,107,53,0.08), transparent)' }}
    />
  )
}

function GradientIcon({ Icon, size = 22 }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
      style={{ background: 'var(--cyber-gradient)' }}
    >
      <Icon size={size} strokeWidth={1.75} className="text-void" />
    </div>
  )
}

function GlassCard({ children, className }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-10',
        'transition-all duration-300 hover:border-violet/25 hover:bg-white/[0.035]',
        className
      )}
    >
      {children}
    </div>
  )
}

export default function About() {
  const heroRef    = useRef(null)
  const storyRef   = useRef(null)
  const visionRef  = useRef(null)
  const valuesRef  = useRef(null)
  const teamRef    = useRef(null)
  const ctaRef     = useRef(null)
  const { reveal, fade, stagger } = useScrollAnimation()

  useEffect(() => {
    reveal(heroRef,   { y: 36, duration: 0.85 })
    reveal(storyRef,  { y: 40, duration: 0.8 })
    stagger(visionRef, '.about-card', { stagger: 0.14, y: 36, duration: 0.75 })
    stagger(valuesRef, '.value-card', { stagger: 0.1, y: 32, duration: 0.7 })
    reveal(teamRef,   { y: 36, duration: 0.8 })
    fade(ctaRef,      { y: 40, duration: 0.9 })
  }, [])

  return (
    <div className="bg-void min-h-screen">

      {/* ── Page hero ── */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(155,92,246,0.12) 0%, transparent 55%)' }}
        />
        <div ref={heroRef} className="frame-container relative text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember/80 mb-5 block">
            Who We Are
          </span>
          <h1
            className="font-syne font-extrabold text-ghost mb-5"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', letterSpacing: '-0.03em' }}
          >
            About <span className="text-gradient">Us</span>
          </h1>
          <div
            className="h-[3px] w-28 mx-auto rounded-full"
            style={{ background: 'var(--cyber-gradient)' }}
          />
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="pb-20 md:pb-28">
        <div ref={storyRef} className="frame-container max-w-3xl">
          <SectionHeader Icon={BookOpen} title="Our Story" />
          <SectionRule />
          <div className="flex flex-col gap-6 font-dm text-sm md:text-base text-ghost/60 leading-relaxed">
            <p>
              Founded in 2020, Frames began as a small boutique eyewear shop with a big vision.
              What started as a passion project has grown into a premier destination for premium
              eyewear that combines style, quality, and affordability.
            </p>
            <p>
              We believe that eyewear is more than just a necessity — it&apos;s a fashion statement,
              an expression of individuality, and a way to see the world differently. Every frame
              in our collection is carefully curated to help you find the perfect match for your
              unique style.
            </p>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="pb-20 md:pb-28">
        <div ref={visionRef} className="frame-container grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <GlassCard className="about-card text-center">
            <GradientIcon Icon={Eye} />
            <h3 className="font-syne font-bold text-xl md:text-2xl text-ghost mb-4">Our Vision</h3>
            <p className="font-dm text-sm text-ghost/55 leading-relaxed max-w-sm mx-auto">
              To make premium eyewear accessible to everyone while championing sustainability
              and ethical practices in everything we create.
            </p>
          </GlassCard>

          <GlassCard className="about-card text-center">
            <GradientIcon Icon={Target} />
            <h3 className="font-syne font-bold text-xl md:text-2xl text-ghost mb-4">Our Mission</h3>
            <p className="font-dm text-sm text-ghost/55 leading-relaxed max-w-sm mx-auto">
              To provide exceptional eyewear products and service, creating frames that make
              people feel confident, stylish, and truly themselves.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="pb-20 md:pb-28 relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(155,92,246,0.25), transparent)' }}
        />
        <div className="frame-container pt-4">
          <SectionHeader Icon={Gem} title="Our Values" />
          <SectionRule />

          <div
            ref={valuesRef}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6"
          >
            {VALUES.map(({ Icon, title, body }) => (
              <GlassCard key={title} className="value-card text-center group">
                <div className="mb-5 flex justify-center">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-ember/10 border border-ember/20 group-hover:bg-ember/15 transition-colors duration-300">
                    <Icon size={20} strokeWidth={1.75} className="text-ember" />
                  </div>
                </div>
                <h3 className="font-syne font-semibold text-lg text-ghost mb-3">{title}</h3>
                <p className="font-dm text-sm text-ghost/50 leading-relaxed">{body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ── */}
      <section className="pb-20 md:pb-28">
        <div ref={teamRef} className="frame-container max-w-3xl">
          <SectionHeader Icon={Users} title="Our Team" />
          <SectionRule />
          <p className="font-dm text-sm md:text-base text-ghost/60 leading-relaxed">
            Behind every frame is a passionate team of designers, craftsmen, and innovators
            dedicated to bringing you the best eyewear experience. From our skilled artisans
            who handcraft each piece to our customer support team ready to help you find your
            perfect fit — we&apos;re here for you every step of the way.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 md:pb-32">
        <div ref={ctaRef} className="frame-container">
          <div
            className="relative rounded-2xl border border-white/[0.08] overflow-hidden px-8 py-14 md:py-16 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(155,92,246,0.14) 0%, rgba(8,8,8,0.95) 45%, rgba(255,107,53,0.08) 100%)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(155,92,246,0.2) 0%, transparent 60%)' }}
            />
            <div className="relative">
              <h2
                className="font-syne font-bold text-ghost mb-4"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
              >
                Ready to Find Your{' '}
                <span className="text-gradient">Perfect Frame?</span>
              </h2>
              <p className="font-dm text-sm md:text-base text-ghost/55 max-w-md mx-auto mb-8 leading-relaxed">
                Explore our collection and discover eyewear that&apos;s uniquely you.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 hover:scale-[1.02]"
              >
                Shop Now
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
