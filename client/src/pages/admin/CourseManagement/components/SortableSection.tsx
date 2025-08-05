import { DragIndicator, Edit, Delete, Add as AddIcon, Height } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, IconButton, Typography } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Section } from '@/types/course'
import FolderIcon from '@mui/icons-material/Folder'
import { useEffect, useRef, useState } from 'react'

interface SortableSectionProps {
  section: Section
  onEdit: (section: Section) => void
  onDelete: (sectionId: number) => void
  onAddLesson: (sectionId: number) => void
  children: React.ReactNode
  isDraggingId?: number
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, onEdit, onDelete, onAddLesson, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id.toString()
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '1rem'
  }

  return (
    <Box ref={setNodeRef} style={style} sx={{ mb: 3 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${section.id}-content`}
          id={`panel-${section.id}-header`}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
                <DragIndicator color='action' />
              </div>
              <FolderIcon />
              <Typography variant='h6'>{section?.title}</Typography>
              <Chip
                label={`${section?.lessons && section?.lessons.length} bài học`}
                size='small'
                color='info'
                sx={{ ml: 2 }}
              />
            </Box>

            <Box>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(section)
                }}
              >
                <Edit color='info' fontSize='small' />
              </IconButton>
              <IconButton
                color='error'
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(section.id)
                }}
              >
                <Delete fontSize='small' />
              </IconButton>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => onAddLesson(section.id)}>
              Thêm bài học
            </Button>
          </Box>
          {children}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default SortableSection
