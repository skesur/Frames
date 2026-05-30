import { useState, useEffect, useRef } from 'react'
import { Link, useLocation }           from 'react-router-dom'
import { ShoppingBag, User, Menu, X }  from 'lucide-react'
import gsap                            from 'gsap'
import { useCartStore }                from '../../store/cartStore'
import { useAuthStore }                from '../../store/authStore'
import { cn }                          from '../../lib/utils'

const NAV_LINKS = [
  { label: 'Home',    href: '/'       },
  { label: 'Shop',    href: '/shop'   },
  { label: 'About',   href: '/about'  },
  { label: 'Contact', href: '/contact'},
  { label: 'Terms',   href: '/terms'  },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const navRef     = useRef(null)
  const linksRef   = useRef(null)
  const location   = useLocation()
  const items      = useCartStore((s) => s.items)
  const { isAuthenticated } = useAuthStore()

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP entrance
  useEffect(() => {
    if (!navRef.current) return
    const links = navRef.current.querySelectorAll('a, button')
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', immediateRender: false } })
    tl.from(navRef.current, { y: -20, duration: 0.55 })
    if (links.length) {
      tl.from(links, { y: -10, duration: 0.4, stagger: 0.04 }, '-=0.3')
    }
    return () => { tl.kill() }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-500',
        scrolled
          ? 'glass border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-frame flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <img
            src="/assets/image/frames_white_logo.png"
            alt="Frames"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <ul
          ref={linksRef}
          className="hidden md:flex items-center gap-8 list-none"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                to={href}
                className={cn(
                  'font-dm text-sm tracking-wide transition-colors duration-200 relative group',
                  isActive(href)
                    ? 'text-violet'
                    : 'text-ghost-muted hover:text-ghost'
                )}
              >
                {label}
                {/* Underline accent */}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-px bg-violet transition-all duration-300',
                    isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right icons */}
        <div ref={linksRef} className="hidden md:flex items-center gap-5">
          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative text-ghost-muted hover:text-ghost transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-violet text-void text-[10px] font-mono font-bold flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* User icon */}
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className="text-ghost-muted hover:text-ghost transition-colors"
            aria-label={isAuthenticated ? 'Profile' : 'Login'}
          >
            <User size={20} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-ghost-muted hover:text-ghost transition-colors z-10"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-out',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="glass border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'font-dm text-base transition-colors',
                isActive(href) ? 'text-violet' : 'text-ghost-muted hover:text-ghost'
              )}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-5 pt-2 border-t border-white/5">
            <Link to="/cart" className="flex items-center gap-2 text-ghost-muted hover:text-ghost">
              <ShoppingBag size={18} />
              <span className="font-dm text-sm">Cart {cartCount > 0 && `(${cartCount})`}</span>
            </Link>
            <Link to={isAuthenticated ? '/profile' : '/login'} className="flex items-center gap-2 text-ghost-muted hover:text-ghost">
              <User size={18} />
              <span className="font-dm text-sm">{isAuthenticated ? 'Profile' : 'Login'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}