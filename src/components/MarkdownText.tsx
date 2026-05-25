import type { ReactNode } from 'react'

type MarkdownTextProps = {
  text: string
}

export function MarkdownText({ text }: MarkdownTextProps) {
  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let listItems: string[] = []
  let tableRows: string[][] = []

  function flushList() {
    if (!listItems.length) {
      return
    }

    const list = listItems
    const index = nodes.length
    listItems = []
    nodes.push(
      <ul className="markdown-list" key={`list-${index}`}>
        {list.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>,
    )
  }

  function flushTable() {
    if (!tableRows.length) {
      return
    }

    const rows = tableRows
    const index = nodes.length
    tableRows = []

    // First row is the header, skip separator row (index 1)
    const headerCells = rows[0] ?? []
    const bodyRows = rows.slice(2) // skip header + separator

    nodes.push(
      <div className="table-chart" key={`table-${index}`}>
        <table>
          <thead>
            <tr>
              {headerCells.map((cell, cellIndex) => (
                <th key={`th-${cellIndex}`}>{renderInline(cell.trim())}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={`tr-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`td-${rowIndex}-${cellIndex}`}>{renderInline(cell.trim())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    )
  }

  function isTableLine(line: string): boolean {
    return line.startsWith('|') && line.endsWith('|')
  }

  function isSeparatorLine(line: string): boolean {
    return /^\|[\s\-:|]+\|$/.test(line)
  }

  function parseTableCells(line: string): string[] {
    // Remove leading/trailing pipes and split by pipe
    return line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim())
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()

    if (!line) {
      flushList()
      flushTable()
      return
    }

    // Table detection
    if (isTableLine(line)) {
      flushList()
      if (isSeparatorLine(line)) {
        // It's a separator row — push a marker so we know to skip it
        tableRows.push(['__separator__'])
      } else {
        tableRows.push(parseTableCells(line))
      }
      return
    }

    // If we were in a table, flush it before handling other lines
    flushTable()

    if (line.startsWith('#### ')) {
      flushList()
      nodes.push(<h4 key={`h4-${index}`}>{renderInline(line.replace(/^####\s+/, ''))}</h4>)
      return
    }

    if (line.startsWith('### ')) {
      flushList()
      nodes.push(<h3 key={`h3-${index}`}>{renderInline(line.replace(/^###\s+/, ''))}</h3>)
      return
    }

    if (line.startsWith('- ')) {
      listItems.push(line.replace(/^-\s+/, ''))
      return
    }

    flushList()
    nodes.push(<p key={`p-${index}`}>{renderInline(line)}</p>)
  })

  flushList()
  flushTable()

  return <div className="markdown-body" dir="auto">{nodes}</div>
}

function renderInline(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    }

    return <span key={`${part}-${index}`}>{part}</span>
  })
}
