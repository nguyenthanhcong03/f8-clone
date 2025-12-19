import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateCategorySchema, type UpdateCategoryInput } from '@/schemas/blog.schema'
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from '@/services/api/blogApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon, ArrowLeftIcon, SaveIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const EditCategoryPage = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams<{ categoryId: string }>()
  const { data: categoryData, isLoading, isError } = useGetCategoryByIdQuery(categoryId!)
  const [updateCategory] = useUpdateCategoryMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      description: ''
    }
  })

  const nameValue = watch('name')

  // Load dữ liệu thể loại khi có
  useEffect(() => {
    if (categoryData?.data) {
      reset({
        name: categoryData.data.name,
        slug: categoryData.data.slug,
        description: categoryData.data.description || ''
      })
    }
  }, [categoryData, reset])

  // Tự động tạo slug từ tên thể loại
  useEffect(() => {
    if (nameValue && isDirty) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      setValue('slug', slug)
      trigger('slug')
    }
  }, [nameValue, setValue, trigger, isDirty])

  const onSubmit = async (data: UpdateCategoryInput) => {
    try {
      await updateCategory({ categoryId: categoryId!, data }).unwrap()
      toast.success('Cập nhật thể loại thành công!')
      navigate('/admin/blog-categories')
    } catch (error: any) {
      console.error('Update category error:', error)
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi cập nhật thể loại')
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='mt-2 text-sm text-muted-foreground'>Đang tải...</p>
        </div>
      </div>
    )
  }

  if (isError || !categoryData?.data) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold'>Không tìm thấy thể loại</h2>
          <Button className='mt-4' onClick={() => navigate('/admin/blog-categories')}>
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='sm' onClick={() => navigate('/admin/blog-categories')}>
              <ArrowLeftIcon className='h-4 w-4' />
            </Button>
            <h2 className='text-2xl font-bold tracking-tight'>Chỉnh sửa thể loại</h2>
          </div>
          <p className='text-muted-foreground'>Cập nhật thông tin thể loại bài viết</p>
        </div>
      </div>

      {/* Form */}
      <form id='category-form' onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thể loại</CardTitle>
            <CardDescription>Chỉnh sửa các thông tin cơ bản cho thể loại</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Name */}
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
                    Tên thể loại <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    {...field}
                    id='name'
                    placeholder='Nhập tên thể loại'
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className='flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircleIcon className='h-4 w-4' />
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Slug */}
            <Controller
              name='slug'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <Label htmlFor='slug' className='text-sm font-medium text-gray-700'>
                    Slug <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    {...field}
                    id='slug'
                    placeholder='slug-the-loai'
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className='flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircleIcon className='h-4 w-4' />
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Description */}
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <Label htmlFor='description' className='text-sm font-medium text-gray-700'>
                    Mô tả
                  </Label>
                  <Textarea
                    {...field}
                    id='description'
                    placeholder='Nhập mô tả cho thể loại (tùy chọn)'
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className='flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircleIcon className='h-4 w-4' />
                      {errors.description.message}
                    </p>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex items-center justify-end gap-4'>
          <Button type='button' variant='outline' onClick={() => navigate('/admin/blog-categories')}>
            Hủy
          </Button>
          <Button type='submit' form='category-form' disabled={isSubmitting || !isDirty}>
            <SaveIcon className='mr-2 h-4 w-4' />
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditCategoryPage
