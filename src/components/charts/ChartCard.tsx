import type { AgentChart } from '../../types/agent'
import { BarChart } from './BarChart'
import { LineChart } from './LineChart'
import { TableChart } from './TableChart'

type ChartCardProps = {
  chart: AgentChart
}

export function ChartCard({ chart }: ChartCardProps) {
  const type = chart.chartType?.toLowerCase() || 'bar'

  return (
    <section className="chart-card">
      <div className="chart-title">
        <strong>{chart.title || 'Generated chart'}</strong>
        <span>{type}</span>
      </div>
      {type === 'table' ? <TableChart chart={chart} /> : null}
      {type === 'line' ? <LineChart chart={chart} /> : null}
      {type !== 'table' && type !== 'line' ? <BarChart chart={chart} /> : null}
      {chart.notes ? <p className="chart-note">{chart.notes}</p> : null}
    </section>
  )
}
