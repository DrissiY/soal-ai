'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useFeedbackStore } from '@/store/feedbackStore'
import { getFeedbackByInterviewId } from '@/lib/actions/general.action'
import NavigationTabs from '@/app/components/feedback/NavigationTabs'
import { ScoreOverview } from '@/app/components/feedback/ScoreOverview'
import CategoryBreakdown from '@/app/components/feedback/CategoryBreakdown'
import StrengthsImprovements from '@/app/components/feedback/StrengthsImprovements'
import { QuestionDetails } from '@/app/components/feedback/QuestionDetails'
import { FinalAssessment } from '@/app/components/feedback/FinalAssessment'

export type Feedback = {
  id: string
  interviewId: string
  userId?: string
  totalScore: number
  finalAssessment: string
  strengths: string[]
  areasForImprovement: string[]
  categoryScores: {
    name: string
    score: number
    comment: string
  }[]
  questions: {
    question: string
    answer: string
    score: number
    comment?: string
  }[]
  createdAt: string
}

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()

  
  const interviewId = params?.id as string
  

  const feedback = useFeedbackStore((s) => s.feedback)
  const setFeedback = useFeedbackStore((s) => s.setFeedback)

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't proceed if we don't have an interviewId
    if (!interviewId) {
      console.error('No interviewId found in params')
      setError('No interview ID found')
      setLoading(false)
      return
    }

    const loadFeedback = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Loading feedback for interviewId:', interviewId)
        
        const result = await getFeedbackByInterviewId({ interviewId: interviewId })
        console.log('Feedback result:', result)
        
        if (!result) {
          throw new Error(`No feedback found for interview ID: ${interviewId}`)
        }
        
        setFeedback(result)
      } catch (err) {
        console.error('[FeedbackPage] Error loading feedback:', err)
        setError(err instanceof Error ? err.message : 'Failed to load feedback')
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [interviewId, setFeedback])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
          {interviewId && <p className="text-sm text-gray-500 mt-2">Interview ID: {interviewId}</p>}
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Feedback Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/interview')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Take New Interview
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show no feedback state
  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Feedback Available</h2>
          <p className="text-gray-600 mb-4">No feedback found for this interview session.</p>
          <button
            onClick={() => router.push('/interview')}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Take New Interview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => router.push('/interview')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retake the Interview
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Interview Feedback
          </h1>
          <p className="text-gray-600">Session ID: {interviewId}</p>
        </div>

        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'overview' && (
          <>
            <ScoreOverview totalScore={feedback.totalScore} />
<CategoryBreakdown categoryScores={feedback.categoryScores} />
            <StrengthsImprovements
              strengths={feedback.strengths}
              areasForImprovement={feedback.areasForImprovement}
            />
          </>
        )}

        {activeTab === 'detailed' && (
          <QuestionDetails questions={feedback.questions} />
        )}

        {activeTab === 'insights' && (
          <FinalAssessment finalAssessment={feedback.finalAssessment} />
        )}
      </div>
    </div>
  )
}