import type { Course } from '@/types/course'
import { Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLocation, useNavigate } from 'react-router-dom'

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const navigate = useNavigate()
  const handleNavigateToCourseDetail = (course: Course) => {
    if (isAdmin) {
      navigate(`/admin/courses/${course.course_id}`)
      return
    } else {
      navigate(`${course.slug}`)
    }
  }

  return (
    <Card
      className='rounded-3xl bg-gray-50 cursor-pointer hover:shadow-lg transition-shadow border'
      onClick={(e) => {
        e.stopPropagation() // tránh trigger onClick card
        handleNavigateToCourseDetail(course)
      }}
    >
      <img src={course.thumbnail} alt={course.title} className='w-full h-[180px] object-cover rounded-t-3xl' />
      <CardContent className='pb-4'>
        <h3 className='text-base font-semibold mb-2'>{course.title}</h3>
        <p className='text-primary font-semibold text-sm mb-2'>
          {course.is_paid ? `${(course.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </p>
        <div className='flex items-center gap-2 mt-2'>
          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <Users className='h-4 w-4' />
            {course.enrollment_count?.toLocaleString() || 0}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCard
