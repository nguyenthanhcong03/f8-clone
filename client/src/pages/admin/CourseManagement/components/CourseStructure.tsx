import { useAppDispatch, useAppSelector } from '@/store/hook'
import { addSection, editSection } from '@/store/sectionSlice'
import { showSnackbar } from '@/store/snackbarSlice'
import type { Lesson, Section } from '@/types/course'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Add as AddIcon } from '@mui/icons-material'
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { useState } from 'react'
import SortableLesson from './SortableLesson'
import SortableSection from './SortableSection'
import SectionForm from './SectionForm'

interface CourseStructureProps {
  courseId?: string
  isOpenFormSection: boolean
  setIsOpenFormSection: (isOpen: boolean) => void
  selectedSection: Section | null
  onSaveSection?: (section: Section) => void
  onAddSection: () => void
  onEditSection: (section: Section) => void
  onDeleteSection: (sectionId: number) => void
  onAddLesson: (sectionId: number) => void
  onDeleteLesson: (lessonId: number) => void
  onReorderSections: (newSections: Section[]) => void
  onReorderLessons: (sectionId: number, newLessons: Lesson[]) => void
}

const CourseStructure: React.FC<CourseStructureProps> = ({
  courseId,
  isOpenFormSection,
  setIsOpenFormSection,
  selectedSection,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddLesson,
  onDeleteLesson,
  onReorderSections,
  onReorderLessons
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const dispatch = useAppDispatch()

  const { sections } = useAppSelector((state) => state.sections)

  const initialItems = sections?.map((section) => ({ ...section, isOpen: true })) || []
  const [items, setItems] = useState(initialItems)

  const toggleExpand = (sectionId: number) => {
    setItems((prevItems) =>
      prevItems.map((section) => (section.id === sectionId ? { ...section, isOpen: !section.isOpen } : section))
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStartSection = (event: DragStartEvent) => {
    const { active } = event
    setActiveSectionId(active.id.toString())

    if (items) {
      const draggedSection = items.find((section) => section.id.toString() === active.id)
      if (draggedSection) {
        setActiveSection(draggedSection)
      }
    }
  }

  const handleDragEndSection = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveSection(null)
    setActiveSectionId(null)

    if (!over || active.id === over.id || !items) {
      return
    }

    const oldIndex = items.findIndex((section) => section.id.toString() === active.id)
    const newIndex = items.findIndex((section) => section.id.toString() === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = arrayMove(items, oldIndex, newIndex)
      setItems(newSections)
      onReorderSections(newSections)
    }
  }

  const handleDragStartLesson = (sectionId: number, lessons: Lesson[]) => (event: DragStartEvent) => {
    const { active } = event
    setActiveLessonId(active.id.toString())

    const draggedLesson = lessons.find((lesson) => lesson.id.toString() === active.id)
    if (draggedLesson) {
      setActiveLesson(draggedLesson)
    }
  }

  const handleDragEndLesson = (sectionId: number, lessons: Lesson[]) => (event: DragEndEvent) => {
    const { active, over } = event

    setActiveLesson(null)
    setActiveLessonId(null)

    if (!over || active.id === over.id || !lessons) {
      return
    }

    const oldIndex = lessons.findIndex((lesson) => lesson.id.toString() === active.id)
    const newIndex = lessons.findIndex((lesson) => lesson.id.toString() === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newLessons = arrayMove(lessons, oldIndex, newIndex)
      onReorderLessons(sectionId, newLessons)
    }
  }

  const handleSaveSection = async (title: string) => {
    setSubmitLoading(true)

    try {
      if (selectedSection) {
        // Update existing section
        await dispatch(
          editSection({
            sectionId: selectedSection.id,
            title
          })
        ).unwrap()
        showSnackbar({ message: 'Cập nhật chương học thành công', severity: 'success' })
      } else {
        // Create new section
        await dispatch(
          addSection({
            title,
            course_id: parseInt(courseId)
          })
        ).unwrap()
        showSnackbar({ message: 'Tạo chương học thành công', severity: 'success' })
      }
      setIsOpenFormSection(false)
    } catch {
      showSnackbar({ message: 'Có lỗi xảy ra. Vui lòng thử lại', severity: 'error' })
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <Card variant='outlined'>
        <CardHeader
          title='Nội dung khóa học'
          subheader='Các video bài giảng'
          action={
            <Button
              sx={{ mt: 1, mr: 1 }}
              startIcon={<AddIcon />}
              variant='contained'
              color='primary'
              onClick={onAddSection}
            >
              Tạo chương mới
            </Button>
          }
        />
        <CardContent>
          {items && items.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={rectIntersection}
              onDragStart={handleDragStartSection}
              onDragEnd={handleDragEndSection}
            >
              <SortableContext
                items={items.map((section) => section.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                {items.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onEdit={onEditSection}
                    onDelete={onDeleteSection}
                    onAddLesson={onAddLesson}
                    onToggleExpand={() => toggleExpand(section.id)}
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
                    {activeSection?.lessons &&
                      activeSection.lessons.map((lesson) => (
                        <SortableLesson
                          key={lesson.id}
                          lesson={lesson}
                          section={activeSection}
                          id={courseId}
                          handleDeleteLesson={onDeleteLesson}
                        />
                      ))}
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
      {/* Section Form Modal */}
      <SectionForm
        open={isOpenFormSection}
        onClose={() => setIsOpenFormSection(false)}
        onSave={handleSaveSection}
        selectedSection={selectedSection}
        isLoading={submitLoading}
      />
    </>
  )
}

export default CourseStructure
