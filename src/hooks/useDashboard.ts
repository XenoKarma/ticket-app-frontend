import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { DashboardData } from '@/types'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/dashboard').then((r) => r.data),
  })
}
