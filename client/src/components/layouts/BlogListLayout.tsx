import TablePagination from '@/components/common/pagination/TablePagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants'
import { calculateReadingTime } from '@/lib/helper'
import type { Blog, BlogCategory } from '@/types/blog'
import { formatTimeAgo } from '@/utils/format'
import { Bookmark, Clock, MoreVertical } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface BlogListLayoutProps {
  title: string
  description: string
  blogs: Blog[]
  categories: BlogCategory[]
  isLoadingBlogs: boolean
  pagination: {
    total: number
    limit: number
    page: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  categoriesTitle?: string
  currentCategorySlug?: string
}

const BlogListLayout: React.FC<BlogListLayoutProps> = ({
  title,
  description,
  blogs,
  categories,
  isLoadingBlogs,
  pagination,
  onPageChange,
  categoriesTitle = 'XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ',
  currentCategorySlug
}) => {
  const navigate = useNavigate()

  // Lọc categories dựa trên currentCategorySlug
  const displayCategories = currentCategorySlug
    ? categories.filter((cat) => cat.slug !== currentCategorySlug)
    : categories

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className='mb-12'>
        <h1 className='mb-3 text-3xl font-bold md:text-4xl'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
        {/* Main Content */}
        <div className='lg:col-span-8'>
          {isLoadingBlogs ? (
            <div className='space-y-6'>
              {[...Array(5)].map((_, i) => (
                <Card key={i} className='overflow-hidden'>
                  <CardContent className='p-6'>
                    <div className='flex gap-4'>
                      <div className='flex-1 space-y-3'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-8 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-3/4' />
                        <div className='flex gap-2'>
                          <Skeleton className='h-6 w-20' />
                          <Skeleton className='h-6 w-24' />
                        </div>
                      </div>
                      <Skeleton className='h-32 w-48 shrink-0' />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground'>Chưa có bài viết nào.</p>
            </div>
          ) : (
            <>
              <div className='space-y-6'>
                {blogs.map((blog: Blog) => (
                  <Card key={blog.blogId} className='group overflow-hidden transition-shadow hover:shadow-lg'>
                    <CardContent className='p-6'>
                      <div className='flex gap-6'>
                        {/* Left Content */}
                        <div className='flex-1'>
                          {/* Author Info */}
                          <div className='mb-3 flex items-center gap-2'>
                            <Avatar className='h-6 w-6'>
                              <AvatarImage src={blog.author?.avatar} alt={blog.author?.name} />
                              <AvatarFallback>{blog.author?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium'>{blog.author?.name}</span>
                          </div>

                          {/* Title */}
                          <Link to={ROUTES.PUBLIC.BLOGS.DETAIL(blog.slug)}>
                            <h2 className='mb-3 text-xl font-bold transition-colors group-hover:text-primary md:text-2xl'>
                              {blog.title}
                            </h2>
                          </Link>

                          {/* Excerpt */}
                          <p
                            className='mb-4 line-clamp-2 text-sm text-muted-foreground'
                            dangerouslySetInnerHTML={{
                              __html: blog.content
                            }}
                          />

                          {/* Meta Info */}
                          <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
                            {blog.category && (
                              <Badge variant='secondary' className='font-normal'>
                                {blog.category.name}
                              </Badge>
                            )}
                            <div className='flex items-center gap-1'>
                              <Clock className='h-4 w-4' />
                              <span>{formatTimeAgo(blog.publishedAt || blog.createdAt)}</span>
                            </div>
                            <span>•</span>
                            <span>{calculateReadingTime(blog.content)}</span>
                          </div>
                        </div>

                        {/* Right Content - Thumbnail & Actions */}
                        <div className='relative flex shrink-0 flex-col items-end gap-2'>
                          <div className='flex gap-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Bookmark className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </div>
                          <Link to={ROUTES.PUBLIC.BLOGS.DETAIL(blog.slug)} className='block'>
                            <div className='relative h-32 w-48 overflow-hidden rounded-lg bg-muted'>
                              {blog.thumbnail ? (
                                <img
                                  src={blog.thumbnail}
                                  alt={blog.title}
                                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                              ) : (
                                <div className='flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                                  <span className='text-3xl font-bold text-white opacity-50'>
                                    {blog.title.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='mt-8'>
                  <TablePagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className='lg:col-span-4'>
          <div className='sticky top-4 space-y-6'>
            {/* Categories Filter */}
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-4 text-lg font-semibold'>{categoriesTitle}</h3>

                <div className='space-y-4'>
                  {displayCategories.map((category) => (
                    <div key={category.categoryId}>
                      <Button
                        variant='outline'
                        className='mb-2 w-full justify-start font-medium'
                        onClick={() => navigate(ROUTES.PUBLIC.BLOGS.BY_TOPIC(category.slug))}
                      >
                        {category.name}
                      </Button>
                    </div>
                  ))}

                  {displayCategories.length === 0 && <p className='text-sm text-muted-foreground'>Không có chủ đề</p>}
                </div>
              </CardContent>
            </Card>

            {/* Promotional Banners */}
            <Card className='overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 text-white'>
              <CardContent className='p-6'>
                <div className='space-y-3'>
                  <h3 className='text-2xl font-bold'>HTML CSS PRO</h3>
                  <ul className='space-y-1 text-sm'>
                    <li>✅ Thực hành 8 dự án</li>
                    <li>✅ Hơn 300 bài tập thử thách</li>
                    <li>✅ Tặng ứng dụng Flashcards</li>
                    <li>✅ Tặng 3 Games luyện HTML CSS</li>
                    <li>✅ Tặng 20+ thiết kế trên Figma</li>
                  </ul>
                  <Button variant='secondary' className='mt-4 w-full font-semibold text-gray-500'>
                    Tìm hiểu thêm ›
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className='overflow-hidden bg-gradient-to-br from-red-500 to-red-700 text-white'>
              <CardContent className='p-6'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='h-12 w-12 overflow-hidden rounded-full bg-white'>
                    <div className='flex h-full items-center justify-center text-2xl'>👨‍💻</div>
                  </div>
                  <div>
                    <p className='text-sm'>Theo dõi kênh Youtube</p>
                    <p className='font-bold'>Thành Công ✓</p>
                  </div>
                  <Button size='sm' variant='secondary' className='ml-auto text-gray-500'>
                    SUBSCRIBE
                  </Button>
                </div>
                <ul className='space-y-1 text-sm'>
                  <li>✅ Vlog và cuộc sống lập trình viên</li>
                  <li>✅ Chia sẻ kinh nghiệm làm việc thực tế</li>
                  <li>✅ Hiểu con người, tính cách</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogListLayout
