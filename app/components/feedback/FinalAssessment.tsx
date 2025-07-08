'use client'

import { FC } from 'react'

interface FinalAssessmentProps {
  finalAssessment: string
}

export const FinalAssessment: FC<FinalAssessmentProps> = ({ finalAssessment }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Final Assessment</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{finalAssessment}</p>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">1</div>
            <p className="text-gray-700">Practice technical explanations with real-world examples</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">2</div>
            <p className="text-gray-700">Build confidence through additional mock interviews</p>
          </div>
        </div>
      </div>
    </div>
  )
}