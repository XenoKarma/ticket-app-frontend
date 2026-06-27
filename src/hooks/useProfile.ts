import { useMutation } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: { name: string; email: string }) => api.put('/profile', data),
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) =>
      api.put('/profile/password', data),
  })
}
