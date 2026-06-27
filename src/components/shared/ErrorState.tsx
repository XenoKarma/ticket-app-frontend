import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Terjadi kesalahan.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-destructive">
      <AlertCircle className="mb-4 h-12 w-12" />
      <h3 className="mb-1 text-lg font-medium">Error</h3>
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  )
}
