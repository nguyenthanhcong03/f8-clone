import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { useGetAllBlogsQuery, useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlogListLayout from '../components/BlogListLayout'

const BlogByTopicPage: React.FC = () => {
  const navigate = useNavigate()
  const { topicSlug } = useParams<{ topicSlug: string }>()
  const [currentPage, setCurrentPage] = useState(1)

  // Lấy tất cả categories để tìm category hiện tại và các category khác
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 50 })
  const categories = categoriesData?.data?.data || []

  // Tìm category hiện tại từ slug
  const currentCategory = useMemo(() => {
    return categories.find((cat) => cat.slug === topicSlug)
  }, [categories, topicSlug])

  // Lấy blogs theo categoryId
  const { data: blogsData, isLoading: isLoadingBlogs } = useGetAllBlogsQuery(
    {
      page: currentPage,
      limit: 9,
      sort: 'createdAt',
      order: 'desc',
      categoryId: currentCategory?.categoryId
    },
    { skip: !currentCategory }
  )

  const blogs = blogsData?.data?.data || []
  const pagination = {
    total: blogsData?.data?.total || 0,
    limit: blogsData?.data?.limit || 9,
    page: blogsData?.data?.page || 1,
    totalPages: blogsData?.data?.totalPages || 0
  }

  // Nếu không tìm thấy category
  if (!currentCategory && categories.length > 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='mb-4 text-3xl font-bold'>Không tìm thấy chủ đề</h1>
          <p className='text-muted-foreground'>Chủ đề bạn tìm kiếm không tồn tại.</p>
          <Button className='mt-4' onClick={() => navigate(ROUTES.PUBLIC.BLOGS.LIST)}>
            Quay lại trang blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <BlogListLayout
      title={currentCategory?.name || 'Bài viết theo chủ đề'}
      description={
        currentCategory?.description ||
        'Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.'
      }
      blogs={blogs}
      categories={categories}
      isLoadingBlogs={isLoadingBlogs}
      pagination={pagination}
      onPageChange={setCurrentPage}
      categoriesTitle='CÁC CHỦ ĐỀ KHÁC'
      currentCategorySlug={topicSlug}
    />
  )
}

export default BlogByTopicPage
