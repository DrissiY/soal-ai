'use client'

import React, { useEffect } from 'react'
import InterviewCard from '../components/ui/InterviewCard'
import { getInterviewsByUserId } from '@/lib/actions/general.action'
import { useUserStore } from '@/store/userStore'
import { useInterviewStore } from '@/store/interviewStore'
import Spinner from '@/app/components/ui/Spinner'

interface SidebarSwitcherProps {
  activePanel: 'explore' | 'profile'
}

const SidebarSwitcher = ({ activePanel }: SidebarSwitcherProps) => {
  const user = useUserStore((s) => s.user)
  const { interviews, setInterviews, loading, setLoading } = useInterviewStore()

  useEffect(() => {
    async function fetch() {
      if (!user?.id) return
      setLoading(true)

      const data = await getInterviewsByUserId(user.id)

      if (data) {
        const processed = data.map((i: any) => ({
          id: i.id,
          role: i.role,
          type: i.type,
          techstack: i.techstack,
          createdAt: new Date(i.createdAt).toLocaleDateString(),
          score: i.score,
          finalized: i.finalized,
        }))
        setInterviews(processed)
      }

      setLoading(false)
    }

    fetch()
  }, [user?.id])

  return (
    <div className="w-full md:w-[280px] h-auto md:h-full border-t md:border-t-0 md:border-r border-[#CBDECD] p-4 md:p-6 bg-transparent overflow-y-auto">
      {activePanel === 'explore' && (
        <>
          <h2 className="text-lg font-semibold mb-4">Interviews</h2>
          <div className="flex flex-col gap-4">
            {loading ? (
              <Spinner />
            ) : interviews.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No interviews yet.</p>
            ) : (
              interviews
                .sort((a, b) => Number(a.finalized) - Number(b.finalized))
                .map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                    score={interview.score}
                    finalized={interview.finalized}
                  />
                ))
            )}
          </div>
        </>
      )}

      {activePanel === 'profile' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          {user ? (
            <>
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>

              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={() => console.log('TODO: implement logout')}
                  className="text-sm text-gray-600 hover:text-black transition text-left"
                >
                  Log out
                </button>

                <button
                  onClick={() => console.log('TODO: delete account logic')}
                  className="text-sm text-red-500 hover:underline text-left"
                >
                  Delete my account
                </button>
              </div>
            </>
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </div>
  )
}

export default SidebarSwitcher