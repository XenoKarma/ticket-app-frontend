import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Category } from '@/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  })
}
