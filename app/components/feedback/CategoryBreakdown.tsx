'use client'

import { useEffect, useState } from 'react'

interface CategoryBreakdownProps {
  categoryScores: {
    name: string
    score: number
    comment: string
  }[]
}

const CategoryCard = ({
  title,
  score,
  comment,
  delay = 0,
}: {
  title: string
  score: number
  comment: string
  delay?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`rounded-lg border p-6 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
          <div className="text-xl font-semibold text-gray-900">{score}/10</div>
        </div>
        <div className="w-2 h-12 rounded-full overflow-hidden">
          <div
            className="w-full bg-purple-500 transition-all duration-1000 ease-out"
            style={{ height: isVisible ? `${(score / 10) * 100}%` : '0%' }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3">{comment}</p>
    </div>
  )
}

export default function CategoryBreakdown({
  categoryScores,
}: CategoryBreakdownProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Category Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryScores.map((category, idx) => (
          <CategoryCard
            key={category.name}
            title={category.name}
            score={category.score}
            comment={category.comment}
            delay={idx * 100}
          />
        ))}
      </div>
    </div>
  )
}