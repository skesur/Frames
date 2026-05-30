import { useRef, useEffect } from 'react'
import SectionLabel          from '@/components/ui/SectionLabel'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const SECTIONS = [
  {
    title:   '1. Acceptance of Terms',
    content: 'By accessing and using the Frames website and purchasing our products, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.',
  },
  {
    title:   '2. Products and Pricing',
    content: 'All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices at any time. Product images are representational and actual products may vary slightly.',
  },
  {
    title:   '3. Prescription Lenses',
    content: 'Customers are responsible for providing accurate prescription details. Frames verifies prescription data before processing. We are not liable for errors resulting from incorrect prescription input by the customer.',
  },
  {
    title:   '4. Orders and Payments',
    content: 'Orders are confirmed upon successful payment. All payment information is processed securely. We reserve the right to cancel orders in cases of pricing errors or suspected fraud.',
  },
  {
    title:   '5. Shipping and Delivery',
    content: 'Standard delivery takes 5–7 business days. Express delivery takes 2–3 business days. Overnight delivery is available in select cities. Timelines begin from dispatch, not the order date.',
  },
  {
    title:   '6. Returns and Refunds',
    content: 'Prescription lenses are non-returnable once manufactured. Frames without lenses may be returned within 7 days of delivery in unused, original condition. Refunds are processed within 7–10 business days.',
  },
  {
    title:   '7. Privacy Policy',
    content: 'We collect personal data solely for order processing and service improvement. We do not sell or share your data with third parties for marketing. Your prescription data is encrypted and stored securely.',
  },
  {
    title:   '8. Governing Law',
    content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.',
  },
]

export default function Terms() {
  const heroRef    = useRef(null)
  const contentRef = useRef(null)
  const { fade }   = useScrollAnimation()

  useEffect(() => {
    fade(heroRef,    { y: 30, duration: 0.8 })
    fade(contentRef, { y: 30, duration: 0.8, scrollTrigger: { trigger: contentRef.current } })
  }, [])

  return (
    <div className="bg-void text-ghost">

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,107,53,0.05) 0%, transparent 60%)' }} />

        <div ref={heroRef} className="frame-container relative z-10">
          <SectionLabel color="ember" className="mb-7">Legal</SectionLabel>
          <h1
            className="font-syne font-extrabold text-ghost uppercase leading-[1.0] mb-5"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.5rem)', letterSpacing: '-0.03em' }}
          >
            Terms &<br />
            <span className="text-gradient">Conditions.</span>
          </h1>
          <p className="font-mono text-[11px] text-ghost-muted">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section ref={contentRef} className="pb-28 border-t border-white/[0.05]">
        <div className="frame-container pt-14">
          <div className="max-w-[680px] space-y-0">
            {SECTIONS.map(({ title, content }, i) => (
              <div
                key={title}
                className={`py-8 ${i < SECTIONS.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
              >
                <h2 className="font-syne font-semibold text-ghost text-base mb-3">
                  {title}
                </h2>
                <p className="font-dm text-sm text-ghost-muted leading-relaxed">
                  {content}
                </p>
              </div>
            ))}

            <div
              className="mt-10 rounded-lg p-6"
              style={{ background: 'rgba(155,92,246,0.05)', border: '1px solid rgba(155,92,246,0.1)' }}
            >
              <p className="font-dm text-sm text-ghost-muted">
                For questions about these terms, contact us at{' '}
                <span className="text-violet">support@frames.in</span>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}