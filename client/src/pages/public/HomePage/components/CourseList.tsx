import CourseCard from '@/components/common/CourseCard/CourseCard'
import { ErrorState } from '@/components/common/ErrorState/ErrorState'
import { Loading } from '@/components/common/Loading/Loading'
import { NoData } from '@/components/common/NoData/NoData'
import { Button } from '@/components/ui/button'
import { useGetAllCoursesQuery } from '@/store/api/courseApi'

const CourseList = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetAllCoursesQuery({
    page: 1,
    limit: 12,
    sort: 'createdAt',
    order: 'desc'
  })

  if (isLoading || isFetching) {
    return <Loading />
  }

  const courses = data?.data?.data

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }
  return (
    <>
      {courses && courses.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {courses.map((course) => (
            <CourseCard key={course.courseId} course={course} />
          ))}
        </div>
      ) : (
        <NoData
          message='Chưa có sản phẩm nào'
          subMessage='Bạn có thể thêm sản phẩm mới ngay bây giờ'
          action={<Button onClick={refetch}>Làm mới</Button>}
        />
      )}
    </>
  )
}

export default CourseList
