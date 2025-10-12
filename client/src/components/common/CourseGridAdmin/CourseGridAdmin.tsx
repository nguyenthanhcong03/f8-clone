import { useAppSelector } from '@/store/hook'
import CourseCard from '../CourseCard/CourseCard'

const CourseGrid = () => {
  const { courses, loading, error } = useAppSelector((state) => state.courses)

  if (loading) {
    return <div className='text-center py-8'>Đang tải...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-destructive'>Có lỗi xảy ra: {error}</div>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4'>
      {courses && courses.length > 0 && courses.map((course) => <CourseCard key={course.id} course={course} />)}
    </div>
  )
}

export default CourseGrid
