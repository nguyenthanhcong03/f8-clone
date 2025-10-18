import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { lessonSchema, type LessonFormValues } from '@/schemas/lesson.schema'
import { fetchCourseById } from '@/store/features/courses/courseSlice'
import { fetchLessonById, updateLesson } from '@/store/features/courses/lessonSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { ArrowLeft, Loader2, Trash2, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Control, FieldErrors, UseFormWatch } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'

type VideoPlayerProps = {
  url: string | null | undefined
  isFilePreview?: boolean
}

const VideoPlayer = ({ url, isFilePreview = false }: VideoPlayerProps) => {
  if (!url) return null

  return (
    <div className='relative overflow-hidden rounded border border-gray-300' style={{ aspectRatio: '16/9' }}>
      {isFilePreview ? (
        // Use native video element for local files
        <video controls className='h-full w-full object-contain' src={url} />
      ) : (
        <ReactPlayer src={url} controls={true} width='100%' height='100%' />
      )}
    </div>
  )
}

type ContentEditorProps = {
  value: string
  onChange: (content: string) => void
}

const ContentEditor = ({ value, onChange }: ContentEditorProps) => {
  const editorRef = useRef<Editor | null>(null)

  return (
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
  )
}

interface VideoUploadProps {
  control: Control<LessonFormValues>
  errors: FieldErrors<LessonFormValues>
  setValue: (name: keyof LessonFormValues, value: File | string | undefined) => void
  watch: UseFormWatch<LessonFormValues>
}

const VideoUpload = ({ control, errors, setValue, watch }: VideoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('videoFile', file)

      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)

      setValue('video_url', '')
    }
  }

  const handleRemoveVideo = () => {
    setValue('videoFile', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setVideoPreview(null)
  }

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
    }
  }, [videoPreview])

  return (
    <div className='space-y-6'>
      <div className='mt-4'>
        <Label className='mb-2 block text-base font-medium'>Video bài học</Label>

        {/* Video Upload Section */}
        <div className='mb-4'>
          <div className='mb-2 flex items-center gap-4'>
            <Button variant='default' className='relative flex items-center gap-2'>
              <Upload className='h-4 w-4' />
              Chọn tập tin video
              <input
                ref={fileInputRef}
                type='file'
                className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                accept='video/*'
                onChange={handleFileChange}
              />
            </Button>

            {watch('videoFile') && (
              <Button
                variant='outline'
                onClick={handleRemoveVideo}
                className='flex items-center gap-2 text-red-600 hover:text-red-700'
                type='button'
              >
                <Trash2 className='h-4 w-4' />
                Xóa
              </Button>
            )}
          </div>

          {errors.videoFile && <p className='mt-2 text-sm text-red-500'>{errors.videoFile.message?.toString()}</p>}
        </div>

        {/* Video URL Input */}
        <Controller
          name='video_url'
          control={control}
          render={({ field }) => (
            <div className='mb-4 space-y-2'>
              <Label htmlFor='video_url'>Đường dẫn video</Label>
              <Input
                {...field}
                id='video_url'
                className={errors.video_url ? 'border-red-500' : ''}
                placeholder='https://www.youtube.com/watch?v=abcdefg or https://vimeo.com/123456'
              />
              {errors.video_url && <p className='text-sm text-red-500'>{errors.video_url.message}</p>}
              <p className='text-xs text-gray-500'>
                Hỗ trợ YouTube, Vimeo, Facebook, Twitch, SoundCloud, Streamable, Wistia, DailyMotion và các liên kết
                trực tiếp đến file video
              </p>
            </div>
          )}
        />

        {/* Video Preview */}
        {videoPreview && (
          <div className='mt-4'>
            <Label className='mb-2 block text-sm font-medium'>Xem trước video tải lên:</Label>
            <VideoPlayer url={videoPreview} isFilePreview={true} />
          </div>
        )}

        {/* URL Video Preview */}
        {watch('video_url') && (
          <div className='mt-4'>
            <Label className='mb-2 block text-sm font-medium'>Xem trước video từ URL:</Label>
            <VideoPlayer url={watch('video_url')} />
          </div>
        )}
      </div>
    </div>
  )
}

const EditLessonPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { courseId, sectionId, lessonId } = useParams<{
    courseId: string
    sectionId: string
    lessonId?: string
  }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { currentCourse } = useAppSelector((state) => state.courses)
  const { currentLesson, loading: lessonLoading } = useAppSelector((state) => state.lessons)
  console.log('currentLesson', currentLesson)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      content: '',
      video_url: ''
    }
  })

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (courseId) {
        await dispatch(fetchCourseById(courseId)).unwrap()
      }

      if (lessonId) {
        await dispatch(fetchLessonById(lessonId)).unwrap()
      }
    } catch {
      dispatch(
        showSnackbar({
          message: 'Không thể tải dữ liệu bài học. Vui lòng thử lại sau.',
          severity: 'error'
        })
      )
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, courseId, lessonId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (currentLesson) {
      reset({
        title: currentLesson.title || '',
        content: currentLesson.content || '',
        video_url: currentLesson.video_url || ''
      })
    }
  }, [reset, currentLesson])

  const onSubmit = async (data: LessonFormValues) => {
    if (!sectionId) {
      dispatch(showSnackbar({ message: 'Không tìm thấy thông tin phần học.', severity: 'error' }))
      return
    }

    setIsSubmitting(true)

    try {
      if (lessonId) {
        await dispatch(
          updateLesson({
            lessonId: lessonId,
            ...data
          })
        ).unwrap()

        dispatch(
          showSnackbar({
            message: 'Cập nhật bài học thành công!',
            severity: 'success'
          })
        )

        navigate(`/admin/courses/${courseId}`)
      }
    } catch {
      dispatch(
        showSnackbar({
          message: 'Có lỗi xảy ra khi cập nhật bài học. Vui lòng thử lại.',
          severity: 'error'
        })
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (isDirty && !window.confirm('Bạn có chắc muốn hủy các thay đổi?')) {
      return
    }
    navigate(`/admin/courses/${courseId}`)
  }

  if (isLoading || lessonLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <div className='mb-6 rounded-lg bg-white p-6 shadow-sm'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center'>
            <Button variant='outline' onClick={handleCancel} className='mr-4 flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Trở về
            </Button>
            <h1 className='text-3xl font-bold'>{lessonId ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</h1>
          </div>
        </div>

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
                {/* Lesson Title */}
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label htmlFor='title'>Tiêu đề bài học *</Label>
                      <Input
                        {...field}
                        id='title'
                        className={errors.title ? 'border-red-500' : ''}
                        placeholder='Nhập tiêu đề bài học'
                      />
                      {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                    </div>
                  )}
                />

                {/* Lesson Content */}
                <div>
                  <Label className='mb-2 block text-base font-medium'>Nội dung bài học</Label>
                  <Controller
                    name='content'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ContentEditor value={value || ''} onChange={onChange} />
                    )}
                  />
                </div>

                {/* Video Upload or URL */}
                <VideoUpload control={control} errors={errors} setValue={setValue} watch={watch} />

                {/* Form Actions */}
                <div className='mt-6 flex justify-end gap-4'>
                  <Button type='button' variant='outline' onClick={handleCancel} disabled={isSubmitting}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isSubmitting || !isDirty} className='flex items-center gap-2'>
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
  )
}

export default EditLessonPage
