import { ErrorState } from '@/components/common/error-state/ErrorState'
import { NoData } from '@/components/common/no-data/NoData'
import TablePagination from '@/components/common/pagination/TablePagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useDebounce from '@/hooks/useDebounce'
import { ROUTES } from '@/lib/constants'
import { useDeleteBlogMutation, useGetAllBlogsQuery } from '@/services/api/blogApi'
import { formatDate } from '@/utils/format'
import { EyeIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import BlogFilters from './BlogFilters'
import BlogTableSkeleton from './BlogTableSkeleton'

const BlogTable = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    categoryId: 'all',
    status: 'all'
  })

  const debouncedSearch = useDebounce(filters.search, 600)

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Tạo query parameters cho API
  const apiParams = useMemo(() => {
    const params: {
      page: number
      limit: number
      sort: string
      order: string
      search?: string
      categoryId?: string
      status?: string
    } = {
      page: currentPage,
      limit: 5,
      sort: 'createdAt',
      order: 'DESC'
    }

    if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
    if (filters.categoryId !== 'all') params.categoryId = filters.categoryId
    if (filters.status !== 'all') params.status = filters.status

    return params
  }, [currentPage, filters, debouncedSearch])

  // Hook API để lấy danh sách blog
  const { data, isFetching, isError, refetch } = useGetAllBlogsQuery(apiParams)
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()

  const blogs = data?.data?.data || []
  console.log('blogs :>> ', blogs)
  const pagination = data?.data
    ? {
        total: data.data.total,
        limit: data.data.limit
      }
    : null

  // Hàm xử lý xóa blog
  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa bài viết "${blogTitle}"?\n\nHành động này không thể hoàn tác.`
    )

    if (!isConfirmed) return

    try {
      setDeletingBlogId(blogId)
      await deleteBlog(blogId).unwrap()
      toast.success('Xóa bài viết thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa bài viết')
      console.error('Delete blog error:', error)
    } finally {
      setDeletingBlogId(null)
    }
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Quản lý bài viết</h2>
          <p className='text-muted-foreground'>Quản lý tất cả bài viết trên hệ thống</p>
        </div>
        <Button onClick={() => navigate(ROUTES.ADMIN.BLOGS.CREATE)} className='flex items-center gap-2'>
          <PlusIcon className='h-4 w-4' />
          Tạo bài viết
        </Button>
      </div>

      {/* Filters */}
      <BlogFilters onFiltersChange={setFilters} />

      {isFetching ? (
        <BlogTableSkeleton />
      ) : (
        <>
          <div className='rounded-md border'>
            <Table>
              <TableCaption>
                {pagination && pagination.total > 0
                  ? `Hiển thị ${blogs.length} trong tổng số ${pagination.total} bài viết${
                      debouncedSearch || filters.categoryId !== 'all' ? ' (đã lọc)' : ''
                    }`
                  : 'Không có bài viết nào'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[60px]'>Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className='w-[140px]'>Thể loại</TableHead>
                  <TableHead className='w-[140px]'>Trạng thái</TableHead>
                  <TableHead className='w-[160px]'>Ngày xuất bản</TableHead>
                  <TableHead className='w-[160px] text-center'>Lượt thích</TableHead>
                  <TableHead className='w-[120px] text-center'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <TableRow key={blog.blogId}>
                      <TableCell>
                        <div className='h-12 w-12 overflow-hidden rounded-md bg-gray-100'>
                          {blog.thumbnail ? (
                            <img src={blog.thumbnail} alt={blog.title} className='h-full w-full object-cover' />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600'>
                              <span className='text-sm font-bold text-white'>{blog.title.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='line-clamp-1 font-medium'>{blog.title}</div>
                      </TableCell>
                      <TableCell>
                        {blog.category ? (
                          <Badge variant='outline'>{blog.category.name}</Badge>
                        ) : (
                          <span className='text-sm text-muted-foreground'>Chưa phân loại</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {blog.status === 'published' ? (
                          <Badge variant='default'>Đã xuất bản</Badge>
                        ) : blog.status === 'draft' ? (
                          <Badge variant='secondary'>Bản nháp</Badge>
                        ) : (
                          <Badge variant='destructive'>Đã lưu trữ</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className='line-clamp-1 text-sm text-muted-foreground'>{formatDate(blog.createdAt)}</span>
                      </TableCell>
                      <TableCell>
                        <div className='text-center text-sm text-muted-foreground'>{blog.likesCount}</div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-center gap-2'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => navigate(ROUTES.ADMIN.BLOGS.VIEW(blog.blogId))}
                                className='h-8 w-8 p-0'
                              >
                                <EyeIcon className='h-4 w-4 text-green-600' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem bài viết</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                className='h-8 w-8 p-0'
                                onClick={() => handleDeleteBlog(blog.blogId, blog.title)}
                                disabled={isDeleting && deletingBlogId === blog.blogId}
                              >
                                {isDeleting && deletingBlogId === blog.blogId ? (
                                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent' />
                                ) : (
                                  <Trash2Icon className='h-4 w-4 text-red-600' />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa bài viết</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      <NoData
                        message='Chưa có bài viết nào'
                        subMessage='Bạn có thể tạo bài viết mới ngay bây giờ'
                        action={
                          <Button onClick={() => navigate(ROUTES.ADMIN.BLOGS.CREATE)} className='mt-4'>
                            <PlusIcon className='mr-2 h-4 w-4' />
                            Tạo bài viết đầu tiên
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <TablePagination
            page={currentPage}
            onPageChange={(newPage) => setCurrentPage(newPage)}
            totalItems={pagination?.total || 0}
            pageSize={pagination?.limit || 5}
          />
        </>
      )}
    </div>
  )
}

export default BlogTable
