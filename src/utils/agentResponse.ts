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
    summary:
      value.summary && typeof value.summary === 'object'
        ? {
            takeaways: Array.isArray(value.summary.takeaways)
              ? value.summary.takeaways.map(String)
              : [],
            dataPoints: Array.isArray(value.summary.dataPoints)
              ? value.summary.dataPoints
              : [],
            verdict:
              typeof value.summary.verdict === 'string' ? value.summary.verdict : null,
          }
        : null,
    followUpQuestions: Array.isArray(value.followUpQuestions) ? value.followUpQuestions.map(String) : null,
  }
}

export function createUnavailableResponse(message: string): AgentResponse {
  return {
    text: `### Assistant response unavailable

I could not get a response from the real-estate assistant right now.

- You can still browse projects, locations, developers, and insights across the site.
- Try again once the assistant service is available.
- Your chat context will be preserved automatically for follow-up questions.

Details: **${message}**`,
    charts: null,
    highlights: [
      'The chat experience is ready for guided answers.',
      'Each chat keeps its own conversation memory.',
      'Structured answers will render as text, charts, highlights, and sources.',
    ],
    sources: null,
  }
}

export function buildSnapshot(response: AgentResponse | undefined) {
  const safeResponse = response || emptyResponse

  // Priority 1: structured summary takeaways from the agent
  const takeaways = safeResponse.summary?.takeaways
  if (Array.isArray(takeaways) && takeaways.length) {
    return takeaways.slice(0, 3)
  }

  // Priority 2: legacy highlights field
  const highlights = Array.isArray(safeResponse.highlights) ? safeResponse.highlights : []
  if (highlights.length) {
    return highlights.slice(0, 3)
  }

  // Priority 3: extract from text
  const text = safeResponse.text || ''
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)

  const bullets = lines
    .filter((line) => /^[-*•]\s+/.test(line))
    .map((line) => line.replace(/^[-*•]\s+/, '').replace(/\*\*/g, ''))

  if (bullets.length) {
    return bullets.slice(0, 3)
  }

  const kvLines = lines
    .filter((line) => /^(\*\*[^*]+\*\*|[A-Z][a-zA-Z\s]+)\s*[:：]\s*.+/.test(line))
    .map((line) => line.replace(/\*\*/g, ''))

  if (kvLines.length) {
    return kvLines.slice(0, 3)
  }

  const sentences = lines
    .filter((line) => !line.startsWith('#') && line.length > 15 && line.length < 150)
    .slice(0, 3)

  if (sentences.length) {
    return sentences.map((s) => s.replace(/\*\*/g, ''))
  }

  return ['Ask a question to generate decision-ready takeaways.']
}

export function buildSummaryRows(response: AgentResponse | undefined): SummaryRow[] {
  const safeResponse = response || emptyResponse

  // Priority 1: structured summary dataPoints from the agent
  const dataPoints = safeResponse.summary?.dataPoints
  if (Array.isArray(dataPoints) && dataPoints.length) {
    return dataPoints
      .filter((dp) => dp.label && dp.value)
      .slice(0, 5)
      .map((dp) => ({ label: dp.label, value: dp.value }))
  }

  // Priority 2: derive from sources and charts (legacy)
  const rows: SummaryRow[] = []

  safeResponse.sources?.slice(0, 4).forEach((source) => {
    rows.push({
      label: source.title || 'Source',
      value: source.score
        ? `${formatScore(source.score)} relevance`
        : source.source || source.id || 'Referenced',
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

  if (rows.length) {
    return rows.slice(0, 5)
  }

  // Priority 3: extract key-value pairs from response text
  if (safeResponse.text) {
    const lines = safeResponse.text.split('\n').map((line) => line.trim()).filter(Boolean)

    for (const line of lines) {
      const kvMatch = line.match(
        /^[-*•]?\s*\*?\*?([^*:]{2,30})\*?\*?\s*[:：]\s*"?([^"\n]{1,60})"?\s*$/
      )

      if (kvMatch) {
        const label = kvMatch[1].trim()
        const value = kvMatch[2].trim().replace(/\*\*/g, '')

        if (label.length <= 25 && value.length <= 50) {
          rows.push({ label, value })
        }
      }

      if (rows.length >= 5) {
        break
      }
    }
  }

  return rows.slice(0, 5)
}
