'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'

const Rootlayout = ({ children }: { children: ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return (
    <div
      className={`w-screen min-h-screen overflow-hidden bg-[#FFFDF4] ${
        isMobile ? 'flex flex-col' : 'flex'
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Children */}
      <div className={`flex-1 overflow-auto ${isMobile ? 'p-4 pt-2' : 'p-6'}`}>
        {children}
      </div>
    </div>
  )
}

export default Rootlayout