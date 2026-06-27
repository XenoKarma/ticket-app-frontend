import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Comment, CreateCommentInput } from '@/types'

export function useComments(ticketId: number) {
  return useQuery({
    queryKey: ['tickets', 'detail', ticketId, 'comments'],
    queryFn: () =>
      api.get<{ data: Comment[] }>(`/tickets/${ticketId}/comments`).then((r) => r.data.data),
  })
}

export function useCreateComment(ticketId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      api.post<Comment>(`/tickets/${ticketId}/comments`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', 'detail', ticketId, 'comments'] })
      qc.invalidateQueries({ queryKey: ['tickets', 'detail', ticketId] })
    },
  })
}
