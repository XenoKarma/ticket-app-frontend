import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { User } from '@/types'

export function useItStaff() {
  return useQuery({
    queryKey: ['users', 'it-staff'],
    queryFn: () =>
      api.get<User[]>('/users/it-staff').then((r) => r.data),
  })
}
