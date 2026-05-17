import type { AgentChart } from '../../types/agent'
import { chartColors, getCategories, getMaxValue, getSeriesValue } from '../../utils/chart'
import { formatCompact } from '../../utils/format'
import { Legend } from './Legend'

type LineChartProps = {
  chart: AgentChart
}

export function LineChart({ chart }: LineChartProps) {
  const series = chart.series || []
  const categories = getCategories(series)
  const maxValue = getMaxValue(series)

  if (!series.length || !categories.length || maxValue <= 0) {
    return <div className="empty-state">No line data returned.</div>
  }

  const width = 640
  const height = 224
  const margin = { top: 24, right: 22, bottom: 44, left: 76 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  return (
    <div className="chart-frame">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.title || 'Line chart'}>
        {[0, maxValue / 2, maxValue].map((tick) => {
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
        {series.map((item, seriesIndex) => {
          const points = categories.map((category, categoryIndex) => {
            const value = getSeriesValue(item, category)
            const x = margin.left + categoryIndex * (plotWidth / Math.max(categories.length - 1, 1))
            const y = margin.top + plotHeight - (value / maxValue) * plotHeight

            return { x, y, category }
          })

          return (
            <g key={item.name}>
              <polyline
                className="line-path"
                fill="none"
                points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                stroke={chartColors[seriesIndex % chartColors.length]}
              />
              {points.map((point) => (
                <circle
                  cx={point.x}
                  cy={point.y}
                  fill={chartColors[seriesIndex % chartColors.length]}
                  key={`${item.name}-${point.category}`}
                  r="5"
                />
              ))}
            </g>
          )
        })}
        {categories.map((category, index) => (
          <text
            className="axis-label category-label"
            key={category}
            x={margin.left + index * (plotWidth / Math.max(categories.length - 1, 1))}
            y={height - 16}
            textAnchor="middle"
          >
            {category}
          </text>
        ))}
      </svg>
      <Legend series={series} />
    </div>
  )
}
