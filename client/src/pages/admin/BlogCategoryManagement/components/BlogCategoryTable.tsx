import { ErrorState } from '@/components/common/error-state/ErrorState'
import { NoData } from '@/components/common/no-data/NoData'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useDebounce from '@/hooks/useDebounce'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { formatDate } from '@/utils/format'
import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import BlogCategoryFilters from './BlogCategoryFilters'
import BlogCategoryTableSkeleton from './BlogCategoryTableSkeleton'

const BlogCategoryTable = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: ''
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
      search?: string
    } = {
      page: currentPage,
      limit: 10
    }

    if (debouncedSearch.trim()) params.search = debouncedSearch.trim()

    return params
  }, [currentPage, debouncedSearch])

  // Hook API để lấy danh sách thể loại
  const { data, isFetching, isError, refetch } = useGetAllCategoriesQuery(apiParams)
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const categories = data?.data?.data || []
  const pagination = data?.data
    ? {
        total: data.data.total,
        currentPage: data.data.page,
        totalPages: Math.ceil(data.data.total / data.data.limit)
      }
    : null

  // Hàm xử lý xóa thể loại
  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa thể loại "${categoryName}"?\n\nHành động này không thể hoàn tác.`
    )

    if (!isConfirmed) return

    try {
      setDeletingCategoryId(categoryId)
      await deleteCategory(categoryId).unwrap()
      toast.success('Xóa thể loại thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa thể loại')
      console.error('Delete category error:', error)
    } finally {
      setDeletingCategoryId(null)
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
          <h2 className='text-2xl font-bold tracking-tight'>Quản lý thể loại</h2>
          <p className='text-muted-foreground'>Quản lý tất cả thể loại bài viết trên hệ thống</p>
        </div>
        <Button onClick={() => navigate('create')} className='flex items-center gap-2'>
          <PlusIcon className='h-4 w-4' />
          Tạo thể loại
        </Button>
      </div>

      {/* Filters */}
      <BlogCategoryFilters onFiltersChange={setFilters} />

      {isFetching ? (
        <BlogCategoryTableSkeleton />
      ) : (
        <>
          <div className='rounded-md border'>
            <Table>
              <TableCaption>
                {pagination && pagination.total > 0
                  ? `Hiển thị ${categories.length} trong tổng số ${pagination.total} thể loại${
                      debouncedSearch ? ' (đã lọc)' : ''
                    }`
                  : 'Không có thể loại nào'}
              </TableCaption>
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
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.categoryId}>
                      <TableCell>
                        <div className='font-medium'>{category.name}</div>
                      </TableCell>
                      <TableCell>
                        <code className='rounded bg-muted px-2 py-1 text-xs'>{category.slug}</code>
                      </TableCell>
                      <TableCell>
                        <div className='line-clamp-2 text-sm text-muted-foreground'>
                          {category.description || 'Chưa có mô tả'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm text-muted-foreground'>{formatDate(category.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-center gap-2'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0'
                                onClick={() => navigate(`edit/${category.categoryId}`)}
                              >
                                <EditIcon className='h-4 w-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Sửa</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                                onClick={() => handleDeleteCategory(category.categoryId, category.name)}
                                disabled={isDeleting && deletingCategoryId === category.categoryId}
                              >
                                <Trash2Icon className='h-4 w-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xóa</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <NoData
                        message={
                          debouncedSearch
                            ? `Không tìm thấy thể loại nào với từ khóa "${debouncedSearch}"`
                            : 'Chưa có thể loại nào'
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Trang {pagination.currentPage} / {pagination.totalPages}
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BlogCategoryTable
