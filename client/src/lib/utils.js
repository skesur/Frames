import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style:                'currency',
    currency:             'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

export function truncate(str, length = 60) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}