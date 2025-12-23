import BlogListLayout from '@/components/layouts/BlogListLayout'
import { useGetAllBlogsQuery, useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { useState } from 'react'

const BlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { data: blogsData, isLoading: isLoadingBlogs } = useGetAllBlogsQuery({
    page: currentPage,
    limit: 9,
    sort: 'createdAt',
    order: 'desc'
  })

  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 50 })
  const blogs = blogsData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const pagination = {
    total: blogsData?.data?.total || 0,
    limit: blogsData?.data?.limit || 9,
    page: blogsData?.data?.page || 1,
    totalPages: blogsData?.data?.totalPages || 0
  }

  return (
    <BlogListLayout
      title='Bài viết nổi bật'
      description='Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.'
      blogs={blogs}
      categories={categories}
      isLoadingBlogs={isLoadingBlogs}
      pagination={pagination}
      onPageChange={setCurrentPage}
      categoriesTitle='XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ'
    />
  )
}

export default BlogPage
