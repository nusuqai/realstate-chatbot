'use server'

import type { AgentResponse } from '@/types/agent'
import { normalizeResponse } from '@/utils/agentResponse'

type AgentActionInput = {
  query: string
  sessionId: string
}

type AgentActionResult =
  | {
      ok: true
      response: AgentResponse
    }
  | {
      locked?: boolean
      message: string
      ok: false
    }

export async function runRealEstateAgentQuery({
  query,
  sessionId,
}: AgentActionInput): Promise<AgentActionResult> {
  const cleanedQuery = query.trim()

  if (!cleanedQuery) {
    return {
      ok: false,
      message: 'Please enter a real-estate question.',
    }
  }

  if (process.env.REAL_ESTATE_AGENT_ENABLED !== 'true') {
    return {
      locked: true,
      ok: false,
      message:
        'The live real-estate agent is locked by the server environment. Set REAL_ESTATE_AGENT_ENABLED=true to enable Koyeb calls.',
    }
  }

  const endpoint = process.env.REAL_ESTATE_AGENT_API_URL

  if (!endpoint) {
    return {
      ok: false,
      message: 'REAL_ESTATE_AGENT_API_URL is not configured.',
    }
  }

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify({
        query: cleanedQuery,
        sessionId,
      }),
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      return {
        ok: false,
        message: `The agent returned ${response.status}.`,
      }
    }

    const payload = (await response.json()) as unknown

    return {
      ok: true,
      response: normalizeResponse(payload),
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'The agent could not be reached.',
    }
  }
}
