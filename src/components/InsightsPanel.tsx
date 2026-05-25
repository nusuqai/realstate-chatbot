import type { AgentResponse, SummaryRow } from '../types/agent'
import { formatScore, getInitials } from '../utils/format'
import { Icon } from './Icon'

type InsightsPanelProps = {
  copy?: {
    decision: string
    emptySources: string
    liveIssue: string
    sources: string
    summary: string
  }
  error: string
  response?: AgentResponse
  snapshotItems: string[]
  summaryRows: SummaryRow[]
}

export function InsightsPanel({
  copy = {
    decision: 'Decision Snapshot',
    emptySources: 'Sources will appear after an answer.',
    liveIssue: 'The live service needs attention.',
    sources: 'Sources',
    summary: 'Project Summary',
  },
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
          {copy.decision}
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
          {copy.summary}
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
          {copy.sources}
        </div>
        <SourceList emptyText={copy.emptySources} sources={response?.sources} />
      </div>

      {error ? (
        <div className="inline-error" role="status">
          <Icon name="code" />
          {copy.liveIssue}
        </div>
      ) : null}
    </aside>
  )
}

function SourceList({
  emptyText,
  sources,
}: {
  emptyText: string
  sources?: AgentResponse['sources']
}) {
  if (!Array.isArray(sources) || !sources.length) {
    return <div className="empty-state compact">{emptyText}</div>
  }

  return (
    <div className="source-list">
      {sources.map((source) => (
        <div className="source-item" key={`${source.id}-${source.title}`}>
          <div className="source-logo">{getInitials(source.title)}</div>
          <div>
            <strong>{source.title || 'Untitled source'}</strong>
            <span>{source.source || 'Market insights'}</span>
          </div>
          <small>{source.id || formatScore(source.score)}</small>
        </div>
      ))}
    </div>
  )
}
