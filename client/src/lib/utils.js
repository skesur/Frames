import { clsx } from 'clsx'

export const cn = (...inputs) => clsx(inputs)

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)

export const clamp     = (v, min, max) => Math.min(Math.max(v, min), max)
export const mapRange  = (v, a, b, c, d) => ((v - a) / (b - a)) * (d - c) + c
export const truncate  = (s, n = 60) => s.length <= n ? s : s.slice(0, n) + '…'