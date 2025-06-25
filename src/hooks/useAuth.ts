'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated')
      setIsAuthenticated(authStatus === 'true')
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}