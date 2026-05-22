'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getPromptCards } from '@/data/demoData'
import { getDictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import { buildSnapshot, buildSummaryRows } from '@/utils/agentResponse'
import { useAgentChat } from '@/hooks/useAgentChat'
import type { IconName, PromptCard } from '@/types/agent'
import { AppHeader } from './AppHeader'
import { ChatPanel } from './ChatPanel'
import { InsightsPanel } from './InsightsPanel'
import { PromptRail } from './PromptRail'

const followUpIcons: IconName[] = ['spark', 'chart', 'building', 'star', 'balance']

export function ChatExperience({
  initialPrompt,
  locale,
}: {
  initialPrompt?: string
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  const didRunInitialPrompt = useRef(false)
  const [mobileView, setMobileView] = useState<'chat' | 'insights'>('chat')
  const {
    error,
    input,
    isLoading,
    latestResponse,
    messages,
    newChat,
    runQuery,
    setInput,
  } = useAgentChat()

  const activePrompts: PromptCard[] = useMemo(() => {
    const followUps = latestResponse?.followUpQuestions
    if (followUps && followUps.length > 0) {
      return followUps.map((question, index) => ({
        icon: followUpIcons[index % followUpIcons.length],
        label: question,
        query: question,
      }))
    }
    return getPromptCards(locale)
  }, [latestResponse, locale])

  useEffect(() => {
    if (!initialPrompt || didRunInitialPrompt.current) {
      return
    }

    didRunInitialPrompt.current = true
    setMobileView('chat')
    void runQuery(initialPrompt)
  }, [initialPrompt, runQuery])

  function handleNewChat() {
    newChat()
    setMobileView('chat')
  }

  function handlePromptSelect(query: string) {
    setMobileView('chat')
    void runQuery(query)
  }

  function handleSubmit(query: string) {
    setMobileView('chat')
    void runQuery(query)
  }

  return (
    <main className="demo-page">
      <section className="demo-shell" aria-label={dictionary.pages.chatTitle}>
        <AppHeader
          newChatLabel={dictionary.actions.newChat}
          onNewChat={handleNewChat}
          subtitle="NusuqAI"
          title={dictionary.pages.chatTitle}
        />

        <PromptRail
          disabled={isLoading}
          prompts={activePrompts}
          onPromptSelect={handlePromptSelect}
        />

        <div className="mobile-view-tabs" aria-label={dictionary.chat.tabsInsights}>
          <button
            aria-pressed={mobileView === 'chat'}
            className={mobileView === 'chat' ? 'active' : ''}
            type="button"
            onClick={() => setMobileView('chat')}
          >
            {dictionary.chat.tabsChat}
          </button>
          <button
            aria-pressed={mobileView === 'insights'}
            className={mobileView === 'insights' ? 'active' : ''}
            type="button"
            onClick={() => setMobileView('insights')}
          >
            {dictionary.chat.tabsInsights}
          </button>
        </div>

        <section className={`demo-grid demo-grid-${mobileView}`}>
          <ChatPanel
            copy={dictionary.chat}
            input={input}
            isLoading={isLoading}
            messages={messages}
            setInput={setInput}
            onSubmit={handleSubmit}
          />

          <InsightsPanel
            copy={dictionary.chat}
            error={error}
            response={latestResponse}
            snapshotItems={buildSnapshot(latestResponse)}
            summaryRows={buildSummaryRows(latestResponse)}
          />
        </section>
      </section>
    </main>
  )
}
