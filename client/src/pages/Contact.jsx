import { useState, useRef, useEffect } from 'react'
import SectionLabel                    from '@/components/ui/SectionLabel'
import Button                          from '@/components/ui/Button'
import { MapPin, Mail, Clock, CheckCircle } from 'lucide-react'
import { useScrollAnimation }          from '@/hooks/useScrollAnimation'

const INFO = [
  { Icon: Mail,   label: 'Email',  value: 'support@frames.in'         },
  { Icon: MapPin, label: 'Studio', value: 'Mumbai, Maharashtra, India' },
  { Icon: Clock,  label: 'Hours',  value: 'Mon–Sat, 10am–7pm IST'     },
]

export default function Contact() {
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const heroRef  = useRef(null)
  const bodyRef  = useRef(null)
  const { fade, reveal } = useScrollAnimation()

  useEffect(() => {
    fade(heroRef,  { y: 40, duration: 0.9 })
    reveal(bodyRef, { y: 30, duration: 0.8 })
  }, [])

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-void text-ghost">

      {/* ── Hero ── */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,245,196,0.05) 0%, transparent 60%)' }} />

        <div ref={heroRef} className="frame-container relative z-10">
          <SectionLabel color="teal" className="mb-7">Get In Touch</SectionLabel>
          <h1
            className="font-syne font-extrabold text-ghost uppercase leading-[1.0] mb-6"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', letterSpacing: '-0.03em' }}
          >
            Talk to<br />
            <span className="text-gradient">Frames.</span>
          </h1>
          <p className="font-dm text-ghost-muted text-base max-w-md leading-relaxed">
            Questions about your order, prescription help, or just want to say hello — we're here.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section ref={bodyRef} className="pb-28 border-t border-white/[0.05]">
        <div className="frame-container pt-16">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16">

            {/* Info column */}
            <div className="space-y-10">
              {INFO.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.15)' }}
                  >
                    <Icon size={16} className="text-teal" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest mb-1">{label}</p>
                    <p className="font-dm text-sm text-ghost">{value}</p>
                  </div>
                </div>
              ))}

              <div
                className="rounded-lg p-5 mt-8"
                style={{ background: 'rgba(155,92,246,0.05)', border: '1px solid rgba(155,92,246,0.12)' }}
              >
                <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-2">Response Time</p>
                <p className="font-dm text-sm text-ghost-muted">We reply within 24 hours on business days.</p>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div
                  className="rounded-lg p-12 flex flex-col items-center justify-center text-center"
                  style={{ background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.12)' }}
                >
                  <CheckCircle size={40} className="text-teal mb-4" strokeWidth={1.5} />
                  <h3 className="font-syne font-bold text-xl text-ghost mb-2">Message Sent</h3>
                  <p className="font-dm text-ghost-muted text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest block mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="frame-input"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="frame-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest block mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="frame-input"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest block mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                      className="frame-input resize-none"
                    />
                  </div>

                  <div className="pt-1">
                    <Button type="submit" size="lg" variant="primary">
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}