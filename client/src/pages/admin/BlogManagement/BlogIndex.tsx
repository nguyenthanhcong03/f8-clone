import BlogStats from './components/BlogStats'
import BlogTable from './components/BlogTable'

const BlogIndex = () => {
  return (
    <div className='space-y-8 p-6'>
      {/* Thống kê tổng quan */}
      <BlogStats />

      {/* Bảng quản lý blog */}
      <BlogTable />
    </div>
  )
}

export default BlogIndex
