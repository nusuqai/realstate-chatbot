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
  const highlights = Array.isArray(safeResponse.highlights) ? safeResponse.highlights : []

  if (highlights.length) {
    return highlights.slice(0, 3)
  }

  const text = safeResponse.text || ''
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)

  // Try bullet points first (-, *, •)
  const bullets = lines
    .filter((line) => /^[-*•]\s+/.test(line))
    .map((line) => line.replace(/^[-*•]\s+/, '').replace(/\*\*/g, ''))

  if (bullets.length) {
    return bullets.slice(0, 3)
  }

  // Try key-value patterns like "Rating: 4.0" or "**Sentiment**: Neutral"
  const kvLines = lines
    .filter((line) => /^(\*\*[^*]+\*\*|[A-Z][a-zA-Z\s]+)\s*[:：]\s*.+/.test(line))
    .map((line) => line.replace(/\*\*/g, ''))

  if (kvLines.length) {
    return kvLines.slice(0, 3)
  }

  // Fall back to the first meaningful sentences (skip headings)
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

  // If no structured data, extract key-value pairs from response text
  if (!rows.length && safeResponse.text) {
    const lines = safeResponse.text.split('\n').map((line) => line.trim()).filter(Boolean)

    for (const line of lines) {
      // Match patterns like "**Rating**: 4.0", "Rating: 4.0", "- **Rating**: 4.0"
      const kvMatch = line.match(
        /^[-*•]?\s*\*?\*?([^*:]{2,30})\*?\*?\s*[:：]\s*"?([^"\n]{1,60})"?\s*$/
      )

      if (kvMatch) {
        const label = kvMatch[1].trim()
        const value = kvMatch[2].trim().replace(/\*\*/g, '')

        // Skip headings and very long values that aren't data points
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
