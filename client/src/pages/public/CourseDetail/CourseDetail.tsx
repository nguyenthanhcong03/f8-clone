import AppLoader from '@/components/common/Loading/AppLoader'
import { Button } from '@/components/ui/button'
import { useGetCourseBySlugQuery } from '@/store/api/courseApi'
import { useEnrollCourseMutation } from '@/store/api/enrollmentApi'
import { skipToken, useAppSelector } from '@/store/hook'
import { translateLevel } from '@/utils/courseUtils'
import { BarChart3, GraduationCap, Monitor } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import CourseOutline from './components/CourseOutline'

const CourseDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // Sử dụng RTK Query để lấy thông tin khóa học
  const { data: courseData, isLoading: getCourseIsLoading, refetch } = useGetCourseBySlugQuery(slug ?? skipToken)
  // Mutation để đăng ký khóa học
  const [enrollCourseApi, { isLoading: isEnrolling }] = useEnrollCourseMutation()

  const totalSections = courseData?.sections ? courseData.sections.length : 0
  const totalLessons =
    courseData?.sections && courseData?.sections.reduce((acc, section) => acc + section.lessons!.length, 0)

  const handleEnrollCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đăng ký khóa học')
      return
    }
    try {
      await enrollCourseApi(courseId).unwrap()
      toast.success('Đăng ký khóa học thành công')
      // Refetch để cập nhật trạng thái đăng ký
      refetch()
    } catch {
      toast.error('Đăng ký khóa học thất bại, vui lòng thử lại')
    }
  }

  const handleNavigateToStudy = async (slug: string) => {
    if (courseData?.isEnrolled) {
      navigate(`/learning/${slug}`)
    } else {
      toast.error('Vui lòng đăng ký khóa học để bắt đầu học')
    }
  }

  if (getCourseIsLoading) {
    return <AppLoader />
  }

  return (
    <div className='flex flex-row items-start gap-4'>
      {/* Left */}
      <div className='scrollbar-none flex-[4] overflow-y-auto'>
        <div className='min-h-screen'>
          <h1 className='text-3xl font-bold'>{courseData?.title || 'Thông tin khóa học'}</h1>
          <p className='mt-2 text-muted-foreground'>{courseData?.description || 'Không có mô tả.'}</p>
          <CourseOutline courseData={courseData} totalSections={totalSections} totalLessons={totalLessons} />
        </div>
      </div>
      {/* Right */}
      <div className='sticky top-0 flex flex-[2] flex-col items-center justify-center gap-4 p-6'>
        {/* Thumbnail */}
        <div className='w-full overflow-hidden rounded-lg'>
          <img
            src={courseData?.thumbnail || '/path/to/default-thumbnail.jpg'}
            alt={courseData?.title}
            className='h-full w-full rounded-lg object-cover'
          />
        </div>

        {/* Price */}
        <h3 className='text-center text-2xl font-semibold text-primary'>
          {courseData?.is_paid === true ? `${(courseData?.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </h3>

        {courseData?.isEnrolled ? (
          <Button
            variant='secondary'
            className='w-48'
            disabled={isEnrolling}
            onClick={() => slug && handleNavigateToStudy(slug)}
          >
            VÀO HỌC
          </Button>
        ) : (
          <Button
            variant='secondary'
            className='w-48'
            disabled={isEnrolling}
            isLoading={isEnrolling}
            onClick={() => courseData && handleEnrollCourse(courseData.course_id)}
          >
            ĐĂNG KÝ HỌC
          </Button>
        )}

        {/* Course stats */}
        <div className='mt-4 flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <BarChart3 className='h-5 w-5 text-gray-600' />
            <span className='text-sm'>Trình độ {translateLevel(courseData?.level)}</span>
          </div>

          <div className='flex items-center gap-3'>
            <GraduationCap className='h-5 w-5 text-gray-600' />
            <span className='text-sm'>Tổng số {totalLessons || 0} bài học</span>
          </div>

          <div className='flex items-center gap-3'>
            <Monitor className='h-5 w-5 text-gray-600' />
            <span className='text-sm'>Học mọi lúc, mọi nơi</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
