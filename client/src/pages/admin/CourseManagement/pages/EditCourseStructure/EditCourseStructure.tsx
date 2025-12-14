import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmDeleteLesson from './components/ConfirmDeleteLesson'
import ConfirmDeleteSection from './components/ConfirmDeleteSection'
import LessonForm from './components/LessonForm'
import SectionForm from './components/SectionForm'
import SortableLesson from './components/SortableLesson'
import SortableSection from './components/SortableSection'
import { useGetCourseByIdQuery } from '@/services/api/courseApi'

const EditCourseStructurePage = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const { data, isLoading, error } = useGetCourseByIdQuery(courseId!)
  const currentCourse = data?.data
  console.log('currentCourse: ', currentCourse)
  const [isOpenSectionForm, setIsOpenSectionForm] = useState(false)
  const [isOpenLessonForm, setIsOpenLessonForm] = useState(false)
  const [isOpenConfirmDeleteSection, setIsOpenConfirmDeleteSection] = useState(false)
  const [isOpenConfirmDeleteLesson, setIsOpenConfirmDeleteLesson] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [items, setItems] = useState<Section[]>([])

  const handleOpenEditSectionForm = (section: Section) => {
    setSelectedSection(section)
    setIsOpenSectionForm(true)
  }

  const handleOpenConfirmDeleteSection = (section: Section) => {
    setSelectedSection(section)
    setIsOpenConfirmDeleteSection(true)
  }
  const handleOpenAddSectionForm = () => {
    setSelectedSection(null)
    setIsOpenSectionForm(true)
  }

  const handleOpenEditLessonForm = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsOpenLessonForm(true)
  }

  const handleOpenConfirmDeleteLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsOpenConfirmDeleteLesson(true)
  }

  const handleOpenAddLessonForm = (section: Section) => {
    setSelectedLesson(null)
    setSelectedSection(section)
    setIsOpenLessonForm(true)
  }

  useEffect(() => {
    if (currentCourse) {
      const initialItems = currentCourse.sections?.map((section) => ({ ...section, isOpen: true })) || []
      setItems(initialItems)
    }
  }, [currentCourse])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStartSection = (event: DragStartEvent) => {
    const { active } = event

    if (items) {
      const draggedSection = items.find((section) => section.sectionId === active.id)
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

    const oldIndex = items.findIndex((section) => section.sectionId === active.id)
    const newIndex = items.findIndex((section) => section.sectionId === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = arrayMove(items, oldIndex, newIndex)
      setItems(newSections)
      onReorderSections(newSections)
    }
  }

  const handleDragStartLesson = (sectionId: string, lessons: Lesson[]) => (event: DragStartEvent) => {
    const { active } = event

    const draggedLesson = lessons.find((lesson) => lesson.lessonId === active.id)
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

    const oldIndex = lessons.findIndex((lesson) => lesson.lessonId === active.id)
    const newIndex = lessons.findIndex((lesson) => lesson.lessonId === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newLessons = arrayMove(lessons, oldIndex, newIndex)
      onReorderLessons(sectionId, newLessons)
    }
  }

  return (
    <div className='mx-auto w-full max-w-7xl p-6'>
      <Card className='border'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='space-y-1'>
            <CardTitle className='text-xl font-semibold'>Nội dung khóa học</CardTitle>
            <p className='text-sm text-muted-foreground'>Các video bài giảng</p>
          </div>
          <Button onClick={handleOpenAddSectionForm} className='flex items-center gap-2'>
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
              <SortableContext items={items.map((section) => section.sectionId)} strategy={verticalListSortingStrategy}>
                {items.map((section) => (
                  <SortableSection
                    key={section.sectionId}
                    section={section}
                    onEdit={handleOpenEditSectionForm}
                    onDelete={handleOpenConfirmDeleteSection}
                  >
                    {section.lessons && section.lessons.length > 0 ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStartLesson(section.sectionId, section.lessons)}
                        onDragEnd={handleDragEndLesson(section.sectionId, section.lessons)}
                      >
                        <SortableContext
                          items={section.lessons.map((lesson) => lesson.lessonId)}
                          strategy={verticalListSortingStrategy}
                        >
                          {section.lessons.map((lesson) => (
                            <SortableLesson
                              key={lesson.lessonId}
                              lesson={lesson}
                              section={section}
                              courseId={courseId!}
                              onEdit={handleOpenEditLessonForm}
                              onDelete={handleOpenConfirmDeleteLesson}
                            />
                          ))}
                        </SortableContext>
                        <DragOverlay>
                          {activeLesson && section.sectionId === activeLesson.sectionId && (
                            <SortableLesson
                              lesson={activeLesson}
                              section={section}
                              courseId={courseId!}
                              onEdit={handleOpenEditLessonForm}
                              onDelete={handleOpenConfirmDeleteLesson}
                            />
                          )}
                        </DragOverlay>
                      </DndContext>
                    ) : (
                      <p className='py-2 text-sm text-muted-foreground'>Chưa có bài học nào trong chương này.</p>
                    )}
                    <Button variant='outline' className='flex w-full' onClick={() => handleOpenAddLessonForm(section)}>
                      <Plus className='h-4 w-4' />
                      Thêm bài học
                    </Button>
                  </SortableSection>
                ))}
              </SortableContext>
              <DragOverlay>
                {activeSection && (
                  <SortableSection
                    section={activeSection}
                    onEdit={handleOpenEditSectionForm}
                    onDelete={handleOpenConfirmDeleteSection}
                  >
                    {activeSection?.lessons && activeSection?.lessons.length > 0 ? (
                      activeSection.lessons.map((lesson) => (
                        <SortableLesson
                          key={lesson.lessonId}
                          lesson={lesson}
                          section={activeSection}
                          courseId={courseId!}
                          onEdit={handleOpenEditLessonForm}
                          onDelete={handleOpenConfirmDeleteLesson}
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
        open={isOpenSectionForm}
        onClose={() => setIsOpenSectionForm(false)}
        selectedSection={selectedSection}
        courseId={courseId!}
      />
      {/* Lesson Form Modal */}
      <LessonForm
        open={isOpenLessonForm}
        onClose={() => setIsOpenLessonForm(false)}
        selectedLesson={selectedLesson}
        courseId={courseId!}
        sectionId={selectedSection?.sectionId}
      />
      {/* Confirm Delete Section Modal */}
      <ConfirmDeleteSection
        open={isOpenConfirmDeleteSection}
        onClose={() => setIsOpenConfirmDeleteSection(false)}
        selectedSection={selectedSection!}
      />
      {/* Confirm Delete Lesson Modal */}
      <ConfirmDeleteLesson
        open={isOpenConfirmDeleteLesson}
        onClose={() => setIsOpenConfirmDeleteLesson(false)}
        selectedLesson={selectedLesson!}
      />
    </div>
  )
}

export default EditCourseStructurePage
