import TablePagination from '@/components/common/pagination/TablePagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants'
import { useGetLikedBlogsQuery } from '@/services/api/blogApi'
import { formatTimeAgo } from '@/utils/format'
import { BookmarkCheck, Calendar, Heart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const LikedBlogsPage = () => {
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useGetLikedBlogsQuery({
    page,
    limit,
    sort: 'createdAt',
    order: 'DESC'
  })

  const blogs = data?.data?.data || []
  const pagination = {
    total: data?.data?.total || 0,
    limit: data?.data?.limit || limit,
    page: data?.data?.page || page,
    totalPages: data?.data?.totalPages || 0
  }
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Skeleton className='mb-6 h-10 w-64' />
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className='h-80 w-full' />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>Có lỗi xảy ra</h1>
        <p className='text-muted-foreground'>Không thể tải danh sách bài viết đã thích</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8 flex items-center gap-3'>
          <Heart className='h-8 w-8 fill-red-500 text-red-500' />
          <div>
            <h1 className='text-3xl font-bold'>Bài viết đã thích</h1>
            <p className='text-muted-foreground'>{data?.data?.total || 0} bài viết đã được bạn đánh dấu yêu thích</p>
          </div>
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <BookmarkCheck className='mb-4 h-16 w-16 text-muted-foreground' />
            <h2 className='mb-2 text-2xl font-semibold'>Chưa có bài viết nào</h2>
            <p className='mb-6 text-muted-foreground'>
              Bạn chưa thích bài viết nào. Khám phá và lưu lại những bài viết yêu thích của bạn!
            </p>
            <Button asChild>
              <Link to={ROUTES.PUBLIC.BLOGS.LIST}>Khám phá bài viết</Link>
            </Button>
          </div>
        )}

        {/* Blog Grid */}
        {blogs.length > 0 && (
          <>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {blogs.map((blog) => (
                <Link key={blog.blogId} to={`/blog/${blog.slug}`}>
                  <Card className='group h-full overflow-hidden transition-all hover:shadow-lg'>
                    {/* Thumbnail */}
                    <div className='relative aspect-video overflow-hidden bg-muted'>
                      {blog.thumbnail ? (
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                      ) : (
                        <div className='flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                          <span className='text-4xl font-bold text-white opacity-50'>{blog.title.charAt(0)}</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      {blog.category && (
                        <Badge className='absolute left-3 top-3 bg-primary/90 backdrop-blur-sm'>
                          {blog.category.name}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className='p-5'>
                      <h3 className='mb-3 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary'>
                        {blog.title}
                      </h3>

                      {/* Author */}
                      {blog.author && (
                        <div className='mb-3 flex items-center gap-2'>
                          <div className='h-8 w-8 overflow-hidden rounded-full bg-muted'>
                            {blog.author.avatar ? (
                              <img
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                className='h-full w-full object-cover'
                              />
                            ) : (
                              <div className='flex h-full items-center justify-center bg-primary/10 text-sm font-medium text-primary'>
                                {blog.author.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className='text-sm text-muted-foreground'>{blog.author.name}</span>
                        </div>
                      )}

                      {/* Date */}
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <Calendar className='h-3 w-3' />
                        <span>{formatTimeAgo(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <TablePagination
              onPageChange={(newPage) => setPage(newPage)}
              page={page}
              pageSize={pagination.limit}
              totalItems={pagination.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default LikedBlogsPage
