'use client'

import { useEffect } from 'react'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { useUserStore } from '@/store/userStore'

export const AuthInitializer = () => {
  const { user, setUser } = useUserStore()

  useEffect(() => {
    if (!user) {
      getCurrentUser().then((u) => {
        if (u) setUser(u)
      })
    }
  }, [user, setUser])

  return null
}