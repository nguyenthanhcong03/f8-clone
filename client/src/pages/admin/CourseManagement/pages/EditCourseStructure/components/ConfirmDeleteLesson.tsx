import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDeleteLessonMutation } from '@/services/api/lessonApi'
import type { Lesson } from '@/types/course'
import React from 'react'
import { toast } from 'react-toastify'

interface ConfirmDeleteLessonProps {
  open: boolean
  onClose: () => void
  selectedLesson: Lesson
}

const ConfirmDeleteLesson: React.FC<ConfirmDeleteLessonProps> = ({ open, onClose, selectedLesson }) => {
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation()

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return
    try {
      if (selectedLesson) {
        await deleteLesson(selectedLesson.lessonId).unwrap()
        toast.success('Xóa bài học thành công')
      }
      onClose()
    } catch {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Bạn có chắc muốn xóa bài học này không?</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleDeleteLesson} disabled={isDeleting} className='bg-red-600 hover:bg-red-700'>
            {isDeleting ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-current'></div>
                Đang xử lý...
              </div>
            ) : (
              'Xóa chương'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDeleteLesson
