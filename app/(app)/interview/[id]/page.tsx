'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Agent from '@/app/components/Agent/Agent'
import { useUserStore } from '@/store/userStore'
import { useInterviewStore } from '@/store/interviewStore'
import { getInterviewById } from '@/lib/actions/general.action'

const InterviewPage = () => {
  const user = useUserStore((s) => s.user)
  const router = useRouter()
  const { id } = useParams()
  const interviewId = Array.isArray(id) ? id[0] : id

  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<string[] | undefined>(undefined)

  const { interviews, setInterviews } = useInterviewStore()
  const currentInterview = interviews.find((i) => i.id === interviewId)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const fetchInterview = async () => {
      if (!interviewId) return
      const localInterview = interviews.find((i) => i.id === interviewId)
      if (localInterview) {
        setQuestions(localInterview.questions || [])
        setLoading(false)
        return
      }

      try {
        const interview = await getInterviewById(interviewId)
        if (interview) {
          const alreadyExists = interviews.some((i) => i.id === interview.id)
          if (!alreadyExists) {
            setInterviews([...interviews, interview])
          }
          setQuestions(interview.questions || [])
        } else {
          router.push('/')
        }
      } catch (err) {
        console.error('[InterviewPage] Failed to fetch interview:', err)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [user, interviewId, router, setInterviews, interviews])

  if (!user || loading) return null

  return (
    <div className="min-h-screenp-4  sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1 text-sm font-medium mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Session
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AI Interview Assistant
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mt-2">
            Speak naturally and clearly. The AI will guide you through the interview process.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4  gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6">
              {/* Profile */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto text-lg font-bold">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold mt-3">{user.name}</h3>
                <p className="text-sm text-gray-500">Interview Candidate</p>
              </div>

              {/* Info */}
              {currentInterview && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
                    Interview Details
                  </h4>
                  <div className="space-y-3">
                    <InfoRow label="Interview ID" value={currentInterview.id} />
                    <InfoRow label="Role" value={currentInterview.role} capitalize />
                    <InfoRow label="Type" value={currentInterview.type} capitalize />
                    <InfoRow label="Created At" value={currentInterview.createdAt} />
                    {currentInterview.techstack?.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 mb-1">Tech Stack:</p>
                        <div className="flex flex-wrap gap-2">
                          {currentInterview.techstack.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Section */}
          <main className="lg:col-span-3 order-1 rounded-2xl border border-gray-200 lg:order-2">
            <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
              {/* Chat Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-500">AI Assistant is ready</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  Online
                </div>
              </div>

              {/* Chat UI */}
              <div className="bg-white rounded-xl  flex justify-center items-center min-h-[400px] sm:min-h-[500px] p-4">
                <Agent
                  username={user.name}
                  userId={user.id}
                  currentUser={user}
                  type="interview"
                  questions={questions}
                  interviewId={interviewId}
                />
              </div>

              {/* Footer */}
              <div className="text-center">
                <button
                  onClick={() => router.push('/interview')}
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  ➕ Generate Another Interview
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({
  label,
  value,
  capitalize = false,
}: {
  label: string
  value: string
  capitalize?: boolean
}) => (
  <div className="flex justify-between text-sm text-gray-700">
    <span className="font-medium">{label}:</span>
    <span className={`${capitalize ? 'capitalize' : ''} text-right max-w-[60%] truncate`}>
      {value}
    </span>
  </div>
)

export default InterviewPage