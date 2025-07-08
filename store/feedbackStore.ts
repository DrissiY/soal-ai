// store/feedbackStore.ts
import { create } from 'zustand'

interface Feedback {
  totalScore: number
  categoryScores: Record<string, number>
  strengths: string[]
  areasForImprovement: string[]
  finalAssessment: string
  questions: {
    question: string
    answer: string
    comment: string
    score: number
  }[]
}

interface FeedbackStore {
  feedback: Feedback | null
  setFeedback: (feedback: Feedback) => void
  clearFeedback: () => void
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedback: null,
  setFeedback: (feedback) => set({ feedback }),
  clearFeedback: () => set({ feedback: null }),
}))