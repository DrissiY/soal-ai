'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Agent from '@/app/components/Agent'
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
  console.log('[InterviewPage] Current interview:', currentInterview)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const fetchInterview = async () => {
      if (!interviewId) return

      const localInterview = interviews.find((i) => i.id === interviewId)
      if (localInterview) {
        console.log('[InterviewPage] Using local interview')
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
    <div className="min-h-screen bg-transparent relative overflow-hidden flex justify-center">
      <div className="relative z-10 w-full px-4 md:px-20 py-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-700 font-medium text-sm">Your Session</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 leading-relaxed">
            AI Interview Assistant
          </h2>
          <p className="text-gray-600 text-sm">
            Speak naturally and clearly. The AI will guide you through the interview process.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center text-lg font-bold text-white">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{user.name}</h3>
                <p className="text-gray-600 text-sm">Interview Candidate</p>
              </div>

              {currentInterview && (
                <div className="bg-gray-100 rounded-xl p-4 space-y-2">
                  <h4 className="text-gray-900 font-medium mb-2 text-sm">Interview Details</h4>
                  <InfoRow label="Interview ID" value={currentInterview.id} />
                  <InfoRow label="Role" value={currentInterview.role} capitalize />
                  <InfoRow label="Type" value={currentInterview.type} capitalize />
                  <InfoRow label="Created At" value={currentInterview.createdAt} />

                  {currentInterview.techstack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {currentInterview.techstack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-purple-200 text-purple-800 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-center min-h-[300px]">
                <Agent
                  userName={user.name}
                  userId={user.id}
                  currentUser={user}
                  type="interview"
                  questions={questions}
                  interviewId={interviewId}
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => router.push('/interview')}
                  className="text-sm text-purple-700 hover:text-purple-900 underline transition-all"
                >
                  Generate Another Interview
                </button>
              </div>
            </div>
          </div>
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
  <div className="flex justify-between text-xs">
    <span className="text-gray-600">{label}:</span>
    <span className={`text-gray-900 ${capitalize ? 'capitalize' : ''}`}>{value}</span>
  </div>
)

export default InterviewPage