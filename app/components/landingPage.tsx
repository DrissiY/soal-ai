'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageLoader = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

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

          {/* Animated SVG Logo */}
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
              <linearGradient id="movingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7F00E7" />
                <stop offset="50%" stopColor="#4EF700" />
                <stop offset="100%" stopColor="#7F00E7" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="-1 0"
                  to="1 0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>

            <path
              fill="url(#movingGradient)"
              d="M146.441 0.143374C194.031 -2.69663 233.111 37.0433 229.171 84.8433C226.131 121.723 196.831 151.863 160.041 155.933C147.511 157.323 135.921 156.243 125.221 152.523C121.721 151.303 116.651 148.163 113.901 145.693L113.861 145.663C113.511 145.363 113.121 145.113 112.721 144.883C112.121 144.533 111.521 144.183 110.921 143.823C109.861 143.383 108.721 143.143 107.541 143.023C107.121 142.973 106.711 142.893 106.281 142.893C99.6807 142.893 94.3407 148.213 94.3407 154.783C94.3407 159.133 96.7107 162.913 100.221 164.983C101.281 165.603 102.431 166.093 103.661 166.363C104.561 166.443 105.441 166.553 106.321 166.663H106.361C111.681 166.653 117.011 167.493 121.951 169.463C143.921 178.223 158.781 199.663 158.781 225.003C158.781 260.463 128.071 288.753 91.8007 284.723C64.5207 281.693 42.3807 259.823 39.0407 232.573C37.1307 216.953 41.2307 202.373 49.3007 190.753C52.9307 185.553 57.7006 181.263 63.0006 177.763C64.3406 176.883 65.4807 175.733 66.3507 174.383C67.5207 172.573 68.2207 170.423 68.2207 168.113C68.2207 161.663 62.9607 156.433 56.4807 156.433C55.4707 156.433 54.4907 156.573 53.5507 156.833C52.4607 157.133 51.4407 157.553 50.4907 158.123C50.3707 158.213 50.1106 158.383 49.7606 158.643C44.7306 162.423 38.7307 164.883 32.4407 164.903H32.2807C12.4607 164.903 -3.1993 147.023 0.560695 126.513C2.8507 114.033 12.6307 103.853 25.0207 101.123C34.4607 99.0534 43.3207 101.133 50.2707 105.863C53.7607 108.233 56.0907 111.863 57.2307 115.933C57.2907 116.133 57.3507 116.323 57.4107 116.483C58.0107 117.443 58.5807 118.443 59.1007 119.463C60.1607 120.863 61.5007 122.023 63.0207 122.913C64.8907 123.993 67.0606 124.633 69.3906 124.633C70.9206 124.633 72.3906 124.363 73.7506 123.883C79.4806 121.833 81.9807 115.043 79.5407 109.453L79.5207 109.403C79.1107 108.473 78.7408 107.533 78.3708 106.593C77.6808 104.833 77.1007 103.023 76.5507 101.203C72.7607 88.9134 71.7607 75.4134 74.9407 61.2534C82.5207 27.4534 111.891 2.21338 146.461 0.153384L146.441 0.143374Z"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PageLoader