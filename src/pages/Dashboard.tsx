import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { PageLoading } from '@/components/shared/Loading'
import { ErrorState } from '@/components/shared/ErrorState'
import { Ticket, Clock, CheckCircle, XCircle, Headphones } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { Ticket as TicketType } from '@/types'

const statCards = [
  { key: 'open', label: 'Open', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  { key: 'in_progress', label: 'In Progress', icon: Headphones, color: 'text-amber-600 bg-amber-50' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { key: 'closed', label: 'Closed', icon: XCircle, color: 'text-gray-500 bg-gray-50' },
]

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboard()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (isLoading) return <PageLoading />
  if (error) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang, {user?.name}
          </p>
        </div>
        <Button onClick={() => navigate('/tickets/create')}>Buat Tiket Baru</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tiket</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.total_tickets}</div>
          </CardContent>
        </Card>
        {statCards.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`rounded-full p-1.5 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data?.status_counts[stat.key as keyof typeof data.status_counts] || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.assigned_to_me !== null && data!.assigned_to_me! > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Headphones className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              Anda memiliki {data?.assigned_to_me} tiket yang perlu ditangani.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiket Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recent_tickets?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada tiket.
            </p>
          ) : (
            <div className="space-y-3">
              {data?.recent_tickets?.map((ticket: TicketType) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.category?.name} &middot; {ticket.user?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
