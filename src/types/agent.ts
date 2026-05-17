export type ChartPoint = {
  x: string | number
  y: string | number
}

export type ChartSeries = {
  name: string
  data: ChartPoint[]
}

export type AgentChart = {
  chartType?: string
  title?: string
  xField?: string
  yField?: string
  series?: ChartSeries[]
  unit?: string
  notes?: string
}

export type AgentSource = {
  id?: string
  title?: string
  source?: string
  score?: number
}

export type AgentResponse = {
  text?: string
  charts?: AgentChart[] | null
  highlights?: string[] | null
  sources?: AgentSource[] | null
  followUpQuestions?: string[] | null
  [key: string]: unknown
}

export type MessageStatus = 'sample' | 'live' | 'error'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text?: string
  response?: AgentResponse
  status?: MessageStatus
}

export type IconName =
  | 'agent'
  | 'balance'
  | 'building'
  | 'chart'
  | 'check'
  | 'code'
  | 'database'
  | 'link'
  | 'memory'
  | 'plus'
  | 'send'
  | 'shield'
  | 'spark'
  | 'star'
  | 'truck'

export type PromptCard = {
  icon: IconName
  label: string
  query: string
}

export type SummaryRow = {
  label: string
  value: string
}
