import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { courseFormSchema, type CourseFormInput } from '@/schemas/course.schema'
import type { ApiError } from '@/store/api/baseApi'
import { useCreateCourseMutation } from '@/store/api/courseApi'
import { slugify } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AddCoursePage = () => {
  const navigate = useNavigate()

  const [createCourse, { data, isLoading, isError, isSuccess, error }] = useCreateCourseMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      level: 'beginner',
      is_paid: false,
      price: 0,
      thumbnail: undefined
    }
  })

  const isPaidValue = watch('is_paid')
  const titleValue = watch('title')
  console.log('👉check: ', titleValue)

  const onSubmit = async (data: CourseFormInput) => {
    try {
      const courseData = {
        ...data,
        price: data.is_paid ? (typeof data.price === 'string' ? parseFloat(data.price) : data.price) : undefined
      }
      console.log('course Data:', courseData)

      await createCourse(courseData).unwrap()
      toast.success('Tạo khóa học thành công')
      setTimeout(() => {
        navigate('/admin/courses')
      }, 1500)
    } catch (error: ApiError | any) {
      toast.error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  // Cập nhật slug tự động khi title thay đổi
  useEffect(() => {
    const newSlug = slugify(titleValue)
    setValue('slug', newSlug)
  }, [titleValue, setValue])

  return (
    <div className='mx-auto max-w-4xl p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-4'>
        <h1 className='text-3xl font-bold'>Thêm khóa học mới</h1>
      </div>
      <Card>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              {/* Basic Information */}
              <div>
                <h2 className='mb-4 text-xl font-semibold text-primary'>Thông tin khóa học</h2>
                <div className='flex flex-col gap-4'>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='title'>Tên khóa học</Label>
                        <Input
                          {...field}
                          id='title'
                          placeholder='Nhập tên khóa học'
                          className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                      </div>
                    )}
                  />

                  <Controller
                    name='slug'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='title'>Đường dẫn khóa học</Label>
                        <Input
                          {...field}
                          onChange={field.onChange}
                          id='slug'
                          placeholder='Nhập đường dẫn khóa học'
                          className={errors.slug ? 'border-red-500' : ''}
                        />
                        {errors.slug && <p className='text-sm text-red-500'>{errors.slug.message}</p>}
                      </div>
                    )}
                  />

                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label>Mô tả khóa học</Label>
                        {/* <Editor
                          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: ['link', 'image', 'code', 'lists', 'table'],
                            toolbar:
                              'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code'
                          }}
                          value={value}
                          onEditorChange={(content) => {
                            onChange(content)
                          }}
                        /> */}
                        <Input
                          {...field}
                          id='description'
                          placeholder='Nhập mô tả khóa học'
                          className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                      </div>
                    )}
                  />

                  <Controller
                    name='level'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label>Trình độ</Label>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                            <SelectValue placeholder='Chọn trình độ' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='beginner'>Cơ bản</SelectItem>
                            <SelectItem value='intermediate'>Trung cấp</SelectItem>
                            <SelectItem value='advanced'>Nâng cao</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.level && <p className='text-sm text-red-500'>{errors.level.message}</p>}
                      </div>
                    )}
                  />
                </div>
              </div>

              <hr className='my-6' />

              {/* Pricing */}
              <div>
                <h2 className='mb-4 text-xl font-semibold text-primary'>Giá khóa học</h2>
                <div className='flex flex-col gap-4'>
                  <Controller
                    name='is_paid'
                    control={control}
                    render={({ field }) => (
                      <div className='flex w-fit items-center space-x-2'>
                        <Switch id='is_paid' checked={field.value} onCheckedChange={field.onChange} />
                        <Label htmlFor='is_paid'>Khóa học trả phí</Label>
                      </div>
                    )}
                  />
                  {isPaidValue && (
                    <Controller
                      name='price'
                      control={control}
                      render={({ field }) => (
                        <div className='max-w-xs space-y-2'>
                          <Label htmlFor='price'>Giá tiền (VNĐ)</Label>
                          <Input
                            {...field}
                            id='price'
                            type='number'
                            min={0}
                            step={1}
                            placeholder='0.00'
                            className={errors.price ? 'border-red-500' : ''}
                          />
                          {errors.price && <p className='text-sm text-red-500'>{errors.price.message}</p>}
                        </div>
                      )}
                    />
                  )}
                </div>
              </div>

              <hr className='my-6' />

              {/* Thumbnail */}
              <div>
                <h2 className='mb-4 text-xl font-semibold text-primary'>Ảnh thumbnail</h2>
                <Controller
                  name='thumbnail'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className='space-y-2'>
                      <div className='grid w-full max-w-sm items-center gap-3'>
                        <Label>Ảnh nền</Label>
                        <input
                          id='picture'
                          type='file'
                          className='hidden'
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            onChange(file)
                          }}
                        />
                        <Button variant='outline'>
                          <label htmlFor='picture' className='cursor-pointer'>
                            {value ? `Đã chọn: ${value.name}` : 'Chọn ảnh...'}
                          </label>
                        </Button>
                      </div>
                      {errors.thumbnail && <p className='mt-2 text-sm text-red-500'>{errors.thumbnail.message}</p>}
                      {!errors.thumbnail && (
                        <p className='mt-2 text-sm text-muted-foreground'>
                          Định dạng: JPEG, PNG, WebP (Dung lượng tối đa 5MB)
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <hr className='my-6' />

              {/* Form Actions */}
              <div className='flex justify-end gap-4 pt-4'>
                <Button variant='outline' onClick={() => navigate('/admin/courses')} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type='submit' disabled={isSubmitting} className='flex min-w-[120px] items-center gap-2'>
                  <Save className='h-4 w-4' />
                  {isSubmitting ? 'Đang thêm...' : 'Thêm khóa học'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCoursePage
