import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Tidak ada data',
  description = 'Belum ada data untuk ditampilkan.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Inbox className="mb-4 h-12 w-12" />
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  )
}
