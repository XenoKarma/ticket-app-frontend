import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useUserList() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => api.get<{ data: any[] }>('/users').then((r) => r.data.data),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role: string }) =>
      api.post('/users', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'all'] }),
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      api.put(`/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'all'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'all'] }),
  })
}
