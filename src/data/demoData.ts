import type { AgentResponse, ChatMessage, PromptCard } from '../types/agent'
import { getDictionary } from '../i18n/dictionaries'
import type { Locale } from '../i18n/config'

const promptIcons: PromptCard['icon'][] = ['balance', 'chart', 'building', 'star', 'truck', 'memory']

export function getPromptCards(locale: Locale): PromptCard[] {
  return getDictionary(locale).prompts.map(([label, query], index) => ({
    icon: promptIcons[index % promptIcons.length],
    label,
    query,
  }))
}

export const emptyResponse: AgentResponse = {
  text: '',
  charts: null,
  highlights: null,
  sources: null,
  summary: null,
  followUpQuestions: null,
}

export const initialMessages: ChatMessage[] = [
]
