import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import type { Section } from '@/types/course'
import { toast } from 'react-toastify'
import { useCreateSectionMutation, useUpdateSectionMutation } from '@/services/api/sectionApi'

interface SectionFormProps {
  open: boolean
  onClose: () => void
  selectedSection: Section | null
  courseId: string
}

const SectionForm: React.FC<SectionFormProps> = ({ open, onClose, selectedSection, courseId }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation()
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation()

  useEffect(() => {
    if (selectedSection) {
      setTitle(selectedSection.title)
    } else {
      setTitle('')
    }
    setError('')
  }, [selectedSection])

  const handleSaveSection = async () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tên chương')
      return
    }

    try {
      if (selectedSection) {
        await updateSection({
          sectionId: selectedSection.sectionId,
          title
        }).unwrap()
        toast.success('Cập nhật chương học thành công')
      } else {
        // Create new section
        await createSection({
          title,
          courseId
        }).unwrap()
        toast.success('Tạo chương học thành công')
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
          <Button onClick={handleSaveSection} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-current'></div>
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
