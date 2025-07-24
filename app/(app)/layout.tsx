'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import PageLoader from '../components/landingPage'
import { AuthInitializer } from '@/app/components/AuthInitializer'

const Rootlayout = ({ children }: { children: ReactNode }) => {
  const [showLoader, setShowLoader] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setShowLoader(false), 1200)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {showLoader && <PageLoader />}

      <div
        className={`w-screen h-screen overflow-hidden bg-[#FFFDF4] ${
          isMobile ? 'flex flex-col' : 'flex'
        }`}
      >
        <Sidebar />
        <div
          className={`flex-1 h-full overflow-auto ${
            isMobile ? 'p-4 pt-2' : ''
          }`}
        >
          <AuthInitializer />
          {children}
        </div>
      </div>
    </>
  )
}

export default Rootlayout