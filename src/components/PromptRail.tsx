import type { PromptCard } from '../types/agent'
import { Icon } from './Icon'

type PromptRailProps = {
  disabled: boolean
  prompts: PromptCard[]
  onPromptSelect: (query: string) => void
}

export function PromptRail({ disabled, prompts, onPromptSelect }: PromptRailProps) {
  return (
    <nav className="prompt-row" aria-label="Suggested prompts">
      {prompts.map((prompt) => (
        <button
          className="prompt-card"
          key={prompt.label}
          type="button"
          onClick={() => onPromptSelect(prompt.query)}
          disabled={disabled}
          title={prompt.query}
        >
          <span className="prompt-icon">
            <Icon name={prompt.icon} />
          </span>
          <span>{prompt.label}</span>
        </button>
      ))}
    </nav>
  )
}
