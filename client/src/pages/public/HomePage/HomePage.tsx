import CourseCard from '@/components/common/CourseCard/CourseCard'
import { fetchCourses } from '@/store/features/courses/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdSlider from './components/AdSlider'
import Loader from '@/components/common/Loading/Loader'

const HomePage = () => {
  const { courses, loading, error } = useAppSelector((state) => state.courses)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const getCourses = async () => {
      await dispatch(fetchCourses())
    }
    getCourses()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='w-full'>
      <AdSlider />

      <div className='mt-6 px-4 md:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {courses.map((course) => (
            <CourseCard key={course.course_id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
