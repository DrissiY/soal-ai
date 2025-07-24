'use client'

import { useAgentController } from './useAgentController'
import BubbleVisualizer from '../BubbleVisualizer'
import Spinner from '../ui/Spinner'
import { AnimatePresence, motion } from 'framer-motion'
import { AgentProps, CallStatus } from './types'

const Agent = (props: AgentProps) => {
  const {
    callStatus,
    lastMessage,
    errorMessage,
    handleCall,
    handleEndCall,
    isLoadingFeedback, // ✅ now used
  } = useAgentController(props)

  // ✅ Fullscreen loader when sending feedback
  if (isLoadingFeedback) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">
        <Spinner className="w-10 h-10 mb-4" />
        <p className="text-sm text-white/70">Génération du feedback en cours...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md space-y-6 p-6">
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