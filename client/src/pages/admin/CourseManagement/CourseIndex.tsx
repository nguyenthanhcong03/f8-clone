import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/store/api/courseApi'
import { useAppDispatch } from '@/store/hook'
import type { Course } from '@/types/course'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CourseTable } from './components/CourseTable'

const CourseIndex = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Sử dụng RTK Query để lấy danh sách khóa học
  const { data: courses, isLoading, error: coursesError, refetch } = useGetAllCoursesQuery()

  // Mutation để xóa khóa học
  const [deleteCourseApi, { isLoading: isDeleting }] = useDeleteCourseMutation()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  // Xử lý lỗi khi fetch data
  useEffect(() => {
    if (coursesError && 'data' in coursesError) {
      const errorMessage =
        (coursesError.data as { message: string })?.message || 'Đã xảy ra lỗi khi tải danh sách khóa học'
      toast.error(errorMessage)
    }
  }, [coursesError, dispatch])

  const handleAddCourse = () => {
    navigate('/admin/courses/add')
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return

    try {
      await deleteCourseApi(courseToDelete.course_id).unwrap()
      toast.success('Xóa khóa học thành công')
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
      // Gọi refetch để cập nhật lại danh sách khóa học
      // RTK Query sẽ tự động invalidate cache, nhưng gọi refetch để đảm bảo
      refetch()
    } catch {
      toast.error('Xóa khóa học thất bại, vui lòng thử lại')
    }
  }

  if (isLoading || isDeleting) {
    return (
      <div className='flex justify-center p-6'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Danh sách khóa học</h1>
        <Button onClick={handleAddCourse} className='flex min-w-[150px] items-center gap-2'>
          <Plus className='h-4 w-4' />
          Thêm khóa học
        </Button>
      </div>

      {/* Danh sách khóa học */}
      <CourseTable />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa khóa học</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            Bạn có chắc chắn muốn xóa "{courseToDelete?.title}"? Hành động này không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CourseIndex
