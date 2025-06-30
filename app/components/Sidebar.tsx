'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import SidebarSwitcher from './SidebarSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

type PanelType = 'explore' | 'profile' | null

const Sidebar = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(null)

  const navItems = [
    { id: 'explore', icon: 'material-symbols:explore', name: 'Explore' },
    { id: 'profile', icon: 'material-symbols:person', name: 'Profile' },
  ]

  const handleClick = (id: PanelType) => {
    setActivePanel((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex h-screen">
      {/* Left Icon Sidebar */}
      <aside className="w-20 bg-[#FFFDF4] border-r border-[#CBDECD] flex flex-col items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-6 mt-4 items-center">
          {navItems.map((item) => (
  <div key={item.id} className="flex flex-col items-center gap-1">
    <button
      onClick={() => handleClick(item.id as PanelType)}
      className={`p-2 rounded-full transition ${
        activePanel === item.id
          ? 'bg-[#FFF6D4] text-primary opacity-100'
          : 'text-gray-500 opacity-50'
      }`}
    >
      <Icon icon={item.icon} width="28" height="28" />
    </button>
    <span className={`text-[12px] font-medium ${
      activePanel === item.id ? 'text-primary' : 'text-gray-400'
    }`}>
      {item.id === 'explore' ? 'Interviews' : 'Profile'}
    </span>
  </div>
))}
          </div>
        </div>

        <button className="text-gray-400 hover:text-red-500 transition mb-4">
          <Icon icon="material-symbols:logout" width="28" height="28" />
        </button>
      </aside>

      {/* Animated Content Panel */}
      <AnimatePresence mode="wait">
        {activePanel && (
          <motion.div
            key={activePanel}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <SidebarSwitcher activePanel={activePanel} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Sidebar