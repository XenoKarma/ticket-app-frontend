import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTickets } from '@/hooks/useTickets'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { TableLoading } from '@/components/shared/Loading'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Search } from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'sonner'

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export default function TicketManage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, error, refetch } = useTickets({ ...Object.fromEntries(searchParams), all: '1' })
  const [statusLoading, setStatusLoading] = useState<number | null>(null)

  const currentPage = Number(searchParams.get('page')) || 1
  const statusFilter = searchParams.get('status') || ''
  const searchQuery = searchParams.get('search') || ''

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    setSearchParams(params)
  }

  async function quickStatus(ticketId: number, status: string) {
    setStatusLoading(ticketId)
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status })
      toast.success('Status diupdate')
      refetch()
    } catch {
      toast.error('Gagal update status')
    } finally {
      setStatusLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kelola Tiket</h1>
        <p className="text-sm text-muted-foreground">
          Atur status dan assign tiket untuk IT Staff
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari tiket..."
                className="pl-9"
                defaultValue={searchQuery}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { if (v) updateFilter('status', v) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <TableLoading />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !data?.data?.length ? (
        <EmptyState title="Tidak ada tiket" />
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Pelapor</TableHead>
                    <TableHead>Prioritas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead className="text-right">Aksi Cepat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                          {ticket.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ticket.user?.name}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.assignee?.name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          onValueChange={(v) => { if (v) quickStatus(ticket.id, v as string) }}
                          disabled={statusLoading === ticket.id}
                        >
                          <SelectTrigger className="w-[130px] ml-auto">
                            <SelectValue placeholder="Ubah Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {data.meta && data.meta.last_page > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => updateFilter('page', String(currentPage - 1))}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    size="default"
                  />
                </PaginationItem>
                {Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => updateFilter('page', String(page))}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                      size="default"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => updateFilter('page', String(currentPage + 1))}
                    className={
                      currentPage >= data.meta.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                    size="default"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
