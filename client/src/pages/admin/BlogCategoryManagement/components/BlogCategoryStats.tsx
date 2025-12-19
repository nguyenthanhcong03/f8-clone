import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllCategoriesQuery } from '@/services/api/blogApi'
import { FolderIcon, ListChecksIcon, TrendingUpIcon } from 'lucide-react'

const BlogCategoryStats = () => {
  // Lấy dữ liệu thống kê từ API
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 1 })

  const totalCategories = categoriesData?.data?.total || 0

  const stats = [
    {
      title: 'Tổng thể loại',
      value: totalCategories.toString(),
      icon: FolderIcon,
      description: 'Tổng số thể loại bài viết'
    },
    {
      title: 'Đang hoạt động',
      value: totalCategories.toString(),
      icon: TrendingUpIcon,
      description: 'Thể loại đang sử dụng'
    },
    {
      title: 'Bài viết',
      value: '0',
      icon: ListChecksIcon,
      description: 'Tổng số bài viết'
    }
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <stat.icon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
            <p className='text-xs text-muted-foreground'>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BlogCategoryStats
