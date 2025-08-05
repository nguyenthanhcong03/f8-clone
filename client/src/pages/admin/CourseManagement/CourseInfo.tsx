import { fetchCourseById, updateLessonOrder } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { addSection, editSection, fetchCourseSections, removeSection, updateSectionOrder } from '@/store/sectionSlice'
import { deleteLesson } from '@/store/lessonSlice'
import type { Lesson, Section } from '@/types/course'
import { Alert, Box, CircularProgress, Snackbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Import components
import CourseHeader from '@/pages/admin/CourseManagement/components/CourseHeader'
import CourseDetails from '@/pages/admin/CourseManagement/components/CourseDetails'
import CourseSections from '@/pages/admin/CourseManagement/components/CourseStructure'
import SectionForm from '@/pages/admin/CourseManagement/components/SectionForm'

const CourseInfo = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentCourse, loading } = useAppSelector((state) => state.courses)
  const { sections, sectionsLoading } = useAppSelector((state) => state.sections)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [isOpenFormSection, setIsOpenFormSection] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

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

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleReorderSections = async (newSections: Section[]) => {
    if (!id) return

    const sectionIds = newSections.map((section) => section.id)
    try {
      await dispatch(updateSectionOrder({ courseId: parseInt(id), sectionIds })).unwrap()
      showSnackbar('Cập nhật thứ tự chương thành công', 'success')
    } catch {
      showSnackbar('Có lỗi khi cập nhật thứ tự chương', 'error')
    }
  }

  const handleReorderLessons = async (sectionId: number, newLessons: Lesson[]) => {
    const lessonIds = newLessons.map((lesson) => lesson.id)
    try {
      await dispatch(updateLessonOrder({ sectionId, lessonIds })).unwrap()
      showSnackbar('Cập nhật thứ tự bài học th�nh c�ng', 'success')
    } catch {
      showSnackbar('Có lỗi khi Cập nhật thứ tự bài học', 'error')
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
        showSnackbar('X�a chuong th�nh c�ng', 'success')
      } catch {
        showSnackbar('C� l?i x?y ra khi x�a chuong', 'error')
      }
    }
  }

  const handleAddLesson = (sectionId: number) => {
    if (!id) return
    navigate(`/admin/courses/${id}/sections/${sectionId}/lessons/add`)
  }

  const handleDeleteLesson = async (lessonId: number) => {
    if (window.confirm('B?n c� ch?c ch?n mu?n x�a b�i h?c n�y kh�ng?')) {
      try {
        await dispatch(deleteLesson(lessonId)).unwrap()
        showSnackbar('X�a b�i h?c th�nh c�ng', 'success')
      } catch {
        showSnackbar('C� l?i x?y ra khi x�a b�i h?c', 'error')
      }
    }
  }

  const handleSaveSection = async (title: string) => {
    if (!id) return
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
        showSnackbar('C?p nh?t chuong h?c th�nh c�ng', 'success')
      } else {
        // Create new section
        await dispatch(
          addSection({
            title,
            course_id: parseInt(id)
          })
        ).unwrap()
        showSnackbar('T?o chuong h?c th�nh c�ng', 'success')
      }
      setIsOpenFormSection(false)
    } catch {
      showSnackbar('C� l?i x?y ra. Vui l�ng th? l?i.', 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentCourse && !loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='h5' color='error'>
          Kh�a h?c kh�ng t?n t?i
        </Typography>
        <CourseHeader navigateBack={() => navigate('/admin/courses')} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <CourseHeader navigateBack={() => navigate('/admin/courses')} />

      <Box>
        {/* Course Info Card */}
        <CourseDetails course={currentCourse} />

        {/* Sections and Lessons */}
        <CourseSections
          courseId={id}
          onAddSection={handleAddSection}
          onEditSection={handleEditSection}
          onDeleteSection={handleDeleteSection}
          onAddLesson={handleAddLesson}
          onDeleteLesson={handleDeleteLesson}
          onReorderSections={handleReorderSections}
          onReorderLessons={handleReorderLessons}
        />
      </Box>

      {/* Section Form Modal */}
      <SectionForm
        open={isOpenFormSection}
        onClose={() => setIsOpenFormSection(false)}
        onSave={handleSaveSection}
        selectedSection={selectedSection}
        isLoading={submitLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CourseInfo
