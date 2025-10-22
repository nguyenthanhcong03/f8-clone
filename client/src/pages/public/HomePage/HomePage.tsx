import CourseCard from '@/components/common/CourseCard/CourseCard'
import { useGetAllCoursesQuery } from '@/store/api/courseApi'
import AdSlider from './components/AdSlider'
import Loader from '@/components/common/Loading/Loader'

const HomePage = () => {
  // Sử dụng RTK Query hook để lấy danh sách khóa học
  const { data: courses, isLoading, error } = useGetAllCoursesQuery()

  // Xử lý trường hợp đang tải dữ liệu
  if (isLoading) {
    return <Loader />
  }

  // Xử lý trường hợp có lỗi
  if (error) {
    return <div className='p-4 text-red-500'>Có lỗi xảy ra khi tải danh sách khóa học</div>
  }

  return (
    <div className='w-full'>
      <AdSlider />

      <div className='mt-6 px-4 md:px-8'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {courses && courses.map((course) => <CourseCard key={course.course_id} course={course} />)}
        </div>
      </div>
    </div>
  )
}

export default HomePage
