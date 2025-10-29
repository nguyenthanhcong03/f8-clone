import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/store/api/courseApi'
import { useAppDispatch } from '@/store/hook'
import type { Course } from '@/types/course'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CourseTable from './components/CourseTable'

const CourseIndex = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { data: courses, isLoading, error, refetch } = useGetAllCoursesQuery()

  const [deleteCourseApi, { isLoading: isDeleting }] = useDeleteCourseMutation()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  // Xử lý lỗi khi fetch data
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Đã xảy ra lỗi khi tải danh sách khóa học')
    }
  }, [error, dispatch])

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return

    try {
      await deleteCourseApi(courseToDelete.courseId).unwrap()
      toast.success('Xóa khóa học thành công')
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch {
      toast.error('Xóa khóa học thất bại, vui lòng thử lại')
    }
  }

  return (
    <div className='p-6'>
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
