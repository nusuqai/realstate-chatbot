import type { ChartSeries } from '../types/agent'

export const chartColors = ['#005c45', '#65caa2', '#ffc21a', '#0b4a6f', '#8bd8ce']

export function getCategories(series: ChartSeries[]) {
  return Array.from(new Set(series.flatMap((item) => item.data.map((point) => String(point.x)))))
}

export function getMaxValue(series: ChartSeries[]) {
  return Math.max(
    ...series.flatMap((item) =>
      item.data.map((point) => Number(point.y)).filter((value) => Number.isFinite(value)),
    ),
    0,
  )
}

export function getSeriesValue(series: ChartSeries, category: string) {
  const point = series.data.find((item) => String(item.x) === category)
  const value = Number(point?.y || 0)

  return Number.isFinite(value) ? value : 0
}
