'use client'

import { useEffect, useState } from 'react'
import { vapi } from '@/lib/vapi.sdk'
import BubbleVisualizer from './BubbleVisualizer'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/lib/playSound'
import Spinner from './ui/Spinner'
import { useRouter } from 'next/navigation'



export enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type AgentProps = {
  userName: string
  userId: string
  currentUser?: any
  type: 'interview' | 'generate'
  questions?: string[]
    interviewId?: string
}

const Agent = ({ userName, userId, currentUser, type, questions,interviewId }: AgentProps) => {
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const lastMessage = messages[messages.length - 1]
  const isInterview = type === 'interview' && questions && questions.length > 0

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE)
      setErrorMessage(null)

      try {
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `The call has started with userId: ${userId}. Type: ${type}`,
          },
        })

      if (isInterview) {
  console.log('[Interview Questions Sent to Vapi]', questions)

  vapi.send({
    type: 'add-message',
    message: {
      role: 'system',
      content: [
        `Structured interview started.`,
        `User ID: ${userId}`,
        `Interview ID: ${interviewId}`,
        `Questions:\n${questions.join('\n')}`,
      ].join('\n'),
    },
  })
}
      } catch (e) {
        console.error('Failed to send metadata on call start:', e)
      }
    }

  const onCallEnd = () => {
  playSound('/sounds/sound-end.mp3')
  setCallStatus(CallStatus.INACTIVE)
  setIsSpeaking(false)

  if (type === 'interview' && interviewId) {
    router.push(`/feedback/${interviewId}`)
  }
}

    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript || '',
        }
        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = (error: any) => {
      console.error('[VAPI ERROR]', error)
      setErrorMessage(`Vapi Error: ${error.message || 'Unknown error'}`)
      setCallStatus(CallStatus.INACTIVE)
      setIsSpeaking(false)
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  }, [type, userId, questions])

  const handleCall = async () => {
  playSound('/sounds/sound-start.mp3')

  // Strictly fetch based on type
  let assistantId: string | undefined

  if (type === 'interview') {
    assistantId = process.env.NEXT_PUBLIC_INTERVIEW_ASSISTANT_ID
    if (!assistantId) {
      setErrorMessage('Interview assistant ID is missing in environment variables.')
      return
    }
  } else if (type === 'generate') {
    assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
    if (!assistantId) {
      setErrorMessage('Generate assistant ID is missing in environment variables.')
      return
    }
  } else {
    setErrorMessage('Invalid assistant type.')
    return
  }

  if (!currentUser) {
    setErrorMessage('User not found. Please log in again.')
    return
  }

  try {
    setCallStatus(CallStatus.CONNECTING)

  await vapi.start(assistantId, {
  variableValues: {
    username: userName,
    userId,
    ...(type === 'interview' ? {
      questions: questions?.join('\n'),
      interviewId,
    } : {}),
  },
})
  } catch (err) {
    console.error('[VAPI] Call Error:', err)
    setErrorMessage('Error starting the call: ' + (err as Error).message)
    setCallStatus(CallStatus.INACTIVE)
    setIsSpeaking(false)
  }
}

  const handleEndCall = () => {
    playSound('/sounds/sounds-end.mp3')
    vapi.stop()
    setIsSpeaking(false)
    setMessages([])
    setCallStatus(CallStatus.INACTIVE)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md space-y-6 p-6">
      {/* Bubble Visualizer */}
      <AnimatePresence>
        {callStatus === CallStatus.ACTIVE && (
          <motion.div
            key="bubbles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-square overflow-hidden rounded-2xl backdrop-blur-md flex items-center justify-center"
          >
            <BubbleVisualizer
              volume={1.5}
              speaker={lastMessage?.role === 'user' ? 'user' : 'ai'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript */}
      <AnimatePresence>
        {callStatus === CallStatus.ACTIVE && lastMessage && (
          <motion.div
            key="transcript"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              className={`text-sm px-4 py-3 rounded-xl max-w-[90%] backdrop-blur-sm ${
                lastMessage.role === 'user'
                  ? 'self-end bg-green-500/80 text-white ml-auto'
                  : lastMessage.role === 'assistant'
                  ? 'self-start bg-purple-600/80 text-white'
                  : 'self-center text-white/70 italic bg-white/10'
              } shadow-md`}
            >
              {lastMessage.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full backdrop-blur-md bg-red-500/20 border border-red-500/30 text-red-100 text-sm rounded-2xl p-4 text-center shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Controls */}
      <AnimatePresence mode="wait">
        {callStatus === CallStatus.ACTIVE ? (
          <motion.button
            key="end-call"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEndCall}
            className="px-8 py-4 text-white font-medium bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/90 hover:to-red-700/90 rounded-full backdrop-blur-md border border-red-400/30 shadow-xl transition-all duration-300"
          >
            End the Call
          </motion.button>
        ) : callStatus === CallStatus.INACTIVE ? (
          <motion.button
            key="start-call"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCall}
            className="px-8 py-4 text-white font-medium bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-600/90 hover:to-green-700/90 rounded-full backdrop-blur-md border border-green-400/30 shadow-xl transition-all duration-300"
          >
            Start the Call
          </motion.button>
        ) : (
          <motion.button
            key="connecting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleEndCall}
            className="group relative flex items-center gap-3 px-8 py-4 text-white font-medium bg-gradient-to-r from-gray-500/60 to-gray-600/60 hover:from-red-500/80 hover:to-red-600/80 rounded-full backdrop-blur-md border border-gray-400/30 shadow-xl transition-all duration-300"
          >
            <Spinner className="w-5 h-5" />
            <span className="transition-opacity group-hover:opacity-0 duration-300">
              Connecting...
            </span>
            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Cancel
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Agent