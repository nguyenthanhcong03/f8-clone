import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants'
import {
  useCheckLikeStatusQuery,
  useGetAllBlogsQuery,
  useGetBlogBySlugQuery,
  useLikeBlogMutation,
  useUnlikeBlogMutation
} from '@/services/api/blogApi'
import { formatTimeAgo } from '@/utils/format'
import { ArrowLeft, Calendar, Clock, Share2, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)

  const { data: blogData, isLoading, error } = useGetBlogBySlugQuery(slug!)
  const { data: relatedBlogsData } = useGetAllBlogsQuery({
    page: 1,
    limit: 3,
    sort: 'createdAt',
    order: 'desc',
    categoryId: blogData?.data?.categoryId
  })

  const blog = blogData?.data
  const blogId = blog?.blogId

  // Check like status
  const { data: likeStatusData } = useCheckLikeStatusQuery(blogId!, {
    skip: !blogId
  })

  const [likeBlog, { isLoading: isLiking }] = useLikeBlogMutation()
  const [unlikeBlog, { isLoading: isUnliking }] = useUnlikeBlogMutation()

  const relatedBlogs = relatedBlogsData?.data?.data?.filter((b) => b.blogId !== blog?.blogId) || []

  // Update like status when data changes
  useEffect(() => {
    if (likeStatusData?.data) {
      setIsLiked(likeStatusData.data.isLiked)
    }
  }, [likeStatusData])

  const handleLike = async () => {
    if (!blogId) return

    try {
      if (isLiked) {
        await unlikeBlog(blogId).unwrap()
        setIsLiked(false)
        toast.success('Đã bỏ thích bài viết')
      } else {
        await likeBlog(blogId).unwrap()
        setIsLiked(true)
        toast.success('Đã thích bài viết')
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.content.replace(/<[^>]*>/g, '').substring(0, 100),
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Đã sao chép link bài viết')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Skeleton className='mb-4 h-8 w-32' />
        <Skeleton className='mb-4 h-12 w-full' />
        <Skeleton className='mb-8 h-64 w-full' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>Không tìm thấy bài viết</h1>
        <Button onClick={() => navigate(ROUTES.PUBLIC.BLOGS.LIST)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-muted/30'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' onClick={() => navigate(ROUTES.PUBLIC.BLOGS.LIST)} className='gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <article className='container mx-auto px-4 py-8'>
        <div className='mx-auto max-w-4xl'>
          {/* Category Badge */}
          {blog.category && <Badge className='mb-4 bg-primary text-sm'>{blog.category.name}</Badge>}

          {/* Title */}
          <h1 className='mb-6 text-4xl font-bold leading-tight md:text-5xl'>{blog.title}</h1>

          {/* Tác giả và thông tin */}
          <div className='mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
            {blog.author && (
              <div className='flex items-center gap-2'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-foreground'>{blog.author.name}</p>
                  <p className='text-xs'>Tác giả</p>
                </div>
              </div>
            )}

            <Separator orientation='vertical' className='h-10' />

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span>{formatTimeAgo(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>5 phút đọc</span>
              </div>
            </div>
          </div>

          {/* Image */}
          {blog.thumbnail && (
            <div className='mb-8 overflow-hidden rounded-lg'>
              <img src={blog.thumbnail} alt={blog.title} className='h-auto w-full object-cover' />
            </div>
          )}

          {/* Action Buttons */}
          <div className='mb-8 flex flex-wrap gap-2'>
            <Button
              variant={isLiked ? 'default' : 'outline'}
              size='sm'
              className='gap-2'
              onClick={handleLike}
              disabled={isLiking || isUnliking}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
            </Button>
            <Button variant='outline' size='sm' className='gap-2' onClick={handleShare}>
              <Share2 className='h-4 w-4' />
              <span>Chia sẻ</span>
            </Button>
          </div>

          <Separator className='mb-8' />

          {/* Content */}
          <div
            className='prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-img:rounded-lg'
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <Separator className='my-12' />

          {/* Tác giả */}
          {blog.author && (
            <Card className='mb-12'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <Avatar className='h-16 w-16'>
                    <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                    <AvatarFallback className='text-xl'>{blog.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <h3 className='mb-1 text-lg font-semibold'>{blog.author.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      Tác giả, lập trình viên với niềm đam mê chia sẻ kiến thức và kinh nghiệm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className='mb-6 text-2xl font-bold'>Bài viết liên quan</h2>
              <div className='grid gap-6 md:grid-cols-3'>
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog.blogId} to={`/blog/${relatedBlog.slug}`}>
                    <Card className='group h-full overflow-hidden transition-all hover:shadow-lg'>
                      <div className='relative aspect-video overflow-hidden bg-muted'>
                        {relatedBlog.thumbnail ? (
                          <img
                            src={relatedBlog.thumbnail}
                            alt={relatedBlog.title}
                            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                          />
                        ) : (
                          <div className='flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                            <span className='text-3xl font-bold text-white opacity-50'>
                              {relatedBlog.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className='p-4'>
                        <h3 className='line-clamp-2 font-semibold transition-colors group-hover:text-primary'>
                          {relatedBlog.title}
                        </h3>
                        <p className='mt-2 text-xs text-muted-foreground'>
                          {formatTimeAgo(relatedBlog.publishedAt || relatedBlog.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

export default BlogDetailPage
