import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { useGetBlogByIdQuery } from '@/services/api/blogApi'
import { ArrowLeftIcon, CalendarIcon, EditIcon, FolderIcon, UserIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const ViewBlogPage = () => {
  const { blogId } = useParams<{ blogId: string }>()
  const navigate = useNavigate()

  const { data: blogData, isLoading, isError } = useGetBlogByIdQuery(blogId!)

  const blog = blogData?.data

  const formatDate = (date?: Date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
          <p className='mt-2 text-sm text-gray-600'>Đang tải...</p>
        </div>
      </div>
    )
  }

  if (isError || !blog) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg text-red-600'>Không tìm thấy bài viết</p>
          <Button onClick={() => navigate(ROUTES.ADMIN.BLOGS.ROOT)} className='mt-4'>
            Quay lại danh sách
          </Button>
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
              onClick={() => navigate(ROUTES.ADMIN.BLOGS.ROOT)}
              className='text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            >
              <ArrowLeftIcon className='mr-2 h-4 w-4' />
              Quay lại danh sách
            </Button>

            <Button
              onClick={() => navigate(ROUTES.ADMIN.BLOGS.EDIT(blog.blogId))}
              className='bg-blue-600 text-white shadow-md hover:bg-blue-700'
            >
              <EditIcon className='mr-2 h-4 w-4' />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto w-full max-w-5xl overflow-y-auto p-6'>
        <Card className='border bg-white'>
          <CardHeader className='border-b px-8 py-6'>
            <div className='space-y-4'>
              <CardTitle className='text-3xl font-bold text-gray-800'>{blog.title}</CardTitle>

              {/* Meta information */}
              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
                {blog.author && (
                  <div className='flex items-center gap-2'>
                    <UserIcon className='h-4 w-4' />
                    <span>{blog.author.name}</span>
                  </div>
                )}

                {blog.category && (
                  <div className='flex items-center gap-2'>
                    <FolderIcon className='h-4 w-4' />
                    <Badge variant='outline'>{blog.category.name}</Badge>
                  </div>
                )}

                {blog.status && (
                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                    {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </Badge>
                )}

                <div className='flex items-center gap-2'>
                  <CalendarIcon className='h-4 w-4' />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className='px-8 py-8'>
            {/* Thumbnail */}
            {blog.thumbnail && (
              <div className='mb-8'>
                <img src={blog.thumbnail} alt={blog.title} className='w-full rounded-lg object-cover' />
              </div>
            )}

            {/* Content */}
            <div className='prose prose-lg max-w-none' dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Footer */}
            <div className='mt-8 border-t pt-6'>
              <div className='flex items-center justify-between text-sm text-gray-500'>
                <div>
                  <p>Ngày tạo: {formatDate(blog.createdAt)}</p>
                  {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                    <p>Cập nhật lần cuối: {formatDate(blog.updatedAt)}</p>
                  )}
                </div>

                {blog.category && (
                  <div className='text-right'>
                    <p className='mb-1 text-xs text-gray-400'>Thể loại</p>
                    <Badge variant='outline'>{blog.category.name}</Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ViewBlogPage
