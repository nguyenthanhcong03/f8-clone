import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { clearError, deleteCourse, fetchCourses } from '@/store/features/courses/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import type { Course } from '@/types/course'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseGrid from '../../../components/common/CourseGridAdmin/CourseGridAdmin'

const CourseIndex = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.courses)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      dispatch(showSnackbar({ message: error, severity: 'error' }))
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleAddCourse = () => {
    navigate('/admin/courses/add')
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return

    try {
      await dispatch(deleteCourse(courseToDelete.course_id)).unwrap()
      dispatch(showSnackbar({ message: 'Xóa khóa học thành công', severity: 'success' }))
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch {
      dispatch(showSnackbar({ message: 'Xóa khóa học thất bại', severity: 'error' }))
    }
  }

  if (loading) {
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
      <CourseGrid />

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
