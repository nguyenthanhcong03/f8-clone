import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { lessonSchema, type LessonFormValues } from '@/schemas/lesson.schema'
import { useGetCourseByIdQuery } from '@/store/api/courseApi'
import { useGetLessonByIdQuery, useUpdateLessonMutation } from '@/store/api/lessonApi'
import { skipToken } from '@/store/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { AlertCircle, ArrowLeft, BookOpen, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Control, FieldErrors, UseFormWatch } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import ReactPlayer from 'react-player'
import { useNavigate, useParams, useBlocker } from 'react-router-dom'
import { toast } from 'react-toastify'

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
  return (
    <div>
      {/* <Editor
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
      /> */}
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        init={{
          height: 300,
          menubar: false,
          plugins: ['link', 'image', 'code', 'lists', 'table', 'emoticons'],
          toolbar:
            'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | emoticons | code',
          content_style:
            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }'
        }}
        value={value || ''}
        onEditorChange={onChange}
      />
    </div>
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

      setValue('videoUrl', '')
    }
  }

  const handleRemoveVideo = () => {
    setValue('videoFile', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setVideoPreview(null)
  }

  // Cleanup khi component unmount hoặc videoPreview thay đổi
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
    }
  }, [videoPreview])

  return (
    <div className='space-y-6'>
      {/* Tải lên video */}
      <div className='space-y-4'>
        <Label className='text-sm font-medium text-gray-700'>Tải lên video từ máy tính</Label>

        <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50'>
          <input ref={fileInputRef} type='file' className='hidden' accept='video/*' onChange={handleFileChange} />

          <div className='space-y-3'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <Upload className='h-6 w-6 text-blue-600' />
            </div>

            <div className='space-y-1'>
              <p className='font-medium text-gray-900'>
                {watch('videoFile') ? `Đã chọn: ${(watch('videoFile') as File)?.name}` : 'Chọn video để tải lên'}
              </p>
              <p className='text-sm text-gray-600'>MP4, MOV, AVI, WMV tối đa 100MB</p>
            </div>

            <div className='flex items-center justify-center gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
                className='border-blue-300 text-blue-600 hover:bg-blue-50'
              >
                <Upload className='mr-2 h-4 w-4' />
                {watch('videoFile') ? 'Thay đổi video' : 'Chọn video'}
              </Button>

              {watch('videoFile') && (
                <Button
                  variant='outline'
                  onClick={handleRemoveVideo}
                  className='border-red-300 text-red-600 hover:bg-red-50'
                  type='button'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </div>

        {errors.videoFile && (
          <p className='flex items-center gap-1 text-sm text-red-600'>
            <AlertCircle className='h-4 w-4' />
            {errors.videoFile.message?.toString()}
          </p>
        )}
      </div>

      {/* Đường dẫn video */}
      {!watch('videoFile') && (
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <div className='h-px flex-1 bg-gray-300'></div>
            <span className='bg-white px-3 text-sm text-gray-500'>HOẶC</span>
            <div className='h-px flex-1 bg-gray-300'></div>
          </div>

          <Controller
            name='videoUrl'
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label htmlFor='video_url' className='text-sm font-medium text-gray-700'>
                  Đường dẫn video trực tuyến
                </Label>
                <Input
                  {...field}
                  id='video_url'
                  placeholder='https://www.youtube.com/watch?v=abcdefg'
                  className={`transition-colors ${
                    errors.videoUrl
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.videoUrl && (
                  <p className='flex items-center gap-1 text-sm text-red-600'>
                    <AlertCircle className='h-4 w-4' />
                    {errors.videoUrl.message}
                  </p>
                )}
                <p className='text-xs text-gray-600'>
                  Hỗ trợ YouTube, Vimeo, Facebook, Twitch, SoundCloud và các liên kết video trực tiếp
                </p>
              </div>
            )}
          />
        </div>
      )}

      {/* Preview video */}
      {videoPreview && (
        <div className='space-y-3'>
          <Label className='text-sm font-medium text-gray-700'>Xem trước video tải lên</Label>
          <div className='overflow-hidden rounded-lg border border-gray-300'>
            <VideoPlayer url={videoPreview} isFilePreview={true} />
          </div>
        </div>
      )}

      {watch('videoUrl') && !watch('videoFile') && (
        <div className='space-y-3'>
          <Label className='text-sm font-medium text-gray-700'>Xem trước video từ URL</Label>
          <div className='overflow-hidden rounded-lg border border-gray-300'>
            <VideoPlayer url={watch('videoUrl')} />
          </div>
        </div>
      )}
    </div>
  )
}

const EditLessonPage = () => {
  const navigate = useNavigate()
  const { courseId, sectionId, lessonId } = useParams<{
    courseId: string
    sectionId: string
    lessonId?: string
  }>()
  const { data: courseData, isLoading: isCourseLoading } = useGetCourseByIdQuery(courseId ?? skipToken)
  const { data: lessonData, isLoading: isLessonLoading } = useGetLessonByIdQuery(lessonId ?? skipToken)
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation()
  const currentCourse = courseData?.data
  const currentLesson = lessonData?.data
  console.log('🚀 ~ EditLessonPage.tsx:260 ~ EditLessonPage ~ currentLesson:', currentLesson)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      content: '',
      videoUrl: ''
    }
  })

  useEffect(() => {
    if (currentLesson) {
      reset({
        title: currentLesson.title || '',
        content: currentLesson.content || '',
        videoUrl: currentLesson.videoUrl || ''
      })
    }
  }, [reset, currentLesson])

  const onSubmit = async (data: LessonFormValues) => {
    if (!sectionId) {
      toast.error('Chương không hợp lệ. Vui lòng thử lại.')
      return
    }
    console.log('Data: ', data)

    try {
      if (lessonId && courseId) {
        await updateLesson({
          courseId,
          lessonData: {
            lessonId,
            title: data.title,
            content: data.content,
            video_url: data.videoUrl,
            videoFile: data.videoFile
          }
        }).unwrap()

        toast.success('Cập nhật bài học thành công!')
        // navigate(`/admin/courses/edit-structure/${courseId}`)
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi cập nhật bài học. Vui lòng thử lại.')
    }
  }

  if (isCourseLoading || isLessonLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Đang tải bài học</h3>
            <p className='text-muted-foreground'>Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='flex-shrink-0 border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto w-full px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  if (isDirty) {
                    if (
                      window.confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang này không?')
                    ) {
                      navigate(`/admin/courses/edit-structure/${courseId}`)
                    }
                  } else {
                    navigate(`/admin/courses/edit-structure/${courseId}`)
                  }
                }}
                className='text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Quay lại cấu trúc khóa học
              </Button>

              {currentLesson?.title && (
                <>
                  <Separator orientation='vertical' className='h-6' />
                  <div>
                    <h1 className='text-xl font-bold text-gray-900'>{currentLesson.title}</h1>
                    <p className='text-sm text-gray-600'>Chỉnh sửa nội dung bài học</p>
                  </div>
                </>
              )}
            </div>

            <div className='flex items-center gap-3'>
              {isDirty && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    if (currentLesson) {
                      reset({
                        title: currentLesson.title || '',
                        content: currentLesson.content || '',
                        videoUrl: currentLesson.videoUrl || ''
                      })
                      toast.success('Đã khôi phục dữ liệu gốc')
                    }
                  }}
                  disabled={isSubmitting || isUpdating || !isDirty}
                  className='border-gray-300 text-gray-700 hover:bg-gray-50'
                >
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Khôi phục
                </Button>
              )}

              <Button
                form='lesson-form'
                type='submit'
                disabled={isSubmitting || isUpdating || !isDirty}
                className='bg-blue-600 text-white shadow-md hover:bg-blue-700'
              >
                <ArrowLeft className='mr-2 h-4 w-4 rotate-180' />
                {isSubmitting || isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto w-full max-w-7xl overflow-y-auto p-6'>
        {/* Thông báo thay đổi chưa lưu */}
        {isDirty && (
          <div className='mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='h-5 w-5 text-yellow-600' />
              <div className='flex-1'>
                <h4 className='text-sm font-medium text-yellow-800'>Có thay đổi chưa được lưu</h4>
                <p className='text-sm text-yellow-700'>
                  Bạn có những thay đổi chưa được lưu. Hãy nhấn "Lưu thay đổi" để lưu lại hoặc "Khôi phục" để hủy bỏ các
                  thay đổi.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className='border bg-white'>
          <CardHeader className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6'>
            <CardTitle className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
              <BookOpen className='h-6 w-6 text-blue-600' />
              Chỉnh sửa bài học
            </CardTitle>
            {currentCourse && (
              <p className='mt-2 text-sm text-gray-600'>
                Khóa học: <span className='font-medium text-gray-800'>{currentCourse.title}</span>
              </p>
            )}
          </CardHeader>

          <CardContent className='px-8 py-8'>
            <form id='lesson-form' onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Thông tin cơ bản */}
              <div className='space-y-6'>
                <div className='border-l-4 border-blue-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Thông tin cơ bản</h3>
                  <p className='text-sm text-gray-600'>Tiêu đề và nội dung chính của bài học</p>
                </div>

                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label htmlFor='title' className='text-sm font-medium text-gray-700'>
                        Tiêu đề bài học <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        {...field}
                        id='title'
                        placeholder='Nhập tiêu đề bài học'
                        className={`transition-colors ${
                          errors.title
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      {errors.title && (
                        <p className='flex items-center gap-1 text-sm text-red-600'>
                          <AlertCircle className='h-4 w-4' />
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700'>Nội dung bài học</Label>
                  <Controller
                    name='content'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className='overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'>
                        <ContentEditor value={value || ''} onChange={onChange} />
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Video bài học */}
              <div className='space-y-6'>
                <div className='border-l-4 border-purple-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Video bài học</h3>
                  <p className='text-sm text-gray-600'>Tải lên video hoặc nhập đường dẫn video</p>
                </div>

                <VideoUpload control={control} errors={errors} setValue={setValue} watch={watch} />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditLessonPage
