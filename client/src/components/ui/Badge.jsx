import { cn } from '../../lib/utils'

const variants = {
  new:       'bg-teal/10 text-teal border border-teal/30',
  topseller: 'bg-violet/10 text-violet border border-violet/30',
  premium:   'bg-ember/10 text-ember border border-ember/30',
  sale:      'bg-red-500/10 text-red-400 border border-red-400/30',
}

export default function Badge({ children, variant = 'new', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'font-mono text-xs uppercase tracking-widest rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}