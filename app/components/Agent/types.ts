export enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export interface SavedMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type AgentProps = {
  userName: string
  userId: string
  currentUser?: any
  type: 'interview' | 'generate'
  questions?: string[]
  interviewId?: string
}