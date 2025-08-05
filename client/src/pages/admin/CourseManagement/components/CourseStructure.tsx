import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Add as AddIcon } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import type { Lesson, Section } from '@/types/course'
import SortableSection from './SortableSection'
import SortableLesson from './SortableLesson'
import { useState } from 'react'

interface CourseSectionsProps {
  sections: Section[] | undefined
  isLoading: boolean
  courseId?: string
  onAddSection: () => void
  onEditSection: (section: Section) => void
  onDeleteSection: (sectionId: number) => void
  onAddLesson: (sectionId: number) => void
  onDeleteLesson: (lessonId: number) => void
  onReorderSections: (newSections: Section[]) => void
  onReorderLessons: (sectionId: number, newLessons: Lesson[]) => void
  navigate: (path: string) => void
}

const CourseSections: React.FC<CourseSectionsProps> = ({
  sections,
  isLoading,
  courseId,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddLesson,
  onDeleteLesson,
  onReorderSections,
  onReorderLessons,
  navigate
}) => {
  // State to track the currently dragged item
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStartSection = (event: DragStartEvent) => {
    const { active } = event
    setActiveSectionId(active.id.toString())

    // Find the section being dragged
    if (sections) {
      const draggedSection = sections.find((section) => section.id.toString() === active.id)
      if (draggedSection) {
        setActiveSection(draggedSection)
      }
    }
  }

  const handleDragEndSection = (event: DragEndEvent) => {
    const { active, over } = event

    // Reset the active section data regardless of the result
    setActiveSection(null)
    setActiveSectionId(null)

    if (!over || active.id === over.id || !sections) {
      return
    }

    // Find the indexes for reordering
    const oldIndex = sections.findIndex((section) => section.id.toString() === active.id)
    const newIndex = sections.findIndex((section) => section.id.toString() === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = arrayMove(sections, oldIndex, newIndex)
      onReorderSections(newSections)
    }
  }

  const handleDragStartLesson = (sectionId: number, lessons: Lesson[]) => (event: DragStartEvent) => {
    const { active } = event
    setActiveLessonId(active.id.toString())

    // Find the lesson being dragged
    const draggedLesson = lessons.find((lesson) => lesson.id.toString() === active.id)
    if (draggedLesson) {
      setActiveLesson(draggedLesson)
    }
  }

  const handleDragEndLesson = (sectionId: number, lessons: Lesson[]) => (event: DragEndEvent) => {
    const { active, over } = event

    // Reset the active lesson data regardless of the result
    setActiveLesson(null)
    setActiveLessonId(null)

    if (!over || active.id === over.id || !lessons) {
      return
    }

    // Find the indexes for reordering
    const oldIndex = lessons.findIndex((lesson) => lesson.id.toString() === active.id)
    const newIndex = lessons.findIndex((lesson) => lesson.id.toString() === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newLessons = arrayMove(lessons, oldIndex, newIndex)
      onReorderLessons(sectionId, newLessons)
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant='h5' component='h2'>
            Nội dung khóa học
          </Typography>
          <Button startIcon={<AddIcon />} variant='contained' color='primary' onClick={onAddSection}>
            Tạo chương mới
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : sections && sections.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStartSection}
            onDragEnd={handleDragEndSection}
          >
            <SortableContext
              items={sections.map((section) => section.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  onEdit={onEditSection}
                  onDelete={onDeleteSection}
                  onAddLesson={onAddLesson}
                >
                  {section.lessons && section.lessons.length > 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStartLesson(section.id, section.lessons)}
                      onDragEnd={handleDragEndLesson(section.id, section.lessons)}
                    >
                      <SortableContext
                        items={section.lessons.map((lesson) => lesson.id.toString())}
                        strategy={verticalListSortingStrategy}
                      >
                        {section.lessons.map((lesson) => (
                          <SortableLesson
                            key={lesson.id}
                            lesson={lesson}
                            section={section}
                            id={courseId}
                            navigate={navigate}
                            handleDeleteLesson={onDeleteLesson}
                          />
                        ))}
                      </SortableContext>
                      <DragOverlay>
                        {activeLesson && section.id === activeLesson.section_id && (
                          <SortableLesson
                            lesson={activeLesson}
                            section={section}
                            id={courseId}
                            navigate={navigate}
                            handleDeleteLesson={onDeleteLesson}
                          />
                        )}
                      </DragOverlay>
                    </DndContext>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      Chưa có bài học nào trong chương này.
                    </Typography>
                  )}
                </SortableSection>
              ))}
            </SortableContext>
            <DragOverlay>
              {activeSection && (
                <SortableSection
                  section={activeSection}
                  onEdit={onEditSection}
                  onDelete={onDeleteSection}
                  onAddLesson={onAddLesson}
                >
                  {activeSection.lessons && activeSection.lessons.length > 0 ? (
                    <Typography variant='body2'>{activeSection.lessons.length} bài học</Typography>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      Chưa có bài học nào trong chương này.
                    </Typography>
                  )}
                </SortableSection>
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          <Typography variant='body1' color='text.secondary'>
            Khóa học này chưa có chương học nào.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default CourseSections
