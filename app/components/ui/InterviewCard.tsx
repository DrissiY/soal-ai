'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import Link from 'next/link'

export interface InterviewCardProps {
  interviewId?: string
  userId?: string
  role: string
  type: string
  techstack: string[]
  createdAt?: string
  score?: string
  finalized?: boolean
}

const InterviewCard = ({
  interviewId,
  role,
  techstack,
  createdAt,
  score,
  finalized = false,
}: InterviewCardProps) => {
  const [showAll, setShowAll] = useState(false)
  const formattedDate = dayjs(createdAt || Date.now()).format('MMM D, YYYY')
  const displayedTech = showAll ? techstack : techstack.slice(0, 3)
  const hasOverflow = techstack.length > 3

  // Background color: light purple if no score
  const cardBgClass = !score ? 'bg-purple-50' : 'bg-white'

  const redirectTo = !finalized
    ? `/interview/${interviewId}`
    : `/interview/${interviewId}/feedback`

  // Button style: transparent if score, purple if not
  const buttonClass = score
    ? 'bg-transparent text-dark-100 border border-primary-200'
    : 'bg-primary-200 text-dark-100 hover:bg-primary-200/80'

  return (
    <div
      className={`${cardBgClass} w-full p-4 rounded-xl border border-gray-200 flex items-center justify-between gap-4`}
    >
      <div className="flex-1 min-w-0">
        {/* Score */}
        {score && (
          <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium mb-1">
            <Icon icon="mdi:star" width="14" />
            <span>{score}</span>
          </div>
        )}

        {/* Role */}
        <h3 className="font-bold text-base mb-1 truncate">{role}</h3>
        <p className="text-xs text-gray-500 mb-2">{formattedDate}</p>

        {/* Tech Stack */}
        <div className="flex gap-2 flex-wrap">
          {displayedTech.map((item) => (
            <span
              key={item}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
            >
              {item}
            </span>
          ))}

          {hasOverflow && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs px-2 py-1 rounded-full text-gray-600 hover:bg-gray-300 transition"
            >
              ...More
            </button>
          )}
        </div>
      </div>

      {/* Button */}
      <Link href={redirectTo}>
        <button
          className={`flex-shrink-0 rounded-full p-2 transition ${buttonClass}`}
        >
          <Icon icon="material-symbols:arrow-forward-rounded" width="20" />
        </button>
      </Link>
    </div>
  )
}

export default InterviewCard