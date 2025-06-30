import React from 'react'
import BubbleVisualizer from './BubbleVisualizer'

export enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED"
}

type AgentProps = {
  callStatus: CallStatus
  onEndCall?: () => void
  messages?: string[] // list of messages, AI or user
}

const Agent = ({ callStatus, onEndCall, messages }: AgentProps) => {
  const isSpeaking = true

  const lastMessage =
    messages && messages.length > 0
      ? messages[messages.length - 1]
      : 'Waiting for a response...'

  return (
    <div className="flex flex-col items-center w-full max-w-md space-y-4">
      {isSpeaking && (
        <div className="w-full aspect-square overflow-hidden rounded-xl">
          <BubbleVisualizer volume={2} />
        </div>
      )}

      <div className="w-full bg-gray-100 text-gray-800 text-sm rounded-lg p-4">
        {lastMessage}
      </div>

      {callStatus === CallStatus.ACTIVE && (
        <button
          onClick={onEndCall}
          className="px-6 py-3 text-md font-medium text-white bg-purple-600 hover:bg-red-600 rounded-full transition-colors duration-200"
        >
          End the Call
        </button>
      )}
    </div>
  )
}

export default Agent