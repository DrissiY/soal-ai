// interviewStore.ts
import { create } from 'zustand'

type Interview = {
  id: string
  role: string
  type: string
  techstack: string[]
  createdAt: string
  score?: number
  finalized: boolean
  questions?: string[]
}

interface InterviewState {
  interviews: Interview[]
  fullInterviews: Interview[]
  loading: boolean
  setInterviews: (interviews: Interview[]) => void
  setFullInterviews: (interviews: Interview[]) => void
  setLoading: (state: boolean) => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  interviews: [],
  fullInterviews: [],
  loading: false,
  setInterviews: (interviews) => set({ interviews }),
  setFullInterviews: (fullInterviews) => set({ fullInterviews }),
  setLoading: (loading) => set({ loading }),
}))