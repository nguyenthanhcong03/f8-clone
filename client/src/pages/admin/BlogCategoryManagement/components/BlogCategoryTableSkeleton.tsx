import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const BlogCategoryTableSkeleton = () => {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên thể loại</TableHead>
            <TableHead className='w-[200px]'>Slug</TableHead>
            <TableHead className='w-[300px]'>Mô tả</TableHead>
            <TableHead className='w-[160px]'>Ngày tạo</TableHead>
            <TableHead className='w-[120px] text-center'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className='h-5 w-32' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-40' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 w-64' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 w-24' />
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-center gap-2'>
                  <Skeleton className='h-8 w-8 rounded-md' />
                  <Skeleton className='h-8 w-8 rounded-md' />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default BlogCategoryTableSkeleton
