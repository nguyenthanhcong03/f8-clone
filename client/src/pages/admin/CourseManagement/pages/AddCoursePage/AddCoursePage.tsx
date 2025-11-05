import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCourseSchema, type CreateCourseInput } from '@/schemas/course.schema'
import { useCreateCourseMutation } from '@/store/api/courseApi'
import { getErrorMessage } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { AlertCircleIcon, ArrowLeftIcon, BookOpenIcon, DollarSignIcon, ImageIcon, SaveIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import slugify from 'slugify'

const AddCoursePage = () => {
  const navigate = useNavigate()

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    trigger,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    mode: 'all',
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

  const onSubmit = async (data: CreateCourseInput) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('slug', data.slug || '')
      formData.append('description', data.description || '')
      formData.append('level', data.level)
      formData.append('isPaid', data.isPaid.toString())

      if (data.isPaid && data.price !== undefined && data.price !== null) {
        formData.append('price', data.price.toString())
      }

      if (data.thumbnail instanceof File) {
        formData.append('thumbnail', data.thumbnail)
      }

      // const dataObj = Object.fromEntries(formData.entries())
      // console.log('👉check: ', dataObj)
      await createCourse(formData).unwrap()

      toast.success('Tạo khóa học thành công')
      navigate('/admin/courses')
    } catch (error) {
      console.error('Create course error:', error)
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
      trigger('slug')
    }
  }, [titleValue, setValue, isDirty, trigger])

  return (
    <div className='flex h-full flex-col'>
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
                <ArrowLeftIcon className='mr-2 h-4 w-4' />
                Quay lại
              </Button>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                form='course-form'
                type='submit'
                disabled={isSubmitting || isCreating}
                className='bg-primary hover:bg-primary/90'
              >
                <SaveIcon className='mr-2 h-4 w-4' />
                {isSubmitting || isCreating ? 'Đang lưu...' : 'Tạo mới'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto w-full max-w-7xl overflow-y-auto p-6'>
        <form id='course-form' onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-6'>
          <Card id='basic-info' className='border-slate-200 shadow-sm'>
            <CardHeader className='border-b border-slate-200 bg-slate-50'>
              <CardTitle className='flex items-center gap-2 text-slate-900'>
                <BookOpenIcon className='h-5 w-5' />
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
                          <AlertCircleIcon className='h-4 w-4' />
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
                          <AlertCircleIcon className='h-4 w-4' />
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
                        <AlertCircleIcon className='h-4 w-4' />
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
                        <AlertCircleIcon className='h-4 w-4' />
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
                <DollarSignIcon className='h-5 w-5' />
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
                        <DollarSignIcon className='h-5 w-5 text-slate-600' />
                        <Label htmlFor='isPaid' className='font-medium text-slate-900'>
                          Khóa học trả phí
                        </Label>
                      </div>

                      <p className='text-sm text-slate-600'>Bật tùy chọn này nếu bạn muốn thu phí cho khóa học</p>
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
                        <DollarSignIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500' />
                        <Input
                          {...field}
                          id='price'
                          type='number'
                          min={0}
                          step={1000}
                          placeholder='599000'
                          className={`pl-10 ${errors.price ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-primary'}`}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === '' ? undefined : Number(value))
                          }}
                          onKeyDown={(e) => {
                            if (['-', '+', 'e', 'E'].includes(e.key)) {
                              e.preventDefault()
                            }
                          }}
                        />
                      </div>
                      {errors.price && (
                        <p className='flex items-center gap-1 text-sm text-red-600'>
                          <AlertCircleIcon className='h-4 w-4' />
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
                <ImageIcon className='h-5 w-5' />
                Hình ảnh khóa học
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 p-6'>
              <Controller
                name='thumbnail'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className='space-y-3'>
                    <Label className='font-medium text-slate-700'>Tải ảnh mới lên</Label>

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
                          <ImageIcon className='h-8 w-8 text-slate-500' />
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
                          <ImageIcon className='mr-2 h-4 w-4' />
                          {value instanceof File ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                        </Button>
                      </div>
                    </div>

                    {errors.thumbnail && (
                      <p className='flex items-center gap-1 text-sm text-red-600'>
                        <AlertCircleIcon className='h-4 w-4' />
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
  )
}

export default AddCoursePage
