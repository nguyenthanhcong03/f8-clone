import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material'
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
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'background.paper',
          p: 4,
          borderRadius: 2,
          minWidth: 400,
          maxWidth: '90%',
          boxShadow: 24
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant='h6'>{selectedSection ? 'Chỉnh sửa chương' : 'Thêm chương mới'}</Typography>
        </Box>

        <TextField
          autoFocus
          margin='dense'
          id='section-title'
          label='Tên chương'
          type='text'
          fullWidth
          variant='outlined'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant='outlined' onClick={onClose}>
            Hủy
          </Button>
          <Button variant='contained' color='primary' onClick={handleSave} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color='inherit' /> : selectedSection ? 'Cập nhật' : 'Tạo chương'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default SectionForm
