import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllCoursesAdminQuery } from '@/services/api/courseApi'
import { formatCurrency } from '@/utils/format'
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react'

const CourseStats = () => {
  const { data } = useGetAllCoursesAdminQuery({
    page: 1,
    limit: 1000, // Lấy tất cả để tính thống kê
    sort: 'createdAt',
    order: 'desc'
  })

  const courses = data?.data?.data || []

  // Tính toán thống kê
  const totalCourses = courses.length
  const publishedCourses = courses.filter((course) => course.isPublished).length
  const totalEnrollments = courses.reduce((sum, course) => sum + (Number(course.enrollmentCount) || 0), 0)
  const totalRevenue = courses.reduce((sum, course) => {
    if (course.isPaid && course.price && course.enrollmentCount) {
      return sum + course.price * course.enrollmentCount
    }
    return sum
  }, 0)

  const stats = [
    {
      title: 'Tổng khóa học',
      value: totalCourses,
      description: `${publishedCourses} đã phát hành`,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tổng học viên',
      value: totalEnrollments,
      description: 'Đăng ký tất cả khóa học',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(totalRevenue),
      description: 'Từ khóa học có phí',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'TB đăng ký/khóa học',
      value: totalCourses > 0 ? Math.round(totalEnrollments / totalCourses) : 0,
      description: 'Trung bình mỗi khóa học',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString('vi-VN')}
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default CourseStats
