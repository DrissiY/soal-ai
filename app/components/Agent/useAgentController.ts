'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { vapi } from '@/lib/vapi.sdk'
import { playSound } from '@/lib/playSound'
import { AgentProps, CallStatus, SavedMessage } from './types'

export const useAgentController = ({
  userName,
  userId,
  currentUser,
  type,
  questions,
  interviewId,
}: AgentProps) => {
  const router = useRouter()

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const transcriptRef = useRef<SavedMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)

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

    const onCallEnd = async () => {
      playSound('/sounds/sound-end.mp3')
      setCallStatus(CallStatus.INACTIVE)
      setIsSpeaking(false)

      const transcript = transcriptRef.current
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n')

      console.log('[📦 Raw Transcript]', transcriptRef.current)

      if (type === 'interview' && interviewId) {
        try {
          setIsLoadingFeedback(true)
          console.log('[📤 Sending to Feedback API]', {
            interviewId,
            userId,
            transcript,
          })

          const res = await fetch('/api/vapi/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interviewId,
              userId,
              transcript,
            }),
          })

          const result = await res.json()
          console.log('[✅ Feedback API Result]', result)
        } catch (err) {
          console.error('[❌ Feedback API Error]', err)
        } finally {
          transcriptRef.current = []
          setMessages([])
          // 👇 Delay a bit to ensure UI sees loading before navigating
          setTimeout(() => {
            setIsLoadingFeedback(false)
            router.push(`/feedback/${interviewId}`)
          }, 500)
        }
      } else if (type === 'generate') {
        try {
          console.log('[📤 Sending to GENERATE API]', {
            userId,
            transcript,
          })

          const res = await fetch('/api/vapi/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              transcript,
            }),
          })

          const result = await res.json()
          console.log('[✅ GENERATE API Result]', result)
        } catch (err) {
          console.error('[❌ GENERATE API Error]', err)
        } finally {
          transcriptRef.current = []
          setMessages([])
        }
      }
    }

    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript || '',
        }
        transcriptRef.current.push(newMessage)
        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = (error: Error) => {
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
  }, [type, userId, questions, interviewId])

  const handleCall = async () => {
    playSound('/sounds/sound-start.mp3')

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
          ...(type === 'interview' ? { questions: questions?.join('\n'), interviewId } : {}),
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
    setCallStatus(CallStatus.INACTIVE)
  }

  return {
    callStatus,
    isSpeaking,
    lastMessage,
    errorMessage,
    isLoadingFeedback, // ✅ exposed to show loader in Agent.tsx
    handleCall,
    handleEndCall,
  }
}