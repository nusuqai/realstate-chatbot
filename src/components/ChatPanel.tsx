import { useEffect, useRef, type FormEvent } from 'react'
import type { ChatMessage } from '../types/agent'
import { AgentAnswer } from './AgentAnswer'
import { Icon } from './Icon'

type ChatPanelProps = {
  copy?: {
    emptyText: string
    emptyTitle: string
    loading: string
    online: string
    placeholder: string
    subtitle: string
    title: string
  }
  input: string
  isLoading: boolean
  messages: ChatMessage[]
  setInput: (value: string) => void
  onSubmit: (query: string) => void
}

export function ChatPanel({
  copy = {
    emptyText: 'Choose a prompt above or ask your own real-estate question.',
    emptyTitle: 'Start a new analysis',
    loading: 'Searching project data and preparing a structured answer',
    online: 'Online',
    placeholder: 'Ask anything about real estate...',
    subtitle: 'Ask about projects, prices, developers, ROI, delivery, and comparisons.',
    title: 'Intelligence Assistant',
  },
  input,
  isLoading,
  messages,
  setInput,
  onSubmit,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(input)
  }

  return (
    <article className="chat-panel" aria-label="Agent chat">
      <div className="agent-header">
        <div className="agent-orb">
          <Icon name="agent" />
        </div>
        <div>
          <div className="agent-title">
            {copy.title} <span>AI</span>
          </div>
          <p>{copy.subtitle}</p>
        </div>
        <div className="agent-status" aria-label="Agent status">
          <span></span>
          {copy.online}
        </div>
      </div>

      <div className="chat-scroll" aria-live="polite">
        {messages.length ? (
          messages.map((message) =>
            message.role === 'user' ? (
              <div className="message-row user-row" key={message.id}>
                <div className="user-bubble">{message.text}</div>
              </div>
            ) : (
              <div className="message-row assistant-row" key={message.id}>
                {message.response ? (
                  <AgentAnswer response={message.response} status={message.status} />
                ) : (
                  <div className="typing-card">{message.text}</div>
                )}
              </div>
            ),
          )
        ) : (
          <div className="empty-chat">
            <Icon name="spark" />
            <strong>{copy.emptyTitle}</strong>
            <span>{copy.emptyText}</span>
          </div>
        )}

        {isLoading ? (
          <div className="message-row assistant-row">
            <div className="typing-card">
              <span></span>
              <span></span>
              <span></span>
              {copy.loading}
            </div>
          </div>
        ) : null}
        <div ref={bottomRef}></div>
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="agent-query">
          Ask the real-estate agent
        </label>
        <input
          id="agent-query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={copy.placeholder}
        />
        <button type="submit" disabled={isLoading || !input.trim()} title="Send query">
          <Icon name="send" />
        </button>
      </form>
    </article>
  )
}
