'use client'

import { useEffect, useState } from 'react'
import { vapi } from '@/lib/vapi.sdk'
import BubbleVisualizer from './BubbleVisualizer'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/lib/playSound'
import Spinner from './ui/Spinner'

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
  questions?: string[]
}

const Agent = ({ userName, userId, currentUser, questions }: AgentProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const lastMessage = messages[messages.length - 1]

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE)
      setErrorMessage(null)

      try {
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `The call has started with userId: ${userId}`,
          },
        })
      } catch (e) {
        console.error('Failed to send userId message:', e)
      }
    }

    const onCallEnd = () => {
      playSound('/sounds/sound-end.mp3')
      setCallStatus(CallStatus.INACTIVE)
      setIsSpeaking(false)
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
  }, [])

  const handleCall = async () => {
    playSound('/sounds/sound-start.mp3')

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
    if (!currentUser || !assistantId) {
      setErrorMessage('Missing user or assistant ID')
      return
    }

    try {
      setCallStatus(CallStatus.CONNECTING)
      await vapi.start(assistantId, {
        variableValues: {
          username: userName,
          userId: userId,
          questions: questions?.join('\n') || '',
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
    <div className="flex flex-col items-center w-full max-w-md space-y-4 p-4">
      {/* Bubble Visualizer */}
      <AnimatePresence>
        {callStatus === CallStatus.ACTIVE && (
          <motion.div
            key="bubbles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-square overflow-hidden rounded-xl flex items-center justify-center"
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
            className="w-full bg-gray-100 text-gray-800 text-sm rounded-lg p-4 flex flex-col space-y-2 max-h-60 overflow-y-auto"
          >
            <div
              className={`text-sm px-3 py-2 rounded-md max-w-[90%] ${
                lastMessage.role === 'user'
                  ? 'self-end bg-green-500/80 text-white'
                  : lastMessage.role === 'assistant'
                  ? 'self-start bg-purple-600/80 text-white'
                  : 'self-center text-gray-400 italic'
              }`}
            >
              {lastMessage.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {errorMessage && (
        <div className="w-full bg-red-100 text-red-700 text-sm rounded-lg p-3 text-center">
          {errorMessage}
        </div>
      )}

      {/* Call Controls */}
      {callStatus === CallStatus.ACTIVE ? (
        <button
          onClick={handleEndCall}
          className="px-6 py-3 text-md font-medium text-white bg-purple-600 hover:bg-red-600 rounded-full transition-colors duration-200 shadow-lg"
        >
          End the Call
        </button>
      ) : callStatus === CallStatus.INACTIVE ? (
        <button
          onClick={handleCall}
          className="px-6 py-3 text-md font-medium text-white bg-green-600 hover:bg-green-700 rounded-full transition-colors duration-200 shadow-lg"
        >
          Start the Call
        </button>
      ) : (
        <button
          onClick={handleEndCall}
          className="group relative flex items-center gap-2 px-6 py-3 text-md font-medium text-white bg-gray-400 hover:bg-red-500 rounded-full transition-all duration-300 shadow-lg"
        >
          <Spinner className="w-4 h-4" />
          <span className="transition-opacity group-hover:opacity-0 duration-300">
            Generating...
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Cancel
          </span>
        </button>
      )}
    </div>
  )
}

export default Agent