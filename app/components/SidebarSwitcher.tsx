'use client'

import React from 'react'
import InterviewCard from '../components/ui/InterviewCard'

interface SidebarSwitcherProps {
  activePanel: 'explore' | 'profile'
}

const dummyInterviews = [
    {
      id: "1",
      userId: "user1",
      role: "Frontend Developer",
      type: "Technical",
      techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      level: "Junior",
      questions: ["What is React?"],
      finalized: false,
      createdAt: "2024-03-15T10:00:00Z",
      score: "30/100",
    },
    {
      id: "3",
      userId: "user3",
      role: "Fullstack Developer",
      type: "Technical",
      techstack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
      level: "Senior",
      questions: ["How do you handle state in a large app?"],
      finalized: false,
      createdAt: "2024-05-10T08:45:00Z",
      score: "42/100",
    },
    {
      id: "5",
      userId: "user5",
      role: "AI Research Assistant",
      type: "Technical",
      techstack: ["Python", "TensorFlow", "NLP", "LLMs"],
      level: "Entry",
      questions: [],
      finalized: false,
      createdAt: "2025-06-25T18:00:00Z",
    },
    {
      id: "2",
      userId: "user2",
      role: "Backend Developer",
      type: "Technical",
      techstack: ["Node.js", "Express", "PostgreSQL"],
      level: "Mid",
      questions: ["Explain middleware in Express.js"],
      finalized: true,
      createdAt: "2024-04-01T14:30:00Z",
      score: "55/100",
    },
    {
      id: "4",
      userId: "user4",
      role: "UI/UX Designer",
      type: "Behavioral",
      techstack: ["Figma", "Framer", "Design Thinking"],
      level: "Mid",
      questions: ["Tell us about your design process."],
      finalized: true,
      createdAt: "2024-06-01T12:00:00Z",
      score: "75/100",
    }
  ]

const SidebarSwitcher = ({ activePanel }: SidebarSwitcherProps) => {
  return (
    <div className="w-[280px] h-full border-r border-[#CBDECD] p-6 flex flex-col">
      {activePanel === 'explore' && (
        <>
          <h2 className="text-lg font-semibold mb-2">Interviews</h2>
          <div
            className="flex flex-col gap-4 overflow-y-auto pr-2 scroll-smooth"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
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
          <p className="text-sm text-gray-600">Your account details appear here.</p>
        </div>
      )}
    </div>
  )
}

export default SidebarSwitcher