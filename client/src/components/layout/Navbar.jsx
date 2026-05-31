import { useState, useEffect } from 'react'
import { Link, useLocation }   from 'react-router-dom'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore }          from '@/store/cartStore'
import { useAuthStore }          from '@/store/authStore'
import { cn }                    from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home',    href: '/'        },
  { label: 'Shop',    href: '/shop'    },
  { label: 'About',   href: '/about'   },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms',   href: '/terms'   },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const items = useCartStore((s) => s.items)
  const { isAuthenticated, logout } = useAuthStore()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808] border-b border-white/[0.05]">
      <div className="frame-container flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.1 flex-shrink-0 group">
          <img
            src="/assets/image/favicon.svg"
            alt=""
            className="h-10 w-10 object-contain"
          />
          <span className="font-logo text-[1.35rem] text-ghost tracking-tight lowercase leading-none hover:bg-gradient-to-r hover:from-violet hover:to-ember
         hover:bg-clip-text hover:text-transparent transition-all duration-500">
            frames
          </span>
        </Link>

        {/* Desktop — nav links + actions */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8 list-none">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  className={cn(
                    'relative pb-1 font-dm text-[15px] transition-colors duration-200',
                    isActive(href)
                      ? 'text-violet border-b-2 border-orange-500' 
                      : 'text-ghost/70 hover:text-orange-500'
                  )}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-violet" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              aria-label="Profile"
              className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90 hover:text-orange-500 hover:border-violet/45 transition-all duration-200"
            >
              <User size={17} strokeWidth={1.5} />
            </Link>

            <Link
              to="/cart"
              aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : 'Cart'}
              className="relative flex items-center justify-center w-8 h-8 bg-violet hover:bg-ember rounded-full transition-colors duration-200"
            >
              <ShoppingBag size={17} strokeWidth={2} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-void font-mono text-[10px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-ember hover:bg-transparent hover:text-ember hover:border-2 hover:border-violet text-void font-dm font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 w-15 h-8 flex items-center justify-center"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-ember hover:bg-transparent hover:text-ember hover:border-2 hover:border-violet text-void font-dm font-semibold w-15 h-8 text-sm px-10 py-2.5 rounded-full transition-colors duration-200 flex items-center justify-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-ghost/70 hover:text-ghost"
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-t border-white/[0.05]',
          menuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 border-t-0'
        )}
      >
        <div className="frame-container py-5 flex flex-col items-center gap-2">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'py-2.5 px-1 font-dm text-sm transition-colors',
                isActive(href) ? 'text-violet' : 'text-ghost/70 hover:text-orange-500'
              )}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col items-center gap-3 pt-4 mt-2 border-t border-white/[0.06]">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90"
            >
              <User size={17} strokeWidth={1.5} />
            </Link>
            <Link
              to="/cart"
              aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : 'Cart'}
              className="relative flex items-center justify-center w-8 h-8 bg-violet rounded-full transition-colors duration-200"
            >
              <ShoppingBag size={17} strokeWidth={2} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-void font-mono text-[10px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-ember text-void text-sm font-dm font-semibold px-5 py-2.5 rounded-full w-15 h-8 flex items-center justify-center"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-ember text-void text-sm font-dm font-semibold px-5 py-2.5 rounded-full w-15 h-8 flex items-center justify-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
