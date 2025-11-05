import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Simple skeleton component
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
)

const CourseTableSkeleton = () => {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      {/* Filters Skeleton */}
      <div className='space-y-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <Skeleton className='h-10 w-full max-w-sm' />
          <div className='flex items-center gap-3'>
            <Skeleton className='h-4 w-8' />
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-32' />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Skeleton className='h-4 w-8' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-24' />
              </TableHead>
              <TableHead className='w-[120px]'>
                <Skeleton className='h-4 w-16' />
              </TableHead>
              <TableHead className='w-[140px] text-right'>
                <Skeleton className='ml-auto h-4 w-16' />
              </TableHead>
              <TableHead className='w-[120px] text-center'>
                <Skeleton className='mx-auto h-4 w-16' />
              </TableHead>
              <TableHead className='w-[120px] text-center'>
                <Skeleton className='mx-auto h-4 w-20' />
              </TableHead>
              <TableHead className='w-[120px] text-center'>
                <Skeleton className='mx-auto h-4 w-16' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-10 w-10 rounded-md' />
                </TableCell>
                <TableCell>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-48' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-16 rounded-full' />
                </TableCell>
                <TableCell className='text-right'>
                  <Skeleton className='ml-auto h-4 w-20' />
                </TableCell>
                <TableCell className='text-center'>
                  <Skeleton className='mx-auto h-4 w-8' />
                </TableCell>
                <TableCell className='text-center'>
                  <Skeleton className='mx-auto h-6 w-20 rounded-full' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center gap-2'>
                    <Skeleton className='h-8 w-8 rounded' />
                    <Skeleton className='h-8 w-8 rounded' />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-48' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-16' />
          <Skeleton className='h-9 w-16' />
        </div>
      </div>
    </div>
  )
}

export default CourseTableSkeleton
