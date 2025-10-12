import { useAppDispatch, useAppSelector } from '@/store/hook'
import { addSection, editSection } from '@/store/features/courses/sectionSlice'
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
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import SortableLesson from './SortableLesson'
import SortableSection from './SortableSection'
import SectionForm from './SectionForm'

interface CourseStructureProps {
  courseId: string
  isOpenFormSection: boolean
  setIsOpenFormSection: (isOpen: boolean) => void
  selectedSection: Section | null
  onSaveSection?: (section: Section) => void
  onAddSection: () => void
  onEditSection: (section: Section) => void
  onDeleteSection: (sectionId: string) => void
  onAddLesson: (sectionId: string) => void
  onDeleteLesson: (lessonId: string) => void
  onReorderSections: (newSections: Section[]) => void
  onReorderLessons: (sectionId: string, newLessons: Lesson[]) => void
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
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const dispatch = useAppDispatch()

  const { currentCourse } = useAppSelector((state) => state.courses)

  const initialItems = currentCourse?.sections?.map((section) => ({ ...section, isOpen: true })) || []
  const [items, setItems] = useState(initialItems)

  const toggleExpand = (sectionId: string) => {
    setItems((prevItems) =>
      prevItems.map((section) => (section.section_id === sectionId ? { ...section, isOpen: !section.isOpen } : section))
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

    if (items) {
      const draggedSection = items.find((section) => section.section_id === active.id)
      if (draggedSection) {
        setActiveSection(draggedSection)
      }
    }
  }

  const handleDragEndSection = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveSection(null)

    if (!over || active.id === over.id || !items) {
      return
    }

    const oldIndex = items.findIndex((section) => section.section_id === active.id)
    const newIndex = items.findIndex((section) => section.section_id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = arrayMove(items, oldIndex, newIndex)
      setItems(newSections)
      onReorderSections(newSections)
    }
  }

  const handleDragStartLesson = (sectionId: string, lessons: Lesson[]) => (event: DragStartEvent) => {
    const { active } = event

    const draggedLesson = lessons.find((lesson) => lesson.lesson_id === active.id)
    if (draggedLesson) {
      setActiveLesson(draggedLesson)
    }
  }

  const handleDragEndLesson = (sectionId: string, lessons: Lesson[]) => (event: DragEndEvent) => {
    const { active, over } = event

    setActiveLesson(null)

    if (!over || active.id === over.id || !lessons) {
      return
    }

    const oldIndex = lessons.findIndex((lesson) => lesson.lesson_id === active.id)
    const newIndex = lessons.findIndex((lesson) => lesson.lesson_id === over.id)

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
            sectionId: selectedSection.section_id,
            title
          })
        ).unwrap()
        showSnackbar({ message: 'Cập nhật chương học thành công', severity: 'success' })
      } else {
        // Create new section
        await dispatch(
          addSection({
            title,
            course_id: courseId
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
      <Card className='border'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='space-y-1'>
            <CardTitle className='text-xl font-semibold'>Nội dung khóa học</CardTitle>
            <p className='text-sm text-muted-foreground'>Các video bài giảng</p>
          </div>
          <Button onClick={onAddSection} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Tạo chương mới
          </Button>
        </CardHeader>
        <CardContent>
          {items && items.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={rectIntersection}
              onDragStart={handleDragStartSection}
              onDragEnd={handleDragEndSection}
            >
              <SortableContext
                items={items.map((section) => section.section_id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((section) => (
                  <SortableSection
                    key={section.section_id}
                    section={section}
                    onEdit={onEditSection}
                    onDelete={onDeleteSection}
                    onAddLesson={onAddLesson}
                    onToggleExpand={() => toggleExpand(section.section_id)}
                  >
                    {section.lessons && section.lessons.length > 0 ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStartLesson(section.section_id, section.lessons)}
                        onDragEnd={handleDragEndLesson(section.section_id, section.lessons)}
                      >
                        <SortableContext
                          items={section.lessons.map((lesson) => lesson.lesson_id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {section.lessons.map((lesson) => (
                            <SortableLesson
                              key={lesson.lesson_id}
                              lesson={lesson}
                              section={section}
                              id={courseId}
                              handleDeleteLesson={onDeleteLesson}
                            />
                          ))}
                        </SortableContext>
                        <DragOverlay>
                          {activeLesson && section.section_id === activeLesson.section_id && (
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
                      <p className='text-sm text-muted-foreground'>Chưa có bài học nào trong chương này.</p>
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
                    {activeSection?.lessons && activeSection?.lessons.length > 0 ? (
                      activeSection.lessons.map((lesson) => (
                        <SortableLesson
                          key={lesson.lesson_id}
                          lesson={lesson}
                          section={activeSection}
                          id={courseId}
                          handleDeleteLesson={onDeleteLesson}
                        />
                      ))
                    ) : (
                      <p className='text-sm text-muted-foreground'>Chưa có bài học nào trong chương này.</p>
                    )}
                  </SortableSection>
                )}
              </DragOverlay>
            </DndContext>
          ) : (
            <p className='text-muted-foreground'>Khóa học này chưa có chương học nào.</p>
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
