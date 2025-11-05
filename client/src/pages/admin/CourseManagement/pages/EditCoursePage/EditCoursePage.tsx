import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { updateCourseSchema, type CreateCourseInput, type UpdateCourseInput } from '@/schemas/course.schema'
import { useGetCourseByIdQuery, useUpdateCourseMutation } from '@/store/api/courseApi'
import { getErrorMessage } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle2, DollarSign, Image, Save } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import slugify from 'slugify'
import CourseSummary from './components/CourseSummary'

const EditCoursePage = () => {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()

  const { data, isLoading: isLoadingCourse, error: courseError } = useGetCourseByIdQuery(courseId!)
  const course = data?.data
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<UpdateCourseInput>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      level: 'beginner',
      isPaid: false,
      price: undefined,
      thumbnail: undefined
    }
  })

  const isPaidValue = watch('isPaid')
  const titleValue = watch('title')

  // Load dữ liệu khóa học khi component mount
  useEffect(() => {
    if (course) {
      reset({
        title: course.title || '',
        slug: course.slug || '',
        description: course.description || '',
        level: course.level || 'beginner',
        isPaid: course.isPaid || false,
        price: course.price || undefined,
        thumbnail: undefined
      })
    }
  }, [course, reset])

  const onSubmit = async (data: UpdateCourseInput) => {
    if (!courseId) {
      toast.error('Không tìm thấy ID khóa học')
      return
    }

    try {
      const formData = new FormData()
      if (data.title) formData.append('title', data.title)
      if (data.slug) formData.append('slug', data.slug)
      if (data.description) formData.append('description', data.description)
      if (data.level) formData.append('level', data.level)
      if (data.isPaid) formData.append('isPaid', data.isPaid.toString())
      if (data.isPaid && data.price !== undefined && data.price !== null)
        formData.append('price', data.price.toString())
      if (data.thumbnail instanceof File) formData.append('thumbnail', data.thumbnail)

      const dataObj = Object.fromEntries(formData.entries())
      console.log('👉check: ', dataObj)

      await updateCourse({ id: courseId, data: formData }).unwrap()
      toast.success('Cập nhật khóa học thành công')
      navigate('/admin/courses')
    } catch (error) {
      console.error('Update error:', error)
      toast.error(getErrorMessage(error) || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  // Cập nhật slug tự động khi title thay đổi
  useEffect(() => {
    if (titleValue && isDirty) {
      const newSlug = slugify(titleValue, {
        lower: true, // viết thường
        strict: true, // bỏ ký tự đặc biệt
        locale: 'vi'
      })
      setValue('slug', newSlug)
    }
  }, [titleValue, setValue, isDirty])

  // Loading state
  if (isLoadingCourse) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Đang tải khóa học</h3>
            <p className='text-muted-foreground'>Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (courseError) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <AlertCircle className='mx-auto h-16 w-16 text-destructive' />
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Không thể tải khóa học</h3>
            <p className='text-muted-foreground'>Đã xảy ra lỗi khi tải thông tin khóa học</p>
          </div>
          <Button onClick={() => navigate('/admin/courses')} variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col bg-slate-50'>
      {/* Header */}
      <div className='flex-shrink-0 border-b border-slate-200 bg-white shadow-sm'>
        <div className='mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigate('/admin/courses')}
                className='hover:bg-slate-100'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Quay lại
              </Button>
              <Separator orientation='vertical' className='h-6' />
              <div>
                <h1 className='text-2xl font-bold text-slate-900'>Chỉnh sửa khóa học</h1>
                <p className='text-sm text-slate-600'>
                  {course?.title && (
                    <span className='flex items-center gap-2'>
                      <BookOpen className='h-4 w-4' />
                      {course.title}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              {course?.isPublished ? (
                <Badge variant='default' className='bg-green-100 text-green-800'>
                  <CheckCircle2 className='mr-1 h-3 w-3' />
                  Đã xuất bản
                </Badge>
              ) : (
                <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
                  <AlertCircle className='mr-1 h-3 w-3' />
                  Bản nháp
                </Badge>
              )}

              <Button
                form='course-form'
                type='submit'
                disabled={isSubmitting || isUpdating}
                className='bg-primary hover:bg-primary/90'
              >
                <Save className='mr-2 h-4 w-4' />
                {isSubmitting || isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        <div className='mx-auto flex h-full w-full px-6 py-8'>
          <div className='grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-4'>
            {/* Tổng quan khóa học - Left column */}
            <div className='lg:col-span-1'>
              <div className='space-y-6'>{course && <CourseSummary course={course} />}</div>
            </div>
            {/*  Edit form - Right Column */}
            <div className='h-full overflow-hidden lg:col-span-3'>
              <div className='h-full overflow-y-auto pr-2'>
                <form id='course-form' onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <Card id='basic-info' className='border-slate-200 shadow-sm'>
                    <CardHeader className='border-b border-slate-200 bg-slate-50'>
                      <CardTitle className='flex items-center gap-2 text-slate-900'>
                        <BookOpen className='h-5 w-5' />
                        Thông tin cơ bản
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6 p-6'>
                      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <Controller
                          name='title'
                          control={control}
                          render={({ field }) => (
                            <div className='space-y-2'>
                              <Label htmlFor='title' className='font-medium text-slate-700'>
                                Tên khóa học <span className='text-red-500'>*</span>
                              </Label>
                              <Input
                                {...field}
                                id='title'
                                placeholder='Nhập tên khóa học'
                                className={`${errors.title ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-primary'}`}
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

                        <Controller
                          name='slug'
                          control={control}
                          render={({ field }) => (
                            <div className='space-y-2'>
                              <Label htmlFor='slug' className='font-medium text-slate-700'>
                                Đường dẫn URL
                              </Label>
                              <Input
                                {...field}
                                id='slug'
                                placeholder='duong-dan-khoa-hoc'
                                className={`${errors.slug ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-primary'}`}
                              />
                              {errors.slug && (
                                <p className='flex items-center gap-1 text-sm text-red-600'>
                                  <AlertCircle className='h-4 w-4' />
                                  {errors.slug.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <div className='space-y-2'>
                            <Label className='font-medium text-slate-700'>Mô tả khóa học</Label>
                            <div className='overflow-hidden rounded-lg border border-slate-300'>
                              <Editor
                                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                init={{
                                  height: 350,
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
                            {errors.description && (
                              <p className='flex items-center gap-1 text-sm text-red-600'>
                                <AlertCircle className='h-4 w-4' />
                                {errors.description.message}
                              </p>
                            )}
                          </div>
                        )}
                      />

                      <Controller
                        name='level'
                        control={control}
                        render={({ field }) => (
                          <div className='space-y-2'>
                            <Label className='font-medium text-slate-700'>Trình độ khóa học</Label>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className={`${errors.level ? 'border-red-300' : 'border-slate-300'}`}>
                                <SelectValue placeholder='Chọn trình độ phù hợp' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='beginner'>
                                  <div className='flex items-center gap-2'>
                                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                    Cơ bản
                                  </div>
                                </SelectItem>
                                <SelectItem value='intermediate'>
                                  <div className='flex items-center gap-2'>
                                    <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                                    Trung cấp
                                  </div>
                                </SelectItem>
                                <SelectItem value='advanced'>
                                  <div className='flex items-center gap-2'>
                                    <div className='h-2 w-2 rounded-full bg-red-500'></div>
                                    Nâng cao
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.level && (
                              <p className='flex items-center gap-1 text-sm text-red-600'>
                                <AlertCircle className='h-4 w-4' />
                                {errors.level.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className='border-slate-200 shadow-sm'>
                    <CardHeader className='border-b border-slate-200 bg-slate-50'>
                      <CardTitle className='flex items-center gap-2 text-slate-900'>
                        <DollarSign className='h-5 w-5' />
                        Cài đặt giá
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6 p-6'>
                      <Controller
                        name='isPaid'
                        control={control}
                        render={({ field }) => (
                          <div className='flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4'>
                            <div className='space-y-1'>
                              <div className='flex items-center gap-2'>
                                <DollarSign className='h-5 w-5 text-slate-600' />
                                <Label htmlFor='isPaid' className='font-medium text-slate-900'>
                                  Khóa học trả phí
                                </Label>
                              </div>

                              <p className='text-sm text-slate-600'>
                                Bật tùy chọn này nếu bạn muốn thu phí cho khóa học
                              </p>
                            </div>

                            <input
                              type='checkbox'
                              id='isPaid'
                              checked={field.value}
                              onChange={field.onChange}
                              className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                            />
                          </div>
                        )}
                      />

                      {isPaidValue && (
                        <Controller
                          name='price'
                          control={control}
                          render={({ field }) => (
                            <div className='space-y-2'>
                              <Label htmlFor='price' className='font-medium text-slate-700'>
                                Giá khóa học (VNĐ) <span className='text-red-500'>*</span>
                              </Label>
                              <div className='relative'>
                                <DollarSign className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500' />
                                <Input
                                  {...field}
                                  id='price'
                                  type='number'
                                  min={0}
                                  step={1000}
                                  placeholder='599000'
                                  className={`pl-10 ${errors.price ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-primary'}`}
                                  value={field.value || ''}
                                />
                              </div>
                              {errors.price && (
                                <p className='flex items-center gap-1 text-sm text-red-600'>
                                  <AlertCircle className='h-4 w-4' />
                                  {errors.price.message}
                                </p>
                              )}
                              <p className='text-sm text-slate-600'>
                                Đặt giá hợp lý để thu hút học viên. Bạn có thể thay đổi giá sau này.
                              </p>
                            </div>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <Card className='border-slate-200 shadow-sm'>
                    <CardHeader className='border-b border-slate-200 bg-slate-50'>
                      <CardTitle className='flex items-center gap-2 text-slate-900'>
                        <Image className='h-5 w-5' />
                        Hình ảnh đại diện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6 p-6'>
                      {course?.thumbnail && (
                        <div className='space-y-3'>
                          <Label className='font-medium text-slate-700'>Ảnh hiện tại</Label>
                          <div className='relative inline-block'>
                            <img
                              src={course.thumbnail}
                              alt='Course thumbnail'
                              className='h-36 w-64 rounded-lg border border-slate-300 object-cover shadow-sm'
                            />
                            <Badge className='absolute right-2 top-2 bg-white/90 text-slate-700 shadow-sm'>
                              Đang sử dụng
                            </Badge>
                          </div>
                        </div>
                      )}

                      <Controller
                        name='thumbnail'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <div className='space-y-3'>
                            <Label className='font-medium text-slate-700'>
                              {course?.thumbnail ? 'Tải ảnh mới lên' : 'Tải ảnh đại diện'}
                            </Label>

                            <div className='rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-primary/50'>
                              <input
                                id='thumbnail-upload'
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  onChange(file)
                                }}
                              />

                              <div className='space-y-4'>
                                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                                  <Image className='h-8 w-8 text-slate-500' />
                                </div>

                                <div className='space-y-2'>
                                  <p className='font-medium text-slate-900'>
                                    {value instanceof File ? `Đã chọn: ${value.name}` : 'Chọn ảnh để tải lên'}
                                  </p>
                                  <p className='text-sm text-slate-600'>PNG, JPG, WebP tối đa 5MB</p>
                                </div>

                                <Button
                                  type='button'
                                  variant='outline'
                                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                  className='border-primary/20 hover:bg-primary/5'
                                >
                                  <Image className='mr-2 h-4 w-4' />
                                  {value instanceof File ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                                </Button>
                              </div>
                            </div>

                            {errors.thumbnail && (
                              <p className='flex items-center gap-1 text-sm text-red-600'>
                                <AlertCircle className='h-4 w-4' />
                                {errors.thumbnail.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </CardContent>
                  </Card>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCoursePage
