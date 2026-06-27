export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const STATUS_VARIANTS: Record<string, string> = {
  open: 'default',
  in_progress: 'secondary',
  resolved: 'outline',
  closed: 'destructive',
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-muted-foreground',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500 font-semibold',
}
