import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import type { Lesson } from '@/types/course'

interface LessonFormProps {
  open: boolean
  onClose: () => void
  onSave: (title: string, sectionId: number) => void
  sectionId: number
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
          <Typography variant='h6'>Thêm bài học mới</Typography>
        </Box>

        <TextField
          autoFocus
          margin='dense'
          id='lesson-title'
          label='Tên bài học'
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
            {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Tạo bài học'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default LessonForm
