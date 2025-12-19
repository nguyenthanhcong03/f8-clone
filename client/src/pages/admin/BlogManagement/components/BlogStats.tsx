import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllBlogsQuery, useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { BookOpenIcon, FolderIcon, TrendingUpIcon, UsersIcon } from 'lucide-react'

const BlogStats = () => {
  // Lấy dữ liệu thống kê từ API
  const { data: blogsData } = useGetAllBlogsQuery({ page: 1, limit: 1, sort: 'createdAt', order: 'DESC' })
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 1 })

  const totalBlogs = blogsData?.data?.total || 0
  const totalCategories = categoriesData?.data?.total || 0

  const stats = [
    {
      title: 'Tổng bài viết',
      value: totalBlogs.toString(),
      icon: BookOpenIcon,
      description: 'Tổng số bài viết'
    },
    {
      title: 'Đã xuất bản',
      value: totalBlogs.toString(),
      icon: TrendingUpIcon,
      description: 'Đang hiển thị công khai'
    },
    {
      title: 'Thể loại',
      value: totalCategories.toString(),
      icon: FolderIcon,
      description: 'Số lượng thể loại'
    },
    {
      title: 'Lượt thích',
      value: '0',
      icon: UsersIcon,
      description: 'Tổng lượt thích'
    }
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <stat.icon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
            {stat.trend && <p className='text-xs text-green-600'>{stat.trend}</p>}
            <p className='text-xs text-muted-foreground'>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BlogStats
