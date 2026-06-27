import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function useAuthGuard() {
  const { user, token, isLoading, getUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token && !user) {
      getUser()
    }
  }, [token, user, getUser])

  useEffect(() => {
    if (!token && !isLoading) {
      navigate('/login', { replace: true })
    }
  }, [token, isLoading, navigate])

  return { user, isLoading }
}
