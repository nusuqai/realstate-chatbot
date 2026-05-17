import { emptyResponse } from '../data/demoData'
import type { AgentResponse, SummaryRow } from '../types/agent'
import { formatScore, formatValue } from './format'

export function normalizeResponse(payload: unknown): AgentResponse {
  if (!payload || typeof payload !== 'object') {
    return {
      text: String(payload || 'No response body returned.'),
      charts: null,
      highlights: null,
      sources: null,
    }
  }

  const value = payload as AgentResponse

  return {
    ...value,
    text: typeof value.text === 'string' ? value.text : JSON.stringify(value, null, 2),
    charts: Array.isArray(value.charts) ? value.charts : null,
    highlights: Array.isArray(value.highlights) ? value.highlights.map(String) : null,
    sources: Array.isArray(value.sources) ? value.sources : null,
    followUpQuestions: Array.isArray(value.followUpQuestions) ? value.followUpQuestions.map(String) : null,
  }
}

export function createUnavailableResponse(message: string): AgentResponse {
  return {
    text: `### Agent response unavailable

I could not get a live response from the real-estate agent right now.

- You can keep exploring the sample output already shown.
- Try again once the agent service is running.
- Your chat context will be preserved automatically for follow-up questions.

Details: **${message}**`,
    charts: null,
    highlights: [
      'The chat UI is ready for live responses.',
      'Each chat keeps its own conversation memory.',
      'Structured answers will render as text, charts, highlights, and sources.',
    ],
    sources: null,
  }
}

export function buildSnapshot(response: AgentResponse | undefined) {
  const safeResponse = response || emptyResponse
  const highlights = Array.isArray(safeResponse.highlights) ? safeResponse.highlights : []

  if (highlights.length) {
    return highlights.slice(0, 3)
  }

  const bullets =
    safeResponse.text
      ?.split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.replace(/^-\s+/, '').replace(/\*\*/g, '')) || []

  return bullets.slice(0, 3).length
    ? bullets.slice(0, 3)
    : ['Ask a question to generate decision-ready takeaways.']
}

export function buildSummaryRows(response: AgentResponse | undefined): SummaryRow[] {
  const safeResponse = response || emptyResponse
  const rows: SummaryRow[] = []

  safeResponse.sources?.slice(0, 4).forEach((source) => {
    rows.push({
      label: source.title || 'Source',
      value: source.score ? formatScore(source.score) : source.id || 'Used',
    })
  })

  safeResponse.charts?.forEach((chart) => {
    chart.series?.slice(0, 3).forEach((item) => {
      const maxValue = Math.max(...item.data.map((point) => Number(point.y)).filter(Number.isFinite))

      if (Number.isFinite(maxValue)) {
        rows.push({
          label: `${item.name} max`,
          value: formatValue(maxValue, chart.unit),
        })
      }
    })
  })

  return rows.slice(0, 5).length
    ? rows.slice(0, 5)
    : [{ label: 'Agent status', value: 'Ready' }]
}
