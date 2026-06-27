import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTickets } from '@/hooks/useTickets'
import { useCategories } from '@/hooks/useCategories'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { TableLoading } from '@/components/shared/Loading'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataPagination } from '@/components/shared/DataPagination'
import { Button } from '@/components/ui/button'
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
import { PlusCircle, Search } from 'lucide-react'

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
]

const priorityOptions = [
  { value: '', label: 'Semua Prioritas' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export default function TicketList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data, isLoading, error, refetch } = useTickets(Object.fromEntries(searchParams))
  const { data: categories } = useCategories()

  const statusFilter = searchParams.get('status') || ''
  const priorityFilter = searchParams.get('priority') || ''
  const categoryFilter = searchParams.get('category') || ''
  const searchQuery = searchParams.get('search') || ''

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page') params.delete('page')
    setSearchParams(params)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Semua Tiket</h1>
          <p className="text-sm text-muted-foreground">
            Kelola seluruh tiket yang masuk
          </p>
        </div>
        <Button onClick={() => navigate('/tickets/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tiket Baru
        </Button>
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
                <SelectValue placeholder="Status">
                  {statusOptions.find((o) => o.value === statusFilter)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { if (v) updateFilter('priority', v) }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioritas">
                  {priorityOptions.find((o) => o.value === priorityFilter)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => { if (v) updateFilter('category', v) }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Kategori">
                  {categories?.find((c) => String(c.id) === categoryFilter)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Kategori</SelectItem>
                {categories?.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
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
        <EmptyState
          title="Tidak ada tiket"
          description="Belum ada tiket yang sesuai dengan filter Anda."
        />
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Prioritas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pelapor</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {ticket.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.category?.name}
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.user?.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {data.meta && data.meta.last_page > 1 && (
            <DataPagination meta={data.meta} onPageChange={(p) => updateFilter('page', String(p))} />
          )}
        </>
      )}
    </div>
  )
}
