import React, { ReactNode } from 'react'
import Sidebar from '../components/Sidebar'


const Rootlayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFFDF4]">
      {/* Sidebar - fixed width */}
      <Sidebar />



      {/* Children - takes remaining width */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  )
}

export default Rootlayout