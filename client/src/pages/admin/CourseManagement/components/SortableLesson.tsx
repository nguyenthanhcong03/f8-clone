import { DragIndicator } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Lesson, Section } from '@/types/course'

interface SortableLessonProps {
  lesson: Lesson
  section: Section
  id?: string
  navigate: (path: string) => void
  handleDeleteLesson: (lessonId: number) => void
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, section, id, navigate, handleDeleteLesson }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id.toString()
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '0.5rem'
  }

  return (
    <Box ref={setNodeRef} style={style} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
            <DragIndicator color='action' fontSize='small' />
          </div>
          <Typography variant='body1' fontWeight='bold'>
            {lesson.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size='small'
            variant='outlined'
            onClick={() => navigate(`/admin/courses/${id}/sections/${section.id}/lessons/${lesson.id}`)}
          >
            Sửa
          </Button>
          <Button size='small' variant='outlined' color='error' onClick={() => handleDeleteLesson(lesson.id)}>
            Xóa
          </Button>
        </Box>
      </Box>
      <Typography variant='body2' color='text.secondary'>
        {lesson.content ? (
          <span
            dangerouslySetInnerHTML={{
              __html: lesson.content.length > 100 ? lesson.content.substring(0, 100) + '...' : lesson.content
            }}
          />
        ) : (
          'No description available'
        )}
      </Typography>
      {lesson.video_url && (
        <Typography variant='body2' color='primary' sx={{ mt: 1 }}>
          Video: Có
        </Typography>
      )}
    </Box>
  )
}

export default SortableLesson
