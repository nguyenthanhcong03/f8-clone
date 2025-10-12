import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import type { Section } from '@/types/course'

interface SectionFormProps {
  open: boolean
  onClose: () => void
  onSave: (title: string) => void
  selectedSection: Section | null
  isLoading: boolean
}

const SectionForm: React.FC<SectionFormProps> = ({ open, onClose, onSave, selectedSection, isLoading }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (selectedSection) {
      setTitle(selectedSection.title)
    } else {
      setTitle('')
    }
    setError('')
  }, [selectedSection])

  const handleSave = () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tên chương')
      return
    }
    onSave(title)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{selectedSection ? 'Chỉnh sửa chương' : 'Thêm chương mới'}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='section-title'>Tên chương</Label>
            <Input
              id='section-title'
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Nhập tên chương...'
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
                Đang xử lý...
              </div>
            ) : selectedSection ? (
              'Cập nhật'
            ) : (
              'Tạo chương'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SectionForm
