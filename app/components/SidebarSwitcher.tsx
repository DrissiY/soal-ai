'use client'

import React, { useEffect, useState } from 'react'
import InterviewCard from '../components/ui/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'

interface SidebarSwitcherProps {
  activePanel: 'explore' | 'profile'
}

const dummyInterviews = [
  {
    id: '1',
    userId: 'user1',
    role: 'Frontend Developer',
    type: 'Technical',
    techstack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    level: 'Junior',
    questions: ['What is React?'],
    finalized: false,
    createdAt: '2024-03-15T10:00:00Z',
    score: '30/100',
  },
  {
    id: '3',
    userId: 'user3',
    role: 'Fullstack Developer',
    type: 'Technical',
    techstack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    level: 'Senior',
    questions: ['How do you handle state in a large app?'],
    finalized: false,
    createdAt: '2024-05-10T08:45:00Z',
    score: '42/100',
  },
  {
    id: '5',
    userId: 'user5',
    role: 'AI Research Assistant',
    type: 'Technical',
    techstack: ['Python', 'TensorFlow', 'NLP', 'LLMs'],
    level: 'Entry',
    questions: [],
    finalized: false,
    createdAt: '2025-06-25T18:00:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    role: 'Backend Developer',
    type: 'Technical',
    techstack: ['Node.js', 'Express', 'PostgreSQL'],
    level: 'Mid',
    questions: ['Explain middleware in Express.js'],
    finalized: true,
    createdAt: '2024-04-01T14:30:00Z',
    score: '55/100',
  },
  {
    id: '4',
    userId: 'user4',
    role: 'UI/UX Designer',
    type: 'Behavioral',
    techstack: ['Figma', 'Framer', 'Design Thinking'],
    level: 'Mid',
    questions: ['Tell us about your design process.'],
    finalized: true,
    createdAt: '2024-06-01T12:00:00Z',
    score: '75/100',
  },
]

const SidebarSwitcher = ({ activePanel }: SidebarSwitcherProps) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      if (currentUser?.name && currentUser?.email) {
        setUser({ name: currentUser.name, email: currentUser.email })
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="w-full md:w-[280px] h-auto md:h-full border-t md:border-t-0 md:border-r border-[#CBDECD] p-4 md:p-6 bg-white overflow-y-auto">
      {activePanel === 'explore' && (
        <>
          <h2 className="text-lg font-semibold mb-4">Interviews</h2>
          <div className="flex flex-col gap-4">
            {[...dummyInterviews]
              .sort((a, b) => Number(a.finalized) - Number(b.finalized))
              .map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={new Date(interview.createdAt).toLocaleDateString()}
                  score={interview.score}
                  finalized={interview.finalized}
                />
              ))}
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
  <p className="text-sm text-gray-500 italic">Loading user info...</p>
)}
        </div>
      )}
    </div>
  )
}

export default SidebarSwitcher