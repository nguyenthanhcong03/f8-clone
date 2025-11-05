import { Button } from '@/components/ui/button'
import type { Lesson, Section } from '@/types/course'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EditIcon, GripVertical, Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SortableLessonProps {
  lesson: Lesson
  section: Section
  courseId: string
  onEdit: (lesson: Lesson) => void
  onDelete: (lesson: Lesson) => void
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, section, courseId, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.lessonId
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
      className='mb-4 flex cursor-pointer items-center justify-between rounded-lg border bg-white transition-colors hover:bg-accent'
    >
      <div
        className='flex flex-1 items-center gap-3 p-3'
        onClick={() => navigate(`/admin/courses/${courseId}/sections/${section.sectionId}/lessons/${lesson.lessonId}`)}
      >
        <div {...attributes} {...listeners} className='flex cursor-grab items-center hover:cursor-grabbing'>
          <GripVertical className='h-4 w-4 text-muted-foreground' />
        </div>
        <span className='text-sm font-medium'>{lesson.title}</span>
      </div>
      <div className='flex items-center'>
        <Button variant='ghost' size='sm' onClick={() => onEdit(lesson)}>
          <EditIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onDelete(lesson)}
          className='text-destructive hover:text-destructive'
        >
          <Trash2Icon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default SortableLesson
