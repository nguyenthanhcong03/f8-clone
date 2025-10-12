import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
// Lesson type not needed in this component

interface LessonFormProps {
  open: boolean
  onClose: () => void
  onSave: (title: string, sectionId: string) => void
  sectionId: string
  isLoading: boolean
}

const LessonForm: React.FC<LessonFormProps> = ({ open, onClose, onSave, sectionId, isLoading }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle('')
    setError('')
  }, [])

  const handleSave = () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tên bài học')
      return
    }
    onSave(title, sectionId)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Thêm bài học mới</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='lesson-title'>Tên bài học</Label>
            <Input
              id='lesson-title'
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
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
                Đang tạo...
              </div>
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
