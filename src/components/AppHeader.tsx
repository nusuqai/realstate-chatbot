import { Icon } from './Icon'

type AppHeaderProps = {
  newChatLabel?: string
  onNewChat: () => void
  subtitle?: string
  title?: string
}

export function AppHeader({
  newChatLabel = 'New chat',
  onNewChat,
  subtitle = 'Built by NusuqAI',
  title = 'Real-Estate AI Agent',
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-title">
        <span className="agent-mark">
          <img alt="" src="/aqar-lens-logo.png" />
        </span>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <button
        aria-label="Start a new chat"
        className="new-chat-button"
        title="Start a new chat"
        type="button"
        onClick={onNewChat}
      >
        <Icon name="plus" />
        <span className="new-chat-label">{newChatLabel}</span>
      </button>
    </header>
  )
}
