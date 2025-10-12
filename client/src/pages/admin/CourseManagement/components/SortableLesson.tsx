import type { Lesson, Section } from '@/types/course'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface SortableLessonProps {
  lesson: Lesson
  section: Section
  id?: string
  handleDeleteLesson: (lessonId: string) => void
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, section, id, handleDeleteLesson }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.lesson_id
  })
  const navigate = useNavigate()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '0.5rem'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex justify-between items-center mb-4 p-3 border border-border rounded-lg bg-white cursor-pointer hover:bg-accent transition-colors'
      onClick={() => navigate(`/admin/courses/${id}/sections/${section.section_id}/lessons/${lesson.lesson_id}`)}
    >
      <div className='flex items-center gap-3'>
        <div {...attributes} {...listeners} className='cursor-grab hover:cursor-grabbing flex items-center'>
          <GripVertical className='h-4 w-4 text-muted-foreground' />
        </div>
        <span className='text-sm font-medium'>{lesson.title}</span>
      </div>
      <div className='flex items-center'>
        <Button
          variant='ghost'
          size='sm'
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteLesson(lesson.lesson_id)
          }}
          className='text-destructive hover:text-destructive'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default SortableLesson
