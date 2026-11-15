import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('talentiq_user')
    const token = localStorage.getItem('talentiq_token')
    if (!raw || !token) return null
    return { ...JSON.parse(raw), token } as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser)

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: (nextUser) => {
      localStorage.setItem('talentiq_token', nextUser.token)
      localStorage.setItem('talentiq_user', JSON.stringify({
        id: nextUser.id,
        fullName: nextUser.fullName,
        email: nextUser.email,
        role: nextUser.role,
      }))
      setUser(nextUser)
    },
    logout: () => {
      localStorage.removeItem('talentiq_token')
      localStorage.removeItem('talentiq_user')
      setUser(null)
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
