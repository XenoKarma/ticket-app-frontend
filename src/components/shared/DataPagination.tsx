import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationMeta {
  current_page: number
  last_page: number
  from: number | null
  to: number | null
  total: number
}

interface DataPaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, last: number): (number | 'ellipsis')[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < last - 2) pages.push('ellipsis')

  pages.push(last)

  return pages
}

export function DataPagination({ meta, onPageChange }: DataPaginationProps) {
  const { current_page, last_page, from, to, total } = meta

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Menampilkan {from ?? 0}-{to ?? 0} dari {total} tiket
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(current_page - 1)}
              className={current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              size="default"
            />
          </PaginationItem>

          {getPageNumbers(current_page, last_page).map((page, idx) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`e-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === current_page}
                  className="cursor-pointer"
                  size="default"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(current_page + 1)}
              className={
                current_page >= last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
              size="default"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
