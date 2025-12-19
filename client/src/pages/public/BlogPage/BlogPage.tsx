import BlogCard from '@/components/common/blog-card/BlogCard'
import TablePagination from '@/components/common/pagination/TablePagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import useDebounce from '@/hooks/useDebounce'
import { useGetAllBlogsQuery, useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data: blogsData, isLoading: isLoadingBlogs } = useGetAllBlogsQuery({
    page: currentPage,
    limit: 9,
    sort: 'createdAt',
    order: 'desc',
    search: debouncedSearchQuery,
    categoryId: selectedCategory || undefined
  })

  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 50 })
  const blogs = blogsData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const pagination = blogsData?.data

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      {/* Hero Section */}
      <section className={`bg-[url('@/assets/images/blog-banner.jpg')] bg-cover bg-center py-16 text-white`}>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-3xl text-center'>
            <h1 className='mb-4 text-4xl font-bold md:text-5xl'>Bài viết</h1>
            <p className='mb-8 text-lg opacity-90'>
              Khám phá kiến thức lập trình, kinh nghiệm thực tế và xu hướng công nghệ mới nhất
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className='mx-auto max-w-2xl'>
              <div className='flex gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-black'>
                <Input
                  type='text'
                  placeholder='Tìm kiếm bài viết...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='border-0 text-gray-900 focus-visible:ring-0 dark:text-white'
                />
                <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
                  <Search className='h-4 w-4' />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Sidebar */}
          <aside className='lg:w-80'>
            <Card className='sticky top-20'>
              <CardContent className='p-6'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                  <TrendingUp className='h-5 w-5 text-primary' />
                  Danh mục
                </h3>
                <div className='space-y-2'>
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'ghost'}
                    className='w-full justify-start'
                    onClick={() => {
                      setSelectedCategory('')
                      setCurrentPage(1)
                    }}
                  >
                    Tất cả bài viết
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.categoryId}
                      variant={selectedCategory === category.categoryId ? 'default' : 'ghost'}
                      className='w-full justify-start'
                      onClick={() => {
                        setSelectedCategory(category.categoryId)
                        setCurrentPage(1)
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Blog Grid */}
          <main className='flex-1'>
            {isLoadingBlogs ? (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className='h-48 w-full rounded-t-lg' />
                    <CardContent className='p-4'>
                      <Skeleton className='mb-2 h-4 w-20' />
                      <Skeleton className='mb-2 h-6 w-full' />
                      <Skeleton className='mb-4 h-4 w-full' />
                      <Skeleton className='h-4 w-32' />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-lg text-muted-foreground'>Không tìm thấy bài viết nào</p>
              </div>
            ) : (
              <>
                <div className='mb-6 flex items-center justify-between'>
                  <p className='text-sm text-muted-foreground'>Hiển thị {blogs.length} bài viết</p>
                </div>

                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {blogs.map((blog) => (
                    <BlogCard key={blog.blogId} blog={blog} />
                  ))}
                </div>

                {/* Pagination */}
                <TablePagination
                  onPageChange={(newPage) => setCurrentPage(newPage)}
                  page={currentPage}
                  totalItems={pagination?.total || 0}
                  pageSize={pagination?.limit || 6}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
