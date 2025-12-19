import { ErrorState } from '@/components/common/error-state/ErrorState'
import { NoData } from '@/components/common/no-data/NoData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useDebounce from '@/hooks/useDebounce'
import { formatLevel, formatPrice } from '@/utils/format'
import { BookOpenIcon, EditIcon, PlusIcon, Trash2Icon, UsersIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CourseFilters from './CourseFilters'
import CourseSummaryDialog from './CourseSummaryDialog'
import CourseTableSkeleton from './CourseTableSkeleton'
import type { Course } from '@/types/course'
import { useDeleteCourseMutation, useGetAllCoursesAdminQuery } from '@/services/api/courseApi'

const CourseTable = () => {
  const navigate = useNavigate()
  const [isOpenCourseSummary, setIsOpenCourseSummary] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    level: 'all',
    isPublished: 'all',
    isPaid: 'all'
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
      level?: string
      isPaid?: string
      isPublished?: string
    } = {
      page: currentPage,
      limit: 10,
      sort: 'createdAt',
      order: 'desc'
    }

    if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
    if (filters.level !== 'all') params.level = filters.level
    if (filters.isPaid !== 'all') params.isPaid = filters.isPaid === 'paid' ? 'true' : 'false'
    if (filters.isPublished !== 'all') params.isPublished = filters.isPublished === 'published' ? 'true' : 'false'

    return params
  }, [currentPage, filters, debouncedSearch])

  const { data, isFetching, isError, refetch } = useGetAllCoursesAdminQuery(apiParams)

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation()

  const courses = data?.data?.data || []
  const pagination = data?.data
    ? {
        total: data.data.total,
        currentPage: data.data.page,
        totalPages: Math.ceil(data.data.total / data.data.limit)
      }
    : null

  // Hàm xử lý xóa khóa học
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"?\n\nHành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.`
    )

    if (!isConfirmed) return

    try {
      setDeletingCourseId(courseId)
      await deleteCourse(courseId).unwrap()
      toast.success('Xóa khóa học thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa khóa học')
      console.error('Delete course error:', error)
    } finally {
      setDeletingCourseId(null)
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
          <h2 className='text-2xl font-bold tracking-tight'>Quản lý khóa học</h2>
          <p className='text-muted-foreground'>Quản lý tất cả khóa học trên hệ thống</p>
        </div>
        <Button onClick={() => navigate('create')} className='flex items-center gap-2'>
          <PlusIcon className='h-4 w-4' />
          Thêm khóa học
        </Button>
      </div>

      {/* Filters */}
      <CourseFilters onFiltersChange={setFilters} />

      {isFetching ? (
        <CourseTableSkeleton />
      ) : (
        <>
          <div className='rounded-md border'>
            <Table>
              <TableCaption>
                {pagination && pagination.total > 0
                  ? `Hiển thị ${courses.length} trong tổng số ${pagination.total} khóa học${
                      debouncedSearch ||
                      filters.level !== 'all' ||
                      filters.isPaid !== 'all' ||
                      filters.isPublished !== 'all'
                        ? ' (đã lọc)'
                        : ''
                    }`
                  : 'Không có khóa học nào'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>Ảnh</TableHead>
                  <TableHead>Tên khóa học</TableHead>
                  <TableHead className='w-[120px]'>Mức độ</TableHead>
                  <TableHead className='w-[140px] text-right'>Giá tiền</TableHead>
                  <TableHead className='w-[120px] text-center'>
                    <div className='flex items-center justify-center gap-1'>
                      <UsersIcon className='h-4 w-4' />
                      Đăng ký
                    </div>
                  </TableHead>
                  <TableHead className='w-[120px] text-center'>Trạng thái</TableHead>
                  <TableHead className='w-[120px] text-center'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>
                        <div
                          onClick={() => {
                            setSelectedCourse(course)
                            setIsOpenCourseSummary(true)
                          }}
                          className='h-10 w-10 overflow-hidden rounded-md bg-gray-100'
                        >
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className='h-full w-full object-cover' />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600'>
                              <span className='text-xs font-bold text-white'>
                                {course.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          onClick={() => {
                            setSelectedCourse(course)
                            setIsOpenCourseSummary(true)
                          }}
                          className='font-medium'
                        >
                          {course.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{formatLevel(course.level)}</Badge>
                      </TableCell>
                      <TableCell className='text-right font-medium'>
                        {course.price == 0 || course.price == undefined || course.price == null ? (
                          <p className='text-green-500'>Miễn phí</p>
                        ) : (
                          formatPrice(course.price, course.isPaid)
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        <span className='font-medium'>{course.enrollmentCount || 0}</span>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge
                          variant={course.isPublished ? 'default' : 'secondary'}
                          className={
                            course.isPublished
                              ? 'bg-green-500 text-white hover:bg-green-500/80'
                              : 'bg-gray-500 text-white hover:bg-gray-500/80'
                          }
                        >
                          {course.isPublished ? 'Đã phát hành' : 'Bản nháp'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-center gap-2'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => navigate(`edit-structure/${course.courseId}`)}
                                className='h-8 w-8 p-0'
                              >
                                <BookOpenIcon className='h-4 w-4 text-green-600' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chỉnh sửa bài học</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => navigate(`${course.courseId}`)}
                                className='h-8 w-8 p-0'
                              >
                                <EditIcon className='h-4 w-4 text-blue-600' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chỉnh sửa khóa học</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                className='h-8 w-8 p-0'
                                onClick={() => handleDeleteCourse(course.courseId, course.title)}
                                disabled={isDeleting && deletingCourseId === course.courseId}
                              >
                                {isDeleting && deletingCourseId === course.courseId ? (
                                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent' />
                                ) : (
                                  <Trash2Icon className='h-4 w-4 text-red-600' />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa khóa học</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className='h-24 text-center'>
                      <NoData
                        message='Chưa có khóa học nào'
                        subMessage='Bạn có thể thêm khóa học mới ngay bây giờ'
                        action={
                          <Button onClick={() => navigate('create')} className='mt-4'>
                            <PlusIcon className='mr-2 h-4 w-4' />
                            Thêm khóa học đầu tiên
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
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Trang {pagination.currentPage} trong {pagination.totalPages} ({pagination.total} khóa học)
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Trước
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {isOpenCourseSummary && (
        <CourseSummaryDialog
          course={selectedCourse!}
          open={isOpenCourseSummary}
          onClose={() => setIsOpenCourseSummary(false)}
        />
      )}
    </div>
  )
}

export default CourseTable
