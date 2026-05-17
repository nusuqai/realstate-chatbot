import type { AgentResponse, SummaryRow } from '../types/agent'
import { formatScore, getInitials } from '../utils/format'
import { Icon } from './Icon'

type InsightsPanelProps = {
  error: string
  response?: AgentResponse
  snapshotItems: string[]
  summaryRows: SummaryRow[]
}

export function InsightsPanel({
  error,
  response,
  snapshotItems,
  summaryRows,
}: InsightsPanelProps) {
  return (
    <aside className="insights-stack" aria-label="Agent output overview">
      <div className="side-card decision-card">
        <div className="side-card-title">
          <Icon name="shield" />
          Decision Snapshot
        </div>
        <div className="decision-body">
          <div className="decision-ring">
            <Icon name="star" />
          </div>
          <ul>
            {snapshotItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="side-card compact-card summary-card">
        <div className="side-card-title">
          <Icon name="building" />
          Project Summary
        </div>
        <div className="summary-list">
          {summaryRows.map((row) => (
            <div className="summary-row" key={`${row.label}-${row.value}`}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="side-card source-card">
        <div className="side-card-title">
          <Icon name="link" />
          Sources
        </div>
        <SourceList sources={response?.sources} />
      </div>

      {error ? (
        <div className="inline-error" role="status">
          <Icon name="code" />
          The live service needs attention.
        </div>
      ) : null}
    </aside>
  )
}

function SourceList({ sources }: { sources?: AgentResponse['sources'] }) {
  if (!Array.isArray(sources) || !sources.length) {
    return <div className="empty-state compact">Sources will appear after an answer.</div>
  }

  return (
    <div className="source-list">
      {sources.map((source) => (
        <div className="source-item" key={`${source.id}-${source.title}`}>
          <div className="source-logo">{getInitials(source.title)}</div>
          <div>
            <strong>{source.title || 'Untitled source'}</strong>
            <span>{source.source || 'knowledge base'}</span>
          </div>
          <small>{source.id || formatScore(source.score)}</small>
        </div>
      ))}
    </div>
  )
}
