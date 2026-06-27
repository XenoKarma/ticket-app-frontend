import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import api from '@/lib/axios'
import type { User, LoginInput, RegisterInput, AuthResponse } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (input: LoginInput) => {
    const { data } = await api.post<AuthResponse>('/auth/login', input)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const { data } = await api.post<AuthResponse>('/auth/register', input)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const getUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get<User>('/auth/user')
      setUser(data)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
