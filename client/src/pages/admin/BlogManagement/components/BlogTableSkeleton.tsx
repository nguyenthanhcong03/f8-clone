import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const BlogTableSkeleton = () => {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>Ảnh</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead className='w-[140px]'>Thể loại</TableHead>
            <TableHead className='w-[140px]'>Tác giả</TableHead>
            <TableHead className='w-[160px]'>Ngày tạo</TableHead>
            <TableHead className='w-[120px] text-center'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className='h-12 w-12 rounded-md' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[250px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-[100px] rounded-full' />
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-6 w-6 rounded-full' />
                  <Skeleton className='h-4 w-[80px]' />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[120px]' />
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-center gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default BlogTableSkeleton
