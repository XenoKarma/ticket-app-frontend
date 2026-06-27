import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Category } from '@/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<{ data: Category[] }>('/categories').then((r) => r.data.data),
  })
}
