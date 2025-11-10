import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Section } from '@/types/course'
import { getErrorMessage } from '@/services/helpers'
import React from 'react'
import { toast } from 'react-toastify'
import { useDeleteSectionMutation } from '@/services/api/sectionApi'

interface ConfirmDeleteSectionProps {
  open: boolean
  onClose: () => void
  selectedSection: Section
}

const ConfirmDeleteSection: React.FC<ConfirmDeleteSectionProps> = ({ open, onClose, selectedSection }) => {
  const [deleteSection, { isLoading: isDeleting }] = useDeleteSectionMutation()

  const handleDeleteSection = async () => {
    if (!selectedSection) return
    try {
      if (selectedSection) {
        await deleteSection(selectedSection.sectionId).unwrap()
        toast.success('Xóa chương học thành công')
      }
      onClose()
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Bạn có chắc muốn xóa chương học này không?</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleDeleteSection} disabled={isDeleting} className='bg-red-600 hover:bg-red-700'>
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

export default ConfirmDeleteSection
