"use client"



interface Question {
  question: string
  answer: string
  comment: string
  score: number
}

interface QuestionDetailsProps {
  questions: Question[]
}

export const QuestionDetails = ({ questions }: QuestionDetailsProps) => {
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {idx + 1}
              </div>
              <span className="text-lg font-medium text-gray-900">
                Question {idx + 1}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-purple-600">
                {q.score}/10
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Question</p>
              <p className="text-gray-900">{q.question}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Your Answer</p>
              <p className="text-gray-700">{q.answer}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-700 mb-2">Feedback</p>
              <p className="text-purple-900">{q.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
