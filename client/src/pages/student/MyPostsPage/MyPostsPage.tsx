import BlogItem from '@/components/common/blog-card/BlogItem'
import TablePagination from '@/components/common/pagination/TablePagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useGetMyBlogsQuery } from '@/services/api/blogApi'
import { useAppSelector } from '@/store/hook'
import type { Blog } from '@/types/blog'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type StatusTab = 'draft' | 'published'
const TAB = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
} as const

const MyPostsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const statusTab = (searchParams.get('status') as StatusTab) || TAB.DRAFT

  const { data: blogsData, isLoading: isLoadingBlogs } = useGetMyBlogsQuery({
    page: currentPage,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    status: statusTab
  })
  console.log('blogsData :>> ', blogsData)

  const blogs = blogsData?.data?.data || []

  const pagination = {
    total: blogsData?.data?.total || 0,
    limit: blogsData?.data?.limit || 10,
    page: blogsData?.data?.page || 1,
    totalPages: blogsData?.data?.totalPages || 1
  }

  const handleTabChange = (tab: StatusTab) => {
    setSearchParams({ status: tab })
    setCurrentPage(1)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='mb-3 text-xl font-extrabold'>Bài viết của tôi</h1>

        {/* Tabs */}
        <div className='flex gap-2 border-b'>
          <button
            onClick={() => handleTabChange(TAB.DRAFT)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              statusTab === TAB.DRAFT
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Bản nháp
          </button>
          <button
            onClick={() => handleTabChange(TAB.PUBLISHED)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              statusTab === TAB.PUBLISHED
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Đã xuất bản
          </button>
        </div>
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
          ) : (
            <>
              <div className='space-y-6'>
                {blogs.map((blog: Blog) => (
                  <BlogItem blog={blog} isMyBlog />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='mt-8'>
                  <TablePagination
                    page={currentPage}
                    pageSize={pagination.limit}
                    totalItems={pagination.total}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className='lg:col-span-4'>
          <div className='sticky top-4 space-y-6'>
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

export default MyPostsPage
