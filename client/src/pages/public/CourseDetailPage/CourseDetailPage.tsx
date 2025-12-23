import NotFound from '@/components/auth/not-found/NotFound'
import { ErrorState } from '@/components/common/error-state/ErrorState'
import { Loading } from '@/components/common/loading/Loading'
import { Button } from '@/components/ui/button'
import { useGetCourseBySlugQuery } from '@/services/api/courseApi'
import { useEnrollCourseMutation } from '@/services/api/enrollmentApi'
import { skipToken, useAppSelector } from '@/store/hook'
import { formatLevel } from '@/utils/format'
import { BarChart3, GraduationCap, Monitor } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import CourseCheckoutModal from './components/CourseCheckoutModal'
import CourseOutline from './components/CourseOutline'

const CourseDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isOpenCheckoutModal, setIsOpenCheckoutModal] = useState(false)

  const {
    data,
    isFetching: getCourseIsFetching,
    isError: getCourseIsError,
    refetch
  } = useGetCourseBySlugQuery(slug ?? skipToken)
  const courseData = data?.data
  const totalSections = courseData?.sections ? courseData.sections.length : 0
  const totalLessons =
    courseData?.sections && courseData?.sections.reduce((acc, section) => acc + section.lessons!.length, 0)
  const [enrollCourseApi, { isLoading: isEnrolling }] = useEnrollCourseMutation()

  const handleEnrollCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đăng ký khóa học')
      return
    }
    if (courseData?.isPaid) {
      // Mở modal thanh toán
      setIsOpenCheckoutModal(true)
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

  if (getCourseIsFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading message='Đang tải khóa học...' />
      </div>
    )
  }
  if (getCourseIsError) {
    return (
      <div className='text-red-500'>
        <ErrorState onRetry={refetch} message='Có lỗi xảy ra khi tải khóa học' />
      </div>
    )
  }

  if (!courseData) {
    return (
      <div>
        <NotFound
          title='Khóa học không tồn tại'
          subTitle='Khóa học bạn đang tìm kiếm không tồn tại. Vui lòng chọn khóa học khác.'
        />
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-row items-start justify-between p-10'>
        <div className='flex-[4]'>
          <div className='min-h-screen'>
            <h1 className='text-3xl font-bold'>{courseData?.title || 'Thông tin khóa học'}</h1>
            <div
              className='prose max-w-none' // dùng tailwind-typography để format đẹp
              dangerouslySetInnerHTML={{ __html: courseData.description! }}
            />
            {/* <p className='mt-2 text-muted-foreground'>{courseData?.description || 'Không có mô tả.'}</p> */}
            <CourseOutline courseData={courseData} totalSections={totalSections} totalLessons={totalLessons} />
          </div>
        </div>

        <div className='sticky top-0 flex flex-[2] flex-col items-center justify-center gap-4 p-6'>
          {/* Thumbnail */}
          <div className='h-[300px] w-[400px] overflow-hidden rounded-lg'>
            <img
              src={courseData?.thumbnail || '/path/to/default-thumbnail.jpg'}
              alt={courseData?.title}
              className='h-full w-full rounded-lg object-cover'
            />
          </div>

          <h3 className='text-center text-2xl font-semibold text-primary'>
            {courseData?.isPaid === true ? `${(courseData?.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
          </h3>

          {courseData?.isEnrolled ? (
            <Button className='w-48' disabled={isEnrolling} onClick={() => slug && handleNavigateToStudy(slug)}>
              VÀO HỌC
            </Button>
          ) : (
            <Button
              className='w-48'
              disabled={isEnrolling}
              isLoading={isEnrolling}
              onClick={() => courseData && handleEnrollCourse(courseData.courseId)}
            >
              ĐĂNG KÝ HỌC
            </Button>
          )}

          <div className='mt-4 flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <BarChart3 className='h-5 w-5 text-gray-600' />
              <span className='text-sm'>Trình độ {formatLevel(courseData?.level)}</span>
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
      {isOpenCheckoutModal && (
        <CourseCheckoutModal
          open={isOpenCheckoutModal}
          onClose={() => setIsOpenCheckoutModal(false)}
          course={courseData}
        />
      )}
    </>
  )
}

export default CourseDetailPage
