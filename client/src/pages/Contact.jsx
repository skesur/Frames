import { useRef, useEffect, useState } from 'react'
import {
  MapPin, Phone, Mail, MessageSquare, HelpCircle,
  RotateCcw, Truck, Glasses, ShieldCheck, ChevronDown,
  Send, Users, Camera, X, Video, Linkedin,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'
import api from '@/lib/axios'

const CONTACT_CARDS = [
  {
    Icon: MapPin,
    title: 'Visit Us',
    lines: ['Chankyapuri, Ghatlodia', 'Ahmedabad, 380061'],
  },
  {
    Icon: Phone,
    title: 'Call Us',
    lines: ['9898989898', 'Mon–Fri: 9am – 6pm', 'Sat: 10am – 4pm'],
  },
  {
    Icon: Mail,
    title: 'Email Us',
    lines: ['support@frames.com', 'info@frames.com', 'Response within 24 hrs'],
  },
]

const SUBJECTS = [
  'General Inquiry',
  'Order Support',
  'Product Question',
  'Returns & Exchanges',
  'Other',
]

const FAQS = [
  {
    Icon: RotateCcw,
    q: 'What is your return policy?',
    a: 'We offer a 30-day hassle-free return policy on all unworn frames in original condition. Simply contact our support team to initiate a return and receive a prepaid shipping label.',
  },
  {
    Icon: Truck,
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5–7 business days. Express shipping (2–3 business days) is available at checkout. All orders include tracking so you can follow your frames every step of the way.',
  },
  {
    Icon: Glasses,
    q: 'Do you offer prescription lenses?',
    a: 'Yes. We partner with certified optical labs to fill single-vision, bifocal, and progressive prescriptions. Upload your prescription during checkout or email it to support@frames.com.',
  },
  {
    Icon: ShieldCheck,
    q: 'Do you offer a warranty?',
    a: 'Every frame comes with a 1-year manufacturer warranty covering defects in materials and workmanship. Accidental damage protection is available as an add-on at purchase.',
  },
]

const SOCIALS = [
  { Icon: Users,   label: 'Facebook'  },
  { Icon: Camera,  label: 'Instagram' },
  { Icon: X,       label: 'Twitter'   },
  { Icon: Video,   label: 'YouTube'   },
  { Icon: Linkedin, label: 'LinkedIn' },
]

function SectionHeader({ Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
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

function FaqItem({ item, open, onToggle }) {
  const { Icon, q, a } = item

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden transition-colors duration-200 hover:border-white/[0.12]">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200',
          open ? 'bg-violet text-void' : 'bg-white/[0.02] text-ghost'
        )}
      >
        <Icon
          size={18}
          strokeWidth={1.75}
          className={cn('shrink-0', open ? 'text-void' : 'text-ember')}
        />
        <span className="font-dm text-sm md:text-base font-medium flex-1">{q}</span>
        <ChevronDown
          size={18}
          className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pt-1 font-dm text-sm text-ghost/55 leading-relaxed border-t border-white/[0.05] bg-white/[0.015]">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  const heroRef   = useRef(null)
  const cardsRef  = useRef(null)
  const formRef   = useRef(null)
  const faqRef    = useRef(null)
  const socialRef = useRef(null)
  const { reveal, stagger, fade } = useScrollAnimation()

  const [openFaq, setOpenFaq] = useState(0)
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  })

  useEffect(() => {
    reveal(heroRef,   { y: 36, duration: 0.85 })
    stagger(cardsRef, '.contact-card', { stagger: 0.12, y: 32, duration: 0.75 })
    reveal(formRef,   { y: 40, duration: 0.8 })
    stagger(faqRef,   '.faq-item', { stagger: 0.08, y: 24, duration: 0.65 })
    fade(socialRef,   { y: 36, duration: 0.85 })
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setSending(true)
      await api.post('/contact', form)
      setSent(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-void min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 md:pt-32 pb-14 md:pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(155,92,246,0.12) 0%, transparent 55%)' }}
        />
        <div ref={heroRef} className="frame-container relative text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember/80 mb-5 block">
            Get In Touch
          </span>
          <h1
            className="font-syne font-extrabold text-ghost mb-5"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', letterSpacing: '-0.03em' }}
          >
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="font-dm text-sm md:text-base text-ghost/50 max-w-md mx-auto leading-relaxed">
            Have a question or need help finding your perfect frame? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Info cards ── */}
      <section className="pb-16 md:pb-20">
        <div
          ref={cardsRef}
          className="frame-container grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {CONTACT_CARDS.map(({ Icon, title, lines }) => (
            <div
              key={title}
              className="contact-card rounded-xl border border-white/[0.07] bg-white/[0.02] p-8 text-center transition-all duration-300 hover:border-violet/25 hover:bg-white/[0.035]"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--cyber-gradient)' }}
              >
                <Icon size={20} strokeWidth={1.75} className="text-void" />
              </div>
              <h3 className="font-syne font-bold text-lg text-ghost mb-4">{title}</h3>
              <div className="flex flex-col gap-1.5">
                {lines.map((line) => (
                  <p key={line} className="font-dm text-sm text-ghost/50">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className="pb-16 md:pb-20">
        <div ref={formRef} className="frame-container">
          <SectionHeader Icon={MessageSquare} title="Send Us a Message" />
          <SectionRule />

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-10">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full bg-violet/15 border border-violet/30 flex items-center justify-center mx-auto mb-5">
                  <Send size={22} className="text-violet" />
                </div>
                <h3 className="font-syne font-bold text-xl text-ghost mb-2">Message Sent!</h3>
                <p className="font-dm text-sm text-ghost/50">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-dm text-sm text-ghost/70">
                      Full Name <span className="text-ember">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name..."
                      className="field"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-dm text-sm text-ghost/70">
                      Email Address <span className="text-ember">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-dm text-sm text-ghost/70">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className="field"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="font-dm text-sm text-ghost/70">
                      Subject <span className="text-ember">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="field appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a subject</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-dm text-sm text-ghost/70">
                    Message <span className="text-ember">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="field resize-none"
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 font-dm text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-ember hover:bg-ember-dark disabled:opacity-50 text-void font-dm font-semibold text-sm py-3.5 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pb-16 md:pb-20">
        <div ref={faqRef} className="frame-container max-w-3xl">
          <SectionHeader Icon={HelpCircle} title="Frequently Asked Questions" />
          <SectionRule />

          <div className="flex flex-col gap-3">
            {FAQS.map((item, i) => (
              <div key={item.q} className="faq-item">
                <FaqItem
                  item={item}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Follow us ── */}
      <section className="pb-24 md:pb-32">
        <div ref={socialRef} className="frame-container">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-8 py-12 md:py-14 text-center">
            <h2 className="font-syne font-bold text-2xl md:text-3xl text-ghost mb-3">
              Follow <span className="text-gradient">Us</span>
            </h2>
            <p className="font-dm text-sm text-ghost/50 mb-8 max-w-sm mx-auto leading-relaxed">
              Stay connected for the latest styles, drops, and exclusive offers.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-11 h-11 rounded-full border border-ember/40 flex items-center justify-center text-ember hover:bg-ember hover:text-void transition-all duration-200 hover:scale-110"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}


