import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

type Props = {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function TablePagination({ page, pageSize, totalItems, onPageChange }: Props) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages <= 1) return null

  const pages = getVisiblePages(page, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            previousLabel='Trước'
            onClick={() => onPageChange(page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((p, index) => (
          <PaginationItem key={index}>
            {p === '...' ? (
              <>
                {' '}
                <PaginationEllipsis />
                <span className='px-3 py-2 text-sm'>…</span>
              </>
            ) : (
              <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            nextLabel='Sau'
            onClick={() => onPageChange(page + 1)}
            aria-disabled={page === totalPages}
            className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/* ================= helpers ================= */

function getVisiblePages(current: number, total: number): Array<number | '...'> {
  const delta = 2
  const range: Array<number | '...'> = []

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  return range.reduce<Array<number | '...'>>((acc, page) => {
    const last = acc[acc.length - 1]
    if (typeof page === 'number' && typeof last === 'number') {
      if (page - last > 1) acc.push('...')
    }
    acc.push(page)
    return acc
  }, [])
}
