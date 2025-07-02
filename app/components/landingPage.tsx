'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageLoader = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2200) // Slightly more than progress bar

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, y: 40 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          {/* Progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-purple-500 to-green-400 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />

          {/* Handwriting Soal Text */}
          <motion.h1
            className="text-6xl text-white font-handwriting tracking-wider"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Soal
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PageLoader