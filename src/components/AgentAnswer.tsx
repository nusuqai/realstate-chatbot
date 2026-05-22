import type { AgentResponse, MessageStatus } from '../types/agent'
import { ChartCard } from './charts/ChartCard'
import { Icon } from './Icon'
import { MarkdownText } from './MarkdownText'

type AgentAnswerProps = {
  response: AgentResponse
  status?: MessageStatus
}

export function AgentAnswer({ response, status }: AgentAnswerProps) {
  const charts = Array.isArray(response.charts) ? response.charts : []
  const highlights = Array.isArray(response.highlights) ? response.highlights : []

  return (
    <div className={`answer-card ${status ? `answer-${status}` : ''}`}>
      <div className="answer-meta">
        <span>
          <Icon name={status === 'error' ? 'code' : 'check'} />
          {status === 'error' ? 'Needs attention' : 'Live response'}
        </span>
      </div>

      <MarkdownText text={response.text || 'The agent returned an empty answer.'} />

      {highlights.length ? (
        <div className="highlight-box">
          {highlights.map((highlight) => (
            <div className="highlight-item" key={highlight}>
              <Icon name="check" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      ) : null}

      {charts.map((chart, index) => (
        <ChartCard chart={chart} key={`${chart.title || 'chart'}-${index}`} />
      ))}
    </div>
  )
}
