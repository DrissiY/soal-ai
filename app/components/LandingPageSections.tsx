'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type PageLoaderProps = {
  text?: string
}

export const PageLoader = ({ text }: PageLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!text) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [text])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, y: 40 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white"
        >
          {/* Top loader bar */}
          <motion.div
            className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-purple-500 to-green-400 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />

          {/* SoalAI SVG logo */}
          <motion.svg
            width="160"
            height="200"
            viewBox="0 0 230 286"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path
              d="M116.55 0L226.11 66.77V200.3L116.55 267.07L7 200.3V66.77L116.55 0ZM116.55 24.39L26.92 77.76V189.32L116.55 242.7L206.18 189.32V77.76L116.55 24.39ZM102.8 86.79H125.69V199.29H102.8V86.79Z"
              fill="url(#gradient)"
            />
          </motion.svg>

          {/* Optional loader text */}
          {text && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-lg font-semibold text-white"
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}