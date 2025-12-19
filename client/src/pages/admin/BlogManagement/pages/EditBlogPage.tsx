import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROUTES } from '@/lib/constants'
import { updateBlogSchema, type UpdateBlogInput } from '@/schemas/blog.schema'
import { useGetAllCategoriesQuery, useGetBlogByIdQuery, useUpdateBlogMutation } from '@/services/api/blogApi'
import { getErrorMessage } from '@/services/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { AlertCircleIcon, ArrowLeftIcon, ImageIcon, PenToolIcon, SaveIcon, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import slugify from 'slugify'

const EditBlogPage = () => {
  const { blogId } = useParams<{ blogId: string }>()
  const navigate = useNavigate()
  const editorRef = useRef<any>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const { data: blogData, isLoading: isLoadingBlog } = useGetBlogByIdQuery(blogId!)
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 50 })
  const categories = categoriesData?.data?.data || []

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<UpdateBlogInput>({
    resolver: zodResolver(updateBlogSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      categoryId: '',
      thumbnail: undefined
    }
  })

  const titleValue = watch('title')

  // Load blog data
  useEffect(() => {
    if (blogData?.data) {
      const blog = blogData.data
      reset({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        status: blog.status || 'draft',
        categoryId: blog.categoryId || '',
        thumbnail: undefined
      })
      if (blog.thumbnail) {
        setThumbnailPreview(blog.thumbnail)
      }
    }
  }, [blogData, reset])

  // Tự động tạo slug từ title khi title thay đổi
  useEffect(() => {
    if (titleValue && isDirty) {
      const newSlug = slugify(titleValue, {
        lower: true,
        strict: true,
        locale: 'vi'
      })
      setValue('slug', newSlug)
      trigger('slug')
    }
  }, [titleValue, setValue, isDirty, trigger])

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('thumbnail', file, { shouldValidate: true })
      const previewUrl = URL.createObjectURL(file)
      setThumbnailPreview(previewUrl)
    }
  }

  const removeThumbnail = () => {
    setValue('thumbnail', undefined)
    setThumbnailPreview(null)
  }

  const onSubmit = async (data: UpdateBlogInput) => {
    try {
      const submitData = new FormData()
      submitData.append('title', data.title)
      submitData.append('slug', data.slug)
      submitData.append('content', data.content)
      submitData.append('status', data.status)
      if (data.categoryId) {
        submitData.append('categoryId', data.categoryId)
      }
      if (data.thumbnail instanceof File) {
        submitData.append('thumbnail', data.thumbnail)
      }

      await updateBlog({ id: blogId!, data: submitData }).unwrap()
      toast.success('Cập nhật bài viết thành công')
      navigate(ROUTES.ADMIN.BLOGS.VIEW(blogId))
    } catch (error) {
      console.error('Update blog error:', error)
      toast.error(getErrorMessage(error) || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  if (isLoadingBlog) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
          <p className='mt-2 text-sm text-gray-600'>Đang tải...</p>
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
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(ROUTES.ADMIN.BLOGS.VIEW(blogId))}
              className='text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            >
              <ArrowLeftIcon className='mr-2 h-4 w-4' />
              Quay lại danh sách
            </Button>

            <Button
              form='blog-form'
              type='submit'
              disabled={isSubmitting || isUpdating}
              className='bg-blue-600 text-white shadow-md hover:bg-blue-700'
            >
              <SaveIcon className='mr-2 h-4 w-4' />
              {isSubmitting || isUpdating ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto w-full max-w-7xl overflow-y-auto p-6'>
        <Card className='border bg-white'>
          <CardHeader className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6'>
            <CardTitle className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
              <PenToolIcon className='h-6 w-6 text-blue-600' />
              Chỉnh sửa bài viết
            </CardTitle>
            <p className='mt-2 text-sm text-gray-600'>Cập nhật thông tin bài viết</p>
          </CardHeader>

          <CardContent className='px-8 py-8'>
            <form id='blog-form' onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-8'>
              {/* Thông tin cơ bản */}
              <div className='space-y-6'>
                <div className='border-l-4 border-blue-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Thông tin cơ bản</h3>
                  <p className='text-sm text-gray-600'>Thông tin chính về bài viết</p>
                </div>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {/* Title */}
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='title' className='text-sm font-medium text-gray-700'>
                          Tiêu đề <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          {...field}
                          id='title'
                          placeholder='Nhập tiêu đề bài viết'
                          className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                          <p className='flex items-center gap-1 text-sm text-red-500'>
                            <AlertCircleIcon className='h-4 w-4' />
                            {errors.title.message}
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
                          placeholder='slug-bai-viet'
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

                  {/* Category */}
                  <Controller
                    name='categoryId'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='category' className='text-sm font-medium text-gray-700'>
                          Thể loại
                        </Label>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id='category'>
                            <SelectValue placeholder='Chọn thể loại' />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.categoryId} value={category.categoryId}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.categoryId && (
                          <p className='flex items-center gap-1 text-sm text-red-500'>
                            <AlertCircleIcon className='h-4 w-4' />
                            {errors.categoryId.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  {/* Trạng thái */}
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <Label htmlFor='status' className='text-sm font-medium text-gray-700'>
                          Trạng thái <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id='status'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='draft'>Bản nháp</SelectItem>
                            <SelectItem value='published'>Đã xuất bản</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div className='space-y-6'>
                <div className='border-l-4 border-purple-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Hình ảnh</h3>
                  <p className='text-sm text-gray-600'>Ảnh đại diện cho bài viết</p>
                </div>

                <div className='space-y-4'>
                  <Label htmlFor='thumbnail' className='text-sm font-medium text-gray-700'>
                    Thumbnail
                  </Label>

                  {thumbnailPreview ? (
                    <div className='relative inline-block'>
                      <img
                        src={thumbnailPreview}
                        alt='Preview'
                        className='h-48 w-auto rounded-lg border object-cover'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={removeThumbnail}
                        className='absolute right-2 top-2'
                      >
                        <XIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center'>
                      <label
                        htmlFor='thumbnail'
                        className='flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:bg-blue-50'
                      >
                        <ImageIcon className='h-12 w-12 text-gray-400' />
                        <p className='mt-2 text-sm text-gray-600'>Click để chọn ảnh</p>
                        <p className='text-xs text-gray-500'>PNG, JPG tối đa 5MB</p>
                        <input
                          id='thumbnail'
                          type='file'
                          accept='image/*'
                          onChange={handleThumbnailChange}
                          className='hidden'
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className='space-y-6'>
                <div className='border-l-4 border-green-500 pl-4'>
                  <h3 className='mb-1 text-lg font-semibold text-gray-800'>Nội dung</h3>
                  <p className='text-sm text-gray-600'>Nội dung chi tiết của bài viết</p>
                </div>

                <Controller
                  name='content'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label htmlFor='content' className='text-sm font-medium text-gray-700'>
                        Nội dung <span className='text-red-500'>*</span>
                      </Label>
                      <Editor
                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                        onInit={(_evt, editor) => (editorRef.current = editor)}
                        value={field.value}
                        onEditorChange={field.onChange}
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'preview',
                            'anchor',
                            'searchreplace',
                            'visualblocks',
                            'code',
                            'fullscreen',
                            'insertdatetime',
                            'media',
                            'table',
                            'code',
                            'help',
                            'wordcount'
                          ],
                          toolbar:
                            'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                      />
                      {errors.content && (
                        <p className='flex items-center gap-1 text-sm text-red-500'>
                          <AlertCircleIcon className='h-4 w-4' />
                          {errors.content.message}
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

export default EditBlogPage
