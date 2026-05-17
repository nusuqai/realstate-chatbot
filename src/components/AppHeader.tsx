import { Icon } from './Icon'

type AppHeaderProps = {
  onNewChat: () => void
}

export function AppHeader({ onNewChat }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-title">
        <span className="agent-mark">
          <Icon name="spark" />
        </span>
        <div>
          <h1>Real-Estate AI Agent</h1>
          <p>Built by NusuqAI</p>
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
        <span className="new-chat-label">New chat</span>
      </button>
    </header>
  )
}
