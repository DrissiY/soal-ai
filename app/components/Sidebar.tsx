'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import SidebarSwitcher from './SidebarSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

type PanelType = 'explore' | 'profile' | null

const Sidebar = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [isMobile, setIsMobile] = useState(false)

  const navItems = [
    { id: 'explore', icon: 'material-symbols:explore', name: 'Interviews' },
    { id: 'profile', icon: 'material-symbols:person', name: 'Profile' },
  ]

  const handleClick = (id: PanelType) => {
    setActivePanel((prev) => (prev === id ? null : id))
  }

  // Detect screen size
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return (
    <div className={`flex ${isMobile ? 'flex-col h-auto' : 'h-screen'}`}>
      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? 'w-full border-b border-[#CBDECD] flex justify-center gap-6 py-3 bg-[#FFFDF4]'
            : 'w-20 bg-[#FFFDF4] border-r border-[#CBDECD] flex flex-col items-center justify-between'
        }`}
      >
        <div className={`${isMobile ? 'flex gap-6' : 'flex flex-col gap-6 mt-4 items-center'}`}>
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center gap-1 ${
                isMobile ? 'text-center' : ''
              }`}
            >
              <button
                onClick={() => handleClick(item.id as PanelType)}
                className={`p-2 rounded-full transition ${
                  activePanel === item.id
                    ? 'bg-[#efe2ff] text-primary opacity-100'
                    : 'text-gray-500 opacity-50'
                }`}
              >
                <Icon icon={item.icon} width="28" height="28" />
              </button>
              {!isMobile && (
                <span
                  className={`text-[12px] font-medium ${
                    activePanel === item.id ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

      </aside>

     

      {/* SidebarSwitcher Content */}
      <AnimatePresence mode="wait">
      {activePanel && (
  <motion.div
    key={activePanel}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ type: 'spring', duration: 0.3 }}
    className={`${isMobile ? 'w-full' : ''}`}
  >
    <SidebarSwitcher activePanel={activePanel} />
  </motion.div>
)}

      </AnimatePresence>
    </div>
  )
}

export default Sidebar