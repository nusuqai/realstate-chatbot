import { useCallback, useMemo, useRef, useState } from 'react'
import { runRealEstateAgentQuery } from '@/app/actions/real-estate-agent'
import { initialMessages } from '../data/demoData'
import type { ChatMessage } from '../types/agent'
import { createUnavailableResponse } from '../utils/agentResponse'
import { createId, createSessionId } from '../utils/ids'

const defaultPrompt = ''

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState(defaultPrompt)
  const [sessionId, setSessionId] = useState(createSessionId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * MCP session ID — kept in a ref so it lives only in memory.
   * It is never persisted to localStorage, sessionStorage, or cookies.
   * A page refresh discards it automatically (ref resets to null).
   */
  const mcpSessionIdRef = useRef<string | null>(null)

  const latestResponse = useMemo(() => {
    return [...messages].reverse().find((message) => message.response)?.response
  }, [messages])

  const runQuery = useCallback(async (queryText: string) => {
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
      const result = await runRealEstateAgentQuery({
        query: cleanedQuery,
        sessionId,
        // Send whatever MCP session ID we have in memory (null on first query)
        mcpSessionId: mcpSessionIdRef.current ?? undefined,
      })

      if (!result.ok) {
        throw new Error(result.message)
      }

      // Store the returned MCP session ID in memory for subsequent calls
      if (result.mcpSessionId) {
        mcpSessionIdRef.current = result.mcpSessionId
      }

      setMessages((current) => [
        ...current,
        {
          id: createId('assistant'),
          role: 'assistant',
          response: result.response,
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
  }, [isLoading, sessionId])

  const newChat = useCallback(() => {
    setMessages([])
    setInput('')
    setError('')
    setSessionId(createSessionId())
    // Clear the MCP session ID when starting a new chat
    mcpSessionIdRef.current = null
  }, [])

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
