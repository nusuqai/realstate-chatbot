import type { AgentChart } from '../../types/agent'
import { chartColors, getCategories, getMaxValue, getSeriesValue } from '../../utils/chart'
import { formatCompact } from '../../utils/format'
import { Legend } from './Legend'

type BarChartProps = {
  chart: AgentChart
}

export function BarChart({ chart }: BarChartProps) {
  const series = chart.series || []
  const categories = getCategories(series)
  const maxValue = getMaxValue(series)

  if (!series.length || !categories.length || maxValue <= 0) {
    return <div className="empty-state">No chart data returned.</div>
  }

  const width = 640
  const height = 224
  const margin = { top: 24, right: 22, bottom: 46, left: 76 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom
  const groupWidth = plotWidth / categories.length
  const barWidth = Math.min(38, (groupWidth - 24) / Math.max(series.length, 1))
  const ticks = [0, maxValue / 2, maxValue]

  return (
    <div className="chart-frame">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.title || 'Bar chart'}>
        {ticks.map((tick) => {
          const y = margin.top + plotHeight - (Number(tick) / maxValue) * plotHeight

          return (
            <g key={tick}>
              <line
                className="grid-line"
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
              />
              <text className="axis-label" x={margin.left - 10} y={y + 4} textAnchor="end">
                {formatCompact(tick, chart.unit)}
              </text>
            </g>
          )
        })}
        {categories.map((category, categoryIndex) => (
          <text
            className="axis-label category-label"
            key={category}
            x={margin.left + categoryIndex * groupWidth + groupWidth / 2}
            y={height - 16}
            textAnchor="middle"
          >
            {category}
          </text>
        ))}
        {series.flatMap((item, seriesIndex) =>
          categories.map((category, categoryIndex) => {
            const value = getSeriesValue(item, category)
            const barHeight = (value / maxValue) * plotHeight
            const x =
              margin.left +
              categoryIndex * groupWidth +
              groupWidth / 2 -
              (series.length * barWidth) / 2 +
              seriesIndex * barWidth +
              4
            const y = margin.top + plotHeight - barHeight

            return (
              <g key={`${item.name}-${category}`}>
                <rect
                  className="chart-bar"
                  fill={chartColors[seriesIndex % chartColors.length]}
                  height={barHeight}
                  rx="6"
                  width={barWidth - 8}
                  x={x}
                  y={y}
                />
                <text
                  className="bar-value"
                  x={x + (barWidth - 8) / 2}
                  y={Math.max(14, y - 8)}
                  textAnchor="middle"
                >
                  {formatCompact(value, chart.unit)}
                </text>
              </g>
            )
          }),
        )}
      </svg>
      <Legend series={series} />
    </div>
  )
}
