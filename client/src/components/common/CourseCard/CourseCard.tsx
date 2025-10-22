import { Card, CardContent } from '@/components/ui/card'
import type { Course } from '@/types/course'
import { Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate()
  const handleNavigateToCourseDetail = (slug: string) => {
    navigate(`${slug}`)
  }

  return (
    <Card
      className='cursor-pointer rounded-3xl border bg-gray-50 transition-shadow hover:shadow-lg'
      onClick={(e) => {
        e.stopPropagation()
        handleNavigateToCourseDetail(course.slug)
      }}
    >
      <img src={course.thumbnail} alt={course.title} className='h-[180px] w-full rounded-t-3xl object-cover' />
      <CardContent className='pb-4'>
        <h3 className='mb-2 text-base font-semibold'>{course.title}</h3>
        <p className='mb-2 text-sm font-semibold text-primary'>
          {course.is_paid ? `${(course.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </p>
        <div className='mt-2 flex items-center gap-2'>
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
