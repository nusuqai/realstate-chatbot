import { useMemo, useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { ChatPanel } from './components/ChatPanel'
import { InsightsPanel } from './components/InsightsPanel'
import { PromptRail } from './components/PromptRail'
import { promptCards } from './data/demoData'
import { useAgentChat } from './hooks/useAgentChat'
import { buildSnapshot, buildSummaryRows } from './utils/agentResponse'
import type { PromptCard, IconName } from './types/agent'

const followUpIcons: IconName[] = ['spark', 'chart', 'building', 'star', 'balance']

function App() {
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
    return promptCards
  }, [latestResponse])

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
      <div className="ambient-skyline" aria-hidden="true"></div>

      <section className="demo-shell" aria-label="Real-estate agent demo">
        <AppHeader onNewChat={handleNewChat} />

        <PromptRail
          disabled={isLoading}
          prompts={activePrompts}
          onPromptSelect={handlePromptSelect}
        />

        <div className="mobile-view-tabs" aria-label="Demo sections">
          <button
            aria-pressed={mobileView === 'chat'}
            className={mobileView === 'chat' ? 'active' : ''}
            type="button"
            onClick={() => setMobileView('chat')}
          >
            Chat
          </button>
          <button
            aria-pressed={mobileView === 'insights'}
            className={mobileView === 'insights' ? 'active' : ''}
            type="button"
            onClick={() => setMobileView('insights')}
          >
            Insights
          </button>
        </div>

        <section className={`demo-grid demo-grid-${mobileView}`}>
          <ChatPanel
            input={input}
            isLoading={isLoading}
            messages={messages}
            setInput={setInput}
            onSubmit={handleSubmit}
          />

          <InsightsPanel
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

export default App

