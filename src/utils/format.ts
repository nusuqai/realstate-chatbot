export function formatCompact(value: number, unit?: string) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  if (Math.abs(value) >= 1000000) {
    return `${trimNumber(value / 1000000)}M${unit ? ` ${unit}` : ''}`
  }

  if (Math.abs(value) >= 1000) {
    return `${trimNumber(value / 1000)}K${unit ? ` ${unit}` : ''}`
  }

  return `${trimNumber(value)}${unit ? ` ${unit}` : ''}`
}

export function formatValue(value: number, unit?: string) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)}${unit ? ` ${unit}` : ''}`
}

export function formatScore(score?: number) {
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return 'Used'
  }

  return `${Math.round(score * 100)}%`
}

export function getInitials(title?: string) {
  const parts = title?.split(/\s+/).filter(Boolean) || []

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}
