import { Link }                              from 'react-router-dom'
import { Camera, X, Video }                  from 'lucide-react'

const QUICK_LINKS  = [
  { label: 'Home',    href: '/'        },
  { label: 'Shop',    href: '/shop'    },
  { label: 'About',   href: '/about'   },
  { label: 'Contact', href: '/contact' },
]

const CATEGORIES = [
  { label: 'Top Sellers',   href: '/shop?category=top-sellers'   },
  { label: 'New Arrivals',  href: '/shop?category=new-arrivals'  },
  { label: 'Round Frames',  href: '/shop?category=round-frames'  },
  { label: 'Square Frames', href: '/shop?category=square-frames' },
  { label: 'Sunglasses',    href: '/shop?category=sunglasses'    },
]

const SUPPORT = [
  { label: 'Terms & Conditions', href: '/terms'    },
  { label: 'Privacy Policy',     href: '/terms#privacy' },
  { label: 'Contact Us',         href: '/contact'  },
  { label: 'Track Order',        href: '/profile'  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-void mt-auto">
      <div className="container-frame py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/">
              <img
                src="/assets/image/frames_white_logo.png"
                alt="Frames"
                className="h-8 w-auto mb-4"
              />
            </Link>
            <p className="font-dm text-sm text-ghost-muted leading-relaxed max-w-50">
              Premium eyewear where vision meets style. Crafted for those who see differently.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="text-ghost-muted hover:text-violet transition-colors">
                <Camera size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-ghost-muted hover:text-violet transition-colors">
                <X size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="text-ghost-muted hover:text-violet transition-colors">
                <Video size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs text-ghost-muted uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="font-dm text-sm text-ghost-muted hover:text-ghost transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-mono text-xs text-ghost-muted uppercase tracking-widest mb-5">
              Categories
            </h4>
            <ul className="space-y-3">
              {CATEGORIES.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="font-dm text-sm text-ghost-muted hover:text-ghost transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-mono text-xs text-ghost-muted uppercase tracking-widest mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {SUPPORT.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="font-dm text-sm text-ghost-muted hover:text-ghost transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-ghost-muted">
            © {new Date().getFullYear()} Frames. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ghost-muted">
            Designed with obsession. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  )
}