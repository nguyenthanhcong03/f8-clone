import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCourseSchema, type CreateCourseInput } from '@/schemas/course.schema'
import { useCreateCourseMutation } from '@/services/api/courseApi'
import { getErrorMessage } from '@/services/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { AlertCircleIcon, ArrowLeftIcon, BookOpenIcon, DollarSignIcon, ImageIcon, SaveIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import slugify from 'slugify'

const CreateCoursePage = () => {
  const navigate = useNavigate()

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema) as Resolver<CreateCourseInput>,
    mode: 'all',
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      level: 'beginner',
      isPaid: false,
      price: undefined,
      isPublished: false,
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
      formData.append('isPublished', data.isPublished.toString())

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
      <div className='flex-shrink-0 border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto w-full px-6 py-4'>
          <div className='flex items-center justify-between'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/admin/courses')}
              className='text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            >
              <ArrowLeftIcon className='mr-2 h-4 w-4' />
              Quay lại danh sách
            </Button>

            <Button
              form='course-form'
              type='submit'
              disabled={isSubmitting || isCreating}
              className='bg-blue-600 text-white shadow-md hover:bg-blue-700'
            >
              <SaveIcon className='mr-2 h-4 w-4' />
              {isSubmitting || isCreating ? 'Đang tạo...' : 'Tạo khóa học'}
            </Button>
          </div>
        </div>
      </div>
      <div className='mx-auto w-full max-w-7xl overflow-y-auto p-6'>
        <Card className='border bg-white'>
          <CardHeader className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6'>
            <CardTitle className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
              <BookOpenIcon className='h-6 w-6 text-blue-600' />
              Tạo khóa học mới
            </CardTitle>
            <p className='mt-2 text-sm text-gray-600'>Điền thông tin để tạo khóa học cho học viên</p>
          </CardHeader>

          <CardContent className='px-8 py-8'>
            <form id='course-form' onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-8'>
              {/* Thông tin cơ bản */}
              <div className='space-y-6'>
                <div className='border-l-4 border-blue-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Thông tin cơ bản</h3>
                  <p className='text-sm text-gray-600'>Thông tin chính về khóa học</p>
                </div>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='title' className='text-sm font-medium text-gray-700'>
                          Tên khóa học <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          {...field}
                          id='title'
                          placeholder='Nhập tên khóa học'
                          className={`transition-colors ${
                            errors.title
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
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
                        <Label htmlFor='slug' className='text-sm font-medium text-gray-700'>
                          Đường dẫn URL
                        </Label>
                        <Input
                          {...field}
                          id='slug'
                          placeholder='duong-dan-khoa-hoc'
                          className={`transition-colors ${
                            errors.slug
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
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
                  name='level'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-gray-700'>Trình độ khóa học</Label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={`${errors.level ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                        >
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

                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium text-gray-700'>Mô tả khóa học</Label>
                      <div className='overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'>
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
                      {errors.description && (
                        <p className='flex items-center gap-1 text-sm text-red-600'>
                          <AlertCircleIcon className='h-4 w-4' />
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Cài đặt giá và xuất bản */}
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                {/* Cài đặt giá */}
                <div className='space-y-4'>
                  <div className='border-l-4 border-green-500 pl-4'>
                    <h3 className='mb-1 text-lg font-semibold text-gray-800'>Cài đặt giá</h3>
                    <p className='text-sm text-gray-600'>Thiết lập giá cho khóa học</p>
                  </div>

                  <Controller
                    name='isPaid'
                    control={control}
                    render={({ field }) => (
                      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-2'>
                              <DollarSignIcon className='h-5 w-5 text-gray-600' />
                              <Label htmlFor='isPaid' className='font-medium text-gray-900'>
                                Khóa học trả phí
                              </Label>
                            </div>
                            <p className='text-sm text-gray-600'>Bật để thu phí cho khóa học</p>
                          </div>
                          <input
                            type='checkbox'
                            id='isPaid'
                            checked={field.value}
                            onChange={field.onChange}
                            className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                        </div>
                      </div>
                    )}
                  />

                  {isPaidValue && (
                    <Controller
                      name='price'
                      control={control}
                      render={({ field }) => (
                        <div className='space-y-2'>
                          <Label htmlFor='price' className='text-sm font-medium text-gray-700'>
                            Giá khóa học (VNĐ) <span className='text-red-500'>*</span>
                          </Label>
                          <div className='relative'>
                            <DollarSignIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500' />
                            <Input
                              {...field}
                              id='price'
                              type='number'
                              min={0}
                              step={1000}
                              placeholder='599000'
                              className={`pl-10 ${
                                errors.price
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              }`}
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
                          <p className='text-sm text-gray-600'>Đặt giá hợp lý để thu hút học viên</p>
                        </div>
                      )}
                    />
                  )}
                </div>

                {/* Cài đặt xuất bản */}
                <div className='space-y-4'>
                  <div className='border-l-4 border-purple-500 pl-4'>
                    <h3 className='mb-1 text-lg font-semibold text-gray-800'>Cài đặt xuất bản</h3>
                    <p className='text-sm text-gray-600'>Kiểm soát hiển thị khóa học</p>
                  </div>

                  <Controller
                    name='isPublished'
                    control={control}
                    render={({ field }) => (
                      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-2'>
                              <BookOpenIcon className='h-5 w-5 text-gray-600' />
                              <Label htmlFor='isPublished' className='font-medium text-gray-900'>
                                Xuất bản khóa học
                              </Label>
                            </div>
                            <p className='text-sm text-gray-600'>Bật để hiển thị công khai</p>
                          </div>
                          <input
                            type='checkbox'
                            id='isPublished'
                            checked={field.value}
                            onChange={field.onChange}
                            className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Hình ảnh khóa học */}
              <div className='space-y-4'>
                <div className='border-l-4 border-orange-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Hình ảnh khóa học</h3>
                  <p className='text-sm text-gray-600'>Tải lên ảnh đại diện cho khóa học</p>
                </div>

                <Controller
                  name='thumbnail'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className='space-y-3'>
                      <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50'>
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

                        <div className='space-y-3'>
                          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                            <ImageIcon className='h-6 w-6 text-blue-600' />
                          </div>

                          <div className='space-y-1'>
                            <p className='font-medium text-gray-900'>
                              {value instanceof File ? `Đã chọn: ${value.name}` : 'Chọn ảnh để tải lên'}
                            </p>
                            <p className='text-sm text-gray-600'>PNG, JPG, WebP tối đa 5MB</p>
                          </div>

                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => document.getElementById('thumbnail-upload')?.click()}
                            className='border-blue-300 text-blue-600 hover:bg-blue-50'
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
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateCoursePage
