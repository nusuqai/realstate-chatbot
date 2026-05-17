import { useEffect, useRef, type FormEvent } from 'react'
import { sampleResponse } from '../data/demoData'
import type { ChatMessage } from '../types/agent'
import { AgentAnswer } from './AgentAnswer'
import { Icon } from './Icon'

type ChatPanelProps = {
  input: string
  isLoading: boolean
  messages: ChatMessage[]
  setInput: (value: string) => void
  onSubmit: (query: string) => void
}

export function ChatPanel({
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
            Intelligence Assistant <span>AI</span>
          </div>
          <p>Ask about projects, prices, developers, ROI, delivery, and comparisons.</p>
        </div>
        <div className="agent-status" aria-label="Agent status">
          <span></span>
          Online
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
                <AgentAnswer
                  response={message.response || sampleResponse}
                  status={message.status}
                />
              </div>
            ),
          )
        ) : (
          <div className="empty-chat">
            <Icon name="spark" />
            <strong>Start a new analysis</strong>
            <span>Choose a prompt above or ask your own real-estate question.</span>
          </div>
        )}

        {isLoading ? (
          <div className="message-row assistant-row">
            <div className="typing-card">
              <span></span>
              <span></span>
              <span></span>
              Searching project data and preparing a structured answer
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
          placeholder="Ask anything about real estate..."
        />
        <button type="submit" disabled={isLoading || !input.trim()} title="Send query">
          <Icon name="send" />
        </button>
      </form>
    </article>
  )
}
