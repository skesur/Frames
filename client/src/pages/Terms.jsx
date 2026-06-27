// src/pages/Terms.jsx

import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, ShieldCheck, Truck, RotateCcw,
  Award, ArrowRight, CheckCircle, ChevronRight,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

/*
   Shared helper components
   identical to About.jsx and Contact.jsx
*/

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
      style={{
        background:
          'linear-gradient(to right, rgba(255,107,53,0.55), rgba(255,107,53,0.08), transparent)',
      }}
    />
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

/*
   Terms-specific helper components
*/

function H3({ children }) {
  return (
    <h3 className="font-syne font-semibold text-base md:text-lg text-ghost mt-8 mb-3 first:mt-0">
      {children}
    </h3>
  )
}

function H4({ children }) {
  return (
    <h4 className="font-dm font-semibold text-sm text-ghost/80 mt-5 mb-2">
      {children}
    </h4>
  )
}

function P({ children }) {
  return (
    <p className="font-dm text-sm text-ghost/55 leading-relaxed mb-3">
      {children}
    </p>
  )
}

function UL({ items }) {
  return (
    <ul className="flex flex-col gap-2 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="shrink-0 mt-[5px] w-1 h-1 rounded-full"
            style={{ background: 'var(--ember)', opacity: 0.7, minWidth: 4 }}
          />
          <span
            className="font-dm text-sm text-ghost/55 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        </li>
      ))}
    </ul>
  )
}

function OL({ items }) {
  return (
    <ol className="flex flex-col gap-2 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="shrink-0 font-mono text-[10px] text-ember mt-[3px] w-5 leading-none">
            {String(i + 1).padStart(2, '0')}.
          </span>
          <span
            className="font-dm text-sm text-ghost/55 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        </li>
      ))}
    </ol>
  )
}

function ShippingTable() {
  const rows = [
    { method: 'Standard Shipping', time: '5-7 business days', cost: 'Rs. 600' },
    { method: 'Express Shipping', time: '2-3 business days', cost: 'Rs. 1,300' },
    { method: 'Overnight Shipping', time: '1 business day', cost: 'Rs. 2,500' },
    { method: 'Free Shipping', time: '5-7 business days', cost: 'Orders over Rs. 10,000' },
  ]

  return (
    <div className="rounded-lg border border-white/[0.08] overflow-hidden my-5">
      <div className="grid grid-cols-3 bg-white/[0.04] border-b border-white/[0.08] px-5 py-3">
        {['Method', 'Delivery Time', 'Cost'].map((h) => (
          <span key={h} className="font-mono text-[10px] uppercase tracking-widest text-ghost/40">
            {h}
          </span>
        ))}
      </div>

      {rows.map(({ method, time, cost }, i) => (
        <div
          key={method}
          className={cn(
            'grid grid-cols-3 px-5 py-4 transition-colors duration-150 hover:bg-white/[0.015]',
            i < rows.length - 1 && 'border-b border-white/[0.05]'
          )}
        >
          <span className="font-dm text-sm text-ghost/70">{method}</span>
          <span className="font-dm text-sm text-ghost/45">{time}</span>
          <span className="font-mono text-xs text-ember/80">{cost}</span>
        </div>
      ))}
    </div>
  )
}

const SECTIONS_INDEX = [
  { Icon: FileText, label: 'Terms of Service', anchor: 'terms' },
  { Icon: ShieldCheck, label: 'Privacy Policy', anchor: 'privacy' },
  { Icon: Truck, label: 'Shipping Policy', anchor: 'shipping' },
  { Icon: RotateCcw, label: 'Return & Exchange Policy', anchor: 'returns' },
  { Icon: Award, label: 'Warranty Information', anchor: 'warranty' },
]

export default function Terms() {
  const heroRef = useRef(null)
  const indexRef = useRef(null)
  const termsRef = useRef(null)
  const privacyRef = useRef(null)
  const shippingRef = useRef(null)
  const returnsRef = useRef(null)
  const warrantyRef = useRef(null)
  const ctaRef = useRef(null)

  const { reveal, stagger, fade } = useScrollAnimation()

  useEffect(() => {
    reveal(heroRef, { y: 36, duration: 0.85 })
    stagger(indexRef, '.index-card', { stagger: 0.1, y: 28, duration: 0.7 })
    reveal(termsRef, { y: 36, duration: 0.8 })
    reveal(privacyRef, { y: 36, duration: 0.8 })
    reveal(shippingRef, { y: 36, duration: 0.8 })
    reveal(returnsRef, { y: 36, duration: 0.8 })
    reveal(warrantyRef, { y: 36, duration: 0.8 })
    fade(ctaRef, { y: 40, duration: 0.9 })
  }, [fade, reveal, stagger])

  return (
    <div className="bg-void min-h-screen">
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(155,92,246,0.12) 0%, transparent 55%)',
          }}
        />
        <div ref={heroRef} className="frame-container relative text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember/80 mb-3 md:mb-5 block">
            Legal Information & Guidelines
          </span>
          <h1
            className="font-syne font-extrabold text-ghost mb-3 md:mb-5 text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
          >
            Terms & <span className="text-gradient">Policies</span>
          </h1>
          <div
            className="h-[3px] w-28 mx-auto rounded-full"
            style={{ background: 'var(--cyber-gradient)' }}
          />
        </div>
      </section>

      <section className="pb-10 md:pb-20">
        <div
          ref={indexRef}
          className="frame-container max-w-xl mx-auto sm:max-w-none rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1 sm:p-0 sm:border-0 sm:bg-transparent sm:grid sm:grid-cols-5 sm:gap-4 flex flex-col divide-y divide-white/[0.06] sm:divide-y-0"
        >
          {SECTIONS_INDEX.map(({ Icon, label, anchor }) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="index-card group p-4 sm:p-5 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3.5 sm:gap-3 transition-all duration-300 hover:bg-white/[0.03] sm:hover:bg-white/[0.035] sm:rounded-xl sm:border sm:border-white/[0.07] sm:bg-white/[0.02] sm:hover:border-ember/25 no-underline"
            >
              <div className="flex items-center gap-3.5 sm:flex-col sm:gap-3 sm:mx-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 sm:mx-auto sm:mb-1 bg-ember/10 border border-ember/20 group-hover:bg-ember/15 transition-colors duration-300">
                  <Icon size={16} strokeWidth={1.75} className="text-ember" />
                </div>
                <p className="font-dm text-xs text-ghost/75 group-hover:text-ghost/95 transition-colors duration-200">
                  {label}
                </p>
              </div>
              <ChevronRight size={14} className="text-ghost/30 sm:hidden shrink-0" />
            </a>
          ))}
        </div>
      </section>

      <section id="terms" className="pb-12 md:pb-28">
        <div ref={termsRef} className="frame-container max-w-3xl">
          <SectionHeader Icon={FileText} title="Terms of Service" />
          <SectionRule />

          <GlassCard>
            <p className="font-mono text-[10px] text-ghost/30 uppercase tracking-widest mb-6">
              Last Updated: December 28, 2024
            </p>

            <H3>1. Acceptance of Terms</H3>
            <P>
              By accessing and using the Frames website, you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </P>

            <H3>2. Use of Service</H3>
            <P>You agree to use our website only for lawful purposes. You are prohibited from:</P>
            <UL
              items={[
                'Violating or attempting to violate the security of the website',
                'Unauthorized access to data, systems, or accounts',
                'Distributing malicious software or code',
                'Harassing or threatening other users',
                'Attempting to interfere with website functionality',
              ]}
            />

            <H3>3. Product Information</H3>
            <P>
              We strive to provide accurate product descriptions and pricing. However, we reserve
              the right to:
            </P>
            <UL
              items={[
                'Correct any errors or omissions in product information',
                'Update pricing without prior notice',
                'Discontinue products at any time',
                'Limit quantities on any product',
              ]}
            />

            <H3>4. Account Responsibility</H3>
            <P>When creating an account with Frames, you agree to:</P>
            <OL
              items={[
                'Provide accurate and complete information',
                'Maintain the confidentiality of your password',
                'Notify us immediately of any unauthorized access',
                'Accept responsibility for all activities under your account',
                'Update your information to keep it current',
              ]}
            />

            <H3>5. Intellectual Property</H3>
            <P>All content on this website is protected by copyright laws. This includes:</P>
            <UL
              items={[
                'Text, graphics, and logos',
                'Product images and photographs',
                'Software and code',
                'Design elements and layout',
                'Trademarks and brand materials',
              ]}
            />
            <P>
              You may not reproduce, distribute, or create derivative works without our express
              written permission.
            </P>

            <H3>6. Limitation of Liability</H3>
            <P>
              Frames shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of our services.
            </P>
          </GlassCard>
        </div>
      </section>

      <section id="privacy" className="pb-12 md:pb-28 relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(155,92,246,0.2), transparent)',
          }}
        />
        <div ref={privacyRef} className="frame-container max-w-3xl pt-4">
          <SectionHeader Icon={ShieldCheck} title="Privacy Policy" />
          <SectionRule />

          <GlassCard>
            <p className="font-mono text-[10px] text-ghost/30 uppercase tracking-widest mb-6">
              Last Updated: December 28, 2024
            </p>

            <H3>Information We Collect</H3>
            <P>We collect several types of information to provide and improve our services:</P>

            <H4>Personal Information:</H4>
            <UL
              items={[
                'Name and contact information',
                'Email address and phone number',
                'Shipping and billing addresses',
                'Payment information (processed securely)',
                'Order history and preferences',
              ]}
            />

            <H4>Automatically Collected Information:</H4>
            <UL
              items={[
                'IP address and device information',
                'Browser type and version',
                'Pages visited and time spent',
                'Referring website information',
                'Cookie data and preferences',
              ]}
            />

            <H3>How We Use Your Information</H3>
            <P>We use collected information for the following purposes:</P>
            <OL
              items={[
                'Process and fulfill your orders',
                'Communicate about your purchases and account',
                'Send marketing communications (with your consent)',
                'Improve our website and services',
                'Prevent fraud and enhance security',
                'Comply with legal obligations',
                'Personalize your shopping experience',
              ]}
            />

            <H3>Information Sharing</H3>
            <P>We do not sell or rent your personal information. We may share data with:</P>
            <UL
              items={[
                '<strong class="text-ghost/80">Service Providers:</strong> Payment processors, shipping companies, email services',
                '<strong class="text-ghost/80">Legal Requirements:</strong> When required by law or to protect our rights',
                '<strong class="text-ghost/80">Business Transfers:</strong> In case of merger, acquisition, or sale',
              ]}
            />

            <H3>Data Security</H3>
            <P>We implement security measures including:</P>
            <UL
              items={[
                'SSL encryption for data transmission',
                'Secure payment processing systems',
                'Regular security audits and updates',
                'Limited employee access to personal data',
                'Password protection and authentication',
              ]}
            />

            <H3>Your Rights</H3>
            <P>You have the right to:</P>
            <UL
              items={[
                'Access your personal information',
                'Correct inaccurate data',
                'Request deletion of your data',
                'Opt out of marketing communications',
                'Download your data in portable format',
                'Lodge a complaint with authorities',
              ]}
            />
          </GlassCard>
        </div>
      </section>

      <section id="shipping" className="pb-12 md:pb-28">
        <div ref={shippingRef} className="frame-container max-w-3xl">
          <SectionHeader Icon={Truck} title="Shipping Policy" />
          <SectionRule />

          <GlassCard>
            <H3>Processing Time</H3>
            <P>Order processing times vary by product type:</P>
            <UL
              items={[
                '<strong class="text-ghost/80">Standard Frames:</strong> 1-2 business days',
                '<strong class="text-ghost/80">Prescription Orders:</strong> 3-5 business days',
                '<strong class="text-ghost/80">Custom Orders:</strong> 5-7 business days',
                '<strong class="text-ghost/80">Special Orders:</strong> 7-14 business days',
              ]}
            />
            <P>
              You will receive a confirmation email with tracking information once your order ships.
            </P>

            <H3>Shipping Options & Rates</H3>
            <ShippingTable />

            <H3>International Shipping</H3>
            <P>We ship to select international destinations:</P>
            <UL
              items={[
                'Canada: 7-10 business days',
                'United Kingdom: 10-14 business days',
                'European Union: 10-14 business days',
                'Australia: 12-18 business days',
                'Rest of World: 15-21 business days',
              ]}
            />
            <P>
              <strong className="text-ghost/80">Note:</strong> Customers are responsible for any
              customs duties, import taxes, or additional fees charged by their country.
            </P>

            <H3>Order Tracking</H3>
            <P>Track your order by:</P>
            <OL
              items={[
                'Logging into your Frames account',
                'Checking your order confirmation email',
                'Using the tracking number provided',
                'Contacting customer support for assistance',
              ]}
            />
          </GlassCard>
        </div>
      </section>

      <section id="returns" className="pb-12 md:pb-28 relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(255,107,53,0.2), transparent)',
          }}
        />
        <div ref={returnsRef} className="frame-container max-w-3xl pt-4">
          <SectionHeader Icon={RotateCcw} title="Return & Exchange Policy" />
          <SectionRule />

          <GlassCard>
            <H3>30-Day Return Window</H3>
            <P>
              You may return any unused frames in their original condition within 30 days of
              delivery for a full refund.
            </P>

            <H3>Eligible Items for Return</H3>
            <UL
              items={[
                'Non-prescription frames in original packaging',
                'Unopened accessories and cases',
                'Products with manufacturing defects',
                'Damaged items received',
                'Incorrect items shipped',
              ]}
            />

            <H3>Non-Returnable Items</H3>
            <UL
              items={[
                'Prescription lenses (unless defective)',
                'Custom-made or personalized items',
                'Gift cards and promotional items',
                'Final sale or clearance items',
                'Items without original packaging',
              ]}
            />

            <H3>How to Return</H3>
            <P>Follow these steps to return your order:</P>
            <OL
              items={[
                'Log into your account at frames.com',
                'Navigate to "Order History" and select your order',
                'Click "Request Return" and select items to return',
                'Choose your reason for return',
                'Print the prepaid return label we email you',
                'Package items securely in their original packaging',
                'Attach the return label to your package',
                'Drop off at any authorized shipping location',
              ]}
            />

            <H3>Refund Process</H3>
            <P>Once we receive your return:</P>
            <OL
              items={[
                'Inspection completed within 2 business days',
                'Refund processed within 5-7 business days',
                'Refund issued to original payment method',
                'Email confirmation sent when refund is processed',
              ]}
            />
            <P>
              <strong className="text-ghost/80">Note:</strong> It may take an additional 3-5
              business days for the refund to appear in your account depending on your bank.
            </P>

            <H3>Exchanges</H3>
            <P>We offer free exchanges for:</P>
            <UL
              items={[
                'Different frame sizes',
                'Different frame colours',
                'Different frame styles',
                'Defective products',
              ]}
            />
            <P>
              Contact our customer service team to arrange an exchange. We'll ship your new item as
              soon as we receive your return.
            </P>

            <H3>Damaged or Defective Items</H3>
            <P>If you receive a damaged or defective item:</P>
            <OL
              items={[
                'Contact us within 7 days of delivery',
                'Provide photos of the damage or defect',
                "We'll arrange for a replacement or refund immediately",
                'No need to return the defective item in most cases',
              ]}
            />
          </GlassCard>
        </div>
      </section>

      <section id="warranty" className="pb-12 md:pb-28">
        <div ref={warrantyRef} className="frame-container max-w-3xl">
          <SectionHeader Icon={Award} title="Warranty Information" />
          <SectionRule />

          <GlassCard>
            <H3>1-Year Limited Warranty</H3>
            <P>
              All Frames products come with a 1-year limited warranty covering manufacturing
              defects. This warranty begins from the date of purchase and applies to the original
              purchaser only.
            </P>

            <H3>What's Covered</H3>
            <P>Our warranty covers defects in materials and workmanship, including:</P>
            <UL
              items={[
                'Frame breakage due to manufacturing defects',
                'Lens coating defects (peeling, bubbling, cracking)',
                'Hinge failures or hardware issues',
                'Defective prescription lenses',
                'Bridge or temple separation',
                'Paint or finish defects',
              ]}
            />

            <H3>What's Not Covered</H3>
            <P>The warranty does not cover:</P>
            <UL
              items={[
                'Normal wear and tear',
                'Accidental damage or breakage',
                'Lost or stolen items',
                'Scratches from improper cleaning or use',
                'Damage from unauthorised repairs or modifications',
                'Damage from extreme temperatures or chemicals',
                'Lens prescription changes',
                "Cosmetic damage that doesn't affect functionality",
              ]}
            />

            <H3>Making a Warranty Claim</H3>
            <P>To file a warranty claim:</P>
            <OL
              items={[
                'Contact our customer service team via email or phone',
                'Provide your order number and purchase date',
                'Submit clear photos showing the defect',
                'Describe the issue in detail',
                'Our team will review within 1-2 business days',
                "If approved, we'll provide a prepaid shipping label",
                'Send the item to our warranty centre',
                'Receive a replacement or repair within 7-10 business days',
              ]}
            />

            <H3>Extended Warranty Options</H3>
            <P>Protect your frames beyond the standard warranty:</P>
            <UL
              items={[
                '<strong class="text-ghost/80">2-Year Extended Warranty - Rs. 3,000</strong> - Covers all manufacturing defects',
                '<strong class="text-ghost/80">3-Year Complete Protection - Rs. 5,000</strong> - Includes accidental damage coverage',
                '<strong class="text-ghost/80">Lifetime Protection Plan - Rs. 9,000</strong> - Full coverage for the life of your frames',
              ]}
            />
            <P>Extended warranties can be purchased within 30 days of your original order.</P>

            <H3>Care Instructions</H3>
            <P>To maintain your warranty coverage, please follow these care guidelines:</P>
            <OL
              items={[
                'Clean lenses with the provided microfibre cloth only',
                'Store frames in their protective case when not in use',
                'Avoid exposure to extreme heat or cold',
                'Do not use harsh chemicals or abrasive cleaners',
                'Have frames adjusted by professionals only',
                'Keep frames away from water and moisture when possible',
              ]}
            />
          </GlassCard>
        </div>
      </section>

      <section className="pb-16 md:pb-32">
        <div ref={ctaRef} className="frame-container">
          <div
            className="relative rounded-2xl border border-white/[0.08] overflow-hidden px-8 py-14 md:py-16 text-center"
            style={{
              background:
                'linear-gradient(135deg, rgba(155,92,246,0.14) 0%, rgba(8,8,8,0.95) 45%, rgba(255,107,53,0.08) 100%)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 50%, rgba(255,107,53,0.18) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 bg-ember/10 border border-ember/25">
                <CheckCircle size={24} strokeWidth={1.75} className="text-ember" />
              </div>

              <h2
                className="font-syne font-bold text-ghost mb-4"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
              >
                Have Questions About{' '}
                <span className="text-gradient">Our Policies?</span>
              </h2>
              <p className="font-dm text-sm md:text-base text-ghost/55 max-w-md mx-auto mb-8 leading-relaxed">
                Our customer service team is here to help. We typically respond within 24 hours on
                business days.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-ember hover:bg-ember-dark text-void font-dm font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 hover:scale-[1.02]"
              >
                Contact Support
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}