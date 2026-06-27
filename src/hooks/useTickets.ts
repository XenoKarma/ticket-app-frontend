import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Ticket, PaginatedResponse, CreateTicketInput } from '@/types'

export function useTickets(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params)
  return useQuery({
    queryKey: ['tickets', 'list', params],
    queryFn: () =>
      api.get<PaginatedResponse<Ticket>>(`/tickets?${searchParams}`).then((r) => r.data),
  })
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['tickets', 'detail', id],
    queryFn: () => api.get<{ data: Ticket }>(`/tickets/${id}`).then((r) => r.data.data),
  })
}

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTicketInput) => {
      const fd = new FormData()
      fd.append('category_id', String(input.category_id))
      fd.append('title', input.title)
      fd.append('description', input.description)
      fd.append('priority', input.priority)
      input.attachments?.forEach((f) => fd.append('attachments[]', f))
      return api.post<Ticket>('/tickets', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets', 'list'] }),
  })
}

export function useUpdateTicket(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Ticket>) => api.put<Ticket>(`/tickets/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', 'list'] })
      qc.invalidateQueries({ queryKey: ['tickets', 'detail', id] })
    },
  })
}

export function useUpdateStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: string) => api.patch<Ticket>(`/tickets/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', 'list'] })
      qc.invalidateQueries({ queryKey: ['tickets', 'detail', id] })
    },
  })
}

export function useAssignTicket(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (assigned_to: number) =>
      api.patch<Ticket>(`/tickets/${id}/assign`, { assigned_to }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', 'list'] })
      qc.invalidateQueries({ queryKey: ['tickets', 'detail', id] })
    },
  })
}

export function useDeleteTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tickets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets', 'list'] }),
  })
}
