'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface ScoreOverviewProps {
  totalScore: number
}

export const ScoreOverview = ({ totalScore }: ScoreOverviewProps) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const size = 120
  const radius = size / 2 - 6
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(totalScore)
    }, 500)
    return () => clearTimeout(timer)
  }, [totalScore])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
        {/* ScoreCircle */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-purple-500 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {animatedScore}
              </div>
              <div className="text-sm text-gray-500">/ 100</div>
            </div>
          </div>
        </div>

        {/* Text Info */}
        <div className="text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Overall Score</h2>
          <p className="text-gray-600 mb-4">Your interview performance summary</p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Above average performance</span>
          </div>
        </div>
      </div>
    </div>
  )
}