'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Brain, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import BubbleVisualizer from '@/app/components/BubbleVisualizer'
import { useUserStore } from '@/store/userStore'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/firebase/client' // your firebase client config
import { handleGoogleAuth } from '@/lib/actions/auth.action'

export default function Home() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const [connecting, setConnecting] = useState(false)

  const handleStartInterview = async () => {
    if (user) {
      router.push('/interview')
      return
    }

    try {
      setConnecting(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      const res = await handleGoogleAuth(idToken)
      if (res.success) {
        // Set user in Zustand manually
        const { displayName, email, photoURL, uid } = result.user
        setUser({ name: displayName, email, profileURL: photoURL, id: uid })
        router.push('/interview')
      } else {
        alert('Login failed')
      }
    } catch (err) {
      console.error('[Google Login Error]', err)
      alert('Something went wrong during login.')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <main className="relative h-screen overflow-ygit bg-[#FFFDF4]">
      <div className="relative z-10 h-full sm:px-12 lg:px-10 flex flex-col">
        {/* Nav */}
        <nav className="flex justify-between items-center py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2"
          />

          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-700"
            >
              Hey <span className="text-purple-700 font-semibold">{user.name}</span> 👋
            </motion.div>
          )}
        </nav>

        {/* Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-6"
              >
                <Image src="/soalai_logo.png" alt="logo" height={100} width={100} />
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">AI-Powered Interviews</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span className="block text-gray-900">Ready for your</span>
                  <span className="block bg-gradient-to-r from-purple-700 via-violet-600 to-green-500 bg-clip-text text-transparent">
                    next big
                  </span>
                  <span className="block text-gray-900">opportunity?</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Simulate real interviews with advanced AI. Get brutally honest feedback.{' '}
                  <span className="text-green-600 font-semibold">Walk in confident, walk out hired.</span>
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-green-600" />
                    <span>AI-Powered Insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span>Industry Experts</span>
                  </div>
                </div>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <button
                  onClick={handleStartInterview}
                  className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center space-x-3">
                    <span>{user ? 'Generate Interview' : '🚀 Start Free Interview'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </motion.div>
            </div>

            {/* Right Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 blur-3xl rounded-full" />
                <BubbleVisualizer volume={10} />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="py-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            Crafted with AI, Made by Younes Drissi — for serious talent like you.
          </p>
        </motion.footer>
      </div>

      {connecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold text-gray-900">Connecting with Google...</h3>
            <p className="text-gray-600">Please wait while we log you in.</p>
          </div>
        </motion.div>
      )}
    </main>
  )
}