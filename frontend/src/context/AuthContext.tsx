import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../helper/api'

interface AuthUser {
  token: string
  name: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: AuthUser | null
  login: (googleToken: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (googleToken: string) => {
    const { data } = await api.post('/auth/google', { idToken: googleToken })
    localStorage.setItem('auth', JSON.stringify(data))
    setUser(data)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // token already expired or revoked — proceed anyway
    }
    localStorage.removeItem('auth')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
