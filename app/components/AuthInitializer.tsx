'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'

export const AuthInitializer = () => {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me') // 👈 This will call your edge API route
        if (!res.ok) return
        const user = await res.json()
        setUser(user)
      } catch (err) {
        console.error('[AuthInit] Failed to load user', err)
      }
    }

    fetchUser()
  }, [setUser])

  return null
}