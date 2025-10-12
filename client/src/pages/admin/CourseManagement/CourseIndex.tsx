import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus } from 'lucide-react'
import { fetchCourses, deleteCourse, clearError } from '@/store/features/courses/courseSlice'
import type { Course } from '@/types/course'
import CourseGrid from '../../../components/common/CourseGridAdmin/CourseGridAdmin'

// Level colors moved to CourseGrid component if needed

const CourseIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.courses)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error')
      dispatch(clearError())
    }
  }, [error, dispatch])

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleAddCourse = () => {
    navigate('/admin/courses/add')
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return

    try {
      await dispatch(deleteCourse(parseInt(courseToDelete.id))).unwrap()
      showSnackbar('Course deleted successfully', 'success')
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch {
      showSnackbar('Failed to delete course', 'error')
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center p-6'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Danh sách khóa học</h1>
        <Button onClick={handleAddCourse} className='flex items-center gap-2 min-w-[150px]'>
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

      {/* Snackbar replacement with Alert */}
      {snackbar.open && (
        <div className='fixed bottom-4 right-4 z-50'>
          <Alert className={`${snackbar.severity === 'error' ? 'border-destructive' : 'border-green-500'}`}>
            <AlertDescription>{snackbar.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

export default CourseIndex
