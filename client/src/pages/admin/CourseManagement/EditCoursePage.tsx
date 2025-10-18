import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import CourseInfo from '@/pages/admin/CourseManagement/components/CourseInfo'
import LessonForm from '@/pages/admin/CourseManagement/components/LessonForm'
import { setActiveTab } from '@/store/appSlice'
import { fetchCourseById, updateLessonOrder } from '@/store/features/courses/courseSlice'
import { createLesson, deleteLesson } from '@/store/features/courses/lessonSlice'
import { removeSection, updateSectionOrder } from '@/store/features/courses/sectionSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import type { Lesson, Section } from '@/types/course'
import { ArrowLeft } from 'lucide-react'
import type { SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CourseStructure from './components/CourseStructure'
import Loader from '@/components/common/Loading/Loader'

const EditCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentCourse, loading } = useAppSelector((state) => state.courses)
  const { activeTab } = useAppSelector((state) => state.app)
  const [searchParams, setSearchParams] = useSearchParams()

  const [isOpenFormSection, setIsOpenFormSection] = useState(false)
  const [isOpenFormLesson, setIsOpenFormLesson] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [lessonSubmitLoading, setLessonSubmitLoading] = useState(false)

  const handleChangeTab = (_event: SyntheticEvent, newValue: string) => {
    dispatch(setActiveTab(newValue))
    setSearchParams({ tab: newValue })
  }

  // Đồng bộ trạng thái từ URL vào Redux khi trang được tải
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParam !== activeTab) {
      dispatch(setActiveTab(tabParam))
    }
  }, [dispatch, searchParams, activeTab, setSearchParams])

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId))
    }
  }, [dispatch, courseId])

  const handleReorderSections = async (newSections: Section[]) => {
    if (!courseId) return

    const sectionIds = newSections.map((section) => section.section_id)
    try {
      await dispatch(updateSectionOrder({ courseId, sectionIds })).unwrap()
      dispatch(showSnackbar({ message: 'Cập nhật thứ tự chương thành công', severity: 'success' }))
    } catch {
      dispatch(showSnackbar({ message: 'Có lỗi khi cập nhật thứ tự chương', severity: 'error' }))
    }
  }

  const handleReorderLessons = async (sectionId: string, newLessons: Lesson[]) => {
    const lessonIds = newLessons.map((lesson) => lesson.lesson_id)
    try {
      await dispatch(updateLessonOrder({ sectionId, lessonIds })).unwrap()
      dispatch(showSnackbar({ message: 'Cập nhật thứ tự bài học th�nh c�ng', severity: 'success' }))
    } catch {
      dispatch(showSnackbar({ message: 'Có lỗi khi Cập nhật thứ tự bài học', severity: 'error' }))
    }
  }

  const handleAddSection = () => {
    setIsOpenFormSection(true)
    setSelectedSection(null)
  }

  const handleEditSection = (section: Section) => {
    setSelectedSection(section)
    setIsOpenFormSection(true)
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương này không?')) {
      try {
        await dispatch(removeSection(sectionId)).unwrap()
        dispatch(showSnackbar({ message: 'Xóa chương thành công', severity: 'success' }))
      } catch {
        dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi xóa chương', severity: 'error' }))
      }
    }
  }

  const handleAddLesson = (sectionId: string) => {
    setIsOpenFormLesson(true)
    setCurrentSectionId(sectionId)
  }

  const handleSaveLesson = async (title: string, courseId: string, sectionId: string) => {
    setLessonSubmitLoading(true)

    try {
      await dispatch(
        createLesson({
          course_id: courseId,
          section_id: sectionId,
          title
        })
      ).unwrap()
      setIsOpenFormLesson(false)
      dispatch(showSnackbar({ message: 'Tạo bài học thành công', severity: 'success' }))
    } catch {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tạo bài học', severity: 'error' }))
    } finally {
      setLessonSubmitLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài học này không?')) {
      try {
        await dispatch(deleteLesson(lessonId)).unwrap()
        dispatch(showSnackbar({ message: 'Xóa bài học thành công', severity: 'success' }))
      } catch {
        dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi xóa bài học', severity: 'error' }))
      }
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className='mx-auto p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-4'>
        <Button variant='outline' onClick={() => navigate('/admin/courses')} className='flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Trở về
        </Button>
        <h1 className='text-3xl font-bold'>Chỉnh sửa khóa học</h1>
      </div>

      <div className='mb-8 w-full'>
        {/* Tabs */}
        <div className='mb-6 rounded-lg border border-border'>
          <nav className='flex justify-center' aria-label='course edit tabs'>
            <button
              onClick={(e) => handleChangeTab(e, 'info')}
              className={cn(
                'border-b-2 px-6 py-3 text-sm font-medium transition-colors',
                activeTab === 'info'
                  ? 'border-primary bg-accent text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              Thông tin
            </button>
            <button
              onClick={(e) => handleChangeTab(e, 'lessons')}
              className={cn(
                'border-b-2 px-6 py-3 text-sm font-medium transition-colors',
                activeTab === 'lessons'
                  ? 'border-primary bg-accent text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              Bài học
            </button>
          </nav>
        </div>

        {/* Tab panels */}
        <div role='tabpanel' className={cn('transition-opacity', activeTab !== 'info' && 'hidden')}>
          {activeTab === 'info' && <CourseInfo course={currentCourse} />}
        </div>

        <div role='tabpanel' className={cn('transition-opacity', activeTab !== 'lessons' && 'hidden')}>
          {activeTab === 'lessons' && (
            <CourseStructure
              courseId={courseId!}
              isOpenFormSection={isOpenFormSection}
              setIsOpenFormSection={setIsOpenFormSection}
              selectedSection={selectedSection}
              onAddSection={handleAddSection}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSection}
              onAddLesson={handleAddLesson}
              onDeleteLesson={handleDeleteLesson}
              onReorderSections={handleReorderSections}
              onReorderLessons={handleReorderLessons}
            />
          )}
        </div>
      </div>

      {/* Lesson Form Modal */}
      <LessonForm
        open={isOpenFormLesson}
        onClose={() => setIsOpenFormLesson(false)}
        onSave={handleSaveLesson}
        courseId={courseId!}
        sectionId={currentSectionId!}
        isLoading={lessonSubmitLoading}
      />
    </div>
  )
}

export default EditCoursePage
