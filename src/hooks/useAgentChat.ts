import { useCallback, useMemo, useState } from 'react'
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
      })

      if (!result.ok) {
        throw new Error(result.message)
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
