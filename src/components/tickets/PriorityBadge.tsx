import { PRIORITY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PriorityBadgeProps {
  priority: string
}

const priorityStyles: Record<string, string> = {
  low: 'text-gray-500',
  medium: 'text-emerald-600',
  high: 'text-orange-600',
  urgent: 'text-red-600 font-semibold',
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={cn('text-sm', priorityStyles[priority] || '')}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  )
}
