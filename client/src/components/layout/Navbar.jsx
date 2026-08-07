import { useState, useEffect, useRef } from 'react'
import { Link, useLocation }   from 'react-router-dom'
import { ShoppingBag, User, Heart, Menu, X, Bell } from 'lucide-react'
import { useCartStore }          from '@/store/cartStore'
import { useWishlistStore }      from '@/store/wishlistStore'
import { useAuthStore }          from '@/store/authStore'
import { useNotificationStore }  from '@/store/notificationStore'
import { useUIStore }            from '@/store/uiStore'
import { cn }                    from '@/lib/utils'
import gsap                      from 'gsap'

const NAV_LINKS = [
  { label: 'Home',    href: '/'        },
  { label: 'Shop',    href: '/shop'    },
  { label: 'About',   href: '/about'   },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms',   href: '/terms'   },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loadingActive, setLoadingActive] = useState(true)
  const location = useLocation()

  const items = useCartStore((s) => s.items)
  const wishlistItems = useWishlistStore((s) => s.items)
  const { isAuthenticated, logout } = useAuthStore()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const wishlistCount = wishlistItems.length

  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
  const newToast = useNotificationStore((s) => s.newToast)
  const clearToast = useNotificationStore((s) => s.clearToast)
  const resetNotifications = useNotificationStore((s) => s.reset)

  // Fetch notifications with polling and handle reset on logout
  useEffect(() => {
    if (!isAuthenticated) {
      resetNotifications()
      return
    }

    // Initial fetch (silent to prevent flashing)
    fetchNotifications(true)

    // Poll every 3 seconds for new alerts
    const interval = setInterval(() => {
      fetchNotifications(true)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAuthenticated, fetchNotifications, resetNotifications])

  // Auto-dismiss the popup toast after 6 seconds
  useEffect(() => {
    if (!newToast) return
    const timer = setTimeout(() => {
      clearToast()
    }, 6000)
    return () => clearTimeout(timer)
  }, [newToast, clearToast])

  const navbarLogoRef = useRef(null)
  const logoTextRef = useRef(null)
  const loaderOverlayRef = useRef(null)
  const loaderLogoRef = useRef(null)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    // 1. Disable scrolling
    if (window.lenis) {
      window.lenis.stop()
    }
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const timer = setTimeout(() => {
        if (!navbarLogoRef.current || !loaderLogoRef.current) {
          setLoadingActive(false)
          useUIStore.getState().setIntroAnimationDone(true)
          document.body.style.overflow = ''
          if (window.lenis) window.lenis.start()
          return
        }

        try {
          // 2. Measure coordinates
          const targetRect = navbarLogoRef.current.getBoundingClientRect()
          const loaderRect = loaderLogoRef.current.getBoundingClientRect()

          // Calculate scale with dynamic isFinite check to avoid NaN/Infinity divisions
          const lWidth = loaderRect.width || 128
          const tWidth = targetRect.width || 40
          const scale = isFinite(tWidth / lWidth) && (tWidth / lWidth) > 0 ? (tWidth / lWidth) : 0.25

          const deltaX = targetRect.left - loaderRect.left
          const deltaY = targetRect.top - loaderRect.top

          // Create timeline
          const tl = gsap.timeline({
            onComplete: () => {
              // Re-enable scrolling
              if (window.lenis) {
                window.lenis.start()
              }
              document.body.style.overflow = ''
              setLoadingActive(false)
              useUIStore.getState().setIntroAnimationDone(true)
            }
          })

          // Step 1: scale-up the loader logo in the center
          tl.fromTo(loaderLogoRef.current,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }
          )

          // Wait a short duration
          tl.to({}, { duration: 0.4 })

          // Step 2: Animate logo to top-left target + fade out background overlay
          tl.to(loaderLogoRef.current, {
            x: deltaX,
            y: deltaY,
            scale: scale,
            duration: 1.1,
            ease: 'power4.inOut'
          })

          tl.to(loaderOverlayRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, '-=0.6')

          // Step 3: Seamless handover (show navbar logo, hide loader logo)
          tl.set(navbarLogoRef.current, { opacity: 1 })
          tl.set(loaderLogoRef.current, { opacity: 0 })

          // Step 4: Sweep reveal of the brand text "frames" from left to right
          tl.fromTo(logoTextRef.current,
            { 
              opacity: 0, 
              x: -20,
              clipPath: 'inset(0 100% 0 0)'
            },
            { 
              opacity: 1, 
              x: 0, 
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.6, 
              ease: 'power2.out' 
            }
          )

          // Step 5: Stagger the rest of the navbar elements sequentially from left to right
          if (window.innerWidth >= 768) {
            const links = gsap.utils.toArray('.desktop-nav-link')
            const actions = gsap.utils.toArray('.desktop-nav-action')
            const staggerItems = [...links, ...actions]

            tl.fromTo(staggerItems,
              { opacity: 0, x: -20 },
              { 
                opacity: 1, 
                x: 0, 
                duration: 0.3, 
                stagger: 0.3, 
                ease: 'power2.out' 
              }
            )
          } else {
            tl.fromTo('.mobile-nav-toggle',
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
            )
          }
        } catch (e) {
          console.error("Preloader animation failed safely:", e)
          setLoadingActive(false)
          useUIStore.getState().setIntroAnimationDone(true)
          document.body.style.overflow = ''
          if (window.lenis) window.lenis.start()
        }
      }, 400) // small delay to let mount settle

      return () => clearTimeout(timer)
    })

    return () => {
      ctx.revert()
      if (window.lenis) {
        window.lenis.start()
      }
      document.body.style.overflow = ''
    }
  }, [])

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/60 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="frame-container flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-0.1 flex-shrink-0 group">
            <img
              ref={navbarLogoRef}
              src="/assets/image/favicon.svg"
              alt=""
              className="h-10 w-10 object-contain"
              style={{ opacity: 0 }}
            />
            <span
              ref={logoTextRef}
              className="font-logo text-[1.35rem] text-ghost tracking-tight lowercase leading-none hover:bg-gradient-to-r hover:from-violet hover:to-ember hover:bg-clip-text hover:text-transparent transition-colors duration-500"
              style={{ display: 'inline-block', opacity: 0 }}
            >
              frames
            </span>
          </Link>

          {/* Desktop — nav links + actions */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8 list-none">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href} className="desktop-nav-link" style={{ opacity: 0 }}>
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
              {isAuthenticated && (
                <Link
                  to="/notifications"
                  aria-label={unreadCount > 0 ? `Notifications (${unreadCount} items)` : 'Notifications'}
                  className="desktop-nav-action relative w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90 hover:text-orange-500 hover:border-violet/45 transition-colors duration-200"
                  style={{ opacity: 0 }}
                >
                  <Bell size={16} strokeWidth={1.75} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-void font-mono text-[10px] font-bold flex items-center justify-center leading-none">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              <Link
                to="/wishlist"
                aria-label={wishlistCount > 0 ? `Wishlist (${wishlistCount} items)` : 'Wishlist'}
                className="desktop-nav-action relative w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90 hover:text-ember hover:border-ember/45 transition-colors duration-200"
                style={{ opacity: 0 }}
              >
                <Heart size={16} strokeWidth={1.75} className={cn(wishlistCount > 0 && 'text-ember fill-ember/20')} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-void font-mono text-[10px] font-bold flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                aria-label="Profile"
                className="desktop-nav-action w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90 hover:text-orange-500 hover:border-violet/45 transition-colors duration-200"
                style={{ opacity: 0 }}
              >
                <User size={17} strokeWidth={1.5} />
              </Link>

              <Link
                to="/cart"
                aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : 'Cart'}
                className="desktop-nav-action relative flex items-center justify-center w-8 h-8 bg-violet hover:bg-ember rounded-full transition-colors duration-200"
                style={{ opacity: 0 }}
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
                  className="desktop-nav-action bg-ember hover:bg-transparent hover:text-ember hover:border-2 hover:border-violet text-void font-dm font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 w-15 h-8 flex items-center justify-center"
                  style={{ opacity: 0 }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="desktop-nav-action bg-ember hover:bg-transparent hover:text-ember hover:border-2 hover:border-violet text-void font-dm font-semibold w-15 h-8 text-sm px-10 py-2.5 rounded-full transition-colors duration-200 flex items-center justify-center"
                  style={{ opacity: 0 }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="mobile-nav-toggle md:hidden w-10 h-10 flex items-center justify-center text-ghost/70 hover:text-ghost"
            style={{ opacity: 0 }}
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
            <div className="flex items-center gap-4 pt-4 mt-2 border-t border-white/[0.06]">
              <Link
                to="/wishlist"
                aria-label={wishlistCount > 0 ? `Wishlist (${wishlistCount} items)` : 'Wishlist'}
                className="relative w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90"
              >
                <Heart size={16} strokeWidth={1.75} className={cn(wishlistCount > 0 && 'text-ember fill-ember/20')} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-void font-mono text-[10px] font-bold flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/notifications"
                  aria-label={unreadCount > 0 ? `Notifications (${unreadCount} items)` : 'Notifications'}
                  className="relative w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-ghost/90"
                >
                  <Bell size={16} strokeWidth={1.75} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-void font-mono text-[10px] font-bold flex items-center justify-center leading-none">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              
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

      {/* Loading Screen Overlay */}
      {loadingActive && (
        <div
          ref={loaderOverlayRef}
          className="fixed inset-0 z-[9999] bg-[#080808] flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at center, rgba(155, 92, 246, 0.12) 0%, rgba(8, 8, 8, 0) 75%), #080808',
          }}
        >
          <div
            ref={loaderLogoRef}
            className="w-32 h-32 md:w-40 h-40 flex items-center justify-center"
            style={{ opacity: 0 }}
          >
            <img
              src="/assets/image/favicon.svg"
              alt="Frames Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(155,92,246,0.35)]"
            />
          </div>
        </div>
      )}
      {/* Toast Notification Popup */}
      {newToast && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-[calc(100vw-3rem)] rounded-xl border border-violet/30 bg-[#0c0c0c]/90 backdrop-blur-md p-4 shadow-[0_0_30px_rgba(155,92,246,0.25)] flex gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center flex-shrink-0 text-violet">
            <Bell size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-syne font-bold text-xs text-ghost leading-tight mb-0.5">{newToast.title}</p>
            <p className="font-dm text-xs text-ghost-muted mb-2 line-clamp-2">{newToast.message}</p>
            <div className="flex items-center gap-3">
              {newToast.link && (
                <Link
                  to={newToast.link}
                  onClick={clearToast}
                  className="font-mono text-[9px] uppercase tracking-widest text-violet hover:text-violet-light font-bold"
                >
                  View Details
                </Link>
              )}
              <button
                onClick={clearToast}
                className="font-dm text-[10px] text-ghost-muted hover:text-ghost"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
