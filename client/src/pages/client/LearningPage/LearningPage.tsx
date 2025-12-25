import AppLoader from '@/components/common/loading/AppLoader'
import { useGetCourseBySlugQuery } from '@/services/api/courseApi'
import { useGetLessonByIdQuery } from '@/services/api/lessonApi'
import { skipToken } from '@/store/hook'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import LearningHeader from './components/LearningHeader'
import LessonContent from './components/LessonContent'
import LessonSidebar from './components/LessonSidebar'

const LearningPage = () => {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const lessonId = params.get('lessonId')

  const {
    data: courseData,
    isLoading: getCourseIsLoading,
    isError: getCourseIsError
  } = useGetCourseBySlugQuery(slug ?? skipToken)
  const { data: lessonData, isLoading: lessonIsLoading } = useGetLessonByIdQuery(lessonId ?? skipToken)
  const currentCourse = courseData?.data
  const currentLesson = lessonData?.data
  const isLoading = getCourseIsLoading || (lessonId && lessonIsLoading)

  // Tự động chọn bài học đầu tiên nếu chưa có bài học nào được chọn
  // và khóa học đã được tải
  useEffect(() => {
    if (!params.get('lessonId') && currentCourse?.sections?.length && currentCourse?.sections[0].lessons?.length) {
      setParams({ lessonId: String(currentCourse.sections[0].lessons[0].lessonId) })
    }
  }, [currentCourse, params, setParams])

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
      <LearningHeader title={currentCourse?.title} />

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
            currentCourse={currentCourse}
            currentLesson={currentLesson}
          />
        </nav>

        {/* Overlay khi mở sidebar trên mobile */}
        {mobileOpen && <div onClick={handleDrawerToggle} className='fixed inset-0 z-40 bg-black/30 lg:hidden' />}

        {/* Lesson Content */}
        <main className='flex-1 overflow-auto'>
          <LessonContent
            handleDrawerToggle={handleDrawerToggle}
            currentCourse={currentCourse!}
            currentLesson={currentLesson!}
            setParams={setParams}
          />
        </main>
      </div>
    </div>
  )
}

export default LearningPage
