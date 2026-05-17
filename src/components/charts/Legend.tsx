import type { ChartSeries } from '../../types/agent'
import { chartColors } from '../../utils/chart'

type LegendProps = {
  series: ChartSeries[]
}

export function Legend({ series }: LegendProps) {
  return (
    <div className="chart-legend">
      {series.map((item, index) => (
        <span key={item.name}>
          <i style={{ background: chartColors[index % chartColors.length] }}></i>
          {item.name}
        </span>
      ))}
    </div>
  )
}
