import type { ReactNode } from 'react'

type MarkdownTextProps = {
  text: string
}

export function MarkdownText({ text }: MarkdownTextProps) {
  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let listItems: string[] = []

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

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()

    if (!line) {
      flushList()
      return
    }

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

  return <div className="markdown-body">{nodes}</div>
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
