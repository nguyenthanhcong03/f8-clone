import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Section } from '@/types/course'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, Folder, GripVertical, Trash2 } from 'lucide-react'

interface SortableSectionProps {
  section: Section
  onEdit: (section: Section) => void
  onDelete: (section: Section) => void
  children: React.ReactNode
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, onEdit, onDelete, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.sectionId
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: isDragging ? 'fit-content' : '100%',
    opacity: isDragging ? 0.5 : 1,
    marginTop: '1rem'
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type='single' collapsible className='w-full rounded-lg bg-white'>
        <AccordionItem value='item-1 ' className={cn('border')}>
          <div className='flex justify-between px-4 py-3'>
            <div className='flex items-center justify-between'>
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
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='sm' onClick={() => onEdit(section)}>
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDelete(section)}
                className='text-destructive hover:text-destructive'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
              <AccordionTrigger></AccordionTrigger>
            </div>
          </div>
          <AccordionContent className='flex flex-col gap-4 text-balance'>
            <div className='p-4 pb-0'>{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default SortableSection
