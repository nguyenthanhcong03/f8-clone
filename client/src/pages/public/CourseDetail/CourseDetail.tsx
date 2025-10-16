import AppLoader from '@/components/common/Loading/AppLoader'
import { Button } from '@/components/ui/button'
import { fetchCourseBySlug } from '@/store/features/courses/courseSlice'
import { checkEnrollment, enrollCourse } from '@/store/features/courses/enrollmentSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import { translateLevel } from '@/utils/courseUtils'
import { BarChart3, GraduationCap, Monitor } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CourseOutline from './components/CourseOutline'

const CourseDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentCourse, loading } = useAppSelector((state) => state.courses)
  console.log('🚀 ~ CourseDetail.tsx:18 ~ CourseDetail ~ currentCourse:', currentCourse)

  const { loading: enrollCourseLoading } = useAppSelector((state) => state.enrollment)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const totalSections = currentCourse?.sections ? currentCourse.sections.length : 0
  const totalLessons =
    currentCourse?.sections && currentCourse?.sections.reduce((acc, section) => acc + section.lessons!.length, 0)

  const handleEnrollCourse = (slug: string) => {
    if (!isAuthenticated) {
      dispatch(
        showSnackbar({
          message: 'Vui lòng đăng nhập để đăng ký khóa học',
          severity: 'warning'
        })
      )
      return
    }
    dispatch(enrollCourse(slug))
  }

  const handleNavigateToStudy = async (slug: string) => {
    if (currentCourse?.isEnrolled) {
      navigate(`/learning/${slug}`)
    } else {
      dispatch(
        showSnackbar({
          message: 'Vui lòng đăng nhập',
          severity: 'error'
        })
      )
    }
  }

  useEffect(() => {
    if (slug) {
      dispatch(fetchCourseBySlug(slug))
    }
  }, [dispatch, slug])

  if (loading) {
    return <AppLoader />
  }

  return (
    <div className='flex flex-row gap-4 items-start'>
      {/* Left */}
      <div className='flex-[4] overflow-y-auto scrollbar-none'>
        <div className='min-h-screen'>
          <h1 className='text-3xl font-bold'>{currentCourse?.title || 'Thông tin khóa học'}</h1>
          <p className='mt-2 text-muted-foreground'>{currentCourse?.description || 'Không có mô tả.'}</p>
          <div className='mt-6'>
            <div className='mb-4'>
              <h2 className='text-xl font-bold'>Nội dung khóa học</h2>
              <div className='mt-2 text-sm flex gap-2'>
                <div>
                  <span className='font-medium'>{totalSections} </span>
                  chương
                </div>
                •
                <div>
                  <span className='font-medium'>{totalLessons || 0} </span>
                  bài học
                </div>
              </div>
            </div>
            <CourseOutline />
          </div>
        </div>
      </div>
      {/* Right */}
      <div className='flex-[2] p-6 flex flex-col justify-center items-center gap-4 sticky top-0'>
        {/* Thumbnail */}
        <div className='overflow-hidden rounded-lg w-full'>
          <img
            src={currentCourse?.thumbnail || '/path/to/default-thumbnail.jpg'}
            alt={currentCourse?.title}
            className='w-full h-full object-cover rounded-lg'
          />
        </div>

        {/* Price */}
        <h3 className='text-2xl text-center text-primary font-semibold'>
          {currentCourse?.is_paid === true ? `${(currentCourse?.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </h3>

        {currentCourse?.isEnrolled ? (
          <Button
            variant='secondary'
            className='w-48'
            disabled={enrollCourseLoading}
            onClick={() => slug && handleNavigateToStudy(slug)}
          >
            VÀO HỌC
          </Button>
        ) : (
          <Button
            variant='secondary'
            className='w-48'
            disabled={enrollCourseLoading}
            onClick={() => slug && handleEnrollCourse(slug)}
          >
            ĐĂNG KÝ HỌC
          </Button>
        )}

        {/* Course stats */}
        <div className='flex flex-col gap-2 mt-4'>
          <div className='flex items-center gap-3'>
            <BarChart3 className='text-gray-600 h-5 w-5' />
            <span className='text-sm'>Trình độ {translateLevel(currentCourse?.level)}</span>
          </div>

          <div className='flex items-center gap-3'>
            <GraduationCap className='text-gray-600 h-5 w-5' />
            <span className='text-sm'>Tổng số {totalLessons || 0} bài học</span>
          </div>

          <div className='flex items-center gap-3'>
            <Monitor className='text-gray-600 h-5 w-5' />
            <span className='text-sm'>Học mọi lúc, mọi nơi</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
