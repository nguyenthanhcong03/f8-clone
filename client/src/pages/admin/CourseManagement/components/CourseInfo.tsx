import { courseFormSchema, type CourseFormInput } from '@/schemas/course.schema'
import { createCourse } from '@/store/features/courses/courseSlice'
import { useAppDispatch } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import type { Course } from '@/types/course'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface CourseDetailsProps {
  course: Course
}

const CourseInfo: React.FC<CourseDetailsProps> = ({ course }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null)
  console.log('>>>>>>>>>>>course: ', course)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || '',
      slug: course?.slug || '',
      description: course?.description || '',
      level: course?.level || 'beginner',
      is_paid: course?.is_paid || false,
      price: course?.price || 0,
      thumbnail: course?.thumbnail || null
    }
  })

  const isPaidValue = watch('is_paid')

  const onSubmit = async (data: CourseFormInput) => {
    try {
      const courseData = {
        ...data,
        price: data.is_paid ? (typeof data.price === 'string' ? parseFloat(data.price) : data.price) : undefined
      }
      console.log('course Data:', courseData)

      await dispatch(createCourse(courseData)).unwrap()
      showSnackbar({ message: 'Course created successfully!', severity: 'success' })
      setTimeout(() => {
        navigate('/admin/courses')
      }, 1500)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course'
      showSnackbar({ message: errorMessage, severity: 'error' })
    }
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Thông tin khóa học</CardTitle>
        <p className='text-sm text-muted-foreground'>Cung cấp thông tin cơ bản của khóa học</p>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <div className='space-y-4'>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <Label htmlFor='title'>Tên khóa học</Label>
                  <Input
                    id='title'
                    {...field}
                    placeholder='Nhập tên khóa học'
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                </div>
              )}
            />

            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <Label htmlFor='title'>Mô tả khóa học</Label>
                  <Input
                    id='description'
                    {...field}
                    placeholder='Nhập mô tả khóa học'
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
                </div>
              )}
            />

            {/* <Controller
              name='description'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Editor
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
                />
              )}
            /> */}

            <Controller
              name='level'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <Label htmlFor='level'>Mức độ</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                      <SelectValue placeholder='Chọn mức độ' />
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

        <Separator className='my-6' />

        {/* Pricing */}
        <div>
          <h3 className='text-lg font-semibold mb-2'>Trả phí</h3>

          <div className='space-y-4'>
            <Controller
              name='is_paid'
              control={control}
              render={({ field }) => (
                <label className='flex items-center gap-2 w-fit cursor-pointer'>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <span>Đây là khóa học trả phí</span>
                </label>
              )}
            />

            {isPaidValue && (
              <Controller
                name='price'
                control={control}
                render={({ field }) => (
                  <div className='space-y-2'>
                    <Label htmlFor='price'>Giá khóa học (VNĐ)</Label>
                    <Input
                      id='price'
                      {...field}
                      type='number'
                      min={0}
                      step={1000}
                      placeholder='0'
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className='text-sm text-red-500'>{errors.price.message}</p>}
                  </div>
                )}
              />
            )}
          </div>
        </div>

        <Separator className='my-6' />

        <div>
          <h3 className='text-lg font-semibold mb-2'>Hình ảnh minh họa</h3>

          <Controller
            name='thumbnail'
            control={control}
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <div>
                  <input
                    {...field}
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      console.log('file', file)
                      setPreviewThumbnail(file ? URL.createObjectURL(file) : null)
                      onChange(file)
                    }}
                    className='hidden'
                    id='thumbnail-upload'
                  />
                  {previewThumbnail && (
                    <img src={previewThumbnail} alt='Preview' className='w-32 h-32 object-cover rounded-lg border' />
                  )}
                  <label htmlFor='thumbnail-upload'>
                    <Button
                      variant='outline'
                      asChild
                      className={`h-14 w-full max-w-md border-2 border-dashed cursor-pointer ${
                        errors.thumbnail ? 'border-red-500' : 'border-muted-foreground/30'
                      }`}
                    >
                      <span className='flex items-center gap-2'>
                        <ImageIcon className='h-4 w-4' />
                        {value
                          ? `Đã chọn: ${value instanceof File ? value.name : 'Current thumbnail'}`
                          : 'Chọn hình ảnh minh họa'}
                      </span>
                    </Button>
                  </label>
                  {errors.thumbnail && <p className='text-sm text-red-500 mt-2'>{errors.thumbnail.message}</p>}
                  {!errors.thumbnail && (
                    <p className='text-sm text-muted-foreground mt-2'>Định dạng: JPEG, PNG, WebP (Tối đa 5MB)</p>
                  )}
                </div>
              )
            }}
          />
        </div>
        <div className='flex justify-end gap-2 mt-6'>
          {isDirty && <Button variant='outline'>Khôi phục</Button>}
          <Button
            variant='default'
            color='primary'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className='min-w-[150px]'
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseInfo
