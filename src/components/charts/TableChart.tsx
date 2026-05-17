import type { AgentChart } from '../../types/agent'
import { getCategories, getSeriesValue } from '../../utils/chart'
import { formatValue } from '../../utils/format'

type TableChartProps = {
  chart: AgentChart
}

export function TableChart({ chart }: TableChartProps) {
  const series = chart.series || []
  const categories = getCategories(series)

  if (!series.length || !categories.length) {
    return <div className="empty-state">No table data returned.</div>
  }

  return (
    <div className="table-chart" role="region" aria-label={chart.title || 'Table chart'}>
      <table>
        <thead>
          <tr>
            <th>{chart.xField || 'Metric'}</th>
            {series.map((item) => (
              <th key={item.name}>{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category}>
              <td>{category}</td>
              {series.map((item) => (
                <td key={`${category}-${item.name}`}>
                  {formatValue(getSeriesValue(item, category), chart.unit)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
