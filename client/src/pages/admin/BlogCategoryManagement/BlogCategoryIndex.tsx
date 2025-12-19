import BlogCategoryStats from './components/BlogCategoryStats'
import BlogCategoryTable from './components/BlogCategoryTable'

const BlogCategoryIndex = () => {
  return (
    <div className='space-y-8 p-6'>
      {/* Thống kê tổng quan */}
      <BlogCategoryStats />

      {/* Bảng quản lý thể loại */}
      <BlogCategoryTable />
    </div>
  )
}

export default BlogCategoryIndex
