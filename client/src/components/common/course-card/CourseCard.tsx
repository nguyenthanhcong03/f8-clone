import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Course } from '@/types/course'
import { PlayCircle, Star, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate()
  const handleNavigateToCourseDetail = (slug: string) => {
    navigate(`${slug}`)
  }
  const totalSections = course?.sections ? course.sections.length : 0
  const totalLessons = course?.sections && course?.sections.reduce((acc, section) => acc + section.lessons!.length, 0)

  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  const levelLabels = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao'
  }

  return (
    <Card
      className='group cursor-pointer overflow-hidden rounded-lg border-0 bg-[#F7F7F7] shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-md'
      onClick={(e) => {
        e.stopPropagation()
        handleNavigateToCourseDetail(course.slug)
      }}
    >
      <div className='relative overflow-hidden'>
        <img
          src={course.thumbnail || 'https://via.placeholder.com/320x180/f3f4f6/9ca3af?text=Course+Image'}
          alt={course.title}
          className='h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
        <div className='absolute left-3 top-3 flex items-center gap-2'>
          {course.level && (
            <Badge className={`text-xs font-medium ${levelColors[course.level]}`}>{levelLabels[course.level]}</Badge>
          )}
          {!course.isPaid && <Badge className='bg-blue-100 text-xs font-medium text-blue-800'>Miễn phí</Badge>}
        </div>
      </div>

      <CardContent className='p-5'>
        <div className='mb-3'>
          <h3 className='mb-2 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-primary'>
            {course.title}
          </h3>
        </div>

        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3 text-sm text-gray-500'>
            <div className='flex items-center gap-1'>
              <Users className='h-4 w-4' />
              <span>{course.enrollmentCount || 0}</span>
            </div>
            {/* <div className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              <span>{totalSections || 0} chương</span>
            </div> */}
            <div className='flex items-center gap-1'>
              <PlayCircle className='h-4 w-4' />
              <span>{totalLessons || 0} bài học</span>
            </div>
          </div>
          <div className='flex items-center gap-1 text-yellow-500'>
            <Star className='h-4 w-4 fill-current' />
            <span className='text-sm font-medium text-gray-700'>4.8</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          {course.isPaid ? (
            <div className='flex items-center gap-2'>
              <span className='text-2xl font-bold text-primary'>{(course.price || 0).toLocaleString('vi-VN')}₫</span>
              <span className='text-sm text-gray-500 line-through'>
                {((course.price || 0) * 1.5).toLocaleString('vi-VN')}₫
              </span>
            </div>
          ) : (
            <span className='text-2xl font-bold text-green-600'>Miễn phí</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCard
