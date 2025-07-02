// components/PageLoader.tsx
'use client'

import { motion } from 'framer-motion'

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none"
    >
      <motion.div
        className="h-[2px] w-[100%] bg-gradient-to-r from-purple-500 to-green-400 absolute top-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformOrigin: 'left' }}
      />

      <motion.h1
        className="text-5xl font-handwriting text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Solar
      </motion.h1>
    </motion.div>
  )
}

export default PageLoader