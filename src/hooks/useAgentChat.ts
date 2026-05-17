import { useMemo, useState } from 'react'
import { endpoint, initialMessages } from '../data/demoData'
import type { ChatMessage } from '../types/agent'
import { createUnavailableResponse, normalizeResponse } from '../utils/agentResponse'
import { createId, createSessionId } from '../utils/ids'

const defaultPrompt = ''

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState(defaultPrompt)
  const [sessionId, setSessionId] = useState(createSessionId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const latestResponse = useMemo(() => {
    return [...messages].reverse().find((message) => message.response)?.response
  }, [messages])

  async function runQuery(queryText: string) {
    const cleanedQuery = queryText.trim()

    if (!cleanedQuery || isLoading) {
      return
    }

    setInput('')
    setError('')
    setIsLoading(true)

    setMessages((current) => [
      ...current,
      {
        id: createId('user'),
        role: 'user',
        text: cleanedQuery,
      },
    ])

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: cleanedQuery,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`The agent returned ${response.status}.`)
      }

      const payload = (await response.json()) as unknown
      const normalized = normalizeResponse(payload)

      setMessages((current) => [
        ...current,
        {
          id: createId('assistant'),
          role: 'assistant',
          response: normalized,
          status: 'live',
        },
      ])
    } catch (queryError) {
      const message =
        queryError instanceof Error
          ? queryError.message
          : 'The agent could not be reached.'

      setError(message)
      setMessages((current) => [
        ...current,
        {
          id: createId('assistant'),
          role: 'assistant',
          response: createUnavailableResponse(message),
          status: 'error',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function newChat() {
    setMessages([])
    setInput('')
    setError('')
    setSessionId(createSessionId())
  }

  return {
    error,
    input,
    isLoading,
    latestResponse,
    messages,
    newChat,
    runQuery,
    setInput,
  }
}
