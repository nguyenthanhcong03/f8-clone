import type { Section } from '@/types/course'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, GripVertical, Edit, ChevronDown, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// cn utility not needed in this simplified version

interface SortableSectionProps {
  section: Section
  onEdit: (section: Section) => void
  onDelete: (sectionId: string) => void
  onAddLesson: (sectionId: string) => void
  children: React.ReactNode
  onToggleExpand?: () => void
}

const SortableSection: React.FC<SortableSectionProps> = ({
  section,
  onEdit,
  onDelete,
  onAddLesson,
  children,
  onToggleExpand
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.sectionId
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: isDragging ? 'fit-content' : '100%',
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '1rem'
  }

  return (
    <div ref={setNodeRef} style={style} className='mb-6 rounded-lg border bg-white'>
      <div className='rounded-lg border border-border'>
        {/* Section Header */}
        <button
          onClick={onToggleExpand}
          className='flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent'
          aria-controls={`panel-${section.sectionId}-content`}
          id={`panel-${section.sectionId}-header`}
        >
          <div className='flex items-center gap-3'>
            <div {...attributes} {...listeners} className='cursor-grab hover:cursor-grabbing'>
              <GripVertical className='h-4 w-4 text-muted-foreground' />
            </div>
            <Folder className='h-5 w-5 text-blue-600' />
            <h3 className='text-lg font-semibold'>{section?.title}</h3>
            <Badge variant='secondary' className='ml-2'>
              {section?.lessons && section?.lessons.length} bài học
            </Badge>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={(e) => {
                e.stopPropagation()
                onEdit(section)
              }}
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={(e) => {
                e.stopPropagation()
                onDelete(section.sectionId)
              }}
              className='text-destructive hover:text-destructive'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
            <ChevronDown className='h-4 w-4 transition-transform' />
          </div>
        </button>

        {section.isOpen && (
          <div className='p-4 pt-2'>
            <div className='p-4 pt-0'>
              {children}
              <div className='mt-4'>
                <Button
                  variant='outline'
                  className='flex w-full items-center gap-2'
                  onClick={() => onAddLesson(section.sectionId)}
                >
                  <Plus className='h-4 w-4' />
                  Thêm bài học
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SortableSection
