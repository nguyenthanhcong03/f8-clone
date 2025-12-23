import { ErrorState } from '@/components/common/error-state/ErrorState'
import useDebounce from '@/hooks/useDebounce'
import { useGetAllBlogsQuery } from '@/services/api/blogApi'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogFilters from './components/BlogFilters'
import BlogStats from './components/BlogStats'
import BlogTable from './components/BlogTable'
import BlogTableSkeleton from './components/BlogTableSkeleton'

const BlogManagementPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    categoryId: 'all',
    status: 'all'
  })
  const debouncedSearch = useDebounce(filters.search, 600)

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
  // Lấy dữ liệu blog từ API
  const { data, isFetching, isError, refetch } = useGetAllBlogsQuery(apiParams)
  const blogs = data?.data?.data || []
  console.log('blogs :>> ', blogs)
  const pagination = data?.data
    ? {
        total: data.data.total,
        limit: data.data.limit
      }
    : null

  const handleFiltersChange = (newFilters: { search: string; categoryId: string; status: string }) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <div className='space-y-8 p-6'>
      {/* Thống kê tổng quan */}
      <BlogStats />

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Quản lý bài viết</h2>
          <p className='text-muted-foreground'>Quản lý tất cả bài viết trên hệ thống</p>
        </div>
      </div>

      {/* Filters */}
      <BlogFilters onFiltersChange={handleFiltersChange} />

      {/* Bảng danh sách blog */}
      {isFetching ? (
        <BlogTableSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <BlogTable
          blogs={blogs}
          pagination={pagination!}
          page={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      )}
    </div>
  )
}

export default BlogManagementPage
