import { fetchCourseById, updateLessonOrder } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { addSection, editSection, fetchCourseSections, removeSection, updateSectionOrder } from '@/store/sectionSlice'
import { deleteLesson } from '@/store/lessonSlice'
import type { Lesson, Section } from '@/types/course'
import { Add as AddIcon, ArrowBack as ArrowBackIcon, Delete, Edit } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'

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
  const [sectionTitle, setSectionTitle] = useState('')
  const [titleError, setTitleError] = useState('')
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

  // Reset form when selected section changes
  useEffect(() => {
    if (selectedSection) {
      setSectionTitle(selectedSection.title)
    } else {
      setSectionTitle('')
    }
    setTitleError('')
  }, [selectedSection])

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleReorderSections = async (newSections: Section[]) => {
    if (!id) return

    const sectionIds = newSections.map((section) => section.id)
    try {
      await dispatch(updateSectionOrder({ courseId: parseInt(id), sectionIds })).unwrap()
    } catch {
      showSnackbar('Có lỗi khi cập nhật thứ tự chương', 'error')
    }
  }

  const handleReorderLessons = async (sectionId: number, newLessons: Lesson[]) => {
    const lessonIds = newLessons.map((lesson) => lesson.id)
    try {
      await dispatch(updateLessonOrder({ sectionId, lessonIds })).unwrap()
    } catch {
      showSnackbar('Có lỗi khi cập nhật thứ tự bài học', 'error')
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
    if (window.confirm('Bạn có chắc chắn muốn xóa chương này không?')) {
      try {
        await dispatch(removeSection(sectionId)).unwrap()
        showSnackbar('Xóa chương thành công', 'success')
      } catch {
        showSnackbar('Có lỗi xảy ra khi xóa chương', 'error')
      }
    }
  }

  const handleAddLesson = (sectionId: number) => {
    if (!id) return
    navigate(`/admin/courses/${id}/sections/${sectionId}/lessons/add`)
  }

  const handleDeleteLesson = async (lessonId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài học này không?')) {
      try {
        await dispatch(deleteLesson(lessonId)).unwrap()
        showSnackbar('Xóa bài học thành công', 'success')
      } catch {
        showSnackbar('Có lỗi xảy ra khi xóa bài học', 'error')
      }
    }
  }

  const handleSaveSection = async () => {
    // Validate form
    if (!sectionTitle.trim()) {
      setTitleError('Vui lòng nhập tên chương')
      return
    }

    if (!id) return
    setSubmitLoading(true)

    try {
      if (selectedSection) {
        // Update existing section
        await dispatch(
          editSection({
            sectionId: selectedSection.id,
            title: sectionTitle
          })
        ).unwrap()
        showSnackbar('Cập nhật chương học thành công', 'success')
      } else {
        // Create new section
        await dispatch(
          addSection({
            title: sectionTitle,
            course_id: parseInt(id)
          })
        ).unwrap()
        showSnackbar('Tạo chương học thành công', 'success')
      }
      setIsOpenFormSection(false)
    } catch {
      showSnackbar('Có lỗi xảy ra. Vui lòng thử lại.', 'error')
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
          Course not found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/courses')} sx={{ mt: 2 }}>
          Back to Courses
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/courses')} variant='outlined'>
            Trở về
          </Button>
          <Typography variant='h4' component='h1'>
            Thông tin khóa học
          </Typography>
        </Box>
      </Box>

      <Box>
        {/* Course Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Thumbnail */}
              {currentCourse?.thumbnail && (
                <Box sx={{ width: { xs: '100%', md: 280 }, height: { xs: 200, md: 170 } }}>
                  <img
                    src={currentCourse.thumbnail}
                    alt={currentCourse.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}

              {/* Course Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant='h5' component='h2' gutterBottom>
                  {currentCourse?.title}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
                  {currentCourse?.level && (
                    <Chip
                      label={currentCourse.level.charAt(0).toUpperCase() + currentCourse.level.slice(1)}
                      color={
                        currentCourse.level === 'beginner'
                          ? 'success'
                          : currentCourse.level === 'intermediate'
                          ? 'primary'
                          : 'secondary'
                      }
                      size='small'
                    />
                  )}

                  <Chip
                    label={currentCourse?.is_paid ? `Paid - $${currentCourse.price}` : 'Free'}
                    color={currentCourse?.is_paid ? 'warning' : 'default'}
                    size='small'
                  />

                  <Typography variant='body2' color='text.secondary'>
                    Created: {new Date(currentCourse?.createdAt || '').toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant='body1' sx={{ mb: 2 }}>
                  {currentCourse?.description || 'No description available'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Sections and Lessons */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant='h5' component='h2'>
                Nội dung khóa học
              </Typography>
              <Button startIcon={<AddIcon />} variant='contained' color='primary' onClick={handleAddSection}>
                Tạo chương mới
              </Button>
            </Box>

            {sectionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              sections &&
              sections.length > 0 &&
              sections.map((section) => (
                <Box key={section.id} sx={{ mb: 3 }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
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
                              handleEditSection(section)
                            }}
                          >
                            <Edit color='info' fontSize='small' />
                          </IconButton>
                          <IconButton
                            color='error'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSection(section.id)
                            }}
                          >
                            <Delete fontSize='small' />
                          </IconButton>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                          size='small'
                          variant='contained'
                          startIcon={<AddIcon />}
                          onClick={() => handleAddLesson(section.id)}
                        >
                          Thêm bài học
                        </Button>
                      </Box>

                      {section.lessons && section.lessons.length > 0 ? (
                        <Box>
                          {section.lessons.map((lesson) => (
                            <Box key={lesson.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                              <Box
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
                              >
                                <Typography variant='body1' fontWeight='bold'>
                                  {lesson.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size='small'
                                    variant='outlined'
                                    onClick={() =>
                                      navigate(`/admin/courses/${id}/sections/${section.id}/lessons/${lesson.id}`)
                                    }
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    size='small'
                                    variant='outlined'
                                    color='error'
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                  >
                                    Xóa
                                  </Button>
                                </Box>
                              </Box>
                              <Typography variant='body2' color='text.secondary'>
                                {lesson.content ? (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        lesson.content.length > 100
                                          ? lesson.content.substring(0, 100) + '...'
                                          : lesson.content
                                    }}
                                  />
                                ) : (
                                  'No description available'
                                )}
                              </Typography>
                              {lesson.video_url && (
                                <Typography variant='body2' color='primary' sx={{ mt: 1 }}>
                                  Video: Có
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          Chưa có bài học nào trong chương này.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>

      {isOpenFormSection && (
        <Modal open={isOpenFormSection} onClose={() => setIsOpenFormSection(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: 2,
              minWidth: 400,
              maxWidth: '90%',
              boxShadow: 24
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant='h6'>{selectedSection ? 'Chỉnh sửa chương' : 'Thêm chương mới'}</Typography>
            </Box>

            <TextField
              autoFocus
              margin='dense'
              id='section-title'
              label='Tên chương'
              type='text'
              fullWidth
              variant='outlined'
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              error={!!titleError}
              helperText={titleError}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant='outlined' onClick={() => setIsOpenFormSection(false)}>
                Hủy
              </Button>
              <Button variant='contained' color='primary' onClick={handleSaveSection} disabled={submitLoading}>
                {submitLoading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : selectedSection ? (
                  'Cập nhật'
                ) : (
                  'Tạo chương'
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

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
