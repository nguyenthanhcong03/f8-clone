import type { Lesson, Section } from '@/types/course'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Delete, DragIndicator, Edit } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface SortableLessonProps {
  lesson: Lesson
  section: Section
  id?: string
  handleDeleteLesson: (lessonId: number) => void
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, section, id, handleDeleteLesson }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id.toString()
  })
  const navigate = useNavigate()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '0.5rem'
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        p: 1,
        border: '1px solid #eee',
        borderRadius: 1,
        bgcolor: 'white',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'grey.100'
        }
      }}
      onClick={() => navigate(`/admin/courses/${id}/lessons/${lesson.id}/edit`)}
    >
      <Stack direction='row' spacing={1} alignItems='center'>
        <Box {...attributes} {...listeners} style={{ cursor: 'grab' }} sx={{ display: 'flex', alignItems: 'center' }}>
          <DragIndicator color='action' fontSize='small' />
        </Box>
        <Typography variant='body1'>{lesson.title}</Typography>
      </Stack>
      <Stack direction='row' alignItems='center'>
        <IconButton
          color='error'
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteLesson(lesson.id)
          }}
        >
          <Delete fontSize='small' />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default SortableLesson
