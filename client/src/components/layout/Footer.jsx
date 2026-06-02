import { Link }                                  from 'react-router-dom'
import { Users, Camera, X, Video } from 'lucide-react'

const SHOP_LINKS = [
  { label: 'All Frames',    href: '/shop'                          },
  { label: 'Top Sellers',   href: '/shop?category=top-sellers'     },
  { label: 'New Arrivals',  href: '/shop?category=new-arrivals'    },
  { label: 'Round Frames',  href: '/shop?category=round-frames'    },
  { label: 'Square Frames', href: '/shop?category=square-frames'   },
  { label: 'Sunglasses',    href: '/shop?category=sunglasses'      },
]

const COMPANY_LINKS = [
  { label: 'About Us',         href: '/about'   },
  { label: 'Contact',          href: '/contact' },
  { label: 'Terms & Policies', href: '/terms'   },
]

const SOCIALS = [
  { Icon: Users,  label: 'Facebook'  },
  { Icon: Camera, label: 'Instagram' },
  { Icon: X,      label: 'Twitter'   },
  { Icon: Video,  label: 'YouTube'   },
]

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.05]">

      {/* ── Main grid ── */}
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-y-14 gap-x-10 sm:gap-x-12 lg:gap-x-20 xl:gap-x-28">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-logo text-[1.35rem] text-ghost tracking-tight lowercase leading-none hover:bg-gradient-to-r hover:from-violet hover:to-ember hover:bg-clip-text hover:text-transparent transition-all duration-500">
                frames
              </span>
            </Link>
            <p className="font-dm text-sm text-ghost/50 leading-relaxed max-w-[280px] mb-10">
              See the world differently with frames that match your style and personality.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'var(--ember)' }}
                >
                  <Icon size={15} strokeWidth={2} style={{ color: 'var(--void)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="font-syne font-bold text-base mb-6" style={{ color: 'var(--ember)' }}>
              Shop
            </h4>
            <ul className="space-y-3.5">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="font-dm text-sm text-ghost/55 hover:text-ghost transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="font-syne font-bold text-base mb-6" style={{ color: 'var(--ember)' }}>
              Company
            </h4>
            <ul className="space-y-3.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="font-dm text-sm text-ghost/55 hover:text-ghost transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.05]">
        <div className="frame-container py-5 text-center">
          <p className="font-dm text-xs text-ghost/30">
            © {new Date().getFullYear()} Frames. All rights reserved.&nbsp;&nbsp;|&nbsp;&nbsp;Crafted with passion in India.
          </p>
        </div>
      </div>

    </footer>
  )
}
