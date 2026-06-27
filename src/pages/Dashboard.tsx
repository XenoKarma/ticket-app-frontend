import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { PageLoading } from '@/components/shared/Loading'
import { ErrorState } from '@/components/shared/ErrorState'
import { Ticket, Clock, CheckCircle, TrendingUp, TrendingDown, Minus, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Ticket as TicketType } from '@/types'
import { STATUS_LABELS } from '@/lib/constants'

const STATUS_COLORS: Record<string, string> = {
  open: '#3b82f6',
  in_progress: '#f59e0b',
  resolved: '#22c55e',
  rejected: '#ef4444',
  closed: '#6b7280',
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconClass,
}: {
  title: string
  value: number
  change: string
  icon: React.ElementType
  iconClass: string
}) {
  const num = Number(change)
  const isUp = num > 0
  const isDown = num < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {isUp ? (
            <>
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">{change}%</span>
            </>
          ) : isDown ? (
            <>
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span className="text-red-600">{change}%</span>
            </>
          ) : (
            <>
              <Minus className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{change}%</span>
            </>
          )}
          <span className="text-muted-foreground ml-1">vs bulan lalu</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboard()
  const { user } = useAuth()

  if (isLoading) return <PageLoading />
  if (error) return <ErrorState onRetry={refetch} />

  const chartData = data?.status_counts
    ? Object.entries(data.status_counts).map(([name, value]) => ({
        name: STATUS_LABELS[name] || name,
        value,
        color: STATUS_COLORS[name] || '#999',
      })).filter((d) => d.value > 0)
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang, {user?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Tiket"
          value={data?.total_tickets ?? 0}
          change={data?.total_tickets_change ?? '0'}
          icon={Ticket}
          iconClass="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Tiket Aktif"
          value={data?.active_tickets ?? 0}
          change={data?.active_tickets_change ?? '0'}
          icon={Clock}
          iconClass="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Selesai"
          value={data?.completed_tickets ?? 0}
          change={data?.completed_tickets_change ?? '0'}
          icon={CheckCircle}
          iconClass="text-green-600 bg-green-50"
        />
      </div>

      {(data?.assigned_to_me ?? 0) > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Headphones className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              Anda memiliki {data?.assigned_to_me} tiket yang perlu ditangani.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Status</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada data.
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name] as [string | number, string]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex flex-wrap justify-center gap-4">
                  {chartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-sm">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
