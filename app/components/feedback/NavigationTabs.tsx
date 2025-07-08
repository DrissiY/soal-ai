// components/NavigationTabs.tsx
'use client'

import { Target, Brain, Lightbulb } from 'lucide-react'

export default function NavigationTabs({ activeTab, setActiveTab }: {
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'detailed', label: 'Questions', icon: Brain },
    { id: 'insights', label: 'Assessment', icon: Lightbulb },
  ]

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
