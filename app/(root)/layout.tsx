'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import PageLoader from '../components/landingPage'

const Rootlayout = ({ children }: { children: ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Optional: fake loading when children change
  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timeout)
  }, [children])

  return (
    <div
      className={`w-screen min-h-screen overflow-hidden bg-[#FFFDF4] ${
        isMobile ? 'flex flex-col' : 'flex'
      }`}
    >
      {loading && <PageLoader />}

      <Sidebar />

      <div className={`flex-1 overflow-auto ${isMobile ? 'p-4 pt-2' : 'p-6'}`}>
        {children}
      </div>
    </div>
  )
}

export default Rootlayout