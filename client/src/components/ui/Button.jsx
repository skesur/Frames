import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

const variants = {
  primary:   'bg-cyber-gradient text-void font-semibold hover:opacity-90 hover:scale-[1.02]',
  secondary: 'border border-violet text-violet hover:bg-violet hover:text-void',
  ghost:     'text-ghost-muted hover:text-ghost hover:bg-white/5',
  outline:   'border border-ghost/20 text-ghost hover:border-ghost/60 hover:bg-white/5',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  onClick,
  href,
  className,
  disabled = false,
  type     = 'button',
}) {
  const base = cn(
    'inline-flex items-center justify-center gap-2',
    'font-dm tracking-wide rounded-sm',
    'transition-all duration-300 cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    return (
      <Link to={href} className={base}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  )
}