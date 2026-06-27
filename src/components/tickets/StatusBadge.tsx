import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  in_progress: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  resolved: 'bg-green-100 text-green-700 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
  closed: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={cn('font-medium', statusStyles[status] || '')} variant="outline">
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}
