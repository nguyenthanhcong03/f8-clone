import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLessonMutation, useUpdateLessonMutation } from '@/services/api/lessonApi'
import type { Lesson } from '@/types/course'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface LessonFormProps {
  open: boolean
  onClose: () => void
  courseId: string
  sectionId?: string
  selectedLesson: Lesson | null
}

const LessonForm: React.FC<LessonFormProps> = ({ open, onClose, courseId, sectionId, selectedLesson }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation()
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation()

  useEffect(() => {
    if (selectedLesson) {
      setTitle(selectedLesson.title)
    } else {
      setTitle('')
    }
    setError('')
  }, [selectedLesson])

  const handleSaveLesson = async () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tên bài học')
      return
    }

    try {
      if (selectedLesson) {
        await updateLesson({
          courseId,
          lessonData: { lessonId: selectedLesson.lessonId, title }
        }).unwrap()
        toast.success('Cập nhật bài học thành công')
      } else if (sectionId) {
        await createLesson({
          courseId,
          lessonData: { sectionId, title }
        }).unwrap()
        toast.success('Tạo bài học thành công')
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
          <DialogTitle>{selectedLesson ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='section-title'>Tên bài học</Label>
            <Input
              id='section-title'
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Nhập tên bài học...'
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className='text-sm text-destructive'>{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSaveLesson} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-current'></div>
                Đang xử lý...
              </div>
            ) : selectedLesson ? (
              'Cập nhật'
            ) : (
              'Tạo bài học'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LessonForm
