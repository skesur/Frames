import { cn } from '@/lib/utils'

const colorMap = {
  violet: '#9B5CF6',
  ember:  '#FF6B35',
  teal:   '#00F5C4',
}

export default function SectionLabel({ children, color = 'violet', className }) {
  const c = colorMap[color] || colorMap.violet

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span style={{ display: 'block', width: 24, height: 1, background: c, opacity: 0.6 }} />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.25em]"
        style={{ color: c }}
      >
        {children}
      </span>
      <span style={{ display: 'block', width: 24, height: 1, background: c, opacity: 0.6 }} />
    </div>
  )
}