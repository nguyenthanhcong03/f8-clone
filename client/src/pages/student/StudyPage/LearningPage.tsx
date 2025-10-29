import { useGetCourseBySlugQuery } from '@/store/api/courseApi'
import { useGetLessonByIdQuery } from '@/store/api/lessonApi'
import { skipToken } from '@/store/hook'
import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import LessonContent from './components/LessonContent'
import LessonSidebar from './components/LessonSidebar'
import AppLoader from '@/components/common/Loading/AppLoader'
import LearningHeader from './components/LearningHeader'

const LearningPage = () => {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const lessonId = params.get('lessonId')

  // Sử dụng RTK Query để lấy thông tin khóa học theo slug
  const {
    data: courseData,
    isLoading: getCourseIsLoading,
    isError: getCourseIsError
  } = useGetCourseBySlugQuery(slug ?? skipToken)

  // Lấy thông tin bài học hiện tại
  const { data: lessonData, isLoading: lessonIsLoading } = useGetLessonByIdQuery(lessonId ?? skipToken)

  const isLoading = getCourseIsLoading || (lessonId && lessonIsLoading)

  // Tự động chọn bài học đầu tiên nếu chưa có bài học nào được chọn
  // và khóa học đã được tải
  useEffect(() => {
    if (!params.get('lessonId') && courseData?.sections?.length && courseData?.sections[0].lessons?.length) {
      setParams({ lessonId: String(courseData.sections[0].lessons[0].lessonId) })
    }
  }, [courseData, params, setParams])

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return <AppLoader />
  }

  // Hiển thị lỗi nếu có
  if (getCourseIsError) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500'>Có lỗi xảy ra</h2>
          <p className='mt-2'>Không thể tải thông tin khóa học. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className='flex h-screen flex-col'>
      {/* Header */}
      <LearningHeader title={courseData?.title} />

      {/* Main Content */}
      <div className='relative flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <nav
          className={`h-full bg-white transition-all duration-300 ${mobileOpen ? 'absolute left-0 top-0 z-50 block w-full shadow-lg' : 'hidden'} lg:relative lg:block lg:w-[23%]`}
        >
          <LessonSidebar
            params={params}
            setParams={setParams}
            handleDrawerToggle={handleDrawerToggle}
            courseData={courseData}
            lessonData={lessonData}
          />
        </nav>

        {/* Overlay khi mở sidebar trên mobile */}
        {mobileOpen && <div onClick={handleDrawerToggle} className='fixed inset-0 z-40 bg-black/30 lg:hidden' />}

        {/* Lesson Content */}
        <main className='flex-1 overflow-auto'>
          <LessonContent handleDrawerToggle={handleDrawerToggle} />
        </main>
      </div>
    </div>
  )
}

export default LearningPage
