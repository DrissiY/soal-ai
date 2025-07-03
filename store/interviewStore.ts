import { create } from 'zustand'

type Interview = {
  id: string
  role: string
  type: string
  techstack: string[]
  createdAt: string
  score?: string
  finalized: boolean
}

type InterviewStore = {
  interviews: Interview[]
  loading: boolean
  setInterviews: (data: Interview[]) => void
  setLoading: (loading: boolean) => void
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  interviews: [],
  loading: true,
  setInterviews: (data) => set({ interviews: data }),
  setLoading: (loading) => set({ loading }),
}))