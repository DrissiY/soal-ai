'use client'

import { CheckCircle, Target } from 'lucide-react'

interface StrengthsImprovementsProps {
  strengths: string[]
  areasForImprovement: string[]
}

export default function StrengthsImprovements({
  strengths,
  areasForImprovement,
}: StrengthsImprovementsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mt-8">
      {/* Strengths */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-gray-100 p-2 rounded-lg mr-3">
            <CheckCircle className="text-gray-700 w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Your Strengths</h3>
        </div>
        <div className="space-y-4">
          {strengths.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mt-0.5 mr-3 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="font-medium leading-relaxed">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-gray-100 p-2 rounded-lg mr-3">
            <Target className="text-gray-700 w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Growth Opportunities</h3>
        </div>
        <div className="space-y-4">
          {areasForImprovement.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mt-0.5 mr-3 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="font-medium leading-relaxed">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}