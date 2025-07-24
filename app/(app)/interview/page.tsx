'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Agent from '@/app/components/Agent/Agent'
import { useUserStore } from '@/store/userStore'

const Page = () => {
  const user = useUserStore((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      console.warn('[Page] No user found. Redirecting to home.')
      router.push('/')
    }
  }, [user, router])

  if (!user) return null 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-semibold">Talk to Soal AI</h2>
        <p className="text-gray-600 text-sm">
          Speak with our AI assistant to generate a customized interview for you.
          <br />
          Just tell us what job or topic you want the interview to be about.
        </p>
      </div>

      <Agent
        username={user.name}
        userId={user.id}
        currentUser={user}
        type="generate"
      />
    </div>
  )
}

export default Page