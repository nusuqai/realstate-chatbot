'use server'

import type { AgentResponse } from '@/types/agent'
import { normalizeResponse } from '@/utils/agentResponse'

type AgentActionInput = {
  query: string
  sessionId: string
  /** MCP session ID returned by the first response — kept in client memory only */
  mcpSessionId?: string
}

type AgentActionResult =
  | {
      ok: true
      response: AgentResponse
      /** Return the mcp-session-id so the client can keep it in memory */
      mcpSessionId: string | null
    }
  | {
      locked?: boolean
      message: string
      ok: false
    }

export async function runRealEstateAgentQuery({
  query,
  sessionId,
  mcpSessionId,
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
        'The live real-estate agent is currently disabled, contact the admin for more details.',
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
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Forward the MCP session ID on all subsequent requests
    if (mcpSessionId) {
      requestHeaders['mcp-session-id'] = mcpSessionId
    }

    const response = await fetch(endpoint, {
      body: JSON.stringify({
        query: cleanedQuery,
        sessionId,
      }),
      cache: 'no-store',
      headers: requestHeaders,
      method: 'POST',
    })

    // Capture the MCP session ID from the first response
    const returnedMcpSessionId = response.headers.get('mcp-session-id')

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
      // Return whichever ID we have: the one just received takes precedence
      mcpSessionId: returnedMcpSessionId ?? mcpSessionId ?? null,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'The agent could not be reached.',
    }
  }
}
