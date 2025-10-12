import { lessonSchema, type LessonFormValues } from '@/schemas/lesson.schema'
import { fetchCourseById } from '@/store/features/courses/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { clearCurrentLesson, fetchLessonById, updateLesson } from '@/store/features/courses/lessonSlice'
import { fetchCourseSections } from '@/store/features/courses/sectionSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Upload, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

const EditLessonPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { courseId, sectionId, lessonId } = useParams<{
    courseId: string
    sectionId: string
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
      dispatch(fetchCourseSections(Number(courseId)))
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
    if (!sectionId) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (lessonId) {
        // Update existing lesson
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
    <div className='max-w-6xl mx-auto'>
      <div className='bg-white p-6 mb-6 rounded-lg shadow-sm'>
        <div className='flex items-center mb-6'>
          <Button variant='outline' onClick={handleCancel} className='mr-4 flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Trở về
          </Button>
          <h1 className='text-3xl font-bold'>{lessonId ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</h1>
        </div>

        {error && (
          <Alert className='mb-6'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Card>
            <CardContent className='p-6'>
              {/* Course and Section Info */}
              {currentCourse && (
                <div className='mb-6'>
                  <p className='text-muted-foreground'>
                    Khóa học: <strong>{currentCourse.title}</strong>
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-6'>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='title'>Tiêu đề bài học *</Label>
                        <Input {...field} id='title' className={errors.title ? 'border-red-500' : ''} />
                        {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                      </div>
                    )}
                  />

                  <div>
                    <Label className='text-base font-medium mb-2 block'>Nội dung bài học</Label>
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
                  </div>

                  {/* Video File Upload */}
                  <div className='mt-4'>
                    <Label className='text-base font-medium mb-2 block'>Tải lên video bài học</Label>

                    <div className='flex items-center gap-4'>
                      <Button variant='default' className='flex items-center gap-2'>
                        <Upload className='h-4 w-4' />
                        Chọn tập tin video
                        <input
                          ref={fileInputRef}
                          type='file'
                          className='absolute inset-0 opacity-0'
                          accept='video/*'
                          onChange={handleFileChange}
                        />
                      </Button>

                      {watch('videoFile') && (
                        <Button
                          variant='outline'
                          onClick={handleRemoveVideo}
                          className='flex items-center gap-2 text-red-600 hover:text-red-700'
                        >
                          <Trash2 className='h-4 w-4' />
                          Xóa
                        </Button>
                      )}
                    </div>

                    {errors.videoFile && (
                      <p className='text-sm text-red-500 mt-2'>{errors.videoFile.message?.toString()}</p>
                    )}

                    {/* Video Preview */}
                    {videoPreview && (
                      <div className='mt-4'>
                        <Label className='text-sm font-medium mb-2 block'>Xem trước video:</Label>
                        <video
                          controls
                          className='w-full max-h-[300px] border border-gray-300 rounded'
                          src={videoPreview}
                        />
                      </div>
                    )}
                  </div>

                  <div className='flex justify-end gap-4 mt-6'>
                    <Button variant='outline' onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
                      {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
                      {lessonId ? 'Cập nhật' : 'Tạo bài học'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EditLessonPage
