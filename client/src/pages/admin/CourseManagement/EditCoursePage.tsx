import CourseInfo from '@/pages/admin/CourseManagement/components/CourseInfo'
import LessonForm from '@/pages/admin/CourseManagement/components/LessonForm'
import { setActiveTab } from '@/store/appSlice'
import { createCourse, fetchCourseById, updateLessonOrder } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { createLesson, deleteLesson } from '@/store/lessonSlice'
import { fetchCourseSections, removeSection, updateSectionOrder } from '@/store/sectionSlice'
import { showSnackbar } from '@/store/snackbarSlice'
import type { Lesson, Section } from '@/types/course'
import { ArrowBack } from '@mui/icons-material'
import { Box, Button, CircularProgress, Tab, Tabs, Typography } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CourseStructure from './components/CourseStructure'

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentCourse, loading } = useAppSelector((state) => state.courses)
  const { activeTab } = useAppSelector((state) => state.app)
  const [searchParams, setSearchParams] = useSearchParams()

  const [isOpenFormSection, setIsOpenFormSection] = useState(false)
  const [isOpenFormLesson, setIsOpenFormLesson] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null)
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
    if (id) {
      dispatch(fetchCourseById(parseInt(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseSections(parseInt(id)))
    }
  }, [dispatch, id])

  const handleReorderSections = async (newSections: Section[]) => {
    if (!id) return

    const sectionIds = newSections.map((section) => section.id)
    try {
      await dispatch(updateSectionOrder({ courseId: parseInt(id), sectionIds })).unwrap()
      dispatch(showSnackbar({ message: 'Cập nhật thứ tự chương thành công', severity: 'success' }))
    } catch {
      dispatch(showSnackbar({ message: 'Có lỗi khi cập nhật thứ tự chương', severity: 'error' }))
    }
  }

  const handleReorderLessons = async (sectionId: number, newLessons: Lesson[]) => {
    const lessonIds = newLessons.map((lesson) => lesson.id)
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

  const handleDeleteSection = async (sectionId: number) => {
    if (window.confirm('B?n c� ch?c ch?n mu?n x�a chuong n�y kh�ng?')) {
      try {
        await dispatch(removeSection(sectionId)).unwrap()
        dispatch(showSnackbar({ message: 'X�a chuong th�nh c�ng', severity: 'success' }))
      } catch {
        dispatch(showSnackbar({ message: 'C� l?i x?y ra khi x�a chuong', severity: 'error' }))
      }
    }
  }

  const handleAddLesson = (sectionId: number) => {
    setIsOpenFormLesson(true)
    setCurrentSectionId(sectionId)
  }

  const handleSaveLesson = async (title: string, sectionId: number) => {
    setLessonSubmitLoading(true)

    try {
      await dispatch(
        createLesson({
          section_id: sectionId,
          title
        })
      ).unwrap()
      setIsOpenFormLesson(false)
      dispatch(showSnackbar({ message: 'Tạo bài học thành công', severity: 'success' }))
    } catch (error) {
      dispatch(showSnackbar({ message: 'Có lỗi xảy ra khi tạo bài học', severity: 'error' }))
    } finally {
      setLessonSubmitLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId: number) => {
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/courses')} variant='outlined'>
          Trở về
        </Button>
        <Typography variant='h4' component='h1'>
          Chỉnh sửa khóa học
        </Typography>
      </Box>

      <Box sx={{ width: '100%', mb: 4 }}>
        {/* Tabs */}
        <Box sx={{ border: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleChangeTab} centered aria-label='course edit tabs'>
            <Tab label='Thông tin' value='info' />
            <Tab label='Bài học' value='lessons' />
          </Tabs>
        </Box>

        {/* Tab panels */}
        <Box role='tabpanel' hidden={activeTab !== 'info'}>
          {activeTab === 'info' && <CourseInfo course={currentCourse} />}
        </Box>

        <Box role='tabpanel' hidden={activeTab !== 'lessons'}>
          {activeTab === 'lessons' && (
            <CourseStructure
              courseId={id}
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
        </Box>
      </Box>

      {/* Lesson Form Modal */}
      <LessonForm
        open={isOpenFormLesson}
        onClose={() => setIsOpenFormLesson(false)}
        onSave={handleSaveLesson}
        sectionId={currentSectionId || 0}
        isLoading={lessonSubmitLoading}
      />
    </Box>
  )
}

export default EditCoursePage
