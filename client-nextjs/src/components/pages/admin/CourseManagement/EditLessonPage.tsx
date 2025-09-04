import { lessonSchema, type LessonFormValues } from '@/schemas/lesson.schema'
import { fetchCourseById } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { clearCurrentLesson, fetchLessonById, updateLesson } from '@/store/lessonSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

const EditLessonPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { courseId, lessonId } = useParams<{
    courseId: string
    lessonId?: string
  }>()
  const editorRef = useRef<Editor | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const { currentCourse } = useAppSelector((state) => state.courses)
  const { currentLesson } = useAppSelector((state) => state.lessons)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(Number(courseId)))
      // dispatch(fetchCourseSections(Number(courseId)))
    }
  }, [dispatch, courseId])

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(Number(lessonId)))
    } else {
      dispatch(clearCurrentLesson())
    }
  }, [dispatch, lessonId])

  useEffect(() => {
    if (currentLesson) {
      reset({
        title: currentLesson.title || '',
        content: currentLesson.content || ''
      })
    } else {
      reset({
        title: '',
        content: ''
      })
      setVideoPreview(null)
    }
  }, [currentLesson, reset])

  const onSubmit = async (data: LessonFormValues) => {
    // if (!sectionId) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (lessonId) {
        await dispatch(
          updateLesson({
            lessonId: Number(lessonId),
            ...data,
            videoFile: data.videoFile
          })
        ).unwrap()
        navigate(`/admin/courses/${courseId}`)
      }
    } catch {
      setError('Có lỗi xảy ra khi lưu bài học. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('videoFile', file)

      // Tạo URL xem trước video
      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)
    }
  }

  const handleRemoveVideo = () => {
    setValue('videoFile', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setVideoPreview(null)
  }

  const handleCancel = () => {
    navigate(`/admin/courses/${courseId}`)
  }

  // if (lessonLoading) {
  //   return (
  //     <Box display='flex' justifyContent='center' alignItems='center' minHeight='80vh'>
  //       <CircularProgress />
  //     </Box>
  //   )
  // }

  return (
    <Container maxWidth='lg'>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box display='flex' alignItems='center' mb={3}>
          <Button startIcon={<ArrowBackIcon />} variant='outlined' onClick={handleCancel} sx={{ mr: 2 }}>
            Trở về
          </Button>
          <Typography variant='h4' component='h1'>
            {lessonId ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
          </Typography>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box>
          <Card>
            <CardContent>
              {/* Course and Section Info */}
              {currentCourse && (
                <Box mb={4}>
                  <Typography variant='subtitle1' color='text.secondary' gutterBottom>
                    Khóa học: <strong>{currentCourse.title}</strong>
                  </Typography>
                  {/* {currentSection && (
                    <Typography variant='subtitle1' color='text.secondary'>
                      Chương: <strong>{currentSection.title}</strong>
                    </Typography>
                  )} */}
                </Box>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Tiêu đề bài học'
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        required
                      />
                    )}
                  />

                  <Box>
                    <Typography variant='subtitle1' gutterBottom>
                      Nội dung bài học
                    </Typography>
                    <Controller
                      name='content'
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Editor
                          onInit={(_, editor) => (editorRef.current = editor)}
                          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                          value={value}
                          onEditorChange={onChange}
                          init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                              'advlist autolink lists link image charmap print preview anchor',
                              'searchreplace visualblocks code fullscreen',
                              'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar:
                              'undo redo | formatselect | ' +
                              'bold italic backcolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Video File Upload */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='subtitle1' gutterBottom>
                      Tải lên video bài học
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button variant='contained' component='label' startIcon={<CloudUploadIcon />}>
                        Chọn tập tin video
                        <input ref={fileInputRef} type='file' hidden accept='video/*' onChange={handleFileChange} />
                      </Button>

                      {watch('videoFile') && (
                        <Button variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={handleRemoveVideo}>
                          Xóa
                        </Button>
                      )}
                    </Box>

                    {errors.videoFile && <FormHelperText error>{errors.videoFile.message?.toString()}</FormHelperText>}

                    {/* Video Preview */}
                    {videoPreview && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant='subtitle2' gutterBottom>
                          Xem trước video:
                        </Typography>
                        <Box
                          component='video'
                          controls
                          sx={{
                            width: '100%',
                            maxHeight: '300px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}
                          src={videoPreview}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button variant='outlined' onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                      {lessonId ? 'Cập nhật' : 'Tạo bài học'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditLessonPage
